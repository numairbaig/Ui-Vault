import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { 
  MongoUser, 
  MongoComponent, 
  MongoCollection, 
  MongoComment, 
  MongoNotification, 
  MongoReport, 
  MongoSiteStats,
  connectMongo,
  isMongoConfigured,
  syncLocalSeedToMongo
} from './mongodb';

// Schemas & Types matching Uiverse specifications
export interface UserDocument {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  avatar: string;
  bio: string;
  followers: string[]; // User IDs
  following: string[]; // User IDs
  savedComponents: string[]; // Component IDs
  collections: string[]; // Collection IDs
  role: 'user' | 'admin';
  createdAt: string;
  isBanned?: boolean;
}

export interface ComponentDocument {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail: string;
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  reactCode: string;
  tailwindCode: string;
  author: {
    id: string;
    username: string;
    avatar: string;
  };
  likes: string[]; // User IDs
  views: number;
  downloads: number;
  commentsCount: number;
  approved?: boolean;
  createdAt: string;
}

export interface CollectionDocument {
  id: string;
  name: string;
  user: string; // User ID
  components: string[]; // Component IDs
  visibility: 'public' | 'private';
  createdAt: string;
}

export interface CommentDocument {
  id: string;
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  component: string; // Component ID
  text: string;
  createdAt: string;
}

export interface NotificationDocument {
  id: string;
  recipient: string; // User ID
  sender: {
    id: string;
    username: string;
    avatar: string;
  };
  type: 'like' | 'comment' | 'follow' | 'save';
  componentId?: string;
  componentTitle?: string;
  createdAt: string;
  read: boolean;
}

export interface ReportDocument {
  id: string;
  reporter: {
    id: string;
    username: string;
  };
  componentId: string;
  componentTitle: string;
  reason: string;
  createdAt: string;
  status: 'pending' | 'resolved';
}

const DB_PATH = path.join(process.cwd(), 'db.json');

interface DatabaseSchema {
  users: UserDocument[];
  components: ComponentDocument[];
  collections: CollectionDocument[];
  comments: CommentDocument[];
  notifications: NotificationDocument[];
  reports: ReportDocument[];
  siteViews: number;
}

const initialDb: DatabaseSchema = {
  users: [],
  components: [],
  collections: [],
  comments: [],
  notifications: [],
  reports: [],
  siteViews: 0
};

