import "server-only";
import { prisma } from "@/server/db/prisma";

export type MentalHealthResourceFilters = {
  search?: string;
  status?: string;
  country?: string;
};

function normalize(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export async function getAdminMentalHealthResources(filters: MentalHealthResourceFilters = {}) {
  const search = normalize(filters.search);
  const status = normalize(filters.status);
  const country = normalize(filters.country);

  const where = {
    ...(search
      ? {
          OR: [
            { hotlineName: { contains: search } },
            { country: { contains: search } },
            { phone: { contains: search } },
            { website: { contains: search } },
            { description: { contains: search } }
          ]
        }
      : {}),
    ...(country ? { country: { contains: country } } : {}),
    ...(status === "ACTIVE" ? { isActive: true } : {}),
    ...(status === "INACTIVE" ? { isActive: false } : {})
  };

  const [resources, total] = await Promise.all([
    prisma.mentalHealthResource.findMany({
      where,
      orderBy: [{ isActive: "desc" }, { country: "asc" }, { hotlineName: "asc" }],
      take: 50,
      select: {
        id: true,
        hotlineName: true,
        country: true,
        phone: true,
        website: true,
        description: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    }),
    prisma.mentalHealthResource.count({ where })
  ]);

  return { resources, total, pageSize: 50 };
}
