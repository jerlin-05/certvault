"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, ImagePlus } from "lucide-react";
import Portal from "@/components/Portal";

import { CATEGORY_THEME } from "@/lib/category";

const CATEGORIES = Object.keys(CATEGORY_THEME);

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result; // data:<type>;base64,<data>
      const [, data] = result.split(",");
      resolve({ data, contentType: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function isValidDateString(value) {
  // Must be exactly YYYY-MM-DD with a plausible 4-digit year.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  if (year < 1900 || year > 2100) return false;
  const d = new Date(value);
  return (
    d.getUTCFullYear() === year &&
    d.getUTCMonth() + 1 === month &&
    d.getUTCDate() === day
  );
}

const DATE_MIN = "1900-01-01";
const DATE_MAX = "2100-12-31";

export default function CertificateModal({ initial, onClose, onSaved }) {
  const isEdit = Boolean(initial?._id);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: initial?.name || "",
    issuer: initial?.issuer || "",
    category: initial?.category || "General",
    notes: initial?.notes || "",
    issueDate: initial?.issueDate ? initial.issueDate.slice(0, 10) : "",
    expiryDate: initial?.expiryDate ? initial.expiryDate.slice(0, 10) : "",
    alertDaysBefore: initial?.alertDaysBefore ?? 30,
  });
  const [imagePreview, setImagePreview] = useState(
    initial?.image?.data
      ? `data:${initial.image.contentType};base64,${initial.image.data}`
      : null
  );
  const [imagePayload, setImagePayload] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setError("Image must be smaller than 4MB.");
      return;
    }
    const payload = await toBase64(file);
    setImagePayload(payload);
    setImagePreview(`data:${payload.contentType};base64,${payload.data}`);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.expiryDate) {
      setError("Certificate name and expiry date are required.");
      return;
    }
    if (form.issueDate && !isValidDateString(form.issueDate)) {
      setError("Issue date isn't valid — please check the day, month and year.");
      return;
    }
    if (!isValidDateString(form.expiryDate)) {
      setError("Expiry date isn't valid — please check the day, month and year.");
      return;
    }

    setSaving(true);
    try {
      const body = {
        ...form,
        alertDaysBefore: Number(form.alertDaysBefore) || 30,
        ...(imagePayload ? { image: imagePayload } : {}),
      };

      const res = await fetch(
        isEdit ? `/api/certificates/${initial._id}` : "/api/certificates",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not save certificate.");
        return;
      }
      onSaved(data.certificate);
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
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/50 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/10 bg-ink-soft shadow-card"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="font-display text-lg text-paper">
            {isEdit ? "Edit certificate" : "Add a certificate"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate transition hover:bg-white/5 hover:text-paper"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-32 w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/20 bg-white/[0.03] transition hover:border-gold"
          >
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreview}
                alt="Certificate preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex flex-col items-center gap-1.5 text-sm text-slate">
                <ImagePlus size={20} strokeWidth={1.6} />
                Click to upload a photo or scan
              </span>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />

          <Field label="Certificate name" required>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="AWS Solutions Architect"
              className="input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Issuer">
              <input
                type="text"
                value={form.issuer}
                onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                placeholder="Amazon Web Services"
                className="input"
              />
            </Field>
            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Issue date">
              <input
                type="date"
                min={DATE_MIN}
                max={DATE_MAX}
                value={form.issueDate}
                onChange={(e) =>
                  setForm({ ...form, issueDate: e.target.value })
                }
                className="input"
              />
            </Field>
            <Field label="Expiry date" required>
              <input
                type="date"
                required
                min={DATE_MIN}
                max={DATE_MAX}
                value={form.expiryDate}
                onChange={(e) =>
                  setForm({ ...form, expiryDate: e.target.value })
                }
                className="input"
              />
            </Field>
          </div>

          <Field
            label="Alert me this many days before expiry"
            hint="You'll get an email once the certificate enters this window."
          >
            <input
              type="number"
              min={1}
              value={form.alertDaysBefore}
              onChange={(e) =>
                setForm({ ...form, alertDaysBefore: e.target.value })
              }
              className="input"
            />
          </Field>

          <Field label="Notes">
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Optional — reference numbers, renewal links, contacts…"
              className="input resize-none"
            />
          </Field>

          {error && (
            <p className="rounded-xl bg-rust-light px-3 py-2 text-sm text-rust">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/15 py-2.5 text-sm font-medium text-paper transition hover:border-white/40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-gold py-2.5 text-sm font-semibold text-paper transition hover:bg-gold-light disabled:opacity-60"
            >
              {saving ? "Saving…" : isEdit ? "Save changes" : "Add certificate"}
            </button>
          </div>
        </form>
      </motion.div>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 0.7rem 0.85rem;
          font-size: 0.875rem;
          background: #14111f;
          color: #f5f3fa;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .input:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.18);
        }
      `}</style>
    </motion.div>
    </Portal>
  );
}

function Field({ label, required, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate">
        {label} {required && <span className="text-rust">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-light">{hint}</span>}
    </label>
  );
}
