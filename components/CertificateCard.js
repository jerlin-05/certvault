"use client";

import { getCertificateStatus, formatDate } from "@/lib/status";

const toneStyles = {
  rust: "bg-rust-light text-rust",
  amber: "bg-amber-light text-amber",
  forest: "bg-forest-light text-forest",
};

export default function CertificateCard({ certificate, onEdit, onDelete }) {
  const status = getCertificateStatus(certificate);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-sm border border-ink/10 bg-paper shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative h-40 w-full overflow-hidden border-b border-ink/10 bg-ink-light/[0.03]">
        {certificate.image?.data ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`data:${certificate.image.contentType};base64,${certificate.image.data}`}
            alt={certificate.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="paper-texture flex h-full w-full items-center justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-seal text-sm font-semibold text-ink">
              {certificate.name?.[0]?.toUpperCase() || "C"}
            </span>
          </div>
        )}
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-medium ${toneStyles[status.tone]}`}
        >
          {status.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] uppercase tracking-wide text-slate-light">
          {certificate.category || "General"}
        </p>
        <h3 className="mt-1 font-display text-lg leading-snug text-ink">
          {certificate.name}
        </h3>
        {certificate.issuer && (
          <p className="mt-1 text-sm text-slate">{certificate.issuer}</p>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3 text-xs text-slate">
          <span>Expires {formatDate(certificate.expiryDate)}</span>
          <span>Alert {certificate.alertDaysBefore}d before</span>
        </div>

        <div className="mt-4 flex gap-2 opacity-0 transition group-hover:opacity-100">
          <button
            onClick={() => onEdit(certificate)}
            className="flex-1 rounded-sm border border-ink/15 py-2 text-xs font-medium text-ink transition hover:border-ink/40"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(certificate)}
            className="flex-1 rounded-sm border border-rust/25 py-2 text-xs font-medium text-rust transition hover:bg-rust-light"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
