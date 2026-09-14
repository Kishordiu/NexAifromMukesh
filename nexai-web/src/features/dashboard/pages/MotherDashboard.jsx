import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../lib/api';
import { evaluateRisk } from '../../../lib/riskEngine';
import GlassSurface from '../../../components/ui/GlassSurface';
import Button from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

export default function MotherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prof, meas] = await Promise.all([
          api.patient.getProfile(),
          api.patient.getMeasurements()
        ]);
        setProfile(prof);
        setMeasurements(meas || []);

        // Run client-side risk engine on the latest data
        const riskResult = evaluateRisk(meas || []);
        setRisk(riskResult);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helpers to extract latest measurement by type
  const getLatest = (type) => {
    const match = measurements.find(m => m.type === type);
    return match;
  };

  const latestHR = getLatest('heart_rate');
  const latestBP = getLatest('blood_pressure');

  const riskBadge = () => {
    if (!risk) return <Badge variant="info">LOADING</Badge>;
    const map = {
      LOW: { variant: 'success', label: 'LOW RISK' },
      MODERATE: { variant: 'warning', label: 'MODERATE' },
      HIGH: { variant: 'warning', label: 'HIGH RISK' },
      CRITICAL: { variant: 'error', label: 'CRITICAL' }
    };
    const r = map[risk.level] || map.LOW;
    return <Badge variant={r.variant} pulse={risk.level === 'CRITICAL'}>{r.label}</Badge>;
  };

  const actionTiles = [
    { label: 'Bio-Aura Scan', desc: 'Contactless Vitals', path: '/scan', color: 'bg-blue-50 text-blue-500', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { label: 'Lab OCR', desc: 'Scan Reports', path: '/ocr', color: 'bg-purple-50 text-purple-500', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
    { label: 'Anemia Check', desc: 'Eyelid Analysis', path: '/scan/anemia', color: 'bg-red-50 text-red-500', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
    { label: 'Sclera Scan', desc: 'Jaundice Screen', path: '/scan/sclera', color: 'bg-amber-50 text-amber-500', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  ];

  return (
    <div className="pt-8 pb-32 space-y-6">
      {/* Greeting */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Hello, {profile?.name ? profile.name.split(' ')[0] : 'Mother'}
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            {profile?.pregnancy_week ? `Week ${profile.pregnancy_week}` : 'Welcome to NexAI'}
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
          {profile?.name ? profile.name[0].toUpperCase() : '👤'}
        </div>
      </header>

      {/* Main Status Card */}
      <GlassSurface level={3} className="p-6 rounded-3xl" glow>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-bold text-slate-800">Current Status</h2>
          {riskBadge()}
        </div>

        {risk && risk.factors.length > 0 ? (
          <ul className="text-sm text-slate-600 mb-6 space-y-1">
            {risk.factors.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            {loading ? 'Loading your health data...' : 'Your vitals are stable. Remember to stay hydrated and take your scheduled supplements.'}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/40 p-4 rounded-2xl">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Heart Rate</p>
            <p className="text-2xl font-bold text-slate-800 flex items-baseline gap-1">
              {latestHR ? latestHR.value : '--'} <span className="text-sm font-medium text-slate-500">BPM</span>
            </p>
            {latestHR && (
              <p className="text-[10px] text-slate-400 mt-1">
                {new Date(latestHR.created_at).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="bg-white/40 p-4 rounded-2xl">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Blood Pressure</p>
            <p className="text-2xl font-bold text-slate-800 flex items-baseline gap-1">
              {latestBP ? latestBP.value : '--/--'} <span className="text-sm font-medium text-slate-500">mmHg</span>
            </p>
            {latestBP && (
              <p className="text-[10px] text-slate-400 mt-1">
                {new Date(latestBP.created_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </GlassSurface>

      {/* Action Modules — now functional */}
      <div className="grid grid-cols-2 gap-4">
        {actionTiles.map(tile => (
          <GlassSurface
            key={tile.path}
            level={2}
            className="p-5 rounded-3xl flex flex-col items-center text-center gap-2 cursor-pointer active:scale-[0.97] transition-transform"
            onClick={() => navigate(tile.path)}
            interactive
            hover
          >
            <div className={`w-12 h-12 rounded-2xl ${tile.color} flex items-center justify-center shadow-inner`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d={tile.icon} />
              </svg>
            </div>
            <span className="font-semibold text-slate-700 text-sm">{tile.label}</span>
            <span className="text-[10px] text-slate-400 font-medium">{tile.desc}</span>
          </GlassSurface>
        ))}
      </div>

      {/* Emergency Trigger */}
      <button
        onClick={() => navigate('/emergency')}
        className="w-full py-4 mt-4 bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-500/30 active:scale-[0.97] transition-transform flex items-center justify-center gap-3"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Emergency SOS
      </button>
    </div>
  );
}
