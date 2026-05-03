import { Footer } from "./footer";
import { Header } from "./header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8fffb] text-slate-950">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
