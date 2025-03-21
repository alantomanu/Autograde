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
  // Check for duplicate margin numbers
  const hasDuplicateKeys = extractedText.length > 0 && 
    new Set(extractedText.map(item => item.marginNumber)).size !== extractedText.length;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Answer Sheet Preview</h2>

      {isProcessing ? (
        <div className="animate-pulse text-center p-4">
          <p className="text-lg font-medium">{processingStep}</p>
          <Progress value={75} />
        </div>
      ) : (
        <>
          {hasDuplicateKeys && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              Error: Duplicate question numbers detected. Please click &quot;Extract Again&quot; to retry text extraction.
            </div>
          )}
          <Card className="p-4">
            {extractedText.length > 0 ? extractedText.map(({ marginNumber, answer }, index) => (
              <p key={`${marginNumber}-${index}`}><strong>{marginNumber}:</strong> {answer}</p>
            )) : <p>No text extracted yet.</p>}
          </Card>
        </>
      )}

      <div className="flex items-center space-x-2 mt-4">
        <Checkbox 
          id="verify-answers"
          checked={continueChecked} 
          onCheckedChange={(checked) => setContinueChecked(checked as boolean)} 
        />
        <label
          htmlFor="verify-answers"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I have verified the digital answer sheet and confirm it matches the uploaded document
        </label>
      </div>
      <Button 
        onClick={handleExtractAgain} 
        disabled={isProcessing}
        className="mt-2"
      >
        Extract Again
      </Button>
    </div>
  );
}
