"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create your account.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-10 flex items-center gap-2 text-sm text-slate"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-seal text-[10px] font-semibold text-ink">
            CV
          </span>
          CertVault
        </Link>

        <h1 className="font-display text-2xl text-ink">Start your vault</h1>
        <p className="mt-2 text-sm text-slate">
          Takes under a minute. No card required.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Field
            label="Full name"
            type="text"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            required
          />
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            required
          />
          <Field
            label="Password"
            type="password"
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
            required
            hint="At least 8 characters"
          />

          {error && (
            <p className="rounded-sm bg-rust-light px-3 py-2 text-sm text-rust">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-ink px-4 py-3 text-sm font-medium text-paper transition hover:bg-ink-light disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate">
          Already have an account?{" "}
          <Link href="/login" className="text-gold-dark underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

function Field({ label, type, value, onChange, required, hint }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate">
        {label}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border border-ink/15 bg-paper px-3 py-2.5 text-sm text-ink outline-none transition focus:border-gold"
      />
      {hint && <span className="mt-1 block text-xs text-slate-light">{hint}</span>}
    </label>
  );
}
