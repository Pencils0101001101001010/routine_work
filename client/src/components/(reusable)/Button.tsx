import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
}

export default function AuthButton({
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button type={type} className="" {...props}>
      {children}
    </button>
  );
}
