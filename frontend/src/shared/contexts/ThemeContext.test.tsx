import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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
    matchMediaMock.mockReturnValue({
      matches: false,
      media: '',
      addEventListener: () => {},
      removeEventListener: () => {},
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('should use light theme by default when no preference', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(await screen.findByText('theme: light')).toBeInTheDocument();
  });

  it('should use system dark preference when no localStorage', async () => {
    matchMediaMock.mockReturnValue({
      matches: true,
      media: '',
      addEventListener: () => {},
      removeEventListener: () => {},
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(await screen.findByText('theme: dark')).toBeInTheDocument();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should load theme from localStorage', async () => {
    localStorage.setItem('theme', 'dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(await screen.findByText('theme: dark')).toBeInTheDocument();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should toggle theme and persist to localStorage', async () => {
    render(
      <ThemeProvider>
        <TestComponentWithToggle />
      </ThemeProvider>,
    );

    expect(await screen.findByText('theme: light')).toBeInTheDocument();

    screen.getByText('toggle').click();

    expect(await screen.findByText('theme: dark')).toBeInTheDocument();
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    screen.getByText('toggle').click();

    expect(await screen.findByText('theme: light')).toBeInTheDocument();
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});

function TestComponent() {
  const { theme } = useTheme();
  return <span>theme: {theme}</span>;
}

function TestComponentWithToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span>theme: {theme}</span>
      <button type="button" onClick={toggleTheme}>toggle</button>
    </div>
  );
}
