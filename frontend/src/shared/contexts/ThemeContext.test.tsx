import { render, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
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

const matchMediaMock = vi.fn();
matchMediaMock.mockImplementation((query: string) => ({
  matches: false,
  media: query,
  addEventListener: () => {},
  removeEventListener: () => {},
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => {},
}));

vi.stubGlobal('window', {
  matchMedia: matchMediaMock,
});

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    cleanup();
  });

  it('should use light theme by default when no preference', async () => {
    matchMediaMock.mockReturnValue({ matches: false, media: '', addEventListener: () => {}, removeEventListener: () => {} });

    let theme: string | null = null;

    render(
      <ThemeProvider>
        <TestComponent setter={(t) => (theme = t)} />
      </ThemeProvider>,
    );

    await waitFor(() => expect(theme).toBe('light'));
  });

  it('should use system dark preference when no localStorage', async () => {
    matchMediaMock.mockReturnValue({ matches: true, media: '', addEventListener: () => {}, removeEventListener: () => {} });

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

    await waitFor(() => expect(themeResult?.theme).toBe('light'));

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
