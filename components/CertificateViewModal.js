"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Pencil,
  Trash2,
  Download,
  Archive,
  ArchiveRestore,
} from "lucide-react";
import { getCertificateStatus, formatDate, daysUntil } from "@/lib/status";
import { getCategoryTheme } from "@/lib/category";
import Portal from "@/components/Portal";

const toneStyles = {
  rust: "bg-rust-light text-rust-dark",
  amber: "bg-amber-light text-amber-dark",
  forest: "bg-forest-light text-forest-dark",
};

const toneDot = {
  rust: "bg-rust",
  amber: "bg-amber",
  forest: "bg-forest",
};

const toneBar = {
  rust: "bg-rust",
  amber: "bg-amber",
  forest: "bg-forest",
};

export default function CertificateViewModal({
  certificate,
  onClose,
  onEdit,
  onDelete,
  onArchive,
}) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const status = getCertificateStatus(certificate);
  const theme = getCategoryTheme(certificate.category);
  const CategoryIcon = theme.icon;
  const imageSrc = certificate.image?.data
    ? `data:${certificate.image.contentType};base64,${certificate.image.data}`
    : null;

  const remaining = daysUntil(certificate.expiryDate);
  let progressPct = 60;
  if (certificate.issueDate) {
    const span = Math.round(
      (new Date(certificate.expiryDate) - new Date(certificate.issueDate)) /
        (1000 * 60 * 60 * 24)
    );
    const elapsed = span - Math.max(remaining, 0);
    progressPct = span > 0 ? Math.min(100, Math.max(0, (elapsed / span) * 100)) : 60;
  }

  const statusHeadline =
    status.tone === "forest"
      ? "In good standing"
      : status.tone === "amber"
      ? "Renewal approaching"
      : "Needs renewal";

  return (
    <Portal>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex justify-end bg-ink/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-ink/10 bg-paper shadow-dark"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <p className="text-sm font-medium text-ink">Certificate details</p>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate transition hover:bg-ink/5 hover:text-ink"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        <div className="flex-1 p-6">
          {/* Hero card / certificate preview */}
          <div className="relative overflow-hidden rounded-2xl border border-ink/10 bg-ink p-6 text-center shadow-card">
            {imageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt={certificate.name}
                className="mx-auto max-h-40 rounded-xl object-contain"
              />
            ) : (
              <>
                <span
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-paper shadow-panel"
                  style={{ backgroundColor: theme.accent }}
                >
                  <CategoryIcon size={24} strokeWidth={1.75} />
                </span>
                <p className="mt-4 font-display text-lg leading-snug text-paper">
                  {certificate.name}
                </p>
                <p className="mt-1 text-xs text-paper/50">
                  {certificate.issuer || "—"}
                </p>
              </>
            )}
            {imageSrc && (
              <a
                href={imageSrc}
                download={`${certificate.name || "certificate"}.png`}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-ink/90 px-3 py-1.5 text-xs font-medium text-paper shadow-panel transition hover:bg-ink"
              >
                <Download size={13} />
                Download
              </a>
            )}
          </div>

          <p className="mt-5 font-display text-xl leading-tight text-ink">
            {certificate.name}
          </p>
          <p className="mt-0.5 text-sm text-slate">
            {certificate.issuer || "No issuer specified"}
          </p>

          <span
            className={`mt-4 flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${toneStyles[status.tone]}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${toneDot[status.tone]}`} />
            {statusHeadline}
          </span>

          {/* Issue / expiry dates */}
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-ink/10 pt-5">
            <div>
              <p className="text-xs text-slate-light">Issue date</p>
              <p className="mt-1 text-sm text-ink">
                {formatDate(certificate.issueDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-light">Expiry date</p>
              <p className="mt-1 text-sm text-ink">
                {formatDate(certificate.expiryDate)}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-5">
            <p className="text-sm text-ink">
              {remaining >= 0
                ? `${remaining} day${remaining === 1 ? "" : "s"} remaining`
                : `Expired ${Math.abs(remaining)} day${Math.abs(remaining) === 1 ? "" : "s"} ago`}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/[0.06]">
              <div
                className={`h-full rounded-full ${toneBar[status.tone]}`}
                style={{ width: `${status.tone === "rust" ? 100 : progressPct}%` }}
              />
            </div>
          </div>

          {/* Category / reminder */}
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-ink/10 pt-5">
            <div>
              <p className="text-xs text-slate-light">Category</p>
              <p className="mt-1 text-sm text-ink">
                {certificate.category || "General"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-light">Reminder</p>
              <p className="mt-1 text-sm text-ink">
                {certificate.alertDaysBefore} days before expiry
              </p>
            </div>
          </div>

          {certificate.notes && (
            <div className="mt-6 border-t border-ink/10 pt-5">
              <p className="text-xs text-slate-light">Notes</p>
              <p className="mt-2 whitespace-pre-wrap rounded-xl bg-ink/[0.035] p-4 text-sm leading-relaxed text-ink">
                {certificate.notes}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 border-t border-ink/10 p-6">
          <button
            onClick={() => onEdit(certificate)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gold py-2.5 text-sm font-semibold text-ink transition hover:bg-gold-light active:scale-95"
          >
            <Pencil size={14} />
            Edit certificate
          </button>
          {onArchive && (
            <button
              onClick={() => onArchive(certificate)}
              aria-label={certificate.archived ? "Restore certificate" : "Archive certificate"}
              className="flex items-center justify-center rounded-xl border border-ink/15 px-3.5 text-ink transition hover:border-ink/40 active:scale-95"
            >
              {certificate.archived ? (
                <ArchiveRestore size={16} />
              ) : (
                <Archive size={16} />
              )}
            </button>
          )}
          <button
            onClick={() => onDelete(certificate)}
            aria-label="Delete certificate"
            className="flex items-center justify-center rounded-xl border border-rust/25 px-3.5 text-rust transition hover:bg-rust-light active:scale-95"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </motion.div>
    </motion.div>
    </Portal>
  );
}
