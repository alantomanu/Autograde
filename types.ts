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

export interface EvaluationResult {
  questionNumber: string;
  mark: string;
  adjustedMark: string;
  reason: string;
  maxMark: number;
  justification: string;
  hasDiagram: boolean;
  evaluationMethod: string;
  diagramMarks: number;
  feedback: {
    mark: number;
    maxMark: number;
    questionNumber: string;
    reason: string;
  };
}

export interface EvaluationResponse {
  success: boolean;
  timestamp: string;
  studentId: string;
  courseId: string;
  results: EvaluationResult[];
  summary: {
    totalQuestions: number;
    totalMarks: string;
    percentage: number;
  };
  cloudinaryUrl?: string;
} 