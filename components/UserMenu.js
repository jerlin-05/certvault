"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, LogOut } from "lucide-react";
import ChangePasswordModal from "@/components/ChangePasswordModal";

export default function UserMenu({ user }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/[0.06] text-xs font-medium text-ink transition hover:bg-ink/[0.1]"
      >
        {user?.name?.[0]?.toUpperCase() || "U"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 z-30 w-64 overflow-hidden rounded-2xl border border-ink/10 bg-paper-card shadow-card"
          >
            <div className="border-b border-ink/10 px-4 py-3.5">
              <p className="truncate text-sm font-medium text-ink">
                {user?.name}
              </p>
              <p className="truncate text-xs text-slate">{user?.email}</p>
            </div>
            <div className="p-1.5">
              <button
                onClick={() => {
                  setOpen(false);
                  setShowChangePassword(true);
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left text-sm text-ink transition hover:bg-ink/[0.05]"
              >
                <KeyRound size={15} strokeWidth={1.9} />
                Change password
              </button>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left text-sm text-rust transition hover:bg-rust-light"
              >
                <LogOut size={15} strokeWidth={1.9} />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showChangePassword && (
          <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
