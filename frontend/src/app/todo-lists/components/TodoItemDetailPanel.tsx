import { X } from 'lucide-react';
import { type FormEvent, useEffect, useState } from 'react';
import type { TodoItem as TodoItemType } from '../types';

interface TodoItemDetailPanelProps {
  item: TodoItemType | null;
  onClose: () => void;
  onUpdate: (itemId: number, input: { name?: string; description?: string; done?: boolean }) => void;
  mode: 'view' | 'edit';
}

export function TodoItemDetailPanel({ item, onClose, onUpdate, mode }: TodoItemDetailPanelProps) {
  const [name, setName] = useState(item?.name || '');
  const [description, setDescription] = useState(item?.description || '');
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && item && !isClosing) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, isClosing]);

  if (!item) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === 'edit') {
      onUpdate(item.id, { name, description: description.trim() || undefined });
      handleClose();
    }
  };

  const isViewMode = mode === 'view';

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-50 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
        onClick={handleClose}
      />
      <div
        className={`fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-neutral-800 shadow-xl z-50 flex flex-col ${
          isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <h2 id="panel-title" className="text-lg font-semibold text-neutral-900 dark:text-white">
            {isViewMode ? 'Task Details' : 'Edit Task'}
          </h2>
          <button onClick={handleClose} className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white" aria-label="Close panel">
            <X size={20} />
          </button>
        </div>

        {isViewMode ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">Name</h3>
              <p className="text-neutral-900 dark:text-white">{item.name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">Description</h3>
              {item.description ? (
                <p className="text-neutral-900 dark:text-white whitespace-pre-wrap">{item.description}</p>
              ) : (
                <p className="text-neutral-400 dark:text-neutral-500 italic">No description</p>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <label htmlFor="task-name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Name
              </label>
              <input
                id="task-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-400 focus:border-neutral-900 dark:focus:border-neutral-400 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="task-description" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Description
              </label>
              <textarea
                id="task-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                placeholder="Add a description..."
                className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-400 focus:border-neutral-900 dark:focus:border-neutral-400 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white resize-none"
              />
            </div>
          </form>
        )}

        {!isViewMode && (
          <div className="flex justify-end gap-3 p-6 border-t border-neutral-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const syntheticEvent = new Event('submit', { bubbles: true, cancelable: true }) as unknown as FormEvent<HTMLFormElement>;
                Object.defineProperty(syntheticEvent, 'target', { value: e.currentTarget.closest('form') });
                Object.defineProperty(syntheticEvent, 'preventDefault', { value: () => {} });
                onUpdate(item.id, { name, description: description || undefined });
                handleClose();
              }}
              className="px-4 py-2 bg-neutral-900 dark:bg-neutral-200 text-white dark:text-neutral-900 text-sm rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-300"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </>
  );
}
