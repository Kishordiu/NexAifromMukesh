import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Scan, Activity, FileText, Settings, Shield } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const ICONS = {
  home: Home,
  scan: Scan,
  triage: Activity,
  reports: FileText,
  settings: Settings,
  admin: Shield
};

const TABS = [
  { id: 'home', path: '/home', icon: 'home', label: 'Home' },
  { id: 'scan', path: '/scan', icon: 'scan', label: 'Scan' },
  { id: 'triage', path: '/triage', icon: 'triage', label: 'Triage' },
  { id: 'reports', path: '/reports', icon: 'reports', label: 'Reports' },
  { id: 'settings', path: '/settings', icon: 'settings', label: 'Settings' }
];

export default function SideNav() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  
  const tabs = isAdmin 
    ? [...TABS.slice(0, 4), { id: 'admin', path: '/admin', icon: 'admin', label: 'Admin' }, TABS[4]]
    : TABS;

  const cn = (...inputs) => twMerge(clsx(inputs));

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed top-0 left-0 bg-white/40 backdrop-blur-2xl border-r border-white/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-40 px-4 py-8">
      <div className="flex items-center gap-3 px-4 mb-12">
        <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold tracking-tighter">
          D
        </div>
        <span className="text-xl font-medium tracking-tight text-slate-800">DiuMed</span>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {tabs.map((tab) => {
          const Icon = ICONS[tab.icon];
          return (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                isActive 
                  ? "bg-[var(--accent)]/10 text-[var(--accent)] font-medium" 
                  : "text-slate-500 hover:bg-white/50 hover:text-slate-800"
              )}
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn("w-5 h-5", isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100 transition-opacity")} />
                  <span>{tab.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto px-4">
        <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-white/50 border border-white/60">
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
            {/* Fallback avatar */}
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-800 truncate w-32">{user?.email || 'User'}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500">{user?.role || 'PATIENT'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
