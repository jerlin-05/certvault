"use client";

import { useState, useRef } from "react";
import { X, ImagePlus } from "lucide-react";

const CATEGORIES = [
  "General",
  "Education",
  "Professional",
  "Health & Safety",
  "Legal",
  "IT & Security",
  "Insurance",
];

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
    <div className="animate-overlay-in fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4 py-8 backdrop-blur-sm">
      <div className="animate-scale-in max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-sm border border-ink/10 bg-paper shadow-card">
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <h2 className="font-display text-lg text-ink">
            {isEdit ? "Edit certificate" : "Add a certificate"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate transition hover:bg-ink/5 hover:text-ink"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-32 w-full items-center justify-center overflow-hidden rounded-sm border border-dashed border-ink/20 bg-ink-light/[0.03] transition hover:border-gold"
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
            <p className="rounded-sm bg-rust-light px-3 py-2 text-sm text-rust">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-sm border border-ink/15 py-2.5 text-sm font-medium text-ink transition hover:border-ink/40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-sm bg-ink py-2.5 text-sm font-medium text-paper transition hover:bg-ink-light disabled:opacity-60"
            >
              {saving ? "Saving…" : isEdit ? "Save changes" : "Add certificate"}
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid rgba(18, 27, 46, 0.15);
          border-radius: 2px;
          padding: 0.55rem 0.75rem;
          font-size: 0.875rem;
          background: #fbfaf7;
          color: #121b2e;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .input:focus {
          border-color: #b8863b;
        }
      `}</style>
    </div>
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
