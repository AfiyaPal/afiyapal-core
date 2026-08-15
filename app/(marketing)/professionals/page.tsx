import { Suspense } from "react";
import { ProfessionalsDirectory } from "@/features/professionals/components/professionals-directory";
import { getPublicProfessionals } from "@/features/professionals/queries/get-public-professionals";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Verified Health Professionals",
  description:
    "Browse verified health professionals on AfiyaPal. Each profile shows specialty, location, published articles, and affiliated facilities.",
  path: "/professionals",
  keywords: ["verified doctors Kenya", "health professionals Africa", "local healthcare providers", "AfiyaPal professionals"]
});

export default async function Page() {
  const professionals = await getPublicProfessionals();
  return (
    <Suspense>
      <ProfessionalsDirectory professionals={professionals} />
    </Suspense>
  );
}
