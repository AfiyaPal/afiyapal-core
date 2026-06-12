import { MessageCircle, ShieldCheck, BookOpen } from "lucide-react";

const highlights = [
  { icon: MessageCircle, text: "AI symptom checker in English & Swahili" },
  { icon: ShieldCheck,   text: "Safe, evidence-aware health guidance" },
  { icon: BookOpen,      text: "Trusted health articles & resources" }
];

export function AuthCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex w-full max-w-3xl overflow-hidden rounded-3xl shadow-[0_24px_80px_-12px_rgb(23_163_107_/_0.18)]">
      {/* Left brand panel */}
      <div className="hidden w-[44%] flex-col justify-between bg-gradient-to-br from-brand-600 via-brand-700 to-teal-700 p-8 text-white md:flex">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 ring-2 ring-white/30">
              <span className="text-base font-black">A</span>
            </span>
            <span className="text-lg font-bold tracking-tight">AfiyaPal</span>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-brand-100">
            AI-powered health guidance built for African communities.
          </p>
        </div>

        <ul className="space-y-4">
          {highlights.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white/15">
                <Icon className="h-3.5 w-3.5" aria-hidden />
              </span>
              <span className="text-sm text-brand-100">{text}</span>
            </li>
          ))}
        </ul>

        <p className="text-xs text-brand-200">
          © {new Date().getFullYear()} AfiyaPal. Informational guidance only.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 bg-white p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-1.5 text-sm text-slate-500">{description}</p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
