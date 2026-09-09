"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import PasswordField from "@/components/PasswordField";
import Portal from "@/components/Portal";

export default function ChangePasswordModal({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not change your password.");
        return;
      }
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Portal>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/50 px-4 py-8 backdrop-blur-sm"
        onClick={onClose}
      >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 6 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="my-auto max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-2xl border border-white/10 bg-ink-soft shadow-card"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <p className="font-display text-lg text-paper">Change password</p>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate transition hover:bg-white/5 hover:text-paper"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        {success ? (
          <div className="px-6 py-8 text-center">
            <p className="rounded-xl bg-forest-light px-3 py-2 text-sm text-forest-dark">
              Your password has been updated.
            </p>
            <button
              onClick={onClose}
              className="mt-5 w-full rounded-xl border border-white/15 py-2.5 text-sm font-medium text-paper transition hover:border-white/40"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
            <PasswordField
              label="Current password"
              value={currentPassword}
              onChange={setCurrentPassword}
              required
              autoComplete="current-password"
            />
            <PasswordField
              label="New password"
              value={newPassword}
              onChange={setNewPassword}
              required
              hint="At least 8 characters"
              autoComplete="new-password"
            />
            <PasswordField
              label="Confirm new password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              required
              autoComplete="new-password"
            />

            {error && (
              <p className="rounded-xl bg-rust-light px-3 py-2 text-sm text-rust">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-white/15 py-2.5 text-sm font-medium text-paper transition hover:border-white/40 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-gold py-2.5 text-sm font-semibold text-paper transition hover:bg-gold-light disabled:opacity-60 active:scale-95"
              >
                {saving ? "Saving…" : "Save password"}
              </button>
            </div>
          </form>
        )}
      </motion.div>
      </motion.div>
    </Portal>
  );
}
