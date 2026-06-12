import { Footer } from "./footer";
import { Header } from "./header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-transparent text-theme-foreground">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
