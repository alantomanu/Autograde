ALTER TABLE "courses" DROP CONSTRAINT "courses_course_code_unique";--> statement-breakpoint
ALTER TABLE "courses" ADD PRIMARY KEY ("course_code");--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "id";