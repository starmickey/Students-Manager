import { fetchTranslation } from "@/api/translatorApi";
import { Suspense } from "react";
import WordSkeleton from "../WordSkeleton";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  variant: "primary";
  isRequired: boolean;
  errorMessage?: string;
}

async function InputComponent({
  id,
  label,
  placeholder,
  isRequired,
  errorMessage,
  variant,
  ...inputProps
}: InputProps) {
  const translatedLabel = await fetchTranslation(label);
  const translatedErrorMessage = errorMessage
    ? await fetchTranslation(errorMessage)
    : undefined;

  return (
    <div className={`input-group input-group-${variant}`}>
      <div className="input-group-content">
        <label htmlFor={id}>
          {translatedLabel}
          {isRequired && <span className="text-danger">*</span>}
        </label>
        <input id={id} required={isRequired} {...inputProps} />
      </div>
      {translatedErrorMessage && (
        <div className="text-danger">{errorMessage}</div>
      )}
    </div>
  );
}

function InputSkeleton({ variant }: { variant: string }) {
  return (
    <div className={`input-group input-group-${variant}`}>
      <div className="input-group-content">
        <WordSkeleton height="sm" width="sm" />
        <WordSkeleton />
      </div>
    </div>
  );
}

export default function Input(props: InputProps) {
  return (
    <Suspense fallback={<InputSkeleton variant={props.variant} />}>
      <InputComponent {...props} />
    </Suspense>
  );
}
