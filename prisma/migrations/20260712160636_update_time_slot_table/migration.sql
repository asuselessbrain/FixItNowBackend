/*
  Warnings:

  - You are about to drop the column `slotTime` on the `technician_slots` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[technicianId,date,startTime]` on the table `technician_slots` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endTime` to the `technician_slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `technician_slots` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "technician_slots_technicianId_date_slotTime_key";

-- AlterTable
ALTER TABLE "technician_slots" DROP COLUMN "slotTime",
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "technician_slots_technicianId_date_startTime_key" ON "technician_slots"("technicianId", "date", "startTime");
