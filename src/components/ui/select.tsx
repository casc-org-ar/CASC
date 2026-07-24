import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  options: SelectOption[];
  /** Optional label rendered above the control. */
  label?: string;
}

/**
 * Styled wrapper around a native <select>. Keeps native keyboard and
 * screen-reader behaviour while giving the control the site's field styling and
 * a custom chevron, so the six associate filters read as one consistent set
 * instead of the browser's default widget.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, label, className, id, ...props }, ref) => {
    const control = (
      <div className="relative">
        <select
          ref={ref}
          id={id}
          className={cn(
            "h-11 w-full cursor-pointer appearance-none rounded-lg border border-border bg-bg py-2 pl-3.5 pr-10 text-sm font-medium text-ink shadow-sm outline-none transition-colors",
            "hover:border-accent/70 focus:border-primary focus:ring-2 focus:ring-accent/30",
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
          aria-hidden="true"
        />
      </div>
    );

    if (!label) return control;

    return (
      <label className="block">
        <span className="text-sm font-semibold text-ink">{label}</span>
        <div className="mt-2">{control}</div>
      </label>
    );
  },
);
Select.displayName = "Select";
