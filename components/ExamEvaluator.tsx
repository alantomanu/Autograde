'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Progress } from './ui/progress'
import { StudentIDStep } from './StudentIDStep'
import { AnswerSheetUploadStep } from './AnswerSheetUploadStep'
import { AnswerSheetPreviewStep } from './AnswerSheetPreviewStep'
import { AnswerKeyUploadStep, AnswerKeyUploadStepRef } from './AnswerKeyUploadStep'
import { ViewScoresStep } from './ViewScoresStep'
import { AnswerKeyData, EvaluationResponse, EvaluationResult } from '../types'
import { DownloadTemplateButton } from './ui/DownloadTemplateButton'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ReevaluationDialog } from './ReevaluationDialog'
import { BorderBeam } from "@/components/magicui/border-beam";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { RecentAnswerKeys } from './RecentAnswerKeys'
import { AnswerKeyHistory } from './AnswerKeyHistory'
import { config } from '../config'

const steps = [
  'Enter Student ID',
  'Upload Answer Sheet',
  'Review Answers',
  'Upload Answer Key',
  'View Scores'
]

interface UploadedFile {
  url: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
}


interface ExistingScore {
  totalMarks: number;
  maxMarks: number;
  percentage: number;
}


type CustomRouter = {
  push: (url: string) => void;

};


const AnalyticsToast = ({ closeToast, router }: { closeToast: () => void, router: CustomRouter }) => (
  <div>
    New score saved successfully. You can view the detailed score report{' '}
    <a
      href="/analytics"
      onClick={(e) => {
        e.preventDefault();
        closeToast();
        router.push('/analytics');
      }}
      style={{ color: '#1E40AF', textDecoration: 'underline' }}
    >
      here
    </a>.
  </div>
);

interface ReevaluationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReeval: () => void;
  onUpdateScore: () => void;
  step: 'initial' | 'update' | 'enterNewId';
  existingScore: ExistingScore | null;
  message: string;
  newStudentId: string;
  setNewStudentId: (id: string) => void;
  onNewStudentIdSubmit: () => void;
  setReevalStep: (step: 'initial' | 'update' | 'enterNewId') => void;
}

