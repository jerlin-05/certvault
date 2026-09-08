"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Plus, LogOut, ChevronDown } from "lucide-react";

export default function Navbar({ user, onAddClick }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const { scrollY } = useScroll();
  const paddingY = useTransform(scrollY, [0, 80], [16, 10]);
  const shadowOpacity = useTransform(scrollY, [0, 80], [0, 0.25]);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <motion.header
      style={{
        boxShadow: useTransform(
          shadowOpacity,
          (v) => `0 8px 24px -12px rgba(18,27,46,${v})`
        ),
      }}
      className="sticky top-0 z-40 border-b border-ink/10 bg-ink/95 backdrop-blur"
    >
      <motion.div
        style={{ paddingTop: paddingY, paddingBottom: paddingY }}
        className="container-page flex items-center justify-between transition-[padding]"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-seal text-[11px] font-semibold text-ink">
            CV
          </span>
          <span className="font-display text-lg text-paper">CertVault</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAddClick}
            className="flex items-center gap-1.5 rounded-sm bg-gold px-4 py-2 text-sm font-medium text-ink transition hover:bg-gold-light active:scale-95"
          >
            <Plus size={15} strokeWidth={2.25} />
            Add certificate
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition hover:bg-ink-soft"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-soft text-xs font-medium text-paper">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </span>
              <motion.span
                animate={{ rotate: menuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-paper/50"
              >
                <ChevronDown size={14} />
              </motion.span>
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-52 overflow-hidden rounded-sm border border-ink/10 bg-paper shadow-panel"
                >
                  <div className="border-b border-ink/10 px-4 py-3">
                    <p className="truncate text-sm text-ink">{user?.name}</p>
                    <p className="truncate text-xs text-slate-light">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-rust transition hover:bg-rust-light"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}
