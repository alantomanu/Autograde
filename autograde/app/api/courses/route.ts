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
      console.log('Missing fields:', { courseId, courseName, teacherId });
      return NextResponse.json(
        { error: `Missing required fields: ${[
          !courseId && 'courseId',
          !courseName && 'courseName',
          !teacherId && 'teacherId'
        ].filter(Boolean).join(', ')}` },
        { status: 400 }
      );
    }

    // Check if course already exists
    const existingCourse = await db.query.courses.findFirst({
      where: (courses, { eq }) => eq(courses.courseCode, courseId)
    });

    if (existingCourse) {
      console.log('Course already exists:', existingCourse);
      return NextResponse.json(
        { error: `Course with ID ${courseId} already exists` },
        { status: 400 }
      );
    }

    // Check if teacher exists
    const teacherExists = await db.query.teachers.findFirst({
      where: (teachers, { eq }) => eq(teachers.teacherId, teacherId)
    });

    if (!teacherExists) {
      console.log('Teacher not found:', teacherId);
      return NextResponse.json(
        { error: `Teacher with ID ${teacherId} not found` },
        { status: 400 }
      );
    }

    // Create new course
    const newCourse = await db.insert(courses).values({
      courseCode: courseId,
      courseName: courseName,
      teacherId: teacherId,
    }).returning();

    console.log('Course added successfully:', newCourse[0]);

    return NextResponse.json({ 
      message: "Course added successfully",
      course: newCourse[0]
    });

  } catch (error) {
    console.error("Detailed course creation error:", {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
} 