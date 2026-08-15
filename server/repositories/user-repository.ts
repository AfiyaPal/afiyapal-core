import "server-only";
import { prisma } from "@/server/db/prisma";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id: number) {
  return prisma.user.findUnique({ where: { id } });
}

export async function findUserByUsernameNormalized(username: string, excludeId?: number) {
  const rows = await prisma.$queryRaw<Array<{ id: number }>>`SELECT "id" FROM "User" WHERE LOWER("username") = LOWER(${username}) LIMIT 1`;
  const row = rows[0] ?? null;
  if (row && excludeId !== undefined && row.id === excludeId) return null;
  return row;
}

export async function createUser(input: { username: string; email: string; phone?: string; passwordHash: string; role?: string }) {
  return prisma.user.create({
    data: {
      username: input.username,
      email: input.email,
      phone: input.phone || null,
      passwordHash: input.passwordHash,
      role: input.role ?? "USER",
      status: "ACTIVE"
    }
  });
}
