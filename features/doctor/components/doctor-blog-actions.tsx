"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { deleteDoctorBlogAction, submitDoctorBlogForReviewAction } from "@/features/doctor/actions/doctor-blog-actions";

export function DoctorBlogActions({ blogId, status, large = false }: { blogId: number; status: string; large?: boolean }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this article? This action cannot be undone.")) return;
    const formData = new FormData();
    formData.set("blogId", String(blogId));
    const result = await deleteDoctorBlogAction(formData);
    if (result.ok) router.refresh();
  }

  async function handleSubmitForReview() {
    const formData = new FormData();
    formData.set("blogId", String(blogId));
    const result = await submitDoctorBlogForReviewAction(formData);
    if (result.ok) router.refresh();
  }

  return (
    <div className="flex gap-2">
      {status === "DRAFT" && (
        <button
          onClick={handleSubmitForReview}
          className={cn(
            "text-sm font-semibold text-amber-600 transition hover:text-amber-700",
            large && "min-h-11 flex-1 rounded-full border border-amber-200 bg-amber-50 px-4 text-center hover:bg-amber-100"
          )}
        >
          Submit
        </button>
      )}
      <button
        onClick={handleDelete}
        className={cn(
          "text-sm font-semibold text-rose-600 transition hover:text-rose-700",
          large && "min-h-11 flex-1 rounded-full border border-rose-200 bg-rose-50 px-4 text-center hover:bg-rose-100"
        )}
      >
        Delete
      </button>
    </div>
  );
}
