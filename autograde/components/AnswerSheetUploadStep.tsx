import { FileUpload } from './ui/file-upload';
import { Button } from './ui/button';
import { UploadedFile } from '../types'; // Adjust the path as necessary

interface AnswerSheetUploadStepProps {
  uploadedAnswerSheet: UploadedFile | null;
  handleAnswerSheetUpload: (url: string, file: File) => void;
  resetUpload: () => void;
}

export function AnswerSheetUploadStep({
  uploadedAnswerSheet,
  handleAnswerSheetUpload,
  resetUpload,
}: AnswerSheetUploadStepProps) {
  const handleFileUpload = (url: string, file: File) => {
    // Call the handler with the URL and file
    handleAnswerSheetUpload(url, file);
  };

  return (
    <div className="space-y-4">
      <FileUpload
        label="Answer Sheet"
        onFileUpload={handleFileUpload}
        existingFile={uploadedAnswerSheet}
        folderName="answer_sheets"
        className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg"
      />
      {uploadedAnswerSheet && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={resetUpload}>
            Upload Another Answer Sheet
          </Button>
        </div>
      )}
    </div>
  );
}
