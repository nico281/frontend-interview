import { useState, useCallback, useRef } from 'react';

interface DelayedDeleteState {
  pendingId: number | null;
  scheduleDelete: (id: number, onDelete: () => void) => void;
  cancelDelete: () => void;
}

export function useDelayedDelete(duration: number = 5000): DelayedDeleteState {
  const [pendingId, setPendingId] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scheduleDelete = useCallback((id: number, onDelete: () => void) => {
    setPendingId(id);
    timeoutRef.current = setTimeout(() => {
      onDelete();
      setPendingId(null);
    }, duration);
  }, [duration]);

  const cancelDelete = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setPendingId(null);
  }, []);

  return { pendingId, scheduleDelete, cancelDelete };
}
