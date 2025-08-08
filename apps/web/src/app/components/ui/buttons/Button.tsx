import React from "react";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  fullWidth?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-700 text-white hover:bg-gray-800 focus:ring-gray-500",
    outline:
      "border border-white text-white hover:bg-white hover:text-black focus:ring-white",
    ghost: "text-white hover:bg-white/10 focus:ring-white",
  };

  const fullWidthClass = fullWidth ? "w-full" : "";

  const finalClassName = `${baseClasses} ${variantClasses[variant]} ${fullWidthClass} ${className}`.trim();

  return (
    <button className={finalClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;
