import React, { useState } from 'react';
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
  const [verificationMessage, setVerificationMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'info' | 'error'>('info');
  const [correctCourseName, setCorrectCourseName] = useState<string>('');

  const verifyCourseId = async (id: string) => {
    if (!id) return;

    setCourseIdMessage('Verifying course ID...');
    setMessageType('info');
    setCourseNameMessage('');
    setVerificationMessage(''); // Reset verification message

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: id,
          courseName,
          teacherId: 'placeholder', // This will be replaced with session teacherId
        }),
      });

      const data = await response.json();

      if (data.status === 'exists') {
        setCourseIdMessage('Course ID verified.');
        setCorrectCourseName(data.course.courseName);
        
        // Check if the entered course name matches the existing course name
        if (courseName && data.course.courseName !== courseName) {
          setCourseNameMessage(`This course ID is registered with the name: "${data.course.courseName}". Please enter this name to continue.`);
          setVerificationMessage(`This is the course name for the course ID: "${data.course.courseName}". Enter this name to continue.`);
        } else {
          setCourseNameMessage('');
          setVerificationMessage(''); // Clear verification message if names match
        }
      } else {
        setCourseIdMessage('');
        setCourseNameMessage('');
        setCorrectCourseName('');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setCourseIdMessage('Unable to verify course. You can continue with your entered details.');
      setMessageType('error');
    }
  };

  const handleCourseNameChange = (newName: string) => {
    setCourseName(newName);
    if (correctCourseName && newName !== correctCourseName) {
      setCourseNameMessage(`This course ID is registered with the name: "${correctCourseName}". Please enter this name to continue.`);
    } else {
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
          onChange={(e) => {
            setCourseId(e.target.value);
            verifyCourseId(e.target.value);
          }}
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
          onChange={(e) => handleCourseNameChange(e.target.value)}
        />
        {courseNameMessage && (
          <p className="mt-1 text-sm text-blue-600">
            {courseNameMessage}
          </p>
        )}
        {verificationMessage && (
          <p className="mt-1 text-sm text-blue-600">
            {verificationMessage}
          </p>
        )}
      </div>
    </div>
  );
};
