import { useSyncExternalStore } from 'react';

const keyStore = { 'control': false };

export function useKeyListener() {
  const isPressed = useSyncExternalStore(subscribe, getSnapshot);
  return isPressed;
}

function getSnapshot() {
  return keyStore.control;
}

function subscribe(callback) {
  const handleKeyDown = (e) => {
    if (e.key === 'Control' && keyStore.control !== true) {
      keyStore.control = true;
      callback();
    }
  }

  const handleKeyUp = (e) => {
    if (e.key === 'Control' && keyStore.control !== false) {
      keyStore.control = false;
      callback();
    }
  }

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  }
}
