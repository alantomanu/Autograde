import { Input } from './ui/input';

export function StudentIDStep({ studentId, setStudentId }: { studentId: string, setStudentId: (studentId: string) => void }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Student ID</h1>
      <Input
        placeholder="Enter Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />
    </div>
  );
}
