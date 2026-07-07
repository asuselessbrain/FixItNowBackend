-- CreateTable
CREATE TABLE "TechnicianProfiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "experience_year" SMALLINT,
    "location" VARCHAR(100),
    "skills" VARCHAR(200),
    "average_rating" DOUBLE PRECISION DEFAULT 0.0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TechnicianProfiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TechnicianProfiles_userId_key" ON "TechnicianProfiles"("userId");

-- AddForeignKey
ALTER TABLE "TechnicianProfiles" ADD CONSTRAINT "TechnicianProfiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
