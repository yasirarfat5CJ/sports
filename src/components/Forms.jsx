import React from "react";

export function Field({ label, children }) {
  return (
    <label className="form-label w-100 fw-semibold">
      <span className="d-block small text-uppercase text-muted mb-1">{label}</span>
      {children}
    </label>
  );
}

export function SearchInput({ value, onChange }) {
  return (
    <input
      className="form-control form-control-lg shadow-sm mb-4 search-input"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search products"
    />
  );
}
