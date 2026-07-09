import "dotenv/config";

import bcrypt from "bcryptjs";
import { prisma } from "../db/prisma.seed";

const SEED_PREFIX = "[Seed]";
const SEED_DOMAIN = "afiyapal.seed";

const roles = [
  "USER",
  "DOCTOR",
  "ADMIN",
  "SUPER_ADMIN",
  "MEDICAL_REVIEWER",
  "SUPPORT_ADMIN",
  "DOCTOR_MANAGER",
  "CONTENT_MANAGER",
] as const;

const userStatuses = ["ACTIVE", "SUSPENDED", "DELETED"] as const;
const doctorStatuses = [
  "PENDING",
  "VERIFIED",
  "REJECTED",
  "SUSPENDED",
] as const;
const riskLevels = ["LOW", "MEDIUM", "HIGH", "EMERGENCY"] as const;
const symptomStatuses = [
  "COMPLETED",
  "REVIEWED",
  "ESCALATED",
  "FAILED",
] as const;
const aiFlagStatuses = ["OPEN", "IN_REVIEW", "RESOLVED", "ESCALATED"] as const;
const aiFlagPriorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
const aiFlagCategories = [
  "EMERGENCY_SYMPTOMS",
  "MENTAL_HEALTH_CRISIS",
  "PREGNANCY_OR_CHILD_HIGH_RISK",
  "USER_REPORTED_WRONG_ANSWER",
  "LOW_CONFIDENCE_AI_RESPONSE",
  "REPEATED_UNRESOLVED_SYMPTOMS",
] as const;
const aiFlagTriggers = [
  "AUTOMATIC_RISK_RULE",
  "USER_REPORT",
  "REVIEWER_CREATED",
] as const;
const articleStatuses = [
  "DRAFT",
  "PENDING_REVIEW",
  "PUBLISHED",
  "ARCHIVED",
] as const;
const articleCategories = [
  "MALARIA",
  "MATERNAL_HEALTH",
  "NUTRITION",
  "MENTAL_HEALTH",
  "FIRST_AID",
  "GENERAL_WELLNESS",
] as const;
const languages = ["en", "sw"] as const;
const medicalReviewStatuses = [
  "NOT_SUBMITTED",
  "PENDING",
  "APPROVED",
  "CHANGES_REQUESTED",
  "REJECTED",
] as const;
const consultationStatuses = [
  "NEW",
  "AWAITING_ASSIGNMENT",
  "ASSIGNED",
  "ACCEPTED_BY_DOCTOR",
  "COMPLETED",
  "CANCELLED",
  "ESCALATED",
] as const;
const urgencyLevels = ["LOW", "MEDIUM", "HIGH", "EMERGENCY"] as const;
const specialties = [
  "General clinician",
  "Mental health",
  "Maternal health",
  "Pediatrics",
  "Nutrition",
  "First aid",
  "Malaria care",
  "Other",
] as const;
const reportTypes = [
  "AI_RESPONSE_REPORT",
  "DOCTOR_REPORT",
  "USER_REPORT",
  "CONTENT_REPORT",
  "PLATFORM_ISSUE",
  "SAFETY_INCIDENT",
] as const;
const reportStatuses = ["OPEN", "IN_REVIEW", "RESOLVED", "DISMISSED"] as const;
const reportPriorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
const safetyReportActionTypes = [
  "CREATED",
  "STATUS_CHANGED",
  "PRIORITY_CHANGED",
  "ASSIGNED_ADMIN_CHANGED",
  "RESOLUTION_UPDATED",
  "NOTE_ADDED",
] as const;
const auditActions = [
  "USER_ACTIVATED",
  "USER_SUSPENDED",
  "USER_STATUS_CHANGED",
  "USER_ROLE_CHANGED",
  "DOCTOR_APPROVED",
  "DOCTOR_REJECTED",
  "DOCTOR_SUSPENDED",
  "ARTICLE_PUBLISHED",
  "ARTICLE_UNPUBLISHED",
  "ARTICLE_ARCHIVED",
  "AI_FLAG_RESOLVED",
  "AI_FLAG_ESCALATED",
  "CONSULTATION_ASSIGNED",
  "CONSULTATION_STATUS_CHANGED",
  "REPORT_RESOLVED",
  "SENSITIVE_HEALTH_DETAILS_VIEWED",
  "PLATFORM_SETTINGS_UPDATED",
  "HEALTH_RESOURCE_CREATED",
  "HEALTH_RESOURCE_UPDATED",
  "HEALTH_RESOURCE_STATUS_CHANGED",
] as const;
const auditTargetTypes = [
  "User",
  "DoctorProfile",
  "Blog",
  "AiInteractionFlag",
  "ConsultationRequest",
  "SafetyReport",
  "SymptomCheckLog",
  "MentalHealthInteraction",
  "PlatformSetting",
  "HealthResource",
] as const;
const notificationTypes = [
  "DOCTOR_APPLICATION_SUBMITTED",
  "DOCTOR_APPROVED",
  "DOCTOR_REJECTED",
  "AI_FLAG_CRITICAL",
  "CONSULTATION_URGENT",
  "CONSULTATION_ASSIGNED",
  "DOCTOR_RESPONDED",
  "AI_RESPONSE_REPORTED",
  "CONTENT_PENDING_REVIEW",
  "REPORT_RESOLVED",
  "SAFETY_REPORT_SUBMITTED",
] as const;
const notificationPriorities = ["LOW", "NORMAL", "HIGH", "CRITICAL"] as const;
const healthResourceTypes = [
  "CLINIC",
  "HOTLINE",
  "EMERGENCY_CONTACT",
  "COUNTRY_RESOURCE",
] as const;

