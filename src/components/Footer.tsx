import React from 'react';
import { Terminal, Github, Heart, ArrowUp, Mail } from 'lucide-react';

interface FooterProps {
  setPage: (page: string) => void;
}

export default function Footer({ setPage }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="w-full bg-slate-50 dark:bg-zinc-950 border-t border-slate-200/50 dark:border-white/5 pt-16 pb-28 px-6 sm:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-12 border-b border-slate-200/50 dark:border-white/5">
          
          {/* Identity column (7 cols for spaciousness) */}
          <div className="lg:col-span-7 flex flex-col gap-5 text-left">
            <div 
              id="footer-brand"
              className="flex items-center gap-2.5 cursor-pointer group w-max" 
              onClick={() => { setPage('home'); window.scrollTo(0, 0); }}
            >
              <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                <Terminal className="text-white dark:text-black w-4.5 h-4.5" />
              </div>
              <span className="font-sans font-black text-sm tracking-wider uppercase text-slate-900 dark:text-white">
                UI<span className="text-slate-400 dark:text-zinc-500 font-medium">VAULT</span>
              </span>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed max-w-sm font-sans">
              Ui Components Library. Curated premium Tailwind blueprints and animated modular components. Copy, paste, customize, and deliver pristine developer interfaces in seconds.
            </p>

            <div className="flex items-center gap-3 mt-1">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="p-2 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl text-slate-500 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white transition-all border border-slate-200/60 dark:border-white/5 shadow-xs"
                title="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <button 
                onClick={() => { setPage('contact'); window.scrollTo(0, 0); }}
                className="p-2 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl text-slate-500 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white transition-all border border-slate-200/60 dark:border-white/5 shadow-xs cursor-pointer flex items-center justify-center tier-btn"
                title="Contact Support"
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Directory links (5 cols split into categories) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8 text-left">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-mono tracking-widest font-bold text-slate-400 dark:text-zinc-500 uppercase">
                Browse Blocks
              </span>
              <ul className="flex flex-col gap-3 text-xs font-medium">
                {['Buttons', 'Cards', 'Collapsibles', 'Pricing grids', 'Auth UI'].map((item) => (
                  <li key={item}>
                    <button 
                      onClick={() => { setPage('components'); window.scrollTo(0, 0); }} 
                      className="text-slate-500 dark:text-zinc-450 hover:text-cyan-500 dark:hover:text-cyan-400 hover:translate-x-0.5 transition-transform cursor-pointer text-left font-sans"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-mono tracking-widest font-bold text-slate-400 dark:text-zinc-500 uppercase">
                Explore Core
              </span>
              <ul className="flex flex-col gap-3 text-xs font-medium">
                {[
                  { name: 'Home Workspace', page: 'home' },
                  { name: 'Components Catalog', page: 'components' },
                  { name: 'About & Journey', page: 'about' },
                  { name: 'Permissive Pricing', page: 'pricing' },
                  { name: 'Support & Contact', page: 'contact' },
                ].map((item) => (
                  <li key={item.name}>
                    <button 
                      onClick={() => { setPage(item.page); window.scrollTo(0, 0); }} 
                      className="text-slate-500 dark:text-zinc-450 hover:text-cyan-500 dark:hover:text-cyan-400 hover:translate-x-0.5 transition-transform cursor-pointer text-left font-sans"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom copyright / designed-by bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 text-[11px] text-slate-400 dark:text-zinc-500 font-mono gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2">
            <span>UI Vault Components © {new Date().getFullYear()}</span>
            <span className="hidden sm:inline-block text-slate-300 dark:text-zinc-800">|</span>
            <span className="flex items-center gap-1 flex-wrap justify-center sm:justify-start">
              made with love by Mirza Numair Baig and Ayesha Tariq
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current animate-pulse shrink-0" />
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={scrollToTop}
              className="flex items-center gap-1.5 py-1 px-2.5 bg-slate-200/50 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
