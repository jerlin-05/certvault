"use client";

import {
  TriangleAlert,
  CircleX,
  ShieldCheck,
  Pencil,
  Trash2,
  Building2,
  Eye,
} from "lucide-react";
import { getCertificateStatus, formatDate } from "@/lib/status";

const toneStyles = {
  rust: "bg-rust-light text-rust",
  amber: "bg-amber-light text-amber",
  forest: "bg-forest-light text-forest",
};

const toneIcon = {
  rust: CircleX,
  amber: TriangleAlert,
  forest: ShieldCheck,
};

export default function CertificateCard({
  certificate,
  onView,
  onEdit,
  onDelete,
  style,
}) {
  const status = getCertificateStatus(certificate);
  const StatusIcon = toneIcon[status.tone];
  const isUrgent = status.tone === "rust";

  return (
    <div
      style={style}
      className="animate-fade-in-up group relative flex flex-col overflow-hidden rounded-sm border border-ink/10 bg-paper shadow-card transition duration-200 hover:-translate-y-1.5 hover:shadow-xl"
    >
      <button
        type="button"
        onClick={() => onView(certificate)}
        className="relative block h-40 w-full overflow-hidden border-b border-ink/10 bg-ink-light/[0.03] text-left"
      >
        {certificate.image?.data ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`data:${certificate.image.contentType};base64,${certificate.image.data}`}
            alt={certificate.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="paper-texture flex h-full w-full items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-seal text-base font-semibold text-ink shadow-[0_2px_6px_rgba(18,27,46,0.25)] transition duration-300 group-hover:scale-105">
              {certificate.name?.[0]?.toUpperCase() || "C"}
            </span>
          </div>
        )}

        {/* Folded-corner seal, evoking an authenticated document */}
        <div className="absolute -left-6 -top-6 h-16 w-16 rotate-45 bg-ink/[0.08]" />

        <span
          className={`absolute right-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium shadow-sm ${toneStyles[status.tone]} ${
            isUrgent ? "animate-pulse-ring" : ""
          }`}
        >
          <StatusIcon size={12} strokeWidth={2.25} />
          {status.label}
        </span>

        <span className="absolute inset-0 flex items-center justify-center bg-ink/0 text-paper opacity-0 transition duration-200 group-hover:bg-ink/30 group-hover:opacity-100">
          <span className="flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1.5 text-xs font-medium backdrop-blur">
            <Eye size={13} />
            View certificate
          </span>
        </span>
      </button>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-medium uppercase tracking-wider text-gold-dark">
          {certificate.category || "General"}
        </p>
        <h3 className="mt-1.5 font-display text-lg leading-snug text-ink">
          {certificate.name}
        </h3>
        {certificate.issuer && (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate">
            <Building2 size={13} className="shrink-0 text-slate-light" />
            {certificate.issuer}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3 text-xs text-slate">
          <span>Expires {formatDate(certificate.expiryDate)}</span>
          <span>Alert {certificate.alertDaysBefore}d before</span>
        </div>

        <div className="mt-4 flex gap-2 opacity-0 transition group-hover:opacity-100">
          <button
            onClick={() => onEdit(certificate)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-sm border border-ink/15 py-2 text-xs font-medium text-ink transition hover:border-ink/40 active:scale-95"
          >
            <Pencil size={13} />
            Edit
          </button>
          <button
            onClick={() => onDelete(certificate)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-sm border border-rust/25 py-2 text-xs font-medium text-rust transition hover:bg-rust-light active:scale-95"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
