-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "preferredLanguage" TEXT NOT NULL DEFAULT 'en',
    "passwordHash" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "language" TEXT NOT NULL DEFAULT 'en',
    "contentCategory" TEXT NOT NULL DEFAULT 'GENERAL_WELLNESS',
    "medicalReviewStatus" TEXT NOT NULL DEFAULT 'NOT_SUBMITTED',
    "reviewedById" INTEGER,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "publishedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "creatorId" INTEGER NOT NULL,
    "categoryId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "blogId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "parentCommentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "blogId" INTEGER NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "mediaType" TEXT,
    "altText" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "country" TEXT,
    "cityRegion" TEXT,
    "licenseNumber" TEXT,
    "specialty" TEXT,
    "languagesSpoken" TEXT,
    "yearsOfExperience" INTEGER,
    "bio" TEXT,
    "verificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "availabilityStatus" TEXT NOT NULL DEFAULT 'UNAVAILABLE',
    "verifiedById" INTEGER,
    "verifiedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "suspensionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SymptomCheckLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "language" TEXT NOT NULL DEFAULT 'en',
    "symptomsSummary" TEXT NOT NULL,
    "aiResponseSummary" TEXT,
    "symptomCategory" TEXT,
    "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
    "recommendedNextStep" TEXT,
    "escalationSuggested" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SymptomCheckLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiInteractionFlag" (
    "id" SERIAL NOT NULL,
    "symptomCheckLogId" INTEGER,
    "mentalHealthInteractionId" INTEGER,
    "userId" INTEGER,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "category" TEXT NOT NULL,
    "trigger" TEXT NOT NULL DEFAULT 'AUTOMATIC_RISK_RULE',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "assignedReviewerId" INTEGER,
    "adminNotes" TEXT,
    "reviewerNotes" TEXT,
    "resolutionNotes" TEXT,
    "escalatedConsultationRequestId" INTEGER,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiInteractionFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsultationRequest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "assignedDoctorId" INTEGER,
    "reasonSummary" TEXT NOT NULL,
    "preferredLanguage" TEXT NOT NULL DEFAULT 'en',
    "countryRegion" TEXT,
    "urgencyLevel" TEXT NOT NULL DEFAULT 'LOW',
    "requestedSpecialty" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsultationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafetyReport" (
    "id" SERIAL NOT NULL,
    "reporterUserId" INTEGER,
    "assignedAdminId" INTEGER,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "resolutionNotes" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SafetyReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafetyReportActionHistory" (
    "id" SERIAL NOT NULL,
    "reportId" INTEGER NOT NULL,
    "actorAdminId" INTEGER,
    "actionType" TEXT NOT NULL,
    "fromStatus" TEXT,
    "toStatus" TEXT,
    "fromPriority" TEXT,
    "toPriority" TEXT,
    "fromAdminId" INTEGER,
    "toAdminId" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SafetyReportActionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentalHealthInteraction" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "language" TEXT NOT NULL DEFAULT 'en',
    "moodCategory" TEXT NOT NULL DEFAULT 'GENERAL_SUPPORT',
    "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
    "interactionSummary" TEXT NOT NULL,
    "aiResponseSummary" TEXT,
    "supportResourcesShown" TEXT,
    "escalationSuggested" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MentalHealthInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentalHealthResource" (
    "id" SERIAL NOT NULL,
    "hotlineName" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone" TEXT,
    "website" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MentalHealthResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAuditLog" (
    "id" SERIAL NOT NULL,
    "adminUserId" INTEGER,
    "actionType" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminSensitiveHealthAccessGrant" (
    "id" SERIAL NOT NULL,
    "adminUserId" INTEGER NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminSensitiveHealthAccessGrant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformSetting" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthResource" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HealthResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "recipientUserId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "targetType" TEXT,
    "targetId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'UNREAD',
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");

-- CreateIndex
CREATE INDEX "Blog_status_idx" ON "Blog"("status");

-- CreateIndex
CREATE INDEX "Blog_language_idx" ON "Blog"("language");

-- CreateIndex
CREATE INDEX "Blog_contentCategory_idx" ON "Blog"("contentCategory");

-- CreateIndex
CREATE INDEX "Blog_medicalReviewStatus_idx" ON "Blog"("medicalReviewStatus");

-- CreateIndex
CREATE INDEX "Blog_reviewedAt_idx" ON "Blog"("reviewedAt");

-- CreateIndex
CREATE INDEX "Blog_publishedAt_idx" ON "Blog"("publishedAt");

