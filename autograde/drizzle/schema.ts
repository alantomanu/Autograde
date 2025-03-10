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

// 📚 Courses Table (Fixing Primary Key Issue)
export const courses = pgTable("courses", {
    id: serial("id").primaryKey(),  // ✅ Only one primary key
    courseCode: varchar("course_code", { length: 255 }).unique().notNull(),  // ✅ Unique (Not Primary Key)
    courseName: varchar("course_name", { length: 255 }).notNull(),
    teacherId: varchar("teacher_id", { length: 255 }).notNull().references(() => teachers.teacherId, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
});

// 🏆 Scores Table (Fixed Foreign Key)
export const scores = pgTable("scores", {
    id: serial("id").primaryKey(),
    studentId: integer("student_id").notNull(),

    // ✅ Now correctly references `courseCode` (which is unique)
    courseCode: varchar("course_code", { length: 255 }).notNull().references(() => courses.courseCode, { onDelete: "cascade" }),

    courseName: varchar("course_name", { length: 255 }).notNull(),
    totalMarks: integer("total_marks").notNull(),
    maxMarks: integer("max_marks").notNull(),
    percentage: real("percentage").notNull(),
    cloudinaryUrl: varchar("cloudinary_url", { length: 2048 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
