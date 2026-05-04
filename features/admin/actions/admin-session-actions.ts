"use server";

import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { clearUserSession } from "@/server/auth/session";

export async function logoutAction() {
  await clearUserSession();
  redirect(routes.login);
}
