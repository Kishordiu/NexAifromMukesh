import { useState, useEffect } from 'react';

export function useOnlineStatus() {
<<<<<<< HEAD
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [since, setSince] = useState(Date.now());

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSince(Date.now());
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSince(Date.now());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, since };
=======
 const [isOnline, setIsOnline] = useState(navigator.onLine);
 const [since, setSince] = useState(Date.now());

 useEffect(() => {
 const handleOnline = () => {
 setIsOnline(true);
 setSince(Date.now());
 };

 const handleOffline = () => {
 setIsOnline(false);
 setSince(Date.now());
 };

 window.addEventListener('online', handleOnline);
 window.addEventListener('offline', handleOffline);

 return () => {
 window.removeEventListener('online', handleOnline);
 window.removeEventListener('offline', handleOffline);
 };
 }, []);

 return { isOnline, since };
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
}
