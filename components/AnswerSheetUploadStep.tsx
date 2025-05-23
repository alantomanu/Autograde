import { FileUpload } from './ui/file-upload';
import { Button } from './ui/button';
import { UploadedFile } from '../types'; 

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
   
    handleAnswerSheetUpload(url, file);
  };

  return (
    <div className="space-y-4">
      <FileUpload
        label="Answer Sheet"
        onFileUpload={handleFileUpload}
        existingFile={uploadedAnswerSheet}
        folderName="answer_sheets"
        className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white border-neutral-200  rounded-lg"
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
