"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import PasswordField from "@/components/PasswordField";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not reset your password.");
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <p className="mb-2 text-xs font-medium tracking-wide text-gold-dark">
        Account recovery
      </p>
      <h1 className="font-display text-[1.85rem] leading-tight text-ink">
        Choose a new password
      </h1>

      {!token || !email ? (
        <p className="mt-6 rounded-sm bg-rust-light px-3 py-2 text-sm text-rust">
          This reset link is missing required information. Request a new one
          from the{" "}
          <Link href="/forgot-password" className="underline">
            forgot password
          </Link>{" "}
          page.
        </p>
      ) : done ? (
        <div className="mt-8 flex items-start gap-3 rounded-sm bg-forest-light px-4 py-4 text-sm text-forest">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <p>Your password has been reset. Redirecting you to sign in…</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <PasswordField
            label="New password"
            value={password}
            onChange={setPassword}
            required
            hint="At least 8 characters"
            autoComplete="new-password"
          />
          <PasswordField
            label="Confirm new password"
            value={confirm}
            onChange={setConfirm}
            required
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
            {loading ? "Resetting…" : "Reset password"}
            {!loading && (
              <ArrowRight
                size={15}
                className="transition group-hover:translate-x-0.5"
              />
            )}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
