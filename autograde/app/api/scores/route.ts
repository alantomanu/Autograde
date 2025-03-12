import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { scores } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, courseId, totalMarks, maxMarks, percentage, cloudinaryUrl } = body;

    // Debug logging
    console.log('Received request body:', body);
    console.log('Field validation:', {
      studentId: Boolean(studentId),
      courseId: Boolean(courseId),
      totalMarks: Boolean(totalMarks),
      maxMarks: Boolean(maxMarks),
      percentage: Boolean(percentage),
      cloudinaryUrl: Boolean(cloudinaryUrl)
    });

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

    // Check if a score already exists for this student and course
    const existingScore = await db.query.scores.findFirst({
      where: (scores, { eq, and }) => 
        and(
          eq(scores.studentId, studentId.toString()),
          eq(scores.courseId, course.id)
        )
    });

    // If score exists, return it with reevaluation status
    if (existingScore) {
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

    // If no existing score, insert new score
    const [newScore] = await db.insert(scores)
      .values({
        studentId: studentId.toString(),
        courseId: course.id,
        totalMarks,
        maxMarks,
        percentage,
        cloudinaryUrl
      })
      .returning();

    return NextResponse.json({
      status: 'success',
      message: "Score saved successfully",
      score: newScore
    }, { status: 201 });

  } catch (error) {
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
    const { studentId, courseId, totalMarks, maxMarks, percentage, cloudinaryUrl } = body;

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
        percentage,
        cloudinaryUrl
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