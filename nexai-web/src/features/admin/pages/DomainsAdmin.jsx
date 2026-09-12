import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import GlassSurface from '../../../components/ui/GlassSurface';
import MotionReveal from '../../../components/ui/MotionReveal';
import Skeleton from '../../../components/ui/Skeleton';
import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DomainsAdmin() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDomains = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getDomains();
      setDomains(data || []);
    } catch (err) {
      console.error('Failed to load domains', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this domain?')) return;
    try {
      await api.admin.deleteDomain(id);
      setDomains(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      alert('Failed to delete domain.');
    }
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <MotionReveal delay={0}>
        <div className="flex items-center gap-4 mb-4 pt-4">
          <button 
            onClick={() => navigate('/admin')}
            className="w-10 h-10 flex items-center justify-center bg-white/50 hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manage Domains</h1>
          </div>
          <button 
            onClick={() => navigate('/admin/domains/new')}
            className="ml-auto bg-[var(--accent)] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-opacity-90 transition-opacity flex items-center gap-2 shadow-[0_4px_14px_rgba(14,165,233,0.3)]"
          >
            <Plus className="w-4 h-4" /> New Domain
          </button>
        </div>
      </MotionReveal>

      <MotionReveal delay={0.1}>
        <GlassSurface level={2} className="rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/40 bg-white/30 text-xs uppercase tracking-wider text-slate-500">
                  <th className="p-4 font-bold">Image</th>
                  <th className="p-4 font-bold">Title</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Featured</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40 bg-white/10">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      <td className="p-4"><Skeleton className="w-12 h-12 rounded-xl" /></td>
                      <td className="p-4"><Skeleton className="h-5 w-32 mb-1" /><Skeleton className="h-3 w-48" /></td>
                      <td className="p-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                      <td className="p-4"><Skeleton className="h-5 w-10" /></td>
                      <td className="p-4 text-right"><Skeleton className="h-8 w-16 ml-auto" /></td>
                    </tr>
                  ))
                ) : domains.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">
                      No domains found. Create your first domain to get started.
                    </td>
                  </tr>
                ) : (
                  domains.map((domain) => (
                    <tr key={domain.id} className="hover:bg-white/30 transition-colors">
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-200 overflow-hidden flex items-center justify-center">
                          {domain.image ? (
                            <img src={domain.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs text-slate-400">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{domain.title}</div>
                        <div className="text-xs text-slate-500 line-clamp-1 max-w-xs">{domain.slug}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full ${domain.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                          {domain.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-medium text-slate-600">
                        {domain.featured ? 'Yes' : 'No'}
                      </td>
                      <td className="p-4 flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/admin/domains/${domain.id}`)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/50 text-slate-600 hover:text-[var(--accent)] transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(domain.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/50 text-slate-600 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassSurface>
      </MotionReveal>
    </div>
  );
}
