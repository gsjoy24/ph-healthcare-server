/*
  Warnings:

  - You are about to drop the column `appointtmentId` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[appointmentId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `appointmentId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_appointtmentId_fkey";

-- DropIndex
DROP INDEX "payments_appointtmentId_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "appointtmentId",
ADD COLUMN     "appointmentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "payments_appointmentId_key" ON "payments"("appointmentId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
