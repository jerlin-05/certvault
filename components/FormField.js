export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  required,
  hint,
  placeholder,
  autoComplete,
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium tracking-wide text-slate">
        {label}
        {required && <span className="ml-0.5 text-gold-dark">*</span>}
      </span>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-ink/15 bg-paper-card px-3.5 py-3 text-sm text-ink outline-none transition placeholder:text-slate-light/70 focus:border-gold focus:ring-1 focus:ring-gold/25"
      />
      {hint && (
        <span className="mt-1 block text-xs text-slate-light">{hint}</span>
      )}
    </label>
  );
}
