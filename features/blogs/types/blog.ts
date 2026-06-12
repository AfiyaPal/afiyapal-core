export type BlogSummary = {
  id: number | string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl?: string | null;
  createdAt?: Date | string | null;
  contentCategory?: string | null;
};

export type BlogDetailModel = BlogSummary & {
  content: string;
  category?: string | null;
};
