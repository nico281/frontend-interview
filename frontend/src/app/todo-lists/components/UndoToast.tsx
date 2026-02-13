import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onTimeout: () => void;
  duration?: number;
}

export function UndoToast({ message, onUndo, onTimeout, duration = 5000 }: UndoToastProps) {
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
      onTimeout();
    }
  }, [progress, onTimeout]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
      <div className="bg-neutral-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 min-w-[300px]">
        <Check size={18} className="text-green-400 flex-shrink-0" />
        <span className="flex-1 text-sm">{message}</span>
        <button
          onClick={onUndo}
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
