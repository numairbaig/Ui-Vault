import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, ArrowRight, Shield, Check, Heart, ShoppingBag, Fingerprint, 
  ChevronRight, RefreshCw, Star, ArrowUpRight, Copy, Terminal, Server,
  Sliders, Palette, CreditCard, Layout, Moon, Sun, User, Database, Settings,
  MessageSquare, Mail, MapPin, Send, Zap, Eye, Code, Smartphone, Tablet, Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UIComponentItem } from '../types';

// Standard simple toast helper inside the file so we can trigger feedback inside previews
const usePreviewToast = () => {
  return (message: string) => {
    // We'll dispatch a custom event if we want the global toast to listen to it
    const event = new CustomEvent('app-toast', { detail: { message, type: 'success' } });
    window.dispatchEvent(event);
  };
};

export const UI_COMPONENTS_CATALOG: UIComponentItem[] = [
  // 1. BUTTONS
  {
    id: 'glowing-neon-button',
    name: 'Glowing Neon Slide Button',
    category: 'Buttons',
    description: 'A button featuring an interactive shifting gradient, sleek outline offsets, and a glowing neon backdrop on hover.',
    tags: ['New', 'Popular'],
    dependencies: ['motion/react', 'lucide-react'],
    installation: `npm install motion lucide-react\n\n// Add to custom config or use directly in your workspace`,
    codeJSX: `import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function GlowButton() {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="relative px-6 py-3 rounded-xl font-medium tracking-wide text-white group overflow-hidden bg-slate-900 border border-white/10 shadow-2xl"
    >
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-pink-600 to-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
      
      {/* Animated sliding shine effect */}
      <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] -z-10" />

      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-pink-400 group-hover:rotate-12 transition-transform" />
        <span>Initialize Portal</span>
        <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.button>
  );
}`,
    codeTailwind: `<button class="relative px-6 py-3 rounded-xl font-medium text-white group overflow-hidden bg-slate-900 border border-white/10 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95">
  <div class="absolute inset-0 bg-gradient-to-r from-violet-600 via-pink-600 to-emerald-500 opacity-25 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"></div>
  <div class="flex items-center gap-2">
    <span class="text-pink-400">✦</span>
    <span>Initialize Portal</span>
    <span class="text-purple-400 group-hover:translate-x-1 transition-transform">→</span>
  </div>
</button>`,
    previewRender: () => {
      const showToast = usePreviewToast();
      return (
        <div className="py-8 flex flex-col items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => showToast("Neon portal initialized successfully!")}
            className="relative px-6 py-3 rounded-xl font-medium tracking-wide text-white group overflow-hidden bg-slate-900 border border-white/15 shadow-2xl cursor-pointer"
          >
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-pink-600 to-emerald-500 opacity-30 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
            
            <div className="flex items-center gap-2 relative z-10 font-display">
              <Sparkles className="w-4 h-4 text-pink-400 group-hover:rotate-12 transition-transform duration-300" />
              <span>Initialize Portal</span>
              <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </motion.button>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-4 font-mono">Click to fire interactive micro-state action</span>
        </div>
      );
    }
  },

  // 2. CARDS
  {
    id: 'mouse-glow-card',
    name: 'Dynamic Mouse-Follow Glow Card',
    category: 'Cards',
    description: 'A bento card implementing real-time cursor tracking to paint high-fidelity glowing gradients behind transparent glass layers.',
    tags: ['Popular'],
    dependencies: ['motion/react', 'lucide-react'],
    installation: `npm install motion lucide-react`,
    codeJSX: `import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function GlowCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    setCoords({ x: e.clientX - left, y: e.clientY - top });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-72 rounded-2xl p-6 overflow-hidden bg-slate-950 border border-white/5 shadow-2xl cursor-pointer group"
    >
      {/* Cursor tracking spotlight */}
      {isHovered && (
        <div
          className="absolute pointer-events-none rounded-full blur-[60px] opacity-40 transition-opacity duration-300"
          style={{
            width: '180px',
            height: '180px',
            background: 'radial-gradient(circle, #8b5cf6 0%, #ec4899 50%, transparent 100%)',
            left: \`\${coords.x - 90}px\`,
            top: \`\${coords.y - 90}px\`,
          }}
        />
      )}

      <div className="relative z-10 flex flex-col gap-4">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
          <Zap className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="font-display font-medium text-lg text-white">Quantum Processing</h3>
          <p className="text-sm text-slate-400 mt-1 leading-relaxed">
            Harnessing ultra-dense photon lattices to compute logical matrices in absolute parallel environments.
          </p>
        </div>
      </div>
    </div>
  );
}`,
    codeTailwind: `<div class="relative w-72 rounded-2xl p-6 overflow-hidden bg-slate-950 border border-white/5 shadow-2xl cursor-pointer group hover:border-purple-500/20 transition-colors">
  <!-- CSS styled spot for hover -->
  <div class="absolute inset-0 bg-[radial-gradient(120px_circle_at_var(--x,0px)_var(--y,0px),_rgba(139,92,246,0.15),transparent)] pointer-events-none"></div>
  <div class="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 mb-4 text-purple-400">✦</div>
  <h3 class="font-medium text-lg text-white">Quantum Processing</h3>
  <p class="text-sm text-slate-400 mt-1">Accelerated logical routing.</p>
</div>`,
    previewRender: () => {
      const cardRef = useRef<HTMLDivElement>(null);
      const [coords, setCoords] = useState({ x: 0, y: 0 });
      const [isHovered, setIsHovered] = useState(false);

      const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const { left, top } = cardRef.current.getBoundingClientRect();
        setCoords({ x: e.clientX - left, y: e.clientY - top });
      };

      return (
        <div className="py-6 flex justify-center">
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative w-full max-w-sm rounded-2xl p-6 overflow-hidden bg-slate-900/95 dark:bg-slate-950 border border-slate-200/15 dark:border-white/5 shadow-2xl cursor-pointer group transition-all duration-350"
          >
            {/* Radial glow spotlight tracking cursor */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute pointer-events-none rounded-full blur-[50px] opacity-35"
                  style={{
                    width: '160px',
                    height: '160px',
                    background: 'radial-gradient(circle, #8b5cf6 0%, #ec4899 50%, #10b981 100%)',
                    left: `${coords.x - 80}px`,
                    top: `${coords.y - 80}px`,
                  }}
                />
              )}
            </AnimatePresence>

            <div className="relative z-10 flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30 group-hover:rotate-6 transition-transform">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <span className="px-2 py-0.5 text-[9px] font-mono tracking-widest text-[#10b981] bg-[#10b981]/10 rounded-full border border-[#10b981]/25 uppercase font-semibold">Live Sandbox</span>
                <h3 className="font-display font-semibold text-lg text-slate-800 dark:text-white mt-2">Quantum Processing</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Hover anywhere inside this card! A high-density neon gradient follows your cursor in real time via a custom Mouse-Follow matrix.
                </p>
              </div>
              <div className="flex justify-between items-center mt-2 border-t border-slate-500/10 pt-3">
                <span className="text-[10px] font-mono text-slate-500">X: {coords.x}px | Y: {coords.y}px</span>
                <span className="text-[10px] font-mono text-[#a855f7] flex items-center gap-1 group-hover:underline">
                  Code Active <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
  },

  // 3. MODALS
  {
    id: 'glassmorphic-modal',
    name: 'Glassmorphic Backdrop Blur Modal',
    category: 'Modals',
    description: 'A beautiful system notification trigger with thick iOS/Vercel styling, fluid enter/exit scales, and ambient glow anchors.',
    tags: ['New'],
    dependencies: ['motion/react', 'lucide-react'],
    installation: `npm install motion lucide-react`,
    codeJSX: `import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Check } from 'lucide-react';

export default function BlurModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-slate-900/85 p-6 shadow-2xl backdrop-blur-2xl"
          >
            {/* Top Glowing Anchor Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-pink-500 to-emerald-400" />

            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#10b981]/10 flex items-center justify-center border border-[#10b981]/20">
                <Shield className="w-6 h-6 text-[#10b981]" />
              </div>
              <div>
                <h3 className="font-display font-medium text-xl text-white">Encryption Secure</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Your private credentials and API endpoints are now isolated inside a hardware-backed enclave.
                </p>
              </div>
              <div className="flex gap-3 w-full mt-4">
                <button 
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-sm text-white font-medium transition-colors"
                >
                  Configure Keys
                </button>
                <button 
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm text-white font-medium shadow-lg shadow-violet-600/25 transition-colors"
                >
                  Acknowledge
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}`,
    codeTailwind: `<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
  <div class="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl">
    <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-pink-500 to-emerald-400"></div>
    <div class="flex flex-col items-center text-center">
      <div class="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 mb-4">✔</div>
      <h3 class="text-xl font-medium text-white">Encryption Secure</h3>
      <p class="text-sm text-slate-400 mt-2">Credentials secured.</p>
    </div>
  </div>
</div>`,
    previewRender: () => {
      const [isOpen, setIsOpen] = useState(false);
      return (
        <div className="py-6 flex flex-col items-center justify-center">
          <button
            onClick={() => setIsOpen(true)}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl border border-white/15 cursor-pointer flex items-center gap-2 shadow-lg"
          >
            <Shield className="w-4 h-4 text-[#8b5cf6]" />
            Trigger Micro-Modal
          </button>

          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop Blur */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 bg-slate-950/60 backdrop-blur-md cursor-pointer"
                />

                {/* Modal Card */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 350 }}
                  className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/15 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-2xl backdrop-blur-2xl text-slate-800 dark:text-white z-50"
                >
                  {/* Glowing decorative border line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-pink-500 to-emerald-400" />

                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center border border-emerald-500/30">
                      <Check className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl">Sandbox Encryption Verified</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                        Your private configurations and token preferences have been mapped to local persistent arrays in a highly secure environment.
                      </p>
                    </div>
                    <div className="flex gap-3 w-full mt-4">
                      <button 
                        onClick={() => setIsOpen(false)}
                        className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Adjust Enclave
                      </button>
                      <button 
                        onClick={() => setIsOpen(false)}
                        className="flex-1 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white cursor-pointer shadow-lg shadow-violet-600/25 transition-colors"
                      >
                        Accept Credentials
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      );
    }
  },

  // 4. NAVBARS
  {
    id: 'floating-dock-nav',
    name: 'Sticky Floating glassmorphism Navbar',
    category: 'Navbars',
    description: 'A miniature sticky app bar with dense glassy blur, fluid active-item indicators, and smooth interactive hover scale triggers.',
    tags: ['Popular'],
    dependencies: ['motion/react', 'lucide-react'],
    installation: `npm install motion lucide-react`,
    codeJSX: `import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout, Server, Database, Settings } from 'lucide-react';

const MENU_ITEMS = [
  { id: 'templates', label: 'Layouts', icon: Layout },
  { id: 'apis', label: 'Enclaves', icon: Server },
  { id: 'database', label: 'Storage', icon: Database },
  { id: 'settings', label: 'Config', icon: Settings },
];

export default function FloatDock() {
  const [active, setActive] = useState('templates');

  return (
    <div className="flex justify-center py-4 bg-slate-950/20 rounded-2xl border border-white/5">
      <nav className="flex items-center gap-1.5 p-2 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className="relative px-4 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors duration-200 text-slate-400 hover:text-white"
            >
              {isActive && (
                <motion.div
                  layoutId="glow-oval"
                  className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <div className="flex items-center gap-1.5 relative z-10">
                <Icon className={\`w-3.5 h-3.5 \${isActive ? 'text-violet-400' : ''}\`} />
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}`,
    codeTailwind: `<nav class="flex items-center gap-1.5 p-2 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-md shadow-xl text-white">
  <!-- Nav items -->
  <button class="px-4 py-2 bg-white/10 border border-white/10 rounded-xl text-xs flex items-center gap-1.5 text-violet-400 font-medium">
    <span>Layouts</span>
  </button>
  <button class="px-4 py-2 text-xs flex items-center gap-1.5 text-slate-400 hover:text-white">
    <span>Storage</span>
  </button>
</nav>`,
    previewRender: () => {
      const [active, setActive] = useState('templates');
      const showToast = usePreviewToast();
      const items = [
        { id: 'templates', label: 'Layouts', icon: Layout },
        { id: 'apis', label: 'Enclaves', icon: Server },
        { id: 'database', label: 'Storage', icon: Database },
        { id: 'settings', label: 'Config', icon: Settings },
      ];

      return (
        <div className="py-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm rounded-2xl bg-slate-100 dark:bg-slate-950 p-4 border border-slate-200/10 flex items-center justify-center">
            <nav className="flex items-center gap-1.5 p-1.5 rounded-xl border border-slate-200/20 dark:border-white/10 bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActive(item.id);
                      showToast(`Navigated to ${item.label}`);
                    }}
                    className={`relative px-3 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors duration-200 ${
                      isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-glow"
                        className="absolute inset-0 bg-violet-500/10 dark:bg-white/5 border border-violet-500/20 dark:border-white/10 rounded-lg"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <div className="flex items-center gap-1 relative z-10">
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-violet-500 dark:text-violet-400' : ''}`} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
          <span className="text-[10px] text-slate-400 mt-3 font-mono">Shared LayoutId ensures fluid physics transitions across elements</span>
        </div>
      );
    }
  },

  // 5. SIDEBARS
  {
    id: 'collapsible-icon-sidebar',
    name: 'Collapsible Icon sidebar',
    category: 'Sidebars',
    description: 'A collateral utility-rail menu featuring icon indicators, subtle notification badges, and nested focus state overlays.',
    tags: [],
    dependencies: ['motion/react', 'lucide-react'],
    installation: `npm install motion lucide-react`,
    codeJSX: `import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout, Server, Database, Settings, ChevronRight } from 'lucide-react';

export default function CollapsibleSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState('dashboard');

  return (
    <motion.div
      animate={{ width: collapsed ? '64px' : '200px' }}
      className="h-96 rounded-xl bg-slate-950 border border-white/5 p-3 flex flex-col justify-between overflow-hidden"
    >
      <div className="flex flex-col gap-4">
        {/* Toggle Head */}
        <div className="flex items-center justify-between px-2 py-1 border-b border-white/5 pb-3">
          {!collapsed && <span className="font-display font-bold text-white text-xs">AURA PLATFORM</span>}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg bg-white/5 text-white/60 hover:text-white cursor-pointer"
          >
            <ChevronRight className={\`w-3.5 h-3.5 transform transition-transform \${collapsed ? '' : 'rotate-180'}\`} />
          </button>
        </div>

        {/* Sidebar Nav links */}
        <div className="flex flex-col gap-1.5">
          {[
            { id: 'dashboard', label: 'Monitor', icon: Layout },
            { id: 'enclaves', label: 'Node Clusters', icon: Server },
            { id: 'tables', label: 'Databases', icon: Database },
          ].map((link) => {
            const Icon = link.icon;
            const isSel = active === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActive(link.id)}
                className={\`flex items-center gap-3 p-2 rounded-lg text-xs font-medium cursor-pointer transition-all \${
                  isSel ? 'bg-violet-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }\`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <motion.span initial={{ opacity:0 }} animate={{ opacity:1 }}>{link.label}</motion.span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-white/10 pt-3">
        <button className="flex items-center gap-3 p-2 w-full text-left rounded-lg text-xs text-slate-400 hover:bg-white/5">
          <Settings className="w-4 h-4" />
          {!collapsed && <span>Global Settings</span>}
        </button>
      </div>
    </motion.div>
  );
}`,
    codeTailwind: `<aside class="h-64 w-32 border border-slate-800 bg-slate-950 p-3 rounded-xl flex flex-col justify-between text-white text-xs">
  <div>
    <h3 class="font-bold border-b border-slate-800 pb-2 mb-3">CONSOLES</h3>
    <button class="p-2 bg-violet-600 rounded-lg flex items-center gap-1.5 w-full">✦ Nodes</button>
  </div>
  <div>
    <span>Settings</span>
  </div>
</aside>`,
    previewRender: () => {
      const [collapsed, setCollapsed] = useState(false);
      const [active, setActive] = useState('dashboard');
      const showToast = usePreviewToast();

      return (
        <div className="py-6 flex justify-center">
          <motion.div
            animate={{ width: collapsed ? '65px' : '210px' }}
            className="h-64 rounded-xl bg-slate-100 dark:bg-slate-950 p-3 flex flex-col justify-between border border-slate-200 dark:border-white/5 overflow-hidden text-slate-800 dark:text-white"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-500/10 pb-2.5">
                {!collapsed && (
                  <motion.span 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="font-display font-semibold text-[10px] tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    AURA CORE
                  </motion.span>
                )}
                <button 
                  onClick={() => setCollapsed(!collapsed)}
                  className="p-1.5 rounded-lg bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-white/60 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                >
                  <ChevronRight className={`w-3.5 h-3.5 transform transition-transform ${collapsed ? '' : 'rotate-180'}`} />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                {[
                  { id: 'dashboard', label: 'Operations', icon: Layout },
                  { id: 'enclaves', label: 'Host Clusters', icon: Server },
                  { id: 'tables', label: 'Node Storage', icon: Database },
                ].map((link) => {
                  const Icon = link.icon;
                  const isSel = active === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => {
                        setActive(link.id);
                        showToast(`Activated ${link.label}`);
                      }}
                      className={`flex items-center gap-3 p-2 rounded-lg text-[11px] font-semibold cursor-pointer transition-all ${
                        isSel 
                          ? 'bg-violet-600 text-white shadow-md shadow-violet-600/10' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="truncate">{link.label}</motion.span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-500/10 pt-2 flex">
              <button 
                onClick={() => showToast("Opened Sandbox Settings")}
                className="flex items-center gap-3 p-1.5 w-full text-left rounded-lg text-[11px] text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5"
              >
                <Settings className="w-4 h-4" />
                {!collapsed && <span>Terminal Preferences</span>}
              </button>
            </div>
          </motion.div>
        </div>
      );
    }
  },

  // 6. FORMS
  {
    id: 'stepped-contact-form',
    name: 'Multi-Step Interactive Form',
    category: 'Forms',
    description: 'An interactive form utilizing staggered state transitions, fluid next-step sliders, and beautiful live validators.',
    tags: [],
    dependencies: ['motion/react', 'lucide-react'],
    installation: `npm install motion lucide-react`,
    codeJSX: `import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageSquare, Send } from 'lucide-react';

export default function SteppedForm() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');

  return (
    <div className="w-full max-w-sm rounded-2xl bg-slate-950 border border-white/5 p-6 shadow-2xl relative">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-mono tracking-widest text-violet-400">STEP {step} OF 2</span>
        <div className="flex gap-1">
          <div className={\`w-6 h-1 rounded-full bg-violet-600 transition-all \${step === 2 ? 'opacity-30' : ''}\`} />
          <div className={\`w-6 h-1 rounded-full bg-violet-600 transition-all \${step === 1 ? 'opacity-30' : ''}\`} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex flex-col gap-3"
          >
            <h3 className="font-display font-medium text-white text-base">Who are we contacting?</h3>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="dev@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            <button
              disabled={!email.includes('@')}
              onClick={() => setStep(2)}
              className="mt-2 w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-xs font-semibold text-white transition-all cursor-pointer"
            >
              Set Destination
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex flex-col gap-3"
          >
            <h3 className="font-display font-medium text-white text-base">Write custom enunciation</h3>
            <div className="relative">
              <MessageSquare className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <textarea
                rows={3}
                placeholder="Transmission details..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors resize-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-slate-300 cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => {
                  alert('Dispatched!');
                  setStep(1);
                  setEmail('');
                  setText('');
                }}
                className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Dispatch
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}`,
    codeTailwind: `<form class="rounded-xl bg-slate-900 border border-slate-800 p-5 w-72 text-white">
  <div class="flex justify-between text-[10px] mb-3 opacity-60"><span>Form Step 1</span></div>
  <input type="email" placeholder="dev@example.com" class="w-full bg-slate-950 p-2 text-xs rounded border border-slate-800 mb-3" />
  <button class="w-full py-2 bg-violet-600 text-xs font-semibold rounded">Continue</button>
</form>`,
    previewRender: () => {
      const [step, setStep] = useState(1);
      const [email, setEmail] = useState('');
      const [text, setText] = useState('');
      const showToast = usePreviewToast();

      const handleDispatch = () => {
        showToast("Form submission captured inside live emulator!");
        setStep(1);
        setEmail('');
        setText('');
      };

      return (
        <div className="py-4 flex justify-center">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-950 border border-slate-300/10 p-5 shadow-xl relative text-slate-800 dark:text-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-mono tracking-widest text-violet-500">STAGE {step} OF 2</span>
              <div className="flex gap-1">
                <div className={`w-5 h-1 rounded-full bg-violet-600 transition-all ${step === 2 ? 'opacity-30' : ''}`} />
                <div className={`w-5 h-1 rounded-full bg-violet-600 transition-all ${step === 1 ? 'opacity-30' : ''}`} />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="form-part-1"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="flex flex-col gap-3"
                >
                  <h3 className="font-display font-bold text-sm">Recipient Credentials</h3>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="dev@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:border-violet-500 focus:bg-white dark:focus:bg-slate-950 transition-all text-slate-900 dark:text-white"
                    />
                  </div>
                  <button
                    disabled={!email.includes('@')}
                    onClick={() => setStep(2)}
                    className="mt-1 w-full py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-xs font-semibold text-white transition-all cursor-pointer shadow-md"
                  >
                    Proceed to Context
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form-part-2"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="flex flex-col gap-3"
                >
                  <h3 className="font-display font-bold text-sm">Message Payload</h3>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    <textarea
                      rows={3}
                      placeholder="Aura component system logs feedback..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:border-violet-500 focus:bg-white dark:focus:bg-slate-950 transition-all text-slate-900 dark:text-white resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs text-slate-600 dark:text-slate-300 font-semibold cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleDispatch}
                      className="flex-1 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 animate-pulse" />
                      Dispatch
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      );
    }
  },

  // 7. INPUTS
  {
    id: 'wavy-underline-input',
    name: 'Glow Moving Border Input',
    category: 'Inputs',
    description: 'An input field with dynamic focus rings, glowing background cards, and real-time validation indicator ticks.',
    tags: ['New'],
    dependencies: ['motion/react', 'lucide-react'],
    installation: `npm install motion lucide-react`,
    codeJSX: `import { useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function BorderInput() {
  const [val, setVal] = useState('');
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative w-64 group">
      {/* Dynamic Ambient Backlight */}
      <div className={\`absolute -inset-0.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 blur-lg opacity-30 transition-opacity duration-300 \${focused ? 'opacity-80' : 'group-hover:opacity-50'}\`} />
      
      <div className="relative bg-slate-950 rounded-xl border border-white/10 overflow-hidden">
        <input
          type="text"
          value={val}
          placeholder="Aura encryption key..."
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setVal(e.target.value)}
          className="w-full bg-transparent px-4 py-3 text-xs text-white outline-none placeholder-slate-500 relative z-10"
        />
        {val.length > 4 && (
          <Sparkles className="absolute right-3.5 top-3 text-[#10b981] w-4 h-4 animate-bounce" />
        )}
      </div>
    </div>
  );
}`,
    codeTailwind: `<div class="relative w-64">
  <input type="text" placeholder="Glow input" class="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all placeholder-slate-500" />
</div>`,
    previewRender: () => {
      const [val, setVal] = useState('');
      const [focused, setFocused] = useState(false);

      return (
        <div className="py-6 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-xs group">
            {/* Dynamic Backing Shadow Glow */}
            <div className={`absolute -inset-0.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 blur-md opacity-25 transition-opacity duration-300 ${focused ? 'opacity-90 animate-pulse' : 'group-hover:opacity-45'}`} />
            
            <div className="relative bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
              <input
                type="text"
                value={val}
                placeholder="Aura key configuration..."
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={(e) => setVal(e.target.value)}
                className="w-full bg-transparent px-4 py-2.5 text-xs outline-none placeholder-slate-400 dark:placeholder-slate-600 text-slate-900 dark:text-white"
              />
              {val.length >= 5 && (
                <Sparkles className="absolute right-3.5 top-3 text-[#10b981] w-4 h-4 animate-pulse" />
              )}
            </div>
          </div>
          <span className="text-[10px] text-slate-400 mt-3 font-mono">Focus input field to ignite neon backdrop projection</span>
        </div>
      );
    }
  },

  // 8. LOADERS
  {
    id: 'interactive-ai-sphere',
    name: 'Futuristic AI Pulse Portal Sphere',
    category: 'Loaders',
    description: 'An AI-inspired responsive loading terminal displaying concentric glowing orbs, orbiting rings, and terminal status text logs.',
    tags: ['Popular'],
    dependencies: ['motion/react', 'lucide-react'],
    installation: `npm install motion lucide-react`,
    codeJSX: `import { motion } from 'framer-motion';

export default function PortSphere() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-6">
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Outermost rotating orbit halo */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-violet-500/40"
        />

        {/* Medium pulsing glass shell */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 blur-md pointer-events-none"
        />

        {/* Dense central core orb */}
        <div className="relative w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-lg border border-white/20">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse" />
        </div>
      </div>
      <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase animate-pulse">
        CALIBRATING COGNITIVE CORE...
      </span>
    </div>
  );
}`,
    codeTailwind: `<div class="flex flex-col items-center justify-center gap-3">
  <div class="relative w-12 h-12 flex items-center justify-center">
    <div class="absolute inset-0 rounded-full border-2 border-dashed border-purple-500 animate-[spin_5s_linear_infinite]"></div>
    <div class="absolute w-8 h-8 rounded-full bg-purple-500/20 blur-md animate-ping"></div>
    <div class="w-4 h-4 rounded-full bg-purple-600"></div>
  </div>
  <span class="text-[9px] font-mono tracking-wider text-purple-400">LOADING DATA MATRIX</span>
</div>`,
    previewRender: () => {
      return (
        <div className="py-6 flex flex-col items-center justify-center gap-4">
          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* Dashed outer orbit ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-dashed border-violet-500/40"
            />
            {/* Opposite spinning light border */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="absolute w-14 h-14 rounded-full border border-[1px] border-indigo-500/20 border-t-pink-500"
            />

            {/* Glowing neon halo backing */}
            <motion.div
              animate={{ scale: [0.95, 1.25, 0.95], opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="absolute w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 via-pink-400 to-emerald-400 blur-lg pointer-events-none"
            />

            {/* Inner high-density core */}
            <div className="relative w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center border border-white/20">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" 
              />
            </div>
          </div>
          <span className="text-[9px] font-mono tracking-widest text-[#a855f7] uppercase animate-pulse">
            CALIBRATING NEURAL GRAPH MATRIX...
          </span>
        </div>
      );
    }
  },

  // 9. PRICING TABLES
  {
    id: 'pricing-table-bento',
    name: 'Premium Pricing Bento Grid Card',
    category: 'Pricing tables',
    description: 'A gorgeous pricing table card with glass panels, glowing custom tags, and rich feature-lists.',
    tags: ['New'],
    dependencies: ['motion/react', 'lucide-react'],
    installation: `npm install motion lucide-react`,
    codeJSX: `import { Check, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EnterpriseTier() {
  return (
    <div className="relative w-80 rounded-3xl overflow-hidden bg-slate-950 p-6 border border-white/10 shadow-2xl">
      {/* Decorative spotlight */}
      <div className="absolute top-[-50px] right-[-50px] w-36 h-36 bg-violet-600/25 blur-3xl pointer-events-none" />

      {/* Glow tag highlight */}
      <div className="flex justify-between items-center bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full w-max text-[10px] font-mono tracking-wider text-pink-400">
        Enterprise Active
      </div>

      <div className="mt-5">
        <span className="text-sm font-light text-slate-400">Aura Free Tier</span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-4xl font-display font-semibold text-white">$0</span>
          <span className="text-xs text-slate-400 font-mono">/ completely free</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 py-3 border-t border-white/5 border-b mb-6">
        {['Secure Hardware Enclave', '100% GraphQL Endpoints', 'Sub-millisecond Latencies', '99.99% Node Host SLA'].map((item) => (
          <div key={item} className="flex items-center gap-2.5 text-xs text-slate-300">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-semibold hover:shadow-lg hover:shadow-violet-600/10 cursor-pointer"
      >
        Aura Free Access
      </motion.button>
    </div>
  );
}`,
    codeTailwind: `<div class="relative w-80 rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white">
  <div class="mb-4 text-xs font-mono text-pink-400 bg-white/5 w-max px-2 py-1 rounded">Enterprise</div>
  <h2 class="text-3xl font-bold font-display">$0<span class="text-xs text-slate-400">/mo</span></h2>
  <ul class="my-4 text-xs space-y-2 text-slate-300">
    <li>✔ Node Host SLA</li>
  </ul>
  <button class="w-full bg-violet-600 py-2.5 rounded font-semibold text-xs mt-2">Initialize Tier</button>
</div>`,
    previewRender: () => {
      const showToast = usePreviewToast();
      return (
        <div className="py-4 flex justify-center">
          <div className="relative w-full max-w-sm rounded-[24px] overflow-hidden bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-white/10 shadow-xl text-slate-800 dark:text-white">
            {/* Soft decorative background radial shape */}
            <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-violet-600/10 dark:bg-violet-600/20 blur-3xl pointer-events-none" />

            <div className="flex justify-between items-center bg-emerald-500/10 dark:bg-white/5 border border-emerald-500/25 dark:border-white/10 px-3.5 py-1 rounded-full w-max text-[9px] font-mono tracking-wider text-emerald-650 dark:text-emerald-400">
              🛡️ FREE LICENSE
            </div>

            <div className="mt-4">
              <span className="text-xs dark:text-slate-400">Aura Component Core</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-display font-semibold">$0</span>
                <span className="text-[10px] dark:text-slate-400 font-mono">/ completely free flat</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Provides lifetime custom access grants, high fidelity templates, micro form components, and our dynamic code panel updates on demand.
            </p>

            <div className="my-4 flex flex-col gap-2 py-2.5 border-t border-slate-500/10 border-b">
              {['Unlimited Free Components', 'Complete JSX & Tailwind Specs', 'Theme-Customizer Color Springing', '24/7 Priority Discord Support'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-[11px] font-semibold">{item}</span>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => showToast("Unlocked seat simulator! Template files open.")}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-semibold cursor-pointer shadow-md"
            >
              Get Component Template
            </motion.button>
          </div>
        </div>
      );
    }
  },

  // 10. HERO SECTIONS
  {
    id: 'cyberpunk-split-hero',
    name: 'Split Layout Cyber Hero',
    category: 'Hero sections',
    description: 'A layout illustrating high-contrast split typography, geometric dashed grid panels, and staggered layout entries.',
    tags: ['New'],
    dependencies: ['motion/react', 'lucide-react'],
    installation: `npm install motion lucide-react`,
    codeJSX: `import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function SplitHero() {
  return (
    <section className="relative w-full max-w-5xl mx-auto py-12 px-6 overflow-hidden bg-slate-950 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Pitch Copy content */}
        <div className="flex flex-col gap-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/20 px-3.5 py-1.5 rounded-full text-xs text-violet-400 w-max">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Deploy Next Generation UI</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-semibold leading-tight text-white">
            Next Generation UI for <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-emerald-400 bg-clip-text text-transparent">React Developers</span>
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-md">
            Skip design mockups. Browse hundreds of beautiful, hand-tested components, modify springs, clone Tailwind selectors, and launch.
          </p>
          <div className="flex items-center gap-3.5">
            <button className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl text-xs flex items-center gap-2">
              Start Free Trial <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button className="px-5 py-2.5 border border-white/10 hover:bg-white/5 text-white font-medium rounded-xl text-xs">
              Preview Bento Grid
            </button>
          </div>
        </div>

        {/* Floating Code UI Side elements */}
        <div className="relative flex items-center justify-center p-4">
          <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-500 to-indigo-500 blur-2xl opacity-15" />
          <div className="relative bg-slate-900 border border-white/10 w-full max-w-sm rounded-2xl p-4 shadow-2xl font-mono text-[11px] text-violet-300">
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-3.5 mb-3 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="ml-[10px] text-[10px]">AuraEnclave.tsx</span>
            </div>
            <p className="text-[#a855f7]">// Configure responsive node grids</p>
            <p className="text-slate-300"><span className="text-pink-400">const</span> cluster = <span className="text-emerald-400">useNode()</span>;</p>
            <p className="text-slate-300">cluster.map((host) =&gt; &#123;</p>
            <p className="text-slate-400">  return &lt;<span className="text-violet-400">EnclaveEnforcer</span> id=&#123;host&#125; /&gt;</p>
            <p className="text-slate-300">&#125;);</p>
          </div>
        </div>
      </div>
    </section>
  );
}`,
    codeTailwind: `<section class="bg-slate-950 py-12 px-6 text-white grid grid-cols-1 md:grid-cols-2 gap-8 items-center rounded-2xl">
  <div>
    <h1 class="text-4xl font-display font-bold">Deploy Next Generation UI</h1>
    <p class="text-sm text-slate-400 my-4">Hand-tested React modules.</p>
    <button class="bg-violet-600 px-4 py-2.5 text-xs font-semibold rounded">Clone Library</button>
  </div>
  <div class="bg-slate-900 p-4 rounded border border-slate-800 text-xs font-mono">Terminal active</div>
</section>`,
    previewRender: () => {
      const showToast = usePreviewToast();
      return (
        <div className="py-2 border border-slate-500/10 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950/70">
          <section className="relative w-full max-w-3xl mx-auto py-8 px-4 text-slate-800 dark:text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="flex flex-col gap-4 text-left">
                <span className="inline-flex items-center gap-1.5 bg-violet-500/10 dark:bg-gradient-to-r dark:from-violet-500/10 dark:to-pink-500/10 border border-violet-500/20 px-3 py-1 rounded-full text-[10px] text-violet-600 dark:text-violet-400 w-max font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" /> Fully Responsive Preview
                </span>
                <h1 className="text-2xl md:text-3xl font-display font-semibold leading-tight">
                  High-Fidelity <span className="bg-gradient-to-r from-violet-600 via-pink-400 to-[#10b981] bg-clip-text text-transparent">Design System</span>
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Avoid structural boilerplate. Extract copyable fragments to orchestrate gorgeous dashboards, biometric grids, and input nodes.
                </p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => showToast("Dispatched trial sandbox invite!")}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg text-[11px] flex items-center gap-1.5 cursor-pointer"
                  >
                    Launch Core <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="relative p-2 flex justify-center">
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-cyan-500 to-indigo-500 blur-xl opacity-10 pointer-events-none" />
                <div className="relative bg-white dark:bg-slate-900 border border-slate-300/15 dark:border-white/10 w-full max-w-xs rounded-xl p-3 shadow-lg font-mono text-[9px] text-[#a855f7]">
                  <div className="flex items-center gap-1 border-b border-slate-500/10 pb-2 mb-2 text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="ml-[4px] text-[8px]">CoreComponent.tsx</span>
                  </div>
                  <p className="text-slate-400">// Responsive micro animation anchor</p>
                  <p className="text-slate-800 dark:text-slate-300"><span className="text-pink-500">const</span> element = <span className="text-emerald-500">usePortal()</span>;</p>
                  <p className="text-slate-800 dark:text-slate-300">return &lt;<span className="text-violet-500">AuraRenderer</span> focus=&#123;true&#125; /&gt;</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      );
    }
  },

  // 11. DASHBOARDS
  {
    id: 'compact-stats-dashboard',
    name: 'Minimalist Metrics Dashboard',
    category: 'Dashboards',
    description: 'A compact dashboard displaying system parameters, interactive active stats switches, and glowing performance graphs.',
    tags: ['Popular'],
    dependencies: ['motion/react', 'lucide-react'],
    installation: `npm install motion lucide-react`,
    codeJSX: `import { useState } from 'react';
import { Terminal, Server, Sliders, ArrowUpRight } from 'lucide-react';

export default function MiniDashboard() {
  const [activeSegment, setActiveSegment] = useState('bandwidth');

  return (
    <div className="w-full max-w-md bg-slate-950 rounded-2xl border border-white/5 p-5 shadow-2xl">
      <div className="flex justify-between items-center border-b border-white/5 pb-3">
        <span className="text-xs text-white font-display font-medium flex items-center gap-1.5">
          <Terminal className="text-violet-400 w-4 h-4" /> Operations Console
        </span>
        <span className="px-2 py-0.5 text-[9px] font-mono bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
          NODE ONLINE
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3.5 my-4">
        {[
          { id: 'bandwidth', label: 'Flow Rate', value: '47.5 GB/s' },
          { id: 'latency', label: 'Ping Delay', value: '1.24 ms' },
          { id: 'nodes', label: 'Host Hosts', value: '81 Active' },
        ].map((item) => {
          const isSel = activeSegment === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSegment(item.id)}
              className={\`p-3 rounded-xl border text-left cursor-pointer transition-all duration-300 \${
                isSel ? 'border-violet-500/20 bg-violet-600/10' : 'border-white/5 hover:bg-white/5 bg-slate-900/40'
              }\`}
            >
              <span className="text-[10px] text-slate-400">{item.label}</span>
              <h4 className="text-sm font-semibold text-white mt-1">{item.value}</h4>
            </button>
          );
        })}
      </div>

      {/* Dynamic Graph Indicator Box */}
      <div className="relative h-20 bg-slate-900 rounded-xl overflow-hidden p-2 border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-pink-500/10 animate-pulse-glow" />
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 font-mono text-[9px] text-[#4ea8ff]">
          <Server className="w-3.5 h-3.5" /> Selected parameter: {activeSegment.toUpperCase()} SPEC
        </div>
      </div>
    </div>
  );
}`,
    codeTailwind: `<div class="bg-slate-900 border border-slate-800 p-4 rounded-xl text-white w-80">
  <div class="flex justify-between text-xs pb-2 border-b border-slate-800">
    <span>Telemetry Cluster</span>
    <span class="text-emerald-400 font-mono">OK</span>
  </div>
  <div class="my-3 text-2xl font-bold font-mono">1.2ms</div>
  <div class="bg-slate-950 p-2 text-xs rounded border border-slate-800">Graph Placeholder</div>
</div>`,
    previewRender: () => {
      const [activeSegment, setActiveSegment] = useState('bandwidth');
      const showToast = usePreviewToast();

      return (
        <div className="py-4 flex justify-center text-slate-800 dark:text-white">
          <div className="w-full max-w-sm bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-white/5 p-4 shadow-xl text-left">
            <div className="flex justify-between items-center border-b border-slate-300/10 pb-2.5">
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <Terminal className="text-violet-500 w-4 h-4" /> Ecosystem Telemetry
              </span>
              <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full px-2 py-0.5 border border-emerald-500/25">
                ● EMULATOR ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 my-3">
              {[
                { id: 'bandwidth', label: 'Ref Rate', value: '47.1 GB/s' },
                { id: 'latency', label: 'Ack Time', value: '1.24 ms' },
                { id: 'nodes', label: 'E-Seats', value: '25 Active' },
              ].map((item) => {
                const isSel = activeSegment === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSegment(item.id);
                      showToast(`Switched telemetry to ${item.label}`);
                    }}
                    className={`p-2 rounded-lg border text-left cursor-pointer transition-all duration-300 ${
                      isSel 
                        ? 'border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-white' 
                        : 'border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="text-[8px] tracking-wide font-medium">{item.label}</span>
                    <h4 className="text-[11px] font-bold mt-0.5">{item.value}</h4>
                  </button>
                );
              })}
            </div>

            {/* Simulated Data Bar Chart */}
            <div className="relative h-16 bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-500/10 p-2 flex items-end justify-between gap-1">
              {[33, 45, 21, 62, 55, 87, 44, 95, 66, 78, 52, 90, 81, 72].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: i * 0.05 }}
                  className={`w-full rounded-t-sm ${activeSegment === 'bandwidth' ? 'bg-violet-500' : activeSegment === 'latency' ? 'bg-pink-500' : 'bg-[#10b981]'}`}
                />
              ))}
              <div className="absolute inset-x-0 bottom-1 flex items-center justify-center font-mono text-[8px] bg-white/70 dark:bg-slate-950/70 p-0.5 border border-slate-500/10 pointer-events-none">
                SIMULATING REALTIME STOCHASTIC METRIC GRIDS
              </div>
            </div>
          </div>
        </div>
      );
    }
  },

  // 12. TESTIMONIALS
  {
    id: 'carousel-quotes',
    name: 'Dynamic Quote Testimonial Card',
    category: 'Testimonials',
    description: 'A quote card with ratings feedback sliders, soft user avatars, and fluid sliding active comments feedback.',
    tags: [],
    dependencies: ['motion/react', 'lucide-react'],
    installation: `npm install motion lucide-react`,
    codeJSX: `import { Star, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GlassReview() {
  return (
    <div className="relative w-80 rounded-2xl bg-slate-950 p-5 border border-white/5 shadow-2xl">
      <div className="flex items-center gap-1.5 text-yellow-500">
        {[1,2,3,4,5].map((s) => (
          <Star key={s} className="w-3.5 h-3.5 fill-current" />
        ))}
      </div>
      <p className="text-xs text-slate-300 italic mt-3 leading-relaxed">
        "Aura components saved us over 80 hours of bespoke WebGL prototyping. The layout parameters and spring stiffness selectors are pure magic."
      </p>
      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/5">
        <div className="w-8 h-8 rounded-full bg-violet-600/30 flex items-center justify-center text-white text-[11px] font-bold border border-violet-500/50">
          AD
        </div>
        <div>
          <h4 className="text-xs font-semibold text-white">Alexander Drake</h4>
          <span className="text-[10px] text-slate-500">Lead Architect, Vercel Hub</span>
        </div>
      </div>
    </div>
  );
}`,
    codeTailwind: `<div class="bg-slate-900 border border-slate-800 p-5 rounded-xl text-white w-72">
  <div class="text-yellow-400 mb-2">★★★★★</div>
  <p class="text-xs text-slate-300">Saved us weeks of visual styling work.</p>
  <h4 class="text-xs font-bold mt-3">Sasha Grey</h4>
</div>`,
    previewRender: () => {
      const testimonials = [
        { name: "Serena Vance", role: "Design Director", comp: "Stripe Flow", text: "Aura components saved us over 80 hours of bespoke visual prototyping. The responsive previews and structural layout parameters are pure genius.", init: "SV" },
        { name: "Marcus Finch", role: "Principal Architect", comp: "Supabase Core", text: "The glassmorphism gradients and custom Spring physics render instantly on both Safari and Chrome. True frontend craftsmanship.", init: "MF" }
      ];
      const [idx, setIdx] = useState(0);

      return (
        <div className="py-4 flex flex-col items-center justify-center text-slate-800 dark:text-white">
          <div className="relative w-full max-w-sm rounded-[20px] bg-white dark:bg-slate-950 p-5 border border-slate-200 dark:border-white/5 shadow-xl text-left">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-0.5 text-yellow-500">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className="w-3 h-3 fill-current" />
                ))}
              </div>
              <span className="text-[8px] font-mono text-violet-500">CLIENT VERIFIED</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={idx}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="text-xs text-slate-600 dark:text-slate-300 italic min-h-[50px] leading-relaxed"
              >
                "{testimonials[idx].text}"
              </motion.p>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-500/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-violet-600/10 dark:bg-violet-600/30 flex items-center justify-center text-violet-700 dark:text-white text-[11px] font-bold border border-violet-500/20">
                  {testimonials[idx].init}
                </div>
                <div>
                  <h4 className="text-[11px] font-bold">{testimonials[idx].name}</h4>
                  <span className="text-[9px] dark:text-slate-400">{testimonials[idx].role}, {testimonials[idx].comp}</span>
                </div>
              </div>

              <button 
                onClick={() => setIdx((prev) => (prev === 0 ? 1 : 0))}
                className="text-[10px] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Next Quote
              </button>
            </div>
          </div>
        </div>
      );
    }
  },

  // 13. FOOTERS
  {
    id: 'bento-grid-footer',
    name: 'Bento Modern Footer Map',
    category: 'Footers',
    description: 'A structured layout bento footer complete with quick newsletter validation fields, custom social linkages, and grid separators.',
    tags: [],
    dependencies: ['motion/react', 'lucide-react'],
    installation: `npm install motion lucide-react`,
    codeJSX: `import { Send, Hexagon } from 'lucide-react';

export default function BentoFooter() {
  return (
    <footer className="w-full max-w-4xl mx-auto py-10 px-5 bg-slate-950 rounded-2xl border border-white/5 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Core Identity */}
        <div className="md:col-span-1.5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-white">
            <Hexagon className="w-5 h-5 text-violet-400 rotate-12" />
            <span className="font-display font-medium text-sm tracking-widest uppercase">AURA</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Beautifully functional React models engineered to serve state-of-the-art web enclaves. Just preview, copy, and implement.
          </p>
        </div>

        {/* Categories Link Columns */}
        <div className="flex flex-col gap-2">
          <span className="text-xs text-white uppercase font-mono tracking-widest">Resources</span>
          {['Components', 'Theme Matrix', 'Enterprise SaaS', 'Spring Docs'].map((lnk) => (
            <a key={lnk} href="#" className="text-xs text-slate-500 hover:text-white transition-colors">
              {lnk}
            </a>
          ))}
        </div>

        {/* Newsletter Subscription Box */}
        <div className="md:col-span-1.5 flex flex-col gap-3.5">
          <span className="text-xs text-white uppercase font-mono tracking-widest">Join Enclave Feed</span>
          <div className="relative">
            <input 
              type="email" 
              placeholder="operator@system.com" 
              className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 pl-3 pr-10 text-xs text-white placeholder-slate-600 focus:outline-none" 
            />
            <button className="absolute right-2 top-2.5 p-1 bg-violet-600 hover:bg-violet-500 text-white rounded-lg">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}`,
    codeTailwind: `<footer class="bg-slate-950 border border-slate-800 p-6 rounded-2xl text-white text-xs grid grid-cols-2 gap-4">
  <div>
    <h4 class="font-bold">Aura UI</h4>
    <p class="text-slate-500 mt-2">Beautiful React copy-paste modules.</p>
  </div>
  <div>
    <h4>Newsletter</h4>
    <input type="email" placeholder="dev@example.com" class="bg-slate-900 p-2 mt-2 w-full rounded border border-slate-800" />
  </div>
</footer>`,
    previewRender: () => {
      const showToast = usePreviewToast();
      const [emailStr, setEmailStr] = useState('');

      return (
        <div className="py-2 flex justify-center text-slate-800 dark:text-white">
          <div className="w-full max-w-xl bg-slate-100 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-white/5 flex flex-col gap-4 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="font-display font-medium text-[10px] tracking-wider text-slate-700 dark:text-slate-300">SYSTEM CORES</span>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Copy-to-clipboard responsive blocks constructed to bypass visual prototypes entirely. Just trigger raw elements.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-display font-medium text-[10px] tracking-wider text-slate-700 dark:text-slate-300">Enclave Feed</span>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="operator@service.com"
                    value={emailStr}
                    onChange={(e) => setEmailStr(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-lg py-1.5 pl-2 pr-9 text-[10px] focus:outline-none"
                  />
                  <button 
                    onClick={() => {
                      if (emailStr.includes('@')) {
                        showToast(`Registered email feed in simulator!`);
                        setEmailStr('');
                      } else {
                        showToast(`Invalid placeholder format!`);
                      }
                    }}
                    className="absolute right-1 top-1.5 p-1 bg-violet-600 text-white rounded cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-500/10 pt-2 flex justify-between items-center text-[9px] text-[#8b5cf6] font-mono leading-none">
              <span>© {new Date().getFullYear()} UI COMPONENT SYSTEM</span>
              <span>EST. D-GRID CORE INC</span>
            </div>
          </div>
        </div>
      );
    }
  },

  // 14. AUTHENTICATION UI
  {
    id: 'biometric-scanner-auth',
    name: 'Biometric Verification Simulator',
    category: 'Authentication UI',
    description: 'An authentication screen simulator featuring biometric interactive icons, fingerprint scanning animations, and inline validation logs.',
    tags: ['Pro', 'New'],
    dependencies: ['motion/react', 'lucide-react'],
    installation: `npm install motion lucide-react`,
    codeJSX: `import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Shield, Check } from 'lucide-react';

export default function BiometricAuth() {
  const [phase, setPhase] = useState('idle'); // idle | scanning | verified

  const triggerScan = () => {
    if (phase !== 'idle') return;
    setPhase('scanning');
    setTimeout(() => {
      setPhase('verified');
      setTimeout(() => setPhase('idle'), 2500);
    }, 2000);
  };

  return (
    <div className="relative w-72 rounded-2xl bg-slate-950 p-6 border border-white/5 shadow-2xl flex flex-col items-center">
      <h3 className="font-display font-medium text-white text-base">Cluster Access Verified</h3>
      <p className="text-[10px] text-slate-400 mt-1 max-w-[190px] text-center">Press the scan surface below to initiate biometric verification</p>

      <div className="my-6 relative flex items-center justify-center cursor-pointer" onClick={triggerScan}>
        {/* Animated laser line during scan */}
        {phase === 'scanning' && (
          <motion.div
            initial={{ top: '0%' }}
            animate={{ top: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-0 right-0 h-[2px] bg-cyan-400 shadow-lg shadow-cyan-400/50 z-20 pointer-events-none"
          />
        )}

        <div className={\`w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all \${
          phase === 'verified' ? 'border-[#10b981] bg-[#10b981]/10 text-[#10b981]' : 
          phase === 'scanning' ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400 animate-pulse' : 
          'border-violet-500/30 text-violet-400 hover:border-violet-500 hover:bg-violet-500/10'
        }\`}>
          <Fingerprint className="w-10 h-10 shrink-0" />
        </div>
      </div>

      <div className="h-6 flex items-center justify-center font-mono text-[10px]">
        {phase === 'idle' && <span className="text-slate-500">READY</span>}
        {phase === 'scanning' && <span className="text-cyan-400 uppercase tracking-widest animate-pulse">CRYPTONODE ENCRYPTING...</span>}
        {phase === 'verified' && <span className="text-emerald-400 uppercase tracking-wider flex items-center gap-1"><Check className="w-3 h-3" /> CREDENTIAL MATCH!</span>}
      </div>
    </div>
  );
}`,
    codeTailwind: `<div class="bg-slate-950 border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-white w-72">
  <div class="w-16 h-16 rounded-full border border-violet-500/30 flex items-center justify-center text-violet-400 my-4">Fingerprint Icon</div>
  <button class="bg-violet-600 px-4 py-2 font-mono text-xs rounded">Scan FaceID</button>
</div>`,
    previewRender: () => {
      const [phase, setPhase] = useState<'idle' | 'scanning' | 'verified'>('idle');
      const showToast = usePreviewToast();

      const triggerScan = () => {
        if (phase !== 'idle') return;
        setPhase('scanning');
        showToast("Triggered fingerprint enclave scan!");
        setTimeout(() => {
          setPhase('verified');
          showToast("Access key mapped! Simulator verified.");
          setTimeout(() => setPhase('idle'), 2500);
        }, 2000);
      };

      return (
        <div className="py-4 flex justify-center text-slate-800 dark:text-white">
          <div className="relative w-full max-w-sm rounded-[24px] bg-slate-50 dark:bg-slate-950 p-6 border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col items-center text-center">
            <h3 className="font-display font-semibold text-sm">Cluster Security Key</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 max-w-[200px] leading-normal">
              Press the fingerprint node below to simulate hardware verification enclaves.
            </p>

            <div className="my-5 relative flex items-center justify-center cursor-pointer" onClick={triggerScan}>
              {/* Scan Beam */}
              {phase === 'scanning' && (
                <motion.div
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute left-0 right-0 h-[2.5px] bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] z-10 pointer-events-none"
                />
              )}

              <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer ${
                phase === 'verified' ? 'border-[#10b981] bg-[#10b981]/10 text-[#10b981]' : 
                phase === 'scanning' ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400 animate-pulse' : 
                'border-violet-500/20 text-violet-500 hover:border-violet-500 hover:bg-violet-500/15'
              }`}>
                <Fingerprint className="w-8 h-8 shrink-0" />
              </div>
            </div>

            <div className="h-4 flex items-center justify-center font-mono text-[9px] tracking-widest">
              {phase === 'idle' && <span className="text-slate-400 uppercase">SYS_READY_AURA</span>}
              {phase === 'scanning' && <span className="text-cyan-500 uppercase animate-pulse">MAPPING_BIO_GRID...</span>}
              {phase === 'verified' && <span className="text-[#10b981] uppercase font-bold flex items-center gap-1 animate-bounce">🔑 KEY_MATCHED_ACK</span>}
            </div>
          </div>
        </div>
      );
    }
  },

  // 15. ECOMMERCE UI
  {
    id: 'premium-product-canvas',
    name: 'Interactive Premium Product Canvas',
    category: 'Ecommerce UI',
    description: 'A stellar layout details card with responsive size matrix nodes, pricing counters, and fluid active cart slides.',
    tags: ['Popular'],
    dependencies: ['motion/react', 'lucide-react'],
    installation: `npm install motion lucide-react`,
    codeJSX: `import { useState } from 'react';
import { ShoppingBag, Star, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCard() {
  const [selectedSize, setSelectedSize] = useState('8G');
  const [favorite, setFavorite] = useState(false);

  return (
    <div className="relative w-80 rounded-2xl bg-slate-950 p-5 border border-white/5 shadow-2xl">
      {/* Product graphics card placeholder */}
      <div className="relative w-full h-40 rounded-xl bg-gradient-to-br from-violet-600/10 via-pink-400/10 to-transparent flex items-center justify-center border border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient" />
        <div className="relative w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white text-lg font-bold">
          AURA
        </div>
      </div>

      <div className="flex justify-between items-start mt-4">
        <div>
          <h4 className="text-sm font-semibold text-white">Quantum Enclave Node V4</h4>
          <span className="text-[10px] text-zinc-400 font-mono">Series Hardware Cluster</span>
        </div>
        <button 
          onClick={() => setFavorite(!favorite)}
          className={\`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors \${
            favorite ? 'bg-pink-500/10 border-pink-500 text-pink-500' : 'bg-white/5 border-white/5 text-slate-400'
          }\`}
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>

      <div className="my-4 flex justify-between items-center text-xs">
        <span className="text-slate-400 font-semibold font-display">Cluster VRAM Selection</span>
        <div className="flex gap-1">
          {['8G', '16G', '32G'].map((size) => {
            const isSel = selectedSize === size;
            return (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={\`px-2.5 py-1 rounded font-mono text-[9px] transition-colors \${
                  isSel ? 'bg-violet-600 text-white font-bold' : 'bg-white/5 text-slate-400 hover:text-white'
                }\`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-white/5 pt-3 flex justify-between items-center mt-2">
        <div>
          <span className="text-[9px] text-slate-500 block">Seat License Cost</span>
          <span className="text-base font-bold text-white">$145</span>
        </div>
        <button className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-violet-600/25">
          <ShoppingBag className="w-3.5 h-3.5" />
          Assign Cluster
        </button>
      </div>
    </div>
  );
}`,
    codeTailwind: `<div class="bg-slate-900 border border-slate-800 p-5 rounded-xl text-white w-72">
  <div class="h-32 bg-slate-950 rounded mb-3 flex items-center justify-center">Image</div>
  <h3 class="text-xs font-bold">Node Hardware Kit</h3>
  <span class="text-sm font-semibold text-slate-400 mt-2 block">$145</span>
</div>`,
    previewRender: () => {
      const [selectedSize, setSelectedSize] = useState('16G');
      const [favorite, setFavorite] = useState(false);
      const showToast = usePreviewToast();

      return (
        <div className="py-4 flex justify-center text-slate-800 dark:text-white">
          <div className="relative w-full max-w-sm rounded-[24px] bg-slate-100 dark:bg-slate-950 p-5 border border-slate-200 dark:border-white/5 shadow-xl text-left">
            <div className="relative w-full h-32 rounded-xl bg-gradient-to-tr from-violet-600/10 via-[#10b981]/15 to-transparent flex items-center justify-center border border-slate-200 dark:border-white/5 overflow-hidden">
              <div className="relative w-16 h-16 bg-white border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center text-violet-700 dark:text-white text-xs font-bold shadow-md">
                AURA PACK
              </div>
            </div>

            <div className="flex justify-between items-start mt-3">
              <div>
                <h4 className="text-xs font-bold truncate">Premium Matrix Processor</h4>
                <span className="text-[9px] dark:text-slate-400 font-mono">Edge Cluster Accelerator</span>
              </div>
              <button
                onClick={() => {
                  setFavorite(!favorite);
                  showToast(favorite ? "Removed from bookmarks!" : "Saved to premium workspace bookmark!");
                }}
                className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                  favorite ? 'bg-pink-500/10 border-pink-500 text-pink-500' : 'bg-slate-200 dark:bg-white/5 border-slate-300 dark:border-white/5 text-slate-400'
                }`}
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>

            <div className="my-3 flex justify-between items-center text-xs">
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold font-display">VRAM selection</span>
              <div className="flex gap-1">
                {['16G', '32G', '64G'].map((size) => {
                  const isSel = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-2 py-0.5 rounded font-mono text-[9px] transition-colors cursor-pointer ${
                        isSel ? 'bg-violet-600 text-white font-bold' : 'bg-slate-200 dark:bg-white/5 text-slate-500 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-500/10 pt-3 flex justify-between items-center mt-2">
              <div>
                <span className="text-[8px] dark:text-slate-500 block leading-none">Seat License</span>
                <span className="text-base font-semibold leading-none">$149</span>
              </div>
              <button 
                onClick={() => showToast(`Purchased Matrix Accelerator - size ${selectedSize} (Simulator only)`)}
                className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer shadow-lg"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Allocate seat
              </button>
            </div>
          </div>
        </div>
      );
    }
  }
,
  // 16. CYBERPUNK GLITCH BUTTON - UIVERSE SPECIALTY
  {
    id: 'cyberpunk-glitch-button',
    name: 'Cybernetic Glitch Neon Action Trigger',
    category: 'Buttons',
    description: 'A masterpiece from the Uiverse collection: a high-contrast futuristic trigger displaying structural offset outlines, warning strips, and instant double-flicker hover sequences.',
    tags: ['New', 'Popular'],
    dependencies: ['motion/react', 'lucide-react'],
    installation: `npm install motion lucide-react`,
    codeJSX: `import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function CybermaticButton() {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="relative px-8 py-3.5 border-2 border-cyan-500 bg-black text-xs font-bold font-mono tracking-[0.2em] text-cyan-400 uppercase select-none group focus:outline-none"
    >
      {/* Glitched Offset Duplicate Outlines */}
      <span className="absolute inset-0 border-2 border-pink-500 translate-x-[4px] translate-y-[4px] group-hover:-translate-x-[4px] group-hover:-translate-y-[4px] transition-transform duration-300 pointer-events-none -z-10" />
      
      {/* Back glow */}
      <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-500 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 -z-25" />
      
      {/* Corner hazard warning brackets */}
      <span className="absolute top-1 left-1 hover:animate-ping text-[6px] text-pink-500">▶</span>
      
      <div className="flex items-center gap-2 relative z-10">
        <Zap className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
        <span className="relative group-hover:text-white transition-colors">
          ENGAGE_MATRIX
        </span>
      </div>
    </motion.button>
  );
}`,
    codeTailwind: `<button class="relative px-8 py-3.5 border-2 border-cyan-500 bg-black text-xs font-bold font-mono tracking-widest text-[#06b6d4] uppercase group transition-transform hover:scale-105 active:scale-95 focus:outline-none">
  <!-- Glowing duplicate backing frame -->
  <span class="absolute inset-0 border-2 border-pink-500 translate-x-1 translate-y-1 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 pointer-events-none"></span>
  <span class="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 blur-xl"></span>
  <div class="flex items-center gap-1.5">
    <span class="text-pink-500">✦</span>
    <span class="group-hover:text-white">ENGAGE_MATRIX</span>
  </div>
</button>`,
    previewRender: () => {
      const showToast = usePreviewToast();
      return (
        <div className="py-8 flex flex-col items-center justify-center bg-[#050505] p-6 rounded-xl border border-white/5 w-full max-w-xs my-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => showToast("Glitch cyber portal engaged! Sector code authorized.")}
            className="relative px-7 py-3.5 border-2 border-cyan-500 bg-black text-[10px] font-bold font-mono tracking-[0.2em] text-cyan-400 uppercase select-none group cursor-pointer focus:outline-none"
          >
            {/* The absolute signature Uiverse glitched duplicate background */}
            <span className="absolute inset-0 border-2 border-pink-500 translate-x-[4px] translate-y-[4px] group-hover:-translate-x-[4px] group-hover:-translate-y-[4px] transition-transform duration-300 pointer-events-none" />
            <span className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-pink-500/20 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300 pointer-events-none" />
            
            <div className="flex items-center gap-2 relative z-10">
              <span className="text-pink-500 font-extrabold animate-pulse">✦</span>
              <span className="group-hover:text-white transition-colors duration-200">SYS_ENGAGE_MATRIX</span>
            </div>
          </motion.button>
          <span className="text-[8px] font-mono text-zinc-550 mt-4 uppercase tracking-widest text-[#a855f7]/60">UIVERSE.IO EXPERIMENTAL PLATFORM</span>
        </div>
      );
    }
  },

  // 17. HOLOGRAPHIC PHOSPHOR TERMINAL CARD
  {
    id: 'holographic-retro-card',
    name: 'Phosphor Cyberpunk Terminal Card',
    category: 'Cards',
    description: 'An interactive mainframe component showcasing rolling scanline indicators, mock data stream indicators, clickable terminal widgets, and retro pixel typography.',
    tags: ['New', 'Pro'],
    dependencies: ['motion/react', 'lucide-react'],
    installation: `npm install motion lucide-react`,
    codeJSX: `import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Shield, Zap } from 'lucide-react';

export default function RetroCard() {
  const [dataPackets, setDataPackets] = useState(1482);
  const [isSyncing, setIsSyncing] = useState(false);

  const simulateSync = () => {
    setIsSyncing(true);
    let count = 0;
    const interval = setInterval(() => {
      setDataPackets(prev => prev + Math.floor(Math.random() * 8) + 1);
      count++;
      if (count > 8) {
        clearInterval(interval);
        setIsSyncing(false);
      }
    }, 150);
  };

  return (
    <div className="relative w-80 bg-black border-2 border-[#10b981] p-5 rounded-md text-left font-mono text-[#10b981] overflow-hidden group shadow-[0_0_15px_rgba(16,185,129,0.15)]">
      {/* Phosphor rolling glass grid scanline */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.015)_1px,transparent_1px)] bg-[size:12px_12px] opacity-100 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[#10b981]/10 to-transparent animate-[shimmer_3s_infinite] pointer-events-none" />
      
      <div className="flex justify-between items-center border-b border-[#10b981]/30 pb-3.5 mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 animate-pulse" />
          <span className="text-[10px] font-bold tracking-widest uppercase">NODE_CONSOLE_01</span>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping" />
      </div>

      <div className="flex flex-col gap-3">
        <div className="text-[10px]">
          <span className="text-zinc-600 block">&gt; CORE_STATUS_MATRIX</span>
          <span className="text-white font-extrabold font-sans">SYS_ACTIVE_INTEGRATIVE</span>
        </div>

        <div className="text-[10px] bg-[#10b981]/5 border border-[#10b981]/25 p-2 rounded">
          <span className="text-zinc-500 block">&gt; FLOW_CAPACITY_VEC</span>
          <span className="text-xs font-bold font-mono tracking-widest">{dataPackets} PACKETS/SEC</span>
        </div>

        <button
          disabled={isSyncing}
          onClick={simulateSync}
          className="w-full mt-1.5 py-2 px-3 border border-[#10b981] bg-transparent hover:bg-[#10b981]/10 disabled:opacity-50 text-[10px] font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer text-center"
        >
          {isSyncing ? "SYNCING_PORTAL..." : "TRIGGER_DASHBOARD_PULSE"}
        </button>
      </div>
    </div>
  );
}`,
    codeTailwind: `<div class="relative w-80 bg-black border-2 border-[#10b981] p-5 rounded-md text-left font-mono text-[#10b981] overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.15)] group">
  <div class="absolute inset-0 bg-[radial-gradient(120px_circle_Var(--x,0px)_Var(--y,0px),_rgba(16,185,129,0.12),transparent)] pointer-events-none"></div>
  <div class="flex justify-between items-center border-b border-[#10b981]/30 pb-2 mb-3">
    <span class="text-[10px] font-bold">NODE_CONSOLE</span>
    <span class="w-2 h-2 rounded-full bg-[#10b981] animate-ping"></span>
  </div>
  <p class="text-[11px] text-white">SYS_ACTIVE_INTEGRATIVE</p>
</div>`,
    previewRender: () => {
      const [packets, setPackets] = useState(9942);
      const [loading, setLoading] = useState(false);
      const showToast = usePreviewToast();

      const runTrigger = () => {
        if (loading) return;
        setLoading(true);
        showToast("Holographic network pulse dispatched!");
        let count = 0;
        const h = setInterval(() => {
          setPackets(v => v + Math.floor(Math.random() * 25) + 5);
          count++;
          if (count > 6) {
            clearInterval(h);
            setLoading(false);
          }
        }, 120);
      };

      return (
        <div className="py-4 flex justify-center w-full max-w-sm">
          <div className="relative w-full bg-black border-2 border-emerald-500/70 p-5 rounded text-left font-mono text-emerald-400 overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.12)]">
            {/* Phosphor Lines matrix */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.012)_1px,transparent_1px)] bg-[size:10px_10px]" />
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500/10 shadow-[0_0_8px_emerald-500] animate-[shimmer_4s_infinite] pointer-events-none" />

            <div className="flex justify-between items-end border-b border-emerald-500/20 pb-3 mb-3.5">
              <span className="text-[10px] font-bold tracking-widest text-emerald-400">⚡ ENCLAVE_EMULATOR_V4</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="text-[9px]">
                <span className="text-zinc-600 block leading-none mb-1">&gt; ACTIVE_COORDINATE_PORT</span>
                <span className="text-white text-[11px] font-semibold tracking-wider font-sans leading-none block">CUPERTINO_NODE_CLUSTER</span>
              </div>

              <div className="text-[9px] bg-emerald-500/[0.03] border border-emerald-500/20 p-2 rounded">
                <span className="text-zinc-500 block leading-none mb-1">&gt; REALTIME_INBOUND_ENCLAVE</span>
                <span className="text-xs font-bold tracking-widest text-[#10b981]">{packets} SECURE_FLUX</span>
              </div>

              <button
                disabled={loading}
                onClick={runTrigger}
                className="w-full mt-2 py-2 px-3 border border-emerald-500/60 hover:bg-emerald-500/10 text-[9px] font-bold uppercase tracking-wider text-center text-emerald-400 cursor-pointer disabled:opacity-40 transition-colors"
              >
                {loading ? "MAPPING_NETWORK..." : "INJECT_QUANTUM_SIGNAL"}
              </button>
            </div>
          </div>
        </div>
      );
    }
  },

  // 18. PULSAR ORBIT NEBULA ROTATING LOADER
  {
    id: 'orbit-pulsar-loader',
    name: 'Orbit Pulsar Nebula Rotating Loader',
    category: 'Loaders',
    description: 'An extraordinary loading spinner showcasing nested concentric orbits, secondary rotational frames, dynamic gradient trail layers, and an interactive core speed lever.',
    tags: ['New'],
    dependencies: ['motion/react', 'lucide-react'],
    installation: `npm install motion lucide-react`,
    codeJSX: `import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

export default function NebulaLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Concentric rotating outer trail orbits */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="absolute inset-0 rounded-full border-4 border-t-transparent border-b-transparent border-r-cyan-500 border-l-pink-500 blur-[1px]"
        />
        
        {/* Medium inverse track ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="absolute w-12 h-12 rounded-full border-2 border-t-purple-500 border-b-transparent border-r-transparent border-l-purple-500"
        />

        {/* Central glowing pulsar heart */}
        <motion.div
          animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.4, 0.9, 0.4] }}
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
          className="w-5 h-5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
        />
      </div>
      <span className="text-[10px] font-mono text-[#a855f7] tracking-widest uppercase animate-pulse">
        CALCULATING_MATRIX_ROTATIONS...
      </span>
    </div>
  );
}`,
    codeTailwind: `<div class="flex flex-col items-center justify-center gap-4">
  <div class="relative w-16 h-16 flex items-center justify-center">
    <div class="absolute inset-0 rounded-full border-4 border-t-cyan-500 border-pink-500 border-r-transparent border-l-transparent animate-spin"></div>
    <div class="absolute w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent border-b-transparent animate-[spin_1s_linear_infinite_reverse]"></div>
    <div class="w-4 h-4 rounded-full bg-[#06b6d4] shadow-[0_0_12px_rgba(6,182,212,0.8)] animate-pulse"></div>
  </div>
</div>`,
    previewRender: () => {
      const [speed, setSpeed] = useState<'normal' | 'overdrive'>('normal');
      const showToast = usePreviewToast();

      const toggleSpeed = () => {
        const next = speed === 'normal' ? 'overdrive' : 'normal';
        setSpeed(next);
        showToast(next === 'overdrive' ? "Nebula core accelerated to maximum spin rate!" : "Restored default safe speed metrics.");
      };

      return (
        <div className="py-6 flex flex-col items-center justify-center w-full max-w-sm">
          <div className="bg-slate-100 dark:bg-black p-6 rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col items-center gap-5 w-[100%]">
            <div className="relative w-20 h-20 flex items-center justify-center">
              {/* Outer rotational speed tracking frame */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: speed === 'normal' ? 2.5 : 0.8, ease: "linear" }}
                className="absolute inset-0 rounded-full border-4 border-t-cyan-500 border-b-emerald-400 border-r-transparent border-l-transparent blur-[0.5px]"
              />

              {/* Inverse inner tracker ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: speed === 'normal' ? 1.5 : 0.4, ease: "linear" }}
                className="absolute w-12 h-12 rounded-full border-2 border-t-pink-500 border-b-transparent border-r-pink-500 border-l-transparent"
              />

              {/* Pulsing central fuel star */}
              <motion.div
                animate={{ scale: speed === 'normal' ? [0.8, 1.1, 0.8] : [0.7, 1.3, 0.7] }}
                transition={{ repeat: Infinity, duration: speed === 'normal' ? 1.2 : 0.3, ease: "easeInOut" }}
                className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]"
              />
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest text-center">
                ACTIVE_REVOLUTION_RATE: <strong className={speed === 'overdrive' ? 'text-pink-500 animate-pulse' : 'text-cyan-500'}>{speed === 'normal' ? "3500_FLUX" : "9800_FLUX_MAX"}</strong>
              </span>

              <button
                onClick={toggleSpeed}
                className="px-3.5 py-1.5 border border-slate-350 dark:border-white/10 hover:border-cyan-500 hover:text-cyan-500 text-[9px] font-mono tracking-widest uppercase font-bold rounded cursor-pointer transition-colors bg-white dark:bg-zinc-950 text-slate-800 dark:text-slate-300"
              >
                ⚙ Switch rate ({speed === 'normal' ? 'engage lock' : 'restore normal'})
              </button>
            </div>
          </div>
        </div>
      );
    }
  },

  // 19. HIGH-FIDELITY INTERACTIVE GLASSMOPRHIC PRODUCT CARD WITH SIZE SELECTORS
  {
    id: 'interactive-product-card',
    name: 'Futuristic Glassmorphic Product Card',
    category: 'Cards',
    description: 'A premium product showcase card with a floating scale-adaptive vector, active color-ring selection parameters, active size buttons, and high-fidelity shadow overlay frames.',
    tags: ['New', 'Popular'],
    dependencies: ['motion/react', 'lucide-react'],
    installation: `npm install motion lucide-react`,
    codeJSX: `import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Heart } from 'lucide-react';

export default function GlassProductCard() {
  const [selectedSize, setSelectedSize] = useState('10');
  const [favorite, setFavorite] = useState(false);
  const [activeColor, setActiveColor] = useState('#f43f5e');

  const colors = ['#f43f5e', '#3b82f6', '#10b981'];

  return (
    <div className="relative w-80 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-5 text-white overflow-hidden shadow-2xl group">
      {/* Glow Effect */}
      <div 
        className="absolute -top-20 -left-20 w-48 h-48 rounded-full blur-3xl opacity-30 transition-all duration-700 group-hover:scale-125 pointer-events-none"
        style={{ backgroundColor: activeColor }}
      />
      
      {/* Product Image Stage */}
      <div className="relative w-full h-44 rounded-2xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/5 flex items-center justify-center p-4 overflow-hidden mb-4">
        <Heart 
          onClick={() => setFavorite(!favorite)}
          className={\`absolute top-3 right-3 w-5 h-5 cursor-pointer transition-all duration-300 \${favorite ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-400 hover:text-white'}\`}
        />
        
        {/* Animated Flying Sphere Asset */}
        <motion.div 
          animate={{ 
            y: [-6, 6, -6],
            rotate: [0, 15, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 5, 
            ease: "easeInOut" 
          }}
          className="w-24 h-24 rounded-full relative flex items-center justify-center shadow-2xl"
          style={{ 
            background: \`radial-gradient(circle at 30% 30%, \${activeColor}, #050510)\`,
            boxShadow: \`0 10px 30px \${activeColor}44\`
          }}
        >
          <div className="absolute inset-0.5 rounded-full border border-white/20 animate-pulse" />
          <span className="font-display font-black text-white text-xs opacity-80 tracking-widest uppercase">AURA S4</span>
        </motion.div>
      </div>

      {/* Metrics */}
      <div className="flex justify-between items-start mb-2.5">
        <div>
          <span className="text-[10px] text-rose-400 font-mono tracking-widest uppercase">SUMMIT SERIES</span>
          <h4 className="text-base font-bold tracking-tight">Krypton Core Sphere</h4>
        </div>
        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>4.9</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-4 leading-relaxed line-clamp-2">
        Intelligent quantum state stabilizer equipped with atmospheric multi-core vector synchronization fields.
      </p>

      {/* Selectors */}
      <div className="flex justify-between items-center mb-5 gap-2">
        {/* Colors */}
        <div className="flex gap-2">
          {colors.map(col => (
            <button
              key={col}
              onClick={() => setActiveColor(col)}
              className={\`w-5 h-5 rounded-full border-2 transition-all duration-300 \${activeColor === col ? 'border-white scale-110' : 'border-transparent'}\`}
              style={{ backgroundColor: col }}
            />
          ))}
        </div>
        
        {/* Sizes */}
        <div className="flex gap-1 bg-white/5 rounded-lg p-1 border border-white/5">
          {['9', '10', '11'].map(sz => (
            <button
              key={sz}
              onClick={() => setSelectedSize(sz)}
              className={\`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all \${selectedSize === sz ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-white'}\`}
            >
              US {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Footer price & purchase CTA */}
      <div className="flex justify-between items-center border-t border-white/5 pt-4">
        <div>
          <span className="text-[10px] text-slate-500 block">BASE METRIC PRICE</span>
          <span className="text-lg font-bold font-mono text-emerald-400">$340.00</span>
        </div>
        <button
          className="px-4 py-2 bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-[11px] rounded-xl flex items-center gap-1.5 transition-all active:scale-95"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          BUY NOW
        </button>
      </div>
    </div>
  );
}`,
    codeTailwind: `<div class="relative w-80 bg-slate-900 border border-white/10 rounded-3xl p-5 text-white overflow-hidden shadow-2xl group">
  <div class="relative w-full h-44 rounded-2xl bg-white/5 flex items-center justify-center p-4">
    <div class="w-24 h-24 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 animate-pulse"></div>
  </div>
  <div class="flex justify-between items-center mt-4">
    <h4 class="text-base font-bold">Krypton Core Sphere</h4>
    <span class="text-xs text-amber-400">★ 4.9</span>
  </div>
  <p class="text-xs text-slate-400 mt-2">Intelligent quantum core stabilizer.</p>
  <div class="flex justify-between items-center mt-5 border-t border-white/5 pt-4">
    <span class="text-lg font-mono font-bold text-emerald-400">$340.00</span>
    <button class="px-4 py-2 bg-white text-slate-950 font-bold text-xs rounded-xl hover:opacity-90">BUY NOW</button>
  </div>
</div>`,
    previewRender: () => {
      const [selectedSize, setSelectedSize] = useState('10');
      const [favorite, setFavorite] = useState(false);
      const [activeColor, setActiveColor] = useState('#f43f5e');
      const showToast = usePreviewToast();

      const colors = ['#f43f5e', '#3b82f6', '#10b981'];

      return (
        <div className="py-4 flex justify-center w-full max-w-sm">
          <div className="relative w-full bg-slate-900/95 dark:bg-black/90 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-2xl p-4 text-white overflow-hidden shadow-2xl text-left font-sans">
            <div 
              className="absolute -top-16 -left-16 w-36 h-36 rounded-full blur-2xl opacity-20 pointer-events-none transition-all duration-700"
              style={{ backgroundColor: activeColor }}
            />
            
            <div className="relative w-full h-36 rounded-xl bg-gradient-to-b from-white/5 to-white/[0.01] border border-white/5 flex items-center justify-center p-3 overflow-hidden mb-3">
              <Heart 
                onClick={() => {
                  setFavorite(!favorite);
                  showToast(favorite ? "Removed item from favorites catalog." : "Item marked as your favorite!");
                }}
                className={`absolute top-2.5 right-2 vectors-action w-4.5 h-4.5 cursor-pointer z-10 transition-all duration-300 ${favorite ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-400 hover:text-white'}`}
              />
              
              <motion.div 
                animate={{ 
                  y: [-4, 4, -4],
                  rotate: [0, 8, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 4, 
                  ease: "easeInOut" 
                }}
                className="w-20 h-20 rounded-full relative flex items-center justify-center shadow-xl cursor-default"
                style={{ 
                  background: `radial-gradient(circle at 30% 30%, ${activeColor}, #050510)`,
                  boxShadow: `0 8px 24px ${activeColor}44`
                }}
              >
                <div className="absolute inset-0.5 rounded-full border border-white/15 animate-ping opacity-25" />
                <span className="font-sans font-black text-white text-[9px] opacity-75 tracking-widest">AURA</span>
              </motion.div>
            </div>

            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-[9px] text-[#a855f7] font-mono tracking-widest uppercase font-bold">SUMMIT FLUX EDITION</span>
                <h4 className="text-sm font-bold tracking-tight text-white mt-0.5">Krypton Core Orb</h4>
              </div>
              <div className="flex items-center gap-0.5 text-amber-400 text-[10px] font-bold bg-amber-400/10 px-1.5 py-0.5 rounded-full border border-amber-400/20">
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                <span>4.9</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2 mb-3">
              Intelligent magnetic state stabilizer equipped with atmospheric multi-core vector sync.
            </p>

            <div className="flex justify-between items-center mb-3">
              <div className="flex gap-1.5 shadow-inner">
                {colors.map(col => (
                  <button
                    key={col}
                    onClick={() => {
                      setActiveColor(col);
                      showToast(`Holographic color matrix adjusted to ${col}`);
                    }}
                    className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${activeColor === col ? 'border-white scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>
              
              <div className="flex gap-1 bg-white/5 rounded-lg p-0.5 border border-white/5">
                {['9', '10', '11'].map(sz => (
                  <button
                    key={sz}
                    onClick={() => {
                      setSelectedSize(sz);
                      showToast(`Orb caliber updated to US ${sz}`);
                    }}
                    className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md transition-all ${selectedSize === sz ? 'bg-white text-slate-900 shadow' : 'text-slate-400 hover:text-white'}`}
                  >
                    US {sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-1.5">
              <div>
                <span className="text-[8px] text-slate-500 block font-mono leading-none">BASE VALUE</span>
                <span className="text-sm font-semibold font-mono text-emerald-400 leading-tight mt-1 inline-block">$340.00</span>
              </div>
              <button
                onClick={() => showToast("Orb registered for immediate checkout allocation!")}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-[10px] rounded-lg flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-3 h-3 text-slate-950" />
                BUY NOW
              </button>
            </div>
          </div>
        </div>
      );
    }
  },

  // 20. AMBIENT PLASMA BACKDROP MOTION CANVAS
  {
    id: 'ambient-fluid-motion',
    name: 'Cosmic Ambient Mesh Motion Backdrop',
    category: 'Cards',
    description: 'An elegant fluid-motion canvas container featuring mouse-reactive gradient spheres that drift and morph, creating a high-fidelity visual ambient background.',
    tags: ['New'],
    dependencies: ['motion/react'],
    installation: `npm install motion`,
    codeJSX: `import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function GlassMeshBackdrop() {
  const [speed, setSpeed] = useState(6);

  return (
    <div className="relative w-80 h-44 rounded-3xl bg-slate-950 border border-white/10 overflow-hidden flex items-center justify-center text-white">
      {/* Floating Fluid Orb 1 */}
      <motion.div
        animate={{
          x: [-40, 50, -40],
          y: [-30, 40, -30],
          scale: [1, 1.3, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: speed,
          ease: "easeInOut",
        }}
        className="absolute w-40 h-40 rounded-full bg-indigo-600/30 blur-[40px] pointer-events-none"
      />

      {/* Floating Fluid Orb 2 */}
      <motion.div
        animate={{
          x: [40, -50, 40],
          y: [30, -45, 30],
          scale: [1.2, 0.8, 1.2],
        }}
        transition={{
          repeat: Infinity,
          duration: speed * 1.3,
          ease: "easeInOut",
        }}
        className="absolute w-36 h-36 rounded-full bg-pink-500/20 blur-[35px] pointer-events-none"
      />

      {/* Floating Fluid Orb 3 */}
      <motion.div
        animate={{
          x: [-20, 30, -20],
          y: [40, -30, 40],
        }}
        transition={{
          repeat: Infinity,
          duration: speed * 0.8,
          ease: "easeInOut",
        }}
        className="absolute w-28 h-28 rounded-full bg-emerald-500/20 blur-[30px] pointer-events-none animate-pulse"
      />

      <div className="relative z-10 p-4 text-center space-y-2">
        <h4 className="text-xs font-mono font-bold tracking-widest text-[#a855f7]">AMBIENT FLUID CORE</h4>
        <p className="text-[10px] text-slate-400">Atmospheric dynamic render system</p>
        <div className="flex gap-2 items-center justify-center pt-2">
          <button
            onClick={() => setSpeed(prev => Math.max(2, prev - 1))}
            className="px-1.5 py-0.5 text-[8px] bg-white/10 hover:bg-white/20 rounded font-mono"
          >
            SQR_UP
          </button>
          <span className="text-[9px] font-mono text-emerald-400">{speed}s Metronome</span>
          <button
            onClick={() => setSpeed(prev => Math.min(20, prev + 1))}
            className="px-1.5 py-0.5 text-[8px] bg-white/10 hover:bg-white/20 rounded font-mono"
          >
            SQR_DN
          </button>
        </div>
      </div>
    </div>
  );
}`,
    codeTailwind: `<div class="relative w-80 h-44 rounded-3xl bg-slate-950 overflow-hidden flex items-center justify-center">
  <div class="absolute -top-10 -left-10 w-44 h-44 bg-indigo-600/30 rounded-full blur-[45px] animate-pulse"></div>
  <div class="absolute -bottom-10 -right-10 w-44 h-44 bg-pink-500/25 rounded-full blur-[45px] animate-pulse"></div>
  <div class="z-10 text-center text-white font-mono text-xs text-[#a855f7]">AMBIENT ENGINE COOPERATIVE</div>
</div>`,
    previewRender: () => {
      const [speed, setSpeed] = useState(8);
      const showToast = usePreviewToast();

      return (
        <div className="py-4 flex justify-center w-full max-w-sm">
          <div className="relative w-full h-[142px] bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-white/10 overflow-hidden flex flex-col justify-between p-4 text-white font-sans text-left">
            
            {/* Dynamic Mesh Balls */}
            <motion.div
              animate={{
                x: [-15, 20, -15],
                y: [-10, 15, -10],
                scale: [1, 1.25, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: speed,
                ease: "easeInOut",
              }}
              className="absolute w-28 h-28 rounded-full bg-violet-600/30 blur-[28px] pointer-events-none"
            />

            <motion.div
              animate={{
                x: [25, -20, 25],
                y: [10, -15, 10],
                scale: [1.15, 0.9, 1.15],
              }}
              transition={{
                repeat: Infinity,
                duration: speed * 1.2,
                ease: "easeInOut",
              }}
              className="absolute w-24 h-24 rounded-full bg-rose-500/20 blur-[25px] pointer-events-none"
            />

            <div className="relative z-10 flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[9px] font-mono font-bold text-slate-400 tracking-widest uppercase">🌌 SYSTEM_AMBIENCY</span>
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-[ping_1.5s_infinite]" />
            </div>

            <div className="relative z-10 py-1.5">
              <h4 className="text-[11px] font-bold text-white tracking-tight font-sans">Adaptive Fluid Particles</h4>
              <p className="text-[9px] text-slate-400 leading-tight">Interpolated mathematical mesh gradients render seamlessly on active layers.</p>
            </div>

            <div className="relative z-10 flex justify-between items-center bg-white/[0.04] p-1.5 rounded-lg border border-white/5">
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    const next = Math.max(2, speed - 1);
                    setSpeed(next);
                    showToast(`Atmospheric orbit frequency set to high-spin: ${next}s timer.`);
                  }}
                  className="px-1.5 py-0.5 text-[8px] bg-white/10 rounded font-mono hover:bg-white/20 transition-all font-extrabold cursor-pointer text-white"
                >
                  FREQ+
                </button>
                <button
                  onClick={() => {
                    const next = Math.min(20, speed + 1);
                    setSpeed(next);
                    showToast(`Atmospheric orbit frequency set to slow-glide: ${next}s timer.`);
                  }}
                  className="px-1.5 py-0.5 text-[8px] bg-white/10 rounded font-mono hover:bg-white/20 transition-all font-extrabold cursor-pointer text-white"
                >
                  FREQ-
                </button>
              </div>
              <span className="text-[9px] font-mono text-teal-400 text-right leading-none font-semibold">T_ORBIT: {speed}sec</span>
            </div>
          </div>
        </div>
      );
    }
  },

  // 21. COSMIC CTA MAGNETIC ATTRACTION HIGH-IMPACT BUTTON
  {
    id: 'cosmic-cta-button',
    name: 'Magnetic Cosmic Premium CTA Button',
    category: 'Buttons',
    description: 'An exceptional high-impact call-to-action button implementing full magnetic attraction cursor feedback with micro-arrow sliding matrices and glow outlines.',
    tags: ['New', 'Popular'],
    dependencies: ['motion/react', 'lucide-react'],
    installation: `npm install motion lucide-react`,
    codeJSX: `import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export default function MagneticCTA() {
  const butRef = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);

  const springX = useSpring(0, { stiffness: 120, damping: 10 });
  const springY = useSpring(0, { stiffness: 120, damping: 10 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!butRef.current) return;
    const { left, top, width, height } = butRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const limitX = (e.clientX - centerX) * 0.35;
    const limitY = (e.clientY - centerY) * 0.35;
    
    springX.set(limitX);
    springY.set(limitY);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    springX.set(0);
    springY.set(0);
  };

  return (
    <div className="py-6 flex items-center justify-center">
      <motion.button
        ref={butRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ x: springX, y: springY }}
        className="relative group px-7 py-3.5 bg-slate-950 text-white rounded-2xl font-bold tracking-wide border border-[#bc5cf6]/20 shadow-2xl transition-colors cursor-pointer overflow-hidden flex items-center gap-2"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-15" />
        <div className="absolute inset-2.5 bg-slate-950 rounded-xl group-hover:opacity-90 transition-opacity -z-10" />

        <Sparkles className="w-4 h-4 text-purple-400 group-hover:rotate-45 transition-transform" />
        <span className="font-sans text-xs uppercase tracking-widest text-[#e2b8ff] group-hover:text-white transition-colors">Launch Project Enclave</span>
        <ArrowUpRight className="w-4 h-4 text-pink-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </motion.button>
    </div>
  );
}`,
    codeTailwind: `<button class="relative group px-6 py-3.5 bg-slate-950 text-white rounded-2xl font-bold tracking-wide border border-purple-500/20 shadow-2xl overflow-hidden flex items-center gap-2 hover:indigo-glow transition-all">
  <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-500 opacity-25 group-hover:opacity-100 transition-opacity"></div>
  <span class="z-10 text-xs tracking-widest uppercase">Launch Project</span>
</button>`,
    previewRender: () => {
      const showToast = usePreviewToast();
      const butRef = useRef<HTMLButtonElement>(null);
      const [hovered, setHovered] = useState(false);

      return (
        <div className="py-6 flex flex-col items-center justify-center w-full max-w-sm">
          <div className="bg-slate-100 dark:bg-black p-5 rounded-2xl border border-slate-200/50 dark:border-white/5 flex flex-col items-center gap-3 w-full">
            <button
              ref={butRef}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={() => showToast("Cosmic CTA portal connected securely!")}
              className="relative group px-5 py-3 bg-slate-950 dark:bg-zinc-900 text-white rounded-xl font-bold tracking-wide border border-[#bc5cf6]/35 shadow-xl cursor-pointer overflow-hidden flex items-center justify-center gap-2 w-full transition-transform active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-1.5 bg-slate-950 dark:bg-zinc-950 rounded-lg group-hover:opacity-90 transition-opacity" />

              <Sparkles className="w-3.5 h-3.5 text-purple-400 group-hover:rotate-45 transition-transform relative z-10" />
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#e2b8ff] group-hover:text-white transition-colors relative z-10 leading-none">LAUNCH MATRIX SERVICE</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-pink-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform relative z-10" />
            </button>
            <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-mono">Cursor attractions active · Click to lock access</span>
          </div>
        </div>
      );
    }
  },

  // 22. ELASTIC PHYSICS TILT BENTO ELEMENT
  {
    id: 'elastic-bento-effect',
    name: 'Sleek Elastic Tilt Bento Element',
    category: 'Cards',
    description: 'An adaptive structural grid card incorporating elastic physics-based tilt calculation, integrated speed HUD dashboard widgets, and customizable toggle indicators.',
    tags: ['New'],
    dependencies: ['motion/react', 'lucide-react'],
    installation: `npm install motion lucide-react`,
    codeJSX: `import React, { useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Sliders } from 'lucide-react';

export default function PhysicsTiltBento() {
  const containerRef = useRef<HTMLDivElement>(null);

  const tiltX = useSpring(0, { stiffness: 180, damping: 15 });
  const tiltY = useSpring(0, { stiffness: 180, damping: 15 });

  const rotateX = useTransform(tiltY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(tiltX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    const normX = (e.clientX - left) / width - 0.5;
    const normY = (e.clientY - top) / height - 0.5;
    
    tiltX.set(normX);
    tiltY.set(normY);
  };

  const handleMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <div className="py-6 flex justify-center">
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-72 rounded-3xl p-6 bg-slate-900 border border-white/10 text-white shadow-2xl relative cursor-pointer"
      >
        <div style={{ transform: "translateZ(30px)" }} className="space-y-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
            <Sliders className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-bold text-base">Physics Matrix Monitor</h4>
            <p className="text-xs text-slate-400 mt-1">Real-time modular tracking utilizing micro-spring dampening sensors.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}`,
    codeTailwind: `<div class="w-72 rounded-3xl p-6 bg-slate-900 border border-white/10 text-white shadow-2xl transform hover:scale-105 hover:rotate-2 transition-all cursor-pointer">
  <h4 class="font-bold text-base">Physics Monitor</h4>
  <p class="text-xs text-slate-400 mt-1">Responsive dampening sensors.</p>
</div>`,
    previewRender: () => {
      const containerRef = useRef<HTMLDivElement>(null);
      const [speedX, setSpeedX] = useState(0);
      const [activeStatus, setActiveStatus] = useState(true);
      const showToast = usePreviewToast();

      const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

      const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const localX = e.clientX - rect.left;
        const localY = e.clientY - rect.top;
        setMousePos({ x: Math.round(localX), y: Math.round(localY) });

        setSpeedX(() => {
          const calc = Math.min(240, Math.floor(Math.abs(localX - rect.width / 2) * 1.5));
          return calc;
        });
      };

      return (
        <div className="py-4 flex justify-center w-full max-w-sm">
          <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setSpeedX(0)}
            className="w-full bg-slate-900 dark:bg-neutral-950 p-4 rounded-2xl border border-slate-200/50 dark:border-white/10 text-white shadow-2xl relative overflow-hidden text-left font-sans"
          >
            <div 
              className="absolute pointer-events-none rounded-full bg-cyan-500/10 blur-xl w-24 h-24 transition-all duration-200"
              style={{ left: `${mousePos.x - 48}px`, top: `${mousePos.y - 48}px` }}
            />

            <div className="flex justify-between items-start mb-3 relative z-10">
              <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                <Sliders className="w-4 h-4 animate-pulse text-cyan-400" />
              </div>

              <div 
                onClick={() => {
                  setActiveStatus(!activeStatus);
                  showToast(activeStatus ? "Gravity sensor disabled." : "Elastic gravity sensor engaged.");
                }}
                className={`px-2 py-0.5 rounded text-[8px] font-mono font-extrabold cursor-pointer transition-colors ${activeStatus ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
              >
                {activeStatus ? 'ENGAGED' : 'PAUSED'}
              </div>
            </div>

            <div className="relative z-10">
              <h4 className="text-xs font-bold text-white tracking-tight font-sans">Elastic Physics Bento</h4>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5 mb-3.5 font-sans">Real-time responsive dashboard showcasing active tracking calculations.</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5 relative z-10 select-none">
              <div className="bg-white/[0.03] p-2 rounded-lg border border-white/5">
                <span className="text-[7.5px] font-mono text-slate-400 block uppercase tracking-wider leading-none">ANGLE CALIBER</span>
                <span className="text-[11px] font-mono text-cyan-400 font-bold block mt-1 leading-none">{speedX} DEG/SEC</span>
              </div>
              <div className="bg-white/[0.03] p-2 rounded-lg border border-white/5">
                <span className="text-[7.5px] font-mono text-slate-400 block uppercase tracking-wider leading-none">LOC_VECTOR</span>
                <span className="text-[11px] font-mono text-[#a855f7] font-bold block mt-1 leading-none">X:{mousePos.x} Y:{mousePos.y}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
];
