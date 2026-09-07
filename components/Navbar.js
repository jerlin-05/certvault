"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar({ user, onAddClick }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-ink/10 bg-ink">
      <div className="container-page flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-seal text-[11px] font-semibold text-ink">
            CV
          </span>
          <span className="font-display text-lg text-paper">CertVault</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAddClick}
            className="rounded-sm bg-gold px-4 py-2 text-sm font-medium text-ink transition hover:bg-gold-light"
          >
            Add certificate
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-soft text-xs font-medium text-paper transition hover:bg-ink-light"
            >
              {user?.name?.[0]?.toUpperCase() || "U"}
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-11 w-48 rounded-sm border border-ink/10 bg-paper py-1 shadow-panel">
                <div className="border-b border-ink/10 px-4 py-2.5">
                  <p className="truncate text-sm text-ink">{user?.name}</p>
                  <p className="truncate text-xs text-slate-light">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2.5 text-left text-sm text-rust transition hover:bg-rust-light"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
