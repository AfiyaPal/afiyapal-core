"use client";

import { useRouter } from "next/navigation";
import { deleteEventAction, removeFacilityProfessionalAction } from "@/features/facility/actions/facility-actions";

export function DeleteEventButton({ eventId }: { eventId: number }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    const formData = new FormData();
    formData.set("eventId", String(eventId));
    const result = await deleteEventAction(formData);
    if (result.ok) router.refresh();
  }

  return (
    <button onClick={handleDelete} className="text-sm font-semibold text-rose-600 hover:text-rose-700">
      Delete
    </button>
  );
}

export function RemoveProfessionalButton({ professionalId }: { professionalId: number }) {
  const router = useRouter();

  async function handleRemove() {
    if (!confirm("Remove this professional from your facility?")) return;
    const formData = new FormData();
    formData.set("professionalId", String(professionalId));
    const result = await removeFacilityProfessionalAction(formData);
    if (result.ok) router.refresh();
  }

  return (
    <button onClick={handleRemove} className="text-sm font-semibold text-rose-600 hover:text-rose-700">
      Remove
    </button>
  );
}
