import { cn } from "@/lib/utils";
import { HTMLProps, useEffect, useRef } from "react";

export function DataTableCheckBox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);
  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={cn(
        "cursor-pointer peer size-4 shrink-0 rounded-sm border border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-primary data-[state=checked]:text-primary-foreground",
        className
      )}
      {...rest}
    />
  );
}
