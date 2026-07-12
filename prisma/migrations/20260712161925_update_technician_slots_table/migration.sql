/*
  Warnings:

  - You are about to drop the column `endTime` on the `technician_slots` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `technician_slots` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[technicianId,date,slotTime]` on the table `technician_slots` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slotTime` to the `technician_slots` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "technician_slots_technicianId_date_startTime_key";

-- AlterTable
ALTER TABLE "technician_slots" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "slotTime" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "technician_slots_technicianId_date_slotTime_key" ON "technician_slots"("technicianId", "date", "slotTime");
