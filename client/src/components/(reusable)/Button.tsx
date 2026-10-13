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
          ? "rounded-2xl border-2 border-green-80/70 bg-green-950/70  px-3 py-2 text-white "
          : "rounded-2xl shadow-2xl border-t border-b border-green-400 bg-[#00000068] backdrop-blur-md mb-2  px-3 py-2 text-white hover:border-green-200 hover:ring-green-400/40 hover:shadow-2xl"
      }
      {...props}
    >
      {children}
    </button>
  );
}
