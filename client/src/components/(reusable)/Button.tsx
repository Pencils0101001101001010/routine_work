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
          ? "rounded-2xl border-2 border-green-80/70 bg-[#ecc999]/70  px-3 py-2 text-white "
          : "rounded-2xl shadow-2xl border-t border-b border-[#ecc999] bg-[#00000068] backdrop-blur-md mb-2  px-3 py-2 text-white hover:border-[#d3ae7b] hover:ring-[#f8eddd] hover:shadow-2xl"
      }
      {...props}
    >
      {children}
    </button>
  );
}
