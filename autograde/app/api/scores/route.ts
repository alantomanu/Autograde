import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { scores } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    console.log('API endpoint hit');

    const body = await req.json();
    console.log('Received request body:', body);

    const { studentId, courseId, totalMarks, maxMarks, percentage, answerSheetUrl, checkedByTeacherId, feedback } = body;

    // Ensure studentId is a string
    const studentIdStr = studentId.toString();

    // Log each field to ensure they are present
    console.log('studentId:', studentId);
    console.log('courseId:', courseId);
    console.log('totalMarks:', totalMarks);
    console.log('maxMarks:', maxMarks);
    console.log('percentage:', percentage);
    console.log('answerSheetUrl:', answerSheetUrl);
    console.log('checkedByTeacherId:', checkedByTeacherId);
    console.log('feedback:', feedback);

    // Debug logging
    console.log('Field validation:', {
      studentId: Boolean(studentId),
      courseId: Boolean(courseId),
      totalMarks: Boolean(totalMarks),
      maxMarks: Boolean(maxMarks),
      percentage: Boolean(percentage)
    });

    // First, get the course ID from courses table
    const course = await db.query.courses.findFirst({
      where: (courses, { eq }) => eq(courses.courseCode, courseId)
    });

    if (!course) {
      console.log('Course not found');
      return NextResponse.json({
        status: 'error',
        message: "Course not found"
      }, { status: 404 });
    }

    // Check if a score already exists for this student and course
    const existingScore = await db.query.scores.findFirst({
      where: (scores, { eq, and }) => 
        and(
          eq(scores.studentId, studentIdStr),
          eq(scores.courseId, course.id)
        )
    });

    if (existingScore) {
      console.log('Score already exists:', existingScore);
      return NextResponse.json({
        status: 'reevaluation',
        message: "Score already exists for this student and course",
        existingScore: {
          totalMarks: existingScore.totalMarks,
          maxMarks: existingScore.maxMarks,
          percentage: existingScore.percentage
        }
      }, { status: 200 });
    }

    // Assuming you have a function to get the teacher's ID
    const teacher = await db.query.teachers.findFirst({
      where: (teachers, { eq }) => eq(teachers.teacherId, checkedByTeacherId)
    });

    if (!teacher) {
      console.log('Teacher not found');
      return NextResponse.json({
        status: 'error',
        message: "Teacher not found"
      }, { status: 404 });
    }

    // Use the teacher's numeric ID
    const [newScore] = await db.insert(scores)
      .values({
        studentId: studentIdStr,
        courseId: course.id,
        totalMarks,
        maxMarks,
        percentage,
        answerSheetUrl,
        checkedByTeacherId: checkedByTeacherId,
        feedback,
      })
      .returning();

    if (!newScore) {
      console.error('Failed to insert new score');
      return NextResponse.json({
        status: 'error',
        message: "Failed to save new score"
      }, { status: 500 });
    }

    console.log('Inserted new score:', newScore);

    return NextResponse.json({
      status: 'success',
      message: "Score saved successfully",
      score: newScore
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST handler:', error);
    console.error('Error saving score:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : "An unexpected error occurred"
    }, { status: 500 });
  }
}

// Add PUT endpoint for updating scores
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { studentId, courseId, totalMarks, maxMarks, percentage } = body;

    // First, get the course ID from courses table
    const course = await db.query.courses.findFirst({
      where: (courses, { eq }) => eq(courses.courseCode, courseId)
    });

    if (!course) {
      return NextResponse.json({
        status: 'error',
        message: "Course not found"
      }, { status: 404 });
    }

    // Verify the score exists before updating
    const existingScore = await db.query.scores.findFirst({
      where: (scores, { eq, and }) => 
        and(
          eq(scores.studentId, studentId.toString()),
          eq(scores.courseId, course.id)
        )
    });

    if (!existingScore) {
      return NextResponse.json({
        status: 'error',
        message: "No existing score found to update"
      }, { status: 404 });
    }

    // Update the score
    const [updatedScore] = await db.update(scores)
      .set({
        totalMarks,
        maxMarks,
        percentage
      })
      .where(
        and(
          eq(scores.studentId, studentId.toString()),
          eq(scores.courseId, course.id)
        )
      )
      .returning();

    if (!updatedScore) {
      throw new Error("Failed to update score");
    }

    return NextResponse.json({
      status: 'success',
      message: "Score updated successfully",
      score: updatedScore
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating score:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : "An unexpected error occurred"
    }, { status: 500 });
  }
} 