import React from "react";
import { ArrowLeft } from "lucide-react";

export function Button({ children, className = "", variant = "primary", ...props }) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function BackButton({ children = "Back", ...props }) {
  return (
    <button className="back-button" {...props}>
      <ArrowLeft size={18} />
      {children}
    </button>
  );
}
