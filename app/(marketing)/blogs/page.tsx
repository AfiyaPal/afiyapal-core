import { BlogList } from "@/features/blogs/components/blog-list";
import { getPublishedBlogs } from "@/features/blogs/queries/get-published-blogs";

export const metadata = { title: "Blogs" };

export default async function Page() {
  const blogs = await getPublishedBlogs();
  return <BlogList blogs={blogs} />;
}
