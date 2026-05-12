import { notFound } from "next/navigation";
import { getPublicEventDetail } from "@/features/facility/queries/get-public-events";
import { PublicEventDetailPage } from "@/features/facility/components/public-event-detail-page";

export default async function Page({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const id = Number(eventId);
  if (!Number.isInteger(id)) notFound();

  const event = await getPublicEventDetail(id);
  if (!event) notFound();

  return <PublicEventDetailPage event={event} />;
}
