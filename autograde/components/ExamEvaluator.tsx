'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Progress } from './ui/progress'
import { StudentIDStep } from './StudentIDStep'
import { AnswerSheetUploadStep } from './AnswerSheetUploadStep'
import { AnswerSheetPreviewStep } from './AnswerSheetPreviewStep'
import { AnswerKeyUploadStep } from './AnswerKeyUploadStep'
import { ViewScoresStep } from './ViewScoresStep'
import { AnswerKeyData, EvaluationResponse, EvaluationResult } from '../types'
import { DownloadTemplateButton } from './ui/DownloadTemplateButton'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ReevaluationDialog } from './ReevaluationDialog'

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

// Define the interface for existing score
interface ExistingScore {
  totalMarks: number;
  maxMarks: number;
  percentage: number;
}

// Define a custom type for the router
type CustomRouter = {
  push: (url: string) => void;
  // Add other methods you might need from the router
};

// Custom Toast Component
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

export default function ExamEvaluator() {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(0)
  const [studentId, setStudentId] = useState('')
  const [uploadedAnswerSheet, setUploadedAnswerSheet] = useState<UploadedFile | null>(null);
  const [uploadedAnswerKey, setUploadedAnswerKey] = useState<UploadedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState<string>('')
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

  /** ✅ RESET FUNCTIONS for Upload Components */
  const resetAnswerSheetUpload = () => setUploadedAnswerSheet(null);
  const resetAnswerKeyUpload = () => setUploadedAnswerKey(null);

  /** ✅ API PROCESSING FUNCTION */
  const processAnswerSheet = useCallback(async (pdfUrl: string) => {
    if (!pdfUrl) return;

    setIsProcessing(true);
    try {
      console.log('Starting OCR processing');
      setProcessingStep('Recognizing text...');
      
      const processResponse = await fetch('http://localhost:5000/perform-ocr', {
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

  /** ✅ PREVENT MULTIPLE API CALLS */
  useEffect(() => {
    if (currentStep === 2 && uploadedAnswerSheet?.url && !isProcessed) {
      console.log('Calling processAnswerSheet once...');
      processAnswerSheet(uploadedAnswerSheet.url);
      setIsProcessed(true);
    }
  }, [currentStep, uploadedAnswerSheet?.url, isProcessed, processAnswerSheet]); // ✅ ADDED `processAnswerSheet`

  const handleAnswerSheetUpload = (url: string, file: File) => {
    setUploadedAnswerSheet({
      url,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    });
    setIsProcessed(false);
  };
  const handleAnswerKeyUpload = (url: string, file: File) => {
    setEvaluationData(null);
    setUploadedAnswerKey({
      url,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });
  };
  const handleExtractAgain = useCallback(async () => {
    if (uploadedAnswerSheet?.url) {
      setIsProcessed(false);
      await processAnswerSheet(uploadedAnswerSheet.url);
    }
  }, [uploadedAnswerSheet?.url, processAnswerSheet]);
  const handleEvaluate = async () => {
    if (!extractedText || !answerKeyData) return;

    try {
      const response = await fetch('http://localhost:5000/evaluate', {
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
        return; // Stop further processing
      }

      // Validate the structure of data.results
      if (!Array.isArray(data.results)) {
        setProcessingStep('Invalid results format');
        return; // Stop further processing
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
            maxMark: total, // Explicitly set maxMark from total
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
            resetUpload={resetAnswerSheetUpload} // ✅ FIXED: Added resetUpload
          />
        );
      case 2:
        return (
          <AnswerSheetPreviewStep
            isProcessing={isProcessing}
            processingStep={processingStep}
            extractedText={extractedText}
            continueChecked={continueChecked}
            setContinueChecked={setContinueChecked}
            handleExtractAgain={handleExtractAgain}
          />
        );
      case 3:
        return (
          <div className="relative">
            <DownloadTemplateButton 
              templateUrl="https://res.cloudinary.com/dfivs4n49/raw/upload/v1741369572/answer_keys/Answer_Key_Template.docx"
              fileName="Answer_Key_Template.docx"
            />
            <AnswerKeyUploadStep
              uploadedAnswerKey={uploadedAnswerKey}
              handleAnswerKeyUpload={handleAnswerKeyUpload}
              resetUpload={() => {
                resetAnswerKeyUpload();
                setEvaluationData(null);
              }}
              onProcessingComplete={(data) => {
                setAnswerKeyData(data);
              }}
            />
          </div>
        );
      case 4:
        return (
          <ViewScoresStep 
            evaluationData={evaluationData} 
            setEvaluationData={setEvaluationData}
            setIsMarksSaved={setIsMarksSaved}
            isMarksSaved={isMarksSaved}
          />
        );
      default:
        return null;
    }
  }
  const handleNextStep = async () => {
    if (currentStep === 0) {
      // Check if all fields are filled
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

        // If status is success or exists, proceed to next step
        if (data.status === 'success' || data.status === 'exists') {
          setProcessingStep('Course verified successfully!');
          setTimeout(() => {
            setProcessingStep('');
            setIsProcessing(false);
            const nextStep = Math.min(currentStep + 1, steps.length - 1);
            setCurrentStep(nextStep);
            window.scrollTo(0, 0);
          }, 1000);
          return;
        }

        // Handle any other status
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

        // Extract feedback from evaluationData
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
            feedback, // Include feedback in the request body
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
        router.push('/');
        
        setProcessingStep('You can view detailed analytics in Analytics');
        <Button 
          onClick={() => router.push('/analytics')} 
          size="sm"
          style={{ marginLeft: '5px' }}
        >
           Here
        </Button>
        setTimeout(() => {
          setCurrentStep(0); // Move to case 0 after 5 seconds
        }, 5000);

        // Clear all saved states
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
      window.scrollTo(0, 0);
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
        }, 5000);
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
        }, 5000);
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

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <div className="flex flex-wrap justify-between">
            {steps.map((step, index) => (
              <div
                key={index}
                className={` text-center py-2 whitespace-nowrap ${currentStep === index ? 'font-bold ' : 'text-gray-500 text-sm'}`}
              >
                {step}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / (steps.length - 1)) * 100} />
        </div>
        <Card className="p-6">
          {renderStepContent()}
          <div className="mt-6">
            {processingStep && (
              <div className={`mb-4 text-center ${
                processingStep.includes('Please fill') || 
                processingStep.includes('exists with name') || 
                processingStep.includes('Reevaluation check required')
                  ? 'text-amber-600 font-medium bg-amber-50 p-3 rounded-md border border-amber-200' 
                  : 'text-blue-600'
              }`}>
                {processingStep}
              </div>
            )}
            <div className="flex justify-between">
              {currentStep > 0 && (
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setCurrentStep(prev => Math.max(prev - 1, 0));
                    setProcessingStep('');
                    window.scrollTo(0, 0);
                  }} 
                  disabled={isProcessing}
                >
                  Back
                </Button>
              )}
              <div className="flex justify-end w-full">
                <Button 
                  onClick={handleNextStep}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : currentStep === 4 ? 'Submit' : 'Next'}
                </Button>
              </div>
            </div>
          </div>
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
    </>
  )
}
