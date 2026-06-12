import { Slot } from "@/components/ui/slot";
import { cn } from "@/lib/utils";

export function Button({
  className,
  asChild = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft outline-none transition hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/25 active:scale-[0.98] motion-safe:duration-200 disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:active:scale-100 motion-reduce:hover:shadow-soft focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
}
