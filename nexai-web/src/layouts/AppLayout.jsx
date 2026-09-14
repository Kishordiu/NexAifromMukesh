import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '../components/navigation/BottomNav';
<<<<<<< HEAD
import { StatusIndicator } from '../components/ui/StatusIndicator';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

/**
 * Main authenticated app layout.
 * Provides the BottomNav, safe-area padding, and connectivity indicator.
=======
import SideNav from '../components/navigation/SideNav';
import { StatusIndicator } from '../components/ui/StatusIndicator';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import AuroraBackground from '../components/ui/AuroraBackground';

/**
 * Main authenticated app layout.
 * Adapts to mobile (BottomNav) and desktop (SideNav).
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
 */
export default function AppLayout() {
  const { isOnline } = useOnlineStatus();

  return (
<<<<<<< HEAD
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
=======
    <AuroraBackground>
      {/* Connectivity status bar (only shown when offline) */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500/90 backdrop-blur-sm px-4 py-2 flex items-center justify-center gap-2">
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
          <StatusIndicator status="offline" />
          <span className="text-white text-sm font-medium">You are offline — data will sync when reconnected</span>
        </div>
      )}

<<<<<<< HEAD
      {/* Main content area */}
      <main className="relative z-0 w-full max-w-lg mx-auto px-4">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
=======
      <div className="flex w-full min-h-screen">
        {/* Desktop Sidebar (hidden on mobile) */}
        <SideNav />

        {/* Main content area */}
        {/* md:ml-64 ensures content doesn't underlap the sidebar on desktop */}
        {/* pb-24 ensures content doesn't underlap the BottomNav on mobile */}
        <main className="relative z-10 w-full md:ml-64 pb-24 md:pb-8 pt-6 md:pt-8 px-4 md:px-8 xl:px-12 flex-1 flex flex-col max-w-7xl mx-auto">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation (hidden on desktop) */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </AuroraBackground>
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
  );
}
