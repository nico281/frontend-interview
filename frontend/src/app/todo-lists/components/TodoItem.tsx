import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, GripVertical, Pencil, X } from 'lucide-react';
import type { TodoItem as TodoItemType } from '../types';

interface TodoItemProps {
  item: TodoItemType;
  onToggle: (id: number) => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({ item, onToggle, onView, onEdit, onDelete }: TodoItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id: item.id,
    animateLayoutChanges: () => false,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : 'transform 50ms ease-out',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 py-3 px-3 -mx-3 rounded-lg border border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-600 ${isDragging ? 'shadow-lg bg-white dark:bg-neutral-700' : ''}`}
    >
      <button
        className="cursor-grab active:cursor-grabbing text-neutral-300 dark:text-neutral-600 hover:text-neutral-500 dark:hover:text-neutral-400"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={18} />
      </button>
      <button
        type="button"
        onClick={() => onToggle(item.id)}
        className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
          item.done
            ? 'bg-neutral-900 dark:bg-neutral-200 border-neutral-900 dark:border-neutral-200 text-white dark:text-neutral-900'
            : 'border-neutral-300 dark:border-neutral-600'
        }`}
      >
        {item.done && <Check size={14} strokeWidth={3} />}
      </button>
      <button
        type="button"
        onClick={() => onView(item.id)}
        className={`flex-1 text-sm cursor-pointer text-left ${item.done ? 'line-through text-neutral-400 dark:text-neutral-500' : 'text-neutral-800 dark:text-neutral-200'}`}
      >
        {item.name}
      </button>
      <div className="opacity-0 group-hover:opacity-100 flex gap-2">
        <button
          type="button"
          onClick={() => onEdit(item.id)}
          className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400"
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white font-semibold"
        >
          <X size={16} />
        </button>
      </div>
    </li>
  );
}
