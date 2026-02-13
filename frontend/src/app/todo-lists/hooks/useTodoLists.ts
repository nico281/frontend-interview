import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reorderItemInList } from '@/shared/utils/arrayUtils';
import * as api from '../services/api';
import type { CreateItemInput, CreateListInput, UpdateItemInput, UpdateListInput } from '../types';
import type { TodoList as TodoListType, TodoItem as TodoItemType } from '../types';

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
      queryClient.setQueryData(queryKey, (old: TodoListType[] | undefined) => [
        ...(old || []),
        { id: 'temp', name: input.name, todoItems: [] },
      ]);
      return { prev };
    },
    onError: (_, __, context) => queryClient.setQueryData(queryKey, context?.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
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
    onError: (_, __, context) => queryClient.setQueryData(queryKey, context?.prev),
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
    onError: (_, __, context) => queryClient.setQueryData(queryKey, context?.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const createItem = useMutation({
    mutationFn: ({ listId, input }: { listId: number; input: CreateItemInput }) => api.createTodoItem(listId, input),
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
    onError: (_, __, context) => queryClient.setQueryData(queryKey, context?.prev),
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
    onError: (_, __, context) => queryClient.setQueryData(queryKey, context?.prev),
  });

  const reorderItem = useMutation({
    mutationFn: ({ listId, itemId, newOrder }: { listId: number; itemId: number; newOrder: number }) =>
      api.reorderItem(listId, itemId, newOrder),
    onMutate: ({ listId, itemId, newOrder }) => {
      queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData(queryKey);
      // Update optimistically
      queryClient.setQueryData(queryKey, (old: TodoListType[] | undefined) =>
        reorderItemInList(old, listId, itemId, newOrder),
      );
      return { prev };
    },
    // Don't invalidate - we keep optimistic state
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
