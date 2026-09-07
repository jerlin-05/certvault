"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PasswordField from "@/components/PasswordField";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not sign in.");
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

        <h1 className="font-display text-2xl text-ink">Welcome back</h1>
        <p className="mt-2 text-sm text-slate">
          Sign in to see what's coming due.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            required
          />
          <div>
            <PasswordField
              label="Password"
              value={form.password}
              onChange={(v) => setForm({ ...form, password: v })}
              required
              autoComplete="current-password"
            />
            <Link
              href="/forgot-password"
              className="mt-1.5 inline-block text-xs text-gold-dark underline"
            >
              Forgot password?
            </Link>
          </div>

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
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate">
          New here?{" "}
          <Link href="/register" className="text-gold-dark underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}

function Field({ label, type, value, onChange, required }) {
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
    </label>
  );
}
