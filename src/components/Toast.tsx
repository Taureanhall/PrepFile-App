export interface Toast {
  id: string;
  message: string;
  type: "error" | "info";
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg text-sm max-w-sm w-full ${
            t.type === "error"
              ? "bg-red-50 border border-red-200 text-red-800"
              : "bg-white border border-zinc-200 text-zinc-800"
          }`}
        >
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => onDismiss(t.id)}
            className={`shrink-0 leading-none ${
              t.type === "error" ? "text-red-400 hover:text-red-600" : "text-zinc-400 hover:text-zinc-600"
            }`}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
