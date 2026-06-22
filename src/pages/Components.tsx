import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, ListFilter, Trash2, Eye, Download, Heart, Bookmark, Code, User, Compass, Filter, Clock, Sparkles
} from 'lucide-react';
import { api, UIComponent } from '../lib/api';
import { SafeComponentPreview } from '../components/SafeComponentPreview';

interface ComponentsProps {
  setPage: (page: string) => void;
  setSelectedComponentId: (id: string | null) => void;
  selectedComponentId: string | null;
  onTriggerToast: (msg: string, type: 'success' | 'info' | 'error') => void;
  currentUser: any;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}



export default function Components({ 
  setPage, 
  setSelectedComponentId, 
  selectedComponentId, 
  onTriggerToast, 
  currentUser,
  selectedCategory,
  setSelectedCategory
}: ComponentsProps) {
  const [components, setComponents] = useState<UIComponent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusTag, setFocusTag] = useState<string>('All');
  const [activeSort, setActiveSort] = useState<string>('trending');
  const [isLoading, setIsLoading] = useState(false);

  const CATEGORIES_LIST = [
    'All',
    'Buttons',
    'Cards',
    'Inputs',
    'Forms',
    'Loaders',
    'Toggles',
    'Checkboxes',
    'Pricing tables',
    'Hero sections',
    'Dashboards',
    'Testimonials',
    'Footers',
    'Authentication UI',
    'Ecommerce UI',
  ];

  const fetchComponents = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        sort: activeSort,
      };
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (focusTag !== 'All') params.tag = focusTag;
      if (searchQuery.trim() !== '') params.search = searchQuery;

      const data = await api.getComponents(params);
      setComponents(data);
    } catch {
      onTriggerToast('Failed to pull components archive', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, [selectedCategory, focusTag, activeSort]);

  // Handle instant search trigger on Enter key Or manual click
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchComponents();
  };

  const handleLikeToggle = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!currentUser) {
      onTriggerToast('Identification verified lock. Please log in first to like components!', 'info');
      return;
    }
    try {
      const response = await api.toggleLike(id);
      if (response.liked) {
        onTriggerToast('Added component to your likes list!', 'success');
      } else {
        onTriggerToast('Revoked component like.', 'info');
      }
      fetchComponents();
    } catch {
      onTriggerToast('Failed to toggled component like.', 'error');
    }
  };

  const handleFavoriteToggle = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!currentUser) {
      onTriggerToast('Login required to save components into collections!', 'info');
      return;
    }
    try {
      const response = await api.toggleFavorite(id);
      onTriggerToast(response.message, 'success');
      fetchComponents();
    } catch {
      onTriggerToast('Action failed', 'error');
    }
  };

  const borderColors = [
    'hover:border-cyan-500/40',
    'hover:border-purple-500/40',
    'hover:border-pink-500/40',
    'hover:border-emerald-500/40'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-neutral-800 dark:text-neutral-200 text-left">
      
      {/* 1. Header Hero Panel */}
      <div className="border-b border-slate-200/20 dark:border-white/5 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-cyan-500 uppercase font-semibold flex items-center gap-1.5 mb-1.5">
            <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            DISTRIBUTED CODE REPOSITORY
          </span>
          <h1 className="text-4xl font-display font-extrabold leading-none text-slate-900 dark:text-white italic">
            Interactive <span className="text-neutral-500 dark:text-neutral-400">Universe.</span>
          </h1>
        </div>
        <div className="max-w-sm border-l-2 border-cyan-500 pl-4 py-1">
          <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed font-sans italic">
            Discover beautifully dynamic and validated HTML, CSS, JavaScript, React, and Tailwind components built by creators.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* 2. CATEGORY SELECTION SIDEBAR */}
        <aside className="lg:col-span-1 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-200/20 dark:border-white/5 pb-2">
            <span className="text-[10px] font-mono tracking-widest text-[#a855f7] font-bold uppercase flex items-center gap-1.5">
              <ListFilter className="w-4 h-4 text-cyan-500" /> CATEGORIES
            </span>
            {(selectedCategory !== 'All' || searchQuery !== '' || focusTag !== 'All') && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setFocusTag('All');
                  setActiveSort('trending');
                  onTriggerToast('Reset categories and browsing configurations.', 'info');
                }}
                className="text-[9px] font-mono text-red-500 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          <div className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-y-auto max-h-[360px] pb-3 lg:pb-0 pr-1">
            {CATEGORIES_LIST.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    window.scrollTo(0, 0);
                  }}
                  className={`py-1.5 px-3 rounded-lg text-xs tracking-wide transition-colors cursor-pointer text-left shrink-0 sm:shrink ${
                    active 
                      ? 'bg-slate-100 dark:bg-white/5 border border-slate-200/30 dark:border-white/10 text-slate-950 dark:text-white font-bold' 
                      : 'hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-neutral-400'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-200/20 dark:border-white/5 pt-4 hidden lg:block text-left">
            <h4 className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest mb-2.5">🛡️ Zero License Fees</h4>
            <p className="text-[10.5px] leading-relaxed text-slate-500 dark:text-neutral-500">
              There are <strong className="text-slate-800 dark:text-white">no paid "Pro" features</strong> on this platform. Access all newly created components for your projects directly and completely free of charge.
            </p>
          </div>
        </aside>

        {/* 3. CATALOG COMPONENTS RESULTS BOX (3 spans) */}
        <main className="lg:col-span-3 flex flex-col gap-6">
          
          {/* SEARCH AND FILTERS TOOLBAR */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-slate-50/50 dark:bg-neutral-900/10 p-4 rounded-2xl border border-slate-200/40 dark:border-white/5 shadow-sm">
            
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-xs text-xs">
              <input
                type="text"
                placeholder="Search by name, tag, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-slate-950 dark:text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-500"
              />
              <button type="submit" className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-200">
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto">
              {/* SORT SPEC SELECTORS BASED ON USER INPUTS */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
                <Clock className="w-3.5 h-3.5 text-cyan-500" />
                <span className="text-[10px] uppercase font-bold tracking-wider mr-1">Sort:</span>
                <select
                  value={activeSort}
                  onChange={(e) => setActiveSort(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white cursor-pointer focus:outline-none"
                >
                  <option value="trending">Trending 🔥</option>
                  <option value="popular">Most Liked ❤️</option>
                  <option value="downloaded">Most Downloaded 📥</option>
                  <option value="views">Most Viewed 👁️</option>
                  <option value="newest">Newest Arrived ⏳</option>
                </select>
              </div>

              {/* TAGS FILTERS */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-1 rounded hidden sm:flex items-center gap-1">
                  🛡️ 100% License-Free
                </span>
                <div className="flex items-center bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 p-1 rounded-lg gap-1 text-[10px]">
                  {['All', 'New', 'Popular'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setFocusTag(tag)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                        focusTag === tag 
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-black font-extrabold shadow' 
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center px-1 text-slate-500 text-[10px] font-mono leading-none">
            <span>SHOWING: <strong className="text-cyan-500">{components.length}</strong> GRAPHICAL INTERSECTIONS</span>
            <span>CRITERIA: {selectedCategory.toUpperCase()} / {focusTag.toUpperCase()}</span>
          </div>

          {isLoading ? (
            <div className="py-24 text-center text-slate-500 font-mono text-xs animate-pulse">
              🛸 [Synchronizing vector graphics cards from Express layer]...
            </div>
          ) : components.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-slate-200/20 dark:border-white/5 rounded-3xl flex flex-col items-center justify-center gap-2">
              <Compass className="w-10 h-10 text-slate-405 animate-spin mb-2 text-purple-400" />
              <h3 className="font-display font-semibold text-sm text-slate-800 dark:text-slate-200">No Vector Cards Found</h3>
              <p className="text-xs text-slate-500 max-w-[280px]">
                No live items matched your requested configuration. Clear the filters to restore alignment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
              {components.map((item, index) => {
                const hoverBorder = borderColors[index % borderColors.length];
                const authorLiked = currentUser ? item.likes?.includes(currentUser.id) : false;
                const authorSaved = currentUser ? currentUser.savedComponents?.includes(item.id) : false;

                return (
                  <motion.div
                    key={item.id}
                    layoutId={`card_${item.id}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className={`bg-slate-50/50 dark:bg-neutral-900/35 border border-slate-200/50 dark:border-white/5 rounded-3xl p-1.5 flex flex-col justify-between transition-all group ${hoverBorder}`}
                  >
                    {/* Graphical Preview Window */}
                    <div 
                      onClick={() => {
                        setSelectedComponentId(item.id);
                        setPage('components');
                      }}
                      className="bg-white dark:bg-black rounded-2xl p-4 flex flex-col min-h-[200px] relative overflow-hidden cursor-pointer"
                    >
                      <div className="absolute top-3 left-3 bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 px-2 py-0.5 rounded text-[8px] font-mono text-purple-500 dark:text-purple-400 font-bold uppercase tracking-widest z-10">
                        {item.category}
                      </div>

                      {/* LIVE IFRAME MODULE */}
                      <div className="flex-1 flex items-center justify-center relative z-10 pointer-events-none">
                        <SafeComponentPreview item={item} />
                      </div>
                    </div>

                    {/* Metadata & Creator Profiles Footer card */}
                    <div className="p-4 flex flex-col text-left">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 
                            onClick={() => {
                              setSelectedComponentId(item.id);
                              setPage('components');
                            }}
                            className="font-display font-extrabold text-sm text-slate-905 dark:text-white hover:text-cyan-400 cursor-pointer transition-colors"
                          >
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                            <User className="w-3 h-3 text-purple-400" /> @{item.author.username || 'anonymous'}
                          </div>
                        </div>

                        {/* Badges indicators */}
                        <div className="flex items-center gap-1 shrink-0">
                          {item.tags?.slice(0, 2).map((tag) => (
                            <span 
                              key={tag} 
                              className={`text-[8px] font-extrabold font-mono px-1.5 py-0.2 rounded border ${
                                tag === 'Pro' 
                                  ? 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' 
                                  : tag === 'New' 
                                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                  : 'bg-indigo-500/10 text-indigo-550 border-indigo-500/20'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-500 dark:text-neutral-400 leading-normal mt-2 italic line-clamp-2 min-h-[30px]">
                        "{item.description}"
                      </p>

                      {/* STATS MATRIX AND ACTIONS BUTTON FOOTER */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/30 dark:border-white/5">
                        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                          <span className="flex items-center gap-0.5" title="Views"><Eye className="w-3 h-3 text-slate-500" /> {item.views || 0}</span>
                          <span className="flex items-center gap-0.5" title="Downloads"><Download className="w-3 h-3 text-emerald-500" /> {item.downloads || 0}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Favorite bookmark */}
                          <button
                            onClick={(e) => handleFavoriteToggle(e, item.id)}
                            className={`p-1.5 rounded-lg border border-slate-200/40 dark:border-white/10 hover:border-cyan-500 hover:text-cyan-400 cursor-pointer transition-all ${
                              authorSaved ? 'bg-cyan-500/15 text-cyan-400 border-cyan-400' : 'bg-slate-100 dark:bg-white/5 text-slate-400'
                            }`}
                            title="Save to Favorite list"
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                          </button>

                          {/* Likes love */}
                          <button
                            onClick={(e) => handleLikeToggle(e, item.id)}
                            className={`p-1.5 rounded-lg border border-slate-200/40 dark:border-white/10 hover:border-rose-500 hover:text-rose-500 cursor-pointer transition-all flex items-center gap-1 ${
                              authorLiked ? 'bg-rose-500/15 text-rose-500 border-rose-500' : 'bg-slate-100 dark:bg-white/5 text-slate-400'
                            }`}
                            title="Love component"
                          >
                            <Heart className={`w-3.5 h-3.5 ${authorLiked ? 'fill-rose-500' : ''}`} />
                            <span className="text-[9px] font-bold font-mono">{item.likes?.length || 0}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
