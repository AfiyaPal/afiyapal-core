import { getPublicEvents } from "@/features/facility/queries/get-public-events";
import { PublicEventsList } from "@/features/facility/components/public-events-list";

export const metadata = { title: "Health events & medical camps" };

export default async function Page() {
  const events = await getPublicEvents();
  return <PublicEventsList events={events} />;
}
