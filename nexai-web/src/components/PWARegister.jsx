import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function PWARegister() {
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
}
