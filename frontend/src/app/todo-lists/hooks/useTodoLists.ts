import { useQueryClient } from '@tanstack/react-query';
import { reorderItemInList } from '@/shared/utils/arrayUtils';
import { useQueryWithError } from '@/shared/hooks/useQueryWithError';
import { useMutationWithError } from '@/shared/hooks/useMutationWithError';
import * as api from '../services/api';
import type { CreateItemInput, CreateListInput, UpdateItemInput, UpdateListInput } from '../types';
import type { TodoList as TodoListType, TodoItem as TodoItemType } from '../types';

const queryKey = ['todo-lists'];

export function useTodoLists() {
  const queryClient = useQueryClient();

  const lists = useQueryWithError({
    queryKey,
    queryFn: api.getTodoLists,
    errorMessage: 'Failed to load lists',
  });

  const createList = useMutationWithError({
    errorMessage: 'Failed to create list',
    mutationFn: (input: CreateListInput) => api.createTodoList(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: TodoListType[] | undefined) => [
        ...(old || []),
        { id: 'temp', name: input.name, todoItems: [] },
      ]);
      return { prev };
    },
    onError: (_, __, context) => queryClient.setQueryData(queryKey, context?.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateList = useMutationWithError({
    errorMessage: 'Failed to update list',
    mutationFn: ({ id, input }: { id: number; input: UpdateListInput }) => api.updateTodoList(id, input),
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: TodoListType[] | undefined) =>
        old?.map((list: TodoListType) => (list.id === id ? { ...list, ...input } : list)),
      );
      return { prev };
    },
    onError: (_, __, context) => queryClient.setQueryData(queryKey, context?.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteList = useMutationWithError({
    errorMessage: 'Failed to delete list',
    mutationFn: (id: number) => api.deleteTodoList(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: TodoListType[] | undefined) =>
        old?.filter((l: TodoListType) => l.id !== id),
      );
      return { prev };
    },
    onError: (_, __, context) => queryClient.setQueryData(queryKey, context?.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const createItem = useMutationWithError({
    errorMessage: 'Failed to create task',
    mutationFn: ({ listId, input }: { listId: number; input: CreateItemInput }) => api.createTodoItem(listId, input),
    onMutate: async ({ listId, input }) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: TodoListType[] | undefined) =>
        old?.map((list: TodoListType) =>
          list.id === listId
            ? {
                ...list,
                todoItems: [
                  ...list.todoItems,
                  { id: 'temp' as unknown as number, name: input.name, done: false, order: list.todoItems.length },
                ],
              }
            : list,
        ),
      );
      return { prev };
    },
    onError: (_, __, context) => queryClient.setQueryData(queryKey, context?.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateItem = useMutationWithError({
    errorMessage: 'Failed to update task',
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
    onError: (_, __, context) => queryClient.setQueryData(queryKey, context?.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteItem = useMutationWithError({
    errorMessage: 'Failed to delete task',
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
    onError: (_, __, context) => queryClient.setQueryData(queryKey, context?.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const reorderItem = useMutationWithError({
    errorMessage: 'Failed to reorder tasks',
    mutationFn: async ({ listId, itemId, newOrder }: { listId: number; itemId: number; newOrder: number }) => {
      const lists = queryClient.getQueryData<TodoListType[]>(queryKey);
      const reorderedLists = reorderItemInList(lists || [], listId, itemId, newOrder);
      const updatedList = reorderedLists?.find((l) => l.id === listId);
      if (!updatedList) throw new Error('List not found');

      const itemIds = updatedList.todoItems.map((i) => i.id);
      return api.reorderItems(listId, itemIds);
    },
    onMutate: ({ listId, itemId, newOrder }) => {
      queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: TodoListType[] | undefined) =>
        reorderItemInList(old || [], listId, itemId, newOrder),
      );
      return { prev };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onError: (_, __, context) => queryClient.setQueryData(queryKey, context?.prev),
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
