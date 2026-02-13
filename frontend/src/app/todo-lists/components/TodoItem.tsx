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
      className={`group flex items-center gap-3 py-3 px-3 -mx-3 rounded-lg border border-transparent hover:bg-neutral-50 hover:border-neutral-200 ${isDragging ? 'shadow-lg bg-white' : ''}`}
    >
      <button
        className="cursor-grab active:cursor-grabbing text-neutral-300 hover:text-neutral-500"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={18} />
      </button>
      <button
        onClick={() => onToggle(item.id)}
        className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
          item.done ? 'bg-neutral-900 border-neutral-900 text-white' : 'border-neutral-300'
        }`}
      >
        {item.done && <Check size={14} strokeWidth={3} />}
      </button>
      <span
        onClick={() => onView(item.id)}
        className={`flex-1 text-sm cursor-pointer ${item.done ? 'line-through text-neutral-400' : 'text-neutral-800'}`}
      >
        {item.name}
      </span>
      <div className="opacity-0 group-hover:opacity-100 flex gap-2">
        <button onClick={() => onEdit(item.id)} className="text-neutral-400 hover:text-neutral-600">
          <Pencil size={16} />
        </button>
        <button onClick={() => onDelete(item.id)} className="text-neutral-400 hover:text-neutral-900 font-semibold">
          <X size={16} />
        </button>
      </div>
    </li>
  );
}
