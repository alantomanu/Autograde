"use client";

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { useSession } from "next-auth/react";

// Register the necessary components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  PointElement, 
  LineElement
);

// Define types for the analytics data
type StudentData = {
  studentId: string;
  totalMarks: number;
  percentage: number;
  rank?: number;
  evaluatedTime: string;
};

type CourseAnalytics = {
  courseName: string;
  evaluatedCount: number;
  maxScore: number;
  minScore: number;
  averageScore: number;
  topStudent: string | null;
  students: StudentData[];
};

type AnalyticsData = Record<string, CourseAnalytics>;

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Retrieve the teacher ID from the session
  const teacherId = session?.user?.teacherId;

  useEffect(() => {
    if (!teacherId) {
      setError("Teacher ID is not available. Please log in.");
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/analytics?teacherId=${teacherId}`);
        const result = await response.json();
        
        console.log('API Response:', result); // Log the API response

        if (result.status === 'success') {
          setAnalyticsData(result.data);
          
          // Log the analytics data
          console.log('Analytics Data:', result.data);

          // Set first course as selected by default
          if (Object.keys(result.data).length > 0) {
            setSelectedCourse(Object.keys(result.data)[0]);
          }
        } else {
          setError(result.message);
        }
      } catch (error) {
        setError('Error fetching analytics data');
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [teacherId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!analyticsData || Object.keys(analyticsData).length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-yellow-50 p-4 rounded-md">
          <p className="text-yellow-700">No data available. You haven&apos;t evaluated any courses yet.</p>
        </div>
      </div>
    );
  }

  const totalCourses = Object.keys(analyticsData).length;
  const totalSheets = Object.values(analyticsData).reduce((acc, course) => acc + course.evaluatedCount, 0);
  const averageScore = (Object.values(analyticsData).reduce((acc, course) => acc + course.averageScore, 0) / totalCourses).toFixed(2);

  // Prepare bar chart data for all courses
  const overviewChartData = {
    labels: Object.values(analyticsData).map(course => course.courseName),
    datasets: [
      {
        label: 'Evaluated Answer Sheets',
        data: Object.values(analyticsData).map(course => course.evaluatedCount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Average Score',
        data: Object.values(analyticsData).map(course => course.averageScore),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
      {
        label: 'Maximum Score',
        data: Object.values(analyticsData).map(course => course.maxScore),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Teacher Analytics Dashboard</h1>
      
      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Total Courses</h2>
          <p className="text-3xl font-bold text-blue-600">{totalCourses}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Answer Sheets Checked</h2>
          <p className="text-3xl font-bold text-green-600">{totalSheets}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Average Score</h2>
          <p className="text-3xl font-bold text-purple-600">{averageScore}%</p>
        </div>
      </div>
      
      {/* All Courses Overview Chart */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Course Overview</h2>
        <div className="h-64">
          <Bar 
            data={overviewChartData} 
            options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              plugins: { 
                legend: { position: 'top' },
                title: { display: true, text: 'Course Statistics' }
              }
            }} 
          />
        </div>
      </div>
      
      {/* Course Selector */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Select Course for Detailed Analysis</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(analyticsData).map(([courseId, course]) => (
            <button
              key={courseId}
              onClick={() => setSelectedCourse(courseId)}
              className={`p-3 rounded-md text-center transition-colors ${
                selectedCourse === courseId 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {course.courseName}
            </button>
          ))}
        </div>
      </div>
      
      {/* Selected Course Analysis */}
      {selectedCourse && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          {/* Add your content here */}
        </div>
      )}
    </div>
  );
}