export default function ExamEvaluator() {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(0)
  const [studentId, setStudentId] = useState('')
  const [uploadedAnswerSheet, setUploadedAnswerSheet] = useState<UploadedFile | null>(null);
  const [uploadedAnswerKey, setUploadedAnswerKey] = useState<UploadedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState<string>('')
  const [showAnalyticsButton, setShowAnalyticsButton] = useState(false)
  const [continueChecked, setContinueChecked] = useState(false)
  const [extractedText, setExtractedText] = useState<{ marginNumber: string; answer: string }[]>([])
  const [isProcessed, setIsProcessed] = useState(false);
  const [answerKeyData, setAnswerKeyData] = useState<AnswerKeyData | null>(null);
  const [evaluationData, setEvaluationData] = useState<EvaluationResponse | null>(null);
  const [courseId, setCourseId] = useState('');
  const [courseName, setCourseName] = useState('');
  const [isMarksSaved, setIsMarksSaved] = useState(false);
  const [showReevalDialog, setShowReevalDialog] = useState(false);
  const [reevalStep, setReevalStep] = useState<'initial' | 'update' | 'enterNewId'>('initial');
  const [existingScore, setExistingScore] = useState<ExistingScore | null>(null);
  const [newStudentId, setNewStudentId] = useState('');
  const router = useRouter();
  const [showBackground, setShowBackground] = useState(true);
  const answerKeyUploadRef = useRef<AnswerKeyUploadStepRef>(null);

 
  const resetAnswerSheetUpload = () => setUploadedAnswerSheet(null);
  const resetAnswerKeyUpload = () => setUploadedAnswerKey(null);

  const processAnswerSheet = useCallback(async (pdfUrl: string) => {
    if (!pdfUrl) return;

    setIsProcessing(true);
    try {
      console.log('Starting OCR processing');
      setProcessingStep('');
      
      const processResponse = await fetch(`${config.api.baseUrl}/perform-ocr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfUrl }),
      });

      if (!processResponse.ok) {
        setProcessingStep('Failed to process document');
        return;
      }

      const processData = await processResponse.json();
      setExtractedText(processData.answers);
      setIsProcessed(true);

    } catch (error) {
      console.error('Error in processAnswerSheet:', error);
      setProcessingStep('An error occurred while processing the answer sheet');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  }, []);


  useEffect(() => {
    if (currentStep === 2 && uploadedAnswerSheet?.url && !isProcessed) {
      console.log('Calling processAnswerSheet once...');
      processAnswerSheet(uploadedAnswerSheet.url);
      setIsProcessed(true);
    }
  }, [currentStep, uploadedAnswerSheet?.url, isProcessed, processAnswerSheet]); 

  const handleAnswerSheetUpload = (url: string, file: File) => {
    setShowBackground(false);
    setUploadedAnswerSheet({
      url,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    });
    setIsProcessed(false);
    setTimeout(() => {
      setShowBackground(true);
    }, 8000);
  };

  const handleAnswerKeyUpload = (url: string, file: File) => {
    setShowBackground(false);
    setEvaluationData(null);
    setUploadedAnswerKey({
      url,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });
    setTimeout(() => {
      setShowBackground(true);
    }, 8000);
  };

  const handleAnswerKeySelect = async (url: string) => {
    setShowBackground(false);
    setEvaluationData(null);
    
    
    const mockFile = {
      name: 'Previous Answer Key',
      size: 0,
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      lastModified: Date.now()
    };

    setUploadedAnswerKey({
      url,
      ...mockFile
    });

    // Process the selected answer key
    try {
      await answerKeyUploadRef.current?.processAnswerKey(url);
    } catch (error) {
      console.error('Error processing selected answer key:', error);
    }

   
    try {
      await fetch('/api/answer-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: session?.user?.teacherId,
          answerKeyUrl: url
        })
      });
    } catch (error) {
      console.error('Error caching reused answer key:', error);
    }

    setTimeout(() => {
      setShowBackground(true);
    }, 8000);
  };

  const handleExtractAgain = useCallback(async () => {
    if (uploadedAnswerSheet?.url) {
      setShowBackground(false);
      setIsProcessed(false);
      await processAnswerSheet(uploadedAnswerSheet.url);
      setTimeout(() => {
        setShowBackground(true);
      }, 8000);
    }
  }, [uploadedAnswerSheet?.url, processAnswerSheet]);

  const handleEvaluate = async () => {
    if (!extractedText || !answerKeyData) return;

    try {
      const response = await fetch(`${config.api.baseUrl}/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: extractedText,
          key: answerKeyData,
        }),
      });

      const data = await response.json();
      console.log("Evaluation API Response:", data);

      if (!response.ok) {
        setProcessingStep('Failed to evaluate answers');
        return; 
      }


      if (!Array.isArray(data.results)) {
        setProcessingStep('Invalid results format');
        return; 
      }

      const evaluationResult = {
        success: true,
        timestamp: new Date().toISOString(),
        studentId: studentId,
        courseId: courseId,
        results: data.results.map((result: EvaluationResult) => {
          const [received, total] = result.mark.split('/').map(Number);
          return {
            ...result,
            maxMark: total, 
            feedback: {
              ...result.feedback,
              mark: received,
              maxMark: total,
              questionNumber: result.questionNumber,
              reason: result.reason || ''
            }
          };
        }),
        summary: data.summary,
        cloudinaryUrl: uploadedAnswerSheet?.url
      };

      setEvaluationData(evaluationResult);
    } catch (error) {
      console.error('Error evaluating answers:', error);
      setProcessingStep('An error occurred while evaluating the answers');
    }
  };

  const handleNextStep = async () => {
    const scrollToTop = () => {
      const evaluatorSection = document.getElementById('evaluator-section');
      if (evaluatorSection) {
        evaluatorSection.scrollIntoView({ behavior: 'smooth' });
      }
    };

    if (currentStep === 0) {
      if (!studentId || !courseId || !courseName) {
        setProcessingStep('Please fill in all required fields');
        return;
      }

      try {
        const teacherId = session?.user?.teacherId;

        if (!teacherId) {
          setProcessingStep('No teacher ID found. Please log in again.');
          return;
        }

        setProcessingStep('Verifying course details...');
        setIsProcessing(true);

        const response = await fetch('/api/courses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            courseId,
            courseName,
            teacherId,
          }),
        });

        const data = await response.json();
        console.log('Response received:', data);

        if (data.status === 'name_mismatch') {
          setProcessingStep(`This course exists with name: ${data.existingName}`);
          setIsProcessing(false);
          return;
        }

        
        if (data.status === 'success' || data.status === 'exists') {
          setProcessingStep('Course verified successfully!');
          setTimeout(() => {
            setProcessingStep('');
            setIsProcessing(false);
            const nextStep = Math.min(currentStep + 1, steps.length - 1);
            setCurrentStep(nextStep);
            scrollToTop();
          }, 1000);
          return;
        }

        setProcessingStep(data.message || 'Verification failed. Please try again.');
        setIsProcessing(false);

      } catch (error) {
        console.error('Error:', error);
        setProcessingStep('An error occurred. Please try again.');
        setIsProcessing(false);
      }
    } else if (currentStep === 2 && !continueChecked) {
      setProcessingStep('Please verify the digital answer sheet before continuing');
      return;
    } else if (currentStep === 4) {
      try {
        setIsProcessing(true);
        setProcessingStep('Checking existing scores...');

        if (!evaluationData) {
          throw new Error('No evaluation data available');
        }

        const teacherId = session?.user?.teacherId;
        if (!teacherId) {
          setProcessingStep('No teacher ID found. Please log in again.');
          return;
        }

   
        const feedback = evaluationData.results.map(result => result.feedback);

        const response = await fetch('/api/scores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            studentId,
            courseId,
            totalMarks: evaluationData.summary.totalMarks.split('/')[0],
            maxMarks: evaluationData.summary.totalMarks.split('/')[1],
            percentage: evaluationData.summary.percentage,
            answerSheetUrl: uploadedAnswerSheet?.url,
            checkedByTeacherId: teacherId,
            feedback, 
          })
        });

        const data = await response.json();

        if (data.status === 'reevaluation') {
          setIsProcessing(false);
          setProcessingStep(data.message || 'Score already exists for this student');
          setExistingScore(data.existingScore);
          setShowReevalDialog(true);
          setReevalStep('initial');
          return;
        }

        setProcessingStep('New score saved successfully.');
        toast((t) => <AnalyticsToast closeToast={() => toast.dismiss(t.id)} router={router} />);
        setIsProcessing(false);
        
        // Keep the view in the evaluation section
        const evaluatorSection = document.getElementById('evaluator-section');
        if (evaluatorSection) {
          evaluatorSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        setProcessingStep('Score submitted successfully! You can view detailed analytics in Analytics');
        setShowAnalyticsButton(true);
        
        
        setTimeout(() => {
          setCurrentStep(0);
          resetAllData();
          setProcessingStep('');
          setShowAnalyticsButton(false);
        }, 9000);

      } catch {
        setIsProcessing(false);
        setProcessingStep('Error submitting score');
        toast.error('Failed to submit score');
      }
    } else {
      const nextStep = Math.min(currentStep + 1, steps.length - 1);
      if (currentStep === 3 && nextStep === 4) {
        handleEvaluate();
      }
      setCurrentStep(nextStep);
      scrollToTop();
    }
  };

  const handleDialogClose = () => {
    setShowReevalDialog(false);
    setReevalStep('initial');
    setCurrentStep(4);
  };

  const handleReevalConfirm = () => {
    setReevalStep('update');
  };

  const resetAllData = () => {
    setStudentId('');
    setCourseId('');
    setCourseName('');
    setUploadedAnswerSheet(null);
    setUploadedAnswerKey(null);
    setExtractedText([]);
    setEvaluationData(null);
    setIsMarksSaved(false);
    setIsProcessed(false);
    setContinueChecked(false);
    setExistingScore(null);
    setNewStudentId('');
  };

  const handleUpdateScore = async () => {
    try {
      setProcessingStep('Updating existing score...');
      const response = await fetch('/api/scores', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          courseId,
          totalMarks: evaluationData?.summary.totalMarks.split('/')[0],
          maxMarks: evaluationData?.summary.totalMarks.split('/')[1],
          percentage: evaluationData?.summary.percentage,
          cloudinaryUrl: evaluationData?.cloudinaryUrl
        })
      });

      if (response.ok) {
        setProcessingStep('Score updated successfully');
        toast.success('Score updated successfully');
        router.push('/');
        setTimeout(() => {
          setCurrentStep(0);
          resetAllData();
        }, 8000);
      } else {
        const errorData = await response.json();
        setProcessingStep(errorData.message || 'Failed to update score');
        toast.error(errorData.message || 'Failed to update score');
      }
    } catch (err) {
      console.error('Error updating score:', err);
      setProcessingStep('Error updating score');
      toast.error('Failed to update score');
    } finally {
      setShowReevalDialog(false);
    }
  };

  const handleNewStudentIdSubmit = async () => {
    try {
      setProcessingStep('Saving new student ID...');
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: newStudentId,
          courseId,
          totalMarks: evaluationData?.summary.totalMarks.split('/')[0],
          maxMarks: evaluationData?.summary.totalMarks.split('/')[1],
          percentage: evaluationData?.summary.percentage,
          answerSheetUrl: uploadedAnswerSheet?.url,
          checkedByTeacherId: session?.user?.teacherId,
          feedback: evaluationData?.results.map(result => result.feedback),
        })
      });

      if (response.ok) {
        setProcessingStep('New score saved successfully');
        toast.success('New score submitted successfully');
        setShowReevalDialog(false);
        setReevalStep('initial');
        setCurrentStep(4);

        // Navigate back to case 0 after 5 seconds
        setTimeout(() => {
          setCurrentStep(0);
          resetAllData();
        }, 8000);
      } else {
        const errorData = await response.json();
        setProcessingStep(errorData.message || 'Failed to save new score');
        toast.error(errorData.message || 'Failed to save new score');
      }
    } catch (err) {
      console.error('Error saving new score:', err);
      setProcessingStep('Error saving new score');
      toast.error('Failed to save new score');
    }
  };

  const isStringProcessingStep = (step: string | React.ReactElement): step is string => {
    return typeof step === 'string';
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <StudentIDStep 
            studentId={studentId} 
            setStudentId={setStudentId} 
            courseId={courseId} 
            setCourseId={setCourseId} 
            courseName={courseName} 
            setCourseName={setCourseName} 
          />
        );
      case 1:
        return (
          <AnswerSheetUploadStep
            uploadedAnswerSheet={uploadedAnswerSheet}
            handleAnswerSheetUpload={handleAnswerSheetUpload}
            resetUpload={resetAnswerSheetUpload}
          />
        );
      case 2:
        return (
          <AnswerSheetPreviewStep
            isProcessing={isProcessing}
            extractedText={extractedText}
            continueChecked={continueChecked}
            setContinueChecked={(checked: boolean) => {
              setContinueChecked(checked);
              if (checked) {
                setProcessingStep(''); // Clear the message when checkbox is checked
              }
            }}
            handleExtractAgain={handleExtractAgain}
          />
        );
      case 3:
        return (
          <div className="relative space-y-6">
            <DownloadTemplateButton 
              templateUrl="https://res.cloudinary.com/dfivs4n49/raw/upload/v1742880576/answer_keys/ggp5o62ztwfngyasnu6g.docx"
              fileName="Answer_Key_Template.docx"
            />
            <AnswerKeyUploadStep
              ref={answerKeyUploadRef}
              uploadedAnswerKey={uploadedAnswerKey}
              handleAnswerKeyUpload={async (url: string, file: File) => {
                handleAnswerKeyUpload(url, file);
                
                // Cache the newly uploaded answer key
                try {
                  await fetch('/api/answer-keys', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      teacherId: session?.user?.teacherId,
                      answerKeyUrl: url
                    })
                  });
                } catch (error) {
                  console.error('Error caching answer key:', error);
                }
              }}
              resetUpload={() => {
                resetAnswerKeyUpload();
                setEvaluationData(null);
              }}
              onProcessingComplete={(data) => {
                setAnswerKeyData(data);
              }}
            />
            {session?.user?.teacherId && (
              <AnswerKeyHistory
                teacherId={session.user.teacherId}
                onSelect={handleAnswerKeySelect}
                currentUrl={uploadedAnswerKey?.url}
              />
            )}
          </div>
        );
      case 4:
        return (
          <ViewScoresStep 
            evaluationData={evaluationData} 
            setEvaluationData={setEvaluationData}
            setIsMarksSaved={setIsMarksSaved}
            isMarksSaved={isMarksSaved}
            processingStep={processingStep}
          />
        );
      default:
        return null;
    }
  }

  return (
    
    <div id="evaluator-section" className="container mx-auto px-4 py-8">
       
      <div className="max-w-5xl mx-auto p-6">
      
        <div className="mb-3">
          <div className="flex flex-wrap justify-between">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`text-center py-2 whitespace-nowrap ${currentStep === index ? 'font-bold text-gray-900' : 'text-gray-900 text-sm'}`}
              >
                {step}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / (steps.length - 1)) * 100} />
        </div>
        <Card className="relative p-6 overflow-hidden ">
          <div className="relative z-10">
            {renderStepContent()}
            <div className="mt-6">
              {processingStep && (
                <div className={`mb-4 text-center ${
                  processingStep.includes('Please fill') || 
                  processingStep.includes('exists with name') || 
                  processingStep.includes('Reevaluation check required')
                    ? 'text-amber-600 font-medium bg-amber-50 p-3 rounded-md border border-amber-200' 
                    : 'p-4 rounded-lg bg-gradient-to-r from-blue-50 via-white to-blue-50 border border-blue-100 shadow-sm backdrop-blur-sm'
                }`}>
                  <div className="flex flex-col items-center justify-center">
                    <span className={`font-medium ${
                      processingStep.includes('verified successfully') ? 'text-green-600' :
                      processingStep.includes('Verifying') ? 'text-blue-600' :
                      processingStep.includes('Analytics') ? 'text-indigo-600' :
                      'text-gray-600'
                    }`}>
                      {processingStep}
                    </span>
                    {showAnalyticsButton && (
                      <div className="text-center mt-4">
                        <Button 
                          onClick={() => router.push('/analytics')} 
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          View Analytics
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="flex justify-between">
                {currentStep > 0 && (
                  <Button 
                    variant="secondary" 
                    onClick={() => {
                      setShowBackground(false);
                      setCurrentStep(prev => Math.max(prev - 1, 0));
                      setProcessingStep('');
                      const evaluatorSection = document.getElementById('evaluator-section');
                      if (evaluatorSection) {
                        evaluatorSection.scrollIntoView({ behavior: 'smooth' });
                      }
                      setTimeout(() => {
                        setShowBackground(true);
                      }, 8000);
                    }} 
                    disabled={isProcessing}
                  >
                    Back
                  </Button>
                )}
                <div className="flex justify-end w-full">
                  <Button 
                    onClick={() => {
                      setShowBackground(false);
                      handleNextStep();
                      setTimeout(() => {
                        setShowBackground(true);
                      }, 8000);
                    }}
                    disabled={isProcessing}
                    className=" bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isProcessing ? 'Processing...' : currentStep === 4 ? 'Submit' : 'Next'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {showBackground && (
            <>
              <div className="absolute inset-0">
                <BackgroundBeamsWithCollision className="!h-full">
                  <div aria-hidden="true" />
                </BackgroundBeamsWithCollision>
              </div>
              <BorderBeam
                duration={6}
                size={700}
                className="from-transparent via-blue-500 to-transparent"
              />
              <BorderBeam
                duration={6}
                delay={3}
                size={700}
                className="from-transparent via-purple-500 to-transparent"
              />
            </>
          )}
        </Card>
      </div>
      <ReevaluationDialog
        isOpen={showReevalDialog}
        onClose={handleDialogClose}
        onConfirmReeval={handleReevalConfirm}
        onUpdateScore={handleUpdateScore}
        step={reevalStep}
        existingScore={existingScore}
        message={processingStep}
        newStudentId={newStudentId}
        setNewStudentId={setNewStudentId}
        onNewStudentIdSubmit={handleNewStudentIdSubmit}
        setReevalStep={setReevalStep}
      />
    </div>
  )
}
