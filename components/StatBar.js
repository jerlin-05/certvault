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
    { label: "Total certificates", value: total, tone: "ink" },
    { label: "Expiring soon", value: expiringSoon, tone: "amber" },
    { label: "Expired", value: expired, tone: "rust" },
    { label: "In good standing", value: healthy, tone: "forest" },
  ];

  const toneDot = {
    ink: "bg-ink",
    amber: "bg-amber",
    rust: "bg-rust",
    forest: "bg-forest",
  };

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-paper px-5 py-4">
          <div className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${toneDot[s.tone]}`} />
            <span className="text-xs text-slate">{s.label}</span>
          </div>
          <p className="mt-2 font-display text-2xl text-ink">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
