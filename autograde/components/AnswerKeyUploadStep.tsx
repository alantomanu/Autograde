import { FileUpload } from './ui/file-upload';
import { Button } from './ui/button';
import { UploadedFile } from '../types';

interface AnswerKeyUploadStepProps {
  uploadedAnswerKey: UploadedFile | null;
  handleAnswerKeyUpload: (url: string, file: File) => void;
  resetUpload: () => void;
}

export function AnswerKeyUploadStep({
  uploadedAnswerKey,
  handleAnswerKeyUpload,
  resetUpload,
}: AnswerKeyUploadStepProps) {
  return (
    <div className="space-y-4">
      <FileUpload
        label="Answer Key"
        onFileUpload={handleAnswerKeyUpload}
        existingFile={uploadedAnswerKey}
        folderName="answer_keys"
        className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg"
      />
      {uploadedAnswerKey && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={resetUpload}>
            Upload Another Answer Key
          </Button>
        </div>
      )}
    </div>
  );
}
