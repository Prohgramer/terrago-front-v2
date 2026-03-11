import { consoleLoggingIntegration } from '@sentry/react';
import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);
  const [showCompareBar, setShowCompareBar] = useState(false);

  const toggleCompare = (terreno) => {
    setCompareList(prev => {
      const isAlreadyAdded = prev.some(item => item._id === terreno._id);
      
      if (isAlreadyAdded) {
        const newList = prev.filter(item => item._id !== terreno._id);
        if (newList.length === 0) {
          setShowCompareBar(false);
        }
        return newList;
      }
      
      if (prev.length >= 3) {
        toast.error('Maximo 3 terrenos para comparar');
        return prev;
      }
      
      setShowCompareBar(true);
      return [...prev, terreno];
    });
  };

  const clearCompareList = () => {
    setCompareList([]);
    setShowCompareBar(false);
    if (window.location.pathname.startsWith('/comparar/')){
      window.history.back();
    }

  };

  const isInCompareList = (terrenoId) => {
    return compareList.some(item => item._id === terrenoId);
  };

  return (
    <CompareContext.Provider value={{
      compareList,
      showCompareBar,
      toggleCompare,
      clearCompareList,
      isInCompareList
    }}>
      {children}
    </CompareContext.Provider>
  );
}

export const useCompare = () => useContext(CompareContext);