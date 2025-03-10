ALTER TABLE "courses" DROP CONSTRAINT "courses_teacher_id_teachers_id_fk";
--> statement-breakpoint
ALTER TABLE "scores" DROP CONSTRAINT "scores_course_id_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "teacher_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "teachers" ALTER COLUMN "oauth_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "course_code" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "scores" ADD COLUMN "course_code" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "scores" ADD COLUMN "course_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "scores" ADD COLUMN "total_marks" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "scores" ADD COLUMN "max_marks" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "scores" ADD COLUMN "percentage" real NOT NULL;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "teacher_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "email" varchar(255);--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "password" varchar(255);--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_teacher_id_teachers_teacher_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("teacher_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scores" ADD CONSTRAINT "scores_course_code_courses_course_code_fk" FOREIGN KEY ("course_code") REFERENCES "public"."courses"("course_code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scores" DROP COLUMN "course_id";--> statement-breakpoint
ALTER TABLE "scores" DROP COLUMN "score";--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_course_code_unique" UNIQUE("course_code");--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_teacher_id_unique" UNIQUE("teacher_id");--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_email_unique" UNIQUE("email");