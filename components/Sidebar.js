"use client";

import {
  LayoutGrid,
  Clock,
  CircleX,
  Archive,
} from "lucide-react";

const NAV_ITEMS = [
  { key: "all", label: "Overview", icon: LayoutGrid },
  { key: "amber", label: "Expiring Soon", icon: Clock },
  { key: "rust", label: "Expired", icon: CircleX },
];

export default function Sidebar({ user, statusFilter, onFilter }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col justify-between bg-ink px-4 py-6 lg:flex">
      <div>
        <div className="flex items-center gap-2.5 px-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-seal text-xs font-semibold text-ink">
            CV
          </span>
          <span className="font-display text-lg text-paper">CertVault</span>
        </div>

        <nav className="mt-10 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = statusFilter === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onFilter?.(item.key)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active
                    ? "bg-white/[0.07] text-paper"
                    : "text-paper/55 hover:bg-white/[0.04] hover:text-paper/85"
                  }`}
              >
                <item.icon size={17} strokeWidth={1.9} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-8 border-t border-white/10 pt-4">
          <button
            onClick={() => onFilter?.("archived")}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${statusFilter === "archived"
                ? "bg-white/[0.07] text-paper"
                : "text-paper/40 hover:bg-white/[0.04] hover:text-paper/70"
              }`}
          >
            <Archive size={17} strokeWidth={1.9} />
            Archive
          </button>
        </div>
      </div>
    </aside>
  );
}
