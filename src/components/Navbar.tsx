import React from 'react';
import { Terminal, Sun, Moon, Search } from 'lucide-react';
import { AppThemeConfig } from '../types';

interface NavbarProps {
  currentPage: string;
  setPage: (page: string) => void;
  config: AppThemeConfig;
  setConfig: (config: AppThemeConfig) => void;
  onOpenCommand: () => void;
  currentUser: any;
}

export default function Navbar({ currentPage, setPage, config, setConfig, onOpenCommand, currentUser }: NavbarProps) {
  const toggleTheme = () => {
    setConfig({
      ...config,
      themeMode: config.themeMode === 'light' ? 'dark' : 'light'
    });
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'home':
        return 'Home';
      case 'components':
        return 'UI Components';
      case 'auth':
        return 'Authenticate Profiles';
      case 'upload':
        return 'Deploy Code Sandbox';
      case 'creator-profile':
        return 'My Portfolio';
      case 'admin-dashboard':
        return 'Admin Center 🛡️';
      case 'pricing':
        return 'Pricing Licenses';
      case 'about':
        return 'Ecosystem About';
      case 'contact':
        return 'Contact Desk';
      default:
        return 'UI Vault';
    }
  };

  const hasAdminAccess = currentUser && currentUser.role === 'admin';

  return (
    <>
      <header className="sticky top-0 z-45 w-full glass-panel border-b border-slate-205/20 dark:border-white/5 transition-all text-slate-800 dark:text-slate-100 bg-white/80 dark:bg-[#030303]/80 backdrop-blur-xl relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          
          <div className="flex items-center">
            {/* Logo identity */}
            <div 
              onClick={() => { setPage('home'); }} 
              className="flex items-center gap-2.5 cursor-pointer group shrink-0"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#8b5cf6] via-[#ec4899] to-[#38bdf8] flex items-center justify-center p-1.5 shadow-md group-hover:scale-105 active:scale-95 transition-all">
                <Terminal className="text-white w-full h-full" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-display font-extrabold tracking-wider text-xs leading-none text-slate-950 dark:text-white uppercase">UI VAULT</span>
                <span className="text-[8.5px] font-mono tracking-[0.25em] text-cyan-405 dark:text-cyan-400 leading-none mt-1 uppercase font-bold">Code Hub_</span>
              </div>
            </div>

            {/* Separator & Active Page indicator */}
            <div className="hidden md:flex items-center gap-1.5 ml-4 pl-4 border-l border-slate-200/60 dark:border-white/10 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#8b5cf6] dark:text-cyan-400 uppercase select-none">
                {getPageTitle()}
              </span>
            </div>
          </div>

          {/* Centered page display for small viewports to keep balance */}
          <div className="md:hidden absolute left-1/2 transform -translate-x-1/2 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9.5px] font-mono font-bold tracking-wider text-[#a855f7] dark:text-cyan-400 uppercase">
              {getPageTitle()}
            </span>
          </div>

          {/* Core Settings utilities bar */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Admin Badge shortcut if admin */}
            {hasAdminAccess && (
              <button
                onClick={() => setPage('admin-dashboard')}
                className={`px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider font-extrabold rounded-lg cursor-pointer transition-colors ${
                  currentPage === 'admin-dashboard'
                    ? 'bg-amber-500 text-black font-extrabold'
                    : 'bg-amber-500/15 text-amber-500 border border-amber-500/20 hover:bg-amber-500/25'
                }`}
              >
                Admin Panel 🛡️
              </button>
            )}

            {/* Search Button */}
            <button
              onClick={onOpenCommand}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-205 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
              title="Search components"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {/* Light/Dark Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-205 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-white transition-all cursor-pointer"
              title="Toggle view mode"
            >
              {config.themeMode === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>

            {/* If logged in, show small avatar */}
            {currentUser ? (
              <div 
                onClick={() => setPage('creator-profile')}
                className="w-7 h-7 rounded-lg overflow-hidden border border-purple-500/30 cursor-pointer shadow-inner shrink-0"
                title={`Profile: @${currentUser.username}`}
              >
                <img src={currentUser.avatar} alt="Profile Avatar" className="w-full h-full object-cover" />
              </div>
            ) : (
              <button
                onClick={() => setPage('auth')}
                className="px-3 py-1.5 bg-slate-900 dark:bg-white hover:opacity-90 hover:scale-105 active:scale-95 duration-200 text-white dark:text-black rounded-lg text-[10.5px] font-bold cursor-pointer shadow"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