function seedEmail(slug: string) {
  return `${slug}@${SEED_DOMAIN}`;
}

function seedUsername(slug: string) {
  return `seed_${slug.replace(/[^a-z0-9_]/gi, "_").toLowerCase()}`;
}

function json(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function monthsAgo(months: number) {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
}

async function cleanupSeedData() {
  const seededBlogs = await prisma.blog.findMany({
    where: { slug: { startsWith: "afiyapal-" } },
    select: { id: true },
  });
  const seededBlogIds = seededBlogs.map((blog) => blog.id);

  if (seededBlogIds.length > 0) {
    await prisma.comment.deleteMany({
      where: { blogId: { in: seededBlogIds } },
    });
    await prisma.media.deleteMany({ where: { blogId: { in: seededBlogIds } } });
    await prisma.blog.deleteMany({ where: { id: { in: seededBlogIds } } });
  }

  await prisma.contactSubmission.deleteMany({
    where: { source: "SEED_HOME_CONTACT_FORM" },
  });

  await prisma.notification.deleteMany({
    where: { title: { startsWith: SEED_PREFIX } },
  });
  await prisma.adminSensitiveHealthAccessGrant.deleteMany({
    where: { reason: { contains: SEED_PREFIX } },
  });
  await prisma.adminAuditLog.deleteMany({
    where: { reason: { contains: SEED_PREFIX } },
  });
  await prisma.safetyReportActionHistory.deleteMany({
    where: { note: { contains: SEED_PREFIX } },
  });
  await prisma.safetyReport.deleteMany({
    where: { title: { startsWith: SEED_PREFIX } },
  });
  await prisma.consultationRequest.deleteMany({
    where: { reasonSummary: { startsWith: SEED_PREFIX } },
  });
  await prisma.aiInteractionFlag.deleteMany({
    where: { title: { startsWith: SEED_PREFIX } },
  });
  await prisma.symptomCheckLog.deleteMany({
    where: { symptomsSummary: { startsWith: SEED_PREFIX } },
  });
  await prisma.mentalHealthInteraction.deleteMany({
    where: { interactionSummary: { startsWith: SEED_PREFIX } },
  });
  await prisma.mentalHealthResource.deleteMany({
    where: { hotlineName: { startsWith: SEED_PREFIX } },
  });
  await prisma.healthResource.deleteMany({
    where: { name: { startsWith: SEED_PREFIX } },
  });
  await prisma.doctorProfile.deleteMany({
    where: { email: { endsWith: `@${SEED_DOMAIN}` } },
  });
  await prisma.platformSetting.deleteMany({
    where: { key: { startsWith: "seed." } },
  });
}

async function upsertSeedUsers(passwordHash: string) {
  const users: Record<string, { id: number; role: string; email: string }> = {};

  for (const role of roles) {
    const slug = role.toLowerCase();
    const status = role === "USER" ? "ACTIVE" : "ACTIVE";
    const user = await prisma.user.upsert({
      where: { email: seedEmail(slug) },
      update: {
        username: seedUsername(slug),
        phone: role === "USER" ? "0700000000" : null,
        preferredLanguage: role === "DOCTOR" ? "sw" : "en",
        passwordHash,
        role,
        status,
        isVerified: true,
      },
      create: {
        username: seedUsername(slug),
        email: seedEmail(slug),
        phone: role === "USER" ? "0700000000" : null,
        preferredLanguage: role === "DOCTOR" ? "sw" : "en",
        passwordHash,
        role,
        status,
        isVerified: true,
      },
    });
    users[role] = { id: user.id, role: user.role, email: user.email };
  }

  for (const status of userStatuses) {
    const slug = `user_${status.toLowerCase()}`;
    const user = await prisma.user.upsert({
      where: { email: seedEmail(slug) },
      update: {
        username: seedUsername(slug),
        passwordHash,
        role: "USER",
        status,
        preferredLanguage: status === "SUSPENDED" ? "sw" : "en",
        isVerified: status !== "DELETED",
      },
      create: {
        username: seedUsername(slug),
        email: seedEmail(slug),
        passwordHash,
        role: "USER",
        status,
        preferredLanguage: status === "SUSPENDED" ? "sw" : "en",
        isVerified: status !== "DELETED",
      },
    });
    users[`USER_${status}`] = {
      id: user.id,
      role: user.role,
      email: user.email,
    };
  }

  return users;
}

async function createDoctorProfiles(
  users: Record<string, { id: number; role: string; email: string }>,
) {
  const doctors: Record<
    string,
    { id: number; userId?: number | null; status: string }
  > = {};

  for (const [index, status] of doctorStatuses.entries()) {
    const userSlug = `doctor_${status.toLowerCase()}`;
    const doctorUser = await prisma.user.upsert({
      where: { email: seedEmail(userSlug) },
      update: {
        username: seedUsername(userSlug),
        passwordHash: await bcrypt.hash("Password123!", 12),
        role: "DOCTOR",
        status: "ACTIVE",
        isVerified: status === "VERIFIED",
      },
      create: {
        username: seedUsername(userSlug),
        email: seedEmail(userSlug),
        passwordHash: await bcrypt.hash("Password123!", 12),
        role: "DOCTOR",
        status: "ACTIVE",
        isVerified: status === "VERIFIED",
      },
    });

    const doctor = await prisma.doctorProfile.create({
      data: {
        userId: doctorUser.id,
        fullName: `${SEED_PREFIX} Dr ${status.charAt(0)}${status.slice(1).toLowerCase()}`,
        email: doctorUser.email,
        phone: `071000000${index}`,
        country: "Kenya",
        cityRegion: index % 2 === 0 ? "Mombasa" : "Nairobi",
        licenseNumber: `afiyapal-LIC-${status}`,
        specialty: specialties[index % specialties.length],
        languagesSpoken: index % 2 === 0 ? "English, Swahili" : "English",
        yearsOfExperience: 3 + index,
        bio: `${SEED_PREFIX} ${status.toLowerCase()} doctor profile for admin verification testing.`,
        verificationStatus: status,
        availabilityStatus: status === "VERIFIED" ? "AVAILABLE" : "UNAVAILABLE",
        verifiedById: status === "VERIFIED" ? users.SUPER_ADMIN.id : null,
        verifiedAt: status === "VERIFIED" ? daysAgo(5) : null,
        rejectionReason:
          status === "REJECTED"
            ? `${SEED_PREFIX} License document was unreadable.`
            : null,
        suspensionReason:
          status === "SUSPENDED"
            ? `${SEED_PREFIX} Temporarily suspended for QA testing.`
            : null,
        createdAt: daysAgo(20 - index),
      },
    });
    doctors[status] = { id: doctor.id, userId: doctor.userId, status };
  }

  return doctors;
}

async function createCategories() {
  const categories: Record<string, { id: number }> = {};
  for (const category of articleCategories) {
    const model = await prisma.category.upsert({
      where: { name: category },
      update: {
        description: `${SEED_PREFIX} ${category.toLowerCase().replace(/_/g, " ")} category.`,
      },
      create: {
        name: category,
        description: `${SEED_PREFIX} ${category.toLowerCase().replace(/_/g, " ")} category.`,
      },
    });
    categories[category] = { id: model.id };
  }
  return categories;
}

async function createBlogs(
  users: Record<string, { id: number }>,
  categories: Record<string, { id: number }>,
) {
  const blogs: Record<string, { id: number; slug: string; status: string }> =
    {};

  const categorySeedImages: Record<string, string> = {
    MALARIA: "/images/blogs/seed/malaria-prevention-community.jpg",
    MATERNAL_HEALTH: "/images/blogs/seed/maternal-health-checkups.jpg",
    NUTRITION: "/images/blogs/seed/balanced-plate-africa.jpg",
    MENTAL_HEALTH: "/images/blogs/seed/mental-health-youth.jpg",
    FIRST_AID: "/images/blogs/seed/first-aid-home.jpg",
    GENERAL_WELLNESS: "/images/blogs/seed/hypertension-basics.jpg",
  };

  for (const [index, category] of articleCategories.entries()) {
    const status = articleStatuses[index % articleStatuses.length];
    const reviewStatus =
      medicalReviewStatuses[index % medicalReviewStatuses.length];
    const isPublished = status === "PUBLISHED";
    const isArchived = status === "ARCHIVED";
    const slug = `afiyapal-${category.toLowerCase().replace(/_/g, "-")}-${status.toLowerCase()}`;
    const blog = await prisma.blog.create({
      data: {
        title: `${SEED_PREFIX} ${category.replace(/_/g, " ")} Article - ${status}`,
        slug,
        excerpt: `${SEED_PREFIX} QA article for ${category} in ${languages[index % languages.length]}.`,
        content: `${SEED_PREFIX} This is development-only article content for testing content management workflows, medical review states, languages, categories, tags, and publishing actions.`,
        status,
        language: languages[index % languages.length],
        contentCategory: category,
        tags: `${category.toLowerCase().replace(/_/g, ", ")}, qa, workflow`,
        medicalReviewStatus: reviewStatus,
        reviewedById:
          reviewStatus === "APPROVED" ? users.MEDICAL_REVIEWER.id : null,
        reviewedAt: reviewStatus === "APPROVED" ? daysAgo(10) : null,
        reviewNotes: `${SEED_PREFIX} Review notes for ${category}.`,
        publishedAt: isPublished ? monthsAgo(index === 2 ? 8 : 1) : null,
        archivedAt: isArchived ? daysAgo(3) : null,
        creatorId: users.CONTENT_MANAGER.id,
        categoryId: categories[category].id,
        createdAt: monthsAgo(index + 1),
        updatedAt: index === 2 ? monthsAgo(8) : daysAgo(index + 1),
      },
    });
    blogs[slug] = { id: blog.id, slug, status };

    await prisma.media.create({
      data: {
        blogId: blog.id,
        mediaUrl:
          categorySeedImages[category] ??
          "/images/blogs/seed/balanced-plate-africa.jpg",
        mediaType: "image",
        altText: `${SEED_PREFIX} placeholder image for ${category}`,
      },
    });
  }

  const productionBlogs = [
    {
      slug: "afiyapal-balanced-plate-african-families",
      title: "Building a Balanced Plate with Everyday African Foods",
      excerpt:
        "Simple, affordable ways to combine staple foods, vegetables, legumes, fruit, and protein into filling meals for the whole family.",
      category: "NUTRITION",
      tags: "nutrition, family health, balanced diet, food security, prevention",
      image: "/images/blogs/seed/balanced-plate-africa.jpg",
      alt: "Illustration of a balanced African meal plate",
      days: 4,
      content: `# Building a Balanced Plate with Everyday African Foods

A balanced plate does not have to be expensive. The goal is to combine foods that provide energy, body-building nutrients, vitamins, minerals, and fibre.

![A balanced plate with African staples, vegetables, and protein](/images/blogs/seed/balanced-plate-africa.jpg)

## A practical plate method

- Fill half the plate with vegetables or fruit where available.
- Fill one quarter with a staple such as ugali, rice, potatoes, matoke, millet, or chapati.
- Fill one quarter with beans, peas, lentils, eggs, fish, chicken, milk, or other protein foods.
- Add clean drinking water and limit sugary drinks.

## Make nutrition realistic

Families can rotate local seasonal foods, buy vegetables in smaller portions, and use legumes several times a week. Consistency matters more than perfection.

> Seek advice from a qualified clinician or nutrition professional if someone has diabetes, kidney disease, severe weight loss, pregnancy complications, or a child with poor growth.

## Quick weekly ideas

| Meal idea | Why it helps |
| --- | --- |
| Githeri with sukuma wiki | Fibre, protein, and micronutrients |
| Rice with beans and cabbage | Affordable energy and plant protein |
| Ugali with fish and vegetables | Protein, iron, and healthy fats |

This article is educational and does not replace medical or nutrition care.`,
    },
    {
      slug: "afiyapal-first-aid-home-emergencies",
      title: "First Aid Basics Every Household Should Know",
      excerpt:
        "A calm, practical guide for burns, bleeding, fainting, choking risk, and when to seek emergency medical help.",
      category: "FIRST_AID",
      tags: "first aid, emergency readiness, home safety, caregivers, prevention",
      image: "/images/blogs/seed/first-aid-home.jpg",
      alt: "First aid kit and emergency readiness checklist",
      days: 7,
      content: `# First Aid Basics Every Household Should Know

First aid is the immediate help given before professional care is available. It can reduce harm, but it should never delay emergency care.

![A household first aid kit arranged beside a checklist](/images/blogs/seed/first-aid-home.jpg)

## Start with safety

Before helping, check that the scene is safe. Wash or sanitize hands when possible. Use gloves or a clean cloth to avoid contact with blood.

## Common situations

- **Bleeding:** Apply firm pressure with a clean cloth and keep pressure until help arrives.
- **Burns:** Cool the burn under clean running water for about 20 minutes. Do not apply toothpaste, oils, or soil.
- **Fainting:** Lay the person flat, loosen tight clothing, and seek care if they do not recover quickly.
- **Choking:** If a person cannot cough, speak, or breathe, call emergency help and use recommended choking first-aid steps if trained.

## Build a basic kit

Keep clean gauze, bandages, gloves, antiseptic, oral rehydration salts, a thermometer, scissors, and emergency numbers in one reachable place.

Call emergency services or go to the nearest facility for severe bleeding, deep burns, difficulty breathing, chest pain, seizures, severe injury, or loss of consciousness.`,
    },
    {
      slug: "afiyapal-hypertension-screening-basics",
      title: "Blood Pressure Screening: Why It Matters Before Symptoms Start",
      excerpt:
        "High blood pressure can remain silent for years. Learn why routine checks and early lifestyle changes matter.",
      category: "GENERAL_WELLNESS",
      tags: "blood pressure, hypertension, screening, chronic disease, wellness",
      image: "/images/blogs/seed/hypertension-basics.jpg",
      alt: "Blood pressure cuff and community screening notes",
      days: 10,
      content: `# Blood Pressure Screening: Why It Matters Before Symptoms Start

High blood pressure is often called silent because many people feel normal even when readings are high. Screening helps identify risk early.

![Blood pressure cuff beside community screening notes](/images/blogs/seed/hypertension-basics.jpg)

## Who should check?

Adults should know their blood pressure reading, especially those with family history, diabetes, kidney disease, pregnancy history concerns, tobacco use, high stress, or limited physical activity.

## What supports healthier blood pressure?

- Reduce excess salt and highly processed foods.
- Move regularly, even brisk walking.
- Limit alcohol and avoid tobacco.
- Sleep consistently and manage stress.
- Take prescribed medicine exactly as advised.

## When to seek urgent care

Severe headache, chest pain, difficulty breathing, weakness on one side, confusion, or vision changes need urgent medical attention.

A single reading is not a diagnosis. A qualified healthcare provider should interpret repeated readings and advise on next steps.`,
    },
    {
      slug: "afiyapal-malaria-prevention-community",
      title: "Malaria Prevention: Practical Steps for Homes and Communities",
      excerpt:
        "Bed nets, early testing, environmental control, and prompt treatment all work together to reduce malaria risk.",
      category: "MALARIA",
      tags: "malaria, prevention, mosquito nets, community health, fever",
      image: "/images/blogs/seed/malaria-prevention-community.jpg",
      alt: "Community malaria prevention illustration with mosquito net",
      days: 13,
      content: `# Malaria Prevention: Practical Steps for Homes and Communities

Malaria prevention works best when households and communities combine several actions consistently.

![A community malaria prevention scene with a bed net and mosquito control reminders](/images/blogs/seed/malaria-prevention-community.jpg)

## Household actions

- Sleep under treated mosquito nets, especially children and pregnant people.
- Repair torn nets and hang them correctly.
- Clear stagnant water around the home where mosquitoes breed.
- Use screens or close doors and windows in the evening where possible.

## Do not ignore fever

Fever, chills, headache, vomiting, body aches, or weakness can be malaria or another serious infection. Testing helps guide the right treatment.

## Treatment safety

Do not share leftover medicines or stop prescribed antimalarials early unless a clinician advises. Incorrect treatment can increase complications and resistance.

Pregnancy, young children, severe weakness, confusion, difficulty breathing, repeated vomiting, or convulsions require urgent care.`,
    },
    {
      slug: "afiyapal-maternal-health-antenatal-visits",
      title: "Antenatal Visits: What Families Should Expect and Prepare For",
      excerpt:
        "Antenatal care supports safer pregnancy through screening, counselling, supplements, birth planning, and early danger-sign detection.",
      category: "MATERNAL_HEALTH",
      tags: "maternal health, pregnancy, antenatal care, family support, birth planning",
      image: "/images/blogs/seed/maternal-health-checkups.jpg",
      alt: "Pregnant mother attending an antenatal checkup illustration",
      days: 16,
      content: `# Antenatal Visits: What Families Should Expect and Prepare For

Antenatal care gives pregnant people and families time to identify risks, plan for birth, and ask questions before urgent problems happen.

![A pregnant mother attending an antenatal checkup](/images/blogs/seed/maternal-health-checkups.jpg)

## What may happen during visits

Clinicians may check blood pressure, weight, baby growth, blood or urine tests, immunizations, supplements, and symptoms such as bleeding or severe headaches.

## Prepare questions

- What danger signs should we watch for?
- Which supplements or medicines are recommended?
- Where should we go for delivery or emergencies?
- What transport and funds should the family prepare?

## Danger signs need urgent care

Heavy bleeding, severe abdominal pain, severe headache, swollen face or hands, blurred vision, fever, convulsions, reduced baby movement, or difficulty breathing need urgent medical attention.

Family support makes it easier to attend visits, eat well, rest, and reach care quickly when warning signs appear.`,
    },
    {
      slug: "afiyapal-youth-mental-health-support",
      title: "Supporting Youth Mental Health Without Stigma",
      excerpt:
        "How families, schools, and communities can respond to stress, anxiety, sadness, substance use concerns, and crisis warning signs.",
      category: "MENTAL_HEALTH",
      tags: "mental health, youth, stigma, stress, support, safety",
      image: "/images/blogs/seed/mental-health-youth.jpg",
      alt: "Youth mental health support and conversation illustration",
      days: 19,
      content: `# Supporting Youth Mental Health Without Stigma

Young people may struggle silently when they fear judgement. Support starts with listening, safety, and early connection to trusted help.

![Youth mental health support conversation illustration](/images/blogs/seed/mental-health-youth.jpg)

## Signs to take seriously

Persistent sadness, isolation, panic, anger changes, declining school performance, substance use, self-harm talk, or giving away belongings can signal distress.

## Helpful responses

- Listen without rushing to blame or shame.
- Ask direct, caring questions about safety.
- Encourage sleep, meals, routine, and trusted social connection.
- Involve a qualified mental health professional when symptoms persist or safety is uncertain.

## Crisis support

If someone may harm themselves or others, stay with them, remove immediate dangers where safe, and seek emergency help immediately.

Mental health conditions are health concerns. Compassion and professional care can save lives.`,
    },
    {
      slug: "afiyapal-safe-medication-use",
      title: "Safe Medicine Use: Avoiding Common Mistakes",
      excerpt:
        "Understand labels, doses, storage, antibiotics, side effects, and why sharing medicines can be dangerous.",
      category: "GENERAL_WELLNESS",
      tags: "medicine safety, antibiotics, pharmacy, adherence, patient education",
      image: "/images/blogs/seed/safe-medication-use.jpg",
      alt: "Medicine safety checklist and labelled tablets illustration",
      days: 22,
      content: `# Safe Medicine Use: Avoiding Common Mistakes

Medicines can help when used correctly, but mistakes can cause harm. Always follow the instructions from a qualified clinician or pharmacist.

![Medicine safety checklist and labelled tablets](/images/blogs/seed/safe-medication-use.jpg)

## Common mistakes

- Stopping antibiotics early because symptoms improved.
- Taking another person's prescription.
- Mixing herbal products and medicines without advice.
- Doubling a missed dose without instructions.
- Keeping medicines where children can reach them.

## Safer habits

Read the label, confirm the dose and timing, ask about food or alcohol interactions, and store medicines away from heat, moisture, and children.

## Ask for help quickly

Seek care for allergic reactions, swelling of the face or throat, severe rash, difficulty breathing, confusion, severe vomiting, or overdose.

Bring all current medicines to clinic visits so the provider can check for interactions.`,
    },
    {
      slug: "afiyapal-telemedicine-rural-care",
      title: "Telemedicine for Rural Care: How to Prepare for a Better Visit",
      excerpt:
        "Make online consultations more useful by preparing symptoms, medicines, photos, questions, connectivity, and follow-up plans.",
      category: "GENERAL_WELLNESS",
      tags: "telemedicine, rural health, digital health, care access, doctor consultation",
      image: "/images/blogs/seed/telemedicine-rural-care.jpg",
      alt: "Rural telemedicine consultation preparation illustration",
      days: 25,
      content: `# Telemedicine for Rural Care: How to Prepare for a Better Visit

Telemedicine can reduce travel time and connect people to guidance sooner. Preparation helps the clinician understand the situation clearly.

![A rural telemedicine consultation preparation scene](/images/blogs/seed/telemedicine-rural-care.jpg)

## Before the call

- Write down the main concern and when it started.
- List current medicines, allergies, pregnancy status, and known conditions.
- Take clear photos of visible rashes, wounds, or swelling if appropriate.
- Prepare recent readings such as temperature, blood pressure, or blood sugar if available.

## During the visit

Speak from a private, well-lit place. Ask what symptoms should trigger urgent care and when to follow up.

## Know the limits

Telemedicine cannot replace physical examination for every problem. Severe symptoms, injuries, pregnancy danger signs, chest pain, stroke symptoms, or breathing difficulty require urgent in-person care.`,
    },
  ];

  for (const [index, article] of productionBlogs.entries()) {
    const blog = await prisma.blog.create({
      data: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        status: "PUBLISHED",
        language: "en",
        contentCategory: article.category,
        tags: article.tags,
        medicalReviewStatus: "APPROVED",
        reviewedById: users.MEDICAL_REVIEWER.id,
        reviewedAt: daysAgo(article.days + 1),
        reviewNotes: `${SEED_PREFIX} Approved production-style sample for public blog filtering QA.`,
        publishedAt: daysAgo(article.days),
        creatorId: users.CONTENT_MANAGER.id,
        categoryId: categories[article.category].id,
        createdAt: daysAgo(article.days + 3),
        updatedAt: daysAgo(article.days),
      },
    });

    blogs[article.slug] = {
      id: blog.id,
      slug: article.slug,
      status: "PUBLISHED",
    };

    await prisma.media.create({
      data: {
        blogId: blog.id,
        mediaUrl: article.image,
        mediaType: "image",
        altText: article.alt,
      },
    });
  }

  const firstBlog = Object.values(blogs)[0];
  if (firstBlog) {
    const parent = await prisma.comment.create({
      data: {
        blogId: firstBlog.id,
        userId: users.USER.id,
        comment: `${SEED_PREFIX} This is a QA blog comment.`,
      },
    });
    await prisma.comment.create({
      data: {
        blogId: firstBlog.id,
        userId: users.SUPPORT_ADMIN.id,
        parentCommentId: parent.id,
        comment: `${SEED_PREFIX} This is a QA reply comment.`,
      },
    });
  }

  return blogs;
}

