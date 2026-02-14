# Prompts Used

Collection of prompts used during development (for reference).

## Plan
``` Make a plan to create an Todo app. The app will contain lists of todoItems. The user will have the capability to add new lists and on each list will have the feature to add todoItems. the items can be dragged and move between the other items but not between lists. the user will have the capability of CRUD lists and lists items. use tanstack query and axios to deal with data management. The app needs to be mobile first```

## Theme / Dark Mode

```
Implement dark mode support with:
- Toggle button in header
- Persist preference in localStorage
- Respect OS preference as initial value
- Apply dark class to html element
```

## Optimistic Updates

```
Implement optimistic UI updates for Todo mutations:
- Update UI immediately on user action
- Rollback on error
- Don't wait for backend response
- Use TanStack Query's optimistic updates pattern
```

## Drag & Drop

```
Add drag & drop reordering for Todo items:
- Use @dnd-kit library
- Reorder within same list only
- Optimistic update (no wait backend)
- Visual feedback during drag
```

## Inline Editing

```
Add inline editing for Todo List names:
- Double-click or button to edit
- Auto-focus input
- Save on Enter or blur
- Cancel on Escape
```

## Confirmation Modals

```
Add confirmation modals for destructive actions:
- Delete Todo List
- Delete Todo Item
- Show what will be deleted
- Confirm/Cancel buttons
```
