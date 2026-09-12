import React, { useEffect, useState, useRef } from 'react';
import { api } from '../../lib/api';
import GlassSurface from '../ui/GlassSurface';
import Skeleton from '../ui/Skeleton';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';

const OrganiserCard = ({ organiser }) => {
  return (
    <GlassSurface 
      level={2} 
      hover 
      className="w-64 h-[280px] flex-shrink-0 rounded-3xl flex flex-col relative group p-6 text-center justify-center items-center"
    >
      <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-sm overflow-hidden mb-4 relative flex items-center justify-center">
        {organiser.image ? (
          <img 
            src={organiser.image} 
            alt={organiser.name} 
            className="w-full h-full object-cover" 
            loading="lazy"
          />
        ) : (
          <User className="w-10 h-10 text-slate-300" />
        )}
      </div>

      <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-tight line-clamp-1 w-full">
        {organiser.name}
      </h3>
      <p className="text-[11px] uppercase tracking-wider font-bold text-[var(--accent)] mt-1 line-clamp-1 w-full">
        {organiser.role || 'Organiser'}
      </p>
      
      {organiser.organization && (
        <p className="text-xs text-slate-500 mt-2 font-medium line-clamp-1 w-full">
          {organiser.organization}
        </p>
      )}
      
      {organiser.description && (
        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {organiser.description}
        </p>
      )}
    </GlassSurface>
  );
};

export default function OrganiserCarousel() {
  const [organisers, setOrganisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchOrganisers = async () => {
      try {
        const data = await api.organisers.getAll();
        setOrganisers(data || []);
      } catch (err) {
        console.error('Failed to load organisers', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrganisers();
  }, []);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="w-full mt-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-64 h-[280px] rounded-3xl flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (organisers.length === 0) {
    return null; // Empty state for organisers can be hidden entirely if we prefer, or show an empty box
  }

  return (
    <div className="w-full relative mt-8">
      <div className="flex items-center justify-between mb-5 px-1">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Our Organisers</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll('left')} className="w-8 h-8 rounded-full bg-white/50 border border-white/80 flex items-center justify-center text-slate-600 hover:bg-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll('right')} className="w-8 h-8 rounded-full bg-white/50 border border-white/80 flex items-center justify-center text-slate-600 hover:bg-white transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Scroll Container */}
      <div 
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {organisers.map((org) => (
          <div key={org.id} className="snap-start snap-always">
            <OrganiserCard organiser={org} />
          </div>
        ))}
      </div>
    </div>
  );
}
