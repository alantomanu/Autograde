CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_code" varchar(255) NOT NULL,
	"course_name" varchar(255) NOT NULL,
	"teacher_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "courses_course_code_unique" UNIQUE("course_code")
);
--> statement-breakpoint
CREATE TABLE "scores" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"course_code" varchar(255) NOT NULL,
	"course_name" varchar(255) NOT NULL,
	"total_marks" integer NOT NULL,
	"max_marks" integer NOT NULL,
	"percentage" real NOT NULL,
	"cloudinary_url" varchar(2048) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"id" serial PRIMARY KEY NOT NULL,
	"teacher_id" varchar(255) NOT NULL,
	"email" varchar(255),
	"password" varchar(255),
	"oauth_id" varchar(255),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "teachers_teacher_id_unique" UNIQUE("teacher_id"),
	CONSTRAINT "teachers_email_unique" UNIQUE("email"),
	CONSTRAINT "teachers_oauth_id_unique" UNIQUE("oauth_id")
);
--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_teacher_id_teachers_teacher_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("teacher_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scores" ADD CONSTRAINT "scores_course_code_courses_course_code_fk" FOREIGN KEY ("course_code") REFERENCES "public"."courses"("course_code") ON DELETE cascade ON UPDATE no action;