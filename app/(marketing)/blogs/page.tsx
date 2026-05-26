import { BlogList } from "@/features/blogs/components/blog-list";
import { getPublishedBlogs } from "@/features/blogs/queries/get-published-blogs";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Health Education Articles and Medical Blogs",
  description:
    "Read AfiyaPal health education articles on prevention, mental wellbeing, nutrition, sleep, public health, and practical healthcare choices across Africa.",
  path: "/blogs",
  keywords: ["healthcare education Africa", "health articles Kenya", "public health blogs", "medical education Africa"]
});

export default async function Page() {
  const blogs = await getPublishedBlogs();
  return <BlogList blogs={blogs} />;
}
