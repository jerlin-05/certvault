import { FolderPlus } from "lucide-react";

export default function EmptyState({ onAddClick }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 bg-paper-card py-24 text-center">
      <span className="animate-float flex h-16 w-16 items-center justify-center rounded-2xl bg-seal text-ink shadow-[0_4px_14px_rgba(201,161,90,0.35)]">
        <FolderPlus size={24} strokeWidth={1.75} />
      </span>
      <h3 className="mt-6 font-display text-xl text-ink">
        No certificates yet
      </h3>
      <p className="mt-2 max-w-xs text-sm text-slate">
        Start building your vault by adding your first certificate.
      </p>
      <button
        onClick={onAddClick}
        className="mt-6 rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-ink shadow-glow transition hover:bg-gold-light active:scale-95"
      >
        Add your first certificate
      </button>
    </div>
  );
}
