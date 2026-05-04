import "server-only";
import { prisma } from "@/server/db/prisma";

export type HealthResourceFilters = {
  search?: string;
  type?: string;
  status?: string;
  country?: string;
};

function normalize(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export async function getAdminHealthResources(filters: HealthResourceFilters = {}) {
  const search = normalize(filters.search);
  const type = normalize(filters.type);
  const status = normalize(filters.status);
  const country = normalize(filters.country);

  const where = {
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { country: { contains: search } },
            { region: { contains: search } },
            { phone: { contains: search } },
            { email: { contains: search } },
            { website: { contains: search } },
            { description: { contains: search } }
          ]
        }
      : {}),
    ...(type ? { type } : {}),
    ...(country ? { country: { contains: country } } : {}),
    ...(status === "ACTIVE" ? { isActive: true } : {}),
    ...(status === "INACTIVE" ? { isActive: false } : {})
  };

  const [resources, total] = await Promise.all([
    prisma.healthResource.findMany({
      where,
      orderBy: [{ isActive: "desc" }, { country: "asc" }, { type: "asc" }, { name: "asc" }],
      take: 75,
      select: {
        id: true,
        type: true,
        name: true,
        country: true,
        region: true,
        phone: true,
        email: true,
        website: true,
        description: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    }),
    prisma.healthResource.count({ where })
  ]);

  return { resources, total, pageSize: 75 };
}
