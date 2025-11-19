import { useContext } from 'react';

import { KeyStoreContext } from './KeyStoreContext.js'

export function useKeyStore() {
  return useContext(KeyStoreContext);
}
