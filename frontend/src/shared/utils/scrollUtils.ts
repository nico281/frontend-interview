import type { RefObject } from 'react';

export function scrollToBottom(containerRef: RefObject<HTMLDivElement | null>) {
  const container = containerRef.current;
  if (container) {
    setTimeout(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }, 100);
  }
}
