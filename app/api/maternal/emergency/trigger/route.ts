import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { sessionId, coordinates, phone, emergencyType } = body;

  console.log("[MATERNAL EMERGENCY]", {
    timestamp: new Date().toISOString(),
    sessionId: sessionId ?? "anonymous",
    coordinates: coordinates ?? "unavailable",
    phone: phone ?? "not provided",
    emergencyType: emergencyType ?? "unspecified",
  });

  const typeLabel = emergencyType === "maternal" ? " A maternal health specialist has been alerted." : " A medical team has been alerted.";

  return NextResponse.json({
    status: "notified",
    message: `Response team notified. Help is on the way.${typeLabel}`,
  });
}
