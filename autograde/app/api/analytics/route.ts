import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { eq, inArray } from "drizzle-orm";

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

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const teacherId = url.searchParams.get("teacherId");
    
    if (!teacherId) {
      return NextResponse.json({
        status: 'error',
        message: "Teacher ID is required"
      }, { status: 400 });
    }
    
    // Fetch scores related to the teacher
    const teacherScores = await db.query.scores.findMany({
      where: (scores) => eq(scores.checkedByTeacherId, teacherId)
    });
    
    // Fetch course details for the courses in the scores
    const courseIds = [...new Set(teacherScores.map(score => score.courseId))];
    const courseDetails = await db.query.courses.findMany({
      where: (courses) => inArray(courses.id, courseIds)
    });
    
    // Create a map for quick access to course names by courseId
    const courseMap = courseDetails.reduce<Record<number, string>>((acc, course) => {
      acc[course.id] = course.courseName;
      return acc;
    }, {});
    
    // Group scores by course and calculate statistics
    const analyticsData: Record<string, CourseAnalytics> = {};
    
    for (const score of teacherScores) {
      const courseId = score.courseId.toString();
      const courseName = courseMap[score.courseId];
      
      if (!analyticsData[courseId]) {
        analyticsData[courseId] = {
          courseName,
          evaluatedCount: 0,
          maxScore: 0,
          minScore: Number.MAX_VALUE,
          averageScore: 0,
          topStudent: null,
          students: []
        };
      }
      
      // Update course stats
      analyticsData[courseId].evaluatedCount += 1;
      analyticsData[courseId].maxScore = Math.max(analyticsData[courseId].maxScore, score.totalMarks);
      analyticsData[courseId].minScore = Math.min(analyticsData[courseId].minScore, score.totalMarks);
      
      // Track top student
      if (score.totalMarks === analyticsData[courseId].maxScore) {
        analyticsData[courseId].topStudent = score.studentId;
      }
      
      // Add student data
      analyticsData[courseId].students.push({
        studentId: score.studentId,
        totalMarks: score.totalMarks,
        percentage: score.percentage,
        evaluatedTime: score.createdAt ? score.createdAt.toISOString() : new Date().toISOString()
      });
    }
    
    // Calculate average scores and rank students
    for (const courseId in analyticsData) {
      const course = analyticsData[courseId];
      
      // Calculate average
      const totalScore = course.students.reduce((sum, student) => sum + student.totalMarks, 0);
      course.averageScore = parseFloat((totalScore / course.evaluatedCount).toFixed(2));
      
      // Rank students
      course.students.sort((a, b) => b.totalMarks - a.totalMarks);
      course.students.forEach((student, index) => {
        student.rank = index + 1;
      });
    }
    
    return NextResponse.json({
      status: 'success',
      data: analyticsData
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : "An unexpected error occurred"
    }, { status: 500 });
  }
}