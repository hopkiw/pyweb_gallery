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
    if (!window.pywebview) {
      console.log('got pywebviewready, but pywebview is', window.pywebview);
      return;
    }

    if (store.pythonApi != window.pywebview.api) {
      console.log('pywebview is now:', window.pywebview);
      store.pythonApi = window.pywebview.api;
      callback();
    }
  }

  window.addEventListener('pywebviewready', handler);

  return () => {
    window.removeEventListener('pywebviewready', handler);
  }
}