async function createContactSubmissions(users: Record<string, { id: number }>) {
  const submissions = [
    {
      fullName: `${SEED_PREFIX} Amina Otieno`,
      email: "amina.contact@afiyapal.seed",
      phone: "+254700111222",
      jobPosition: "NGO / Public Health Partner",
      services: "Public Health Intelligence, Partnerships",
      message: `${SEED_PREFIX} We would like to discuss community health education partnerships in Kisumu and dashboard reporting for outreach campaigns.`,
      status: "NEW",
      createdAt: daysAgo(1),
    },
    {
      fullName: `${SEED_PREFIX} Daniel Mwangi`,
      email: "daniel.facility@afiyapal.seed",
      phone: "+254700333444",
      jobPosition: "Facility Administrator",
      services: "Telemedicine, Facility Events",
      message: `${SEED_PREFIX} Our clinic wants to understand facility onboarding, doctor verification, and event listings for health talks.`,
      status: "REVIEWED",
      createdAt: daysAgo(3),
    },
    {
      fullName: `${SEED_PREFIX} Grace Njeri`,
      email: "grace.student@afiyapal.seed",
      phone: null,
      jobPosition: "Student / Researcher",
      services: "Health Education, AI Symptom Checker",
      message: `${SEED_PREFIX} I am researching digital health education tools and would like more information about AfiyaPal's public content workflow.`,
      status: "ARCHIVED",
      createdAt: daysAgo(8),
    },
  ];

  for (const submission of submissions) {
    await prisma.contactSubmission.create({
      data: {
        ...submission,
        source: "SEED_HOME_CONTACT_FORM",
        ipHash: `afiyapal-ip-${submission.email}`,
        userAgent: "Seed Browser",
        reviewedAt: submission.status === "NEW" ? null : daysAgo(2),
        reviewedById:
          submission.status === "NEW" ? null : users.SUPPORT_ADMIN.id,
      },
    });
  }
}

