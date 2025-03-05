import { Card } from './ui/card';

export function ViewScoresStep() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">View Scores</h1>
      <Card className="p-4">
        <p className="text-gray-600">Here are the scores for each question:</p>
        <ul className="list-disc pl-5">
          <li>Question 1: 3/3</li>
          <li>Question 2: 3/3</li>
          <li>Question 3: 1/3</li>
          <li>Question 4: 1.5/3</li>
          <li>Question 5: 2/3</li>
        </ul>
      </Card>
    </div>
  );
}
