import { type FormEvent, useEffect, useState } from 'react';
import { X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleCancel = () => {
    setIsClosing(true);
    setTimeout(onCancel, 150);
  };

  const handleConfirm = (e: FormEvent) => {
    e.preventDefault();
    setIsClosing(true);
    setTimeout(onConfirm, 150);
  };

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`absolute inset-0 bg-black/50 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
        onClick={handleCancel}
      />
      <div className={`relative bg-white dark:bg-neutral-800 rounded-xl shadow-lg max-w-md w-full mx-4 p-6 ${
        isClosing ? 'animate-modal-out' : 'animate-modal-in'
      }`}>
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300"
        >
          <X size={20} />
        </button>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">{title}</h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">{message}</p>
        <form onSubmit={handleConfirm} className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium bg-neutral-900 dark:bg-neutral-200 text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-300"
          >
            {confirmLabel}
          </button>
        </form>
      </div>
    </div>
  );
}
