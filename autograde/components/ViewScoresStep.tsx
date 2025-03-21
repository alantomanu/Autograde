import React, { useState } from 'react';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Pencil } from 'lucide-react';
import { EvaluationResponse, EvaluationResult } from '../types';

interface ViewScoresStepProps {
  evaluationData: EvaluationResponse | null;
  setEvaluationData: React.Dispatch<React.SetStateAction<EvaluationResponse | null>>;
  setIsMarksSaved: React.Dispatch<React.SetStateAction<boolean>>;
  isMarksSaved: boolean;
}

export function ViewScoresStep({ 
  evaluationData, 
  setEvaluationData, 
  setIsMarksSaved 
}: ViewScoresStepProps) {
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

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
          adjustedMark: `${received}/${total}`,
          feedback: {
            ...result.feedback,
            mark: received,
            maxMark: total,
            questionNumber,
            reason: result.reason
          }
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

    const updatedEvaluationData = {
      ...evaluationData,
      results: updatedResults,
      summary: {
        ...evaluationData.summary,
        totalMarks: `${totalReceived}/${totalPossible}`,
        percentage: Math.round(newPercentage),
      },
    };

    setEvaluationData(updatedEvaluationData);
    setIsMarksSaved(false); // Mark as unsaved when changes are made
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
        </div>
      </Card>
    </div>
  );
}

