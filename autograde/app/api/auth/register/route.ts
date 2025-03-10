import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { teachers } from "@/drizzle/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, teacherId, password, oauthId } = body;

    // Check if teacher already exists
    const existingTeacher = await db.query.teachers.findFirst({
      where: eq(teachers.teacherId, teacherId),
    });

    if (existingTeacher) {
      return NextResponse.json(
        { error: "Teacher ID already exists" },
        { status: 400 }
      );
    }

    // Hash password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Create new teacher
    const newTeacher = await db.insert(teachers).values({
      email,
      teacherId,
      password: hashedPassword,
      oauthId,
    }).returning();

    return NextResponse.json({ 
      message: "Teacher registered successfully",
      teacher: newTeacher[0]
    });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 