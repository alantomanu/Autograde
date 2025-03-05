import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';

export function AnswerSheetPreviewStep({
  isProcessing,
  processingStep,
  extractedText,
  continueChecked,
  setContinueChecked,
  handleExtractAgain,
}: {
  isProcessing: boolean;
  processingStep: string;
  extractedText: { marginNumber: string; answer: string }[];
  continueChecked: boolean;
  setContinueChecked: (checked: boolean) => void;
  handleExtractAgain: () => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Answer Sheet Preview</h2>

      {isProcessing ? (
        <div className="animate-pulse text-center p-4">
          <p className="text-lg font-medium">{processingStep}</p>
          <Progress value={processingStep.includes('Stitching') ? 50 : 75} />
        </div>
      ) : (
        <Card className="p-4">{extractedText.length > 0 ? extractedText.map(({ marginNumber, answer }) => (
          <p key={marginNumber}><strong>{marginNumber}:</strong> {answer}</p>
        )) : <p>No text extracted yet.</p>}</Card>
      )}

      <Checkbox checked={continueChecked} onCheckedChange={(checked) => setContinueChecked(checked as boolean)} />
      <Button onClick={handleExtractAgain} disabled={isProcessing}>Extract Again</Button>
    </div>
  );
}
