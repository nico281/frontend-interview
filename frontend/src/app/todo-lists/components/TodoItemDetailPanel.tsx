import { X } from 'lucide-react';
import type { TodoItem as TodoItemType } from '../types';
import { useState, useEffect } from 'react';

interface TodoItemDetailPanelProps {
  item: TodoItemType | null;
  onClose: () => void;
  onUpdate: (itemId: number, input: { name?: string; description?: string; done?: boolean }) => void;
  mode: 'view' | 'edit';
}

export function TodoItemDetailPanel({ item, onClose, onUpdate, mode }: TodoItemDetailPanelProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description || '');
      setIsClosing(false);
    }
  }, [item]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && item && !isClosing) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [item, isClosing]);

  if (!item) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'edit') {
      onUpdate(item.id, { name, description: description || undefined });
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
        className={`fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col ${
          isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 id="panel-title" className="text-lg font-semibold text-neutral-900">
            {isViewMode ? 'Task Details' : 'Edit Task'}
          </h2>
          <button
            onClick={handleClose}
            className="text-neutral-400 hover:text-neutral-900"
            aria-label="Close panel"
          >
            <X size={20} />
          </button>
        </div>

        {isViewMode ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-2">Name</h3>
              <p className="text-neutral-900">{item.name}</p>
            </div>

            {item.description && (
              <div>
                <h3 className="text-sm font-medium text-neutral-500 mb-2">Description</h3>
                <p className="text-neutral-900 whitespace-pre-wrap">{item.description}</p>
              </div>
            )}

            {!item.description && (
              <p className="text-neutral-400 italic">No description</p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <label htmlFor="task-name" className="block text-sm font-medium text-neutral-700 mb-2">
                Name
              </label>
              <input
                id="task-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900"
              />
            </div>

            <div>
              <label htmlFor="task-description" className="block text-sm font-medium text-neutral-700 mb-2">
                Description
              </label>
              <textarea
                id="task-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                placeholder="Add a description..."
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 resize-none"
              />
            </div>
          </form>
        )}

        {!isViewMode && (
          <div className="flex justify-end gap-3 p-6 border-t border-neutral-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 bg-neutral-900 text-white text-sm rounded-lg hover:bg-neutral-800"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </>
  );
}
