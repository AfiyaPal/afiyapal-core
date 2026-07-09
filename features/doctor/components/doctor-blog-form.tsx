"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { ARTICLE_CATEGORIES, ARTICLE_LANGUAGES } from "@/features/admin/data/content-management";
import { createDoctorBlogAction, updateDoctorBlogAction } from "@/features/doctor/actions/doctor-blog-actions";

type Props = {
  blog?: {
    id: number;
    title: string;
    excerpt: string | null;
    content: string;
    contentCategory: string;
    language: string;
    tags?: string | null;
  };
};

const initialState = { ok: false, message: null as string | null };

export function DoctorBlogForm({ blog }: Props) {
  const action = blog ? updateDoctorBlogAction : createDoctorBlogAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {blog && <input type="hidden" name="blogId" value={blog.id} />}

      <div className="space-y-4">
        <Input name="title" type="text" placeholder="Article title" defaultValue={blog?.title} required />
        <Input name="excerpt" type="text" placeholder="Short excerpt (optional)" defaultValue={blog?.excerpt ?? ""} />
        <Input name="tags" type="text" placeholder="Tags (comma-separated): malaria, prevention, community health" defaultValue={blog?.tags ?? ""} />
        <textarea
          name="content"
          placeholder="Write your article content here. Markdown is supported for headings, image sections, tables, and bullet lists..."
          defaultValue={blog?.content}
          required
          rows={16}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wide text-slate-600">Category</label>
          <select
            name="contentCategory"
            defaultValue={blog?.contentCategory ?? "GENERAL_WELLNESS"}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          >
            {ARTICLE_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wide text-slate-600">Language</label>
          <select
            name="language"
            defaultValue={blog?.language ?? "en"}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          >
            {ARTICLE_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
        </div>
      </div>

      <FormMessage message={state.message} type={state.ok ? "success" : "error"} />
      <div className="flex gap-3">
        <Button disabled={pending} className="flex-1">
          {pending ? "Saving..." : blog ? "Update article" : "Create article"}
        </Button>
      </div>
    </form>
  );
}
