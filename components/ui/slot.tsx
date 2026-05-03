import { cloneElement, isValidElement } from "react";

export function Slot({ children, ...props }: React.HTMLAttributes<HTMLElement>) {
  if (isValidElement(children)) {
    return cloneElement(children, { ...props } as never);
  }
  return null;
}
