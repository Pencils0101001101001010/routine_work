import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputLabel: string;
  inputPlaceholder?: string;
  error?: string;
  htmlLabelFor?: string;
}
// million-ignore
export default function InputFields({
  inputLabel,
  inputPlaceholder,
  error,
  htmlLabelFor,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-2 text-center mb-2">
      <label className="text-1xl " htmlFor={htmlLabelFor}>
        {inputLabel}
      </label>
      <p>
        {error && <p className="text-red-400 text-xs mt-1 mb-1">{error}</p>}

        <input
          className="rounded-2xl shadow-2xl border-l border-r border-green-400 bg-[#00000068] backdrop-blur-md px-3 py-2 text-white focus:border-green-400 focus:outline-hidden focus:ring-2 focus:ring-green-400/40 focus:zoom-110 focus:shadow-2xl focus:mb-4  "
          placeholder={inputPlaceholder}
          {...props}
        />
      </p>
    </div>
  );
}
