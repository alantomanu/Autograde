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
        {step === 'initial' && (
          <>
            <p className="text-sm">Score already exists for this student and course.</p>
            <div className="mt-4">
              <p className="font-medium mb-2">Previous Score Details:</p>
              <p className="text-sm">Marks: {existingScore?.totalMarks}/{existingScore?.maxMarks}</p>
              <p className="text-sm">Percentage: {existingScore?.percentage}%</p>
            </div>
            <div className="mt-6 flex gap-4">
              <Button onClick={onConfirmReeval}>Yes, this is a re-evaluation</Button>
              <Button variant="outline" onClick={() => setReevalStep('enterNewId')}>
                No, enter a new student ID
              </Button>
            </div>
          </>
        )}
        {step === 'enterNewId' && (
          <>
            <Input
              placeholder="Enter Valid Student ID"
              value={newStudentId}
              onChange={(e) => setNewStudentId(e.target.value)}
              className="mb-6"
            />
            <Button onClick={onNewStudentIdSubmit}>Submit New ID</Button>
          </>
        )}
        {step === 'update' && (
          <>
            <p className="text-sm">Do you want to update this score?</p>
            <Button onClick={onUpdateScore} className="mt-6">
              Yes, update the score
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
} 