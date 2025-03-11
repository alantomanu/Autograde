import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { courses } from "@/drizzle/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { courseId, courseName, teacherId } = body;

    console.log('Server received data:', { courseId, courseName, teacherId });

    // Validate required fields
    if (!courseId || !courseName || !teacherId) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    // Check if course exists and get its details
    const existingCourse = await db.query.courses.findFirst({
      where: (courses, { eq }) => eq(courses.courseCode, courseId)
    });

    if (existingCourse) {
      return NextResponse.json({
        status: 'exists',
        message: "Course already exists",
        course: {
          courseCode: existingCourse.courseCode,
          courseName: existingCourse.courseName
        }
      });
    }

    // Create new course
    const newCourse = await db.insert(courses).values({
      courseCode: courseId,
      courseName: courseName,
      teacherId: teacherId,
    }).returning();

    return NextResponse.json({ 
      status: 'success',
      message: "Course added successfully",
      course: newCourse[0]
    });

  } catch (error) {
    console.error("Course operation error:", error);
    return NextResponse.json(
      { error: "Unable to process request. Please try again." },
      { status: 500 }
    );
  }
} 