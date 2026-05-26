import { getPublicEvents } from "@/features/facility/queries/get-public-events";
import { PublicEventsList } from "@/features/facility/components/public-events-list";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Health Events, Medical Camps and Community Screenings",
  description:
    "Find health events, medical camps, free checkups, screenings, and facility-led community healthcare outreach listed on AfiyaPal.",
  path: "/events",
  keywords: ["medical camps Kenya", "health events Africa", "free checkups Kenya", "community health screenings"]
});

export default async function Page() {
  const events = await getPublicEvents();
  return <PublicEventsList events={events} />;
}