// Seed components
const seedComponents: Partial<ComponentDocument>[] = [
  {
    title: 'Glowing Neon Slide Button',
    description: 'An interactive neon slide button with smooth border animations, responsive hover effects, and spring hover loops.',
    category: 'Buttons',
    tags: ['New', 'Popular', 'Neon', 'Framer Motion'],
    thumbnail: '按钮',
    htmlCode: `<button class="relative px-6 py-3 rounded-xl font-medium text-white group overflow-hidden bg-slate-900 border border-white/10 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95">
  <span class="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-violet-600 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
  <span class="relative z-10 flex items-center gap-2">Slide Glowing Aura <span class="group-hover:translate-x-1 transition-transform">→</span></span>
</button>`,
    cssCode: `button {
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
button:hover {
  box-shadow: 0 0 25px rgba(139, 92, 246, 0.3);
}`,
    jsCode: `// No JS required for css implementation`,
    reactCode: `import React from 'react';\nimport { motion } from 'framer-motion';\n\nexport default function CustomButton() {\n  return (\n    <motion.button \n      whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(139, 92, 246, 0.35)' }}\n      whileTap={{ scale: 0.95 }}\n      className="relative px-6 py-3 rounded-xl font-medium text-white bg-slate-900 border border-white/10 overflow-hidden shadow-2xl transition-all"\n    >\n      <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-violet-600 to-pink-500"></span>\n      <span>Slide Glowing Aura</span>\n    </motion.button>\n  );\n}`,
    tailwindCode: `bg-slate-900 text-white px-6 py-3 rounded-xl border border-white/10 shadow-xl font-semibold`
  },
  {
    title: 'Dynamic Mouse-Follow Glow Card',
    description: 'A responsive glassmorphism bento card that acts as a mouse follower with background blur and neon grids.',
    category: 'Cards',
    tags: ['Glassmorphism', 'Popular', 'Interactive'],
    thumbnail: '卡片',
    htmlCode: `<div class="relative w-80 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl overflow-hidden group">
  <div class="absolute -top-10 -left-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl group-hover:translate-x-12 group-hover:translate-y-12 transition-all duration-500"></div>
  <h3 class="text-white text-lg font-bold mb-2">Neon Ambient Card</h3>
  <p class="text-slate-400 text-xs leading-relaxed">Dynamic gradient glow maps directly to parent cursor intersections.</p>
</div>`,
    cssCode: `.card {
  backdrop-filter: blur(12px);
}`,
    jsCode: `// Hover light coordinates mapped dynamically`,
    reactCode: `import React from 'react';\nimport { motion } from 'framer-motion';\n\nexport default function GlowCard() {\n  return (\n    <div className="relative w-72 p-6 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl group overflow-hidden text-left">\n      <div className="absolute -inset-px bg-gradient-to-t from-cyan-500 to-purple-600 opacity-20 blur group-hover:opacity-40 transition" />\n      <h3 className="text-white text-base font-extrabold font-display">Aura Bento Grid</h3>\n      <p className="text-xs text-neutral-400 mt-2">Perfect responsive details with custom backdrop blurring.</p>\n    </div>\n  );\n}`,
    tailwindCode: `bg-[#0d0d0d] border border-white/5 hover:border-cyan-500/30 rounded-2xl p-6 shadow-xl`
  },
  {
    title: 'Futuristic AI Pulse Portal Sphere',
    description: 'A beautiful animated loader utilizing circular rotating rings and glow shadows representing an AI portal sphere.',
    category: 'Loaders',
    tags: ['Trending', '3D Elements', 'Animations'],
    thumbnail: '加载器',
    htmlCode: `<div class="relative w-16 h-16 flex items-center justify-center">
  <div class="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
  <div class="absolute inset-0 border-4 border-t-cyan-400 rounded-full animate-spin"></div>
  <div class="w-8 h-8 rounded-full bg-cyan-500/30 animate-ping"></div>
</div>`,
    cssCode: `@keyframes spin {
  to { transform: rotate(360deg); }
}`,
    jsCode: ``,
    reactCode: `import React from 'react';\n\nexport default function AIOrb() {\n  return (\n    <div className="relative w-16 h-16 flex items-center justify-center">\n      <div className="absolute inset-0 border-2 border-dashed border-violet-500/30 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>\n      <div className="absolute w-12 h-12 border-2 border-indigo-400 border-t-pink-500 rounded-full animate-spin"></div>\n      <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-pulse"></div>\n    </div>\n  );\n}`,
    tailwindCode: `w-16 h-16 border-2 border-t-violet-500 border-r-transparent rounded-full animate-spin`
  },
  {
    title: 'Glow Moving Border Input',
    description: 'A modern neon border text input that activates a smooth moving gradient line on focus state.',
    category: 'Inputs',
    tags: ['Popular', 'Forms'],
    thumbnail: '输入框',
    htmlCode: `<div class="relative w-72">
  <input type="text" placeholder="Type quantum values..." class="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none transition-colors" />
</div>`,
    cssCode: ``,
    jsCode: ``,
    reactCode: `import React from 'react';\n\nexport default function FluentInput() {\n  return (\n    <div className="relative w-72">\n      <input \n        type="text" \n        placeholder="Search vectors..." \n        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs placeholder:text-neutral-500 focus:border-purple-500 focus:outline-none shadow-inner transition-all"\n      />\n    </div>\n  );\n}`,
    tailwindCode: `bg-[#0f172a] border border-white/10 px-4 py-2 text-white rounded-lg focus:outline-none`
  },
  {
    title: 'Minimalist Metrics Dashboard',
    description: 'A comprehensive, layout analytics dashboard section built using glass grids and modern high-contrast typography.',
    category: 'Dashboards',
    tags: ['New', 'Pro'],
    thumbnail: '仪表盘',
    htmlCode: `<div class="p-6 bg-slate-900 border border-white/5 rounded-2xl w-full max-w-md">
  <div class="flex justify-between items-center mb-4">
    <h4 class="text-white text-sm font-extrabold uppercase tracking-wide">Live Stream Stats</h4>
    <span class="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
  </div>
  <div class="grid grid-cols-2 gap-4">
    <div class="p-4 rounded-xl bg-white/5 border border-white/5 text-left">
      <span class="text-slate-400 text-[10px]">TOTAL SAVED</span>
      <h3 class="text-white text-xl font-bold mt-1">4,289</h3>
    </div>
    <div class="p-4 rounded-xl bg-white/5 border border-white/5 text-left">
      <span class="text-slate-400 text-[10px]">LIKES COUNT</span>
      <h3 class="text-cyan-400 text-xl font-bold mt-1">981</h3>
    </div>
  </div>
</div>`,
    cssCode: ``,
    jsCode: ``,
    reactCode: `import React from 'react';\n\nexport default function SparkDashboard() {\n  return (\n    <div className="p-5 rounded-2xl bg-[#090d16] border border-slate-800 text-left max-w-sm w-full">\n      <h4 className="text-[10px] text-cyan-400 uppercase font-mono font-bold tracking-widest">Aura Telemetry</h4>\n      <div className="mt-3 flex items-baseline gap-2">\n        <span className="text-3xl font-display font-extrabold italic text-white">99.8%</span>\n        <span className="text-emerald-400 text-[10px] font-bold">Uptime verified</span>\n      </div>\n    </div>\n  );\n}`,
    tailwindCode: `bg-slate-900 p-6 rounded-2xl border border-white/5 text-white shadow-2xl`
  },
  {
    title: 'Glassmorphic Dialog Module',
    description: 'A gorgeous premium multi-layered modal with background blur, clean closing animations, and subtle gradient highlights.',
    category: 'Modals',
    tags: ['New', 'Popular'],
    thumbnail: '弹窗',
    htmlCode: `<div class="p-6 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-xl text-center max-w-xs shadow-2xl">
  <h4 class="text-white font-bold text-lg">System Override</h4>
  <p class="text-slate-400 text-xs mt-2">Proceeding will initialize core sync cycles across cloud cluster frameworks.</p>
  <button class="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-500">Acknowledge</button>
</div>`,
    cssCode: ``,
    jsCode: ``,
    reactCode: `import React from 'react';\n\nexport default function GlassDialog() {\n  return (\n    <div className="p-6 rounded-2xl bg-[#080812] border border-white/10 text-left max-w-xs shadow-2xl relative">\n      <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full blur-xl"></div>\n      <h4 className="text-white text-sm font-bold">Confirm Vector Lock</h4>\n      <p className="text-slate-400 text-[11px] mt-1.5 leading-relaxed">This locks custom settings to browser databases.</p>\n      <div className="mt-4 flex gap-2 justify-end">\n        <button className="px-3 py-1.5 text-[10px] text-slate-400 hover:text-white">Cancel</button>\n        <button className="px-3 py-1.5 text-[10px] bg-[#a855f7] text-white rounded font-bold">Deploy</button>\n      </div>\n    </div>\n  );\n}`,
    tailwindCode: `bg-[#0a0a16] p-6 rounded-2xl border border-white/10 max-w-xs text-white`
  },
  {
    title: 'Blur-Adaptive Orbit Header',
    description: 'A responsive floating horizontal navbar complete with intelligent blur backdrops and active neon hover grids.',
    category: 'Navbars',
    tags: ['New', 'Popular'],
    thumbnail: '导航',
    htmlCode: `<nav class="flex items-center justify-between px-6 py-3 rounded-full bg-slate-900/40 border border-white/5 backdrop-blur-md max-w-md w-full">
  <span class="text-xs font-bold text-white tracking-widest">AURA</span>
  <div class="flex gap-4 text-[10px] text-slate-400 font-medium">
    <a href="#" class="hover:text-white">Home</a>
    <a href="#" class="hover:text-white">Assets</a>
    <a href="#" class="hover:text-white">Pricing</a>
  </div>
</nav>`,
    cssCode: ``,
    jsCode: ``,
    reactCode: `import React from 'react';\n\nexport default function FluentNavbar() {\n  return (\n    <nav className="flex items-center justify-between px-4 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-lg w-full max-w-sm">\n      <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#a855f7] tracking-wider font-display">AURA</span>\n      <div className="flex gap-3.5 text-[10px] text-slate-400 font-bold">\n        <span className="hover:text-white cursor-pointer transition-colors">Explore</span>\n        <span className="hover:text-white cursor-pointer transition-colors">Submit</span>\n      </div>\n    </nav>\n  );\n}`,
    tailwindCode: `bg-slate-900/60 border border-white/5 rounded-full px-6 py-3 text-white`
  },
  {
    title: 'Collapsible Command Console',
    description: 'An elegant user rail/sidebar containing integrated navigation links and quick profile triggers.',
    category: 'Sidebars',
    tags: ['New'],
    thumbnail: '边栏',
    htmlCode: `<aside class="w-48 bg-slate-950 p-4 rounded-2xl border border-white/5 flex flex-col justify-between h-48">
  <div class="space-y-3">
    <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Dashboard</span>
    <div class="space-y-1">
      <span class="block text-xs text-white bg-white/5 px-2 py-1 rounded">Metrics</span>
      <span class="block text-xs text-slate-400 hover:text-white px-2 py-1">Settings</span>
    </div>
  </div>
</aside>`,
    cssCode: ``,
    jsCode: ``,
    reactCode: `import React from 'react';\n\nexport default function MiniSidebar() {\n  return (\n    <div className="w-44 bg-slate-950 border border-white/5 p-3 rounded-2xl text-left flex flex-col justify-between gap-4 font-sans">\n      <div className="space-y-2">\n        <div className="text-[10px] font-bold text-slate-500 tracking-wider">AURA CONSOLE</div>\n        <div className="space-y-1">\n          <div className="px-2 py-1 text-xs text-white bg-[#a855f7]/15 text-[#c084fc] rounded-lg cursor-pointer">Analytics</div>\n          <div className="px-2 py-1 text-xs text-slate-400 hover:text-white cursor-pointer transition-colors">System</div>\n        </div>\n      </div>\n    </div>\n  );\n}`,
    tailwindCode: `bg-black/80 border border-white/5 rounded-2xl p-4 w-48 text-white`
  },
  {
    title: 'Feedback Syncer Form',
    description: 'A beautiful feedback questionnaire form with interactive rating stars and clean glow text field focus.',
    category: 'Forms',
    tags: ['New'],
    thumbnail: '表框',
    htmlCode: `<form class="p-5 rounded-2xl bg-slate-900 border border-white/10 max-w-sm w-full space-y-3">
  <h4 class="text-white text-xs font-bold uppercase tracking-wider">Submit Review</h4>
  <input type="text" placeholder="Title" class="w-full bg-slate-950 border border-white/10 rounded px-2.5 py-1 text-xs text-white" />
  <textarea placeholder="Your review..." class="w-full bg-slate-950 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white h-12"></textarea>
  <button class="w-full py-1.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded">Send Feedback</button>
</form>`,
    cssCode: ``,
    jsCode: ``,
    reactCode: `import React, { useState } from 'react';\n\nexport default function FeedbackForm() {\n  return (\n    <div className="p-4 bg-[#0a0a0f] border border-white/5 rounded-xl text-left max-w-sm w-full space-y-3 font-sans">\n      <h4 className="text-xs font-bold text-white tracking-tight">Active Sync Dispatch</h4>\n      <div className="space-y-2">\n        <input placeholder="Host URL" className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none" />\n        <button className="w-full py-1.5 bg-[#a855f7] text-white rounded-lg text-xs font-bold hover:bg-opacity-95">Sync System Node</button>\n      </div>\n    </div>\n  );\n}`,
    tailwindCode: `bg-slate-900 border border-white/5 rounded-xl p-5 w-72 text-white`
  },
  {
    title: 'Sleek Tier Pricing Matrix',
    description: 'A responsive premium pricing plan card featuring prominent cost displays, features lists, and direct checkout actions.',
    category: 'Pricing tables',
    tags: ['New', 'Pro'],
    thumbnail: '价格',
    htmlCode: `<div class="bg-slate-900/60 p-6 rounded-3xl border border-white/10 text-center max-w-xs shadow-2xl relative overflow-hidden">
  <span class="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-[9px] font-bold tracking-widest uppercase">PRO BUNDLE</span>
  <h4 class="text-3xl font-bold font-mono text-white mt-3">$29<span class="text-xs text-slate-400 font-sans font-normal">/mo</span></h4>
  <ul class="text-[11px] text-slate-400 text-left my-4 space-y-2">
    <li>✓ Sync unlimited files</li>
    <li>✓ Quantum vector mapping</li>
  </ul>
  <button class="w-full py-2 bg-white text-slate-900 font-extrabold text-[11px] rounded-xl">UPGRADE NOW</button>
</div>`,
    cssCode: ``,
    jsCode: ``,
    reactCode: `import React from 'react';\n\nexport default function PriceCard() {\n  return (\n    <div className="p-4 rounded-xl bg-slate-900 border border-white/5 text-left max-w-sm w-full font-sans relative overflow-hidden">\n      <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl"></div>\n      <span className="text-[9px] font-bold text-emerald-400 tracking-wider">CREATOR LEVEL</span>\n      <h3 className="text-xl font-bold text-white mt-1">$15 <span className="text-[10px] text-slate-500">/ month</span></h3>\n      <button className="w-full mt-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-extrabold">Active License</button>\n    </div>\n  );\n}`,
    tailwindCode: `bg-[#0f172a] rounded-3xl p-6 border border-white/10 text-white`
  },
  {
    title: 'Cosmic Particle Hero Section',
    description: 'A beautiful visual display container utilizing wide typographic headings, description subtitles, and ambient glow frames.',
    category: 'Hero sections',
    tags: ['New', 'Popular'],
    thumbnail: '海报',
    htmlCode: `<div class="p-8 rounded-3xl bg-slate-950 text-center max-w-md border border-white/5 shadow-2xl relative overflow-hidden">
  <h1 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-amber-300">CURATE AMAZING WEB UI</h1>
  <p class="text-xs text-slate-400 mt-3 leading-relaxed">Atmospheric vector structures designed for full-stack react environments.</p>
</div>`,
    cssCode: ``,
    jsCode: ``,
    reactCode: `import React from 'react';\n\nexport default function CosmosHero() {\n  return (\n    <div className="p-6 bg-slate-950 border border-white/5 rounded-2xl text-left max-w-sm w-full font-sans">\n      <h1 className="text-lg font-black tracking-tight text-white leading-tight uppercase font-display">Crafting the Cyber Era</h1>\n      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">Modular components compiled on demand utilizing standalone systems.</p>\n    </div>\n  );\n}`,
    tailwindCode: `bg-slate-950 rounded-3xl border border-white/5 p-8 text-white`
  },
  {
    title: 'Pulse Quote Cascade',
    description: 'An elegant user testimonial layout centering verified reviews, avatars, credentials, and stars arrays.',
    category: 'Testimonials',
    tags: ['New'],
    thumbnail: '推荐',
    htmlCode: `<div class="p-5 rounded-2xl bg-slate-900 border border-white/5 max-w-xs text-left">
  <p class="text-xs italic text-slate-300 leading-relaxed">"The glassmorphic loading speed metrics transformed our interface! Exceptional library code quality."</p>
  <div class="flex items-center gap-2 mt-4">
    <div class="w-7 h-7 rounded-full bg-slate-700 animate-pulse"></div>
    <div>
      <h5 class="text-xs font-bold text-white">Xavier Thorne</h5>
      <span class="text-[9px] text-slate-400 block">Lead Platform Architect</span>
    </div>
  </div>
</div>`,
    cssCode: ``,
    jsCode: ``,
    reactCode: `import React from 'react';\n\nexport default function TestimonialItem() {\n  return (\n    <div className="p-4 bg-slate-900 border border-white/5 rounded-xl text-left max-w-xs w-full font-sans">\n      <p className="text-[11px] text-slate-300 italic">"Integrating the modular elements into our system decreased overhead on our frontend builds immensely!"</p>\n      <div className="flex gap-2.5 items-center mt-3 pt-2.5 border-t border-white/5">\n        <div className="w-6 h-6 rounded-full bg-indigo-500 text-[10px] font-bold text-white flex items-center justify-center">E</div>\n        <div>\n          <h4 className="text-[10px] font-bold text-white leading-none">Elena Rostova</h4>\n          <span className="text-[8px] text-slate-500 block">Core Dev</span>\n        </div>\n      </div>\n    </div>\n  );\n}`,
    tailwindCode: `bg-slate-900 border border-white/5 p-5 rounded-xl text-white`
  },
  {
    title: 'Quantum Minimal Footer',
    description: 'A beautiful system-footer layout incorporating copyrights, legal links, and social platform indicators.',
    category: 'Footers',
    tags: ['New'],
    thumbnail: '页脚',
    htmlCode: `<footer class="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-white/5 text-[9px] text-slate-500 max-w-md w-full font-mono">
  <span>© 2026 Cosmic Enclave Inc.</span>
  <div class="flex gap-3">
    <a href="#" class="hover:text-white">TERMS</a>
    <a href="#" class="hover:text-white">SECURITY</a>
  </div>
</footer>`,
    cssCode: ``,
    jsCode: ``,
    reactCode: `import React from 'react';\n\nexport default function SimpleFooter() {\n  return (\n    <footer className="flex justify-between items-center px-4 py-2 border-t border-white/5 text-[10px] text-slate-500 font-mono w-full max-w-sm">\n      <span>© 2026 AURA_LABS</span>\n      <span>RELEASE V4.0</span>\n    </footer>\n  );\n}`,
    tailwindCode: `bg-[#030307] border-t border-white/5 text-[10px] text-slate-500 p-4`
  },
  {
    title: 'Aura Shield React Admin Sign-In',
    description: 'A real React admin portal credentials gate with responsive inputs, dynamic errors validation, and interactive submission keys.',
    category: 'Authentication UI',
    tags: ['New', 'Popular'],
    thumbnail: '鉴权',
    htmlCode: `<div class="p-6 bg-slate-900 border border-white/10 rounded-2xl w-full max-w-xs text-left">
  <h4 class="text-white text-sm font-bold">Admin Portal Access</h4>
  <p class="text-slate-400 text-[10px] mt-1">Please authorize admin scopes using security vault key inputs.</p>
  <div class="space-y-2.5 mt-4">
    <input type="text" placeholder="Admin username" class="w-full bg-slate-950 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white" />
    <input type="password" placeholder="Vault password" class="w-full bg-slate-950 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white" />
    <button class="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs rounded-lg uppercase tracking-wider">Authorize</button>
  </div>
</div>`,
    cssCode: ``,
    jsCode: ``,
    reactCode: `import React, { useState } from 'react';\n\nexport default function AdminAuth() {\n  const [username, setUsername] = useState('');\n  const [pwd, setPwd] = useState('');\n  const [msg, setMsg] = useState('');\n  const [loading, setLoading] = useState(false);\n\n  const handleAuth = (e) => {\n    e.preventDefault();\n    if (!username || !pwd) {\n      setMsg('Fields must not be blank.');\n      return;\n    }\n    setLoading(true);\n    setMsg('');\n    setTimeout(() => {\n      setLoading(false);\n      setMsg('Authorization pending security verification approval.');\n    }, 1200);\n  };\n\n  return (\n    <div className="p-5 bg-slate-900 border border-white/10 rounded-xl text-left max-w-xs w-full font-sans relative overflow-hidden">\n      <h4 className="text-xs font-bold text-white uppercase tracking-wider">AURA SHIELD SECURE LOGIN</h4>\n      <form onSubmit={handleAuth} className="space-y-3 mt-3">\n        <input \n          type="text" \n          placeholder="Admin alias" \n          value={username} \n          onChange={e => setUsername(e.target.value)} \n          className="w-full bg-slate-950 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none" \n        />\n        <input \n          type="password" \n          placeholder="Access token" \n          value={pwd} \n          onChange={e => setPwd(e.target.value)} \n          className="w-full bg-slate-950 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none" \n        />\n        <button type="submit" className="w-full py-1.5 bg-[#a855f7] hover:bg-[#b05ff7] text-white rounded text-[10px] font-extrabold uppercase tracking-wide transition-all">\n          {loading ? 'Authenticating...' : 'Enter Admin Vault'}\n        </button>\n        {msg && <p className="text-[9px] text-[#c084fc] font-mono leading-tight">{msg}</p>}\n      </form>\n    </div>\n  );\n}`,
    tailwindCode: `bg-[#020205] border border-white/5 rounded-3xl p-8 w-72 text-white`
  },
  {
    title: 'Horizon S4 Checkout Hub',
    description: 'An interactive checkout summary sheet mapping billing lines, automated coupon validation, and payment option locks.',
    category: 'Ecommerce UI',
    tags: ['New', 'Popular'],
    thumbnail: '电商',
    htmlCode: `<div class="p-5 bg-slate-950 border border-white/10 rounded-2xl w-full max-w-xs text-left text-white">
  <h4 class="text-xs font-bold uppercase tracking-wider">Checkout Total</h4>
  <div class="space-y-2 mt-4 text-[11px] text-slate-400">
    <div class="flex justify-between"><span>Core Vector Bundle</span><span>$140.00</span></div>
    <div class="flex justify-between"><span>Taxes</span><span>$11.20</span></div>
    <div class="flex justify-between font-bold text-emerald-400 pt-2 border-t border-white/5"><span>TOTAL</span><span>$151.20</span></div>
  </div>
  <button class="w-full py-2 bg-emerald-500 text-[#020202] font-bold text-xs rounded-lg mt-4 uppercase">Authorize Purchase</button>
</div>`,
    cssCode: ``,
    jsCode: ``,
    reactCode: `import React, { useState } from 'react';\n\nexport default function CheckoutForm() {\n  const [promo, setPromo] = useState('');\n  const [disc, setDisc] = useState(0);\n  const [promoMsg, setPromoMsg] = useState('');\n  const basePrice = 280;\n\n  const handlePromo = () => {\n    if (promo.trim().toUpperCase() === 'COSMIC') {\n      setDisc(40);\n      setPromoMsg('Promo applied! $40 discount verified.');\n    } else {\n      setPromoMsg('Invalid promotional code.');\n    }\n  };\n\n  return (\n    <div className="p-5 bg-[#090912] border border-white/15 rounded-xl text-left max-w-xs w-full font-sans">\n      <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-2">Checkout summary</h4>\n      <div className="space-y-1.5 mt-3 text-[10px] text-slate-400">\n        <div className="flex justify-between"><span>Quantum S4 Orb License</span><span className="font-mono">$280.00</span></div>\n        {disc > 0 && <div className="flex justify-between text-emerald-400"><span>Aura Discount</span><span className="font-mono">-$40.00</span></div>}\n        <div className="flex justify-between font-bold text-white pt-1.5 border-t border-white/5"><span>Total Value</span><span className="font-mono">$240.00</span></div>\n      </div>\n      \n      <div className="flex gap-1 py-3">\n        <input \n          placeholder="Promo: COSMIC" \n          value={promo} \n          onChange={e => setPromo(e.target.value)} \n          className="flex-1 bg-slate-950 border border-white/10 rounded px-2 py-1 text-[9px] text-white focus:outline-none" \n        />\n        <button onClick={handlePromo} className="px-2 py-1 bg-white hover:bg-slate-100 text-[9px] font-extrabold rounded text-slate-950 uppercase">Apply</button>\n      </div>\n      {promoMsg && <p className="text-[9px] text-purple-400 font-mono mb-2.5 leading-none">{promoMsg}</p>}\n      \n      <button className="w-full py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold rounded text-[10px] uppercase transition-all tracking-wide">\n        Lock Final Order\n      </button>\n    </div>\n  );\n}`,
    tailwindCode: `bg-[#030308] border border-white/5 rounded-3xl p-6 text-white`
  }
];

