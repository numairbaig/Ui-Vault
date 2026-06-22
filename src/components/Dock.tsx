import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Layers, PlusCircle, User, Mail } from 'lucide-react';

interface DockProps {
  currentPage: string;
  setPage: (page: string) => void;
  onTriggerToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function Dock({ currentPage, setPage, onTriggerToast }: DockProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const dockItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'components', label: 'Components', icon: Layers },
    { id: 'upload', label: 'Upload Code', icon: PlusCircle },
    { id: 'creator-profile', label: 'My Profile', icon: User },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex justify-center items-center pointer-events-none w-max max-w-[95vw]">
      <div className="flex items-center gap-2 sm:gap-3.5 px-3.5 sm:px-5 py-2.5 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-black/35 border border-slate-200/40 dark:border-white/10 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.4)] pointer-events-auto relative group">
        
        {dockItems.map((item, index) => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={item.id}
              className="relative flex flex-col items-center select-none"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Floating Tooltip bubble (optimized speed & spring) */}
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, y: 15, scale: 0.9 }}
                    animate={{ opacity: 1, y: -34, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.9 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 400 }}
                    className="absolute text-[8px] font-mono tracking-widest font-extrabold bg-slate-950 text-white dark:bg-white dark:text-black px-2 py-0.5 rounded-md shadow-md uppercase whitespace-nowrap z-50 pointer-events-none"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Icon frame with responsive tap size target & active design */}
              <motion.button
                onClick={() => {
                  setPage(item.id);
                  onTriggerToast(`Navigated to: ${item.label}`, 'info');
                }}
                whileHover={{ scale: 1.25, y: -5 }}
                whileTap={{ scale: 0.92 }}
                className={`relative w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                  active 
                    ? 'bg-slate-950 text-white dark:bg-white dark:text-black border border-slate-950 dark:border-transparent shadow-[0_4px_12px_rgba(0,0,0,0.15)]' 
                    : 'bg-white/30 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10 text-slate-600 hover:text-slate-950 dark:text-neutral-400 dark:hover:text-white border border-slate-200/20 dark:border-white/5'
                }`}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
              </motion.button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
