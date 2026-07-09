import type { ReactNode } from "react";
import { ARTICLE_CATEGORIES, ARTICLE_LANGUAGES } from "@/features/admin/data/content-management";
import { createArticleAction, updateArticleAction } from "@/features/admin/actions/admin-content-actions";

type ArticleFormValue = {
  id?: number;
  title?: string;
  slug?: string;
  excerpt?: string | null;
  content?: string;
  contentCategory?: string;
  language?: string;
  tags?: string | null;
  imageUrl?: string | null;
};

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="text-sm font-black text-slate-700">{children}</span>;
}

export function AdminContentForm({ article }: { article?: ArticleFormValue }) {
  const isEditing = Boolean(article?.id);
  const action = isEditing ? updateArticleAction : createArticleAction;

  return (
    <form action={action} className="space-y-5 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
      {article?.id ? <input type="hidden" name="articleId" value={article.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <FieldLabel>Title</FieldLabel>
          <input name="title" required minLength={4} defaultValue={article?.title ?? ""} className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand-600" placeholder="Example: Malaria prevention basics" />
        </label>
        <label className="space-y-2">
          <FieldLabel>Slug</FieldLabel>
          <input name="slug" defaultValue={article?.slug ?? ""} className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand-600" placeholder="Auto-generated if blank" />
        </label>
        <label className="space-y-2">
          <FieldLabel>Category</FieldLabel>
          <select name="contentCategory" defaultValue={article?.contentCategory ?? "GENERAL_WELLNESS"} className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand-600">
            {ARTICLE_CATEGORIES.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
          </select>
        </label>
        <label className="space-y-2">
          <FieldLabel>Language</FieldLabel>
          <select name="language" defaultValue={article?.language ?? "en"} className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand-600">
            {ARTICLE_LANGUAGES.map((language) => <option key={language.value} value={language.value}>{language.label}</option>)}
          </select>
        </label>
      </div>

      <label className="block space-y-2">
        <FieldLabel>Tags</FieldLabel>
        <input
          name="tags"
          defaultValue={article?.tags ?? ""}
          className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand-600"
          placeholder="Comma-separated topics: malaria, prevention, community health"
        />
        <span className="block text-xs font-semibold text-slate-500">Tags power public blog filtering and help readers find related articles.</span>
      </label>

      <label className="block space-y-2">
        <FieldLabel>Excerpt / short summary</FieldLabel>
        <textarea name="excerpt" rows={3} defaultValue={article?.excerpt ?? ""} className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand-600" placeholder="Brief user-facing summary. If blank, AFIYAPAL uses the first part of the article." />
      </label>

      <label className="block space-y-2">
        <FieldLabel>Article content</FieldLabel>
        <span className="block text-xs font-semibold text-slate-500">Markdown is supported for headings, image sections, tables, and bullet lists.</span>
        <textarea name="content" required minLength={40} rows={14} defaultValue={article?.content ?? ""} className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-semibold leading-7 text-slate-800 outline-none focus:border-brand-600" placeholder="Write medically responsible health education content here..." />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <FieldLabel>Image URL</FieldLabel>
          <input name="imageUrl" defaultValue={article?.imageUrl ?? ""} className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand-600" placeholder="Optional featured image URL" />
        </label>
        <label className="space-y-2">
          <FieldLabel>Image alt text</FieldLabel>
          <input name="imageAlt" className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand-600" placeholder="Optional accessibility description" />
        </label>
      </div>

      <div className="rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        <strong>Medical safety workflow:</strong> new and edited articles stay as drafts until they are submitted for review, medically approved, and then published.
      </div>

      <button type="submit" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800">{isEditing ? "Save article" : "Create article"}</button>
    </form>
  );
}
