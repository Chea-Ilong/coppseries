import { useCallback } from 'react';

export function useKeyboardAccessible(onClick) {
  const onKeyDown = useCallback(
    (event) => {
      // Handle both Enter and Space keys for button interactions
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        onClick(event);
      }
    },
    [onClick]
  );

  return {
    role: 'button',
    tabIndex: 0,
    onKeyDown,
    onClick,
  };
}