export interface TodoItem {
  id: number;
  name: string;
  description?: string;
  done: boolean;
  order: number;
}

export interface TodoList {
  id: number;
  name: string;
  todoItems: TodoItem[];
}

export interface CreateListInput {
  name: string;
}

export interface UpdateListInput {
  name: string;
}

export interface CreateItemInput {
  name: string;
  description?: string;
}

export interface UpdateItemInput {
  name?: string;
  description?: string;
  done?: boolean;
  order?: number;
}

export interface ReorderItemsInput {
  itemId: number;
  newOrder: number;
}
