import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function PWARegister() {
<<<<<<< HEAD
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    if (offlineReady) {
      console.log('App ready to work offline');
    }
  }, [offlineReady]);

  // We could return a toast notification here if we wanted
  return null;
=======
 const {
 offlineReady: [offlineReady, setOfflineReady],
 needRefresh: [needRefresh, setNeedRefresh],
 updateServiceWorker,
 } = useRegisterSW({
 onRegisterError(error) {
 console.log('SW registration error', error);
 },
 });

 useEffect(() => {
 if (offlineReady) {
 console.log('App ready to work offline');
 }
 }, [offlineReady]);

 // We could return a toast notification here if we wanted
 return null;
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
}
