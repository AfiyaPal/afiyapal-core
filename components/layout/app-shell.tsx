import { Footer } from "./footer";
import { Header } from "./header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-theme-background text-theme-foreground">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
