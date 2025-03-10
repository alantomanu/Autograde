CREATE TABLE "courses" (
	"course_code" varchar(255) PRIMARY KEY NOT NULL,
	"course_name" varchar(255) NOT NULL,
	"teacher_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scores" (
	"student_id" integer NOT NULL,
	"course_code" varchar(255) NOT NULL,
	"course_name" varchar(255) NOT NULL,
	"total_marks" integer NOT NULL,
	"max_marks" integer NOT NULL,
	"percentage" real NOT NULL,
	"cloudinary_url" varchar(2048) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"teacher_id" varchar(255) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL
);
