import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../lib/api';
import { evaluateRisk } from '../../../lib/riskEngine';
import GlassSurface from '../../../components/ui/GlassSurface';
import { Badge } from '../../../components/ui/Badge';
import Skeleton from '../../../components/ui/Skeleton';
import MotionReveal from '../../../components/ui/MotionReveal';
import DomainCarousel from '../../../components/shared/DomainCarousel';
import OrganiserCarousel from '../../../components/shared/OrganiserCarousel';
import { Activity, Beaker, Eye, AlertCircle, Phone } from 'lucide-react';

export default function PatientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prof = await api.patient.getProfile().catch(e => {
          if (e.status === 404) return null;
          throw e;
        });
        const meas = await api.patient.getMeasurements().catch(() => []);
        
        setProfile(prof);
        setMeasurements(meas || []);
        
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

  const getLatest = (type) => measurements.find(m => m.type === type);
  const latestHR = getLatest('heart_rate');
  const latestBP = getLatest('blood_pressure');

  const riskBadge = () => {
    if (!risk) return <Badge variant="info">ANALYZING</Badge>;
    const map = {
      LOW: { variant: 'success', label: 'STABLE' },
      MODERATE: { variant: 'warning', label: 'ELEVATED' },
      HIGH: { variant: 'warning', label: 'HIGH RISK' },
      CRITICAL: { variant: 'error', label: 'CRITICAL' }
    };
    const r = map[risk.level] || map.LOW;
    return <Badge variant={r.variant} pulse={risk.level === 'CRITICAL'}>{r.label}</Badge>;
  };

  const actionTiles = [
    { label: 'Vitals Scan', desc: 'Contactless Analysis', path: '/scan', color: 'text-sky-500 bg-sky-500/10', icon: Activity },
    { label: 'Lab OCR', desc: 'Document Import', path: '/ocr', color: 'text-violet-500 bg-violet-500/10', icon: Beaker },
    { label: 'Anemia Check', desc: 'Vision Analysis', path: '/scan/anemia', color: 'text-rose-500 bg-rose-500/10', icon: Eye },
    { label: 'Sclera Scan', desc: 'Jaundice Screen', path: '/scan/sclera', color: 'text-amber-500 bg-amber-500/10', icon: AlertCircle },
  ];

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      <MotionReveal delay={0}>
        <header className="flex justify-between items-center mb-8 pt-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              {loading ? <Skeleton className="h-9 w-48" /> : `Hello, ${profile?.name?.split(' ')[0] || 'User'}`}
            </h1>
            <div className="text-sm text-slate-500 font-medium mt-1">
              {loading ? <Skeleton className="h-5 w-32 mt-1" /> : (profile?.pregnancy_week ? `Week ${profile.pregnancy_week}` : 'Welcome to DiuMed')}
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] font-bold border-2 border-white/60 shadow-sm">
            {loading ? <Skeleton className="w-full h-full rounded-full" /> : (profile?.name ? profile.name[0].toUpperCase() : 'U')}
          </div>
        </header>
      </MotionReveal>

      <MotionReveal delay={0.1}>
        <GlassSurface level={3} className="p-6 rounded-3xl" glow>
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Current Status</h2>
            {loading ? <Skeleton className="h-6 w-20 rounded-full" /> : riskBadge()}
          </div>

          {loading ? (
            <div className="space-y-2 mb-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : (
            risk && risk.factors.length > 0 ? (
              <ul className="text-sm text-slate-600 mb-6 space-y-2">
                {risk.factors.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <span className="leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Your vitals are stable. Remember to stay hydrated and take your scheduled supplements.
              </p>
            )
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/40 p-5 rounded-2xl border border-white/40">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Heart Rate</p>
              {loading ? (
                <Skeleton className="h-8 w-24 mb-1" />
              ) : (
                <p className="text-3xl font-bold text-slate-800 flex items-baseline gap-1 tracking-tight">
                  {latestHR ? latestHR.value : '--'} <span className="text-sm font-medium text-slate-500 tracking-normal">BPM</span>
                </p>
              )}
            </div>
            <div className="bg-white/40 p-5 rounded-2xl border border-white/40">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Blood Pressure</p>
              {loading ? (
                <Skeleton className="h-8 w-24 mb-1" />
              ) : (
                <p className="text-3xl font-bold text-slate-800 flex items-baseline gap-1 tracking-tight">
                  {latestBP ? latestBP.value : '--/--'} <span className="text-sm font-medium text-slate-500 tracking-normal">mmHg</span>
                </p>
              )}
            </div>
          </div>
        </GlassSurface>
      </MotionReveal>

      <MotionReveal delay={0.2}>
        <div className="grid grid-cols-2 gap-4">
          {actionTiles.map((tile, i) => {
            const Icon = tile.icon;
            return (
              <GlassSurface
                key={tile.path}
                level={2}
                className="p-5 rounded-3xl flex flex-col items-center text-center gap-3 cursor-pointer group"
                onClick={() => navigate(tile.path)}
                interactive
                hover
              >
                <div className={`w-14 h-14 rounded-2xl ${tile.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 ease-out`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 text-sm tracking-tight">{tile.label}</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">{tile.desc}</div>
                </div>
              </GlassSurface>
            );
          })}
        </div>
      </MotionReveal>

      <MotionReveal delay={0.4}>
        <DomainCarousel />
      </MotionReveal>
      
      <MotionReveal delay={0.5}>
        <OrganiserCarousel />
      </MotionReveal>

      <MotionReveal delay={0.6}>
        <button
          onClick={() => navigate('/emergency')}
          className="w-full py-5 mt-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl shadow-[0_8px_32px_rgba(239,68,68,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          <Phone className="w-5 h-5 fill-current" />
          <span className="tracking-wide">EMERGENCY SOS</span>
        </button>
      </MotionReveal>
    </div>
  );
}
