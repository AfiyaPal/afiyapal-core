"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatReference } from "../types/chat-reference";
import { cn } from "@/lib/utils";

const linkClass = "font-semibold text-brand-300 underline underline-offset-2 transition hover:text-brand-200";

export function ChatMarkdown({
  text,
  references,
  onOpenRef
}: {
  text: string;
  references: ChatReference[] | undefined;
  onOpenRef: (ref: ChatReference) => void;
}) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="first:mt-0 [&:not(:first-child)]:mt-2">{children}</p>,
        strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
        em: ({ children }) => <em>{children}</em>,
        h1: ({ children }) => <p className="font-bold text-white [&:not(:first-child)]:mt-3">{children}</p>,
        h2: ({ children }) => <p className="font-bold text-white [&:not(:first-child)]:mt-3">{children}</p>,
        h3: ({ children }) => <p className="font-bold text-white [&:not(:first-child)]:mt-3">{children}</p>,
        ul: ({ children }) => <ul className="mt-2 list-disc space-y-1 pl-5">{children}</ul>,
        ol: ({ children }) => <ol className="mt-2 list-decimal space-y-1 pl-5">{children}</ol>,
        li: ({ children }) => <li className="marker:text-brand-400">{children}</li>,
        hr: () => <hr className="my-3 border-brand-700" />,
        blockquote: ({ children }) => (
          <blockquote className="mt-2 rounded-lg border-l-4 border-brand-500 bg-brand-800/50 px-3 py-2">{children}</blockquote>
        ),
        code: ({ children }) => (
          <code className="rounded bg-brand-800 px-1.5 py-0.5 text-xs text-brand-200">{children}</code>
        ),
        a: ({ href, children }) => {
          if (!href) return <>{children}</>;
          const external = /^https?:\/\//.test(href);
          if (external) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {children}
              </a>
            );
          }
          const ref = references?.find((r) => r.href === href);
          if (ref) {
            return (
              <button type="button" onClick={() => onOpenRef(ref)} className={cn(linkClass, "cursor-pointer")}>
                {children}
              </button>
            );
          }
          return (
            <Link href={href} className={linkClass}>
              {children}
            </Link>
          );
        }
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
