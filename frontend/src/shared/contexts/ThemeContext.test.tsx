import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeContext';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

vi.stubGlobal('localStorage', localStorageMock);

vi.stubGlobal('window', {
  matchMedia: (query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => {},
  }),
});

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('should use light theme by default when no preference', async () => {
    let theme: string | null = null;

    render(
      <ThemeProvider>
        <TestComponent setter={(t) => (theme = t)} />
      </ThemeProvider>,
    );

    await waitFor(() => expect(theme).toBe('light'));
  });

  it('should use system dark preference when no localStorage', async () => {
    vi.stubGlobal('window', {
      matchMedia: (query: string) => ({
        matches: true,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => {},
      }),
    });

    let theme: string | null = null;

    render(
      <ThemeProvider>
        <TestComponent setter={(t) => (theme = t)} />
      </ThemeProvider>,
    );

    await waitFor(() => expect(theme).toBe('dark'));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should load theme from localStorage', async () => {
    localStorage.setItem('theme', 'dark');

    let theme: string | null = null;

    render(
      <ThemeProvider>
        <TestComponent setter={(t) => (theme = t)} />
      </ThemeProvider>,
    );

    await waitFor(() => expect(theme).toBe('dark'));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should toggle theme and persist to localStorage', async () => {
    let themeResult: { theme: string; toggleTheme: () => void } | null = null;

    render(
      <ThemeProvider>
        <TestComponentWithToggle setter={(t) => (themeResult = t)} />
      </ThemeProvider>,
    );

    await waitFor(() => themeResult?.theme === 'light');

    themeResult!.toggleTheme();

    await waitFor(() => expect(themeResult?.theme).toBe('dark'));
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    themeResult!.toggleTheme();

    await waitFor(() => expect(themeResult?.theme).toBe('light'));
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});

function TestComponent({ setter }: { setter: (theme: string) => void }) {
  const { theme } = useTheme();
  setter(theme);
  return null;
}

function TestComponentWithToggle({
  setter,
}: {
  setter: (result: { theme: string; toggleTheme: () => void }) => void;
}) {
  const { theme, toggleTheme } = useTheme();
  setter({ theme, toggleTheme });
  return null;
}
