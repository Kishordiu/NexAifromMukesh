import React, { createContext, useContext, useState } from 'react';

const SyncContext = createContext({});

export function SyncProvider({ children }) {
<<<<<<< HEAD
  const [syncState, setSyncState] = useState('online');

  return (
    <SyncContext.Provider value={{ syncState, setSyncState }}>
      {children}
    </SyncContext.Provider>
  );
=======
 const [syncState, setSyncState] = useState('online');

 return (
 <SyncContext.Provider value={{ syncState, setSyncState }}>
 {children}
 </SyncContext.Provider>
 );
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
}

export const useSync = () => useContext(SyncContext);
