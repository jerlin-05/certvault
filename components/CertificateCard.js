"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
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
import { getCategoryTheme } from "@/lib/category";

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
}) {
  const status = getCertificateStatus(certificate);
  const StatusIcon = toneIcon[status.tone];
  const isUrgent = status.tone === "rust";
  const theme = getCategoryTheme(certificate.category);
  const CategoryIcon = theme.icon;

  const cardRef = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [7, -7]), {
    stiffness: 260,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-7, 7]), {
    stiffness: 260,
    damping: 22,
  });
  const glowX = useTransform(rawX, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(rawY, [-0.5, 0.5], ["0%", "100%"]);

  function handleMouseMove(e) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-md border border-ink/10 bg-paper shadow-card"
    >
      {/* Cursor-tracking sheen */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([gx, gy]) =>
              `radial-gradient(320px circle at ${gx} ${gy}, rgba(216,167,94,0.14), transparent 70%)`
          ),
        }}
      />

      {/* Category accent rail */}
      <span
        className="absolute left-0 top-0 z-10 h-full w-[3px]"
        style={{ backgroundColor: theme.accent }}
      />

      <button
        type="button"
        onClick={() => onView(certificate)}
        className="relative block h-40 w-full shrink-0 overflow-hidden border-b border-ink/10 bg-ink-light/[0.03] text-left"
      >
        {certificate.image?.data ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`data:${certificate.image.contentType};base64,${certificate.image.data}`}
            alt={certificate.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
          />
        ) : (
          <div
            className="paper-texture flex h-full w-full items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${theme.accent}14, transparent 60%)`,
            }}
          >
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full text-paper shadow-[0_4px_10px_rgba(18,27,46,0.25)] transition duration-300 group-hover:scale-105"
              style={{ backgroundColor: theme.accent }}
            >
              <CategoryIcon size={22} strokeWidth={1.75} />
            </span>
          </div>
        )}

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
        <div
          className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider"
          style={{ color: theme.accent }}
        >
          <CategoryIcon size={12} />
          {certificate.category || "General"}
        </div>
        <h3 className="mt-1.5 line-clamp-2 min-h-[2.6rem] font-display text-lg leading-snug text-ink">
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

        <div className="mt-auto flex items-center justify-between border-t border-ink/10 pt-3 text-xs text-slate">
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
    </motion.div>
  );
}
