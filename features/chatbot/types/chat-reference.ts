export type ChatReference = {
  kind: "blog" | "professional";
  href: string;
  title: string;
  excerpt: string | null;
};
