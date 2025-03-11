import React from 'react';
import { Input } from './ui/input';

interface StudentIDStepProps {
  studentId: string;
  setStudentId: (studentId: string) => void;
  courseId: string;
  setCourseId: (courseId: string) => void;
  courseName: string;
  setCourseName: (courseName: string) => void;
}

export const StudentIDStep: React.FC<StudentIDStepProps> = ({
  studentId,
  setStudentId,
  courseId,
  setCourseId,
  courseName,
  setCourseName,
}) => {
  return (
    <div className="space-y-4">
      
      <div>
        <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">Student ID</label>
        <Input
          id="studentId"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="courseId" className="block text-sm font-medium text-gray-700">Course ID</label>
        <Input
          id="courseId"
          placeholder="Enter Course ID"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="courseName" className="block text-sm font-medium text-gray-700">Course Name</label>
        <Input
          id="courseName"
          placeholder="Enter Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
      </div>
    </div>
  );
};
