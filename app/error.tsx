"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="container-page flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="max-w-xl text-slate-600">Please try again. If the problem continues, contact support.</p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
