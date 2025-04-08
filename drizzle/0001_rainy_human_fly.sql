ALTER TABLE "scores" DROP CONSTRAINT "scores_checked_by_teacher_id_teachers_id_fk";
--> statement-breakpoint
ALTER TABLE "scores" ALTER COLUMN "checked_by_teacher_id" SET DATA TYPE varchar(255);