async function createSymptomLogs(users: Record<string, { id: number }>) {
  const logs: Array<{ id: number; riskLevel: string; status: string }> = [];

  for (const [index, riskLevel] of riskLevels.entries()) {
    const status = symptomStatuses[index % symptomStatuses.length];
    const log = await prisma.symptomCheckLog.create({
      data: {
        userId: users.USER.id,
        language: languages[index % languages.length],
        symptomsSummary: `${SEED_PREFIX} ${riskLevel} symptom summary for admin QA.`,
        aiResponseSummary: `${SEED_PREFIX} Privacy-safe AI response summary for ${riskLevel} risk.`,
        symptomCategory: [
          "General",
          "Malaria-like",
          "Respiratory",
          "Emergency",
        ][index],
        riskLevel,
        recommendedNextStep:
          riskLevel === "EMERGENCY"
            ? "Seek emergency care immediately."
            : "Monitor symptoms and consult a clinician if symptoms persist.",
        escalationSuggested: riskLevel === "HIGH" || riskLevel === "EMERGENCY",
        status,
        createdAt: daysAgo(index + 1),
      },
    });
    logs.push({ id: log.id, riskLevel, status });
  }

  return logs;
}

async function createMentalHealthInteractions(
  users: Record<string, { id: number }>,
) {
  const interactions: Array<{ id: number; riskLevel: string }> = [];

  for (const [index, riskLevel] of riskLevels.entries()) {
    const interaction = await prisma.mentalHealthInteraction.create({
      data: {
        userId: users.USER.id,
        language: languages[index % languages.length],
        moodCategory: [
          "GENERAL_SUPPORT",
          "STRESS",
          "ANXIETY",
          "CRISIS_SUPPORT",
        ][index],
        riskLevel,
        interactionSummary: `${SEED_PREFIX} ${riskLevel} mental health support summary for QA.`,
        aiResponseSummary: `${SEED_PREFIX} Supportive, non-diagnostic response summary for ${riskLevel} risk.`,
        supportResourcesShown:
          riskLevel === "HIGH" || riskLevel === "EMERGENCY"
            ? "Kenya emergency contacts, trusted support hotline"
            : "Breathing exercise, journaling prompt",
        escalationSuggested: riskLevel === "HIGH" || riskLevel === "EMERGENCY",
        status: symptomStatuses[index % symptomStatuses.length],
        createdAt: daysAgo(index + 2),
      },
    });
    interactions.push({ id: interaction.id, riskLevel });
  }

  return interactions;
}

