import { Plus } from 'lucide-react';
import { useRef, useState } from 'react';
import { ConfirmModal } from '@/shared/components/ConfirmModal';
import { scrollToBottom } from '@/shared/hooks/useScrollToBottom';
import { TodoList } from './components/TodoList';
import { useTodoLists } from './hooks/useTodoLists';

export default function TodoListsApp() {
  const { lists, createList, deleteList, updateList, createItem, updateItem, deleteItem, reorderItem } = useTodoLists();
  const [newListName, setNewListName] = useState('');
  const [deleteConfirmList, setDeleteConfirmList] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleCreateList = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newListName.trim()) {
      createList.mutate({ name: newListName.trim() });
      setNewListName('');
      scrollToBottom(scrollContainerRef);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <header className="bg-neutral-900 py-4 px-6 flex items-center justify-between flex-shrink-0">
        <h1 className="text-white text-xl font-semibold">To-Do List</h1>
        {/* Theme toggle placeholder */}
      </header>

      <div className="flex-shrink-0 bg-white border-b border-neutral-200">
        <main className="max-w-md mx-auto px-6 py-4">
          <form onSubmit={handleCreateList} className="relative">
            <input
              type="text"
              placeholder="New list name..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="w-full pr-12 pl-4 py-2 border border-neutral-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900"
            />
            <button
              type="submit"
              disabled={!newListName.trim()}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-neutral-800 text-white flex items-center justify-center hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus size={18} />
            </button>
          </form>
        </main>
      </div>

      <main ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-6 py-4">
          {lists.isLoading ? (
            <p>Loading...</p>
          ) : lists.error ? (
            <p className="text-red-600">Error: {(lists.error as Error).message}</p>
          ) : (
            <div className="space-y-4">
              {lists.data?.map((list) => (
                <TodoList
                  key={list.id}
                  list={list}
                  scrollContainerRef={scrollContainerRef}
                  onUpdateList={(name) => updateList.mutate({ id: list.id, input: { name } })}
                  onDeleteList={() => setDeleteConfirmList(list.id)}
                  onCreateItem={(name) => createItem.mutate({ listId: list.id, input: { name } })}
                  onToggleItem={(itemId) => {
                    const item = list.todoItems.find((i) => i.id === itemId);
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
              ))}
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
