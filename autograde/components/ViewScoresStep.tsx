import React, { useState } from 'react';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Pencil } from 'lucide-react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

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
}

export function ViewScoresStep({ evaluationData, setEvaluationData }: ViewScoresStepProps) {
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [savedUrl, setSavedUrl] = useState<string | null>(null);

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
      
      const jsonString = JSON.stringify(evaluationData);
      
      const formData = new FormData();
      formData.append('file', new Blob([jsonString], { type: 'application/json' }));
      formData.append('upload_preset', 'evaluation-results'); // Updated with your preset name
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dfivs4n49/raw/upload`, // Replace YOUR_CLOUD_NAME with your actual cloud name
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload to Cloudinary');
      }

      setSavedUrl(data.secure_url);
      alert('Marks saved successfully!');
    } catch (error) {
      console.error('Error saving to Cloudinary:', error);
      alert('Failed to save marks. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Evaluation Results</h2>
        <Button
          onClick={handleSaveToCloudinary}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Marks'
          )}
        </Button>
      </div>

      {savedUrl && (
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-300">
            Marks saved successfully! Access them at:{' '}
            <a 
              href={savedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {savedUrl}
            </a>
          </p>
        </div>
      )}

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
        </div>
      </Card>
    </div>
  );
}
