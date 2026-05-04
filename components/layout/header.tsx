import Link from "next/link";
import { routes } from "@/lib/routes";

const navItems = [
  { label: "Home", href: routes.home },
  { label: "Blogs", href: routes.blogs },
  { label: "Chatbot", href: routes.chatbot },
  { label: "Admin", href: routes.admin },
  { label: "Login", href: routes.login }
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-bold text-brand-700">AfiyaPal</Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-700 hover:text-brand-700">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
