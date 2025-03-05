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
        <div className="space-y-4">
          <div className="animate-pulse text-center p-4">
            <p className="text-lg font-medium">{processingStep}</p>
            <div className="mt-2">
              <Progress value={processingStep.includes('Stitching') ? 50 : 75} />
            </div>
          </div>
        </div>
      ) : (
        <Card className="p-4">
          {extractedText && extractedText.length > 0 ? (
            <ul className="list-disc pl-5">
              {extractedText.map(({ marginNumber, answer }) => (
                <li key={marginNumber}>
                  <strong>{marginNumber}:</strong> {answer}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No text extracted yet.</p>
          )}
        </Card>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="continue"
          checked={continueChecked}
          onCheckedChange={(checked) => setContinueChecked(checked as boolean)}
        />
        <label htmlFor="continue">Continue with this answer sheet</label>
      </div>

      <div className="space-x-4">
        <Button
          variant="outline"
          onClick={handleExtractAgain}
          disabled={isProcessing}
        >
          Extract Again
        </Button>
      </div>
    </div>
  );
}
