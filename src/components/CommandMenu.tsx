import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Flame, Terminal, FileCode, Check, Command, CornerDownLeft } from 'lucide-react';
import { UI_COMPONENTS_CATALOG } from '../data/components';
import { UIComponentItem } from '../types';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectComponent: (id: string) => void;
}

export default function CommandMenu({ isOpen, onClose, onSelectComponent }: CommandMenuProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 120);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard dismiss listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filtered = query.trim() === '' 
    ? UI_COMPONENTS_CATALOG.slice(0, 5) // Recents/Featured
    : UI_COMPONENTS_CATALOG.filter(c => 
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]">
          {/* Blur background shield */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md cursor-pointer"
          />

          {/* Core Card interface */}
          <motion.div
            initial={{ scale: 0.97, opacity: 0, y: -8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: -8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative w-full max-w-xl rounded-2xl overflow-hidden border border-slate-200/15 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 shadow-2xl backdrop-blur-2xl text-slate-800 dark:text-white z-50 flex flex-col"
          >
            {/* Input Section */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-500/10">
              <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search premium UI components, tags, categories..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-0 text-slate-900 dark:text-white"
              />
              <span className="text-[9px] font-mono border border-slate-500/20 px-1.5 py-0.5 rounded text-slate-400 shrink-0 flex items-center gap-0.5 shadow-sm">
                ESC
              </span>
            </div>

            {/* Results body */}
            <div className="max-h-[320px] overflow-y-auto p-2 flex flex-col gap-0.5">
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 px-3 py-1.5 uppercase tracking-wider font-semibold">
                {query.trim() === '' ? '⚡ RECOMMENDED MODULES' : `🔎 MATCHING NODE COMPONENTS (${filtered.length})`}
              </span>

              {filtered.length === 0 ? (
                <div className="py-8 text-center text-slate-400 dark:text-slate-500 flex flex-col gap-1 items-center">
                  <Terminal className="w-6 h-6 text-slate-400 opacity-60 mb-1" />
                  <span className="text-xs font-semibold">No node matching configuration!</span>
                  <span className="text-[10px] uppercase">Please search for Buttons, Cards, Modals or Pricing</span>
                </div>
              ) : (
                filtered.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectComponent(item.id);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                        <FileCode className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">
                          {item.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block leading-none font-medium capitalize">
                          {item.category} • {item.description.slice(0, 60)}...
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.tags.map(t => (
                        <span key={t} className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-500 border border-violet-500/20 font-semibold uppercase shrink-0">
                          {t}
                        </span>
                      ))}
                      <CornerDownLeft className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 shrink-0" />
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Hint bar footer */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-500/10 text-[10px] text-slate-400 dark:text-slate-500 font-mono select-none">
              <span className="flex items-center gap-1">
                <Command className="w-3 h-3" /> Search shortcuts enabled
              </span>
              <span>Press ↑↓ to select node, Enter to navigate</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
