import React, { useState, useCallback } from 'react';
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
  const [courseIdMessage, setCourseIdMessage] = useState<string>('');
  const [courseNameMessage, setCourseNameMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'info' | 'error'>('info');
  const [existingCourseName, setExistingCourseName] = useState<string>('');

  const verifyCourseId = useCallback(async (id: string) => {
    if (!id) {
      setCourseIdMessage('');
      setCourseNameMessage('');
      return;
    }

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: id,
          courseName,
          teacherId: 'placeholder',
        }),
      });

      const data = await response.json();
      console.log('Verification response:', data);

      if (data.status === 'name_mismatch') {
        setExistingCourseName(data.existingName);
        setCourseNameMessage(
          `Course name mismatch: You entered "${data.providedName}" but this course exists as "${data.existingName}". Click here to use the existing name.`
        );
        setMessageType('info');
      } else if (data.status === 'exists') {
        setCourseIdMessage(data.message);
        if (data.course?.courseName) {
          setExistingCourseName(data.course.courseName);
        }
      } else {
        setCourseIdMessage('');
        setCourseNameMessage('');
        setExistingCourseName('');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setCourseIdMessage('Unable to verify course.');
      setMessageType('error');
    }
  }, [courseName]);

  React.useEffect(() => {
    if (courseId) {
      verifyCourseId(courseId);
    }
  }, [courseId, courseName, verifyCourseId]);

  const handleCourseNameClick = () => {
    if (existingCourseName) {
      setCourseName(existingCourseName);
      setCourseNameMessage('');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
          Student ID
        </label>
        <Input
          id="studentId"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="courseId" className="block text-sm font-medium text-gray-700">
          Course ID
        </label>
        <Input
          id="courseId"
          placeholder="Enter Course ID"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        />
        {courseIdMessage && (
          <p className={`mt-1 text-sm ${
            messageType === 'info' ? 'text-blue-600' : 'text-red-600'
          }`}>
            {courseIdMessage}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="courseName" className="block text-sm font-medium text-gray-700">
          Course Name
        </label>
        <Input
          id="courseName"
          placeholder="Enter Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
        {courseNameMessage && (
          <p 
            className="mt-1 text-sm text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
            onClick={handleCourseNameClick}
          >
            {courseNameMessage}
          </p>
        )}
      </div>
    </div>
  );
};
