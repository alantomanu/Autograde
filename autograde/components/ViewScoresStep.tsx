import React, { useState } from 'react';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Pencil } from 'lucide-react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

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

interface ViewScoresStepProps {
  evaluationData: EvaluationResponse | null;
  setEvaluationData: React.Dispatch<React.SetStateAction<EvaluationResponse | null>>;
  setIsMarksSaved: React.Dispatch<React.SetStateAction<boolean>>;
  isMarksSaved: boolean;
}

export function ViewScoresStep({ evaluationData, setEvaluationData, setIsMarksSaved }: ViewScoresStepProps) {
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  if (!evaluationData) return <div>Loading evaluation results...</div>;

  console.log("Question with diagram:", evaluationData.results.find(r => r.hasDiagram)); // Debug log

  const handleMarkUpdate = (questionNumber: string, newReceivedMark: string, totalMark: string) => {
    // Update the input value immediately
    setInputValues(prev => ({
      ...prev,
      [questionNumber]: newReceivedMark
    }));

    if (!evaluationData) return;

    const received = Number(newReceivedMark);
    const total = Number(totalMark);
    
    if (isNaN(received)) return;

    if (received > total) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [questionNumber]: `Max mark is ${total}. Please enter a correct mark.`,
      }));
      return;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [questionNumber]: null,
    }));

    const updatedResults = evaluationData.results.map((result: EvaluationResult) => {
      if (result.questionNumber === questionNumber) {
        return { 
          ...result, 
          mark: `${received}/${total}`,
          adjustedMark: `${received}/${total}`
        };
      }
      return result;
    });

    // Calculate new total marks and percentage
    const totalReceived = updatedResults.reduce((sum: number, result: EvaluationResult) => {
      const [received] = result.mark.split('/').map(Number);
      return sum + (isNaN(received) ? 0 : received);
    }, 0);

    const totalPossible = updatedResults.reduce((sum: number, result: EvaluationResult) => {
      const [, total] = result.mark.split('/').map(Number);
      return sum + (isNaN(total) ? 0 : total);
    }, 0);

    const newPercentage = (totalReceived / totalPossible) * 100;

    setEvaluationData({
      ...evaluationData,
      results: updatedResults,
      summary: {
        ...evaluationData.summary,
        totalMarks: `${totalReceived}/${totalPossible}`,
        percentage: Math.round(newPercentage),
      },
    });
  };

  const handleSaveToCloudinary = async () => {
    if (!evaluationData) return;
    
    try {
      setIsSaving(true);
      setSaveStatus('saving');
      
      const jsonString = JSON.stringify(evaluationData);
      
      const formData = new FormData();
      formData.append('file', new Blob([jsonString], { type: 'application/json' }));
      formData.append('upload_preset', 'evaluation-results');
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dfivs4n49/raw/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload to Cloudinary');
      }

      setSaveStatus('success');
      setIsMarksSaved(true);
      toast.success('Marks saved successfully');
      
      // Reset success status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error saving to Cloudinary:', error);
      setSaveStatus('error');
      setIsMarksSaved(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Evaluation Results</h2>

      <div className="space-y-4">
        {evaluationData.results.map((result: EvaluationResult) => {
          const [receivedMark, totalMark] = result.mark.split('/');
          
          return (
            <Card key={result.questionNumber} className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">Question {result.questionNumber}:</span>
                    <div className="flex items-center gap-2">
                      {result.diagramMarks > 0 ? (
                        <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-1">
                          <div className="flex items-center">
                            <Input
                              type="text"
                              value={inputValues[result.questionNumber] ?? receivedMark}
                              onChange={(e) => handleMarkUpdate(result.questionNumber, e.target.value, totalMark)}
                              className="w-10 border-dashed text-center px-1"
                            />
                            <span className="mx-0.5">/</span>
                            <span className="w-3 text-gray-600 text-right">{totalMark}</span>
                          </div>
                          <Pencil className="h-3 w-3 text-blue-500" />
                        </div>
                      ) : (
                        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                          {result.mark}
                        </span>
                      )}
                    </div>
                  </div>
                  {result.diagramMarks > 0 && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 ml-4">
                      <span className="font-medium">Diagram mark:</span> {result.diagramMarks} ( Evaluate the diagram and award the marks )
                      
                    </div>
                  )}
                  {errors[result.questionNumber] && (
                    <div className="text-red-600 text-sm mt-2 ml-4">
                      {errors[result.questionNumber]}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8 p-6">
        <h3 className="text-xl font-semibold mb-4">Summary</h3>
        <div className="space-y-2">
          <p className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total Questions:</span>
            <span className="font-medium">{evaluationData.summary.totalQuestions}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total Marks:</span>
            <span className="font-medium">{evaluationData.summary.totalMarks}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Percentage:</span>
            <span className="font-medium">{evaluationData.summary.percentage}%</span>
          </p>
          
          <div className="pt-4 mt-4 border-t flex justify-end">
            <Button
              onClick={handleSaveToCloudinary}
              disabled={isSaving}
              size="sm"
              className={`flex items-center gap-2 transition-all duration-200
                ${saveStatus === 'success' ? 'bg-green-600 hover:bg-green-700' : ''}
                ${saveStatus === 'error' ? 'bg-red-600 hover:bg-red-700' : ''}
                ${saveStatus === 'saving' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
            >
              {saveStatus === 'saving' && (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              )}
              {saveStatus === 'success' && (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Uploaded</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Failed</span>
                </>
              )}
              {saveStatus === 'idle' && (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Save Marks</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

