import { pgTable, serial, varchar, integer, timestamp, real } from "drizzle-orm/pg-core";

// 🏫 Teachers Table
export const teachers = pgTable("teachers", {
    id: serial("id").primaryKey(),
    teacherId: varchar("teacher_id", { length: 255 }).unique().notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    password: varchar("password", { length: 255 }),
    oauthId: varchar("oauth_id", { length: 255 }).unique(),
    createdAt: timestamp("created_at").defaultNow(),
});

// 📚 Courses Table (No Direct Teacher Relation)
export const courses = pgTable("courses", {
    id: serial("id").primaryKey(),  // Unique Course ID
    courseCode: varchar("course_code", { length: 255 }).unique().notNull(),
    courseName: varchar("course_name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

// 🔄 Many-to-Many Relationship: Teachers <-> Courses
export const teacherCourses = pgTable("teacher_courses", {
    id: serial("id").primaryKey(),  // Unique Row ID
    teacherId: integer("teacher_id").notNull().references(() => teachers.id, { onDelete: "cascade" }),
    courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
});

// 🏆 Scores Table
export const scores = pgTable("scores", {
    id: serial("id").primaryKey(),
    studentId: integer("student_id").notNull(),
    
    // ✅ Now references `courseId`
    courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),

    totalMarks: integer("total_marks").notNull(),
    maxMarks: integer("max_marks").notNull(),
    percentage: real("percentage").notNull(),
    cloudinaryUrl: varchar("cloudinary_url", { length: 2048 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
