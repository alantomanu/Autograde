'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Checkbox } from './ui/checkbox'
import { Card } from './ui/card'
import { Progress } from './ui/progress'
import { FileUpload } from './ui/file-upload'


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
      // Use the currentImageUrl from first API response or existing imageUrl for reprocessing
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
      lastModified: file.lastModified
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
        return (
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Student ID</h1>
            <Input
              placeholder="Enter Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>
        )

      case 1:
        return (
          <div className="space-y-4">
            <FileUpload 
              label="Answer Sheet" 
              onFileUpload={handleAnswerSheetUpload}
              existingFile={uploadedAnswerSheet}
              folderName="answer_sheets"
              className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg"
            />
            {uploadedAnswerSheet && (
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => {
                  setUploadedAnswerSheet(null);
                  // Reset the FileUpload component by forcing a remount
                  setCurrentStep(1);
                }}>
                  Upload Another Answer Sheet
                </Button>
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Answer Sheet Preview</h2>
            
            {isProcessing ? (
              <div className="space-y-4">
                <div className="animate-pulse text-center p-4">
                  <p className="text-lg font-medium">{processingStep}</p>
                  <div className="mt-2">
                    <Progress value={processingStep.includes('Stitching') ? 50 : 75} />
                  </div>
                </div>
              </div>
            ) : (
              <Card className="p-4">
                {extractedText && extractedText.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {extractedText.map(({ marginNumber, answer }) => (
                      <li key={marginNumber}>
                        <strong>{marginNumber}:</strong> {answer}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No text extracted yet.</p>
                )}
              </Card>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="continue" 
                checked={continueChecked}
                onCheckedChange={(checked) => setContinueChecked(checked as boolean)}
              />
              <label htmlFor="continue">Continue with this answer sheet</label>
            </div>
            
            <div className="space-x-4">
              <Button 
                variant="outline" 
                onClick={handleExtractAgain}
                disabled={isProcessing}
              >
                Extract Again
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <FileUpload 
              label="Answer Key" 
              onFileUpload={handleAnswerKeyUpload}
              existingFile={uploadedAnswerKey}
              folderName="answer_keys"
              className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg"
            />
            {uploadedAnswerKey && (
              <div>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => {
                    setUploadedAnswerKey(null);
                    setCurrentStep(3);
                  }}>
                    Upload Another Answer Key
                  </Button>
                </div>
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">View Scores</h1>
            <Card className="p-4">
              <p className="text-gray-600">Here are the scores for each question:</p>
              <ul className="list-disc pl-5">
                <li>Question 1: 3/3</li>
                <li>Question 2: 3/3</li>
                <li>Question 3: 1/3</li>
                <li>Question 4: 1.5/3</li>
                <li>Question 5: 2/3</li>
              </ul>
            </Card>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Class Name</h2>
            <Input
              placeholder="Enter Class Name"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
            <div className="flex items-center space-x-2">
              <Checkbox id="continueClass" />
              <label htmlFor="continueClass">Continue uploading to this class</label>
            </div>
            
          </div>
        )

      default:
        return null
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