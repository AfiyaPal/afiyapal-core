-- Add tags to public blog/content articles for list filtering and detail pages.
ALTER TABLE "Blog" ADD COLUMN "tags" TEXT NOT NULL DEFAULT '';

-- Contact form submissions persisted from the homepage contact section.
CREATE TABLE "ContactSubmission" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "jobPosition" TEXT,
    "services" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "source" TEXT NOT NULL DEFAULT 'HOME_CONTACT_FORM',
    "ipHash" TEXT NOT NULL,
    "userAgent" TEXT,
    "adminNotes" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ContactSubmission_status_idx" ON "ContactSubmission"("status");
CREATE INDEX "ContactSubmission_email_idx" ON "ContactSubmission"("email");
CREATE INDEX "ContactSubmission_ipHash_idx" ON "ContactSubmission"("ipHash");
CREATE INDEX "ContactSubmission_createdAt_idx" ON "ContactSubmission"("createdAt");
CREATE INDEX "ContactSubmission_reviewedAt_idx" ON "ContactSubmission"("reviewedAt");
