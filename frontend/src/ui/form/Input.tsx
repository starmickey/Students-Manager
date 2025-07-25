"use client";

import T from "../TranslatedWord";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  variant: "primary";
  isRequired: boolean;
  errorMessage?: string;
}

export default function Input({
  id,
  label,
  placeholder,
  isRequired,
  errorMessage,
  variant,
  ...inputProps
}: InputProps) {
  return (
    <div className={`input-group input-group-${variant}`}>
      <div className="input-group-content">
        <label htmlFor={id}>
          <T>{label}</T>
          {isRequired && <span className="text-danger">*</span>}
        </label>
        <input id={id} required={isRequired} {...inputProps} />
      </div>

      {errorMessage && (
        <div className="input-error">
          <T>{errorMessage}</T>
        </div>
      )}
    </div>
  );
}
