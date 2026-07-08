/*
  Warnings:

  - A unique constraint covering the columns `[user_id,task_id]` on the table `postulation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "task" ALTER COLUMN "status" SET DEFAULT 'publicada';

-- CreateIndex
CREATE UNIQUE INDEX "postulation_user_id_task_id_key" ON "postulation"("user_id", "task_id");
