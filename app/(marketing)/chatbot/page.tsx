import { JsonLd } from "@/components/seo/json-ld";
import { ChatbotWidget } from "@/features/chatbot/components/chatbot-widget";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  faqSchema,
  medicalWebPageSchema,
  webApplicationSchema,
} from "@/lib/seo/schema";

const chatbotFaqs = [
  {
    question: "Can AfiyaPal diagnose my symptoms?",
    answer:
      "No. AfiyaPal provides educational first-step guidance only and does not diagnose, prescribe, or replace a licensed clinician.",
  },
  {
    question: "What should I do if my symptoms are severe?",
    answer:
      "For severe, worsening, or emergency symptoms, seek urgent local medical care immediately or contact local emergency services.",
  },
  {
    question: "Can I use AfiyaPal in Kenya or elsewhere in Africa?",
    answer:
      "Yes. AfiyaPal is built for African healthcare contexts, including Kenya, with accessible language and public health education.",
  },
];

export const metadata = buildMetadata({
  title: "AI Health Assistant and Symptom Checker",
  description:
    "Use AfiyaPal's AI health assistant for educational symptom guidance, healthcare navigation, and safe next-step information for adults in Kenya and Africa.",
  path: "/chatbot",
  keywords: [
    "AI health assistant",
    "symptom checker Kenya",
    "symptom checker Africa",
    "AI medical assistant Africa",
  ],
});

export default function Page() {
  return (
    <main className="container-page py-10">
      <JsonLd
        data={[
          webApplicationSchema(),
          ...medicalWebPageSchema({
            path: "/chatbot",
            title: "AfiyaPal AI Health Assistant and Symptom Checker",
            description:
              "Educational AI symptom guidance and healthcare navigation for adults across Kenya and Africa.",
            breadcrumbs: [{ name: "AI Health Assistant", path: "/chatbot" }],
          }),
          faqSchema(chatbotFaqs),
        ]}
      />
      <ChatbotWidget mode="page" />
    </main>
  );
}
