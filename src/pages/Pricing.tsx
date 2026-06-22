import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, Code2, Sparkles, ChevronDown, Rocket, LucideIcon
} from 'lucide-react';

interface PricingProps {
  onTriggerToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function Pricing({ onTriggerToast }: PricingProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    { q: 'Is there really no pricing model at all?', a: 'None! Aura Studio is a completely open-source project funded by sponsorship and donation. Every single button, modal, card, and loader catalogued here is entirely free to copy-paste for both personal and enterprise production applications.' },
    { q: 'Can I use these components in my commercial SaaS?', a: 'Yes. Our permissive open-source guidelines permit complete commercial usage. There are no credit tags, attribution constraints, domain registration requirements, or premium subscriptions.' },
    { q: 'Why are other platforms locked with "Seat Licenses"?', a: 'We believe premium interactivity shouldn\'t be gated. Elite-level design is meant to be shared, calibrated, and incorporated worldwide without barrier.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-neutral-800 dark:text-neutral-200 text-left">
      
      {/* 1. Header Hero Panels */}
      <div className="border-b border-slate-200/20 dark:border-white/5 pb-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-500 uppercase font-extrabold flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            FULL PERMISSIVE OPEN SOURCE PATTERNS
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold leading-none text-slate-900 dark:text-white italic">
            Fully Free. <span className="text-neutral-450 dark:text-neutral-600">Open Forever.</span>
          </h1>
        </div>
        <div className="max-w-sm border-l-2 border-cyan-500 pl-4 py-1">
          <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed italic">
            Zero tiered subscriptions, zero seat blocks, and zero billing gateways. Over 50+ hand-assembled interactive motion structures available directly in your local clipboard.
          </p>
        </div>
      </div>

      {/* 2. CORE SYSTEM PIPELINE (GRAPHICAL FLOW) */}
      <h3 className="font-display font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
        <Cpu className="w-4 h-4 text-purple-400" />
        Source Import Codeflow Pipeline
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          {
            step: "01",
            title: "Select Interactive Spec",
            desc: "Browse our bento coordinates, select any micro-element design, click to launch live code variables.",
            bg: "cyan",
            icon: Cpu
          },
          {
            step: "02",
            title: "Tailwind & JSX Copy",
            desc: "Generate production-grade Tailwind classes and React modules with fluid Spring animation models instantly.",
            bg: "purple",
            icon: Code2
          },
          {
            step: "03",
            title: "Launch Free Elements",
            desc: "Run the output inside your Next.js, Remix, or React enclaves immediately, free from pricing gatekeepers.",
            bg: "pink",
            icon: Rocket
          },
        ].map((flow, index) => {
          const Icon = flow.icon;
          return (
            <div 
              key={flow.step}
              className="bg-slate-50/50 dark:bg-neutral-900/40 p-6 rounded-2xl border border-slate-200/50 dark:border-white/5 relative flex flex-col justify-between h-44 group hover:border-cyan-500/30 transition-all duration-350"
            >
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-4xl font-display font-extrabold text-slate-200 dark:text-neutral-850 font-mono tracking-tighter leading-none">
                    {flow.step}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-${flow.bg === 'cyan' ? 'cyan-500' : flow.bg === 'purple' ? 'purple-500' : 'pink-500'}/10 text-${flow.bg === 'cyan' ? 'cyan-500' : flow.bg === 'purple' ? 'purple-500' : 'pink-500'} border border-current/15`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs mt-3">{flow.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-neutral-450 mt-1.5 leading-relaxed">
                  {flow.desc}
                </p>
              </div>

              {/* Graphical connector overlay */}
              {index < 2 && (
                <div className="hidden md:block absolute top-[50%] -right-3 px-1 bg-white dark:bg-black border border-slate-200 dark:border-white/10 p-0.5 rounded-full text-slate-400 z-10 text-[8px] font-bold">
                  &rarr;
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. FAQ ACCORDION SECTIONS */}
      <div className="max-w-3xl mx-auto border-t border-slate-200/20 dark:border-white/5 pt-12">
        <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white text-center mb-8 italic">
          Frequently Mapped Inquiries
        </h3>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = openFaqIndex === i;
            return (
              <div
                key={i}
                className="rounded-xl border border-slate-200/35 dark:border-white/5 bg-slate-50/30 dark:bg-black/20 overflow-hidden"
              >
                <button
                  onClick={() => {
                    setOpenFaqIndex(isOpen ? null : i);
                    onTriggerToast(isOpen ? 'Closed info node' : `Inspected FAQ: ${faq.q.substring(0, 30)}...`, 'info');
                  }}
                  className="w-full p-4 flex items-center justify-between text-left font-sans text-xs font-extrabold text-slate-850 dark:text-white cursor-pointer"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-slate-200/10 dark:border-white/5 bg-slate-100/20 dark:bg-slate-950/20 text-[11px] text-slate-600 dark:text-slate-400 p-4 leading-relaxed font-sans"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
