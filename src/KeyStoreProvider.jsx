import React, { createContext, useState, useEffect, useContext } from 'react';

const Context = createContext(undefined);


function KeyStoreProvider({ children}) {
  console.log('keystoreprovider render');
  const [keyStore, setKeyStore] = useState();

  useEffect(() => {
    setKeyStore((prevState) => {
      console.log('keystore:useeffect:setup');
      if (prevState) return prevState;
      return { keys: { control: false, shift: false } }
    });
    return () => {
      if (keyStore) {
        console.log('keystore:useeffect:setup cleanup');
        setKeyStore(undefined);
      }
    };
  }, [keyStore]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Control' && keyStore.keys.control !== true) {
        // keyStore.current = {...keyStore.keys, 'control': true};
        keyStore.keys.control = true;
      }
      if (e.key === 'Shift' && keyStore.keys.shift !== true) {
        keyStore.keys.shift = true;
      }
    }

    const handleKeyUp = (e) => {
      if (e.key === 'Control' && keyStore.keys.control !== false) {
        keyStore.keys.control = false;
      }
      if (e.key === 'Shift' && keyStore.keys.shift !== false) {
        keyStore.keys.shift = false;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    }
  }, [keyStore]);


  return <Context.Provider value={keyStore}>{children}</Context.Provider>;
}

function useKeyStore() {
  return useContext(Context);
}

export { KeyStoreProvider, useKeyStore };
