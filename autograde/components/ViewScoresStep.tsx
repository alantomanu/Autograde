import React, { useState } from 'react';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Pencil } from 'lucide-react';
import { EvaluationResponse, EvaluationResult } from '../types';
import { FlipText } from "@/components/magicui/flip-text";
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

interface ViewScoresStepProps {
  evaluationData: EvaluationResponse | null;
  setEvaluationData: React.Dispatch<React.SetStateAction<EvaluationResponse | null>>;
  setIsMarksSaved: React.Dispatch<React.SetStateAction<boolean>>;
  isMarksSaved: boolean;
  processingStep?: string;
}

export function ViewScoresStep({ 
  evaluationData, 
  setEvaluationData, 
  setIsMarksSaved,
  isMarksSaved,
  processingStep 
}: ViewScoresStepProps) {
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  // Show loading state initially
  if (!evaluationData && !isMarksSaved && processingStep !== 'You can view detailed analytics in Analytics') return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Evaluation Results</h2>
      </div>
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="p-8 rounded-lg bg-white/50 backdrop-blur-sm border-gray-100">
          <FlipText 
            duration={0.5} 
            delayMultiple={0.1}
            className="text-2xl font-bold text-gray-700 tracking-tighter"
          >
            Loading evaluation results...
          </FlipText>
        </div>
      </div>
    </div>
  );

  // Show analytics message after successful save
  if (processingStep === 'You can view detailed analytics in Analytics') return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Evaluation Results</h2>
      </div>
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="p-8 rounded-lg bg-white/50 backdrop-blur-sm border-gray-100">
          <div className="text-center space-y-4">
            <p className="text-xl font-semibold text-gray-700">You can view detailed analytics in Analytics</p>
            <Button 
              onClick={() => router.push('/analytics')} 
              className="mt-2"
            >
              View Analytics
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // If we reach here, we have evaluationData and marks are not saved yet
  if (!evaluationData) return null; // TypeScript safety check

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
          maxMark: total,
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Evaluation Results</h2>
      </div>

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
                        <div className="flex items-center gap-1 bg-blue-50  rounded-lg p-1">
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
                        <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {result.mark}
                        </span>
                      )}
                    </div>
                  </div>
                  {result.diagramMarks > 0 && (
                    <div className="text-sm text-gray-600  ml-4">
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
            <span className="text-gray-600 ">Total Questions</span>
            <span className="font-medium">{evaluationData.summary.totalQuestions}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-600 ">Total Marks</span>
            <span className="font-medium">{evaluationData.summary.totalMarks}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-600 ">Percentage</span>
            <span className="font-medium">{evaluationData.summary.percentage}%</span>
          </p>
        </div>
      </Card>
    </div>
  );
}

