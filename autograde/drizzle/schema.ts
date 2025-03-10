import { pgTable, serial, varchar, integer, timestamp, real } from "drizzle-orm/pg-core";

// 🏫 Teachers Table
export const teachers = pgTable("teachers", {
    id: serial("id").primaryKey(),
    teacherId: varchar("teacher_id", { length: 255 }).unique().notNull(),
    email: varchar("email", { length: 255 }).unique(),
    password: varchar("password", { length: 255 }),
    oauthId: varchar("oauth_id", { length: 255 }).unique(),
    createdAt: timestamp("created_at").defaultNow(),
});

// 📚 Courses Table (Now using `courseCode` as Primary Key)
export const courses = pgTable("courses", {
    courseCode: varchar("course_code", { length: 255 }).primaryKey(),  // ✅ Primary Key
    courseName: varchar("course_name", { length: 255 }).notNull(),
    teacherId: varchar("teacher_id", { length: 255 }).notNull().references(() => teachers.teacherId, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
});

// 🏆 Scores Table
export const scores = pgTable("scores", {
    id: serial("id").primaryKey(),
    studentId: integer("student_id").notNull(),

    // ✅ Now correctly references `courseCode` as Primary Key
    courseCode: varchar("course_code", { length: 255 }).notNull().references(() => courses.courseCode, { onDelete: "cascade" }),

    courseName: varchar("course_name", { length: 255 }).notNull(),
    totalMarks: integer("total_marks").notNull(),
    maxMarks: integer("max_marks").notNull(),
    percentage: real("percentage").notNull(),
    cloudinaryUrl: varchar("cloudinary_url", { length: 2048 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
