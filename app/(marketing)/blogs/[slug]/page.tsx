import { notFound } from "next/navigation";
import { BlogDetail } from "@/features/blogs/components/blog-detail";
import { getBlogBySlug } from "@/features/blogs/queries/get-blog-by-slug";
import { getCurrentUser } from "@/server/auth/session";
import { getVoteCounts, getUserVote, canUserVote } from "@/features/doctor/queries/get-votes";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return buildMetadata({ title: "Health Article", path: `/blogs/${slug}` });

  return buildMetadata({
    title: blog.title,
    description: blog.excerpt,
    path: `/blogs/${blog.slug}`,
    image: blog.imageUrl ?? "/opengraph-image",
    type: "article",
    publishedTime: blog.createdAt ? new Date(blog.createdAt).toISOString() : undefined,
    modifiedTime: blog.createdAt ? new Date(blog.createdAt).toISOString() : undefined,
    keywords: [blog.category ?? "health education", ...(blog.tags ?? []), "medical blog Africa", "AfiyaPal health article"],
    authors: ["AfiyaPal Editorial Team"]
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();

  const blogId = typeof blog.id === "number" ? blog.id : 0;
  const user = await getCurrentUser();

  let voteUp = 0;
  let voteDown = 0;
  let userVote: "UP" | "DOWN" | null = null;
  let canVote = false;

  if (blogId > 0) {
    const votes = await getVoteCounts(blogId);
    voteUp = votes.up;
    voteDown = votes.down;
    if (user) {
      userVote = await getUserVote(blogId, user.id);
      canVote = await canUserVote(user.id);
    }
  }

  return (
    <BlogDetail
      blog={blog}
      voteUp={voteUp}
      voteDown={voteDown}
      userVote={userVote}
      canVote={canVote}
    />
  );
}
