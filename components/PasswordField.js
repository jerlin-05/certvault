"use client";

import { useState } from "react";

export default function PasswordField({
  label,
  value,
  onChange,
  required,
  hint,
  autoComplete,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium tracking-wide text-slate">
        {label}
        {required && <span className="ml-0.5 text-gold-dark">*</span>}
      </span>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          required={required}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-white/15 bg-paper-card px-3.5 py-3 pr-11 text-sm text-paper outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/25"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          tabIndex={-1}
          className="absolute right-0 top-0 flex h-full w-10 items-center justify-center text-slate-light transition hover:text-paper"
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {hint && (
        <span className="mt-1 block text-xs text-slate-light">{hint}</span>
      )}
    </label>
  );
}

function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 5.2A11 11 0 0 1 12 5c7 0 10.5 7 10.5 7a13.4 13.4 0 0 1-3.1 4.1M6.6 6.6C3.7 8.4 1.5 12 1.5 12S5 19 12 19a10.6 10.6 0 0 0 5.4-1.4" />
      <path d="M9.9 10a3 3 0 0 0 4.1 4.1" />
    </svg>
  );
}
