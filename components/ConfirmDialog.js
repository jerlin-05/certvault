"use client";

import { motion } from "framer-motion";
import { TriangleAlert } from "lucide-react";

export default function ConfirmDialog({ title, body, onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 6 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-ink/10 bg-paper-card p-6 shadow-card"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rust-light text-rust-dark">
          <TriangleAlert size={19} strokeWidth={1.9} />
        </span>
        <h3 className="mt-4 font-display text-lg text-ink">{title}</h3>
        <p className="mt-2 text-sm text-slate">{body}</p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-ink/15 py-2.5 text-sm font-medium text-ink transition hover:border-ink/40 active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-rust py-2.5 text-sm font-medium text-paper transition hover:bg-rust-dark active:scale-95"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
