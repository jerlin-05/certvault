"use client";

import { motion } from "framer-motion";
import { Pencil, Trash2, Building2, Archive, ArchiveRestore } from "lucide-react";
import { getCertificateStatus, formatDate, daysUntil } from "@/lib/status";
import { getCategoryTheme } from "@/lib/category";

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

export default function CertificateCard({
  certificate,
  onView,
  onEdit,
  onDelete,
  onArchive,
}) {
  const status = getCertificateStatus(certificate);
  const theme = getCategoryTheme(certificate.category);
  const CategoryIcon = theme.icon;

  // Progress bar: share of certificate's lifetime already elapsed, clamped 0-100
  let progressPct = 60;
  if (certificate.issueDate) {
    const span = Math.round(
      (new Date(certificate.expiryDate) - new Date(certificate.issueDate)) /
        (1000 * 60 * 60 * 24)
    );
    const elapsed = span - Math.max(daysUntil(certificate.expiryDate), 0);
    progressPct = span > 0 ? Math.min(100, Math.max(0, (elapsed / span) * 100)) : 60;
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-paper-card shadow-card"
    >
      <button
        type="button"
        onClick={() => onView(certificate)}
        className="flex flex-1 flex-col p-5 text-left"
      >
        <div className="flex items-start justify-between">
          {certificate.image?.data ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`data:${certificate.image.contentType};base64,${certificate.image.data}`}
              alt={certificate.name}
              className="h-11 w-11 shrink-0 rounded-xl object-cover"
            />
          ) : (
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-paper"
              style={{ backgroundColor: theme.accent }}
            >
              <CategoryIcon size={19} strokeWidth={1.75} />
            </span>
          )}
          <span
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${toneStyles[status.tone]}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${toneDot[status.tone]}`} />
            {status.tone === "forest"
              ? "Active"
              : status.tone === "amber"
              ? "Expiring"
              : "Expired"}
          </span>
        </div>

        <h3 className="mt-4 line-clamp-2 min-h-[2.6rem] font-display text-lg leading-snug text-ink">
          {certificate.name}
        </h3>
        <p className="mt-1 flex min-h-[1.25rem] items-center gap-1.5 text-sm text-slate">
          {certificate.issuer && (
            <>
              <Building2 size={13} className="shrink-0 text-slate-light" />
              <span className="line-clamp-1">{certificate.issuer}</span>
            </>
          )}
        </p>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-light">{formatDate(certificate.expiryDate)}</span>
            <span
              className={`font-medium ${
                status.tone === "rust"
                  ? "text-rust"
                  : status.tone === "amber"
                  ? "text-amber-dark"
                  : "text-forest-dark"
              }`}
            >
              {status.label}
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/[0.06]">
            <div
              className={`h-full rounded-full ${toneBar[status.tone]}`}
              style={{ width: `${status.tone === "rust" ? 100 : progressPct}%` }}
            />
          </div>
        </div>
      </button>

      <div className="flex gap-2 border-t border-ink/10 px-5 py-3 opacity-0 transition group-hover:opacity-100">
        <button
          onClick={() => onEdit(certificate)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-ink/15 py-2 text-xs font-medium text-ink transition hover:border-ink/40 active:scale-95"
        >
          <Pencil size={13} />
          Edit
        </button>
        {onArchive && (
          <button
            onClick={() => onArchive(certificate)}
            aria-label={certificate.archived ? "Restore certificate" : "Archive certificate"}
            className="flex items-center justify-center rounded-xl border border-ink/15 px-3 text-ink transition hover:border-ink/40 active:scale-95"
          >
            {certificate.archived ? (
              <ArchiveRestore size={14} />
            ) : (
              <Archive size={14} />
            )}
          </button>
        )}
        <button
          onClick={() => onDelete(certificate)}
          className="flex items-center justify-center rounded-xl border border-rust/25 px-3 text-rust transition hover:bg-rust-light active:scale-95"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
}
