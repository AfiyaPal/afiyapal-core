-- CreateTable
CREATE TABLE "BlogVote" (
    "id" SERIAL NOT NULL,
    "blogId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "vote" TEXT NOT NULL DEFAULT 'UP',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facility" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'CLINIC',
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "city" TEXT,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "description" TEXT,
    "services" TEXT,
    "operatingHours" TEXT,
    "adminId" INTEGER,
    "verificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "verifiedById" INTEGER,
    "verifiedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "suspensionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacilityProfessional" (
    "id" SERIAL NOT NULL,
    "facilityId" INTEGER NOT NULL,
    "doctorProfileId" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STAFF_DOCTOR',
    "addedById" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FacilityProfessional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "facilityId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'HEALTH_TALK',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "location" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'UPCOMING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BlogVote_blogId_idx" ON "BlogVote"("blogId");

-- CreateIndex
CREATE INDEX "BlogVote_userId_idx" ON "BlogVote"("userId");

-- CreateIndex
CREATE INDEX "BlogVote_vote_idx" ON "BlogVote"("vote");

-- CreateIndex
CREATE UNIQUE INDEX "BlogVote_blogId_userId_key" ON "BlogVote"("blogId", "userId");

-- CreateIndex
CREATE INDEX "Facility_verificationStatus_idx" ON "Facility"("verificationStatus");

-- CreateIndex
CREATE INDEX "Facility_country_idx" ON "Facility"("country");

-- CreateIndex
CREATE INDEX "Facility_type_idx" ON "Facility"("type");

-- CreateIndex
CREATE INDEX "Facility_createdAt_idx" ON "Facility"("createdAt");

-- CreateIndex
CREATE INDEX "FacilityProfessional_facilityId_idx" ON "FacilityProfessional"("facilityId");

-- CreateIndex
CREATE INDEX "FacilityProfessional_doctorProfileId_idx" ON "FacilityProfessional"("doctorProfileId");

-- CreateIndex
CREATE INDEX "FacilityProfessional_status_idx" ON "FacilityProfessional"("status");

-- CreateIndex
CREATE UNIQUE INDEX "FacilityProfessional_facilityId_doctorProfileId_key" ON "FacilityProfessional"("facilityId", "doctorProfileId");

-- CreateIndex
CREATE INDEX "Event_facilityId_idx" ON "Event"("facilityId");

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "Event"("status");

-- CreateIndex
CREATE INDEX "Event_startDate_idx" ON "Event"("startDate");

-- CreateIndex
CREATE INDEX "Event_type_idx" ON "Event"("type");

-- AddForeignKey
ALTER TABLE "BlogVote" ADD CONSTRAINT "BlogVote_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogVote" ADD CONSTRAINT "BlogVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacilityProfessional" ADD CONSTRAINT "FacilityProfessional_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacilityProfessional" ADD CONSTRAINT "FacilityProfessional_doctorProfileId_fkey" FOREIGN KEY ("doctorProfileId") REFERENCES "DoctorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
