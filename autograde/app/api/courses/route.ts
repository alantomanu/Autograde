import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { courses, teacherCourses } from "@/drizzle/schema";


export async function POST(req: Request) {
  try {
    console.log('Starting POST request processing...');
    
    const body = await req.json();
    console.log('Request body:', body);
    const { courseId, courseName, teacherId } = body;

    // Validate required fields
    if (!courseId || !courseName || !teacherId) {
      console.log('Missing required fields:', { courseId, courseName, teacherId });
      return NextResponse.json({
        status: 'error',
        message: "Please fill in all required fields"
      }, { status: 400 });
    }

    // First, get the teacher's database ID using their teacherId
    console.log('Looking up teacher with teacherId:', teacherId);
    const teacher = await db.query.teachers.findFirst({
      where: (teachers, { eq }) => eq(teachers.teacherId, teacherId)
    });

    if (!teacher) {
      return NextResponse.json({
        status: 'error',
        message: "Teacher not found"
      }, { status: 404 });
    }

    // Check if course exists
    const existingCourse = await db.query.courses.findFirst({
      where: (courses, { eq }) => eq(courses.courseCode, courseId)
    });

    // If course exists, check for name mismatch
    if (existingCourse) {
      if (existingCourse.courseName !== courseName) {
        return NextResponse.json({
          status: 'name_mismatch',
          existingName: existingCourse.courseName,
          providedName: courseName,
          message: `Course exists with a different name`,
          course: existingCourse
        }, { status: 200 });
      }

      // Check for existing teacher-course relationship
      const existingTeacherCourse = await db.query.teacherCourses.findFirst({
        where: (tc, { eq, and }) => and(
          eq(tc.teacherId, teacher.id),
          eq(tc.courseId, existingCourse.id)
        )
      });

      if (existingTeacherCourse) {
        return NextResponse.json({
          status: 'exists',
          course: existingCourse,
          message: "You are already associated with this course"
        }, { status: 200 });
      }

      // Create new teacher-course relationship for existing course
      await db.insert(teacherCourses).values({
        teacherId: teacher.id,
        courseId: existingCourse.id
      });

      return NextResponse.json({
        status: 'success',
        course: existingCourse,
        message: "Successfully associated with existing course"
      }, { status: 201 });
    }

    // Create new course if it doesn't exist
    const [newCourse] = await db.insert(courses)
      .values({
        courseCode: courseId,
        courseName: courseName,
      })
      .returning();

    // Create teacher-course relationship for new course
    await db.insert(teacherCourses).values({
      teacherId: teacher.id,
      courseId: newCourse.id
    });

    return NextResponse.json({
      status: 'success',
      course: newCourse,
      message: "Course created and associated successfully"
    }, { status: 201 });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      status: 'error',
      message: "An unexpected error occurred"
    }, { status: 500 });
  }
} 