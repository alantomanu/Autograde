import { Card } from './ui/card';
import { AnswerKeyData } from '../types';

interface ViewScoresStepProps {
  answerKeyData: AnswerKeyData | null;
}

export function ViewScoresStep({ answerKeyData }: ViewScoresStepProps) {
  if (!answerKeyData) {
    return <div>No answer key data available</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">View Scores</h1>
      <Card className="p-4">
        <p className="text-gray-600">Here are the scores for each question:</p>
        <ul className="list-disc pl-5">
          {answerKeyData.data?.questions.map((question) => (
            <li key={question.questionNumber}>
              Question {question.questionNumber}: {question.correctAnswer}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
