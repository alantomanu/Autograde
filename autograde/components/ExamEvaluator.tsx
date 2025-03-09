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
import { ClassNameStep } from './ClassNameStep'
import { AnswerKeyData } from '../types'
import { DownloadTemplateButton } from './ui/DownloadTemplateButton'

const steps = [
  'Enter Student ID',
  'Upload Answer Sheet',
  'Review Answers',
  'Upload Answer Key',
  'View Scores',
  'Submit'
]

interface UploadedFile {
  url: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

interface EvaluationResult {
  questionNumber: string;
  mark: string;
  adjustedMark: string;
  reason: string;
  justification: string;
  hasDiagram: boolean;
  evaluationMethod: string;
  diagramMarks: number;
}

interface EvaluationResponse {
  success: boolean;
  timestamp: string;
  results: EvaluationResult[];
  summary: {
    totalQuestions: number;
    totalMarks: string;
    percentage: number;
  };
}

export default function ExamEvaluator() {
  const [currentStep, setCurrentStep] = useState(0)
  const [studentId, setStudentId] = useState('')
  const [className, setClassName] = useState('')
  const [uploadedAnswerSheet, setUploadedAnswerSheet] = useState<UploadedFile | null>(null);
  const [uploadedAnswerKey, setUploadedAnswerKey] = useState<UploadedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState<string>('')
  const [continueChecked, setContinueChecked] = useState(false)
  const [extractedText, setExtractedText] = useState<{ marginNumber: string; answer: string }[]>([])
  const [isProcessed, setIsProcessed] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [processError, setProcessError] = useState<string | null>(null);
  const [answerKeyData, setAnswerKeyData] = useState<AnswerKeyData | null>(null);
  const [evaluationData, setEvaluationData] = useState<EvaluationResponse | null>(null);

  /** ✅ RESET FUNCTIONS for Upload Components */
  const resetAnswerSheetUpload = () => setUploadedAnswerSheet(null);
  const resetAnswerKeyUpload = () => setUploadedAnswerKey(null);

  /** ✅ API PROCESSING FUNCTION */
  const processAnswerSheet = useCallback(async (pdfUrl: string, forceReprocess = false) => {
    if (!pdfUrl) return;

    setIsProcessing(true);
    try {
      let currentImageUrl = imageUrl;

      if (!forceReprocess) {
        console.log('Starting first API call - Stitch PDF');
        setProcessingStep('Stitching PDF pages...');
        
        const stitchResponse = await fetch('http://localhost:5000/stitch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pdfUrl }),
        });

        if (!stitchResponse.ok) throw new Error('Failed to stitch PDF');

        const stitchData = await stitchResponse.json();
        currentImageUrl = stitchData.imageUrl;
        setImageUrl(currentImageUrl);
      }

      if (forceReprocess || !isProcessed) {
        console.log('Starting second API call - Process Image');
        setProcessingStep('Recognizing text...');

        const processResponse = await fetch('http://localhost:5000/process-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: currentImageUrl || imageUrl }),
        });

        if (!processResponse.ok) throw new Error('Failed to process image');

        const processData = await processResponse.json();
        setExtractedText(processData.answers);
      }

      setIsProcessed(true);

    } catch (error) {
      console.error('Error in processAnswerSheet:', error);
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  }, [imageUrl, isProcessed]);

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
  const handleExtractAgain = async () => {
    if (imageUrl) {
      await processAnswerSheet(imageUrl, true);
    }
  };
  const evaluateAnswers = async () => {
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

      if (!response.ok) throw new Error('Failed to evaluate answers');

      setEvaluationData(data);
    } catch (error) {
      console.error('Error evaluating answers:', error);
    }
  };
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <StudentIDStep studentId={studentId} setStudentId={setStudentId} />;
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
                setProcessError(null);
              }}
            />
          </div>
        );
      case 4:
        return (
          <ViewScoresStep 
            evaluationData={evaluationData} 
            setEvaluationData={setEvaluationData}
          />
        );
      case 5:
        return <ClassNameStep className={className} setClassName={setClassName} />;
      default:
        return null;
    }
  }
  const handleNextStep = () => {
    const nextStep = Math.min(currentStep + 1, steps.length - 1);
    if (currentStep === 3 && nextStep === 4) {
      evaluateAnswers();
    }
    setCurrentStep(nextStep);
    window.scrollTo(0, 0);
  };
  return (
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
        <div className="flex justify-between mt-6">
          <Button variant="secondary" onClick={() => {
            setCurrentStep(prev => Math.max(prev - 1, 0));
            window.scrollTo(0, 0);
          }} disabled={currentStep === 0}>
            Back
          </Button>
          <Button 
            onClick={handleNextStep}
            disabled={
              (currentStep === 3 && (!uploadedAnswerKey || !answerKeyData || !!processError)) ||
              (currentStep === 4 && !answerKeyData)
            }
          >
            Next
          </Button>
        </div>
      </Card>
    </div>
  )
}
