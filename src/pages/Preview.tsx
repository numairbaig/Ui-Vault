import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Monitor, Tablet, Smartphone, Clipboard, Check, Terminal, 
  Sparkles, ExternalLink, Sliders, ChevronRight, RefreshCw, Layers, Shield,
  MessageSquare, Send, Trash2, Heart, Bookmark, AlertOctagon, UserCheck, UserPlus, Eye, Download,
  Sun, Moon
} from 'lucide-react';
import { api, UIComponent, Comment } from '../lib/api';
import { UI_COMPONENTS_CATALOG } from '../data/components';
import { SafeComponentPreview } from '../components/SafeComponentPreview';

interface PreviewProps {
  component: { id: string; name?: string }; // Fallback compatibility with app states
  onBack: () => void;
  onTriggerToast: (msg: string, type: 'success' | 'info' | 'error') => void;
  onSelectComponent: (id: string) => void;
  currentUser: any;
}

export default function Preview({ component, onBack, onTriggerToast, onSelectComponent, currentUser }: PreviewProps) {
  const [detail, setDetail] = useState<UIComponent | null>(null);
  const [similar, setSimilar] = useState<UIComponent[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js' | 'react' | 'tailwind'>('html');
  const [isCopied, setIsCopied] = useState(false);

  // Follow states
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  // Report modal states
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [sandboxIsDark, setSandboxIsDark] = useState(true);

  const loadComponentDetails = async () => {
    try {
      const data = await api.getComponentDetail(component.id);
      setDetail(data.component);
      setSimilar(data.similar || []);

      // Load comments
      const comms = await api.getComments(component.id);
      setComments(comms);

      // Check follow status if logged-in
      if (currentUser && data.component.author) {
        // Simple mock checks
        setIsFollowing(currentUser.following?.includes(data.component.author.id) || false);
      }
    } catch {
      // Fallback to local catalog elements if API fails (e.g. for pre-defined premium components)
      const catalogItem = UI_COMPONENTS_CATALOG.find(item => item.id === component.id);
      if (catalogItem) {
        const fallbackDetail: UIComponent = {
          id: catalogItem.id,
          title: catalogItem.name,
          description: catalogItem.description,
          category: catalogItem.category,
          tags: catalogItem.tags as string[],
          thumbnail: 'Aura Premium Code',
          htmlCode: catalogItem.codeTailwind || '',
          cssCode: '',
          jsCode: '',
          reactCode: catalogItem.codeJSX || '',
          tailwindCode: catalogItem.codeTailwind || '',
          author: {
            id: 'usr_admin',
            username: 'uiverse_admin',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
          },
          likes: ['usr_admin'],
          views: 3491,
          downloads: 1402,
          commentsCount: 0,
          createdAt: new Date().toISOString()
        };
        setDetail(fallbackDetail);
        setSimilar([]);
        setComments([]);
      } else {
        onTriggerToast('Failed to pull component metadata details', 'error');
      }
    }
  };

  useEffect(() => {
    loadComponentDetails();
    // Trigger download counter or increment view on page load
    // Done server-side inside /api/components/:id anyway!
  }, [component.id]);

  const handleCopyCode = async (specType: typeof activeTab) => {
    if (!detail) return;
    
    let targetCode = '';
    switch (specType) {
      case 'html': targetCode = detail.htmlCode; break;
      case 'css': targetCode = detail.cssCode; break;
      case 'js': targetCode = detail.jsCode; break;
      case 'react': targetCode = detail.reactCode; break;
      case 'tailwind': targetCode = detail.tailwindCode; break;
    }

    if (!targetCode) {
      onTriggerToast(`No values configured inside ${specType.toUpperCase()} specifications tab.`, 'info');
      return;
    }

    navigator.clipboard.writeText(targetCode);
    setIsCopied(true);
    onTriggerToast(`Copied ${specType.toUpperCase()} specs configuration vector!`, 'success');
    
    // Trigger download analytics update
    try {
      await api.triggerDownloadCounter(detail.id);
    } catch {}

    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePublishComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onTriggerToast('Session required. Please register or sign in to contribute!', 'info');
      return;
    }
    if (!newCommentText.trim()) return;

    try {
      const posted = await api.addComment(component.id, newCommentText);
      onTriggerToast('Micro-review submitted in catalog!', 'success');
      setNewCommentText('');
      loadComponentDetails(); // Refresh
    } catch (err: any) {
      onTriggerToast(err.message || 'Comment submit failed', 'error');
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      await api.deleteComment(id);
      onTriggerToast('Comment redacted from archives.', 'info');
      loadComponentDetails();
    } catch {
      onTriggerToast('Failed to discard comment', 'error');
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser) {
      onTriggerToast('Login required to follow creators.', 'info');
      return;
    }
    if (!detail) return;

    try {
      const res = await api.toggleFollowUser(detail.author.id);
      setIsFollowing(res.isFollowing);
      onTriggerToast(res.message, 'success');
    } catch {
      onTriggerToast('Failed to process creator follow toggle', 'error');
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onTriggerToast('Identify yourself to file complaints.', 'info');
      return;
    }
    if (!reportReason.trim()) return;

    try {
      await api.reportComponent(component.id, reportReason);
      onTriggerToast('Complaint successfully registered. Our moderators will verify code.', 'success');
      setReportReason('');
      setReportOpen(false);
    } catch {
      onTriggerToast('Complaint registry offline', 'error');
    }
  };

  if (!detail) {
    return <div className="py-24 text-center font-mono text-xs text-slate-400 animate-pulse">Initializing quantum sandbox code tables...</div>;
  }

  const selectedCode = () => {
    switch (activeTab) {
      case 'html': return detail.htmlCode;
      case 'css': return detail.cssCode;
      case 'js': return detail.jsCode;
      case 'react': return detail.reactCode;
      case 'tailwind': return detail.tailwindCode;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-neutral-800 dark:text-neutral-200 text-left">
      
      {/* 1. TOP UTILITY NAVIGATION BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200/20 dark:border-white/5 pb-5 mb-8 gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-550 dark:text-neutral-400 hover:text-cyan-500 dark:hover:text-white cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          Back to UI Vault Library
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-slate-105 dark:bg-white/5 border border-slate-250/10 dark:border-white/5 p-1 rounded-lg">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`p-2 rounded cursor-pointer ${previewMode === 'desktop' ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow' : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}
              title="Desktop width"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('tablet')}
              className={`p-2 rounded cursor-pointer ${previewMode === 'tablet' ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow' : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}
              title="Tablet (768px)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`p-2 rounded cursor-pointer ${previewMode === 'mobile' ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow' : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}
              title="Mobile (375px)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setReportOpen(true)}
            className="px-3 py-1.5 border border-rose-500/30 text-rose-500/80 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer font-semibold uppercase tracking-wider text-[10px]"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            Report Component
          </button>
        </div>
      </div>

      {/* 2. LIVE SANDBOX BLOCK */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <h2 className="text-xl font-display font-extrabold text-slate-900 dark:text-white flex items-center gap-2 italic">
            <Sparkles className="w-4 h-4 text-[#8b5cf6]" /> Sandboxed Visual Workspace
          </h2>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest leading-none mt-1">// rendering raw CSS animations within isolate iframe wrapper</p>
        </div>

        {/* Sandbox Theme Toggle Button */}
        <button
          onClick={() => setSandboxIsDark(!sandboxIsDark)}
          className={`px-3 py-1.5 rounded-xl border text-[10px] font-mono font-bold tracking-wider uppercase transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0 ${
            sandboxIsDark 
              ? 'bg-neutral-900 border-white/10 text-white hover:bg-neutral-850' 
              : 'bg-white border-slate-200 text-slate-800 hover:bg-[#fafafa]'
          }`}
        >
          {sandboxIsDark ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" /> Light Preview Background
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-400" /> Dark Preview Background
            </>
          )}
        </button>
      </div>
      
      <div className="flex justify-center mb-10">
        <div 
          className={`w-[100%] h-[420px] min-h-[420px] max-h-[420px] border border-dashed rounded-3xl overflow-hidden shadow-2xl transition-all duration-350 p-6 flex items-center justify-center relative ${
            sandboxIsDark 
              ? 'bg-[#0a0a0f] text-white border-zinc-805 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:18px_18px]' 
              : 'bg-[#f8fafc] text-slate-900 border-slate-300 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:18px_18px]'
          } ${
            previewMode === 'mobile' ? 'max-w-[375px] border-cyan-500/40 ring-4 ring-cyan-500/5' : 
            previewMode === 'tablet' ? 'max-w-[768px]' : 'max-w-[100%]'
          }`}
        >
          {/* Unified dynamic component preview engine */}
          <SafeComponentPreview item={detail} height="360px" forceIsDark={sandboxIsDark} />
        </div>
      </div>

      {/* RE-ALIGN SPLIT SCREEN: LEFT CREATOR CONTROLS (1 span) & RIGHT CODE TABS PANEL (2 spans) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: CREATOR PROFILE + STATS COMPASS */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Details & tags card info */}
          <div className="bg-slate-50/50 dark:bg-neutral-900/40 border border-slate-205/50 dark:border-white/5 p-5 rounded-3xl flex flex-col gap-4 text-left shadow-sm">
            <div>
              <span className="text-[8px] font-mono tracking-widest text-[#a855f7] bg-purple-500/10 px-2 py-0.5 rounded font-extrabold uppercase">{detail.category} SPECS</span>
              <h1 className="text-2xl font-display font-extrabold text-slate-905 dark:text-white mt-2 leading-none italic">{detail.title}</h1>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-3.5 leading-relaxed">"{detail.description}"</p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-3.5 border-t border-slate-200/40 dark:border-white/5 text-[9px] font-mono">
              {detail.tags?.map(t => (
                <span key={t} className="px-2 py-0.5 rounded bg-cyan-100/45 dark:bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/20 font-bold uppercase">
                  {t}
                </span>
              ))}
            </div>

            {/* VIEWS AND DOWNLOAD STATS */}
            <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-205/40 dark:border-white/5 text-[10px] font-mono text-slate-500 text-center">
              <div className="p-2 rounded bg-slate-100/50 dark:bg-black/10">
                <Eye className="w-3.5 h-3.5 mx-auto text-cyan-400 mb-1" />
                <span>{detail.views} views</span>
              </div>
              <div className="p-2 rounded bg-slate-100/50 dark:bg-black/10">
                <Download className="w-3.5 h-3.5 mx-auto text-emerald-500 mb-1" />
                <span>{detail.downloads} downloads</span>
              </div>
            </div>
          </div>

          {/* Social Creator follow card */}
          {detail.author && (
            <div className="bg-slate-50/50 dark:bg-neutral-900/40 border border-slate-205/50 dark:border-white/5 p-5 rounded-3xl text-left shadow-sm">
              <span className="text-[9px] font-mono tracking-wider uppercase text-[#a855f7] block mb-2 font-bold">COMPONENT AUTHOR</span>
              <div className="flex items-center gap-3.5 mb-4">
                <img src={detail.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'} alt="Creator avatar" className="w-10 h-10 rounded-xl object-cover" />
                <div className="text-xs">
                  <h4 className="font-extrabold text-slate-950 dark:text-white font-mono">@{detail.author.username}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Author Code Registry Profile</p>
                </div>
              </div>

              <button
                onClick={handleFollowToggle}
                className={`w-full py-2.5 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isFollowing
                    ? 'border border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
                    : 'bg-slate-950 dark:bg-white text-white dark:text-black hover:opacity-90'
                }`}
              >
                {isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {isFollowing ? 'Following creator' : 'Follow Creator Portfolio'}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: ACTIVE TAB MODULE CODES (2 spans) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between border-b border-slate-200/20 dark:border-white/5 pb-2">
            
            {/* Code categories tags */}
            <div className="flex bg-slate-100 dark:bg-white/5 border border-slate-200/10 dark:border-white/5 p-1 rounded-xl overflow-x-auto gap-0.5">
              {(['html', 'css', 'js', 'react', 'tailwind'] as const).map((tab) => {
                const active = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                      active ? 'bg-slate-950 text-white dark:bg-white dark:text-black shadow' : 'text-slate-500 dark:text-neutral-400'
                    }`}
                  >
                    {tab === 'html' ? 'HTML Base' : tab === 'css' ? 'Bespoke CSS' : tab === 'js' ? 'Script JS' : tab === 'react' ? 'ReactJSX' : 'Tailwind'}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handleCopyCode(activeTab)}
              className="px-4 py-2 bg-slate-950 dark:bg-white text-white dark:text-black hover:scale-105 rounded-xl text-xs font-bold font-mono cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500 animate-bounce" /> : <Clipboard className="w-3.5 h-3.5" />}
              {isCopied ? 'Copied Specs!' : 'Copy Vector Specs'}
            </button>
          </div>

          <div className="relative bg-[#1e293b] dark:bg-black p-5 rounded-2xl border border-slate-250/20 dark:border-white/10 overflow-hidden shadow-inner font-mono text-[11.5px] text-[#38bdf8] dark:text-cyan-400 select-all text-left">
            <span className="absolute top-2.5 right-3.5 text-[9px] font-mono tracking-widest text-[#a855f7] select-none uppercase">
              // read-only terminal block
            </span>
            <pre className="max-h-[380px] overflow-y-auto whitespace-pre pr-1">
              {selectedCode() || `/* No parameters configured inside ${activeTab.toUpperCase()} specs folder. Defaults to generic vector. */`}
            </pre>
          </div>
        </div>
      </div>

      {/* 4. COMMENT FEEDS AND MOCK REVIEWS ACCORDIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 pt-10 border-t border-slate-200/20 dark:border-white/5">
        
        {/* LEFTHAND: SUBMIT REVIEWS FORM (1 span) */}
        <div className="lg:col-span-1 text-left space-y-4">
          <div>
            <h3 className="font-display font-extrabold text-sm uppercase tracking-wider text-slate-950 dark:text-white">Write Component Review</h3>
            <p className="text-[10px] text-slate-400 leading-normal mt-1 italic">Submit interactive feedback, code tips, or customization specifications regarding this design.</p>
          </div>

          <form onSubmit={handlePublishComment} className="space-y-3">
            <textarea
              rows={3}
              required
              placeholder={currentUser ? "Write feedback..." : "Sign in to post interactive reviews..."}
              disabled={!currentUser}
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-205 dark:border-white/5 text-slate-905 dark:text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-500 resize-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!currentUser}
              className="w-full py-2 bg-slate-950 dark:bg-white hover:bg-slate-900 dark:hover:bg-slate-100 text-white dark:text-black font-semibold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3 h-3 text-[#a855f7]" />
              Publish Feed Comment
            </button>
          </form>
        </div>

        {/* RIGHTSIDE: LIST REVIEW CHANNELS (2 spans) */}
        <div className="lg:col-span-2 text-left space-y-4">
          <h3 className="font-display font-extrabold text-sm uppercase tracking-wider text-slate-955 dark:text-white">Community Reviews Feed ({comments.length})</h3>
          
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {comments.map((comm) => {
              const matchesUser = currentUser && comm.user?.id === currentUser.id;
              const isModerator = currentUser && currentUser.role === 'admin';
              
              return (
                <div key={comm.id} className="p-4 rounded-2xl bg-slate-55/20 dark:bg-white/5 border border-slate-200/30 dark:border-white/5 flex gap-3 text-xs items-start">
                  <img src={comm.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'} alt="User Avatar" className="w-8 h-8 rounded-lg object-cover" />
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-905 dark:text-white font-mono">@{comm.user?.username}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-slate-400 font-mono">{new Date(Date.parse(comm.createdAt)).toLocaleDateString()}</span>
                        {(matchesUser || isModerator) && (
                          <button
                            onClick={() => handleDeleteComment(comm.id)}
                            className="text-slate-400 hover:text-rose-500 cursor-pointer"
                            title="Discard feedback"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-650 dark:text-neutral-300 italic">"{comm.text}"</p>
                  </div>
                </div>
              );
            })}
            {comments.length === 0 && (
              <div className="py-8 text-center text-slate-500 text-xs italic border border-dashed border-slate-250/20 dark:border-white/5 rounded-2xl">
                No active reviews published yet. Be the first to catalog suggestions!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. SIMILAR OR RELATED ELEMENTS SLIDER */}
      <div className="border-t border-slate-200/20 dark:border-white/5 mt-14 pt-10">
        <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white mb-6 italic">
          Other Elements You May Enjoy
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {similar.length > 0 ? (
            similar.slice(0, 3).map((item, index) => {
              const borderColors = [
                'hover:border-cyan-500/50',
                'hover:border-purple-500/50',
                'hover:border-pink-500/50'
              ];
              const hoverBorder = borderColors[index % borderColors.length];

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectComponent(item.id)}
                  className={`bg-slate-50/50 dark:bg-neutral-900/40 border border-slate-200/50 dark:border-white/5 p-5 rounded-2xl cursor-pointer text-left hover:scale-[1.02] transition-all flex flex-col justify-between group ${hoverBorder} shadow`}
                >
                  <div>
                    <span className="text-[8px] font-mono text-[#a855f7] tracking-widest font-extrabold uppercase p-1 rounded bg-purple-500/10">
                      {item.category}
                    </span>
                    <h4 className="font-display font-extrabold text-sm leading-tight text-slate-900 dark:text-white group-hover:text-cyan-500 mt-3 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-neutral-400 mt-2 line-clamp-2 leading-relaxed italic">
                      "{item.description}"
                    </p>
                  </div>

                  <span className="text-[10px] text-cyan-500 dark:text-cyan-400 font-mono mt-4 flex items-center gap-0.5 group-hover:underline">
                    Inspect specs layout <ChevronRight className="w-3 h-3 shrink-0" />
                  </span>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center text-slate-400 text-xs italic">No matching auxiliary elements. Explore the primary catalog.</div>
          )}
        </div>
      </div>

      {/* 6. MODAL DIALOG DRAWER FOR COMPLAINTS/REPORTING */}
      <AnimatePresence>
        {reportOpen && (
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 max-w-sm w-full text-left relative"
            >
              <h3 className="text-sm font-extrabold text-slate-950 dark:text-white flex items-center gap-1.5 uppercase tracking-wide">
                <AlertOctagon className="w-4.5 h-4.5 text-rose-500 animate-pulse" /> Report Code Violations
              </h3>
              <p className="text-[11px] text-slate-500 leading-normal mt-2">
                Let us know if this design includes style breakage, inappropriate markup, plagiarism, or broken dependencies.
              </p>

              <form onSubmit={handleReportSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 dark:text-neutral-450 uppercase mb-1">Detailed Reason</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe styles mismatch or broken tags..."
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-neutral-600 focus:outline-none focus:border-rose-500 resize-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setReportReason('');
                      setReportOpen(false);
                    }}
                    className="flex-1 py-2 text-xs border border-slate-200 dark:border-white/5 text-slate-700 dark:text-neutral-400 rounded-lg text-center"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-500 shadow text-center"
                  >
                    File Complaint
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
