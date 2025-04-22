import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary";
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  ...rest
}) => {
  return (
    <button
    className={`button button-${variant} ${className}`}
    {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
