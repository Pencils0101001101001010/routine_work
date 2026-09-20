import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputLabel: string;
  inputPlaceholder?: string;
}

export default function InputFields({
  inputLabel,
  inputPlaceholder,
  ...props
}: InputProps) {
  return (
    <div>
      <label>{inputLabel}</label>
      <p>
        <input placeholder={inputPlaceholder} {...props} />
      </p>
    </div>
  );
}
