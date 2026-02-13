import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../services/api';
import type { CreateListInput, UpdateListInput, CreateItemInput, UpdateItemInput } from '../types';
import { arrayMove } from '@dnd-kit/sortable';

const queryKey = ['todo-lists'];

export function useTodoLists() {
  const queryClient = useQueryClient();

  const lists = useQuery({
    queryKey,
    queryFn: api.getTodoLists
  });

  const createList = useMutation({
    mutationFn: (input: CreateListInput) => api.createTodoList(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: any) => [
        ...(old || []),
        { id: 'temp', name: input.name, todoItems: [] }
      ]);
      return { prev };
    },
    onError: (_, __, context) => queryClient.setQueryData(queryKey, context?.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey })
  });

  const updateList = useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateListInput }) => api.updateTodoList(id, input),
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: any) =>
        old?.map((list: any) => list.id === id ? { ...list, ...input } : list)
      );
      return { prev };
    },
    onError: (_, __, context) => queryClient.setQueryData(queryKey, context?.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey })
  });

  const deleteList = useMutation({
    mutationFn: (id: number) => api.deleteTodoList(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: any) => old?.filter((l: any) => l.id !== id));
      return { prev };
    },
    onError: (_, __, context) => queryClient.setQueryData(queryKey, context?.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey })
  });

  const createItem = useMutation({
    mutationFn: ({ listId, input }: { listId: number; input: CreateItemInput }) => api.createTodoItem(listId, input),
    onSettled: () => queryClient.invalidateQueries({ queryKey })
  });

  const updateItem = useMutation({
    mutationFn: ({ listId, itemId, input }: { listId: number; itemId: number; input: UpdateItemInput }) =>
      api.updateTodoItem(listId, itemId, input),
    onMutate: async ({ listId, itemId, input }) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: any) =>
        old?.map((list: any) =>
          list.id === listId
            ? {
                ...list,
                todoItems: list.todoItems.map((item: any) =>
                  item.id === itemId ? { ...item, ...input } : item
                )
              }
            : list
        )
      );
      return { prev };
    },
    onError: (_, __, context) => queryClient.setQueryData(queryKey, context?.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey })
  });

  const deleteItem = useMutation({
    mutationFn: ({ listId, itemId }: { listId: number; itemId: number }) => api.deleteTodoItem(listId, itemId),
    onMutate: async ({ listId, itemId }) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: any) =>
        old?.map((list: any) =>
          list.id === listId
            ? { ...list, todoItems: list.todoItems.filter((item: any) => item.id !== itemId) }
            : list
        )
      );
      return { prev };
    },
    onError: (_, __, context) => queryClient.setQueryData(queryKey, context?.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey })
  });

  const reorderItem = useMutation({
    mutationFn: ({ listId, itemId, newOrder }: { listId: number; itemId: number; newOrder: number }) =>
      api.reorderItem(listId, itemId, newOrder),
    onMutate: async ({ listId, itemId, newOrder }) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: any) =>
        old?.map((list: any) => {
          if (list.id !== listId) return list;
          const oldIndex = list.todoItems.findIndex((i: any) => i.id === itemId);
          return {
            ...list,
            todoItems: arrayMove(list.todoItems, oldIndex, newOrder)
          };
        })
      );
      return { prev };
    },
    onError: (_, __, context) => queryClient.setQueryData(queryKey, context?.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey })
  });

  return {
    lists,
    createList,
    updateList,
    deleteList,
    createItem,
    updateItem,
    deleteItem,
    reorderItem
  };
}
