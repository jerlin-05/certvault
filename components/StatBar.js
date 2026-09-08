"use client";

import { motion } from "framer-motion";
import { FolderOpen, TriangleAlert, CircleX, ShieldCheck } from "lucide-react";
import { getCertificateStatus } from "@/lib/status";
import AnimatedCounter from "@/components/AnimatedCounter";

export default function StatBar({ certificates }) {
  const total = certificates.length;
  const expired = certificates.filter(
    (c) => getCertificateStatus(c).tone === "rust"
  ).length;
  const expiringSoon = certificates.filter(
    (c) => getCertificateStatus(c).tone === "amber"
  ).length;
  const healthy = total - expired - expiringSoon;

  const stats = [
    { label: "Total certificates", value: total, tone: "ink", icon: FolderOpen },
    { label: "Expiring soon", value: expiringSoon, tone: "amber", icon: TriangleAlert },
    { label: "Expired", value: expired, tone: "rust", icon: CircleX },
    { label: "In good standing", value: healthy, tone: "forest", icon: ShieldCheck },
  ];

  const toneStyles = {
    ink: "bg-ink/[0.06] text-ink",
    amber: "bg-amber-light text-amber",
    rust: "bg-rust-light text-rust",
    forest: "bg-forest-light text-forest",
  };

  const toneBar = {
    ink: "#121B2E",
    amber: "#C97A2B",
    rust: "#A1352B",
    forest: "#2F6844",
  };

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-ink/10 bg-ink/10 shadow-card sm:grid-cols-4">
      {stats.map((s) => (
        <motion.div
          key={s.label}
          whileHover={{ backgroundColor: "rgba(18,27,46,0.02)" }}
          className="relative flex items-start justify-between gap-3 overflow-hidden bg-paper px-5 py-4"
        >
          <span
            className="absolute inset-x-0 top-0 h-[3px]"
            style={{ backgroundColor: toneBar[s.tone] }}
          />
          <div>
            <span className="text-xs text-slate">{s.label}</span>
            <p className="mt-1.5 font-display text-2xl text-ink">
              <AnimatedCounter value={s.value} />
            </p>
          </div>
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${toneStyles[s.tone]}`}
          >
            <s.icon size={16} strokeWidth={1.9} />
          </span>
        </motion.div>
      ))}
    </div>
  );
}
