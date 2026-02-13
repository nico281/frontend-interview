import { TodoList } from '../entities/todo-list.entity';

export const todoListsData: TodoList[] = [
  {
    id: 1,
    name: 'Groceries',
    todoItems: [
      {
        id: 1,
        name: 'Buy milk',
        description: 'Buy a gallon of milk from store',
        done: false,
        order: 0,
      },
      {
        id: 2,
        name: 'Buy eggs',
        description: 'Buy a dozen eggs',
        done: false,
        order: 1,
      },
      {
        id: 3,
        name: 'Buy bread',
        description: 'Buy a loaf of whole grain bread',
        done: false,
        order: 2,
      },
      {
        id: 4,
        name: 'Buy fruits',
        description: 'Buy apples and bananas',
        done: true,
        order: 3,
      },
    ],
  },
  {
    id: 2,
    name: 'Chores',
    todoItems: [
      {
        id: 1,
        name: 'Clean house',
        description: 'Vacuum and dust all rooms',
        done: false,
        order: 0,
      },
      {
        id: 2,
        name: 'Wash dishes',
        description: 'Clean all dirty dishes in sink',
        done: false,
        order: 1,
      },
      {
        id: 3,
        name: 'Do laundry',
        description: 'Wash and fold clothes',
        done: true,
        order: 2,
      },
      {
        id: 4,
        name: 'Take out trash',
        description: 'Take out trash to curb',
        done: false,
        order: 3,
      },
    ],
  },
  {
    id: 3,
    name: 'Assignments',
    todoItems: [
      {
        id: 1,
        name: 'Math homework',
        description: 'Complete algebra exercises',
        done: true,
        order: 0,
      },
      {
        id: 2,
        name: 'Science project',
        description: 'Prepare presentation on solar system',
        done: false,
        order: 1,
      },
    ],
  },
];