async function createAiFlags(
  users: Record<string, { id: number }>,
  symptomLogs: Array<{ id: number }>,
  mentalHealthInteractions: Array<{ id: number }>,
) {
  const flags: Record<
    string,
    { id: number; status: string; priority: string }
  > = {};

  for (const [index, category] of aiFlagCategories.entries()) {
    const status = aiFlagStatuses[index % aiFlagStatuses.length];
    const priority = aiFlagPriorities[index % aiFlagPriorities.length];
    const flag = await prisma.aiInteractionFlag.create({
      data: {
        symptomCheckLogId:
          category === "MENTAL_HEALTH_CRISIS"
            ? null
            : symptomLogs[index % symptomLogs.length]?.id,
        mentalHealthInteractionId:
          category === "MENTAL_HEALTH_CRISIS"
            ? mentalHealthInteractions[index % mentalHealthInteractions.length]
                ?.id
            : null,
        userId: users.USER.id,
        title: `${SEED_PREFIX} ${category.replace(/_/g, " ")}`,
        summary: `${SEED_PREFIX} Privacy-safe safety flag summary for ${category}.`,
        category,
        trigger: aiFlagTriggers[index % aiFlagTriggers.length],
        priority:
          category === "EMERGENCY_SYMPTOMS" ||
          category === "MENTAL_HEALTH_CRISIS"
            ? "CRITICAL"
            : priority,
        status,
        assignedReviewerId:
          status === "IN_REVIEW" ? users.MEDICAL_REVIEWER.id : null,
        adminNotes: `${SEED_PREFIX} Admin QA note for ${category}.`,
        reviewerNotes:
          status === "IN_REVIEW"
            ? `${SEED_PREFIX} Reviewer is assessing the case.`
            : null,
        resolutionNotes:
          status === "RESOLVED"
            ? `${SEED_PREFIX} Resolved during QA seed.`
            : null,
        resolvedAt: status === "RESOLVED" ? daysAgo(1) : null,
        createdAt: daysAgo(index + 1),
      },
    });
    flags[category] = { id: flag.id, status, priority: flag.priority };
  }

  return flags;
}

