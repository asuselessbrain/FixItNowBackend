/*
  Warnings:

  - You are about to drop the `TechnicianProfiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TechnicianProfiles" DROP CONSTRAINT "TechnicianProfiles_userId_fkey";

-- DropTable
DROP TABLE "TechnicianProfiles";

-- CreateTable
CREATE TABLE "technician_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "experience_year" SMALLINT,
    "location" VARCHAR(100),
    "skills" VARCHAR(200),
    "average_rating" DOUBLE PRECISION DEFAULT 0.0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "technician_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "technician_profiles_userId_key" ON "technician_profiles"("userId");

-- CreateIndex
CREATE INDEX "user_id_index" ON "technician_profiles"("userId");

-- AddForeignKey
ALTER TABLE "technician_profiles" ADD CONSTRAINT "technician_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
