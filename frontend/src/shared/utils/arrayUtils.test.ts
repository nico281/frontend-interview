import { describe, expect, it } from 'vitest';
import { arrayMove, reorderItemInList } from './arrayUtils';

describe('arrayMove', () => {
  it('moves item from index 0 to index 2', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(arrayMove(arr, 0, 2)).toEqual([2, 3, 1, 4, 5]);
  });

  it('moves item from index 3 to index 1', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(arrayMove(arr, 3, 1)).toEqual([1, 4, 2, 3, 5]);
  });

  it('moves item to the end', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(arrayMove(arr, 1, 4)).toEqual([1, 3, 4, 5, 2]);
  });

  it('moves item to the beginning', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(arrayMove(arr, 4, 0)).toEqual([5, 1, 2, 3, 4]);
  });

  it('does not change array if from === to', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(arrayMove(arr, 2, 2)).toEqual([1, 2, 3, 4, 5]);
  });

  it('returns a new array (does not mutate)', () => {
    const arr = [1, 2, 3];
    const result = arrayMove(arr, 0, 2);
    expect(result).not.toBe(arr);
    expect(arr).toEqual([1, 2, 3]);
  });

  it('works with objects', () => {
    const items = [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
      { id: 3, name: 'c' },
    ];
    expect(arrayMove(items, 0, 2)).toEqual([
      { id: 2, name: 'b' },
      { id: 3, name: 'c' },
      { id: 1, name: 'a' },
    ]);
  });
});

describe('reorderItemInList', () => {
  const mockLists: TodoList[] = [
    {
      id: 1,
      name: 'List 1',
      todoItems: [
        { id: 10, name: 'Item 1', done: false, order: 0 },
        { id: 11, name: 'Item 2', done: false, order: 1 },
      ],
    },
    {
      id: 2,
      name: 'List 2',
      todoItems: [
        { id: 20, name: 'Item A', done: false, order: 0 },
        { id: 21, name: 'Item B', done: false, order: 1 },
      ],
    },
  ];

  it('reorders item within the correct list', () => {
    const result = reorderItemInList(mockLists, 1, 10, 1);
    expect(result[0].todoItems).toEqual([
      { id: 11, name: 'Item 2', done: false, order: 0 },
      { id: 10, name: 'Item 1', done: false, order: 1 },
    ]);
  });

  it('does not affect other lists', () => {
    const result = reorderItemInList(mockLists, 1, 10, 1);
    expect(result[1].todoItems).toEqual([
      { id: 20, name: 'Item A', done: false, order: 0 },
      { id: 21, name: 'Item B', done: false, order: 1 },
    ]);
  });

  it('returns new array (does not mutate)', () => {
    const result = reorderItemInList(mockLists, 1, 10, 1);
    expect(result).not.toBe(mockLists);
    expect(result[0]).not.toBe(mockLists[0]);
  });

  it('handles item not found', () => {
    const result = reorderItemInList(mockLists, 1, 999, 0);
    expect(result[0].todoItems).toEqual(mockLists[0].todoItems);
  });

  it('handles list not found', () => {
    const result = reorderItemInList(mockLists, 999, 10, 0);
    expect(result).toEqual(mockLists);
  });

  it('moves item from index 1 to index 0', () => {
    const result = reorderItemInList(mockLists, 2, 21, 0);
    expect(result[1].todoItems).toEqual([
      { id: 21, name: 'Item B', done: false, order: 0 },
      { id: 20, name: 'Item A', done: false, order: 1 },
    ]);
  });
});
