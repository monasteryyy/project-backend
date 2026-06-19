/*
  Warnings:

  - You are about to drop the column `value` on the `task` table. All the data in the column will be lost.
  - Added the required column `amount` to the `task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task" DROP COLUMN "value",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL;
