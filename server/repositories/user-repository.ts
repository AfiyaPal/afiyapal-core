import "server-only";
import { prisma } from "@/server/db/prisma";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id: number) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(input: { username: string; email: string; phone?: string; passwordHash: string }) {
  return prisma.user.create({
    data: {
      username: input.username,
      email: input.email,
      phone: input.phone || null,
      passwordHash: input.passwordHash,
      role: "USER",
      status: "ACTIVE"
    }
  });
}
