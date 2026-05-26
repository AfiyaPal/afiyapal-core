import { notFound } from "next/navigation";
import { getPublicEventDetail } from "@/features/facility/queries/get-public-events";
import { PublicEventDetailPage } from "@/features/facility/components/public-event-detail-page";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const id = Number(eventId);
  if (!Number.isInteger(id)) return buildMetadata({ title: "Health Event", path: `/events/${eventId}` });

  const event = await getPublicEventDetail(id);
  if (!event) return buildMetadata({ title: "Health Event", path: `/events/${eventId}` });

  return buildMetadata({
    title: event.title,
    description: event.description ?? `Community health event hosted by ${event.facility.name} and listed on AfiyaPal.`,
    path: `/events/${event.id}`,
    keywords: ["health event", "medical camp", event.facility.country, event.facility.city ?? "Africa"].filter(Boolean) as string[]
  });
}

export default async function Page({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const id = Number(eventId);
  if (!Number.isInteger(id)) notFound();

  const event = await getPublicEventDetail(id);
  if (!event) notFound();

  return <PublicEventDetailPage event={event} />;
}
