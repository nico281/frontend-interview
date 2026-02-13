import type { TodoList as TodoListType } from '@/app/todo-lists/types';

/**
 * Moves an item from one index to another in an array.
 * Based on dnd-kit's arrayMove but locally implemented.
 */
export function arrayMove<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...array];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

/**
 * Reorders todo items within a list by moving an item to a new position.
 * @param lists - All todo lists
 * @param listId - The ID of the list containing the item
 * @param itemId - The ID of the item to move
 * @param newOrder - The new index position for the item
 * @returns New lists array with the item reordered
 */
export function reorderItemInList(
  lists: TodoListType[],
  listId: number,
  itemId: number,
  newOrder: number,
): TodoListType[] {
  return lists.map((list) => {
    if (list.id !== listId) return list;

    const oldIndex = list.todoItems.findIndex((i) => i.id === itemId);
    if (oldIndex === -1) return list;

    // Move the item to the new position
    const reorderedItems = arrayMove(list.todoItems, oldIndex, newOrder);

    // Update the order property for all items to match their new positions
    const itemsWithUpdatedOrder = reorderedItems.map((item, index) => ({
      ...item,
      done: item.done ?? false,
      order: index,
    }));

    return {
      ...list,
      todoItems: itemsWithUpdatedOrder,
    };
  });
}
