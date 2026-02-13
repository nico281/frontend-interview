import { ConfirmModal } from "@/shared/components/ConfirmModal";
import { scrollToBottom } from "@/shared/hooks/useScrollToBottom";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ClipboardList, Edit, Plus, Trash2 } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import type {
  TodoItem as TodoItemType,
  TodoList as TodoListType,
} from "../types";
import { TodoItem } from "./TodoItem";
import { TodoItemDetailPanel } from "./TodoItemDetailPanel";

interface TodoListProps {
  list: TodoListType;
  onUpdateList: (name: string) => void;
  onDeleteList: () => void;
  onCreateItem: (name: string) => void;
  onToggleItem: (itemId: number) => void;
  onDeleteItem: (itemId: number) => void;
  onReorderItem: (itemId: number, newOrder: number) => void;
  onUpdateItem: (
    itemId: number,
    input: { name?: string; description?: string; done?: boolean },
  ) => void;
  onViewItem?: (itemId: number) => void;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
  style?: React.CSSProperties;
}

export function TodoList({
  list,
  onUpdateList,
  onDeleteList,
  onCreateItem,
  onToggleItem,
  onDeleteItem,
  onReorderItem,
  onUpdateItem,
  className,
  style,
  scrollContainerRef,
}: TodoListProps) {
  const [newItemName, setNewItemName] = useState("");
  const [selectedItem, setSelectedItem] = useState<TodoItemType | null>(null);
  const [panelMode, setPanelMode] = useState<"view" | "edit">("view");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [deleteConfirmItem, setDeleteConfirmItem] =
    useState<TodoItemType | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const newIndex = list.todoItems.findIndex((item) => item.id === over.id);
      onReorderItem(Number(active.id), newIndex);
    }
  };

  // Memoize sortable items to prevent unnecessary re-renders
  const sortableItemIds = list.todoItems.map((i) => i.id);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newItemName.trim()) {
      onCreateItem(newItemName.trim());
      setNewItemName("");
      // Scroll to the newly added item within this list
      setTimeout(() => {
        const listEl = listRef.current;
        if (listEl) {
          const itemsContainer = listEl.querySelector('[data-items-container]');
          if (itemsContainer) {
            itemsContainer.scrollTo({
              top: itemsContainer.scrollHeight,
              behavior: 'smooth',
            });
          }
        }
      }, 100);
    }
  };

  const handleStartEditName = () => {
    setEditedName(list.name);
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (editedName.trim()) {
      onUpdateList(editedName.trim());
    }
    setIsEditingName(false);
  };

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName, nameInputRef]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isEditingName) {
        setIsEditingName(false);
        setEditedName("");
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isEditingName]);

  return (
    <>
      <div
        ref={listRef}
        className={`bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-900 dark:border-neutral-200 overflow-hidden ${className || ''}`}
        style={style}
      >
        <div className="bg-neutral-900 dark:bg-neutral-200 px-5 py-4 flex items-center justify-between">
          {isEditingName ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveName();
              }}
              className="flex-1 flex items-center gap-2"
            >
              <ClipboardList size={18} className="text-white dark:text-neutral-900 flex-shrink-0" />
              <input
                ref={nameInputRef}
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSaveName();
                  }
                }}
                className="flex-1 bg-white/10 dark:bg-neutral-900/10 text-white dark:text-neutral-900 font-semibold text-sm px-2 py-1 rounded border border-white/30 dark:border-neutral-600 focus:outline-none focus:border-white dark:focus:border-neutral-400"
              />
            </form>
          ) : (
            <h2 className="font-semibold text-white dark:text-neutral-900 flex items-center gap-2">
              <ClipboardList size={18} />
              {list.name}
            </h2>
          )}
          <div className="flex gap-2">
            {!isEditingName && (
              <button
                onClick={handleStartEditName}
                className="text-neutral-400 dark:text-neutral-600 hover:text-white dark:hover:text-neutral-900"
              >
                <Edit size={18} />
              </button>
            )}
            <button
              onClick={onDeleteList}
              className="text-neutral-400 dark:text-neutral-600 hover:text-red-400 dark:hover:text-red-500"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="p-5">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <ul className="space-y-2 mb-4" data-items-container>
              <SortableContext
                items={sortableItemIds}
                strategy={verticalListSortingStrategy}
              >
                {list.todoItems.map((item) => (
                  <TodoItem
                    key={item.id}
                    item={item}
                    onToggle={onToggleItem}
                    onView={(id) => {
                      setSelectedItem(
                        list.todoItems.find((i) => i.id === id) || null,
                      );
                      setPanelMode("view");
                    }}
                    onEdit={(id) => {
                      setSelectedItem(
                        list.todoItems.find((i) => i.id === id) || null,
                      );
                      setPanelMode("edit");
                    }}
                    onDelete={(id) => {
                      const item = list.todoItems.find((i) => i.id === id);
                      if (item) {
                        setDeleteConfirmItem(item);
                      }
                    }}
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
              className="w-full pr-12 pl-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-400 focus:border-neutral-900 dark:focus:border-neutral-400 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={!newItemName.trim()}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 flex items-center justify-center hover:bg-neutral-700 dark:hover:bg-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus size={18} />
            </button>
          </form>
        </div>
      </div>

      {selectedItem && (
        <TodoItemDetailPanel
          key={selectedItem.id}
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onUpdate={onUpdateItem}
          mode={panelMode}
        />
      )}

      {deleteConfirmItem && (
        <ConfirmModal
          isOpen
          title="Delete task"
          message={`Are you sure you want to delete "${deleteConfirmItem.name}"?`}
          confirmLabel="Delete"
          onConfirm={() => {
            onDeleteItem(deleteConfirmItem.id);
            setDeleteConfirmItem(null);
          }}
          onCancel={() => setDeleteConfirmItem(null)}
        />
      )}
    </>
  );
}