async function createConsultations(
  users: Record<string, { id: number }>,
  doctors: Record<string, { id: number }>,
) {
  const consultations: Array<{ id: number; status: string }> = [];

  for (const [index, status] of consultationStatuses.entries()) {
    const assignedDoctorId = [
      "ASSIGNED",
      "ACCEPTED_BY_DOCTOR",
      "COMPLETED",
    ].includes(status)
      ? doctors.VERIFIED.id
      : null;
    const request = await prisma.consultationRequest.create({
      data: {
        userId: users.USER.id,
        assignedDoctorId,
        reasonSummary: `${SEED_PREFIX} Consultation request for ${status} workflow testing.`,
        preferredLanguage: languages[index % languages.length],
        countryRegion: index % 2 === 0 ? "Kenya / Mombasa" : "Kenya / Nairobi",
        urgencyLevel: urgencyLevels[index % urgencyLevels.length],
        requestedSpecialty: specialties[index % specialties.length],
        status,
        adminNotes: `${SEED_PREFIX} Internal admin note for ${status}.`,
        createdAt: daysAgo(index + 1),
      },
    });
    consultations.push({ id: request.id, status });
  }

  return consultations;
}

async function createSafetyReports(users: Record<string, { id: number }>) {
  const reports: Array<{ id: number; type: string; status: string }> = [];

  for (const [index, type] of reportTypes.entries()) {
    const status = reportStatuses[index % reportStatuses.length];
    const priority = reportPriorities[index % reportPriorities.length];
    const report = await prisma.safetyReport.create({
      data: {
        reporterUserId: users.USER.id,
        assignedAdminId: ["IN_REVIEW", "RESOLVED"].includes(status)
          ? users.SUPPORT_ADMIN.id
          : null,
        type,
        title: `${SEED_PREFIX} ${type.replace(/_/g, " ")}`,
        summary: `${SEED_PREFIX} Safety center QA report for ${type}.`,
        priority,
        status,
        resolutionNotes:
          status === "RESOLVED" || status === "DISMISSED"
            ? `${SEED_PREFIX} Resolution notes for ${type}.`
            : null,
        resolvedAt:
          status === "RESOLVED" || status === "DISMISSED" ? daysAgo(1) : null,
        createdAt: daysAgo(index + 1),
      },
    });
    reports.push({ id: report.id, type, status });

    await prisma.safetyReportActionHistory.create({
      data: {
        reportId: report.id,
        actorAdminId: users.SUPPORT_ADMIN.id,
        actionType:
          safetyReportActionTypes[index % safetyReportActionTypes.length],
        fromStatus: index === 0 ? null : "OPEN",
        toStatus: status,
        fromPriority: index === 0 ? null : "MEDIUM",
        toPriority: priority,
        note: `${SEED_PREFIX} Safety report action history for ${type}.`,
      },
    });
  }

  return reports;
}

