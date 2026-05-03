import { notFound } from "next/navigation";
import { BlogDetail } from "@/features/blogs/components/blog-detail";
import { getBlogBySlug } from "@/features/blogs/queries/get-blog-by-slug";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  return { title: blog?.title ?? "Blog" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();
  return <BlogDetail blog={blog} />;
}
