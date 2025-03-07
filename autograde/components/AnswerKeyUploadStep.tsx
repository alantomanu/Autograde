import { FileUpload } from './ui/file-upload';
import { Button } from './ui/button';
import { UploadedFile, AnswerKeyData } from '../types';
import { useState } from 'react';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface AnswerKeyUploadStepProps {
  uploadedAnswerKey: UploadedFile | null;
  handleAnswerKeyUpload: (url: string, file: File) => void;
  resetUpload: () => void;
  onProcessingComplete: (data: AnswerKeyData) => void;
}

export function AnswerKeyUploadStep({
  uploadedAnswerKey,
  handleAnswerKeyUpload,
  resetUpload,
  onProcessingComplete,
}: AnswerKeyUploadStepProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);
  const [processSuccess, setProcessSuccess] = useState(false);

  const processAnswerKey = async (url: string) => {
    setIsProcessing(true);
    setProcessError(null);
    setProcessSuccess(false);

    try {
      const response = await fetch('http://localhost:5000/convert-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pdfUrl: url }),
      });

      const data: AnswerKeyData = await response.json();

      if (!response.ok || !data || data.status === false) {
        throw new Error(data.message || 'Failed to process answer key. The answer key must follow the format you can download the format here');
      }

      onProcessingComplete(data);
      setProcessSuccess(true);
    } catch (error) {
      setProcessError(error instanceof Error ? error.message : 'Failed to process answer key. The answer key must follow the format you can download the format here');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (url: string, file: File) => {
    handleAnswerKeyUpload(url, file);
    await processAnswerKey(url);
  };

  return (
    <div className="space-y-4">
      <FileUpload
        label="Answer Key"
        onFileUpload={handleFileUpload}
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
      
      {/* Processing Status */}
      <div className="flex items-center justify-center gap-2">
        {isProcessing && (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-gray-600">Processing answer key...</span>
          </>
        )}
        {processSuccess && (
          <>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-600">Answer key processed successfully</span>
          </>
        )}
        {processError && (
          <>
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-600">{processError}</span>
          </>
        )}
      </div>
    </div>
  );
}