class StoreManager {
  private data: DatabaseSchema = { ...initialDb };
  private isSavingMongo = false;

  constructor() {
    this.load();
    this.initializeMongoSync();
  }

  private async initializeMongoSync() {
    if (!isMongoConfigured) {
      console.log("MERN STACK INFO: Local filesystem Database mode is active (set MONGODB_URI to enable MongoDB integration).");
      return;
    }
    const conn = await connectMongo();
    if (conn) {
      console.log("MERN STACK SUCCESS: Active MongoDB database discovered! Initializing master sync...");
      try {
        const users = await MongoUser.find().lean();
        const components = await MongoComponent.find().lean();
        const collections = await MongoCollection.find().lean();
        const comments = await MongoComment.find().lean();
        const notifications = await MongoNotification.find().lean();
        const reports = await MongoReport.find().lean();
        const stats = await MongoSiteStats.findOne({ key: 'site_metric' }).lean();

        if (users.length > 0 || components.length > 0) {
          console.log("MERN STACK SUCCESS: Loaded active records from MongoDB into localized memory cache.");
          this.data.users = users as any;
          this.data.components = components as any;
          this.data.collections = collections as any;
          this.data.comments = comments as any;
          this.data.notifications = notifications as any;
          this.data.reports = reports as any;
          if (stats) this.data.siteViews = stats.siteViews;
          
          // Write down to copy to local db.json
          fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
        } else {
          console.log("MERN STACK INFO: MongoDB collection is fresh. Seeding default uiverse elements to cloud...");
          await syncLocalSeedToMongo(this.data);
        }
      } catch (err) {
        console.error("MERN STACK WARNING: Master MongoDB synchronization failed:", err);
      }
    }
  }

