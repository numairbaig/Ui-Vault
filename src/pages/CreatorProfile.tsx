import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Layers, FolderHeart, Heart, Sparkles, Plus, Trash2, Edit2, ShieldAlert, BadgeCheck, Bell, Eye, LogOut } from 'lucide-react';
import { api, User as ApiUser, UIComponent, Collection, Notification } from '../lib/api';

interface CreatorProfileProps {
  user: ApiUser;
  onLogout: () => void;
  onTriggerToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  onSelectComponent: (id: string) => void;
  onTriggerEditComponent: (comp: UIComponent) => void;
}

export default function CreatorProfile({ user, onLogout, onTriggerToast, onSelectComponent, onTriggerEditComponent }: CreatorProfileProps) {
  const [profile, setProfile] = useState<ApiUser | null>(null);
  const [components, setComponents] = useState<UIComponent[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);

  // Editing profile
  const [isEditing, setIsEditing] = useState(false);
  const [bioInput, setBioInput] = useState('');
  const [avatarInput, setAvatarInput] = useState('');

  // Editing collections
  const [newCollectionName, setNewCollectionName] = useState('');
  const [collectionVisibility, setCollectionVisibility] = useState<'public' | 'private'>('public');

  // active profile tab
  const [profileTab, setProfileTab] = useState<'uploads' | 'favorites' | 'collections' | 'notifications'>('uploads');

  const loadProfileSpecs = async () => {
    try {
      const myUser = await api.getCurrentUser();
      setProfile(myUser);
      setBioInput(myUser.bio || '');
      setAvatarInput(myUser.avatar || '');

      // Load all system components to filter my uploads and favorites
      const allComp = await api.getComponents();
      setComponents(allComp);

      const colls = await api.getCollections();
      setCollections(colls);

      const notifs = await api.getNotifications();
      setNotifications(notifs);
      setUnreadNotifsCount(notifs.filter(n => !n.read).length);
    } catch {
      onTriggerToast('Failed to load credentials database', 'error');
    }
  };

  useEffect(() => {
    loadProfileSpecs();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateProfile(bioInput, avatarInput);
      onTriggerToast('Creator portfolio credentials successfully recalibrated!', 'success');
      setIsEditing(false);
      loadProfileSpecs();
    } catch {
      onTriggerToast('Fail updating avatar configuration.', 'error');
    }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName) return;
    try {
      await api.createCollection(newCollectionName, collectionVisibility);
      onTriggerToast(`Personal clustering folder "${newCollectionName}" deployed successfully!`, 'success');
      setNewCollectionName('');
      loadProfileSpecs();
    } catch {
      onTriggerToast('Clustering block deployment thwarted.', 'error');
    }
  };

  const handleDeleteCollection = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the collection: ${name}?`)) return;
    try {
      await api.deleteCollection(id);
      onTriggerToast('Collection folder catalog unlinked.', 'info');
      loadProfileSpecs();
    } catch {
      onTriggerToast('Could not unlink selected folder.', 'error');
    }
  };

  const handleMarkNotificationsRead = async () => {
    try {
      await api.markNotificationsAsRead();
      setUnreadNotifsCount(0);
      loadProfileSpecs();
    } catch {}
  };

  const handleDeleteComponent = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete component: ${name}?`)) return;
    try {
      await api.deleteComponent(id);
      onTriggerToast('Surgical code entry dropped from Aura library.', 'success');
      loadProfileSpecs();
    } catch {
      onTriggerToast('Failed to delete assets.', 'error');
    }
  };

  if (!profile) {
    return <div className="py-24 text-center font-mono text-xs text-slate-400 animate-pulse">Initializing quantum authentication parameters...</div>;
  }

  // Filter lists
  const myUploads = components.filter(c => c.author.id === profile.id);
  const myFavorites = components.filter(c => profile.savedComponents?.includes(c.id));
  const myCollections = collections.filter(c => c.user === profile.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      
      {/* 1. HERO BIO PROFILE HEADER CARD */}
      <div className="relative bg-white dark:bg-neutral-900/40 border border-slate-200 dark:border-white/5 shadow-2xl rounded-2xl p-6 md:p-8 mb-10 overflow-hidden">
        {/* Colorful top border aura */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-400 via-[#8b5cf6] to-pink-500" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative group shrink-0">
              <img
                src={profile.avatar}
                alt="Profile Avatar"
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-white dark:border-black shadow-lg"
              />
              <span className="absolute bottom-0 right-0 p-1 w-5.5 h-5.5 rounded bg-emerald-500 border-2 border-white dark:border-black flex items-center justify-center text-white" title="Active verification slot">
                <BadgeCheck className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-display font-extrabold text-slate-900 dark:text-white leading-none italic">
                  @{profile.username}
                </h2>
                {profile.role === 'admin' && (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[8px] uppercase font-bold border border-emerald-505/20">
                    Administrator
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-2 font-mono flex items-center gap-1">
                Verified developer registry email ID: <span className="text-slate-700 dark:text-cyan-400">{profile.email}</span>
              </p>
              <p className="text-xs text-slate-600 dark:text-neutral-300 mt-2 italic max-w-xl">
                "{profile.bio || 'Developing clean vector blocks interior of the cosmic library.'}"
              </p>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 border border-slate-200 dark:border-white/5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-neutral-300 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Edit2 className="w-3.5 h-3.5 text-purple-400" />
              Recalibrate Profile
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow"
            >
              <LogOut className="w-3.5 h-3.5" />
              Secure Log Out
            </button>
          </div>
        </div>

        {/* PROFILE EDIT FORM DRAWER */}
        <AnimatePresence>
          {isEditing && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleUpdateProfile}
              className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Avatar Image URL</label>
                  <input
                    type="text"
                    value={avatarInput}
                    onChange={(e) => setAvatarInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Personal Biography</label>
                  <input
                    type="text"
                    value={bioInput}
                    placeholder="Short summary of credentials..."
                    onChange={(e) => setBioInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-950 dark:bg-white text-white dark:text-black hover:bg-slate-900 font-bold rounded-xl text-[10px] tracking-wider uppercase flex items-center gap-1.5 cursor-pointer"
              >
                Save Settings
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* 2. TAB SELECTION MATRIX AND GRID LISTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFTHAND: SELECTION NAVIGATION BAR (3 spans) */}
        <div className="lg:col-span-3 flex flex-col gap-2">
          <button
            onClick={() => setProfileTab('uploads')}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-left flex items-center justify-between ${
              profileTab === 'uploads' ? 'bg-slate-950 text-white dark:bg-white dark:text-black border border-slate-950 dark:border-transparent font-bold shadow' : 'text-slate-500 dark:text-neutral-400'
            }`}
          >
            <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-purple-500" /> My Vector Uploads</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-black text-[9px] text-slate-500">{myUploads.length}</span>
          </button>

          <button
            onClick={() => setProfileTab('favorites')}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-left flex items-center justify-between ${
              profileTab === 'favorites' ? 'bg-slate-950 text-white dark:bg-white dark:text-black border border-slate-950 dark:border-transparent font-bold shadow' : 'text-slate-500 dark:text-neutral-400'
            }`}
          >
            <span className="flex items-center gap-2"><FolderHeart className="w-4 h-4 text-[#ec4899]" /> Saved Favorites</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-black text-[9px] text-slate-500">{myFavorites.length}</span>
          </button>

          <button
            onClick={() => setProfileTab('collections')}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-left flex items-center justify-between ${
              profileTab === 'collections' ? 'bg-slate-950 text-white dark:bg-white dark:text-black border border-slate-950 dark:border-transparent font-bold shadow' : 'text-slate-500 dark:text-neutral-400'
            }`}
          >
            <span className="flex items-center gap-2"><Plus className="w-4 h-4 text-cyan-400" /> Catalog Collections</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-black text-[9px] text-slate-500">{myCollections.length}</span>
          </button>

          <button
            onClick={() => {
              setProfileTab('notifications');
              handleMarkNotificationsRead();
            }}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-left flex items-center justify-between ${
              profileTab === 'notifications' ? 'bg-slate-950 text-white dark:bg-white dark:text-black border border-slate-950 dark:border-transparent font-bold shadow' : 'text-slate-500 dark:text-neutral-400'
            }`}
          >
            <span className="flex items-center gap-2 relative">
              <Bell className="w-4 h-4 text-yellow-500" /> Notification Feeds
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-black text-[9px] text-slate-500">{notifications.length}</span>
          </button>
        </div>

        {/* RIGHTSIDE: LISTS RENDEROUTFIT CONTENTS (9 spans) */}
        <div className="lg:col-span-9">
          
          {/* TAB: MY UPLOADS */}
          {profileTab === 'uploads' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-display font-extrabold text-sm uppercase tracking-wide text-slate-900 dark:text-white">Uploaded Components List</h3>
                <span className="text-[10px] font-mono text-slate-400">Total: {myUploads.length} widgets catalogued</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myUploads.map((item) => (
                  <div key={item.id} className="p-4 bg-slate-50/50 dark:bg-neutral-900/30 border border-slate-200/50 dark:border-white/5 rounded-2xl relative shadow-md flex items-center justify-between gap-4">
                    <div className="truncate text-left space-y-1">
                      <span className="text-[8px] font-mono tracking-widest text-[#a855f7] bg-purple-500/10 px-1.5 py-0.5 rounded uppercase font-extrabold">{item.category}</span>
                      <h4 className="text-sm font-bold text-slate-950 dark:text-white truncate mt-1">{item.title}</h4>
                      <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{item.description}</p>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => onSelectComponent(item.id)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
                        title="Open in dynamic editor"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onTriggerEditComponent(item)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
                        title="Edit code settings"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteComponent(item.id, item.title)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg text-slate-500 dark:text-neutral-400 hover:text-rose-500 transition-all cursor-pointer"
                        title="Permadelete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {myUploads.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-400 text-xs italic">
                    No components found. Open the "Deploy Code" section to construct your first vector!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: SAVED FAVORITES */}
          {profileTab === 'favorites' && (
            <div className="space-y-4">
              <h3 className="font-display font-extrabold text-sm uppercase tracking-wide text-slate-900 dark:text-white mb-2">My Saved Bookmarks</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myFavorites.map((item) => (
                  <div key={item.id} className="p-4 bg-slate-50/50 dark:bg-neutral-900/30 border border-slate-200/50 dark:border-white/5 rounded-2xl flex items-center justify-between gap-4 shadow-md">
                    <div className="truncate text-left space-y-1">
                      <span className="text-[8px] font-mono tracking-widest text-[#a855f7] bg-purple-500/10 px-1.5 py-0.5 rounded uppercase font-extrabold">{item.category}</span>
                      <h4 className="text-sm font-bold text-slate-950 dark:text-white truncate mt-1">{item.title}</h4>
                      <p className="text-[10px] text-slate-500 truncate">Author reference: @{item.author.username}</p>
                    </div>

                    <button
                      onClick={() => onSelectComponent(item.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-[10px] text-slate-700 dark:text-neutral-300 font-bold font-mono cursor-pointer transition-colors"
                    >
                      Run Sandbox
                    </button>
                  </div>
                ))}
                {myFavorites.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-400 text-xs italic">
                    No favorites bookmarks registered. Search the component directories to save designs!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: COLLECTIONS CLUSTERING */}
          {profileTab === 'collections' && (
            <div className="space-y-6">
              {/* Creator collection formulation Form */}
              <form onSubmit={handleCreateCollection} className="p-4 bg-slate-100/40 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-2xl flex flex-col sm:flex-row items-end gap-3 text-xs">
                <div className="flex-1 text-left w-full">
                  <label className="block text-[9px] font-extrabold text-slate-600 dark:text-neutral-400 uppercase tracking-widest mb-1">Collection Catalog Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Glowing Neon Buttons and Forms"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white focus:outline-none"
                  />
                </div>
                
                <div className="w-full sm:w-auto text-left">
                  <label className="block text-[9px] font-extrabold text-slate-600 dark:text-neutral-400 uppercase tracking-widest mb-1">Visibility</label>
                  <select
                    value={collectionVisibility}
                    onChange={(e) => setCollectionVisibility(e.target.value as any)}
                    className="w-full sm:w-28 px-2 py-2 rounded-lg bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
                  >
                    <option value="public" className="bg-slate-100 dark:bg-neutral-900 text-slate-900 dark:text-white">Public</option>
                    <option value="private" className="bg-slate-100 dark:bg-neutral-900 text-slate-900 dark:text-white">Private</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-950 dark:bg-white text-white dark:text-black font-semibold rounded-lg text-xs w-full sm:w-auto hover:bg-slate-900 dark:hover:bg-slate-100 cursor-pointer text-center"
                >
                  Create Cluster
                </button>
              </form>

              {/* Collections listings */}
              <div className="space-y-4">
                {myCollections.map((col) => {
                  return (
                    <div key={col.id} className="p-5 bg-slate-50/50 dark:bg-neutral-900/30 border border-slate-200/50 dark:border-white/5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-left shadow">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{col.name}</h4>
                          <span className={`text-[8px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            col.visibility === 'public' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-rose-500/15 text-rose-500'
                          }`}>
                            {col.visibility}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 font-mono">{col.components.length} micro-components mapped here.</p>
                      </div>

                      <button
                        onClick={() => handleDeleteCollection(col.id, col.name)}
                        className="p-1.5 rounded-lg border border-transparent dark:hover:bg-white/5 hover:text-rose-500 transition-colors cursor-pointer text-slate-400 self-start sm:self-center"
                        title="Delete cluster archive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
                {myCollections.length === 0 && (
                  <div className="py-8 text-center text-slate-400 text-xs italic">No collection directories formulated. Create one using the header widget above.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB: NOTIFICATION FEEDS */}
          {profileTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-display font-extrabold text-sm uppercase tracking-wide text-slate-900 dark:text-white">Activity Notifications</h3>
                <button onClick={loadProfileSpecs} className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 hover:underline">Re-fetch</button>
              </div>

              <div className="border border-slate-200 dark:border-white/5 rounded-2xl bg-white dark:bg-neutral-900/10 divide-y divide-slate-100 dark:divide-white/5">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 flex items-start gap-3.5 text-left text-xs text-slate-700 dark:text-neutral-300">
                    <img src={notif.sender.avatar} alt="Sender avatar" className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <p>
                        <span className="font-bold text-slate-950 dark:text-white font-mono">@{notif.sender.username}</span>{' '}
                        {notif.type === 'like' && (
                          <span>liked your uploaded schema component <span className="font-bold text-cyan-505 dark:text-cyan-400">"{notif.componentTitle}"</span></span>
                        )}
                        {notif.type === 'comment' && (
                          <span>added a review comment to <span className="font-bold text-cyan-505 dark:text-cyan-400">"{notif.componentTitle}"</span></span>
                        )}
                        {notif.type === 'follow' && (
                          <span>started following your developer profile streams!</span>
                        )}
                      </p>
                      <span className="text-[9px] text-slate-400 block mt-1 font-mono">{new Date(Date.parse(notif.createdAt)).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="py-12 text-center text-slate-400 text-xs italic">
                    Complete radio silence. When users interact with your uploaded templates, triggers will catalog here.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
