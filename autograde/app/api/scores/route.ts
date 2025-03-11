import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { scores } from "@/drizzle/schema";

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

    // Validate required fields
    if (!studentId || !courseId || !totalMarks || !maxMarks || !percentage || !cloudinaryUrl) {
      const missingFields = [
        !studentId && 'studentId',
        !courseId && 'courseId',
        !totalMarks && 'totalMarks',
        !maxMarks && 'maxMarks',
        !percentage && 'percentage',
        !cloudinaryUrl && 'cloudinaryUrl'
      ].filter(Boolean);

      return NextResponse.json({
        status: 'error',
        message: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Validate numeric fields (except studentId which can be alphanumeric)
    if (isNaN(totalMarks) || isNaN(maxMarks) || isNaN(percentage)) {
      return NextResponse.json({
        status: 'error',
        message: "Invalid numeric values provided for marks or percentage"
      }, { status: 400 });
    }

    // Verify course exists
    const course = await db.query.courses.findFirst({
      where: (courses, { eq }) => eq(courses.courseCode, courseId)
    });

    if (!course) {
      return NextResponse.json({
        status: 'error',
        message: "Course not found"
      }, { status: 404 });
    }

    // Insert score into database
    const [newScore] = await db.insert(scores)
      .values({
        studentId: studentId.toString(), // Convert to string to ensure consistency
        courseId: course.id,
        totalMarks: totalMarks,
        maxMarks: maxMarks,
        percentage: percentage,
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
      message: "An unexpected error occurred"
    }, { status: 500 });
  }
} 