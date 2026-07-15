import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type IconFrameSize = "sm" | "md" | "lg" | "xl" | "avatar" | "avatarLg";
type IconFrameVariant = "primary" | "secondary" | "solid";

const sizes: Record<IconFrameSize, string> = {
  sm: "h-10 w-10",
  md: "h-11 w-11",
  lg: "h-12 w-12",
  xl: "h-14 w-14",
  avatar: "h-16 w-16",
  avatarLg: "h-20 w-20",
};

const shellVariants: Record<IconFrameVariant, string> = {
  primary: "from-accent/45 to-transparent",
  secondary: "from-casc-gray/70 to-transparent",
  solid: "from-accent/60 to-transparent",
};

const surfaceVariants: Record<IconFrameVariant, string> = {
  primary: "from-white to-casc-gray-100",
  secondary: "from-white to-casc-gray-100",
  solid: "from-primary-hover to-primary",
};

const contentVariants: Record<IconFrameVariant, string> = {
  primary: "from-casc-gray-100/80 to-white text-primary",
  secondary: "from-casc-gray-100/80 to-white text-ink-muted",
  solid: "from-primary to-primary-hover text-white",
};

export function IconFrame({
  children,
  size = "md",
  variant = "primary",
  className,
  contentClassName,
  decorative = true,
}: {
  children: ReactNode;
  size?: IconFrameSize;
  variant?: IconFrameVariant;
  className?: string;
  contentClassName?: string;
  decorative?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-[16px] bg-gradient-to-b p-[3px] transition-transform duration-150",
        sizes[size],
        shellVariants[variant],
        className,
      )}
      aria-hidden={decorative}
    >
      <span
        className={cn(
          "flex h-full w-full items-center justify-center rounded-[12px] bg-gradient-to-b p-[3px] shadow-[0_1px_2px_rgba(15,23,42,0.14)]",
          surfaceVariants[variant],
        )}
      >
        <span
          className={cn(
            "relative flex h-full w-full items-center justify-center overflow-hidden rounded-[8px] bg-gradient-to-b transition-colors duration-150",
            contentVariants[variant],
            contentClassName,
          )}
        >
          {children}
        </span>
      </span>
    </span>
  );
}
