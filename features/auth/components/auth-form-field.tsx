import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type AuthFormFieldProps = {
  label: string;
  name: string;
  type?: ComponentProps<"input">["type"];
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
  min?: number;
  max?: number;
  autoComplete?: string;
  className?: string;
};

export function AuthFormField({
  label,
  name,
  type = "text",
  placeholder,
  required,
  optional,
  min,
  max,
  autoComplete,
  className
}: AuthFormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={name} className="flex items-baseline gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
        {label}
        {optional && <span className="normal-case tracking-normal text-slate-400">(optional)</span>}
      </label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        autoComplete={autoComplete}
      />
    </div>
  );
}
