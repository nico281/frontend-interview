import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ClipboardList, Edit, Trash2, Plus } from 'lucide-react';
import type { TodoList as TodoListType } from '../types';
import { TodoItem } from './TodoItem';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';

interface TodoListProps {
  list: TodoListType;
  onUpdateList: (name: string) => void;
  onDeleteList: () => void;
  onCreateItem: (name: string) => void;
  onToggleItem: (itemId: number) => void;
  onEditItem: (itemId: number) => void;
  onDeleteItem: (itemId: number) => void;
  onReorderItem: (itemId: number, newOrder: number) => void;
}

export function TodoList({
  list,
  onUpdateList,
  onDeleteList,
  onCreateItem,
  onToggleItem,
  onEditItem,
  onDeleteItem,
  onReorderItem
}: TodoListProps) {
  const [newItemName, setNewItemName] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const newIndex = list.todoItems.findIndex((item) => item.id === over.id);
      onReorderItem(Number(active.id), newIndex);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      onCreateItem(newItemName.trim());
      setNewItemName('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-900 overflow-hidden">
      <div className="bg-neutral-900 px-5 py-4 flex items-center justify-between">
        <h2 className="font-semibold text-white flex items-center gap-2">
          <ClipboardList size={18} />
          {list.name}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => onUpdateList(list.name)}
            className="text-neutral-400 hover:text-white"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={onDeleteList}
            className="text-neutral-400 hover:text-red-400"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="p-5">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <ul className="space-y-2 mb-4">
            <SortableContext items={list.todoItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              {list.todoItems.map((item) => (
                <TodoItem
                  key={item.id}
                  item={item}
                  onToggle={onToggleItem}
                  onEdit={onEditItem}
                  onDelete={onDeleteItem}
                />
              ))}
            </SortableContext>
          </ul>
        </DndContext>

        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            placeholder="Add a new task"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="w-full pr-12 pl-4 py-2 border border-neutral-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900"
          />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-neutral-800 text-white flex items-center justify-center hover:bg-neutral-700"
          >
            <Plus size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
