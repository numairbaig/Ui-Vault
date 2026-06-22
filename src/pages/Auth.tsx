import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Terminal, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { api } from '../lib/api';

interface AuthProps {
  onSuccess: (user: any) => void;
  onTriggerToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  onClose?: () => void;
}

export default function Auth({ onSuccess, onTriggerToast, onClose }: AuthProps) {
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Login / Register Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      onTriggerToast('Please enter both login credentials', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.login(email, password);
      onTriggerToast(`Authenticated successfully! Welcome back, ${response.user.username}.`, 'success');
      onSuccess(response.user);
    } catch (err: any) {
      onTriggerToast(err.message || 'Login credentials invalid', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      onTriggerToast('Please fill out all required credentials', 'error');
      return;
    }
    if (username.length < 3) {
      onTriggerToast('Username must be 3 characters or more', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.register(username, email, password, bio);
      onTriggerToast(`Creative account instantiated! Welcome to UI Vault, ${username}.`, 'success');
      onSuccess(response.user);
    } catch (err: any) {
      onTriggerToast(err.message || 'Registration aborted', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      onTriggerToast('Submit your email address to route instructions', 'error');
      return;
    }
    setIsLoading(true);
    try {
      await api.requestPasswordReset(email);
      onTriggerToast('Password reset token dispatched directly to your inbox!', 'success');
      setTab('login');
    } catch (err: any) {
      onTriggerToast(err.message || 'Reset failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuthSimulated = async () => {
    setIsLoading(true);
    try {
      // Simulate OAuth response
      const payload = {
        googleId: `g_usr_${Math.floor(Math.random() * 900000)}`,
        name: email.split('@')[0] || 'UI Vault Contributor',
        email: email || 'contributor@gmail.com',
        imageUrl: `https://images.unsplash.com/photo-${1534500000000 + Math.floor(Math.random() * 50000)}?q=80&w=150&auto=format&fit=crop`
      };
      
      const response = await api.googleAuth(payload);
      onTriggerToast(`Authorized with high-trust Google profile: ${response.user.username}`, 'success');
      onSuccess(response.user);
    } catch (err: any) {
      onTriggerToast(err.message || 'OAuth alignment failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 text-left">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-900/40 relative border border-slate-200 dark:border-white/5 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full blur-[2px]" />

        <div className="text-center mb-6">
          <div className="mx-auto w-10 h-10 rounded-xl bg-slate-950 dark:bg-white flex items-center justify-center mb-3">
            <Terminal className="text-white dark:text-black w-5 h-5" />
          </div>
          <h2 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white leading-none">
            {tab === 'login' ? 'Welcome Back' : tab === 'register' ? 'Create Account' : 'Reset Credentials'}
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-1.5 uppercase tracking-wider font-mono">
            {tab === 'login' ? 'SIGN IN TO YOUR SESSION' : tab === 'register' ? 'REGISTER A NEW ACCOUNT' : 'RECOVER PORTFOLIO KEYS'}
          </p>
        </div>

        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Email / Username</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="name@gmail.com or username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-[#a855f7] transition-colors"
                />
                <Mail className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 dark:text-neutral-600 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-bold text-slate-700 dark:text-neutral-400 uppercase tracking-widest">Secret Passcode</label>
                <button
                  type="button"
                  onClick={() => setTab('forgot')}
                  className="text-[10px] text-purple-600 dark:text-cyan-400 hover:underline cursor-pointer"
                >
                  Keys misplaced?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-[#a855f7] transition-colors"
                />
                <Lock className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 dark:text-neutral-600 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-slate-950 dark:bg-white hover:bg-slate-900 dark:hover:bg-slate-100 text-white dark:text-black font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer disabled:opacity-55"
            >
              {isLoading ? 'Verifying Signature...' : 'Sign In'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Unique Username</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="designer_x"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-[#a855f7] transition-colors"
                />
                <User className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 dark:text-neutral-600 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Primary Email</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="you@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-[#a855f7] transition-colors"
                />
                <Mail className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 dark:text-neutral-600 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-[#a855f7] transition-colors"
                />
                <Lock className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 dark:text-neutral-600 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Short Bio (Optional)</label>
              <textarea
                placeholder="Figma lover, Tailwind pixel master..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2 rounded-lg text-xs bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-[#a855f7] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-slate-950 dark:bg-white hover:bg-slate-900 dark:hover:bg-slate-100 text-white dark:text-black font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer disabled:opacity-55"
            >
              {isLoading ? 'Hashing & Registering...' : 'Create'}
              <ShieldCheck className="w-4 h-4" />
            </button>
          </form>
        )}

        {tab === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <p className="text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed italic mb-2">
              Lost your access signature? Enter your registration email address to dispatch reset instructions.
            </p>
            <div>
              <label className="block text-[10px] font-bold text-slate-700 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Registered Email</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="you@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-[#a855f7] transition-colors"
                />
                <Mail className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 dark:text-neutral-600 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-slate-950 dark:bg-white hover:bg-slate-900 dark:hover:bg-slate-100 text-white dark:text-black font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer disabled:opacity-55"
            >
              {isLoading ? 'Dispatched...' : 'Trigger Recovery Token'}
              <KeyRound className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Dynamic Toggle buttons */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-600 dark:text-neutral-400">
          {tab === 'login' ? (
            <span>
              Unregistered?{' '}
              <button onClick={() => setTab('register')} className="text-purple-600 dark:text-cyan-400 hover:underline font-semibold cursor-pointer">
                Create Account
              </button>
            </span>
          ) : (
            <span>
              Back to{' '}
              <button onClick={() => setTab('login')} className="text-purple-600 dark:text-cyan-400 hover:underline font-semibold cursor-pointer">
                Sign In console
              </button>
            </span>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="mt-4 w-full text-center text-[11px] text-slate-400 hover:text-slate-500 dark:text-neutral-500 dark:hover:text-neutral-400 cursor-pointer"
          >
            Cancel and navigate back
          </button>
        )}
      </motion.div>
    </div>
  );
}
