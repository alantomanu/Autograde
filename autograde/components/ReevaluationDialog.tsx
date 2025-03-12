import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  onUpdateScore,
  step,
  existingScore,

  newStudentId,
  setNewStudentId,
  onNewStudentIdSubmit,
  setReevalStep
}: ReevaluationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {step === 'initial' ? 'Score Already Exists' : step === 'enterNewId' ? 'Enter New Student ID' : 'Update Existing Score'}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {step === 'initial' && (
            <>
              <p>Score already exists for this student and course.</p>
              <p>Previous Score Details:</p>
              <p>Marks: {existingScore?.totalMarks}/{existingScore?.maxMarks}</p>
              <p>Percentage: {existingScore?.percentage}%</p>
              <div className="mt-6">
                <Button onClick={onConfirmReeval} className="mr-4">Yes, this is a re-evaluation</Button>
                <Button variant="outline" onClick={() => setReevalStep('enterNewId')}>No, enter a new student ID</Button>
              </div>
            </>
          )}
          {step === 'enterNewId' && (
            <>
              <p>Enter New Student ID:</p>
              <Input
                placeholder="Enter new student ID"
                value={newStudentId}
                onChange={(e) => setNewStudentId(e.target.value)}
                className="mb-6"
              />
              <Button onClick={onNewStudentIdSubmit}>Submit New ID</Button>
            </>
          )}
          {step === 'update' && (
            <>
              <p>Do you want to update this score?</p>
              <Button onClick={onUpdateScore} className="mt-6">Yes, update the score</Button>
            </>
          )}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
} 