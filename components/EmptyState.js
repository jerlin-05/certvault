import { FolderPlus } from "lucide-react";

export default function EmptyState({ onAddClick }) {
  return (
    <div className="paper-texture flex flex-col items-center justify-center rounded-sm border border-dashed border-ink/15 py-24 text-center">
      <span className="animate-float flex h-14 w-14 items-center justify-center rounded-full bg-seal text-ink shadow-[0_2px_6px_rgba(18,27,46,0.25)]">
        <FolderPlus size={22} strokeWidth={1.75} />
      </span>
      <h3 className="mt-5 font-display text-xl text-ink">
        Your vault is empty
      </h3>
      <p className="mt-2 max-w-xs text-sm text-slate">
        Add your first certificate to start tracking its expiry date and
        get an alert before it lapses.
      </p>
      <button
        onClick={onAddClick}
        className="mt-6 rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-ink-light"
      >
        Add certificate
      </button>
    </div>
  );
}
