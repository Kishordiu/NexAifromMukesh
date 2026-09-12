import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '../components/navigation/BottomNav';
import SideNav from '../components/navigation/SideNav';
import { StatusIndicator } from '../components/ui/StatusIndicator';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import AuroraBackground from '../components/ui/AuroraBackground';

/**
 * Main authenticated app layout.
 * Adapts to mobile (BottomNav) and desktop (SideNav).
 */
export default function AppLayout() {
  const { isOnline } = useOnlineStatus();

  return (
    <AuroraBackground>
      {/* Connectivity status bar (only shown when offline) */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500/90 backdrop-blur-sm px-4 py-2 flex items-center justify-center gap-2">
          <StatusIndicator status="offline" />
          <span className="text-white text-sm font-medium">You are offline — data will sync when reconnected</span>
        </div>
      )}

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
  );
}
