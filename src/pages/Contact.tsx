import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, MessageSquare, Send, ChevronDown, CheckCircle, HelpCircle
} from 'lucide-react';

interface ContactProps {
  onTriggerToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function Contact({ onTriggerToast }: ContactProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErr, setValidationErr] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleDispatchFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === '' || email.trim() === '' || msg.trim() === '') {
      setValidationErr('Please fill in all requested fields.');
      onTriggerToast('Failed to send: please enter all values!', 'error');
      return;
    }
    if (!email.includes('@')) {
      setValidationErr('Invalid email format.');
      onTriggerToast('Invalid email address!', 'error');
      return;
    }

    setValidationErr('');
    setSuccess(true);
    setName('');
    setEmail('');
    setMsg('');
    onTriggerToast('Response successfully delivered to our core queue!', 'success');
    setTimeout(() => setSuccess(false), 5000);
  };

  const faqs = [
    { 
      q: 'What is UI Vault?', 
      a: 'UI Vault is a micro-interaction staging ground and catalog showcasing hand-crafted buttons, tabs, input cards and design systems configured directly for clean tailwind copypasta.' 
    },
    { 
      q: 'How long does it take to get a reply?', 
      a: 'Typically within 12-24 hours. We actively monitor our open-source contact queue and seek to assist all developers with implementation feedback.' 
    },
    { 
      q: 'Can I request custom interactive vectors?', 
      a: 'Yes, absolutely! Use the contact form to share your descriptions or links to Figma prototypes, and our authors Mirza and Ayesha will review suggestions.' 
    },
    { 
      q: 'Can I use these components in commercial projects?', 
      a: 'Yes! All showcase items are completely open source with free attribution, allowing you unlimited commercial usage in any web app or dashboard.' 
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-neutral-800 dark:text-neutral-200 text-left">
      
      {/* 1. Header Hero Panel */}
      <div className="border-b border-slate-200/20 dark:border-white/5 pb-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#06b6d4] uppercase font-extrabold flex items-center gap-1.5 mb-1.5">
            <Mail className="w-3.5 h-3.5 text-cyan-400" />
            COMMUNITY & SUPPORT DESK
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold leading-none text-slate-900 dark:text-white italic">
            Contact & <span className="text-neutral-550 dark:text-neutral-400">Website FAQ.</span>
          </h1>
        </div>
        <div className="max-w-sm border-l-2 border-cyan-500 pl-4 py-1">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
            Need design calibrations assistance, React integration tips, or wish to ask about our website? Simply dispatch an inquiry or browse through our answered questions index.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Contact Form Block */}
        <div className="bg-slate-50/50 dark:bg-neutral-900/40 p-8 rounded-3xl border border-slate-200/60 dark:border-white/5 relative shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-cyan-500" />
            <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              Direct Contact Channels
            </h3>
          </div>
          <p className="text-xs text-slate-550 dark:text-neutral-400 leading-reall mb-6">
            Complete the secure fields below to transmit your message immediately to our development team.
          </p>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 text-center flex flex-col items-center gap-4"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/5">
                  <CheckCircle className="w-7 h-7 text-emerald-500" />
                </div>
                <h4 className="font-display font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight">Message Received!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[280px] leading-relaxed mx-auto">
                  Your ticket has been logged and transmitted to Mirza and Ayesha. We'll be in touch!
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleDispatchFeedback} className="flex flex-col gap-5">
                <div>
                  <label className="text-[10px] font-mono text-slate-500 dark:text-neutral-400 tracking-wider font-extrabold uppercase block mb-1.5">Developer Name</label>
                  <input
                    type="text"
                    placeholder="E.g., Alexander Drake"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-cyan-500 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-650 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-500 dark:text-neutral-400 tracking-wider font-extrabold uppercase block mb-1.5">Developer Email</label>
                  <input
                    type="text"
                    placeholder="E.g., alex@reactdesign.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-cyan-500 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-650 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-500 dark:text-neutral-400 tracking-wider font-extrabold uppercase block mb-1.5">Your Message</label>
                  <textarea
                    rows={5}
                    placeholder="Describe implementation bugs, spring adjustment issues or design ideas..."
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-cyan-500 text-slate-800 dark:text-white resize-none placeholder-slate-400 dark:placeholder-zinc-650 transition-colors"
                  />
                </div>

                {validationErr && (
                  <span className="text-[10.5px] font-mono text-red-500 tracking-wider">
                    ⚠ {validationErr}
                  </span>
                )}

                <button
                  type="submit"
                  className="mt-2 w-full py-3 rounded-xl bg-slate-950 hover:bg-neutral-900 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-100 text-xs font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Transmit Inquiry
                </button>
              </form>
            )}
          </AnimatePresence>
        </div>

        {/* Website FAQ Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-purple-500" />
            <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              Website Frequently Asked Questions
            </h3>
          </div>
          <p className="text-xs text-slate-550 dark:text-neutral-400 leading-relaxed mb-2">
            Find immediate answers regarding licensing, components, and how to operate the sandbox compiler ecosystem.
          </p>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-50/20 dark:bg-neutral-900/20 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="w-full p-4 flex items-center justify-between font-sans text-xs font-bold cursor-pointer text-slate-900 dark:text-white hover:bg-slate-100/40 dark:hover:bg-white/5 transition-all text-left"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-slate-100/30 dark:bg-slate-950/20 text-xs text-slate-650 dark:text-neutral-450 p-4 border-t border-slate-200/10 dark:border-white/5 leading-relaxed"
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
    </div>
  );
}
