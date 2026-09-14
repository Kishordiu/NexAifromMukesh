import React from 'react';
import GlassSurface from '../../../components/ui/GlassSurface';
import Button from '../../../components/ui/Button';

export function PermissionGate({ 
<<<<<<< HEAD
  permissionState, 
  error, 
  onRetry, 
  onRequestPermission,
  children 
}) {
  if (permissionState === 'granted' && !error) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-6">
      <GlassSurface level={3} className="w-full max-w-sm p-8 rounded-[30px] text-center flex flex-col items-center gap-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${permissionState === 'denied' || error ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
          {permissionState === 'denied' || error ? (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-slate-800">
          {permissionState === 'denied' || error ? 'Camera Access Denied' : 'Camera Access Required'}
        </h3>
        
        <p className="text-sm text-slate-500 font-medium">
          {error || 'NexAI needs camera access to perform clinical vision scans and vitals measurement.'}
        </p>

        {permissionState === 'denied' ? (
          <div className="w-full mt-2">
            <p className="text-xs text-slate-400 mb-4 bg-slate-50 p-3 rounded-xl">
              Please open your browser settings and allow camera access for this site, then try again.
            </p>
            <Button variant="primary" className="w-full" onClick={onRetry}>
              I've Updated Settings
            </Button>
          </div>
        ) : (
          <Button variant="primary" className="w-full mt-2" onClick={onRequestPermission}>
            Allow Camera
          </Button>
        )}
      </GlassSurface>
    </div>
  );
=======
 permissionState, 
 error, 
 onRetry, 
 onRequestPermission,
 children 
}) {
 if (permissionState === 'granted' && !error) {
 return <>{children}</>;
 }

 return (
 <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-6">
 <GlassSurface level={3} className="w-full max-w-sm p-8 rounded-[30px] text-center flex flex-col items-center gap-4">
 <div className={`w-16 h-16 rounded-full flex items-center justify-center ${permissionState === 'denied' || error ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
 {permissionState === 'denied' || error ? (
 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
 <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
 </svg>
 ) : (
 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
 <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
 <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
 </svg>
 )}
 </div>
 
 <h3 className="text-xl font-bold text-slate-800">
 {permissionState === 'denied' || error ? 'Camera Access Denied' : 'Camera Access Required'}
 </h3>
 
 <p className="text-sm text-slate-500 font-medium">
 {error || 'DiuMed needs camera access to perform clinical vision scans and vitals measurement.'}
 </p>

 {permissionState === 'denied' ? (
 <div className="w-full mt-2">
 <p className="text-xs text-slate-400 mb-4 bg-slate-50 p-3 rounded-xl">
 Please open your browser settings and allow camera access for this site, then try again.
 </p>
 <Button variant="primary" className="w-full" onClick={onRetry}>
 I've Updated Settings
 </Button>
 </div>
 ) : (
 <Button variant="primary" className="w-full mt-2" onClick={onRequestPermission}>
 Allow Camera
 </Button>
 )}
 </GlassSurface>
 </div>
 );
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
}
