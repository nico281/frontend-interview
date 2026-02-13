import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo-list.dto';
import { UpdateTodoListDto } from './dtos/update-todo-list.dto';
import { TodoList } from './entities/todo-list.entity';
import { TodoItem } from './entities/todo-item.entity';
import { AddTodoItemDto } from './dtos/add-todo-item.dto';
import { UpdateTodoItemDto } from './dtos/update-todo-item.dto';
import { todoListsData } from './data/todo-lists.data';

@Injectable()
export class TodoListsService {
  private readonly todolists: TodoList[];

  constructor() {
    this.todolists = todoListsData;
  }

  findAll(): TodoList[] {
    return this.todolists.map(list => ({
      ...list,
      todoItems: list.todoItems.sort((a, b) => a.order - b.order)
    }));
  }

  findOne(id: number): TodoList {
    const list = this.assertTodoListExists(id);
    return {
      ...list,
      todoItems: list.todoItems.sort((a, b) => a.order - b.order)
    };
  }

  create(dto: CreateTodoListDto): TodoList {
    const todoList: TodoList = {
      id: this.nextId(this.todolists),
      name: dto.name,
      todoItems: [],
    };

    // Add record
    this.todolists.push(todoList);

    return todoList;
  }

  update(id: number, dto: UpdateTodoListDto): TodoList {
    const todolist = this.assertTodoListExists(id);

    // Update record
    todolist.name = dto.name;

    return todolist;
  }

  delete(id: number): void {
    const todoList = this.assertTodoListExists(id);

    // Delete record
    this.todolists.splice(this.todolists.indexOf(todoList), 1);
  }

  /**
  --------------------------------------------------------------------
  # Todo-Lists Items
  --------------------------------------------------------------------
  **/

  addTodoItem(todoListId: number, todoItemDto: AddTodoItemDto): TodoItem {
    const todoList = this.assertTodoListExists(todoListId);

    const nextOrder = Math.max(-1, ...todoList.todoItems.map(i => i.order)) + 1;

    const todoItem: TodoItem = {
      id: this.nextId(todoList.todoItems),
      name: todoItemDto.name,
      description: todoItemDto.description,
      done: false,
      order: nextOrder,
    };

    // Add record
    todoList.todoItems.push(todoItem);

    return todoItem;
  }

  findAllTodoItems(todoListId: number): TodoItem[] {
    const todoList = this.assertTodoListExists(todoListId);

    return todoList.todoItems.sort((a, b) => a.order - b.order);
  }

  findOneTodoItem(todoListId: number, todoItemId: number): TodoItem {
    const todoList = this.assertTodoListExists(todoListId);

    return this.assertTodoItemExists(todoList, todoItemId);
  }

  updateTodoItem(
    todoListId: number,
    todoItemId: number,
    todoItemDto: UpdateTodoItemDto,
  ): TodoItem {
    const todoList = this.assertTodoListExists(todoListId);
    const todoItem = this.assertTodoItemExists(todoList, todoItemId);

    // Update record
    if (todoItemDto.name !== undefined) todoItem.name = todoItemDto.name;
    if (todoItemDto.description !== undefined) todoItem.description = todoItemDto.description;
    if (todoItemDto.done !== undefined) todoItem.done = todoItemDto.done;
    if (todoItemDto.order !== undefined) todoItem.order = todoItemDto.order;

    return todoItem;
  }

  removeTodoItem(todoListId: number, todoItemId: number): void {
    const todoList = this.assertTodoListExists(todoListId);
    const todoItem = this.assertTodoItemExists(todoList, todoItemId);

    // Delete record
    todoList.todoItems.splice(todoList.todoItems.indexOf(todoItem), 1);
  }

  /**
  --------------------------------------------------------------------
  # Helper Methods
  --------------------------------------------------------------------
  **/
  private nextId(list: TodoList[] | TodoItem[]): number {
    const last = list
      .map((x: TodoItem | TodoList) => x.id)
      .sort()
      .reverse()[0];

    return last ? last + 1 : 1;
  }

  private assertTodoListExists(id: number): TodoList {
    const index = this.todolists.findIndex((x) => x.id === Number(id));

    if (index === -1) {
      throw new NotFoundException(`Todo list with id ${id} not found`);
    }

    return this.todolists[index];
  }

  private assertTodoItemExists(
    todoList: TodoList,
    todoItemId: number,
  ): TodoItem {
    const index = todoList.todoItems.findIndex(
      (x) => x.id === Number(todoItemId),
    );

    if (index === -1) {
      throw new NotFoundException(`Todo item with id ${todoItemId} not found`);
    }

    return todoList.todoItems[index];
  }
}
