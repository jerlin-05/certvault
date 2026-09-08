"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import FormField from "@/components/FormField";
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
        if (data.requiresVerification) {
          router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
          return;
        }
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
    <AuthShell>
      <p className="mb-2 text-xs font-medium tracking-wide text-gold-dark">
        Welcome back
      </p>
      <h1 className="font-display text-[1.85rem] leading-tight text-ink">
        Sign in to your vault
      </h1>
      <p className="mt-2 text-sm text-slate">
        Pick up right where you left off.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <FormField
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
          required
          autoComplete="email"
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
            className="mt-1.5 inline-block text-xs text-gold-dark underline underline-offset-2 hover:text-gold"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <p className="rounded-xl bg-rust-light px-3 py-2 text-sm text-rust">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-ink transition hover:bg-gold-light disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
          {!loading && (
            <ArrowRight
              size={15}
              className="transition group-hover:translate-x-0.5"
            />
          )}
        </button>
      </form>

      <p className="mt-7 text-sm text-slate">
        New here?{" "}
        <Link
          href="/register"
          className="text-gold-dark underline underline-offset-2 hover:text-gold"
        >
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
