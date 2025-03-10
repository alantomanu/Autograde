import { pgTable, varchar, integer, real,  } from "drizzle-orm/pg-core";

// Teachers Table
export const teachers = pgTable("teachers", {
    teacher_id: varchar("teacher_id", { length: 255 }).primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
});

// Courses Table
export const courses = pgTable("courses", {
    course_code: varchar("course_code", { length: 255 }).primaryKey(),
    course_name: varchar("course_name", { length: 255 }).notNull(),
    teacher_id: varchar("teacher_id", { length: 255 }).notNull(),
});

// Scores Table
export const scores = pgTable("scores", {
    student_id: integer("student_id").notNull(),
    course_code: varchar("course_code", { length: 255 }).notNull(),
    course_name: varchar("course_name", { length: 255 }).notNull(),
    total_marks: integer("total_marks").notNull(),
    max_marks: integer("max_marks").notNull(),
    percentage: real("percentage").notNull(),
    cloudinary_url: varchar("cloudinary_url", { length: 2048 }).notNull(),
});
