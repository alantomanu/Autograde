import { pgTable, serial, varchar, integer, timestamp, real, jsonb } from "drizzle-orm/pg-core";


export const teachers = pgTable("teachers", {
    id: serial("id").primaryKey(),
    teacherId: varchar("teacher_id", { length: 255 }).unique().notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    password: varchar("password", { length: 255 }),
    oauthId: varchar("oauth_id", { length: 255 }).unique(),
    createdAt: timestamp("created_at").defaultNow(),
});


export const courses = pgTable("courses", {
    id: serial("id").primaryKey(),  
    courseCode: varchar("course_code", { length: 255 }).unique().notNull(),
    courseName: varchar("course_name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});


export const teacherCourses = pgTable("teacher_courses", {
    id: serial("id").primaryKey(),  
    teacherId: integer("teacher_id").notNull().references(() => teachers.id, { onDelete: "cascade" }),
    courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
});


export const scores = pgTable("scores", {
    id: serial("id").primaryKey(),
    studentId: varchar("student_id", { length: 255 }).notNull(),
    courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),

 
    checkedByTeacherId: varchar("checked_by_teacher_id", { length: 255 }).notNull(),

    totalMarks: integer("total_marks").notNull(),
    maxMarks: integer("max_marks").notNull(),
    percentage: real("percentage").notNull(),

  
    feedback: jsonb("feedback").notNull(),


    answerSheetUrl: varchar("answer_sheet_url", { length: 2048 }).notNull(),

    createdAt: timestamp("created_at").defaultNow(),
});
