"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/server/db/prisma";
import { getCurrentUser } from "@/server/auth/session";
import { routes } from "@/lib/routes";

async function requireFacilityAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "FACILITY_ADMIN") redirect(routes.login);
  return user;
}

async function getOwnedFacility(adminId: number) {
  const facility = await prisma.facility.findFirst({ where: { adminId } });
  if (!facility) redirect(routes.facilityDashboard);
  return facility;
}

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createEventAction(_: unknown, formData: FormData) {
  const user = await requireFacilityAdmin();
  const facility = await getOwnedFacility(user.id);

  const title = getText(formData, "title");
  const description = getText(formData, "description");
  const type = getText(formData, "type") || "HEALTH_TALK";
  const startDateStr = getText(formData, "startDate");
  const endDateStr = getText(formData, "endDate");
  const location = getText(formData, "location");
  const isPublic = formData.get("isPublic") === "on";

  if (!title || title.length < 4) return { ok: false, message: "Title must be at least 4 characters." };
  if (!startDateStr) return { ok: false, message: "Start date is required." };

  const startDate = new Date(startDateStr);
  if (isNaN(startDate.getTime())) return { ok: false, message: "Invalid start date." };

  let endDate: Date | null = null;
  if (endDateStr) {
    endDate = new Date(endDateStr);
    if (isNaN(endDate.getTime())) return { ok: false, message: "Invalid end date." };
  }

  await prisma.event.create({
    data: {
      facilityId: facility.id,
      title,
      description: description || null,
      type,
      startDate,
      endDate,
      location: location || null,
      isPublic,
      status: new Date() > startDate ? "ONGOING" : "UPCOMING"
    }
  });

  revalidatePath(routes.facilityEvents);
  redirect(routes.facilityEvents);
}

export async function updateEventAction(_: unknown, formData: FormData) {
  const user = await requireFacilityAdmin();
  const facility = await getOwnedFacility(user.id);
  const eventId = Number(formData.get("eventId"));
  if (!Number.isInteger(eventId) || eventId <= 0) return { ok: false, message: "Invalid event ID." };

  const existing = await prisma.event.findFirst({ where: { id: eventId, facilityId: facility.id } });
  if (!existing) return { ok: false, message: "Event not found." };

  const title = getText(formData, "title");
  const description = getText(formData, "description");
  const type = getText(formData, "type") || existing.type;
  const startDateStr = getText(formData, "startDate");
  const endDateStr = getText(formData, "endDate");
  const location = getText(formData, "location");
  const isPublic = formData.get("isPublic") === "on";

  if (!title || title.length < 4) return { ok: false, message: "Title must be at least 4 characters." };
  if (!startDateStr) return { ok: false, message: "Start date is required." };

  const startDate = new Date(startDateStr);
  if (isNaN(startDate.getTime())) return { ok: false, message: "Invalid start date." };

  let endDate: Date | null = null;
  if (endDateStr) {
    endDate = new Date(endDateStr);
    if (isNaN(endDate.getTime())) return { ok: false, message: "Invalid end date." };
  }

  const now = new Date();
  let status = existing.status;
  if (status === "UPCOMING" && now > startDate) status = "ONGOING";

  await prisma.event.update({
    where: { id: eventId },
    data: { title, description: description || null, type, startDate, endDate, location: location || null, isPublic, status }
  });

  revalidatePath(routes.facilityEvents);
  redirect(routes.facilityEvents);
}

export async function updateEventStatusAction(_: unknown, formData: FormData) {
  const user = await requireFacilityAdmin();
  const facility = await getOwnedFacility(user.id);
  const eventId = Number(formData.get("eventId"));
  if (!Number.isInteger(eventId) || eventId <= 0) return { ok: false, message: "Invalid event ID." };

  const status = getText(formData, "status");
  if (!["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"].includes(status)) return { ok: false, message: "Invalid status." };

  const existing = await prisma.event.findFirst({ where: { id: eventId, facilityId: facility.id } });
  if (!existing) return { ok: false, message: "Event not found." };

  await prisma.event.update({ where: { id: eventId }, data: { status } });

  revalidatePath(routes.facilityEvents);
  revalidatePath(`${routes.facilityEvents}/${eventId}`);
  return { ok: true, message: `Event marked as ${status.toLowerCase()}.` };
}

export async function deleteEventAction(formData: FormData) {
  const user = await requireFacilityAdmin();
  const facility = await getOwnedFacility(user.id);
  const eventId = Number(formData.get("eventId"));
  if (!Number.isInteger(eventId) || eventId <= 0) return { ok: false, message: "Invalid event ID." };

  const existing = await prisma.event.findFirst({ where: { id: eventId, facilityId: facility.id } });
  if (!existing) return { ok: false, message: "Event not found." };

  await prisma.event.delete({ where: { id: eventId } });
  revalidatePath(routes.facilityEvents);
  return { ok: true, message: "Event deleted." };
}

export async function addFacilityProfessionalAction(_: unknown, formData: FormData) {
  const user = await requireFacilityAdmin();
  const facility = await getOwnedFacility(user.id);
  const doctorProfileId = Number(formData.get("doctorProfileId"));
  const role = getText(formData, "role") || "STAFF_DOCTOR";

  if (!Number.isInteger(doctorProfileId) || doctorProfileId <= 0) return { ok: false, message: "Invalid doctor." };

  const existing = await prisma.facilityProfessional.findUnique({
    where: { facilityId_doctorProfileId: { facilityId: facility.id, doctorProfileId } }
  });
  if (existing) return { ok: false, message: "This professional is already part of your facility." };

  await prisma.facilityProfessional.create({
    data: { facilityId: facility.id, doctorProfileId, role, addedById: user.id }
  });

  revalidatePath(routes.facilityProfessionals);
  return { ok: true, message: "Professional added." };
}

export async function removeFacilityProfessionalAction(formData: FormData) {
  const user = await requireFacilityAdmin();
  const facility = await getOwnedFacility(user.id);
  const professionalId = Number(formData.get("professionalId"));
  if (!Number.isInteger(professionalId) || professionalId <= 0) return { ok: false, message: "Invalid professional ID." };

  const existing = await prisma.facilityProfessional.findFirst({
    where: { id: professionalId, facilityId: facility.id }
  });
  if (!existing) return { ok: false, message: "Professional not found in your facility." };

  await prisma.facilityProfessional.delete({ where: { id: professionalId } });
  revalidatePath(routes.facilityProfessionals);
  return { ok: true, message: "Professional removed." };
}
