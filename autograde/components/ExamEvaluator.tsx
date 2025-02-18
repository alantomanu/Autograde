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
  'Submit'
]

export default function ExamEvaluator() {
  const [currentStep, setCurrentStep] = useState(0)
  const [studentId, setStudentId] = useState('')
  const [className, setClassName] = useState('')

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = () => {
    // Handle final submission
    console.log('Submitting data...')
  }

  const handleAnswerSheetUpload = (file: File) => {
    // Handle the uploaded file
    console.log('Answer sheet uploaded:', file)
  }

  const handleAnswerKeyUpload = (file: File) => {
    // Handle the uploaded file
    console.log('Answer key uploaded:', file)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Student ID</h2>
            <Input
              placeholder="Enter Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
            <Button onClick={handleNext}>Continue</Button>
          </div>
        )

      case 1:
        return (
          <FileUpload
            label=""
            onFileUpload={handleAnswerSheetUpload}
          />
        )

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Answer Key Preview</h2>
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
        return (
          <FileUpload
            label=""
            onFileUpload={handleAnswerKeyUpload}
          />
        )

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Class Name</h2>
            <Input
              placeholder="Enter Class Name"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
            <div className="flex items-center space-x-2">
              <Checkbox id="continueClass" />
              <label htmlFor="continueClass">Continue uploading to this class</label>
            </div>
            <Button variant="default">Submit Data to Database</Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 dark:bg-black light:bg-white">
      
      
      {/* Progress Steps */}
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

      {/* Step Content */}
      <Card className="p-6 bg-white dark:bg-gray-800">
        {renderStepContent()}
        
        {/* Navigation Buttons */}
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
