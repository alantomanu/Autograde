'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Checkbox } from './ui/checkbox'
import { Card } from './ui/card'
import { Progress } from './ui/progress'
import { FileUpload } from './ui/file-upload'

const steps = [
  'Enter Student ID',
  'Upload Answer Sheet',
  'Review Answer Key',
  'Upload Answer Key',
  'View Scores',
  'Submit'
]

export default function ExamEvaluator() {
  const [currentStep, setCurrentStep] = useState(0)
  const [studentId, setStudentId] = useState('')
  const [className, setClassName] = useState('')

  // Handlers for file uploads
  const handleAnswerSheetUpload = (cloudinaryUrl: string) => {
    console.log("Uploaded Answer Sheet URL:", cloudinaryUrl);
  };

  const handleAnswerKeyUpload = (cloudinaryUrl: string) => {
    console.log("Uploaded Answer Key URL:", cloudinaryUrl);
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = () => {
    console.log('Submitting data...')
  }

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
        return <FileUpload label="Answer Sheet" onFileUpload={handleAnswerSheetUpload} />

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Answer Key Preview</h2>
            <Card className="p-4">
              <p className="text-gray-600">Answer key content will be displayed here...</p>
            </Card>
            <div className="flex items-center space-x-2">
              <Checkbox id="continue" />
              <label htmlFor="continue">Continue with this answer key</label>
            </div>
            <div className="space-x-4">
              <Button variant="default">Continue</Button>
              <Button variant="outline">Extract Again</Button>
            </div>
          </div>
        )

      case 3:
        return <FileUpload label="Answer Key" onFileUpload={handleAnswerKeyUpload} />

      case 4:
        return (
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">View Scores</h1>
            <Card className="p-4">
              <p className="text-gray-600">Here are the scores for each question:</p>
              <ul className="list-disc pl-5">
                <li>Question 1: 5/5</li>
                <li>Question 2: 4/5</li>
                <li>Question 3: 3/5</li>
                <li>Question 4: 5/5</li>
                <li>Question 5: 2/5</li>
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
            <Button variant="default" onClick={handleSubmit}>
              Submit Data to Database
            </Button>
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
            <Button onClick={handleSubmit}>Submit</Button>
          )}
        </div>
      </Card>
    </div>
  )
}
