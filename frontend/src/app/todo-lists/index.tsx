import { Plus } from 'lucide-react';
import { type FormEvent, useRef, useState } from 'react';
import { ConfirmModal } from '@/shared/components/ConfirmModal';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { TodoList } from './components/TodoList';
import { useTodoLists } from './hooks/useTodoLists';

export default function TodoListsApp() {
  const { lists, createList, deleteList, updateList, createItem, updateItem, deleteItem, reorderItem } = useTodoLists();
  const [newListName, setNewListName] = useState('');
  const [deleteConfirmList, setDeleteConfirmList] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const handleCreateList = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newListName.trim()) {
      createList.mutate({ name: newListName.trim() });
      setNewListName('');
      // Always scroll to bottom when creating a new list
      setTimeout(() => {
        const container = scrollContainerRef.current;
        if (container) {
          container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        }
      }, 150);
    }
  };

  return (
    <div className="h-screen bg-white dark:bg-neutral-900 flex flex-col overflow-hidden">
      <header className="bg-neutral-900 dark:bg-neutral-100 py-4 px-6 flex items-center justify-between flex-shrink-0">
        <h1 className="text-white dark:text-neutral-900 text-xl font-semibold">To-Do List</h1>
        <ThemeToggle />
      </header>

      <div className="flex-shrink-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
        <main className="max-w-md mx-auto px-6 py-4">
          <form onSubmit={handleCreateList} className="relative">
            <input
              type="text"
              placeholder="New list name..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="w-full pr-12 pl-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-400 focus:border-neutral-900 dark:focus:border-neutral-400 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={!newListName.trim()}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 flex items-center justify-center hover:bg-neutral-700 dark:hover:bg-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus size={18} />
            </button>
          </form>
        </main>
      </div>

      <main ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-6 py-4">
          {lists.isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-neutral-900 dark:border-neutral-100 border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-neutral-600 dark:text-neutral-400 text-sm">Loading...</p>
            </div>
          ) : lists.error ? (
            <p className="text-red-600">Error: {(lists.error as Error).message}</p>
          ) : (
            <div className="space-y-4">
              {lists.data?.map((list, index) => {
                const isLast = index === (lists.data?.length ?? 0) - 1;
                return (
                <TodoList
                  key={list.id}
                  list={list}
                  scrollContainerRef={isLast ? scrollContainerRef : undefined}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="animate-fade-in-up opacity-0"
                  onUpdateList={(name) => updateList.mutate({ id: list.id, input: { name } })}
                  onDeleteList={() => setDeleteConfirmList(list.id)}
                  onCreateItem={(name) => createItem.mutate({ listId: list.id, input: { name } })}
                  onToggleItem={(itemId) => {
                    const item = lists.data?.find((l) => l.id === list.id)?.todoItems.find((i) => i.id === itemId);
                    updateItem.mutate({
                      listId: list.id,
                      itemId,
                      input: { done: !item?.done },
                    });
                  }}
                  onDeleteItem={(itemId) => {
                    deleteItem.mutate({ listId: list.id, itemId });
                  }}
                  onReorderItem={(itemId, newOrder) => reorderItem.mutate({ listId: list.id, itemId, newOrder })}
                  onUpdateItem={(itemId, input) => updateItem.mutate({ listId: list.id, itemId, input })}
                />
              );
              })}
            </div>
          )}
        </div>
      </main>

      {deleteConfirmList !== null && (
        <ConfirmModal
          isOpen
          title="Delete list"
          message="Are you sure you want to delete this list and all its tasks?"
          confirmLabel="Delete"
          onConfirm={() => {
            deleteList.mutate(deleteConfirmList);
            setDeleteConfirmList(null);
          }}
          onCancel={() => setDeleteConfirmList(null)}
        />
      )}
    </div>
  );
}
