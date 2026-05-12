"use client";

import { useRouter } from "next/navigation";
import { deleteDoctorBlogAction, submitDoctorBlogForReviewAction } from "@/features/doctor/actions/doctor-blog-actions";

export function DoctorBlogActions({ blogId, status }: { blogId: number; status: string }) {
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
          className="text-sm font-semibold text-amber-600 hover:text-amber-700"
        >
          Submit
        </button>
      )}
      <button
        onClick={handleDelete}
        className="text-sm font-semibold text-rose-600 hover:text-rose-700"
      >
        Delete
      </button>
    </div>
  );
}
