import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Terminal, Code, Settings, Plus, Play, Sparkles, Check, Server, Eye, FileCode2 } from 'lucide-react';
import { api, UIComponent } from '../lib/api';

interface UploadProps {
  onSuccess: () => void;
  onTriggerToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  user: any;
  editModeComponent?: UIComponent | null;
  onCancel?: () => void;
}

export default function Upload({ onSuccess, onTriggerToast, user, editModeComponent, onCancel }: UploadProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Buttons');
  const [tagsInput, setTagsInput] = useState('New, Popular, Glassmorphism');
  const [thumbnail, setThumbnail] = useState('盒子');

  // Code editor tabs
  const [editorTab, setEditorTab] = useState<'html' | 'css' | 'js' | 'react' | 'tailwind'>('html');
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [reactCode, setReactCode] = useState('');
  const [tailwindCode, setTailwindCode] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [previewRefreshKey, setPreviewRefreshKey] = useState(0);

  // Pre-populate if in edit mode
  useEffect(() => {
    if (editModeComponent) {
      setTitle(editModeComponent.title || '');
      setDescription(editModeComponent.description || '');
      setCategory(editModeComponent.category || 'Buttons');
      setTagsInput(editModeComponent.tags ? editModeComponent.tags.join(', ') : '');
      setThumbnail(editModeComponent.thumbnail || '盒子');
      setHtmlCode(editModeComponent.htmlCode || '');
      setCssCode(editModeComponent.cssCode || '');
      setJsCode(editModeComponent.jsCode || '');
      setReactCode(editModeComponent.reactCode || '');
      setTailwindCode(editModeComponent.tailwindCode || '');
    } else {
      // Set some fun placeholders on load
      setHtmlCode(`<button class="custom-neon border border-purple-500/30 bg-slate-950/80 hover:bg-slate-900 px-6 py-2.5 rounded-lg text-white text-xs font-semibold hover:scale-105 duration-300 transition-all cursor-pointer">
  Quantum Plasma Trigger →
</button>`);
      setCssCode(`.custom-neon {
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.4);
}
.custom-neon:hover {
  box-shadow: 0 0 25px rgba(168, 85, 247, 0.7);
  border-color: #a855f7;
}`);
      setReactCode(`import React from 'react';
import { motion } from 'framer-motion';

export default function DynamicTrigger() {
  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-6 py-2.5 bg-gradient-to-r from-[#22d3ee] to-[#a855f7] text-white rounded-xl text-xs font-bold"
    >
      Quantum Trigger
    </motion.button>
  );
}`);
      setTailwindCode(`bg-slate-950 px-6 py-3 border border-purple-500 rounded-xl text-purple-400`);
    }
  }, [editModeComponent]);

  const categories = [
    'Buttons',
    'Cards',
    'Inputs',
    'Forms',
    'Loaders',
    'Toggles',
    'Checkboxes',
    'Pricing tables',
    'Hero sections',
    'Dashboards',
    'Testimonials',
    'Footers',
    'Authentication UI',
    'Ecommerce UI'
  ];

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category) {
      onTriggerToast('Please populate the title, description, and categories', 'error');
      return;
    }

    setIsLoading(true);
    const splitTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title,
      description,
      category,
      tags: splitTags,
      thumbnail: thumbnail || '盒',
      htmlCode,
      cssCode,
      jsCode,
      reactCode,
      tailwindCode
    };

    try {
      if (editModeComponent) {
        await api.editComponent(editModeComponent.id, payload);
        onTriggerToast(`Surgically calibrated matching model details: ${title}`, 'success');
      } else {
        await api.uploadComponent(payload);
        onTriggerToast(`Interactive component vector uploaded successfully! It is now live in the UI Vault.`, 'success');
      }
      onSuccess();
    } catch (err: any) {
      onTriggerToast(err.message || 'Workflow posting failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate safe sandbox iframe source code
  const getSandboxSrcDoc = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body {
              margin: 0;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background-color: transparent;
              color: white;
              font-family: system-ui, -apple-system, sans-serif;
              overflow: hidden;
            }
            ${cssCode}
          </style>
        </head>
        <body>
          <div id="content-anchor">
            ${htmlCode}
          </div>
          <script>
            try {
              ${jsCode}
            } catch(e) {
              console.error(e);
            }
          </script>
        </body>
      </html>
    `;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      
      {/* HEADER SECTION */}
      <div className="border-b border-slate-200/20 dark:border-white/5 pb-5 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-500 uppercase font-extrabold flex items-center gap-1.5 mb-1">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            VECTORS CODING TERMINAL
          </span>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white leading-none italic">
            {editModeComponent ? 'Edit Quantum Component' : 'Deploy UI Component'}
          </h1>
        </div>
        <div className="flex gap-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-neutral-300 rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handlePublish}
            disabled={isLoading}
            className="px-5 py-2.5 bg-slate-950 dark:bg-white hover:bg-slate-900 dark:hover:bg-slate-100 text-white dark:text-black rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-55"
          >
            <Server className="w-3.5 h-3.5 text-[#8b5cf6]" />
            {isLoading ? 'Uploading State...' : editModeComponent ? 'Commit Modifications' : 'Upload Code'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: METADATA & CONFIGS (4 spans) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-slate-50/50 dark:bg-neutral-900/40 border border-slate-200/50 dark:border-white/5 p-5 rounded-2xl flex flex-col gap-4 shadow-sm">
            <h3 className="font-display font-extrabold text-xs uppercase tracking-widest text-[#a855f7] flex items-center gap-2">
              <Settings className="w-4.5 h-4.5 text-purple-500" /> Catalog Settings
            </h3>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Component Title</label>
              <input
                type="text"
                placeholder="e.g. Glowing Neon Slide Button"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-black/20 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-neutral-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Description</label>
              <textarea
                placeholder="Provide a quick review of the micro-interaction mechanism...."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-black/20 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-neutral-500 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-2 py-2 rounded-lg text-xs bg-white dark:bg-black/20 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-100 dark:bg-neutral-900 text-slate-900 dark:text-white">{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Thumbnail Icon</label>
                <input
                  type="text"
                  placeholder="e.g. 按钮, 卡, 加载, 输入"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-black/20 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-neutral-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Tags (Comma separated)</label>
              <input
                type="text"
                placeholder="New, Popular, Glassmorphism, Neon"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-black/20 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-neutral-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="text-[10px] font-mono text-slate-400 leading-normal p-3 rounded-xl bg-slate-100 dark:bg-black/20 border border-slate-200/50 dark:border-white/5">
              💡 <span className="font-semibold text-slate-600 dark:text-neutral-300">Sandbox Compile Mode</span>: You can verify live layouts using standard HTML & CSS modules. The sandbox renders HTML/CSS elements in the real-time card directly!
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: EDITOR & LIVE IFRAME (8 spans) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* LIVE GRAPHICAL PREVIEW WINDOW */}
          <div className="relative border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden bg-[radial-gradient(rgba(139,92,246,0.06)_1px,transparent_1px)] [background-size:16px_16px] h-60 flex flex-col items-center justify-center p-6 shadow-sm">
            <div className="absolute top-3.5 left-3.5 text-[10px] font-mono uppercase tracking-[0.2em] font-extrabold text-rose-500/80 flex items-center gap-1.5 z-10">
              <Eye className="w-3.5 h-3.5" /> Sandbox Live Render
            </div>

            <button
              onClick={() => setPreviewRefreshKey((p) => p + 1)}
              className="absolute top-3.5 right-3.5 p-1 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white text-[10px] cursor-pointer flex items-center gap-1 font-mono"
            >
              <Play className="w-3 h-3 text-emerald-500 animate-pulse" /> Re-execute
            </button>

            {/* Sandbox Render Box Container */}
            <div className="relative w-full max-w-sm h-40 border border-dashed border-slate-200 dark:border-white/10 bg-white/5 dark:bg-slate-950/40 rounded-2xl overflow-hidden flex items-center justify-center">
              <iframe
                key={`${previewRefreshKey}-${editorTab}`}
                srcDoc={getSandboxSrcDoc()}
                title="Live component sandbox rendering frame"
                className="w-full h-full border-0 bg-transparent"
                sandbox="allow-scripts"
              />
            </div>
          </div>

          {/* TABBED CODE CHANNELS EDITOR */}
          <div className="border border-slate-200 dark:border-white/5 rounded-2xl bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-xl">
            {/* Header tab buttons */}
            <div className="flex border-b border-white/5 bg-slate-950/60 p-2 gap-1 overflow-x-auto">
              {(['html', 'css', 'js', 'react', 'tailwind'] as const).map((tab) => {
                const active = editorTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setEditorTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wide uppercase transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                      active
                        ? 'bg-gradient-to-r from-violet-600/30 to-pink-600/30 text-white border border-violet-500/40 font-bold'
                        : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    <FileCode2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                    {tab === 'html' ? 'HTML Base' : tab === 'css' ? 'Bespoke CSS' : tab === 'js' ? 'Script JS' : tab === 'react' ? 'React component' : 'Tailwind details'}
                  </button>
                );
              })}
            </div>

            {/* Textarea Area styling like Monaco */}
            <div className="relative p-1">
              <div className="absolute top-2.5 left-2.5 pointer-events-none font-mono text-[9px] text-[#a855f7] select-none uppercase tracking-widest z-10">
                // editable interactive block
              </div>

              {editorTab === 'html' && (
                <textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  className="w-full h-64 bg-slate-950 font-mono text-xs text-slate-100 p-6 leading-relaxed border-0 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none rounded-xl"
                  placeholder="<!-- Provide raw component HTML parameters -->"
                />
              )}

              {editorTab === 'css' && (
                <textarea
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  className="w-full h-64 bg-slate-950 font-mono text-xs text-slate-100 p-6 leading-relaxed border-0 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none rounded-xl"
                  placeholder="/* Custom CSS modules here */"
                />
              )}

              {editorTab === 'js' && (
                <textarea
                  value={jsCode}
                  onChange={(e) => setJsCode(e.target.value)}
                  className="w-full h-64 bg-slate-950 font-mono text-xs text-slate-100 p-6 leading-relaxed border-0 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none rounded-xl"
                  placeholder="// Javascript animations triggered on click here"
                />
              )}

              {editorTab === 'react' && (
                <textarea
                  value={reactCode}
                  onChange={(e) => setReactCode(e.target.value)}
                  className="w-full h-64 bg-slate-950 font-mono text-xs text-slate-100 p-6 leading-relaxed border-0 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none rounded-xl"
                  placeholder="// React copy specs (pure JSX formatting)"
                />
              )}

              {editorTab === 'tailwind' && (
                <textarea
                  value={tailwindCode}
                  onChange={(e) => setTailwindCode(e.target.value)}
                  className="w-full h-64 bg-slate-950 font-mono text-xs text-slate-100 p-6 leading-relaxed border-0 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none rounded-xl"
                  placeholder="// Tailwind configurations classes"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
