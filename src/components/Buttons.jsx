import React from "react";
import { ArrowLeft } from "lucide-react";

export function Button({ children, className = "", variant = "primary", ...props }) {
  const bootstrapVariant = {
    ghost: "outline-primary",
    secondary: "warning",
    primary: "primary",
    danger: "danger",
  }[variant] || variant;

  return (
    <button className={`btn btn-${bootstrapVariant} d-inline-flex align-items-center justify-content-center gap-2 fw-semibold ${className}`} {...props}>
      {children}
    </button>
  );
}

export function BackButton({ children = "Back", ...props }) {
  return (
    <button className="btn btn-outline-primary d-inline-flex align-items-center gap-2 fw-semibold mb-4" {...props}>
      <ArrowLeft size={18} />
      {children}
    </button>
  );
}
