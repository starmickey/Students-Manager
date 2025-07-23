"use client";

import { translate } from "@/app/api/translate/route";
import { useSearchParams } from "next/navigation";
import { ButtonHTMLAttributes, useEffect, useState } from "react";

export type ButtonVariant =
  | "primary"
  | "primary-outline"
  | "secondary"
  | "secondary-outline"
  | "ghost";
export type ButtonSize = "base" | "small";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "base",
  title,
  ...rest
}) => {
  const searchParams = useSearchParams();

  const [translatedTitle, setTranslatedTitle] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchTranslations = async () => {
      if (title) {
        const lang = searchParams.get("lang") || "en";
        await translate(title, lang).then((t) => setTranslatedTitle(t));
      }
    };
    fetchTranslations();
  }, []);

  return (
    <button
      className={`button button-${variant} button-${size} ${className}`}
      title={translatedTitle}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