  private async syncToMongo() {
    if (!isMongoConfigured) return;
    if (this.isSavingMongo) return;
    this.isSavingMongo = true;
    try {
      const conn = await connectMongo();
      if (!conn) {
        console.warn("MERN STACK WARNING: Background MongoDB sync skipped: Database connection offline.");
        this.isSavingMongo = false;
        return;
      }
      
      // Update Users
      for (const u of this.data.users) {
        await MongoUser.findOneAndUpdate({ id: u.id }, u, { upsert: true });
      }
      
      // Update Components
      for (const c of this.data.components) {
        await MongoComponent.findOneAndUpdate({ id: c.id }, c, { upsert: true });
      }
      // Delete any component in mongo not present locally
      const compIds = this.data.components.map(c => c.id);
      await MongoComponent.deleteMany({ id: { $nin: compIds } });

      // Update Collections
      for (const col of this.data.collections) {
        await MongoCollection.findOneAndUpdate({ id: col.id }, col, { upsert: true });
      }
      const colIds = this.data.collections.map(c => c.id);
      await MongoCollection.deleteMany({ id: { $nin: colIds } });

      // Update Comments
      for (const comm of this.data.comments) {
        await MongoComment.findOneAndUpdate({ id: comm.id }, comm, { upsert: true });
      }
      const commIds = this.data.comments.map(c => c.id);
      await MongoComment.deleteMany({ id: { $nin: commIds } });

      // Update Notifications
      for (const n of this.data.notifications) {
        await MongoNotification.findOneAndUpdate({ id: n.id }, n, { upsert: true });
      }
      const notifIds = this.data.notifications.map(n => n.id);
      await MongoNotification.deleteMany({ id: { $nin: notifIds } });

      // Update Reports
      for (const r of this.data.reports) {
        await MongoReport.findOneAndUpdate({ id: r.id }, r, { upsert: true });
      }
      const reportIds = this.data.reports.map(r => r.id);
      await MongoReport.deleteMany({ id: { $nin: reportIds } });

      // Update Site Stats Metrics
      await MongoSiteStats.findOneAndUpdate(
        { key: 'site_metric' }, 
        { siteViews: this.data.siteViews }, 
        { upsert: true }
      );
      
      console.log("MERN STACK SUCCESS: Changes securely synced to MongoDB.");
    } catch (err) {
      console.error("MERN STACK WARNING: Background MongoDB sync failing:", err);
    } finally {
      this.isSavingMongo = false;
    }
  }

