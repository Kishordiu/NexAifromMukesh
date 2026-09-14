import React from 'react';
import GlassSurface from '../../../components/ui/GlassSurface';

export function TriageResponse({ data }) {
<<<<<<< HEAD
  if (!data) return null;

  const urgencyColors = {
    LOW: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
    HIGH: 'bg-red-50 text-red-700 border-red-200',
    CRITICAL: 'bg-red-100 text-red-800 border-red-300',
  };

  const urgency = data.urgency?.toUpperCase() || 'LOW';
  const colorClass = urgencyColors[urgency] || urgencyColors.LOW;

  return (
    <GlassSurface level={3} className="p-6 rounded-3xl space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Triage Assessment</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colorClass}`}>
          {urgency}
        </span>
      </div>

      {data.summary && (
        <p className="text-sm text-slate-600 leading-relaxed">{data.summary}</p>
      )}

      {data.symptoms && data.symptoms.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Detected Symptoms</h4>
          <div className="flex flex-wrap gap-2">
            {data.symptoms.map((s, i) => (
              <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.recommendation && (
        <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100">
          <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Recommendation</h4>
          <p className="text-sm text-blue-800">{data.recommendation}</p>
        </div>
      )}

      <p className="text-[10px] text-slate-400 text-center pt-2">
        This is an AI-assisted triage and does not replace professional medical advice.
      </p>
    </GlassSurface>
  );
=======
 if (!data) return null;

 const urgencyColors = {
 LOW: 'bg-emerald-50 text-emerald-700 border-emerald-200',
 MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
 HIGH: 'bg-red-50 text-red-700 border-red-200',
 CRITICAL: 'bg-red-100 text-red-800 border-red-300',
 };

 const urgency = data.urgency?.toUpperCase() || 'LOW';
 const colorClass = urgencyColors[urgency] || urgencyColors.LOW;

 return (
 <GlassSurface level={3} className="p-6 rounded-3xl space-y-4">
 <div className="flex justify-between items-center">
 <h3 className="text-lg font-bold text-slate-800">Triage Assessment</h3>
 <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colorClass}`}>
 {urgency}
 </span>
 </div>

 {data.summary && (
 <p className="text-sm text-slate-600 leading-relaxed">{data.summary}</p>
 )}

 {data.symptoms && data.symptoms.length > 0 && (
 <div>
 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Detected Symptoms</h4>
 <div className="flex flex-wrap gap-2">
 {data.symptoms.map((s, i) => (
 <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
 {s}
 </span>
 ))}
 </div>
 </div>
 )}

 {data.recommendation && (
 <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100">
 <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Recommendation</h4>
 <p className="text-sm text-blue-800">{data.recommendation}</p>
 </div>
 )}

 <p className="text-[10px] text-slate-400 text-center pt-2">
 This is an AI-assisted triage and does not replace professional medical advice.
 </p>
 </GlassSurface>
 );
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
}