-- CreateIndex
CREATE INDEX "Blog_createdAt_idx" ON "Blog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorProfile_userId_key" ON "DoctorProfile"("userId");

-- CreateIndex
CREATE INDEX "DoctorProfile_verificationStatus_idx" ON "DoctorProfile"("verificationStatus");

-- CreateIndex
CREATE INDEX "DoctorProfile_specialty_idx" ON "DoctorProfile"("specialty");

-- CreateIndex
CREATE INDEX "DoctorProfile_createdAt_idx" ON "DoctorProfile"("createdAt");

-- CreateIndex
CREATE INDEX "SymptomCheckLog_userId_idx" ON "SymptomCheckLog"("userId");

-- CreateIndex
CREATE INDEX "SymptomCheckLog_riskLevel_idx" ON "SymptomCheckLog"("riskLevel");

-- CreateIndex
CREATE INDEX "SymptomCheckLog_language_idx" ON "SymptomCheckLog"("language");

-- CreateIndex
CREATE INDEX "SymptomCheckLog_status_idx" ON "SymptomCheckLog"("status");

-- CreateIndex
CREATE INDEX "SymptomCheckLog_escalationSuggested_idx" ON "SymptomCheckLog"("escalationSuggested");

-- CreateIndex
CREATE INDEX "SymptomCheckLog_createdAt_idx" ON "SymptomCheckLog"("createdAt");

-- CreateIndex
CREATE INDEX "AiInteractionFlag_symptomCheckLogId_idx" ON "AiInteractionFlag"("symptomCheckLogId");

-- CreateIndex
CREATE INDEX "AiInteractionFlag_mentalHealthInteractionId_idx" ON "AiInteractionFlag"("mentalHealthInteractionId");

-- CreateIndex
CREATE INDEX "AiInteractionFlag_userId_idx" ON "AiInteractionFlag"("userId");

-- CreateIndex
CREATE INDEX "AiInteractionFlag_assignedReviewerId_idx" ON "AiInteractionFlag"("assignedReviewerId");

-- CreateIndex
CREATE INDEX "AiInteractionFlag_status_idx" ON "AiInteractionFlag"("status");

-- CreateIndex
CREATE INDEX "AiInteractionFlag_priority_idx" ON "AiInteractionFlag"("priority");

-- CreateIndex
CREATE INDEX "AiInteractionFlag_category_idx" ON "AiInteractionFlag"("category");

-- CreateIndex
CREATE INDEX "AiInteractionFlag_trigger_idx" ON "AiInteractionFlag"("trigger");

-- CreateIndex
CREATE INDEX "AiInteractionFlag_createdAt_idx" ON "AiInteractionFlag"("createdAt");

-- CreateIndex
CREATE INDEX "ConsultationRequest_userId_idx" ON "ConsultationRequest"("userId");

-- CreateIndex
CREATE INDEX "ConsultationRequest_assignedDoctorId_idx" ON "ConsultationRequest"("assignedDoctorId");

-- CreateIndex
CREATE INDEX "ConsultationRequest_status_idx" ON "ConsultationRequest"("status");

-- CreateIndex
CREATE INDEX "ConsultationRequest_urgencyLevel_idx" ON "ConsultationRequest"("urgencyLevel");

-- CreateIndex
CREATE INDEX "ConsultationRequest_preferredLanguage_idx" ON "ConsultationRequest"("preferredLanguage");

-- CreateIndex
CREATE INDEX "ConsultationRequest_requestedSpecialty_idx" ON "ConsultationRequest"("requestedSpecialty");

-- CreateIndex
CREATE INDEX "ConsultationRequest_createdAt_idx" ON "ConsultationRequest"("createdAt");

-- CreateIndex
CREATE INDEX "SafetyReport_reporterUserId_idx" ON "SafetyReport"("reporterUserId");

-- CreateIndex
CREATE INDEX "SafetyReport_assignedAdminId_idx" ON "SafetyReport"("assignedAdminId");

-- CreateIndex
CREATE INDEX "SafetyReport_type_idx" ON "SafetyReport"("type");

-- CreateIndex
CREATE INDEX "SafetyReport_status_idx" ON "SafetyReport"("status");

-- CreateIndex
CREATE INDEX "SafetyReport_priority_idx" ON "SafetyReport"("priority");

-- CreateIndex
CREATE INDEX "SafetyReport_createdAt_idx" ON "SafetyReport"("createdAt");

-- CreateIndex
CREATE INDEX "SafetyReportActionHistory_reportId_idx" ON "SafetyReportActionHistory"("reportId");

