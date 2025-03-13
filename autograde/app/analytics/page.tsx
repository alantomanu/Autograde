"use client";

import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
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
import * as XLSX from 'xlsx';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);
  const [passPercentages, setPassPercentages] = useState<Record<string, number>>({});
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({});
  
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

        if (result.status === 'success') {
          setAnalyticsData(result.data);
          
          // Initialize pass percentages to 40% for each course
          const initialPassPercentages: Record<string, number> = {};
          Object.keys(result.data).forEach(courseId => {
            initialPassPercentages[courseId] = 40;
          });
          setPassPercentages(initialPassPercentages);
          
          // Initialize all courses as collapsed
          const initialExpandedState: Record<string, boolean> = {};
          Object.keys(result.data).forEach(courseId => {
            initialExpandedState[courseId] = false;
          });
          setExpandedCourses(initialExpandedState);
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

  const handlePassPercentageChange = (courseId: string, value: string) => {
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      setPassPercentages(prev => ({
        ...prev,
        [courseId]: numValue
      }));
    }
  };

  const toggleCourseExpand = (courseId: string) => {
    setExpandedCourses(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  const downloadXLSX = (courseId: string) => {
    if (!analyticsData) return;

    const course = analyticsData[courseId];
    const passThreshold = passPercentages[courseId] || 40;
    
    const worksheetData = course.students.map(student => ({
      'Student ID': student.studentId,
      'Course': course.courseName,
      'Total Marks': student.totalMarks,
      'Percentage': student.percentage.toFixed(1) + '%',
      'Status': student.percentage >= passThreshold ? 'Pass' : 'Fail',
      'Evaluation Date': new Date(student.evaluatedTime).toLocaleDateString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    XLSX.writeFile(workbook, `${course.courseName}_Students.xlsx`);
  };

  // Generate pass/fail data for pie chart
  const getPassFailData = (courseId: string) => {
    if (!analyticsData) return { pass: 0, fail: 0 };
    
    const course = analyticsData[courseId];
    const passThreshold = passPercentages[courseId] || 40;
    
    const passCount = course.students.filter(student => 
      student.percentage >= passThreshold
    ).length;
    
    return {
      pass: passCount,
      fail: course.students.length - passCount
    };
  };

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
    <div className="flex flex-col min-h-screen p-6 bg-white dark:bg-black text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 lg:px-16">
        <h3 className="text-3xl font-bold mb-10 text-center">Teacher Analytics Dashboard</h3>
        
        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg p-6 transition-all hover:shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Total Courses</h2>
            <p className="text-3xl font-bold text-blue-600">{totalCourses}</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg p-6 transition-all hover:shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Answer Sheets Checked</h2>
            <p className="text-3xl font-bold text-green-600">{totalSheets}</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg p-6 transition-all hover:shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Average Score</h2>
            <p className="text-3xl font-bold text-purple-600">{averageScore}</p>
          </div>
        </div>
        
        {/* All Courses Overview Chart */}
        <div className="bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8 transition-all hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Course Overview</h2>
          <div className="h-64">
            <Bar 
              data={{
                ...overviewChartData,
                datasets: overviewChartData.datasets.map(dataset => ({
                  ...dataset,
                  backgroundColor: dataset.label === 'Evaluated Answer Sheets' ? 'rgba(75, 192, 192, 0.6)' : 
                                   dataset.label === 'Average Score' ? 'rgba(153, 102, 255, 0.6)' : 
                                   'rgba(255, 99, 132, 0.6)',
                })),
              }} 
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
        
        {/* Individual Course Analysis Cards */}
        <div className="space-y-6">
          {Object.entries(analyticsData).map(([courseId, course]) => {
            const isExpanded = expandedCourses[courseId];
            const passFailData = getPassFailData(courseId);
            
            const pieData = {
              labels: ['Pass', 'Fail'],
              datasets: [
                {
                  data: [passFailData.pass, passFailData.fail],
                  backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                  borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                  borderWidth: 1,
                },
              ],
            };
            
            return (
              <div key={courseId} className="bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transition-all hover:shadow-lg">
                {/* Course Header - Always Visible */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{course.courseName}</h2>
                    <button 
                      onClick={() => toggleCourseExpand(courseId)}
                      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-gray-500">Evaluated Sheets</p>
                      <p className="text-2xl font-bold">{course.evaluatedCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Average Score</p>
                      <p className="text-2xl font-bold">{course.averageScore.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Max Score</p>
                      <p className="text-2xl font-bold">{course.maxScore}</p>
                    </div>
                  </div>
                </div>
                
                {/* Expandable Course Details */}
                {isExpanded && (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Pass Percentage Input */}
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-3">Set Pass Percentage</h3>
                        <div className="flex items-center space-x-4">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={passPercentages[courseId] || 40}
                            onChange={(e) => handlePassPercentageChange(courseId, e.target.value)}
                            className="p-2 border rounded w-24 text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          />
                          <span className="text-lg font-semibold">%</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          Students with scores at or above this percentage will pass
                        </p>
                      </div>
                      
                      {/* Pass/Fail Pie Chart */}
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex flex-col items-center">
                        <h3 className="text-lg font-medium mb-3">Pass/Fail Distribution</h3>
                        <div className="w-40 h-40">
                          <Pie 
                            data={pieData} 
                            options={{
                              responsive: true,
                              maintainAspectRatio: true,
                              plugins: {
                                legend: {
                                  position: 'bottom'
                                }
                              }
                            }}
                          />
                        </div>
                        <div className="mt-2 text-center">
                          <p className="text-sm dark:text-gray-400">
                            Pass: {passFailData.pass} students ({((passFailData.pass / course.students.length) * 100).toFixed(1)}%)
                          </p>
                          <p className="text-sm dark:text-gray-400">
                            Fail: {passFailData.fail} students ({((passFailData.fail / course.students.length) * 100).toFixed(1)}%)
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Student Results Table */}
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Student Results</h3>
                        <div className="flex-grow flex justify-end mr-8">
                          <button 
                            onClick={() => downloadXLSX(courseId)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center"
                          >
                            Download XLSX
                          </button>
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Student ID
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Total Marks
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Percentage
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                            {course.students.map((student, index) => (
                              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{student.studentId}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 dark:text-gray-100">{student.totalMarks}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 dark:text-gray-100">{student.percentage.toFixed(1)}%</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    student.percentage >= (passPercentages[courseId] || 40)
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {student.percentage >= (passPercentages[courseId] || 40) ? 'Pass' : 'Fail'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}