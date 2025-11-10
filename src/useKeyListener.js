import { useSyncExternalStore } from 'react';

const keyStore = { 'keys': { 'control': false, 'shift': false } };

export function useKeyListener() {
  const isPressed = useSyncExternalStore(subscribe, getSnapshot);
  return isPressed;
}

function getSnapshot() {
  return keyStore.keys
}

function subscribe(callback) {
  const handleKeyDown = (e) => {
    if (e.key === 'Control' && keyStore.control !== true) {
      keyStore.keys = {...keyStore.keys, 'control': true};
      callback();
    }
    if (e.key === 'Shift' && keyStore.shift !== true) {
      keyStore.keys = {...keyStore.keys, 'shift': true};
      callback();
    }
  }

  const handleKeyUp = (e) => {
    if (e.key === 'Control' && keyStore.control !== false) {
      keyStore.keys = {...keyStore.keys, 'control': false};
      callback();
    }
    if (e.key === 'Shift' && keyStore.shift !== false) {
      keyStore.keys = {...keyStore.keys, 'shift': false};
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
