import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../lib/api';
import GlassSurface from '../../../components/ui/GlassSurface';

export default function ClinicianDashboard() {
<<<<<<< HEAD
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await api.clinician.getPatients();
        setPatients(data || []);
      } catch (e) {
        console.error("Failed to load patients", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const getRiskColor = (level) => {
    switch(level) {
      case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-300';
      case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'MODERATE': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'LOW': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="pt-8 pb-32 space-y-6">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Clinician Portal</h1>
          <p className="text-xs text-slate-500 font-medium">Patient Overview</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
          DR
        </div>
      </header>

      {isLoading ? (
        <div className="text-center p-8"><span className="text-slate-400">Loading patients...</span></div>
      ) : patients.length === 0 ? (
        <GlassSurface level={2} className="p-8 text-center rounded-3xl">
          <p className="text-sm text-slate-500">No patients found.</p>
        </GlassSurface>
      ) : (
        <div className="space-y-4">
          {patients.map(patient => (
            <GlassSurface 
              key={patient.id} 
              level={2} 
              className="p-5 rounded-2xl cursor-pointer"
              onClick={() => navigate(`/clinician/patient/${patient.id}`)}
              interactive
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-slate-800">{patient.name}</h3>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${getRiskColor(patient.risk?.risk_level)}`}>
                  {patient.risk?.risk_level} RISK ({patient.risk?.score})
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {patient.pregnancy_week} weeks pregnant • {patient.email}
              </p>
            </GlassSurface>
          ))}
        </div>
      )}
    </div>
  );
=======
 const navigate = useNavigate();
 const [patients, setPatients] = useState([]);
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
 const fetchPatients = async () => {
 try {
 const data = await api.clinician.getPatients();
 setPatients(data || []);
 } catch (e) {
 console.error("Failed to load patients", e);
 } finally {
 setIsLoading(false);
 }
 };
 fetchPatients();
 }, []);

 const getRiskColor = (level) => {
 switch(level) {
 case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-300';
 case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-300';
 case 'MODERATE': return 'bg-amber-100 text-amber-700 border-amber-300';
 case 'LOW': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
 default: return 'bg-slate-100 text-slate-700 border-slate-300';
 }
 };

 return (
 <div className="pt-8 pb-32 space-y-6">
 <header className="mb-6 flex justify-between items-center">
 <div>
 <h1 className="text-xl font-bold text-slate-800">Clinician Portal</h1>
 <p className="text-xs text-slate-500 font-medium">Patient Overview</p>
 </div>
 <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
 DR
 </div>
 </header>

 {isLoading ? (
 <div className="text-center p-8"><span className="text-slate-400">Loading patients...</span></div>
 ) : patients.length === 0 ? (
 <GlassSurface level={2} className="p-8 text-center rounded-3xl">
 <p className="text-sm text-slate-500">No patients found.</p>
 </GlassSurface>
 ) : (
 <div className="space-y-4">
 {patients.map(patient => (
 <GlassSurface 
 key={patient.id} 
 level={2} 
 className="p-5 rounded-2xl cursor-pointer"
 onClick={() => navigate(`/clinician/patient/${patient.id}`)}
 interactive
 >
 <div className="flex justify-between items-center mb-2">
 <h3 className="font-bold text-slate-800">{patient.name}</h3>
 <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${getRiskColor(patient.risk?.risk_level)}`}>
 {patient.risk?.risk_level} RISK ({patient.risk?.score})
 </span>
 </div>
 <p className="text-xs text-slate-500">
 {patient.pregnancy_week} weeks pregnant • {patient.email}
 </p>
 </GlassSurface>
 ))}
 </div>
 )}
 </div>
 );
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
}
