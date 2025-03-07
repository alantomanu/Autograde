export interface UploadedFile {
  url: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export interface AnswerKeyData {
  status: boolean;
  message?: string;
  data?: {
    questions: {
      questionNumber: number;
      correctAnswer: string;
    }[];
  };
}

export interface ErrorResponse {
  message: string;
  // Add any other fields you expect in the error response
} 