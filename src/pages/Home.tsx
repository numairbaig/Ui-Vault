import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ArrowRight, Code, Shield, Users, Globe, ExternalLink, Zap, 
  Terminal, Sliders, CheckSquare, Layers, Copy, Monitor, Smartphone, Tablet,
  Search, Command, Clipboard, Heart, Eye, FolderHeart, Laptop, Gamepad2, Award, Rocket, CheckCircle
} from 'lucide-react';
import { UI_COMPONENTS_CATALOG } from '../data/components';
import { AppThemeConfig } from '../types';
import { api } from '../lib/api';
import { SafeComponentPreview } from '../components/SafeComponentPreview';

interface HomeProps {
  setPage: (page: string) => void;
  setSelectedComponentId: (id: string | null) => void;
  config: AppThemeConfig;
  currentUser?: any;
  onSelectCategory?: (category: string) => void;
}

// Sparkly rotation utility for loader Category item
function RefreshCwIcon(props: any) {
  return (
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 6, ease: "linear" }}>
      <Zap {...props} />
    </motion.div>
  );
}

export default function Home({ setPage, setSelectedComponentId, config, currentUser, onSelectCategory }: HomeProps) {
  const [searchVal, setSearchVal] = useState('');
  const [liveMetrics, setLiveMetrics] = useState({
    developers: 0,
    copyRate: 0,
    latency: 0.000,
    stars: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => {
        const dAdd = Math.random() > 0.6 ? Math.floor(Math.random() * 2) + 1 : 0;
        const cAdd = Math.floor(Math.random() * 4) + 1;
        const newLatency = prev.latency < 99.9 
          ? parseFloat((prev.latency + 8.2 + Math.random()).toFixed(3)) 
          : parseFloat(Math.min(100, Math.max(99.910, prev.latency + (Math.random() - 0.5) * 0.005)).toFixed(3));
        const sAdd = Math.random() > 0.8 ? 1 : 0;

        return {
          developers: prev.developers + dAdd,
          copyRate: prev.copyRate + cAdd,
          latency: Math.min(100, newLatency),
          stars: prev.stars + sAdd
        };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const [activePresetStyle, setActivePresetStyle] = useState<'cyber' | 'glass' | 'retro' | 'neumorphic'>('glass');
  const [likedList, setLikedList] = useState<Record<string, { count: number; active: boolean }>>({
    'glowing-neon-button': { count: 342, active: false },
    'mouse-glow-card': { count: 824, active: false },
    'cyberpunk-glitch-button': { count: 189, active: false },
    'holographic-retro-card': { count: 204, active: false },
    'orbit-pulsar-loader': { count: 147, active: false },
    'glassmorphic-modal': { count: 110, active: false },
  });

  const triggerToast = (message: string) => {
    const event = new CustomEvent('app-toast', { detail: { message, type: 'success' } });
    window.dispatchEvent(event);
  };

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedList((prev) => {
      const entry = prev[id] || { count: 42, active: false };
      const nextActive = !entry.active;
      const nextCount = nextActive ? entry.count + 1 : entry.count - 1;
      
      if (nextActive) {
        triggerToast("Added to element favorites!");
      }
      return {
        ...prev,
        [id]: { count: nextCount, active: nextActive }
      };
    });
  };

  const handleCopyTailwind = (e: React.MouseEvent, code: string, name: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    triggerToast(`Copied Tailwind markup for "${name}"!`);
  };

  const handleCopyJSX = (e: React.MouseEvent, code: string, name: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    triggerToast(`Copied React JSX code block for "${name}"!`);
  };

  const initialCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Buttons: 0,
      Cards: 0,
      Inputs: 0,
      Loaders: 0,
      Forms: 0,
      Modals: 0,
    };
    UI_COMPONENTS_CATALOG.forEach(item => {
      const cat = item.category;
      if (cat && counts[cat] !== undefined) {
        counts[cat] += 1;
      } else if (cat) {
        const matchedKey = Object.keys(counts).find(k => k.toLowerCase() === cat.toLowerCase());
        if (matchedKey) {
          counts[matchedKey] += 1;
        }
      }
    });
    return counts;
  }, []);

  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>(initialCounts);

  const categories = useMemo(() => [
    { title: 'Buttons', count: `${categoryCounts.Buttons} items`, id: 'Buttons', icon: Zap, color: 'text-cyan-400 border-cyan-400/20' },
    { title: 'Cards', count: `${categoryCounts.Cards} items`, id: 'Cards', icon: Layers, color: 'text-purple-400 border-purple-400/20' },
    { title: 'Inputs', count: `${categoryCounts.Inputs} items`, id: 'Inputs', icon: Code, color: 'text-emerald-400 border-emerald-400/20' },
    { title: 'Loaders', count: `${categoryCounts.Loaders} items`, id: 'Loaders', icon: RefreshCwIcon, color: 'text-pink-400 border-pink-400/20' },
    { title: 'Forms', count: `${categoryCounts.Forms} items`, id: 'Forms', icon: CheckSquare, color: 'text-blue-400 border-blue-400/20' },
    { title: 'Modals', count: `${categoryCounts.Modals} items`, id: 'Modals', icon: Shield, color: 'text-indigo-400 border-indigo-400/20' },
  ], [categoryCounts]);

  const queriedComponents = useMemo(() => {
    if (searchVal.trim() === '') return [];
    return UI_COMPONENTS_CATALOG.filter(c => 
      c.name.toLowerCase().includes(searchVal.toLowerCase()) ||
      c.category.toLowerCase().includes(searchVal.toLowerCase())
    ).slice(0, 5);
  }, [searchVal]);

  const uiverseElements = useMemo(() => {
    const ids = [
      'pricing-table-bento',
      'interactive-ai-sphere',
      'interactive-product-card',
      'ambient-fluid-motion',
      'orbit-pulsar-loader',
      'elastic-bento-effect',
      'biometric-scanner-auth',
      'floating-dock-nav',
      'premium-product-canvas',
      'cyberpunk-split-hero',
      'glassmorphic-modal', 
      'mouse-glow-card', 
      'holographic-retro-card'
    ];
    // Map in order of the ids list to keep our preferred sorting
    return ids
      .map(id => UI_COMPONENTS_CATALOG.find(item => item.id === id))
      .filter((item): item is typeof UI_COMPONENTS_CATALOG[number] => !!item);
  }, []);

  const [trendingAssets, setTrendingAssets] = useState<any[]>(uiverseElements);

  useEffect(() => {
    api.getComponents()
      .then((data) => {
        if (data && data.length > 0) {
          // Compute correct category counts
          const counts: Record<string, number> = {
            Buttons: 0,
            Cards: 0,
            Inputs: 0,
            Loaders: 0,
            Forms: 0,
            Modals: 0,
          };
          data.forEach(item => {
            const cat = item.category;
            if (cat && counts[cat] !== undefined) {
              counts[cat] += 1;
            } else if (cat) {
              const matchedKey = Object.keys(counts).find(k => k.toLowerCase() === cat.toLowerCase());
              if (matchedKey) {
                counts[matchedKey] += 1;
              }
            }
          });
          setCategoryCounts(counts);

          // If we have dynamic uploaded components in database, filter/display trending ones, excluding button components
          const nonButtonData = data.filter(item => {
            const cat = item.category?.toLowerCase() || '';
            return cat !== 'buttons' && cat !== 'button';
          });

          const trending = [...nonButtonData].sort((a, b) => Number(b.likes || 0) - Number(a.likes || 0));
          
          // Prepend our beautiful static pricing table card to make sure it is prominently loaded on the homepage
          const pricingBentoCard = UI_COMPONENTS_CATALOG.find(item => item.id === 'pricing-table-bento');
          const finalTrending = pricingBentoCard
            ? [pricingBentoCard, ...trending.filter(x => x.id !== 'pricing-table-bento')].slice(0, 9)
            : trending.slice(0, 9);
          
          setTrendingAssets(finalTrending);
        }
      })
      .catch((err) => {
        console.warn('Fallback to static assets:', err);
      });
  }, []);

  return (
    <div className="relative overflow-visible text-neutral-800 dark:text-neutral-200 py-6 min-h-screen text-left">
      
      {/* 1. MINIMAL HERO ZONE */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(34,211,238,0.012)_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4.5 py-1.5 bg-gradient-to-r from-violet-500/10 via-pink-500/10 to-cyan-500/10 hover:from-violet-500/15 hover:via-pink-500/15 hover:to-cyan-500/15 border border-violet-500/20 dark:border-white/10 hover:border-violet-500/30 dark:hover:border-white/20 rounded-full text-[9.5px] font-mono tracking-widest text-violet-700 dark:text-cyan-300 mb-6 uppercase font-extrabold shadow-[0_0_15px_rgba(139,92,246,0.08)] dark:shadow-[0_0_20px_rgba(56,189,248,0.05)] hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] transition-all duration-300 cursor-pointer select-none group"
        >
          <span className="bg-gradient-to-r from-violet-700 via-pink-600 to-cyan-700 dark:from-white dark:via-neutral-100 dark:to-cyan-200 bg-clip-text text-transparent">
            100% Free Open Source Components
          </span>
        </motion.div>

        {/* Large Bold Displays */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight leading-none text-slate-900 dark:text-white justify-center max-w-5xl mx-auto italic select-none">
          Beautiful motion. <span className="text-gradient bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent font-sans not-italic font-black">Zero restriction.</span>
        </h1>
        
        <p className="max-w-xl mx-auto mt-6 text-xs sm:text-sm text-slate-500 dark:text-neutral-400 leading-relaxed italic">
          Discover, customize, and copy responsive custom buttons, glass cards, and smooth loaders built using Tailwind CSS and Framer Motion. Completely free forever.
        </p>

        {/* 2. MINIMAL SEARCH INPUT */}
        <div className="max-w-2xl mx-auto mt-10 relative z-20">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 blur-lg opacity-20 group-hover:opacity-35 transition duration-300" />
            
            <div className="relative flex items-center bg-white dark:bg-[#090909] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl p-1">
              <Search className="w-5 h-5 text-slate-400 dark:text-neutral-550 ml-4 shrink-0" />
              <input
                type="text"
                placeholder="Search buttons, cards, load circles, inputs..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full bg-transparent px-3 py-3 font-sans text-sm text-slate-950 dark:text-white outline-none placeholder-slate-400 dark:placeholder-zinc-600"
              />
              <button
                onClick={() => setPage('components')}
                className="px-5 py-2.5 bg-slate-950 hover:bg-neutral-900 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <span>Browse Code</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>
          </div>

          {/* Search popover */}
          <AnimatePresence>
            {queriedComponents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 right-0 mt-3 p-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 text-left"
              >
                <div className="text-[8px] font-mono tracking-widest text-[#a855f7] px-3.5 py-1 uppercase font-bold">MATCHING CATALOG PIECES</div>
                <div className="flex flex-col gap-1 mt-1">
                  {queriedComponents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedComponentId(item.id);
                        setPage('components');
                        setSearchVal('');
                      }}
                      className="w-full text-left py-2 px-3.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-between text-xs transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-cyan-400 font-bold">✓</span>
                        <span className="font-extrabold text-slate-900 dark:text-white">{item.name}</span>
                      </div>
                      <span className="text-[9px] text-zinc-500 uppercase font-mono">{item.category}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>


      </section>

      {/* 3. RESPONSIVE CATEGORIES FLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-4">
        <div className="bg-slate-50/50 dark:bg-neutral-950/40 p-4.5 rounded-2xl border border-slate-200/50 dark:border-white/5">
          <div className="flex justify-between items-center px-1 mb-4">
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase font-bold">Categorized UI Elements</span>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase cursor-pointer hover:underline" onClick={() => setPage('components')}>View Catalog &rarr;</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    if (onSelectCategory) {
                      onSelectCategory(cat.id);
                    }
                    setSelectedComponentId(null);
                    setPage('components');
                  }}
                  className="bg-white dark:bg-black rounded-xl p-4 border border-slate-200/50 dark:border-white/5 cursor-pointer text-left hover:scale-[1.03] hover:border-cyan-500/25 transition-all duration-200 group flex flex-col justify-between h-24 shadow-sm"
                >
                  <div className={`w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 border flex items-center justify-center shrink-0 ${cat.color}`}>
                    <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:rotate-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-none mt-2.5 truncate">{cat.title}</h4>
                    <span className="text-[9px] font-mono text-slate-450 dark:text-neutral-500 block mt-1 leading-none">{cat.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HIGH-DENSITY CARD GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="flex justify-between items-end border-b border-slate-200/20 dark:border-white/5 pb-4 mb-8">
          <div className="text-left">
            <span className="text-[10px] font-mono tracking-widest text-[#a855f7] uppercase font-bold flex items-center gap-1.5 leading-none">
              <Zap className="w-3.5 h-3.5 text-cyan-500" /> DYNAMIC INTERACTIVE SPECIMENS
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white mt-1 italic">
              Trending <span className="text-neutral-450 dark:text-neutral-600">Assets.</span>
            </h2>
          </div>
          <span className="text-[9px] text-[#10b981] font-mono font-bold uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded leading-none">100% Free Catalog</span>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendingAssets.map((item, index) => {
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => {
                  setSelectedComponentId(item.id);
                  setPage('components');
                  window.scrollTo(0, 0);
                }}
                className="bg-white dark:bg-black border border-slate-200/50 dark:border-white/5 rounded-2xl p-8 h-[366px] min-h-[366px] flex items-center justify-center relative overflow-hidden transition-all duration-300 cursor-pointer hover:border-cyan-500/40 dark:hover:border-cyan-500/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgba(6,182,212,0.15)] group"
              >
                {/* Subtle visual glow in corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-full blur-2xl pointer-events-none transition-opacity opacity-0 group-hover:opacity-100 duration-500" />
                
                {/* Interactive Stage or Sandboxed Component */}
                <div className="w-full flex justify-center items-center overflow-visible select-none pointer-events-none">
                  <SafeComponentPreview item={item} height="280px" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Browse More Button */}
        <div className="flex justify-center mt-12 pb-2">
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setPage('components');
              window.scrollTo(0, 0);
            }}
            className="group px-7 py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black rounded-full font-bold text-xs flex items-center gap-2 shadow-lg hover:shadow-cyan-500/15 cursor-pointer transition-all duration-300"
          >
            <span>Browse More Components</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 shrink-0 text-cyan-400 dark:text-cyan-600" />
          </motion.button>
        </div>
      </section>

      {/* 5. INTERACTIVE COGNITIVE DEMO */}
      <section className="bg-slate-50/50 dark:bg-neutral-900/20 border-y border-slate-200/50 dark:border-white/5 py-14 my-10 relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/[0.012] blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/[0.012] blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            {/* LHS calibration selector */}
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#10b981] uppercase font-bold">INTERACTIVE SPECIFICATION DEMO</span>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white mt-1 leading-tight italic">
                Aesthetics Preset <span className="text-neutral-450 dark:text-neutral-600">Calibration.</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-4 leading-relaxed max-w-lg">
                Click any of the responsive aesthetic configurations below to instantly calibrate how motion and shadows map inside our modular sandbox systems.
              </p>

              <div className="grid grid-cols-2 gap-3.5 mt-8 max-w-md">
                {[
                  { id: 'cyber', label: 'Neon Cyberpunk', desc: 'Outlines & neon grids' },
                  { id: 'glass', label: 'Glassmorphism Blur', desc: 'iOS backdrop locks' },
                  { id: 'retro', label: 'Phosphor terminal', desc: 'Mainframe retro pixels' },
                  { id: 'neumorphic', label: 'Neumorphism layout', desc: 'Debossed shadows' },
                ].map((spec) => {
                  const isS = activePresetStyle === spec.id;
                  return (
                    <button
                      key={spec.id}
                      onClick={() => {
                        setActivePresetStyle(spec.id as any);
                        triggerToast(`Switched workspace sandbox view: ${spec.label}`);
                      }}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        isS 
                          ? 'bg-slate-950 text-white dark:bg-white dark:text-black border-transparent shadow-lg scale-[1.02]' 
                          : 'bg-white dark:bg-black border-slate-200/50 dark:border-white/5 text-slate-550 dark:text-zinc-400 hover:border-slate-350 dark:hover:border-white/10'
                      }`}
                    >
                      <h4 className="text-xs font-bold">{spec.label}</h4>
                      <span className="text-[9px] block mt-1 opacity-60 leading-none">{spec.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RHS dynamic interactive preview panel (pure graphics instead of texting) */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-black p-1 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 shadow-2xl h-80 flex items-center justify-center overflow-hidden">
                
                {activePresetStyle === 'cyber' && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative w-[90%] p-6 bg-black border-2 border-cyan-500 font-mono text-cyan-400 text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  >
                    <span className="absolute inset-0 border border-dashed border-cyan-500/10 pointer-events-none" />
                    <span className="absolute top-1.5 right-2 text-[7px] text-pink-500">HAZARD_STABLE</span>
                    <h3 className="font-extrabold text-white text-xs">CYBERPUNK MATRIX ACTIVE</h3>
                    <p className="text-[9px] mt-2 text-zinc-500">Speed multiplier index: 4.8 GHz</p>
                    <div className="mt-4 px-4 py-1.5 border border-cyan-500 bg-cyan-500/10 hover:bg-cyan-500/20 transition text-center uppercase font-bold cursor-pointer text-[9px]">
                      Trigger Vector Signal
                    </div>
                  </motion.div>
                )}

                {activePresetStyle === 'glass' && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative w-[90%] p-6 rounded-2xl bg-white/20 dark:bg-white/[0.04] border border-white/20 backdrop-blur-xl shadow-2xl"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 blur-xl rounded-full" />
                    <h3 className="text-slate-900 dark:text-white font-extrabold text-xs">Glassmorphic Overlay</h3>
                    <p className="text-[10px] text-slate-500 dark:text-neutral-400 mt-2 leading-relaxed">Soft opacity borders with high density iOS backdrop blurs.</p>
                    <div className="mt-4 py-2 bg-gradient-to-r from-violet-600 to-pink-500 hover:opacity-90 rounded-xl text-white text-[10px] font-bold text-center cursor-pointer shadow-md">
                      Configure Backdrop
                    </div>
                  </motion.div>
                )}

                {activePresetStyle === 'retro' && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative w-[90%] p-5 bg-[#030905] border border-emerald-500 rounded text-left font-mono text-emerald-400 text-[10px]"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.01)_1px,transparent_1px)] bg-[size:8px_8px] pointer-events-none" />
                    <span className="block border-b border-emerald-505/20 pb-1.5 mb-2 font-bold text-[#10b981]">SYSTEM_CONSOLE_MAIN</span>
                    <pre className="text-[9px] text-emerald-500/70">&gt; MOUNT COMPILING...\n&gt; CODE DISPATCH COMPLETE ✓</pre>
                    <div className="mt-3 py-1 border border-emerald-500 hover:bg-emerald-500/10 text-center font-bold uppercase text-[9px] cursor-pointer">
                      Run core sandbox
                    </div>
                  </motion.div>
                )}

                {activePresetStyle === 'neumorphic' && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative w-[85%] p-6 rounded-2xl bg-slate-50 dark:bg-[#151515] shadow-[inset_-3px_-3px_8px_rgba(255,255,255,0.02),_3px_3px_8px_rgba(0,0,0,0.4)] border border-slate-200/5 text-center"
                  >
                    <h3 className="font-bold text-slate-805 dark:text-white text-xs">Extruded Soft Shadow</h3>
                    <p className="text-[10px] text-slate-450 dark:text-neutral-500 mt-1.5">Simulated physical press curves.</p>
                    <div className="mt-4 py-2 rounded-xl bg-slate-50 dark:bg-[#151515] shadow-[-2px_-2px_6px_rgba(255,255,255,0.02),_2px_2px_6px_rgba(0,0,0,0.5)] hover:shadow-inner text-[10px] font-bold text-center cursor-pointer">
                      Click deboss trigger
                    </div>
                  </motion.div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. SPACIOUS BENTO GRID - ECOSYSTEM INTEGRITY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-slate-50/50 dark:bg-neutral-900/40 p-6 sm:p-8 rounded-2xl border border-slate-200/50 dark:border-white/5 flex flex-col justify-between h-64 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:12px_12px] opacity-10 pointer-events-none" />
            
            <div className="relative z-10 text-left">
              <span className="text-[9px] font-mono tracking-widest text-cyan-500 font-bold uppercase">INTERACTIVE VIEWPORTS</span>
              <h3 className="text-xl font-display font-extrabold text-slate-900 dark:text-white mt-1.5 italic leading-none">Inspect Live Sandboxes</h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-3.5 leading-relaxed font-sans shadow-none">
                Explore premium buttons, modals, and charts with clean, reactive desktop, tablet, and mobile simulator preview wrappers.
              </p>
            </div>
            <button
              onClick={() => {
                setPage('components');
                window.scrollTo(0, 0);
              }}
              className="px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-neutral-900 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1.5 w-max relative z-10 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" /> Browse Component Catalogues
            </button>
          </div>

          <div className="bg-slate-50/50 dark:bg-neutral-900/40 p-6 sm:p-8 rounded-2xl border border-slate-200/50 dark:border-white/5 flex flex-col justify-between h-64 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:12px_12px] opacity-10 pointer-events-none" />
            
            <div className="relative z-10 text-left">
              <span className="text-[9px] font-mono tracking-widest text-[#a855f7] font-bold uppercase">GENERAL PUBLIC GENERAL ACCESSIBILITY</span>
              <h3 className="text-xl font-display font-extrabold text-slate-900 dark:text-white mt-1.5 italic leading-none">100% Free Open Source</h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-3.5 leading-relaxed font-sans shadow-none">
                No fee levels, locks or restricted accounts. Copy and paste every premium model with zero restrictions or payment gateways.
              </p>
            </div>
            <button
              onClick={() => setPage('pricing')}
              className="px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-neutral-900 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1.5 w-max relative z-10 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Award className="w-4 h-4 text-yellow-500 animate-bounce" /> Learn Open Source Specifications
            </button>
          </div>

        </div>
      </section>

      {/* 7. JOIN COMMUNITY CALL-TO-ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="relative overflow-hidden bg-slate-50 dark:bg-zinc-950/40 border border-slate-200/50 dark:border-white/5 rounded-3xl p-8 md:p-14 shadow-sm dark:shadow-2xl">
          {/* Subtle gradient pattern background */}
          <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] dark:opacity-[0.07] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <span className="text-[10px] font-mono tracking-[0.2em] text-cyan-500 dark:text-cyan-400 font-bold uppercase mb-4">
              CREATOR HUB
            </span>
            
            {currentUser ? (
              <>
                <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-500 font-black">@{currentUser.username}</span>
                </h2>
                <p className="text-sm text-slate-600 dark:text-zinc-400 mt-4 leading-relaxed max-w-lg">
                  You are part of our authenticated developer community. Start uploading your customized Tailwind elements and vector components directly into our shared open collection.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setPage('upload');
                      window.scrollTo(0, 0);
                    }}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all duration-200"
                  >
                    <span>Deploy Custom Code</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setPage('components');
                      window.scrollTo(0, 0);
                    }}
                    className="px-6 py-3 bg-white hover:bg-slate-50 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/80 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-white/10 font-bold text-xs rounded-xl cursor-pointer transition-all duration-200"
                  >
                    <span>Browse All Components</span>
                  </motion.button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Join our creative front-end community
                </h2>
                <p className="text-sm text-slate-600 dark:text-zinc-400 mt-4 leading-relaxed max-w-lg">
                  Share your custom-built Tailwind Blueprints. Contribute to the public catalog, save your favorite combinations, and showcase your designs with developers around the world.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                       setPage('auth');
                       window.scrollTo(0, 0);
                    }}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all duration-200"
                  >
                    <span>Create Creator Account</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setPage('auth');
                      window.scrollTo(0, 0);
                    }}
                    className="px-6 py-3 bg-white hover:bg-slate-50 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/80 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-white/10 font-bold text-xs rounded-xl cursor-pointer transition-all duration-200"
                  >
                    <span>Existing User Log In</span>
                  </motion.button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>


    </div>
  );
}
