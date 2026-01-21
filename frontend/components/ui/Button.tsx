import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "primary", size = "md", children, ...props },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-ink text-paper hover:bg-ink/90 focus:ring-ink",
      secondary:
        "bg-cream text-ink hover:bg-cream/80 focus:ring-cream",
      outline:
        "border-2 border-ink text-ink hover:bg-ink hover:text-paper focus:ring-ink",
      ghost:
        "text-ink hover:bg-ink/5 focus:ring-ink",
    };

    const sizes = {
      sm: "text-sm px-3 py-1.5 rounded-md",
      md: "text-base px-5 py-2.5 rounded-lg",
      lg: "text-lg px-8 py-3.5 rounded-lg",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
