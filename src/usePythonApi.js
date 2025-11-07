import { useSyncExternalStore } from 'react';

const store = { pythonApi: undefined };

export function usePythonApi() {
  const pythonApi = useSyncExternalStore(subscribe, getSnapshot);
  return pythonApi;
}

function getSnapshot() {
  return store.pythonApi;
}

function subscribe(callback) {
  const handler = () => {
    if (store.pythonApi != window.pywebview.api) {
      store.pythonApi = window.pywebview.api;
      callback();
    }
  }

  window.addEventListener('pywebviewready', handler);

  return () => {
    window.removeEventListener('pywebviewready', handler);
  }
}
