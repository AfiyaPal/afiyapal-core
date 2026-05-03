import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container-page flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-slate-600">The page you are looking for does not exist.</p>
      <Button asChild><Link href="/">Go home</Link></Button>
    </main>
  );
}
