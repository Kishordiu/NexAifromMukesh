import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import GlassSurface from '../../../components/ui/GlassSurface';
import Skeleton from '../../../components/ui/Skeleton';
import MotionReveal from '../../../components/ui/MotionReveal';
import { Users, Layers, Shield, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [domains, organisers] = await Promise.all([
          api.admin.getDomains(),
          api.admin.getOrganisers()
        ]);
        
        setStats({
          domains: domains.length,
          organisers: organisers.length,
          activeDomains: domains.filter(d => d.status === 'published').length
        });
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Domains', value: stats?.domains, icon: Layers, color: 'text-sky-500 bg-sky-500/10' },
    { label: 'Published Domains', value: stats?.activeDomains, icon: ImageIcon, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Organisers', value: stats?.organisers, icon: Users, color: 'text-violet-500 bg-violet-500/10' },
  ];

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto">
      <MotionReveal delay={0}>
        <header className="flex items-center gap-3 mb-8 pt-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Admin Console</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">DiuMed System Management</p>
          </div>
        </header>
      </MotionReveal>

      <MotionReveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statCards.map((stat, i) => (
            <GlassSurface key={i} level={2} className="p-6 rounded-3xl flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
                {loading ? (
                  <Skeleton className="w-12 h-8 mt-1" />
                ) : (
                  <p className="text-3xl font-bold text-slate-800 tracking-tight">
                    {stat.value ?? 0}
                  </p>
                )}
              </div>
            </GlassSurface>
          ))}
        </div>
      </MotionReveal>

      <MotionReveal delay={0.2}>
        <h2 className="text-xl font-bold text-slate-800 mb-4 tracking-tight">Management Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassSurface 
            level={2} 
            interactive hover 
            onClick={() => navigate('/admin/domains')}
            className="p-6 rounded-3xl flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-800 tracking-tight">Manage Domains</h3>
                <p className="text-xs text-slate-500 mt-0.5">Create, edit, and organize healthcare domains</p>
              </div>
            </div>
          </GlassSurface>

          <GlassSurface 
            level={2} 
            interactive hover 
            onClick={() => navigate('/admin/organisers')}
            className="p-6 rounded-3xl flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-800 tracking-tight">Manage Organisers</h3>
                <p className="text-xs text-slate-500 mt-0.5">Add and update hackathon and event organisers</p>
              </div>
            </div>
          </GlassSurface>
        </div>
      </MotionReveal>
    </div>
  );
}
