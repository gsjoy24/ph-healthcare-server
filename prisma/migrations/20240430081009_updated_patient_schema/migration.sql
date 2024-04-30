/*
  Warnings:

  - You are about to drop the column `contactNumber` on the `patients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "patients" DROP COLUMN "contactNumber",
ADD COLUMN     "phone" TEXT;
