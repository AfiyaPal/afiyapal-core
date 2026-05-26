import { Footer } from "./footer";
import { Header } from "./header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-theme-background text-theme-foreground">
      <Header />
      <div id="main-content">{children}</div>
      <Footer />
    </div>
  );
}
