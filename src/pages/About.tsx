import React from 'react';
import { 
  Users, Code2
} from 'lucide-react';

export default function About() {
  const team = [
    { name: 'Mirza Numair Baig', role: 'Lead Full-Stack Architect', avatar: 'MN', desc: 'Engineered the bedrock of UI Vault. Worked tirelessly to formulate robust MongoDB database persistence, custom Express REST API endpoints, and modular React component frameworks.' },
    { name: 'Ayesha Tariq', role: 'Lead Interaction & Creative Director', avatar: 'AT', desc: 'Surgically crafted the aesthetic brand visual guidelines, elegant light/dark color mappings, typography layouts, and fluid motion variables.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-neutral-800 dark:text-neutral-200 text-left">
      
      {/* 1. Header Hero Panel */}
      <div className="border-b border-slate-200/20 dark:border-white/5 pb-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-500 uppercase font-extrabold flex items-center gap-1.5 mb-1.5">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            OUR ECOSYSTEM JOURNEY
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold leading-none text-slate-900 dark:text-white italic">
            Visual Story, <span className="text-neutral-500 dark:text-neutral-450">Pure Design.</span>
          </h1>
        </div>
        <div className="max-w-sm border-l-2 border-cyan-500 pl-4 py-1">
          <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed italic">
            We build ready-to-mount vector interactions to bypass tedious Figma to code translation loops entirely.
          </p>
        </div>
      </div>

      {/* 2. TEAM CARDS SECTION (GRAPHICAL GRID) */}
      <h3 className="font-display font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
        <Users className="w-4 h-4 text-[#a855f7]" />
        Ecosystem Core Builders & Founders
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
        {team.map((t, idx) => (
          <div
            key={idx}
            className="bg-slate-50/50 dark:bg-neutral-900/40 p-6 rounded-2xl border border-slate-200 dark:border-white/5 text-left flex flex-col justify-between hover:border-cyan-500/40 transition-all group shadow-sm hover:shadow-cyan-500/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 dark:from-cyan-950/40 dark:to-purple-950/40 border border-cyan-500/20 dark:border-white/10 flex items-center justify-center text-slate-900 dark:text-white text-sm font-extrabold font-mono shadow-inner group-hover:scale-110 transition-transform">
                {t.avatar}
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{t.name}</h4>
                <span className="text-[10px] text-cyan-500 font-bold font-mono tracking-wider uppercase">{t.role}</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-neutral-400 mt-4 leading-relaxed font-sans">
              {t.desc}
            </p>
          </div>
        ))}
      </div>

      {/* 3. HERO STORY & HARD WORK DEDICATION SECTION */}
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#8b5cf6]/5 via-[#06b6d4]/5 to-transparent border border-[#8b5cf6]/10 dark:border-white/5 p-8 rounded-3xl text-left mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 text-[9px] font-mono tracking-wider text-slate-400 uppercase font-bold bg-slate-150 dark:bg-white/5 rounded-bl-3xl border-l border-b border-slate-200/10 dark:border-white/5">
          JOURNEY NOTE
        </div>
        <div className="space-y-4 max-w-3xl">
          <span className="text-[10px] font-mono tracking-[0.2em] text-[#8b5cf6] font-extrabold uppercase">
            THE PASSION BEHIND THE SCREENS
          </span>
          <h3 className="text-xl md:text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight leading-tight uppercase">
            Relentless Craft, Sleepless Nights, Pristine Outputs
          </h3>
          <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed font-sans">
            Building <strong>UI Vault</strong> was not an overnight milestone. <span className="text-slate-900 dark:text-slate-200 font-medium">Mirza Numair Baig</span> and <span className="text-slate-900 dark:text-slate-200 font-medium">Ayesha Tariq</span> poured endless hours, working round the clock to architect, design, optimize, and wire this unified code catalog. From debugging complex server endpoints to hand-tuning high-contrast spring curves and ensuring absolute pixel alignment, they tirelessly navigated challenges to give frontend developers a production-grade clipboard hub where elegant designs execute effortlessly.
          </p>
          <div className="flex flex-wrap gap-4 text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-200/20 dark:border-white/5">
            <span>💻 Over 100+ Custom Blueprint Iterations</span>
            <span>⏱️ 24/7 Curation and Sandbox Tuning</span>
            <span>💡 Built for Open-Source Dev Joy</span>
          </div>
        </div>
      </div>

      {/* 4. TECHNICAL STACK ARCHITECTURE */}
      <div className="max-w-4xl mx-auto">
        <h3 className="font-display font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[#06b6d4]" />
          Production-Grade Technology Stack
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          <div className="p-5 rounded-2xl bg-slate-50/50 dark:bg-neutral-900/30 border border-slate-200/50 dark:border-white/5 hover:border-cyan-550/25 transition-all">
            <span className="text-[10px] font-mono text-[#06b6d4] font-bold tracking-widest block uppercase">FRONTEND LAYER</span>
            <h4 className="text-xs font-extrabold mt-1.5 text-slate-900 dark:text-white">React 18 & Vite</h4>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-2 leading-relaxed">
              Utilizing lightning-fast HMR module hot reloads, dynamic JSX rendering, and stable modular routing structures.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50/50 dark:bg-neutral-900/30 border border-slate-200/50 dark:border-white/5 hover:border-[#8b5cf6]/25 transition-all">
            <span className="text-[10px] font-mono text-[#8b5cf6] font-bold tracking-widest block uppercase">STYLING MECHANIC</span>
            <h4 className="text-xs font-extrabold mt-1.5 text-slate-900 dark:text-white">Tailwind CSS</h4>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-2 leading-relaxed">
              Empowering utility-first styling with responsive breakpoint grids, deep dark theme configurations, and fluid layouts.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50/50 dark:bg-neutral-900/30 border border-slate-200/50 dark:border-white/5 hover:border-[#10b981]/25 transition-all">
            <span className="text-[10px] font-mono text-[#10b981] font-bold tracking-widest block uppercase">SERVER ENCLAVE</span>
            <h4 className="text-xs font-extrabold mt-1.5 text-slate-900 dark:text-white">Node.js & Express</h4>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-2 leading-relaxed">
              Handling secure user session tokens, tokenised OAuth flows, component curation queues, and telemetry updates.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50/50 dark:bg-neutral-900/30 border border-slate-200/50 dark:border-white/5 hover:border-amber-500/25 transition-all">
            <span className="text-[10px] font-mono text-amber-500 font-bold tracking-widest block uppercase">PERSISTENCE MATRIX</span>
            <h4 className="text-xs font-extrabold mt-1.5 text-slate-900 dark:text-white">MongoDB / Mongoose</h4>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-2 leading-relaxed">
              Ensuring bulletproof indexing for components, live user metrics, system status flags, and feedback logs.
            </p>
          </div>
        </div>

        <p className="text-[10px] font-mono text-slate-400 text-center mt-10 tracking-widest uppercase">
          TYPE-SAFE WITH TypeScript • ANIMATED WITH Framer Motion
        </p>
      </div>

    </div>
  );
}
