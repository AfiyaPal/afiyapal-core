import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { runCommunityInsightsPipeline } from "@/server/services/community-insights";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  if (!env.CRON_SECRET) {
    return NextResponse.json({ error: "CRON_SECRET is not configured." }, { status: 500 });
  }

  const authorization = request.headers.get("authorization");
  if (authorization !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (process.env.VERCEL_ENV === "production" && request.headers.get("x-vercel-cron") !== "1") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const result = await runCommunityInsightsPipeline();

  return NextResponse.json({ ok: true, ...result });
}
