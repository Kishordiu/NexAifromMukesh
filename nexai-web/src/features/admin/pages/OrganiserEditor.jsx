import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import GlassSurface from '../../../components/ui/GlassSurface';
import MotionReveal from '../../../components/ui/MotionReveal';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function OrganiserEditor() {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    organization: '',
    description: '',
    image: '',
    contact_details: '',
    status: 'active',
    display_order: 0
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      api.admin.getOrganisers().then(organisers => {
        const match = organisers.find(o => o.id === id);
        if (match) setFormData(match);
        setLoading(false);
      });
    }
  }, [id, isNew]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) {
        await api.admin.createOrganiser(formData);
      } else {
        await api.admin.updateOrganiser(id, formData);
      }
      navigate('/admin/organisers');
    } catch (err) {
      alert('Failed to save organiser.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading editor...</div>;

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      <MotionReveal delay={0}>
        <div className="flex items-center gap-4 mb-4 pt-4">
          <button 
            onClick={() => navigate('/admin/organisers')}
            className="w-10 h-10 flex items-center justify-center bg-white/50 hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              {isNew ? 'Create Organiser' : 'Edit Organiser'}
            </h1>
          </div>
        </div>
      </MotionReveal>

      <MotionReveal delay={0.1}>
        <form onSubmit={handleSubmit}>
          <GlassSurface level={2} className="p-6 rounded-3xl space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" 
                placeholder="e.g. Dr. Jane Doe"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Role</label>
                <input 
                  type="text" 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" 
                  placeholder="e.g. Lead Researcher"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Organization</label>
                <input 
                  type="text" 
                  value={formData.organization}
                  onChange={e => setFormData({...formData, organization: e.target.value})}
                  className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" 
                  placeholder="e.g. DiuMed Labs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description / Bio</label>
              <textarea 
                rows={4}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all resize-none" 
                placeholder="Short biography or responsibilities..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Image URL</label>
              <input 
                type="url" 
                value={formData.image}
                onChange={e => setFormData({...formData, image: e.target.value})}
                className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" 
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Display Order</label>
                <input 
                  type="number" 
                  value={formData.display_order}
                  onChange={e => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
                  className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              disabled={saving}
              className="w-full mt-6 bg-[var(--accent)] text-white py-4 rounded-xl font-bold shadow-[0_8px_24px_rgba(14,165,233,0.25)] hover:bg-opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? 'Saving...' : <><Save className="w-5 h-5" /> Save Organiser</>}
            </button>
          </GlassSurface>
        </form>
      </MotionReveal>
    </div>
  );
}
