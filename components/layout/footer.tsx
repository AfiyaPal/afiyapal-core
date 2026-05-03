export function Footer() {
  return (
    <footer className="mt-20 border-t border-emerald-100 bg-white">
      <div className="container-page flex flex-col gap-3 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} AfiyaPal. All rights reserved.</p>
        <p>This is informational guidance. For emergencies, visit the nearest facility immediately.</p>
      </div>
    </footer>
  );
}
