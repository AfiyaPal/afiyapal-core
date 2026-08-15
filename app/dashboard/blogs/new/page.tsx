import { getCurrentUser } from "@/server/auth/session";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { DoctorBlogForm } from "@/features/doctor/components/doctor-blog-form";
import { suggestBlogCategory } from "@/server/services/community-insights/get-community-topics";

export const metadata = { title: "Write new article" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "DOCTOR") redirect(routes.login);

  const params = await searchParams;
  const topic = typeof params.topic === "string" ? params.topic : undefined;
  const topicLabel = typeof params.topicLabel === "string" ? params.topicLabel : undefined;

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-black tracking-tight text-slate-950">Write new article</h1>
      <p className="mt-1 text-sm text-slate-600">Share your health expertise with the AfiyaPal community.</p>
      {topicLabel && (
        <p className="mt-3 rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-800">
          Suggested by community insights: write about <strong>{topicLabel}</strong>. You can edit the prefilled title, tags, and category below.
        </p>
      )}
      <div className="mt-8">
        <DoctorBlogForm
          initialTitle={topicLabel ? `Understanding ${topicLabel}` : undefined}
          initialTags={topic ? topic.replaceAll("-", ", ") : undefined}
          initialCategory={topic ? suggestBlogCategory(topic) : undefined}
        />
      </div>
    </div>
  );
}
