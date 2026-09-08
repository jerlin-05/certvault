"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import FormField from "@/components/FormField";
import PasswordField from "@/components/PasswordField";

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
    <AuthShell>
      <p className="mb-2 text-xs font-medium tracking-wide text-gold-dark">
        Get started
      </p>
      <h1 className="font-display text-[1.85rem] leading-tight text-ink">
        Start your vault
      </h1>
      <p className="mt-2 text-sm text-slate">
        Takes under a minute. No card required.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <FormField
          label="Full name"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
          required
          autoComplete="name"
        />
        <FormField
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
          required
          autoComplete="email"
        />
        <PasswordField
          label="Password"
          value={form.password}
          onChange={(v) => setForm({ ...form, password: v })}
          required
          hint="At least 8 characters"
          autoComplete="new-password"
        />

        {error && (
          <p className="rounded-sm bg-rust-light px-3 py-2 text-sm text-rust">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-center gap-2 rounded-sm bg-ink px-4 py-3 text-sm font-medium text-paper transition hover:bg-ink-light disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
          {!loading && (
            <ArrowRight
              size={15}
              className="transition group-hover:translate-x-0.5"
            />
          )}
        </button>
      </form>

      <p className="mt-7 text-sm text-slate">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-gold-dark underline underline-offset-2 hover:text-gold"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
