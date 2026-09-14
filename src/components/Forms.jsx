import React from "react";

export function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function SearchInput({ value, onChange }) {
  return (
    <input
      className="search-input"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search products"
    />
  );
}
