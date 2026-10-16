import React, { createContext, useContext, useState } from 'react';

const SyncContext = createContext({});

export function SyncProvider({ children }) {
  const [syncState, setSyncState] = useState('online');

  return (
    <SyncContext.Provider value={{ syncState, setSyncState }}>
      {children}
    </SyncContext.Provider>
  );
}

export const useSync = () => useContext(SyncContext);