  private load() {
    try {
      if (fs.existsSync(DB_PATH)) {
        const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
        this.data = JSON.parse(fileContent);
        
        // Ensure keys exist
        if (!this.data.users) this.data.users = [];
        if (!this.data.components) this.data.components = [];
        if (!this.data.collections) this.data.collections = [];
        if (!this.data.comments) this.data.comments = [];
        if (!this.data.notifications) this.data.notifications = [];
        if (!this.data.reports) this.data.reports = [];
        if (this.data.siteViews === undefined) this.data.siteViews = 0;

        // Ensure every category has at least one component
        const existingCategories = new Set(this.data.components.map(c => c.category));
        let addedAny = false;
        seedComponents.forEach((c, idx) => {
          if (c.category && !existingCategories.has(c.category)) {
            const demoUser = this.data.users.find(u => u.id === 'usr_demo') || { id: 'usr_demo', username: 'pixel_architect', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop' };
            const dbComp: ComponentDocument = {
              id: `comp_auto_${idx + 1}`,
              title: c.title || 'Untitled Vector',
              description: c.description || '',
              category: c.category || 'Buttons',
              tags: c.tags || ['New'],
              thumbnail: c.thumbnail || '组件',
              htmlCode: c.htmlCode || '',
              cssCode: c.cssCode || '',
              jsCode: c.jsCode || '',
              reactCode: c.reactCode || '',
              tailwindCode: c.tailwindCode || '',
              author: {
                id: demoUser.id,
                username: demoUser.username,
                avatar: demoUser.avatar
              },
              likes: [],
              views: Math.floor(Math.random() * 200) + 120,
              downloads: Math.floor(Math.random() * 50) + 20,
              commentsCount: 0,
              createdAt: new Date(Date.now() - (idx * 3600000 * 24)).toISOString()
            };
            this.data.components.push(dbComp);
            existingCategories.add(c.category);
            addedAny = true;
          }
        });
        if (addedAny) {
          fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
        }
      } else {
        this.data = { ...initialDb };
        this.seedInitial();
      }
    } catch (e) {
      console.error("DB Load error:", e);
      this.data = { ...initialDb };
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
      // Fire-and-forget background synchronization to MongoDB!
      this.syncToMongo();
    } catch (e) {
      console.error("DB Save error:", e);
    }
  }

  private seedInitial() {
    // Seed an admin
    const passwordHash = bcrypt.hashSync('admin123', 10);
    const adminUser: UserDocument = {
      id: 'usr_admin',
      username: 'uiverse_admin',
      email: 'admin@uiverse.io',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
      bio: 'Uiverse administrator & lead moderation queue supervisor.',
      followers: [],
      following: [],
      savedComponents: [],
      collections: [],
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    
    const regularUserHash = bcrypt.hashSync('user123', 10);
    const demoUser: UserDocument = {
      id: 'usr_demo',
      username: 'pixel_architect',
      email: 'pixel@uiverse.io',
      passwordHash: regularUserHash,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      bio: 'Visual designer specialized in cyber-retro glassmorphism styles.',
      followers: [],
      following: [],
      savedComponents: [],
      collections: [],
      role: 'user',
      createdAt: new Date().toISOString()
    };

    this.data.users.push(adminUser, demoUser);

    // Seed preset components
    seedComponents.forEach((c, idx) => {
      const dbComp: ComponentDocument = {
        id: `comp_${idx + 1}`,
        title: c.title || 'Untitled Vector',
        description: c.description || '',
        category: c.category || 'Buttons',
        tags: c.tags || ['New'],
        thumbnail: c.thumbnail || '组件',
        htmlCode: c.htmlCode || '',
        cssCode: c.cssCode || '',
        jsCode: c.jsCode || '',
        reactCode: c.reactCode || '',
        tailwindCode: c.tailwindCode || '',
        author: {
          id: demoUser.id,
          username: demoUser.username,
          avatar: demoUser.avatar
        },
        likes: ['usr_admin'], // default liked by admin
        views: Math.floor(Math.random() * 400) + 120,
        downloads: Math.floor(Math.random() * 80) + 20,
        commentsCount: 2,
        createdAt: new Date(Date.now() - (idx * 3600000 * 24)).toISOString()
      };
      
      this.data.components.push(dbComp);
      
      // Auto seed comments for each component
      this.data.comments.push({
        id: `comm_${dbComp.id}_1`,
        user: {
          id: adminUser.id,
          username: adminUser.username,
          avatar: adminUser.avatar
        },
        component: dbComp.id,
        text: `Absolutely stunning! The clean layout and micro-interactions render flawlessly.`,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }, {
        id: `comm_${dbComp.id}_2`,
        user: {
          id: demoUser.id,
          username: demoUser.username,
          avatar: demoUser.avatar
        },
        component: dbComp.id,
        text: `Thanks for the feedback! Feel free to copy-paste the JSX directly into your React projects.`,
        createdAt: new Date().toISOString()
      });
    });

    // Seed collection
    const demoColl: CollectionDocument = {
      id: 'coll_featured',
      name: 'Best of Glowing Aura',
      user: demoUser.id,
      components: ['comp_1', 'comp_2', 'comp_3'],
      visibility: 'public',
      createdAt: new Date().toISOString()
    };
    this.data.collections.push(demoColl);
    demoUser.collections.push(demoColl.id);

    this.save();
    console.log("Database initialized & seeded with default items!");
  }

  // --- User Core Methods ---
  getUsers() {
    this.load();
    return this.data.users;
  }

  findUserById(id: string) {
    this.load();
    return this.data.users.find(u => u.id === id);
  }

  findUserByEmail(email: string) {
    this.load();
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserByUsername(username: string) {
    this.load();
    return this.data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  createUser(user: Omit<UserDocument, 'id' | 'createdAt'>) {
    this.load();
    const newUser: UserDocument = {
      ...user,
      id: `usr_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  updateUser(id: string, updates: Partial<UserDocument>) {
    this.load();
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates } as UserDocument;
      this.save();
      return this.data.users[idx];
    }
    return null;
  }

  // --- Components CRUD ---
  getComponents() {
    this.load();
    // Return none banned creators if any helper filters needed
    return this.data.components;
  }

  findComponentById(id: string) {
    this.load();
    return this.data.components.find(c => c.id === id);
  }

  createComponent(comp: Omit<ComponentDocument, 'id' | 'views' | 'downloads' | 'likes' | 'commentsCount' | 'createdAt'>) {
    this.load();
    const newComp: ComponentDocument = {
      ...comp,
      id: `comp_${Date.now()}`,
      views: 0,
      downloads: 0,
      likes: [],
      commentsCount: 0,
      createdAt: new Date().toISOString()
    };
    this.data.components.unshift(newComp);
    this.save();
    return newComp;
  }

  updateComponent(id: string, updates: Partial<ComponentDocument>) {
    this.load();
    const idx = this.data.components.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.data.components[idx] = { ...this.data.components[idx], ...updates } as ComponentDocument;
      this.save();
      return this.data.components[idx];
    }
    return null;
  }

  deleteComponent(id: string) {
    this.load();
    const lenBefore = this.data.components.length;
    this.data.components = this.data.components.filter(c => c.id !== id);
    // Also remove from saved lists
    this.data.users.forEach(u => {
      u.savedComponents = u.savedComponents.filter(cid => cid !== id);
    });
    // Remove comments
    this.data.comments = this.data.comments.filter(c => c.component !== id);
    // Remove from collections
    this.data.collections.forEach(col => {
      col.components = col.components.filter(cid => cid !== id);
    });
    this.save();
    return this.data.components.length < lenBefore;
  }

  // --- Saving & Favorites ---
  saveProductToggle(userId: string, componentId: string) {
    this.load();
    const user = this.data.users.find(u => u.id === userId);
    if (!user) return false;
    
    const hasSaved = user.savedComponents.includes(componentId);
    if (hasSaved) {
      user.savedComponents = user.savedComponents.filter(cid => cid !== componentId);
    } else {
      user.savedComponents.push(componentId);
    }
    this.save();
    return !hasSaved; // returns true if now saved, false if removed
  }

  // --- Like Component Toggle ---
  likeComponentToggle(userId: string, componentId: string) {
    this.load();
    const comp = this.data.components.find(c => c.id === componentId);
    if (!comp) return { liked: false, likes: [] };

    const idx = comp.likes.indexOf(userId);
    let liked = false;
    if (idx !== -1) {
      comp.likes.splice(idx, 1);
    } else {
      comp.likes.push(userId);
      liked = true;

      // Create notification
      if (comp.author.id !== userId) {
        const sender = this.findUserById(userId);
        if (sender) {
          this.createNotification({
            recipient: comp.author.id,
            sender: {
              id: sender.id,
              username: sender.username,
              avatar: sender.avatar
            },
            type: 'like',
            componentId,
            componentTitle: comp.title
          });
        }
      }
    }
    this.save();
    return { liked, likes: comp.likes };
  }

  // --- Collections CRUD ---
  getCollections() {
    this.load();
    return this.data.collections;
  }

  createCollection(name: string, userId: string, visibility: 'public' | 'private' = 'public') {
    this.load();
    const newCol: CollectionDocument = {
      id: `coll_${Date.now()}`,
      name,
      user: userId,
      components: [],
      visibility,
      createdAt: new Date().toISOString()
    };
    this.data.collections.push(newCol);
    
    // Add to user list
    const user = this.findUserById(userId);
    if (user) {
      user.collections.push(newCol.id);
    }
    this.save();
    return newCol;
  }

  toggleComponentInCollection(colId: string, componentId: string, userId: string) {
    this.load();
    const col = this.data.collections.find(c => c.id === colId && c.user === userId);
    if (!col) return null;

    const hasIn = col.components.includes(componentId);
    if (hasIn) {
      col.components = col.components.filter(id => id !== componentId);
    } else {
      col.components.push(componentId);
    }
    this.save();
    return col;
  }

  deleteCollection(colId: string, userId: string) {
    this.load();
    const beforeLen = this.data.collections.length;
    this.data.collections = this.data.collections.filter(c => !(c.id === colId && c.user === userId));
    const user = this.findUserById(userId);
    if (user) {
      user.collections = user.collections.filter(id => id !== colId);
    }
    this.save();
    return this.data.collections.length < beforeLen;
  }

  // --- Comments CRUD ---
  getComments(componentId: string) {
    this.load();
    return this.data.comments
      .filter(c => c.component === componentId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  addComment(componentId: string, userId: string, text: string) {
    this.load();
    const user = this.findUserById(userId);
    const comp = this.findComponentById(componentId);
    if (!user || !comp) return null;

    const newComment: CommentDocument = {
      id: `comm_${Date.now()}`,
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      },
      component: componentId,
      text,
      createdAt: new Date().toISOString()
    };

    this.data.comments.push(newComment);
    
    // Update count
    const cIdx = this.data.components.findIndex(c => c.id === componentId);
    if (cIdx !== -1) {
      this.data.components[cIdx].commentsCount += 1;
    }

    // Trigger notification
    if (comp.author.id !== userId) {
      this.createNotification({
        recipient: comp.author.id,
        sender: {
          id: user.id,
          username: user.username,
          avatar: user.avatar
        },
        type: 'comment',
        componentId: comp.id,
        componentTitle: comp.title
      });
    }

    this.save();
    return newComment;
  }

  deleteComment(commentId: string, userId: string, userRole: string) {
    this.load();
    const comment = this.data.comments.find(c => c.id === commentId);
    if (!comment) return false;

    // Check authority
    if (comment.user.id !== userId && userRole !== 'admin') return false;

    this.data.comments = this.data.comments.filter(c => c.id !== commentId);
    
    // Decrement count
    const comp = this.data.components.find(c => c.id === comment.component);
    if (comp && comp.commentsCount > 0) {
      comp.commentsCount -= 1;
    }
    this.save();
    return true;
  }

  // --- Following Logic ---
  followUserToggle(followerId: string, targetId: string) {
    this.load();
    if (followerId === targetId) return null;

    const follower = this.data.users.find(u => u.id === followerId);
    const target = this.data.users.find(u => u.id === targetId);

    if (!follower || !target) return null;

    const isFollowing = follower.following.includes(targetId);
    if (isFollowing) {
      follower.following = follower.following.filter(id => id !== targetId);
      target.followers = target.followers.filter(id => id !== followerId);
    } else {
      follower.following.push(targetId);
      target.followers.push(followerId);

      // Notify
      this.createNotification({
        recipient: targetId,
        sender: {
          id: follower.id,
          username: follower.username,
          avatar: follower.avatar
        },
        type: 'follow'
      });
    }
    this.save();
    return { isFollowing: !isFollowing, followerFollowingCount: follower.following.length, targetFollowerCount: target.followers.length };
  }

  // --- Notifications ---
  createNotification(notif: Omit<NotificationDocument, 'id' | 'createdAt' | 'read'>) {
    const newN: NotificationDocument = {
      ...notif,
      id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      read: false
    };
    this.data.notifications.unshift(newN);
    this.save();
  }

  getNotifications(userId: string) {
    this.load();
    return this.data.notifications.filter(n => n.recipient === userId);
  }

  markNotificationsRead(userId: string) {
    this.load();
    this.data.notifications.forEach(n => {
      if (n.recipient === userId) n.read = true;
    });
    this.save();
  }

  // --- Moderation Reports ---
  addReport(reporterId: string, componentId: string, reason: string) {
    this.load();
    const reporter = this.findUserById(reporterId);
    const comp = this.findComponentById(componentId);
    if (!reporter || !comp) return null;

    const newReport: ReportDocument = {
      id: `rep_${Date.now()}`,
      reporter: {
        id: reporter.id,
        username: reporter.username
      },
      componentId,
      componentTitle: comp.title,
      reason,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    this.data.reports.push(newReport);
    this.save();
    return newReport;
  }

  getReports() {
    this.load();
    return this.data.reports;
  }

  resolveReport(reportId: string) {
    this.load();
    const rep = this.data.reports.find(r => r.id === reportId);
    if (rep) {
      rep.status = 'resolved';
      this.save();
      return true;
    }
    return false;
  }

  // --- Metrics & Analytics ---
  incrementCounter(type: 'views' | 'downloads', compId: string) {
    this.load();
    const cIdx = this.data.components.findIndex(c => c.id === compId);
    if (cIdx !== -1) {
      if (type === 'views') this.data.components[cIdx].views += 1;
      if (type === 'downloads') this.data.components[cIdx].downloads += 1;
      this.save();
    }
  }

  incrementSiteViews() {
    this.load();
    this.data.siteViews += 1;
    this.save();
  }

  getAnalytics() {
    this.load();
    const totalComponents = this.data.components.length;
    const totalUsers = this.data.users.length;
    const totalViews = this.data.components.reduce((sum, c) => sum + c.views, 0);
    const totalDownloads = this.data.components.reduce((sum, c) => sum + c.downloads, 0);
    const totalLikes = this.data.components.reduce((sum, c) => sum + c.likes.length, 0);
    const pendingReports = this.data.reports.filter(r => r.status === 'pending').length;

    // Category distribution
    const categoryStats: Record<string, number> = {};
    this.data.components.forEach(c => {
      categoryStats[c.category] = (categoryStats[c.category] || 0) + 1;
    });

    return {
      totalComponents,
      totalUsers,
      totalViews,
      totalDownloads,
      totalLikes,
      pendingReports,
      siteViews: this.data.siteViews,
      categoryStats
    };
  }
}

export const dbStore = new StoreManager();
