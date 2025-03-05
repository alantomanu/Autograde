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


const steps = [
  'Enter Student ID',
  'Upload Answer Sheet',
  'Review Answer Sheet',
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

  // Add other properties if the API returns additional data


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

  // Define processAnswerSheet using useCallback
  const processAnswerSheet = useCallback(async (pdfUrl: string, forceReprocess = false) => {
    if (!pdfUrl) return;
    
    setIsProcessing(true);
    try {
      let currentImageUrl = imageUrl;
      
      if (!forceReprocess) {
        // First API call - Stitch PDF
        console.log('Starting first API call - Stitch PDF');
        console.log('Sending pdfUrl:', pdfUrl);
        
        setProcessingStep('Stitching PDF pages...');
        const stitchResponse = await fetch('http://localhost:5000/stitch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pdfUrl }),
        });

        if (!stitchResponse.ok) {
          throw new Error('Failed to stitch PDF');
        }

        const stitchData = await stitchResponse.json();
        console.log('First API response:', stitchData);
        currentImageUrl = stitchData.imageUrl; // Use local variable instead of state
        setImageUrl(currentImageUrl); // Update state
      }

      // Second API call - Process Image
      const imageUrlToProcess = currentImageUrl || imageUrl;
      if (imageUrlToProcess) {
        console.log('Starting second API call - Process Image');
        console.log('Sending imageUrl:', imageUrlToProcess);
        
        setProcessingStep('Recognizing text...');
        const processResponse = await fetch('http://localhost:5000/process-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageUrl: imageUrlToProcess }),
        });

        if (!processResponse.ok) {
          console.error('Process image response not OK:', processResponse.status);
          throw new Error('Failed to process image');
        }

        const processData = await processResponse.json();
        console.log('Second API response:', processData);
        const { answers } = processData;
        setExtractedText(answers);
      }

      setIsProcessed(true);

    } catch (error) {
      console.error('Error in processAnswerSheet:', error);
      // Handle error appropriately
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  }, [imageUrl]);

  // Update the useEffect with proper dependencies
  useEffect(() => {
    if (currentStep === 2 && uploadedAnswerSheet?.url && !isProcessed) {
      processAnswerSheet(uploadedAnswerSheet.url);
    }
  }, [currentStep, uploadedAnswerSheet?.url, isProcessed, processAnswerSheet]);

  // Handlers for file uploads
  const handleAnswerSheetUpload = (url: string, file: File) => {
    setUploadedAnswerSheet({
      url,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    });
  };

  const handleAnswerKeyUpload = (url: string, file: File) => {
    setUploadedAnswerKey({
      url,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });
  };

  // Update handleNext function
  const handleNext = () => {
    if (currentStep === 2 && !continueChecked) {
      // Don't proceed if checkbox isn't checked on step 2
      return;
    }
    
    // If we're on step 1 and don't have an answer sheet, don't proceed
    if (currentStep === 1 && !uploadedAnswerSheet) {
      return;
    }

    setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = () => {
    console.log('Submitting data...')
  }

  const handleExtractAgain = async () => {
    if (imageUrl) {
      await processAnswerSheet(imageUrl, true);
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
            resetUpload={() => {
              setUploadedAnswerSheet(null);
              setUploadedAnswerKey(null);
              setExtractedText([]);
              setIsProcessed(false);
              setImageUrl(null);
              setCurrentStep(1);
            }}
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
          <AnswerKeyUploadStep
            uploadedAnswerKey={uploadedAnswerKey}
            handleAnswerKeyUpload={handleAnswerKeyUpload}
            resetUpload={() => {
              setUploadedAnswerKey(null);
              setCurrentStep(3);
            }}
          />
        );
      case 4:
        return <ViewScoresStep />;
      case 5:
        return <ClassNameStep className={className} setClassName={setClassName} />;
      default:
        return null;
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 dark:bg-black light:bg-white">
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <span
              key={step}
              className={`text-sm ${index <= currentStep ? 'text-black dark:text-white' : 'text-gray-400'}`}
            >
              {step}
            </span>
          ))}
        </div>
        <Progress value={(currentStep / (steps.length - 1)) * 100} />
      </div>

      <Card className="p-6 bg-white dark:bg-gray-800">
        {renderStepContent()}

        <div className="flex justify-between mt-6">
          <Button
            variant="secondary"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit}>Submit Data to Database</Button>
          )}
        </div>
      </Card>
    </div>
  )
}