"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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

        <h1 className="font-display text-2xl text-ink">Choose a new password</h1>

        {!token || !email ? (
          <p className="mt-6 rounded-sm bg-rust-light px-3 py-2 text-sm text-rust">
            This reset link is missing required information. Request a new
            one from the{" "}
            <Link href="/forgot-password" className="underline">
              forgot password
            </Link>{" "}
            page.
          </p>
        ) : done ? (
          <p className="mt-8 rounded-sm bg-forest-light px-4 py-3 text-sm text-forest">
            Your password has been reset. Redirecting you to sign in…
          </p>
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
              className="w-full rounded-sm bg-ink px-4 py-3 text-sm font-medium text-paper transition hover:bg-ink-light disabled:opacity-60"
            >
              {loading ? "Resetting…" : "Reset password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
