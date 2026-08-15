"use client";

import { useSyncExternalStore } from "react";
import { Check, Download, House, Share, X } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import type { InstallPromptState } from "../hooks/use-install-prompt";

const emptySubscribe = () => () => {};

function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function InstallPromptButton({ installState }: { installState: InstallPromptState }) {
  const { eligible, isIos, install, setIosHelpOpen } = installState;
  if (!eligible) return null;

  return (
    <button
      type="button"
      onClick={() => (isIos ? setIosHelpOpen(true) : install())}
      aria-label={isIos ? "Add AfiyaPal to your home screen" : "Install the AfiyaPal app"}
      className="inline-flex items-center gap-1.5 rounded-full border border-brand-700 px-3 py-1.5 text-xs font-semibold text-brand-200 transition hover:bg-brand-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900"
    >
      <Download className="size-3.5" aria-hidden />
      <span className="hidden sm:inline">{isIos ? "Add to Home Screen" : "Install app"}</span>
    </button>
  );
}

export function InstallPromptBanner({ installState }: { installState: InstallPromptState }) {
  const { eligible, isIos, install, dismissBanner, bannerDismissed, setIosHelpOpen } = installState;
  const isMounted = useIsMounted();

  if (!isMounted || !eligible || bannerDismissed) return null;

  return (
    <div className="flex shrink-0 items-start gap-3 border-b border-brand-800 bg-brand-900/60 px-5 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-100">
          {isIos ? "Add AfiyaPal to your home screen" : "Get the AfiyaPal app"}
        </p>
        <p className="mt-0.5 text-xs leading-5 text-slate-400">
          {isIos
            ? "Open in Safari, tap Share, then \u201cAdd to Home Screen\u201d for quick access to the health assistant."
            : "Install AfiyaPal for an app-like experience with quick access to the health assistant."}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => (isIos ? setIosHelpOpen(true) : install())}
          className="rounded-full bg-brand-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900"
        >
          {isIos ? "How to add" : "Install"}
        </button>
        <button
          type="button"
          onClick={dismissBanner}
          aria-label="Dismiss install prompt"
          className="inline-flex size-7 items-center justify-center rounded-full text-brand-300 transition hover:bg-brand-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

const IOS_STEPS = [
  { icon: Share, text: "Tap the Share button in Safari" },
  { icon: House, text: "Scroll down and tap \u201cAdd to Home Screen\u201d" },
  { icon: Check, text: "Tap \u201cAdd\u201d to place AfiyaPal on your home screen" }
];

export function InstallIosModal({ installState }: { installState: InstallPromptState }) {
  const { iosHelpOpen, setIosHelpOpen } = installState;

  return (
    <Modal open={iosHelpOpen} onClose={() => setIosHelpOpen(false)} title="Add AfiyaPal to your home screen">
      <ol className="space-y-3">
        {IOS_STEPS.map((step, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-800 text-brand-200">
              <step.icon className="size-4" aria-hidden />
            </span>
            <p className="pt-1 text-sm leading-6 text-slate-300">{step.text}</p>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={() => setIosHelpOpen(false)}
          className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900"
        >
          Got it
        </button>
      </div>
    </Modal>
  );
}
