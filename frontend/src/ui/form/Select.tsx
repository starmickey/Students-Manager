"use client";

import T from "../TranslatedWord";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  variant: "primary";
  isRequired: boolean;
  errorMessage?: string;
}

export default function Select({
  id,
  label,
  isRequired,
  errorMessage,
  variant,
  ...selectProps
}: SelectProps) {
  return (
    <div className={`input-group input-group-${variant}`}>
      <div className="input-group-content">
        <label htmlFor={id}>
          <T>{label}</T>
          {isRequired && <span className="text-danger">*</span>}
        </label>
        <select id={id} name={id} required={isRequired} {...selectProps}/>
      </div>

      {errorMessage && (
        <div className="text-danger">
          <T>{errorMessage}</T>
        </div>
      )}
    </div>
  );
}