async function createSettingsAndResources(
  users: Record<string, { id: number }>,
) {
  const settings = [
    ["seed.supportedLanguages", "English, Swahili"],
    [
      "seed.emergencyMessageText",
      "If this may be an emergency, contact local emergency services or go to the nearest clinic immediately.",
    ],
    [
      "seed.doctorVerificationRequirements",
      "License number, identity verification, specialty, country, and language review required.",
    ],
    [
      "seed.aiDisclaimerText",
      "AFIYAPAL provides supportive health information, not a diagnosis or replacement for professional care.",
    ],
    [
      "seed.defaultConsultationUrgencyRules",
      "Emergency symptoms escalate immediately; high-risk symptoms require clinician review.",
    ],
    ["seed.contentReviewIntervalMonths", "6"],
    ["seed.contactSupportEmail", "support@afiyapal.local"],
  ];

  for (const [key, value] of settings) {
    await prisma.platformSetting.upsert({
      where: { key },
      update: { value, updatedById: users.SUPER_ADMIN.id },
      create: { key, value, updatedById: users.SUPER_ADMIN.id },
    });
  }

  for (const [index, type] of healthResourceTypes.entries()) {
    await prisma.healthResource.create({
      data: {
        type,
        name: `${SEED_PREFIX} ${type.replace(/_/g, " ")}`,
        country: index % 2 === 0 ? "Kenya" : "Tanzania",
        region: index % 2 === 0 ? "Mombasa" : "Dar es Salaam",
        phone: `+25470000000${index}`,
        email: `resource${index}@${SEED_DOMAIN}`,
        website: `https://afiyapal.co.ke/afiyapal-health-resource-${index}`,
        description: `${SEED_PREFIX} Country-specific ${type.toLowerCase().replace(/_/g, " ")} for QA testing.`,
        isActive: index % 2 === 0,
      },
    });
  }

  for (const [index, riskLevel] of riskLevels.entries()) {
    await prisma.mentalHealthResource.create({
      data: {
        hotlineName: `${SEED_PREFIX} Mental Health ${riskLevel} Resource`,
        country: index % 2 === 0 ? "Kenya" : "Uganda",
        phone: `+25471100000${index}`,
        website: `https://afiyapal.co.ke/afiyapal-mental-health-${index}`,
        description: `${SEED_PREFIX} Mental health support resource for ${riskLevel} QA testing.`,
        isActive: index % 2 === 0,
      },
    });
  }
}

