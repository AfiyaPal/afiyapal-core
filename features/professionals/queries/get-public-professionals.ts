import "server-only";
import { prisma } from "@/server/db/prisma";
import type {
  PublicProfessionalBlog,
  PublicProfessionalCard,
  PublicProfessionalDetail,
  PublicFacilityAffiliation
} from "../types/professional";

const PUBLIC_PROFILE_SELECT = {
  id: true,
  fullName: true,
  specialty: true,
  languagesSpoken: true,
  yearsOfExperience: true,
  country: true,
  cityRegion: true,
  bio: true,
  availabilityStatus: true
} as const;

export async function getPublicProfessionals(): Promise<PublicProfessionalCard[]> {
  try {
    const professionals = await prisma.doctorProfile.findMany({
      where: { verificationStatus: "VERIFIED", availabilityStatus: "AVAILABLE" },
      orderBy: [{ fullName: "asc" }],
      select: PUBLIC_PROFILE_SELECT
    });
    return professionals;
  } catch (error) {
    console.error("Failed to load public professionals", error);
    return [];
  }
}

export async function getPublicProfessionalById(id: number): Promise<PublicProfessionalDetail | null> {
  try {
    const profile = await prisma.doctorProfile.findFirst({
      where: { id, verificationStatus: "VERIFIED", availabilityStatus: "AVAILABLE" },
      select: {
        ...PUBLIC_PROFILE_SELECT,
        userId: true,
        facilityMemberships: {
          where: { status: "ACTIVE" },
          select: {
            facility: {
              select: { id: true, name: true, city: true, country: true, verificationStatus: true }
            }
          }
        }
      }
    });

    if (!profile) return null;

    const blogs: PublicProfessionalBlog[] = await prisma.blog.findMany({
      where: { creatorId: profile.userId ?? -1, status: { in: ["PUBLISHED", "published"] } },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      select: { id: true, title: true, slug: true, excerpt: true, publishedAt: true, createdAt: true }
    });

    const facilities: PublicFacilityAffiliation[] = profile.facilityMemberships.map((membership) => ({
      facilityId: membership.facility.id,
      facilityName: membership.facility.name,
      facilityCity: membership.facility.city,
      facilityCountry: membership.facility.country,
      verificationStatus: membership.facility.verificationStatus
    }));

    return {
      id: profile.id,
      fullName: profile.fullName,
      specialty: profile.specialty,
      languagesSpoken: profile.languagesSpoken,
      yearsOfExperience: profile.yearsOfExperience,
      country: profile.country,
      cityRegion: profile.cityRegion,
      bio: profile.bio,
      availabilityStatus: profile.availabilityStatus,
      blogs,
      facilities
    };
  } catch (error) {
    console.error("Failed to load public professional profile", error);
    return null;
  }
}
