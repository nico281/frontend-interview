import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './shared/contexts/ThemeContext';
import TodoListsApp from './app/todo-lists';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TodoListsApp />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
