/*
  Warnings:

  - The primary key for the `doctor_specialties` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `specialityId` on the `doctor_specialties` table. All the data in the column will be lost.
  - Added the required column `specialtyId` to the `doctor_specialties` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "doctor_specialties" DROP CONSTRAINT "doctor_specialties_specialityId_fkey";

-- AlterTable
ALTER TABLE "doctor_specialties" DROP CONSTRAINT "doctor_specialties_pkey",
DROP COLUMN "specialityId",
ADD COLUMN     "specialtyId" TEXT NOT NULL,
ADD CONSTRAINT "doctor_specialties_pkey" PRIMARY KEY ("doctorId", "specialtyId");

-- AddForeignKey
ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
