import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '../components/navigation/BottomNav';
import { StatusIndicator } from '../components/ui/StatusIndicator';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

/**
 * Main authenticated app layout.
 * Provides the BottomNav, safe-area padding, and connectivity indicator.
 */
export default function AppLayout() {
  const { isOnline } = useOnlineStatus();

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden pb-24">
      {/* Atmospheric background layers */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-purple-300/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-200/6 rounded-full blur-3xl" />
      </div>

      {/* Connectivity status bar (only shown when offline) */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500/90 backdrop-blur-sm px-4 py-2 flex items-center justify-center gap-2">
          <StatusIndicator status="offline" />
          <span className="text-white text-sm font-medium">You are offline — data will sync when reconnected</span>
        </div>
      )}

      {/* Main content area */}
      <main className="relative z-0 w-full max-w-lg mx-auto px-4">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}
