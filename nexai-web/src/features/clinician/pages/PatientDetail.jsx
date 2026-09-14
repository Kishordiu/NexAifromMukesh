import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GlassSurface from '../../../components/ui/GlassSurface';
import Button from '../../../components/ui/Button';

export default function PatientDetail() {
<<<<<<< HEAD
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="pt-8 pb-32 space-y-6">
      <header className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate('/clinician')} className="p-2 bg-white/50 rounded-full shadow-sm">
          <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Patient Detail</h1>
          <p className="text-xs text-slate-500 font-medium">ID: {id}</p>
        </div>
      </header>

      <GlassSurface level={3} className="p-6 rounded-3xl text-center">
        <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Deep Clinical View</h3>
        <p className="text-sm text-slate-500 mb-6">
          In the full production release, this screen allows clinicians to view longitudinal charts, verify OCR lab reports, and adjust AI-generated risk scores.
        </p>
        <Button variant="primary" onClick={() => navigate('/clinician')}>Back to Patient List</Button>
      </GlassSurface>
    </div>
  );
=======
 const { id } = useParams();
 const navigate = useNavigate();

 return (
 <div className="pt-8 pb-32 space-y-6">
 <header className="mb-6 flex items-center gap-4">
 <button onClick={() => navigate('/clinician')} className="p-2 bg-white/50 rounded-full shadow-sm">
 <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
 </button>
 <div>
 <h1 className="text-xl font-bold text-slate-800">Patient Detail</h1>
 <p className="text-xs text-slate-500 font-medium">ID: {id}</p>
 </div>
 </header>

 <GlassSurface level={3} className="p-6 rounded-3xl text-center">
 <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
 <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
 </svg>
 <h3 className="text-lg font-bold text-slate-800 mb-2">Deep Clinical View</h3>
 <p className="text-sm text-slate-500 mb-6">
 In the full production release, this screen allows clinicians to view longitudinal charts, verify OCR lab reports, and adjust AI-generated risk scores.
 </p>
 <Button variant="primary" onClick={() => navigate('/clinician')}>Back to Patient List</Button>
 </GlassSurface>
 </div>
 );
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
}
