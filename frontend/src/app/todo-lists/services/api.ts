import axios from 'axios';
import type { CreateItemInput, CreateListInput, TodoItem, TodoList, UpdateItemInput, UpdateListInput } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Lists
export const getTodoLists = (): Promise<TodoList[]> => api.get<TodoList[]>('/todo-lists').then((r) => r.data);

export const createTodoList = (input: CreateListInput): Promise<TodoList> =>
  api.post<TodoList>('/todo-lists', input).then((r) => r.data);

export const updateTodoList = (id: number, input: UpdateListInput): Promise<TodoList> =>
  api.patch<TodoList>(`/todo-lists/${id}`, input).then((r) => r.data);

export const deleteTodoList = (id: number): Promise<void> => api.delete(`/todo-lists/${id}`).then((r) => r.data);

// Items
export const createTodoItem = (listId: number, input: CreateItemInput): Promise<TodoItem> =>
  api.post<TodoItem>(`/todo-lists/${listId}/todo-items`, input).then((r) => r.data);

export const updateTodoItem = (listId: number, itemId: number, input: UpdateItemInput): Promise<TodoItem> =>
  api.patch<TodoItem>(`/todo-lists/${listId}/todo-items/${itemId}`, input).then((r) => r.data);

export const deleteTodoItem = (listId: number, itemId: number): Promise<void> =>
  api.delete(`/todo-lists/${listId}/todo-items/${itemId}`).then((r) => r.data);

export const reorderItem = (listId: number, itemId: number, newOrder: number): Promise<TodoItem> =>
  api
    .patch<TodoItem>(`/todo-lists/${listId}/todo-items/${itemId}`, {
      order: newOrder,
    })
    .then((r) => r.data);
