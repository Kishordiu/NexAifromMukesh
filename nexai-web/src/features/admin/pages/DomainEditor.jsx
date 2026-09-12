import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import GlassSurface from '../../../components/ui/GlassSurface';
import MotionReveal from '../../../components/ui/MotionReveal';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function DomainEditor() {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: '',
    slug: '',
    status: 'draft',
    featured: false,
    display_order: 0
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      api.domains.getAll().then(all => {
        // Find specifically by ID since that's what admin routes expect for updates
        // To be safe we should actually fetch from an admin specific route or use the public one if it returns enough info.
        // Wait, public getOne is by slug. Let's just find from the admin all list for simplicity.
        api.admin.getDomains().then(domains => {
          const match = domains.find(d => d.id === id);
          if (match) {
            setFormData({
              ...match,
              featured: !!match.featured
            });
          }
          setLoading(false);
        });
      });
    }
  }, [id, isNew]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) {
        await api.admin.createDomain(formData);
      } else {
        await api.admin.updateDomain(id, formData);
      }
      navigate('/admin/domains');
    } catch (err) {
      alert('Failed to save domain.');
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
            onClick={() => navigate('/admin/domains')}
            className="w-10 h-10 flex items-center justify-center bg-white/50 hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              {isNew ? 'Create Domain' : 'Edit Domain'}
            </h1>
          </div>
        </div>
      </MotionReveal>

      <MotionReveal delay={0.1}>
        <form onSubmit={handleSubmit}>
          <GlassSurface level={2} className="p-6 rounded-3xl space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" 
                placeholder="e.g. Maternal Nutrition"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Slug</label>
              <input 
                type="text" 
                required
                value={formData.slug}
                onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" 
                placeholder="e.g. maternal-nutrition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
              <textarea 
                rows={4}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all resize-none" 
                placeholder="Detailed description of the domain..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                <input 
                  type="text" 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" 
                  placeholder="e.g. Diet"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Display Order</label>
                <input 
                  type="number" 
                  value={formData.display_order}
                  onChange={e => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
                  className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Image URL</label>
              <input 
                type="url" 
                value={formData.image}
                onChange={e => setFormData({...formData, image: e.target.value})}
                className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" 
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/50">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={formData.featured}
                  onChange={e => setFormData({...formData, featured: e.target.checked})}
                  className="w-5 h-5 rounded border-slate-300 text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span className="text-sm font-bold text-slate-700">Featured Domain</span>
              </label>

              <select
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="bg-white/50 border border-white/60 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <button 
              type="submit"
              disabled={saving}
              className="w-full mt-6 bg-[var(--accent)] text-white py-4 rounded-xl font-bold shadow-[0_8px_24px_rgba(14,165,233,0.25)] hover:bg-opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? 'Saving...' : <><Save className="w-5 h-5" /> Save Domain</>}
            </button>
          </GlassSurface>
        </form>
      </MotionReveal>
    </div>
  );
}