async function createAuditLogs(
  users: Record<string, { id: number }>,
  targets: {
    userId: number;
    doctorId: number;
    blogId: number;
    flagId: number;
    consultationId: number;
    reportId: number;
    symptomLogId: number;
    mentalHealthInteractionId: number;
  },
) {
  const targetIdsByType: Record<string, string> = {
    User: String(targets.userId),
    DoctorProfile: String(targets.doctorId),
    Blog: String(targets.blogId),
    AiInteractionFlag: String(targets.flagId),
    ConsultationRequest: String(targets.consultationId),
    SafetyReport: String(targets.reportId),
    SymptomCheckLog: String(targets.symptomLogId),
    MentalHealthInteraction: String(targets.mentalHealthInteractionId),
    PlatformSetting: "seed.supportedLanguages",
    HealthResource: "afiyapal-health-resource",
  };

  for (const [index, actionType] of auditActions.entries()) {
    const targetType = auditTargetTypes[index % auditTargetTypes.length];
    await prisma.adminAuditLog.create({
      data: {
        adminUserId: users.SUPER_ADMIN.id,
        actionType,
        targetType,
        targetId: targetIdsByType[targetType],
        oldValue: json({ before: `${SEED_PREFIX} old ${actionType}` }),
        newValue: json({ after: `${SEED_PREFIX} new ${actionType}` }),
        reason: `${SEED_PREFIX} QA audit log for ${actionType}.`,
        createdAt: daysAgo(index),
      },
    });
  }

  await prisma.adminSensitiveHealthAccessGrant.create({
    data: {
      adminUserId: users.MEDICAL_REVIEWER.id,
      targetType: "SymptomCheckLog",
      targetId: String(targets.symptomLogId),
      reason: `${SEED_PREFIX} QA sensitive health access reason.`,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    },
  });
}

async function createNotifications(users: Record<string, { id: number }>) {
  const recipients = [users.SUPER_ADMIN.id, users.DOCTOR.id, users.USER.id];

  for (const [index, type] of notificationTypes.entries()) {
    await prisma.notification.create({
      data: {
        recipientUserId: recipients[index % recipients.length],
        type,
        title: `${SEED_PREFIX} ${type.replace(/_/g, " ")}`,
        message: `${SEED_PREFIX} Notification message for ${type}.`,
        priority: notificationPriorities[index % notificationPriorities.length],
        targetType: index % 2 === 0 ? "Admin" : "User",
        targetId: `afiyapal-${index + 1}`,
        status: index % 2 === 0 ? "UNREAD" : "READ",
        readAt: index % 2 === 0 ? null : daysAgo(1),
        createdAt: daysAgo(index),
      },
    });
  }
}

async function main() {
  console.log("🌱 Seeding AFIYAPAL development data...");

  await cleanupSeedData();

  const passwordHash = await bcrypt.hash("Password123!", 12);
  const users = await upsertSeedUsers(passwordHash);
  const doctors = await createDoctorProfiles(users);
  const categories = await createCategories();
  const blogs = await createBlogs(users, categories);
  await createContactSubmissions(users);
  const symptomLogs = await createSymptomLogs(users);
  const mentalHealthInteractions = await createMentalHealthInteractions(users);
  const flags = await createAiFlags(
    users,
    symptomLogs,
    mentalHealthInteractions,
  );
  const consultations = await createConsultations(users, doctors);
  const reports = await createSafetyReports(users);
  await createSettingsAndResources(users);
  await createAuditLogs(users, {
    userId: users.USER.id,
    doctorId: doctors.VERIFIED.id,
    blogId: Object.values(blogs)[0].id,
    flagId: Object.values(flags)[0].id,
    consultationId: consultations[0].id,
    reportId: reports[0].id,
    symptomLogId: symptomLogs[0].id,
    mentalHealthInteractionId: mentalHealthInteractions[0].id,
  });
  await createNotifications(users);

  console.log("✅ Seed completed.");
  console.log("Login examples, all using password: Password123!");
  console.table(
    Object.entries(users).map(([key, user]) => ({
      key,
      email: user.email,
      role: user.role,
    })),
  );
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
