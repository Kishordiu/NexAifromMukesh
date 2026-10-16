import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Public layout for login/onboarding screens.
 * No bottom navigation. Full cinematic presentation.
 */
export default function AuthLayout() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-center">
      {/* Atmospheric background for auth screens */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-300/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-200/5 rounded-full blur-3xl" />
      </div>

      <main className="relative z-0 w-full max-w-md mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
