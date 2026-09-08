import { FolderOpen, TriangleAlert, CircleX, ShieldCheck } from "lucide-react";
import { getCertificateStatus } from "@/lib/status";

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

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex items-start justify-between gap-3 bg-paper px-5 py-4"
        >
          <div>
            <span className="text-xs text-slate">{s.label}</span>
            <p className="mt-1.5 font-display text-2xl text-ink">{s.value}</p>
          </div>
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${toneStyles[s.tone]}`}
          >
            <s.icon size={16} strokeWidth={1.9} />
          </span>
        </div>
      ))}
    </div>
  );
}
