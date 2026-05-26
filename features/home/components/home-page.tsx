import { JsonLd } from "@/components/seo/json-ld";
import { faqSchema, medicalWebPageSchema } from "@/lib/seo/schema";
import { BenefitsSection } from "./benefits-section";
import { FeaturedBlogsSection } from "./featured-blogs-section";
import { HeroSlider } from "./hero-slider";
import { homeFaqs } from "../data/home-content";

export function HomePage() {
  return (
    <main>
      <JsonLd
        data={[
          ...medicalWebPageSchema({
            path: "/",
            title:
              "AfiyaPal - AI-powered public health intelligence for Africa",
            description:
              "AI-assisted symptom guidance, healthcare education, mental health support, and community public health information for adults across Kenya and Africa.",
          }),
          faqSchema(homeFaqs),
        ]}
      />
      <HeroSlider />
      <BenefitsSection />
      <section
        className="container-page py-16"
        aria-labelledby="ai-search-summary-title"
      >
        <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm md:p-10">
          <h2
            id="ai-search-summary-title"
            className="mt-3 text-3xl font-black tracking-tight text-slate-950"
          >
            What AfiyaPal helps with
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <article>
              <h3 className="font-bold text-slate-950">
                Symptom checker Kenya & Africa
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Adults can describe symptoms and receive careful first-step
                guidance, red-flag reminders, and suggestions for when to
                consult a clinician.
              </p>
            </article>
            <article>
              <h3 className="font-bold text-slate-950">
                Healthcare education Africa
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Patients, NGOs, students, and providers can access practical
                educational content for prevention, wellness, and community
                health literacy.
              </p>
            </article>
            <article>
              <h3 className="font-bold text-slate-950">
                Public health intelligence
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                AfiyaPal organizes health events, medical camps, and platform
                knowledge so people and AI search systems can discover relevant
                health resources.
              </p>
            </article>
          </div>
        </div>
      </section>
      <FeaturedBlogsSection />
      <section className="container-page py-12" aria-labelledby="faq-title">
        <h2 id="faq-title" className="text-3xl font-black tracking-tight">
          AfiyaPal FAQs
        </h2>
        <div className="mt-6 divide-y divide-emerald-100 rounded-3xl border border-emerald-100 bg-white">
          {homeFaqs.map((faq) => (
            <details key={faq.question} className="group p-6">
              <summary className="cursor-pointer list-none font-bold text-slate-950 group-open:text-brand-700">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
