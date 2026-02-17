import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { reorderItemInList } from '@/shared/utils/arrayUtils';
import * as api from '../services/api';
import type {
  CreateItemInput,
  CreateListInput,
  TodoItem as TodoItemType,
  TodoList as TodoListType,
  UpdateItemInput,
  UpdateListInput,
} from '../types';

const queryKey = ['todo-lists'];

export function useTodoLists() {
  const queryClient = useQueryClient();

  const lists = useQuery({
    queryKey,
    queryFn: api.getTodoLists,
  });

  const createList = useMutation({
    mutationFn: (input: CreateListInput) => api.createTodoList(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData(queryKey);
      const tempId = `temp-${Date.now()}` as unknown as number;
      queryClient.setQueryData(queryKey, (old: TodoListType[] | undefined) => [
        ...(old || []),
        { id: tempId, name: input.name, todoItems: [] },
      ]);
      return { prev, tempId };
    },
    onSuccess: (newList, _variables, context) => {
      // Replace temp with real list in-place to maintain position and avoid re-mount
      queryClient.setQueryData(queryKey, (old: TodoListType[] | undefined) =>
        (old || []).map((list) => (String(list.id) === String(context?.tempId) ? newList : list)),
      );
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.prev);
      toast.error('Failed to create list');
    },
  });

  const updateList = useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateListInput }) => api.updateTodoList(id, input),
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: TodoListType[] | undefined) =>
        old?.map((list: TodoListType) => (list.id === id ? { ...list, ...input } : list)),
      );
      return { prev };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.prev);
      toast.error('Failed to update list');
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteList = useMutation({
    mutationFn: (id: number) => api.deleteTodoList(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: TodoListType[] | undefined) =>
        old?.filter((l: TodoListType) => l.id !== id),
      );
      return { prev };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.prev);
      toast.error('Failed to delete list');
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const createItem = useMutation({
    mutationFn: ({ listId, input }: { listId: number; input: CreateItemInput }) => api.createTodoItem(listId, input),
    onMutate: async ({ listId, input }) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: TodoListType[] | undefined) =>
        old?.map((list) =>
          list.id === listId
            ? {
                ...list,
                todoItems: [
                  ...list.todoItems,
                  {
                    id: 'temp' as unknown as number,
                    name: input.name,
                    done: false,
                    order: list.todoItems.length,
                  },
                ],
              }
            : list,
        ),
      );
      return { prev };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.prev);
      toast.error('Failed to create task');
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateItem = useMutation({
    mutationFn: ({ listId, itemId, input }: { listId: number; itemId: number; input: UpdateItemInput }) =>
      api.updateTodoItem(listId, itemId, input),
    onMutate: async ({ listId, itemId, input }) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: TodoListType[] | undefined) =>
        old?.map((list: TodoListType) =>
          list.id === listId
            ? {
                ...list,
                todoItems: list.todoItems.map((item: TodoItemType) =>
                  item.id === itemId ? { ...item, ...input } : item,
                ),
              }
            : list,
        ),
      );
      return { prev };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.prev);
      toast.error('Failed to update task');
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteItem = useMutation({
    mutationFn: ({ listId, itemId }: { listId: number; itemId: number }) => api.deleteTodoItem(listId, itemId),
    onMutate: async ({ listId, itemId }) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: TodoListType[] | undefined) =>
        old?.map((list: TodoListType) =>
          list.id === listId
            ? {
                ...list,
                todoItems: list.todoItems.filter((i: TodoItemType) => i.id !== itemId),
              }
            : list,
        ),
      );
      return { prev };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.prev);
      toast.error('Failed to delete task');
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const reorderItem = useMutation({
    mutationFn: async ({ listId, itemId, newOrder }: { listId: number; itemId: number; newOrder: number }) => {
      const lists = queryClient.getQueryData<TodoListType[]>(queryKey);
      const reorderedLists = reorderItemInList(lists || [], listId, itemId, newOrder);
      const updatedList = reorderedLists?.find((l) => l.id === listId);
      if (!updatedList) throw new Error('List not found');

      const itemIds = updatedList.todoItems.map((i) => i.id);
      return api.reorderItems(listId, itemIds);
    },
    onMutate: async ({ listId, itemId, newOrder }) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: TodoListType[] | undefined) =>
        reorderItemInList(old || [], listId, itemId, newOrder),
      );
      return { prev };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.prev);
      toast.error('Failed to reorder tasks');
    },
  });

  return {
    lists,
    createList,
    updateList,
    deleteList,
    createItem,
    updateItem,
    deleteItem,
    reorderItem,
  };
}
