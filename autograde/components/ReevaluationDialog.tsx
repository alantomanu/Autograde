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
            {step === 'initial' ? 'Score Already Exists' : step === 'enterNewId' ? 'Enter Valid Student ID' : 'Update Existing Score'}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {step === 'initial' && (
            <div className="space-y-4">
              <div>Score already exists for this student and course.</div>
              <div className="space-y-2">
                <div className="font-medium">Previous Score Details:</div>
                <div>Marks: {existingScore?.totalMarks}/{existingScore?.maxMarks}</div>
                <div>Percentage: {existingScore?.percentage}%</div>
              </div>
              <div className="mt-6">
                <Button onClick={onConfirmReeval} className="mr-4">Yes, this is a re-evaluation</Button>
                <Button variant="outline" onClick={() => setReevalStep('enterNewId')}>No, enter a new student ID</Button>
              </div>
            </div>
          )}
          {step === 'enterNewId' && (
            <div className="space-y-4">
              <Input
                placeholder="Enter Valid Student ID"
                value={newStudentId}
                onChange={(e) => setNewStudentId(e.target.value)}
                className="mb-6"
              />
              <Button onClick={onNewStudentIdSubmit}>Submit New ID</Button>
            </div>
          )}
          {step === 'update' && (
            <div className="space-y-4">
              <div>Do you want to update this score?</div>
              <Button onClick={onUpdateScore} className="mt-6">Yes, update the score</Button>
            </div>
          )}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
} 