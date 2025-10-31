import React, { createContext, useState, useEffect, useContext } from 'react';
// import DragSelect from './DragSelect.esm.js';
import DragSelect from 'dragselect';

const Context = createContext(undefined);


function DragSelectProvider({ children, settings = {} }) {
  const [ds, setDS] = useState();

  useEffect(() => {
    setDS((prevState) => {
      if (prevState) return prevState;
      const ds_ = new DragSelect({});
      ds_.Selection.filterSelected = ({ selectorRect, select: _select, unselect: _unselect }) => {
        const select = new Map(_select), unselect = new Map(_unselect)
        if (!(ds_.stores.KeyStore.currentValues.includes('control'))) {
          select.forEach((boundingRect, element) => {
            select.delete(element);
            unselect.set(element, boundingRect);
          })
        }
        return { select, unselect }
      }
      return ds_;
    });
    return () => {
      if (ds) {
        ds.stop();
        setDS(undefined);
      }
    };
  }, [ds]);

  useEffect(() => {
    ds?.setSettings(settings);
  }, [ds, settings]);

  return <Context.Provider value={ds}>{children}</Context.Provider>;
}

function useDragSelect() {
  return useContext(Context);
}

export { DragSelectProvider, useDragSelect };
