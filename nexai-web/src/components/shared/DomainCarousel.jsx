import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { api } from '../../lib/api';
import GlassSurface from '../ui/GlassSurface';
import Skeleton from '../ui/Skeleton';
import MotionReveal from '../ui/MotionReveal';
import { ArrowRight, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';

const DomainCard = ({ domain, index, scrollX }) => {
  // We can use scrollX to drive parallax if we want, but for a simple draggable carousel we rely on standard framer-motion drag or flex scrolling.
  
  return (
    <GlassSurface 
      level={2} 
      hover 
      className="w-72 h-80 flex-shrink-0 rounded-3xl flex flex-col overflow-hidden relative group"
    >
      {/* Image / Fallback Container */}
      <div className="h-40 w-full bg-slate-100 relative overflow-hidden border-b border-white/50">
        {domain.image ? (
          <img 
            src={domain.image} 
            alt={domain.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
            <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
            <span className="text-xs font-medium uppercase tracking-widest">No Image</span>
          </div>
        )}
        {domain.category && (
          <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider text-slate-700 uppercase shadow-sm">
            {domain.category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-tight mb-2 line-clamp-1">
          {domain.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed flex-1">
          {domain.description}
        </p>
        <div className="mt-4 flex items-center text-sm font-semibold text-[var(--accent)] group-hover:text-blue-600 transition-colors">
          Explore <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </GlassSurface>
  );
};

export default function DomainCarousel() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const data = await api.domains.getAll();
        setDomains(data || []);
      } catch (err) {
        console.error('Failed to load domains', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDomains();
  }, []);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-4 px-1">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="w-72 h-80 rounded-3xl flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (domains.length === 0) {
    return (
      <GlassSurface level={1} className="w-full p-8 rounded-3xl flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
          <ImageIcon className="w-5 h-5 text-slate-400" />
        </div>
        <h3 className="text-sm font-bold text-slate-700">No Domains Yet</h3>
        <p className="text-xs text-slate-500 mt-1">Domains will appear here once published.</p>
      </GlassSurface>
    );
  }

  return (
    <div className="w-full relative">
      <div className="flex items-center justify-between mb-5 px-1">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Featured Domains</h2>
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
        {domains.map((domain, index) => (
          <div key={domain.id} className="snap-start snap-always">
            <DomainCard domain={domain} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}
