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
    ink: "bg-white/[0.06] text-paper",
    amber: "bg-amber-light text-amber-dark",
    rust: "bg-rust-light text-rust-dark",
    forest: "bg-forest-light text-forest-dark",
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.05 }}
          whileHover={{ y: -3 }}
          className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-paper-card px-5 py-4 shadow-card"
        >
          <div>
            <span className="text-xs text-slate">{s.label}</span>
            <p className="mt-1.5 font-display text-2xl text-paper">
              <AnimatedCounter value={s.value} />
            </p>
          </div>
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneStyles[s.tone]}`}
          >
            <s.icon size={17} strokeWidth={1.9} />
          </span>
        </motion.div>
      ))}
    </div>
  );
}
