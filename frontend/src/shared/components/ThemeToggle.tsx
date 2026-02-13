import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/shared/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="text-white dark:text-neutral-900 hover:text-neutral-300 dark:hover:text-neutral-600 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}
