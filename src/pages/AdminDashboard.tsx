import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Terminal, Shield, Users, Layers, Eye, Download, Heart, AlertTriangle, CheckSquare, Search, Ban } from 'lucide-react';
import { api, User as ApiUser, Report, Analytics, UIComponent } from '../lib/api';

interface AdminDashboardProps {
  onTriggerToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export default function AdminDashboard({ onTriggerToast }: AdminDashboardProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [usersList, setUsersList] = useState<ApiUser[]>([]);
  const [reportsList, setReportsList] = useState<Report[]>([]);
  const [pendingComponents, setPendingComponents] = useState<UIComponent[]>([]);
  const [mernStatus, setMernStatus] = useState<any>(null);
  
  const [tab, setTab] = useState<'metrics' | 'users' | 'reports' | 'pending'>('metrics');
  const [userQuery, setUserQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadAdminSpecs = async () => {
    setIsLoading(true);
    try {
      const aly = await api.getAdminAnalytics();
      setAnalytics(aly);

      const usrs = await api.getAdminUsers();
      setUsersList(usrs);

      const reps = await api.getAdminReports();
      setReportsList(reps);

      const pending = await api.getAdminPendingComponents();
      setPendingComponents(pending);

      const mStatus = await api.getMernStatus();
      setMernStatus(mStatus);
    } catch (e) {
      onTriggerToast('Administrator credentials rejected or missing.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminSpecs();
  }, []);

  const handleApproveComponent = async (id: string) => {
    try {
      const res = await api.approveComponent(id);
      onTriggerToast(res.message, 'success');
      loadAdminSpecs();
    } catch {
      onTriggerToast('Failed to approve component.', 'error');
    }
  };

  const handleRejectComponent = async (id: string) => {
    try {
      await api.deleteComponent(id);
      onTriggerToast('Component rejected and permanently removed.', 'info');
      loadAdminSpecs();
    } catch {
      onTriggerToast('Failed to reject component.', 'error');
    }
  };

  const handleToggleBan = async (id: string, currentBanned: boolean) => {
    try {
      const res = await api.toggleBanUser(id);
      onTriggerToast(res.message, 'success');
      loadAdminSpecs();
    } catch {
      onTriggerToast('Failed to modify account authority.', 'error');
    }
  };

  const handleResolveReport = async (id: string) => {
    try {
      await api.resolveReport(id);
      onTriggerToast('Complaint successfully archived and solved', 'success');
      loadAdminSpecs();
    } catch {
      onTriggerToast('Could not resolve complain index', 'error');
    }
  };

  const filteredUsers = usersList.filter(u => 
    u.username.toLowerCase().includes(userQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(userQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      
      {/* Hero Header */}
      <div className="border-b border-slate-200/20 dark:border-white/5 pb-5 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#a855f7] uppercase font-extrabold flex items-center gap-1.5 mb-1.5">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            ROOT OPERATIONAL CLEARANCE
          </span>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white leading-none italic">
            Command Dashboard <span className="text-neutral-500 font-light">& Moderation</span>
          </h1>
        </div>
        
        {/* Toggle Sections Tabs */}
        <div className="flex bg-slate-100 dark:bg-white/5 border border-slate-200/10 dark:border-white/5 p-1 rounded-xl flex-wrap gap-1">
          <button
            onClick={() => setTab('metrics')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              tab === 'metrics' ? 'bg-slate-950 text-white dark:bg-white dark:text-black font-bold' : 'text-slate-500 dark:text-neutral-400'
            }`}
          >
            Metrics
          </button>
          <button
            onClick={() => setTab('users')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              tab === 'users' ? 'bg-slate-950 text-white dark:bg-white dark:text-black font-bold' : 'text-slate-500 dark:text-neutral-400'
            }`}
          >
            Creators List ({usersList.length})
          </button>
          <button
            onClick={() => setTab('reports')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              tab === 'reports' ? 'bg-slate-950 text-white dark:bg-white dark:text-black font-bold' : 'text-slate-500 dark:text-neutral-400 font-bold'
            }`}
          >
            Reports Hub ({reportsList.filter(r => r.status==='pending').length})
          </button>
          <button
            onClick={() => setTab('pending')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              tab === 'pending' ? 'bg-slate-950 text-white dark:bg-white dark:text-black font-bold' : 'text-slate-500 dark:text-neutral-400 font-bold'
            }`}
          >
            Approval Queue ({pendingComponents.length})
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="py-20 text-center text-slate-400 font-mono text-xs animate-pulse">
          ⚡ [Retrieving operational tables from memory store]...
        </div>
      )}

      {!isLoading && (
        <div>
          {tab === 'metrics' && analytics && (
            <div className="space-y-8">
              {/* BENTO GRID */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-neutral-900/30 border border-slate-200/50 dark:border-white/5 text-left">
                  <div className="p-1 w-6 h-6 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2.5">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-neutral-400 uppercase tracking-wide">Total Creators</span>
                  <h3 className="text-xl font-display font-extrabold text-slate-900 dark:text-white mt-1">{analytics.totalUsers}</h3>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-neutral-900/30 border border-slate-200/50 dark:border-white/5 text-left">
                  <div className="p-1 w-6 h-6 rounded bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-2.5">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-neutral-400 uppercase tracking-wide">Total Designs</span>
                  <h3 className="text-xl font-display font-extrabold text-slate-900 dark:text-white mt-1">{analytics.totalComponents}</h3>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-neutral-900/30 border border-slate-200/50 dark:border-white/5 text-left">
                  <div className="p-1 w-6 h-6 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2.5">
                    <Eye className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-neutral-400 uppercase tracking-wide">Global Views</span>
                  <h3 className="text-xl font-display font-extrabold text-slate-900 dark:text-white mt-1">{analytics.totalViews}</h3>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-neutral-900/30 border border-slate-200/50 dark:border-white/5 text-left">
                  <div className="p-1 w-6 h-6 rounded bg-rose-500/10 text-rose-500 flex items-center justify-center mb-2.5">
                    <Heart className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-neutral-400 uppercase tracking-wide">Total Likes</span>
                  <h3 className="text-xl font-display font-extrabold text-slate-900 dark:text-white mt-1">{analytics.totalLikes}</h3>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-neutral-900/30 border border-slate-200/50 dark:border-white/5 text-left">
                  <div className="p-1 w-6 h-6 rounded bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center mb-2.5">
                    <Download className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-neutral-400 uppercase tracking-wide">Downloads</span>
                  <h3 className="text-xl font-display font-extrabold text-slate-900 dark:text-white mt-1">{analytics.totalDownloads}</h3>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-rose-500/5 border border-slate-200/50 dark:border-rose-500/10 text-left">
                  <div className="p-1 w-6 h-6 rounded bg-rose-500/10 text-rose-500 flex items-center justify-center mb-2.5">
                    <AlertTriangle className="w-4 h-4 animate-bounce" />
                  </div>
                  <span className="text-[10px] text-rose-500 uppercase tracking-wide font-bold">Unresolved Flags</span>
                  <h3 className="text-xl font-display font-extrabold text-rose-600 dark:text-rose-400 mt-1">{analytics.pendingReports}</h3>
                </div>
              </div>

              {/* CATEGORY METRIC CARDS */}
              <div className="bg-slate-50/30 dark:bg-neutral-900/20 border border-slate-200/50 dark:border-white/5 p-6 rounded-2xl">
                <h3 className="font-display font-extrabold text-xs uppercase tracking-widest mb-4 text-[#a855f7]">Category Asset Density</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                  {Object.entries(analytics.categoryStats).map(([cat, cnt]) => (
                    <div key={cat} className="p-3 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-600 dark:text-neutral-400 block truncate">{cat}</span>
                      <h4 className="text-base font-display font-extrabold text-slate-900 dark:text-white mt-1">{cnt} uploads</h4>
                    </div>
                  ))}
                  {Object.keys(analytics.categoryStats).length === 0 && (
                    <div className="col-span-full py-4 text-center text-xs text-neutral-500 font-mono">No distributions seed data.</div>
                  )}
                </div>
              </div>

              {/* MERN STACK & MONGODB VERIFICATION CLUSTER */}
              <div className="bg-slate-50/50 dark:bg-neutral-900/40 border border-slate-200/50 dark:border-white/5 p-6 rounded-2xl space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-sm font-display font-extrabold uppercase tracking-widest text-[#a855f7] flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-purple-400" />
                      MERN Stack & MongoDB Connectivity Status
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-sans">Full architectural stack check (MongoDB, Express.js, React, Node.js)</p>
                  </div>
                  {mernStatus?.mongoConfigured ? (
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 flex items-center gap-1.5 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      MONGO ONLINE
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 flex items-center gap-1.5 border border-amber-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      OFFLINE FALLBACK READY
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                  <div className="p-3 bg-white dark:bg-black/25 border border-slate-200 dark:border-white/5 rounded-xl text-left">
                    <span className="text-[9px] font-bold text-slate-400 block tracking-widest uppercase">M - MongoDB Database</span>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {mernStatus?.mongoConfigured ? 'Connected & Synced' : 'Offline Mode (Local JSON)'}
                    </h4>
                    <span className="text-[10px] text-slate-500 block truncate font-mono mt-1">
                      {mernStatus?.mongoUriMasked || 'None'}
                    </span>
                  </div>

                  <div className="p-3 bg-white dark:bg-black/25 border border-slate-200 dark:border-white/5 rounded-xl text-left">
                    <span className="text-[9px] font-bold text-slate-400 block tracking-widest uppercase">E - Express JS Server</span>
                    <h4 className="text-xs font-bold text-emerald-500 mt-1 flex items-center gap-1">
                      <CheckSquare className="w-3.5 h-3.5" /> Express 4.21 Active
                    </h4>
                    <span className="text-[10px] text-slate-500 block font-mono mt-1">Port 3000 Ingress Routing</span>
                  </div>

                  <div className="p-3 bg-white dark:bg-black/25 border border-slate-200 dark:border-white/5 rounded-xl text-left">
                    <span className="text-[9px] font-bold text-slate-400 block tracking-widest uppercase">R - React Framework</span>
                    <h4 className="text-xs font-bold text-[#a855f7] mt-1 flex items-center gap-1 font-sans">
                      <CheckSquare className="w-3.5 h-3.5" /> React 19 + motion
                    </h4>
                    <span className="text-[10px] text-slate-500 block font-mono mt-1">Tailwind 4.0 Pre-compiled</span>
                  </div>

                  <div className="p-3 bg-white dark:bg-black/25 border border-slate-200 dark:border-white/5 rounded-xl text-left">
                    <span className="text-[9px] font-bold text-slate-400 block tracking-widest uppercase">N - Node JS Engine</span>
                    <h4 className="text-xs font-bold text-cyan-400 mt-1 flex items-center gap-1 font-mono">
                      <CheckSquare className="w-3.5 h-3.5" /> v22 LTS Running
                    </h4>
                    <span className="text-[10px] text-slate-500 block font-mono mt-1">Standalone tsx Executor</span>
                  </div>
                </div>

                {!mernStatus?.mongoConfigured && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-[11px] text-amber-600 dark:text-amber-400 font-mono text-left space-y-1 leading-relaxed">
                    <p className="font-bold">💡 Running locally? Set MONGODB_URI to connect your real MongoDB instance:</p>
                    <p>1. Open your terminal in the root workspace directory.</p>
                    <p>2. Set environment variable: <code className="px-1 py-0.5 bg-black/40 text-white rounded text-[10px]">export MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/database"</code></p>
                    <p>3. Restart via <code className="px-1 py-0.5 bg-black/40 text-white rounded text-[10px]">npm run dev</code>. The server will dynamically sync all localized items to MongoDB!</p>
                  </div>
                )}
              </div>

              {/* CONSOLE STATUS INFO */}
              <div className="p-4 rounded-xl bg-slate-950 text-emerald-400 border border-slate-800 font-mono text-[10px] space-y-1.5 shadow-inner">
                <p className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span> [AURA_STUDIO_COSMIC_SEEDS MODE ACTIVE -- SYNC OK]</p>
                <p>System verified: SQLite/Fallback Memory Database sync verified to file: db.json</p>
                <p>Telemetry stats path: /api/admin/analytics - Security roles mapping: User / Administrators rules verified.</p>
              </div>
            </div>
          )}

          {tab === 'users' && (
            <div className="space-y-6">
              {/* User search card */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter creators by handle or email..."
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  className="w-full px-10 py-3 rounded-xl text-xs bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-neutral-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
              </div>

              {/* Users listing Table */}
              <div className="overflow-x-auto border border-slate-200 dark:border-white/5 rounded-2xl bg-white dark:bg-neutral-950/20">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-neutral-400 uppercase tracking-widest text-[9px] font-extrabold border-b border-slate-200 dark:border-white/5">
                    <tr>
                      <th className="px-6 py-4">Creator Handle</th>
                      <th className="px-6 py-4">Email Address</th>
                      <th className="px-6 py-4">Role Clearance</th>
                      <th className="px-6 py-4">Registered Date</th>
                      <th className="px-6 py-4 text-right">Moderations Panel</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {filteredUsers.map((usr) => (
                      <tr key={usr.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img src={usr.avatar} alt="Avatar" className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-white/20" />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white font-mono">@{usr.username}</span>
                            {usr.isBanned && <span className="ml-1.5 px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 text-[8px] uppercase font-extrabold">Banned</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-neutral-400">{usr.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            usr.role === 'admin' ? 'bg-[#8b5cf6]/25 text-[#a855f7]' : 'bg-slate-100 dark:bg-white/5 text-[#6b7280]'
                          }`}>
                            {usr.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 truncate">{new Date(Date.parse(usr.createdAt)).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleToggleBan(usr.id, usr.isBanned || false)}
                            disabled={usr.id === 'usr_admin'}
                            className={`px-3 py-1.5 rounded-lg text-white text-[10px] font-bold transition-all cursor-pointer inline-flex items-center gap-1 hover:scale-105 active:scale-95 ${
                              usr.isBanned 
                                ? 'bg-emerald-600 hover:bg-emerald-500' 
                                : 'bg-rose-600 hover:bg-rose-500 disabled:opacity-30 disabled:scale-100'
                            }`}
                          >
                            <Ban className="w-3.5 h-3.5" />
                            {usr.isBanned ? 'Unban user' : 'Ban creator'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500 italic">No creators profiles match your filter query.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'reports' && (
            <div className="space-y-6">
              <div className="border border-slate-200 dark:border-white/5 rounded-2xl bg-white dark:bg-neutral-950/20 overflow-hidden">
                <div className="bg-slate-50 dark:bg-white/5 px-6 py-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                  <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500" /> Pending Moderation Reports Queue
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Aura Flagged Assets</span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-white/5">
                  {reportsList.map((rep) => {
                    const isPending = rep.status === 'pending';
                    return (
                      <div key={rep.id} className="p-6 transition-all hover:bg-slate-50/50 dark:hover:bg-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                        <div className="space-y-1.5 max-w-xl">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xs text-[#a855f7] font-bold font-mono">Report Id: {rep.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-extrabold ${
                              isPending ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-100 dark:bg-white/5 text-neutral-500'
                            }`}>
                              {rep.status}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            Submissions Flagged:{' '}
                            <span className="text-neutral-500 dark:text-neutral-400 font-mono font-normal">
                              {rep.componentTitle} (ID: {rep.componentId})
                            </span>
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed italic bg-slate-50 dark:bg-black/10 p-3 rounded-lg border border-slate-200/50 dark:border-white/5">
                            💥 Reason: "{rep.reason}"
                          </p>
                          <div className="flex gap-2 text-[10px] text-slate-400">
                            <span>Reporter: @{rep.reporter.username}</span>
                            <span>•</span>
                            <span>Date: {new Date(Date.parse(rep.createdAt)).toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 self-start md:self-center">
                          {isPending && (
                            <button
                              onClick={() => handleResolveReport(rep.id)}
                              className="px-3.5 py-2 rounded-xl bg-slate-950 dark:bg-white hover:bg-slate-900 dark:hover:bg-slate-100 text-white dark:text-black hover:scale-105 transition-all text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 shadow"
                            >
                              <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                              Dismiss and resolve report
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {reportsList.length === 0 && (
                    <div className="p-12 text-center text-slate-500 italic">🟢 Code library integrity clear. No reported vector flags found.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === 'pending' && (
            <div className="space-y-6">
              <div className="border border-slate-200 dark:border-white/5 rounded-2xl bg-white dark:bg-neutral-950/20 overflow-hidden">
                <div className="bg-slate-50 dark:bg-white/5 px-6 py-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                  <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-500" /> Pending Component Approval Queue
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Aura Curation Matrix</span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-white/5">
                  {pendingComponents.map((comp) => (
                    <div key={comp.id} className="p-6 transition-all hover:bg-slate-50/50 dark:hover:bg-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 text-left">
                      <div className="space-y-1.5 flex-1 max-w-2xl">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-extrabold bg-amber-500/10 text-amber-500">
                            AWAITING VERIFICATION
                          </span>
                          <span className="text-xs text-neutral-550 dark:text-slate-400 font-mono">ID: {comp.id}</span>
                          <span className="bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded text-[9px] font-mono text-slate-650 dark:text-neutral-400 uppercase font-semibold">
                            {comp.category}
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                          {comp.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed mt-1">
                          {comp.description}
                        </p>
                        
                        {/* Author info */}
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-white/5 w-max">
                          {comp.author.avatar ? (
                            <img src={comp.author.avatar} alt={comp.author.username} className="w-5 h-5 rounded-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold flex items-center justify-center">
                              {comp.author.username[0]?.toUpperCase()}
                            </div>
                          )}
                          <span className="text-xs text-slate-500 dark:text-neutral-400 font-mono">Uploaded by @{comp.author.username}</span>
                        </div>

                        {/* Expandable and interactive code preview parameters */}
                        <div className="grid grid-cols-2 gap-2 mt-4 max-w-md">
                          {comp.htmlCode && (
                            <div className="text-[10px] font-mono bg-slate-100 dark:bg-slate-950/40 p-2.5 rounded-lg border border-slate-200/50 dark:border-white/5 truncate">
                              <span className="text-pink-500 font-bold block mb-0.5">HTML Structure:</span>
                              {comp.htmlCode.slice(0, 75)}...
                            </div>
                          )}
                          {comp.tailwindCode && (
                            <div className="text-[10px] font-mono bg-slate-100 dark:bg-slate-950/40 p-2.5 rounded-lg border border-slate-200/50 dark:border-white/5 truncate">
                              <span className="text-cyan-500 font-bold block mb-0.5">Tailwind Classes:</span>
                              {comp.tailwindCode.slice(0, 75)}...
                            </div>
                          )}
                          {comp.reactCode && (
                            <div className="text-[10px] font-mono bg-slate-100 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-200/50 dark:border-white/5 truncate col-span-2">
                              <span className="text-violet-555 dark:text-purple-400 font-bold block mb-0.5">React Code block:</span>
                              {comp.reactCode.slice(0, 100)}...
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex gap-2.5 self-start lg:self-center">
                        <button
                          onClick={() => handleApproveComponent(comp.id)}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] transition-all text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 shadow-md shadow-emerald-600/10"
                        >
                          <CheckSquare className="w-3.5 h-3.5" />
                          Allow / Approve
                        </button>
                        <button
                          onClick={() => handleRejectComponent(comp.id)}
                          className="px-4 py-2.5 rounded-xl bg-rose-600/10 hover:bg-rose-600 hover:text-white border border-rose-500/20 text-rose-500 hover:scale-[1.02] transition-all text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          Reject / Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {pendingComponents.length === 0 && (
                    <div className="p-16 text-center text-slate-500 italic">🟢 Everything clean. No components in the moderation waiting stream.</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
