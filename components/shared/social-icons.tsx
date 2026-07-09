import { cn } from "@/lib/utils";

type SocialLabel = "Facebook" | "LinkedIn" | "X" | "Instagram" | string;

const brandStyles: Record<string, { label: string; bg: string; text?: string; ring?: string }> = {
  facebook: { label: "Facebook", bg: "#1877F2", text: "#ffffff", ring: "rgba(24,119,242,0.22)" },
  linkedin: { label: "LinkedIn", bg: "#0A66C2", text: "#ffffff", ring: "rgba(10,102,194,0.22)" },
  x: { label: "X", bg: "#111111", text: "#ffffff", ring: "rgba(17,17,17,0.18)" },
  instagram: { label: "Instagram", bg: "linear-gradient(135deg,#F58529 0%,#DD2A7B 42%,#8134AF 72%,#515BD4 100%)", text: "#ffffff", ring: "rgba(221,42,123,0.24)" }
};

function socialKey(label: SocialLabel) {
  const normalized = label.toLowerCase();
  if (normalized.includes("facebook")) return "facebook";
  if (normalized.includes("linkedin")) return "linkedin";
  if (normalized === "x" || normalized.includes("twitter")) return "x";
  if (normalized.includes("instagram")) return "instagram";
  return "x";
}

export function BrandSocialIcon({ label, className }: { label: SocialLabel; className?: string }) {
  const key = socialKey(label);
  const iconClass = cn("h-4 w-4", className);

  if (key === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass} fill="currentColor">
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.9h2.77l-.44 2.91h-2.33V22C18.34 21.24 22 17.08 22 12.06Z" />
      </svg>
    );
  }

  if (key === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass} fill="currentColor">
        <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.68H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.36-1.85 3.59 0 4.26 2.37 4.26 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45ZM22.23 0H1.76C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.76 24h20.47c.97 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0Z" />
      </svg>
    );
  }

  if (key === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass} fill="currentColor">
      <path d="M18.9 2.25h3.08l-6.72 7.68 7.9 10.45h-6.18l-4.84-6.32-5.53 6.32H3.53l7.18-8.21L3.13 2.25h6.34l4.37 5.78 5.06-5.78Zm-1.08 16.29h1.71L8.55 3.99H6.72l11.1 14.55Z" />
    </svg>
  );
}

export function SocialIconLink({
  label,
  href,
  className,
  iconClassName
}: {
  label: SocialLabel;
  href: string;
  className?: string;
  iconClassName?: string;
}) {
  const key = socialKey(label);
  const style = brandStyles[key] ?? brandStyles.x;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm ring-4 transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4",
        className
      )}
      style={{ background: style.bg, color: style.text, boxShadow: `0 10px 24px -12px ${style.ring}`, ['--tw-ring-color' as string]: style.ring }}
      aria-label={`Open ${style.label}`}
      title={style.label}
    >
      <BrandSocialIcon label={label} className={iconClassName} />
    </a>
  );
}
