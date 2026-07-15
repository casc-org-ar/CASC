import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const shellVariants: Record<ButtonVariant, string> = {
  primary: "from-accent/45 to-transparent focus-visible:ring-primary",
  secondary:
    "from-casc-gray/70 to-transparent focus-visible:ring-accent",
  ghost: "from-transparent to-transparent focus-visible:ring-accent",
  danger: "from-red-300/60 to-transparent focus-visible:ring-red-500",
};

const surfaceVariants: Record<ButtonVariant, string> = {
  primary:
    "from-primary-hover to-primary shadow-[0_1px_2px_rgba(0,0,0,0.22)] active:shadow-[0_0_1px_rgba(0,0,0,0.22)]",
  secondary:
    "from-white to-casc-gray-100 shadow-[0_1px_2px_rgba(15,23,42,0.14)] active:shadow-[0_0_1px_rgba(15,23,42,0.14)]",
  ghost: "from-transparent to-transparent shadow-none",
  danger:
    "from-red-500 to-red-700 shadow-[0_1px_2px_rgba(0,0,0,0.2)] active:shadow-[0_0_1px_rgba(0,0,0,0.2)]",
};

const contentVariants: Record<ButtonVariant, string> = {
  primary:
    "from-primary to-primary-hover text-white group-hover:from-primary-hover group-hover:to-primary",
  secondary:
    "from-casc-gray-100/80 to-white text-ink group-hover:from-white group-hover:to-casc-gray-100",
  ghost:
    "from-transparent to-transparent text-ink group-hover:from-surface group-hover:to-surface",
  danger:
    "from-red-600 to-red-700 text-white group-hover:from-red-700 group-hover:to-red-600",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-5 px-3 text-sm",
  md: "min-h-7 px-4 text-sm",
  lg: "min-h-9 px-5 text-sm",
};

function buttonShellClassName({
  variant,
  className,
}: {
  variant: ButtonVariant;
  className?: string;
}) {
  return cn(
    "group inline-flex items-stretch justify-center rounded-[16px] bg-gradient-to-b p-[3px] align-middle font-semibold transition-transform duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.995] disabled:pointer-events-none disabled:opacity-55 disabled:active:scale-100",
    shellVariants[variant],
    className,
  );
}

function ButtonContent({
  children,
  variant,
  size,
}: {
  children: React.ReactNode;
  variant: ButtonVariant;
  size: ButtonSize;
}) {
  return (
    <span
      className={cn(
        "flex h-full w-full items-center justify-center rounded-[12px] bg-gradient-to-b p-[3px] transition-shadow duration-150",
        surfaceVariants[variant],
      )}
    >
      <span
        className={cn(
          "flex h-full w-full items-center justify-center gap-2 rounded-[8px] bg-gradient-to-b leading-none transition-colors duration-150",
          contentVariants[variant],
          sizes[size],
        )}
      >
        {children}
      </span>
    </span>
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => (
    <button
      ref={ref}
      className={buttonShellClassName({ variant, className })}
      {...props}
    >
      <ButtonContent variant={variant} size={size}>
        {children}
      </ButtonContent>
    </button>
  ),
);
Button.displayName = "Button";

export interface ButtonLinkProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Link>, "className"> {
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={buttonShellClassName({ variant, className })} {...props}>
      <ButtonContent variant={variant} size={size}>
        {children}
      </ButtonContent>
    </Link>
  );
}

export interface ButtonAnchorProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const ButtonAnchor = React.forwardRef<HTMLAnchorElement, ButtonAnchorProps>(
  (
    { className, variant = "primary", size = "md", children, ...props },
    ref,
  ) => (
    <a
      ref={ref}
      className={buttonShellClassName({ variant, className })}
      {...props}
    >
      <ButtonContent variant={variant} size={size}>
        {children}
      </ButtonContent>
    </a>
  ),
);
ButtonAnchor.displayName = "ButtonAnchor";
