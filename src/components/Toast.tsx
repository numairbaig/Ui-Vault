import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-full max-w-xs pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
              className="pointer-events-auto w-full glass-panel border border-slate-200/20 dark:border-white/10 dark:bg-slate-900/90 rounded-xl p-3.5 shadow-xl flex items-start gap-3 text-slate-800 dark:text-white"
            >
              <div className="mt-0.5 shrink-0">
                {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                {toast.type === 'info' && <Info className="w-4 h-4 text-violet-400" />}
                {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-400" />}
              </div>

              <div className="flex-1 text-xs font-medium">
                <p className="leading-relaxed">{toast.message}</p>
              </div>

              <button
                onClick={() => onRemove(toast.id)}
                className="shrink-0 p-1 rounded hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
