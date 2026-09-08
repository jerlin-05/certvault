"use client";

import { useEffect } from "react";
import {
  X,
  Pencil,
  Trash2,
  Building2,
  CalendarClock,
  CalendarCheck,
  BellRing,
  Download,
  TriangleAlert,
  CircleX,
  ShieldCheck,
  StickyNote,
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

export default function CertificateViewModal({
  certificate,
  onClose,
  onEdit,
  onDelete,
}) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const status = getCertificateStatus(certificate);
  const StatusIcon = toneIcon[status.tone];
  const imageSrc = certificate.image?.data
    ? `data:${certificate.image.contentType};base64,${certificate.image.data}`
    : null;

  return (
    <div
      className="animate-overlay-in fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-scale-in grid max-h-[88vh] w-full max-w-3xl grid-cols-1 overflow-hidden rounded-sm border border-ink/10 bg-paper shadow-card md:grid-cols-[1.1fr_1fr]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="paper-texture relative flex items-center justify-center bg-ink-light/[0.04] p-6 md:max-h-[88vh]">
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={certificate.name}
              className="max-h-[70vh] w-full rounded-sm object-contain shadow-panel md:max-h-[88vh]"
            />
          ) : (
            <span className="flex h-24 w-24 items-center justify-center rounded-full bg-seal text-2xl font-semibold text-ink shadow-[0_2px_8px_rgba(18,27,46,0.3)]">
              {certificate.name?.[0]?.toUpperCase() || "C"}
            </span>
          )}

          {imageSrc && (
            <a
              href={imageSrc}
              download={`${certificate.name || "certificate"}.png`}
              className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-ink/90 px-3 py-1.5 text-xs font-medium text-paper shadow-panel transition hover:bg-ink"
            >
              <Download size={13} />
              Download
            </a>
          )}
        </div>

        <div className="flex flex-col overflow-y-auto p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-gold-dark">
                {certificate.category || "General"}
              </p>
              <h2 className="mt-1 font-display text-2xl leading-tight text-ink">
                {certificate.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate transition hover:bg-ink/5 hover:text-ink"
              aria-label="Close"
            >
              <X size={17} />
            </button>
          </div>

          <span
            className={`mt-4 flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${toneStyles[status.tone]}`}
          >
            <StatusIcon size={13} strokeWidth={2.25} />
            {status.label}
          </span>

          <div className="mt-6 space-y-4 text-sm">
            {certificate.issuer && (
              <DetailRow icon={Building2} label="Issuer">
                {certificate.issuer}
              </DetailRow>
            )}
            {certificate.issueDate && (
              <DetailRow icon={CalendarCheck} label="Issued">
                {formatDate(certificate.issueDate)}
              </DetailRow>
            )}
            <DetailRow icon={CalendarClock} label="Expires">
              {formatDate(certificate.expiryDate)}
            </DetailRow>
            <DetailRow icon={BellRing} label="Alert window">
              {certificate.alertDaysBefore} day
              {certificate.alertDaysBefore === 1 ? "" : "s"} before expiry
            </DetailRow>
            {certificate.notes && (
              <DetailRow icon={StickyNote} label="Notes">
                <span className="whitespace-pre-wrap">
                  {certificate.notes}
                </span>
              </DetailRow>
            )}
          </div>

          <div className="mt-auto flex gap-3 pt-8">
            <button
              onClick={() => onEdit(certificate)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-sm border border-ink/15 py-2.5 text-sm font-medium text-ink transition hover:border-ink/40"
            >
              <Pencil size={14} />
              Edit
            </button>
            <button
              onClick={() => onDelete(certificate)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-sm border border-rust/25 py-2.5 text-sm font-medium text-rust transition hover:bg-rust-light"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/[0.05] text-slate">
        <Icon size={14} strokeWidth={1.9} />
      </span>
      <div>
        <p className="text-xs text-slate-light">{label}</p>
        <p className="mt-0.5 text-ink">{children}</p>
      </div>
    </div>
  );
}
