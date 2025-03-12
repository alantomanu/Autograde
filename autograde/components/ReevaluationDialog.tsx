import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ReevaluationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReeval: () => void;
  onUpdateScore: () => void;
  step: 'initial' | 'update';
  existingScore: {
    totalMarks: number;
    maxMarks: number;
    percentage: number;
  } | null;
  message?: string;
}

export function ReevaluationDialog({
  isOpen,
  onClose,
  onConfirmReeval,
  onUpdateScore,
  step,
  existingScore,
  message
}: ReevaluationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'initial' ? 'Score Already Exists' : 'Update Existing Score'}
          </DialogTitle>
        </DialogHeader>

        {message && (
          <div className="bg-amber-50 text-amber-800 p-3 rounded-md mt-2 text-sm">
            {message}
          </div>
        )}

        <div className="mt-4 space-y-4">
          {step === 'initial' ? (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                A score already exists for this student and course.
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Is this a reevaluation?
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground font-medium">
                Previous Score Details:
              </div>
              {existingScore && (
                <div className="bg-muted p-3 rounded-md space-y-1">
                  <div className="text-sm">
                    Marks: {existingScore.totalMarks}/{existingScore.maxMarks}
                  </div>
                  <div className="text-sm">
                    Percentage: {existingScore.percentage}%
                  </div>
                </div>
              )}
              <div className="text-sm text-muted-foreground font-medium">
                Do you want to update this score?
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            No
          </Button>
          <Button 
            onClick={step === 'initial' ? onConfirmReeval : onUpdateScore}
          >
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 