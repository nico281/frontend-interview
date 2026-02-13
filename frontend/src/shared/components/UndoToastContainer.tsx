import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Toast {
  id: string;
  message: string;
  onUndo: () => void;
}

export function useUndoToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, onUndo: () => void) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, onUndo }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onRemove: () => void;
  duration?: number;
}

function UndoToast({ message, onUndo, onRemove, duration = 5000 }: UndoToastProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - (100 / (duration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration]);

  useEffect(() => {
    if (progress <= 0) {
      onRemove();
    }
  }, [progress, onRemove]);

  return (
    <div className="animate-fade-in-up">
      <div className="bg-neutral-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 min-w-[300px]">
        <Check size={18} className="text-green-400 flex-shrink-0" />
        <span className="flex-1 text-sm">{message}</span>
        <button
          onClick={() => {
            onUndo();
            onRemove();
          }}
          className="text-white font-medium text-sm hover:underline flex-shrink-0"
        >
          Undo
        </button>
      </div>
      <div className="h-1 bg-neutral-700 rounded-b-lg overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

interface UndoToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function UndoToastContainer({ toasts, onRemove }: UndoToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
      {toasts.map((toast) => (
        <UndoToast
          key={toast.id}
          message={toast.message}
          onUndo={toast.onUndo}
          onRemove={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}
