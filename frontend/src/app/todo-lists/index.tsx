import { useState } from "react";
import { TodoList } from "./components/TodoList";
import { useTodoLists } from "./hooks/useTodoLists";

export default function TodoListsApp() {
  const {
    lists,
    createList,
    deleteList,
    updateList,
    createItem,
    updateItem,
    deleteItem,
    reorderItem,
  } = useTodoLists();
  const [newListName, setNewListName] = useState("");

  const handleCreateList = () => {
    if (newListName.trim()) {
      createList.mutate({ name: newListName.trim() });
      setNewListName("");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-neutral-900 py-4 px-6 flex items-center justify-between">
        <h1 className="text-white text-xl font-semibold">To-Do List</h1>
        {/* Theme toggle placeholder */}
      </header>

      <main className="max-w-md mx-auto p-6">
        {lists.isLoading ? (
          <p>Loading...</p>
        ) : lists.error ? (
          <p className="text-red-600">
            Error: {(lists.error as Error).message}
          </p>
        ) : (
          <div className="space-y-4">
            {lists.data?.map((list) => (
              <TodoList
                key={list.id}
                list={list}
                onUpdateList={(name) =>
                  updateList.mutate({ id: list.id, input: { name } })
                }
                onDeleteList={() => deleteList.mutate(list.id)}
                onCreateItem={(name) =>
                  createItem.mutate({ listId: list.id, input: { name } })
                }
                onToggleItem={(itemId) => {
                  const item = list.todoItems.find((i) => i.id === itemId);
                  updateItem.mutate({
                    listId: list.id,
                    itemId,
                    input: { done: !item?.done },
                  });
                }}
                onEditItem={() => {
                  /* TODO: open edit modal */
                }}
                onDeleteItem={(itemId) =>
                  deleteItem.mutate({ listId: list.id, itemId })
                }
                onReorderItem={(itemId, newOrder) =>
                  reorderItem.mutate({ listId: list.id, itemId, newOrder })
                }
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
