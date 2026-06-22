import React, { useState, useEffect } from 'react';
import { UI_COMPONENTS_CATALOG } from '../data/components';

interface SafeComponentPreviewProps {
  item: {
    id: string;
    title?: string;
    name?: string;
    htmlCode?: string;
    cssCode?: string;
    jsCode?: string;
    tailwindCode?: string;
  };
  height?: string;
  forceIsDark?: boolean;
}

export function SafeComponentPreview({ item, height = '140px', forceIsDark }: SafeComponentPreviewProps) {
  const [iframeKey, setIframeKey] = useState(0);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    // Watch document class changes to update dark state dynamically when the user toggles dark/light theme
    const observer = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains('dark');
      setIsDark(dark);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const resolvedIsDark = forceIsDark !== undefined ? forceIsDark : isDark;

  // Update key to reload iframe if dark/light mode switches, ensuring complete theme re-eval
  useEffect(() => {
    setIframeKey((prev) => prev + 1);
  }, [resolvedIsDark]);

  // 1. FIRST TARGET: Check if the component corresponds to a preloaded catalog static element with a native previewRender
  const catalogItem = UI_COMPONENTS_CATALOG.find((c) => c.id === item.id);
  if (catalogItem && catalogItem.previewRender) {
    const RenderedComp = catalogItem.previewRender;
    return (
      <div className={`w-full flex justify-center items-center overflow-visible select-none pointer-events-none transform scale-95 ${resolvedIsDark ? 'dark text-white' : 'text-slate-900'}`}>
        <RenderedComp />
      </div>
    );
  }

  // 2. SECOND TARGET: Handle dynamic HTML/CSS/JS components with a beautiful theme-adaptive sandboxed iframe
  const getCompiledView = () => {
    const textColor = resolvedIsDark ? '#ffffff' : '#0f172a'; // White or slate-900 baseline black
    const bgColor = 'transparent';
    return `
      <!DOCTYPE html>
      <html class="${resolvedIsDark ? 'dark' : ''}">
        <head>
          <meta charset="utf-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <script>
            tailwind.config = {
              darkMode: 'class',
            }
          </script>
          <style>
            body {
              margin: 0;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: ${height === '100%' || height === '100vh' ? '100vh' : '140px'};
              background-color: ${bgColor};
              color: ${textColor};
              font-family: system-ui, -apple-system, sans-serif;
              overflow: hidden;
            }
            /* Hide scrollbars but allow scrolling inside if needed */
            ::-webkit-scrollbar {
              display: none;
            }
            body * {
              transition: color 0.3s ease, background-color 0.3s ease;
            }
            ${item.cssCode || ''}
          </style>
        </head>
        <body>
          <div class="scale-90 origin-center flex items-center justify-center w-full">
            ${item.htmlCode || `<div class="p-4 bg-slate-100 dark:bg-slate-900 rounded-xl text-slate-800 dark:text-neutral-300 border border-slate-200 dark:border-white/5 text-center text-xs">Aura Dynamic Vector</div>`}
          </div>
          <script>
            try {
              ${item.jsCode || ''}
            } catch(e) {
              console.error(e);
            }
          </script>
        </body>
      </html>
    `;
  };

  return (
    <div style={{ height }} className="w-full flex items-center justify-center overflow-hidden">
      <iframe
        key={iframeKey}
        srcDoc={getCompiledView()}
        title={item.title || item.name || 'Component Preview'}
        className="w-full h-full border-0 bg-transparent"
        sandbox="allow-scripts"
        scrolling="no"
      />
    </div>
  );
}
