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
    <div className="flex flex-col gap-2">
      <label className="text-1xl text-start">{inputLabel}</label>
      <p>
        <input
          className="rounded-md border-2 border-green-800 bg-green-950 mb-2 px-3 py-2 text-white focus:border-green-400 focus:outline-hidden focus:ring-2 focus:ring-green-400/40 focus:zoom-110 focus:shadow-2xl focus:mb-4  "
          placeholder={inputPlaceholder}
          {...props}
        />
      </p>
    </div>
  );
}
