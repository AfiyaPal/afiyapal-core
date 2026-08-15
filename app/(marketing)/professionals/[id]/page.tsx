import { notFound } from "next/navigation";
import { ProfessionalProfile } from "@/features/professionals/components/professional-profile";
import { getPublicProfessionalById } from "@/features/professionals/queries/get-public-professionals";
import { buildMetadata } from "@/lib/seo/metadata";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  const numericId = Number(id);
  const professional = Number.isFinite(numericId) ? await getPublicProfessionalById(numericId) : null;

  if (!professional) {
    return buildMetadata({ title: "Professional Profile", path: `/professionals/${id}`, noIndex: true });
  }

  const location = [professional.cityRegion, professional.country].filter(Boolean).join(", ");
  return buildMetadata({
    title: professional.fullName,
    description: `${professional.fullName} — ${professional.specialty ?? "health professional"}${location ? ` in ${location}` : ""}. Verified profile on AfiyaPal.`,
    path: `/professionals/${id}`,
    keywords: [professional.specialty ?? "health professional", "verified professional", "AfiyaPal professional"]
  });
}

export default async function Page({ params }: Params) {
  const { id } = await params;
  const numericId = Number(id);
  const professional = Number.isFinite(numericId) ? await getPublicProfessionalById(numericId) : null;

  if (!professional) notFound();

  return <ProfessionalProfile professional={professional} />;
}
