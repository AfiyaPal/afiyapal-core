import { HomePage } from "@/features/home/components/home-page";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "AI Healthcare Assistant, Symptom Checker and Public Health Platform",
  description:
    "AfiyaPal is an AI-powered health assistant, symptom checker, public health intelligence platform, and healthcare education hub for Kenya and Africa.",
  path: "/",
  keywords: ["AI healthcare Africa", "symptom checker Kenya", "telemedicine Kenya", "public health intelligence Africa"]
});

export default function Page() {
  return <HomePage />;
}
