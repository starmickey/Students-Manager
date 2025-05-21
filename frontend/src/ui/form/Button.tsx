import { ButtonHTMLAttributes } from "react";

export type ButtonVariant =
  | "primary"
  | "primary-outline"
  | "secondary"
  | "secondary-outline";
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
  ...rest
}) => {
  return (
    <button
      className={`button button-${variant} button-${size} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
