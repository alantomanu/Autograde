ALTER TABLE "teacher_courses" DROP CONSTRAINT "teacher_courses_course_code_courses_course_code_fk";
--> statement-breakpoint
ALTER TABLE "teacher_courses" ADD COLUMN "course_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "teacher_courses" ADD CONSTRAINT "teacher_courses_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_courses" DROP COLUMN "course_code";