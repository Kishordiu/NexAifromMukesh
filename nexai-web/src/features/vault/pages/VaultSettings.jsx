import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import GlassSurface from '../../../components/ui/GlassSurface';
import Button from '../../../components/ui/Button';

export default function VaultSettings() {
<<<<<<< HEAD
  const { user, logout } = useAuth();

  return (
    <div className="pt-8 pb-32 space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Local Vault</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Secure, on-device data management
        </p>
      </header>

      <GlassSurface level={3} className="p-6 rounded-3xl" glow>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center shadow-inner">
            {/* Vault Lock SVG */}
            <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Account Security</h2>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white/40 p-4 rounded-2xl flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-slate-700">Offline Sync Queue</p>
              <p className="text-xs text-slate-500">0 items pending</p>
            </div>
            <Button variant="secondary" size="sm">Force Sync</Button>
          </div>

          <div className="bg-white/40 p-4 rounded-2xl flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-slate-700">Clear Local Data</p>
              <p className="text-xs text-slate-500">Removes cached measurements</p>
            </div>
            <Button variant="danger" size="sm">Clear</Button>
          </div>
        </div>
      </GlassSurface>

      <Button 
        variant="ghost" 
        className="w-full py-4 text-red-500 hover:text-red-600 hover:bg-red-50"
        onClick={logout}
      >
        Sign Out Securely
      </Button>
    </div>
  );
=======
 const { user, logout } = useAuth();

 return (
 <div className="pt-8 pb-32 space-y-6">
 <header className="mb-8">
 <h1 className="text-2xl font-bold text-slate-800">Local Vault</h1>
 <p className="text-sm text-slate-500 font-medium mt-1">
 Secure, on-device data management
 </p>
 </header>

 <GlassSurface level={3} className="p-6 rounded-3xl" glow>
 <div className="flex items-center gap-4 mb-6">
 <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center shadow-inner">
 {/* Vault Lock SVG */}
 <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
 <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
 </svg>
 </div>
 <div>
 <h2 className="text-lg font-bold text-slate-800">Account Security</h2>
 <p className="text-sm text-slate-500">{user?.email}</p>
 </div>
 </div>

 <div className="space-y-4">
 <div className="bg-white/40 p-4 rounded-2xl flex justify-between items-center">
 <div>
 <p className="text-sm font-bold text-slate-700">Offline Sync Queue</p>
 <p className="text-xs text-slate-500">0 items pending</p>
 </div>
 <Button variant="secondary" size="sm">Force Sync</Button>
 </div>

 <div className="bg-white/40 p-4 rounded-2xl flex justify-between items-center">
 <div>
 <p className="text-sm font-bold text-slate-700">Clear Local Data</p>
 <p className="text-xs text-slate-500">Removes cached measurements</p>
 </div>
 <Button variant="danger" size="sm">Clear</Button>
 </div>
 </div>
 </GlassSurface>

 <Button 
 variant="ghost" 
 className="w-full py-4 text-red-500 hover:text-red-600 hover:bg-red-50"
 onClick={logout}
 >
 Sign Out Securely
 </Button>
 </div>
 );
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
}