-- CreateIndex
CREATE INDEX "SafetyReportActionHistory_actorAdminId_idx" ON "SafetyReportActionHistory"("actorAdminId");

-- CreateIndex
CREATE INDEX "SafetyReportActionHistory_actionType_idx" ON "SafetyReportActionHistory"("actionType");

-- CreateIndex
CREATE INDEX "SafetyReportActionHistory_createdAt_idx" ON "SafetyReportActionHistory"("createdAt");

-- CreateIndex
CREATE INDEX "MentalHealthInteraction_userId_idx" ON "MentalHealthInteraction"("userId");

-- CreateIndex
CREATE INDEX "MentalHealthInteraction_language_idx" ON "MentalHealthInteraction"("language");

-- CreateIndex
CREATE INDEX "MentalHealthInteraction_moodCategory_idx" ON "MentalHealthInteraction"("moodCategory");

-- CreateIndex
CREATE INDEX "MentalHealthInteraction_riskLevel_idx" ON "MentalHealthInteraction"("riskLevel");

-- CreateIndex
CREATE INDEX "MentalHealthInteraction_escalationSuggested_idx" ON "MentalHealthInteraction"("escalationSuggested");

-- CreateIndex
CREATE INDEX "MentalHealthInteraction_status_idx" ON "MentalHealthInteraction"("status");

-- CreateIndex
CREATE INDEX "MentalHealthInteraction_createdAt_idx" ON "MentalHealthInteraction"("createdAt");

-- CreateIndex
CREATE INDEX "MentalHealthResource_country_idx" ON "MentalHealthResource"("country");

-- CreateIndex
CREATE INDEX "MentalHealthResource_isActive_idx" ON "MentalHealthResource"("isActive");

-- CreateIndex
CREATE INDEX "MentalHealthResource_createdAt_idx" ON "MentalHealthResource"("createdAt");

-- CreateIndex
CREATE INDEX "AdminAuditLog_adminUserId_idx" ON "AdminAuditLog"("adminUserId");

-- CreateIndex
CREATE INDEX "AdminAuditLog_actionType_idx" ON "AdminAuditLog"("actionType");

-- CreateIndex
CREATE INDEX "AdminAuditLog_targetType_idx" ON "AdminAuditLog"("targetType");

-- CreateIndex
CREATE INDEX "AdminAuditLog_targetId_idx" ON "AdminAuditLog"("targetId");

-- CreateIndex
CREATE INDEX "AdminAuditLog_createdAt_idx" ON "AdminAuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AdminSensitiveHealthAccessGrant_adminUserId_idx" ON "AdminSensitiveHealthAccessGrant"("adminUserId");

-- CreateIndex
CREATE INDEX "AdminSensitiveHealthAccessGrant_targetType_idx" ON "AdminSensitiveHealthAccessGrant"("targetType");

-- CreateIndex
CREATE INDEX "AdminSensitiveHealthAccessGrant_targetId_idx" ON "AdminSensitiveHealthAccessGrant"("targetId");

-- CreateIndex
CREATE INDEX "AdminSensitiveHealthAccessGrant_expiresAt_idx" ON "AdminSensitiveHealthAccessGrant"("expiresAt");

-- CreateIndex
CREATE INDEX "AdminSensitiveHealthAccessGrant_createdAt_idx" ON "AdminSensitiveHealthAccessGrant"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformSetting_key_key" ON "PlatformSetting"("key");

-- CreateIndex
CREATE INDEX "PlatformSetting_key_idx" ON "PlatformSetting"("key");

-- CreateIndex
CREATE INDEX "PlatformSetting_updatedById_idx" ON "PlatformSetting"("updatedById");

-- CreateIndex
CREATE INDEX "PlatformSetting_updatedAt_idx" ON "PlatformSetting"("updatedAt");

-- CreateIndex
CREATE INDEX "HealthResource_type_idx" ON "HealthResource"("type");

-- CreateIndex
CREATE INDEX "HealthResource_country_idx" ON "HealthResource"("country");

-- CreateIndex
CREATE INDEX "HealthResource_region_idx" ON "HealthResource"("region");

-- CreateIndex
CREATE INDEX "HealthResource_isActive_idx" ON "HealthResource"("isActive");

-- CreateIndex
CREATE INDEX "HealthResource_createdAt_idx" ON "HealthResource"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_recipientUserId_idx" ON "Notification"("recipientUserId");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_priority_idx" ON "Notification"("priority");

-- CreateIndex
CREATE INDEX "Notification_status_idx" ON "Notification"("status");

-- CreateIndex
CREATE INDEX "Notification_targetType_targetId_idx" ON "Notification"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
