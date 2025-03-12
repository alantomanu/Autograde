import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ReevaluationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReeval: () => void;
  onUpdateScore: () => void;
  step: 'initial' | 'update' | 'enterNewId';
  existingScore: {
    totalMarks: number;
    maxMarks: number;
    percentage: number;
  } | null;
  message?: string;
  newStudentId: string;
  setNewStudentId: React.Dispatch<React.SetStateAction<string>>;
  onNewStudentIdSubmit: () => void;
  setReevalStep: React.Dispatch<React.SetStateAction<'initial' | 'update' | 'enterNewId'>>;
}

export function ReevaluationDialog({
  isOpen,
  onClose,
  onConfirmReeval,
  step,
  existingScore,
  message,
  newStudentId,
  setNewStudentId,
  onNewStudentIdSubmit,
  setReevalStep
}: ReevaluationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'initial' ? 'Score Already Exists' : step === 'enterNewId' ? 'Enter New Student ID' : 'Update Existing Score'}
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
                Is this a Re-evaluation?
              </div>
            </div>
          ) : step === 'enterNewId' ? (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground font-medium">
                Enter New Student ID:
              </div>
              <Input
                placeholder="Enter new student ID"
                value={newStudentId}
                onChange={(e) => setNewStudentId(e.target.value)}
              />
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
          {step === 'initial' && (
            <>
              <Button variant="outline" onClick={() => setReevalStep('enterNewId')}>
                No
              </Button>
              <Button onClick={onConfirmReeval}>
                Yes
              </Button>
            </>
          )}
          {step === 'enterNewId' && (
            <Button onClick={onNewStudentIdSubmit}>Submit New ID</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 