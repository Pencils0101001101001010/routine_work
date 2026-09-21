import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  isSubmitting?: boolean;
}

export default function AuthButton({
  children,
  type = "button",
  isSubmitting,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={
        isSubmitting
          ? "rounded-md border-2 border-green-80/70 bg-green-950/70  px-3 py-2 text-white "
          : "rounded-md border-2 border-green-800 bg-green-950  px-3 py-2 text-white hover:border-green-400 hover:ring-green-400/40 hover:shadow-2xl"
      }
      {...props}
    >
      {children}
    </button>
  );
}
