export default function ConfirmDialog({ title, body, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-sm rounded-sm border border-ink/10 bg-paper p-6 shadow-card">
        <h3 className="font-display text-lg text-ink">{title}</h3>
        <p className="mt-2 text-sm text-slate">{body}</p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-sm border border-ink/15 py-2.5 text-sm font-medium text-ink transition hover:border-ink/40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-sm bg-rust py-2.5 text-sm font-medium text-paper transition hover:bg-rust/90"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
