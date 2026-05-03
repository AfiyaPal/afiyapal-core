export function FormMessage({ message, type = "info" }: { message?: string | null; type?: "info" | "error" | "success" }) {
  if (!message) return null;
  const styles = {
    info: "border-slate-200 bg-slate-50 text-slate-700",
    error: "border-red-200 bg-red-50 text-red-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700"
  }[type];
  return <p className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>{message}</p>;
}
