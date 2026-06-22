import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dock from './components/Dock';
import BlobBackground from './components/BlobBackground';
import CommandMenu from './components/CommandMenu';
import ToastContainer from './components/Toast';

// Default and full-stack pages
import Home from './pages/Home';
import Components from './pages/Components';
import Preview from './pages/Preview';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';

// Advanced full-stack pages built for Uiverse
import Auth from './pages/Auth';
import Upload from './pages/Upload';
import CreatorProfile from './pages/CreatorProfile';
import AdminDashboard from './pages/AdminDashboard';

import { api, User as ApiUser, UIComponent } from './lib/api';
import { AppThemeConfig, ToastMessage } from './types';

export default function App() {
  // 1. Core States
  const [currentPage, setPage] = useState<string>('home');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null);
  const [editModeComponent, setEditModeComponent] = useState<UIComponent | null>(null);
  
  const [themeConfig, setThemeConfig] = useState<AppThemeConfig>({
    themeMode: 'dark', // Default to beautiful eye-safe twilight dark theme
    accentColor: 'purple',
    borderRadius: 'lg',
    springIntensity: 'snappy',
  });

  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // 2. Custom Toast Helpers
  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto clear inside 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4550);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 3. Keep Creator Session Alive on refresh
  useEffect(() => {
    const checkActiveSession = async () => {
      const token = localStorage.getItem('aura_uiverse_token');
      if (token) {
        try {
          const syncedUser = await api.getCurrentUser();
          setCurrentUser(syncedUser);
          addToast(`Creator session verified: Welcome @${syncedUser.username}!`, 'success');
        } catch {
          localStorage.removeItem('aura_uiverse_token');
          addToast('Session expired. Enter credentials inside verify gate.', 'info');
        }
      }
    };
    checkActiveSession();
  }, []);

  // 4. Mount themeMode changes in document elements class tags
  useEffect(() => {
    const root = window.document.documentElement;
    if (themeConfig.themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeConfig.themeMode]);

  // Handle components selection via search or home features
  const handleSelectComponentFromQuery = (id: string) => {
    setSelectedComponentId(id);
    setPage('components');
    addToast(`Loaded sandbox workspace specs!`, 'success');
  };

  // Render current active layout
  const renderLayoutContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            setPage={(page) => {
              setPage(page);
              window.scrollTo(0, 0);
            }}
            setSelectedComponentId={(id) => {
              setSelectedComponentId(id);
              setPage('components');
              window.scrollTo(0, 0);
            }}
            config={themeConfig}
            currentUser={currentUser}
            onSelectCategory={setSelectedCategory}
          />
        );

      case 'components':
        if (selectedComponentId) {
          return (
            <Preview
              component={{ id: selectedComponentId }}
              onBack={() => {
                setSelectedComponentId(null);
                window.scrollTo(0, 0);
              }}
              onTriggerToast={addToast}
              onSelectComponent={(id) => {
                setSelectedComponentId(id);
                window.scrollTo(0, 0);
              }}
              currentUser={currentUser}
            />
          );
        }
        return (
          <Components
            setPage={(page) => {
              setPage(page);
              window.scrollTo(0, 0);
            }}
            selectedComponentId={selectedComponentId}
            setSelectedComponentId={(id) => {
              setSelectedComponentId(id);
              window.scrollTo(0, 0);
            }}
            onTriggerToast={addToast}
            currentUser={currentUser}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        );

      case 'auth':
        return (
          <Auth
            onSuccess={(verifiedUser) => {
              setCurrentUser(verifiedUser);
              setPage('creator-profile');
              window.scrollTo(0, 0);
            }}
            onTriggerToast={addToast}
          />
        );

      case 'upload':
        return (
          <Upload
            user={currentUser}
            editModeComponent={editModeComponent}
            onSuccess={() => {
              setEditModeComponent(null);
              setPage('creator-profile');
              window.scrollTo(0, 0);
            }}
            onCancel={() => {
              setEditModeComponent(null);
              setPage('creator-profile');
              window.scrollTo(0, 0);
            }}
            onTriggerToast={addToast}
          />
        );

      case 'creator-profile':
        if (!currentUser) {
          setPage('auth');
          return null;
        }
        return (
          <CreatorProfile
            user={currentUser}
            onLogout={() => {
              api.logout();
              setCurrentUser(null);
              setPage('home');
              addToast('Creator logged out securely.', 'info');
              window.scrollTo(0, 0);
            }}
            onSelectComponent={(id) => {
              setSelectedComponentId(id);
              setPage('components');
              window.scrollTo(0, 0);
            }}
            onTriggerEditComponent={(comp) => {
              setEditModeComponent(comp);
              setPage('upload');
              window.scrollTo(0, 0);
            }}
            onTriggerToast={addToast}
          />
        );

      case 'admin-dashboard':
        if (!currentUser || currentUser.role !== 'admin') {
          setPage('home');
          return null;
        }
        return <AdminDashboard onTriggerToast={addToast} />;

      case 'pricing':
        return <Pricing onTriggerToast={addToast} />;

      case 'about':
        return <About />;

      case 'contact':
        return <Contact onTriggerToast={addToast} />;

      default:
        return (
          <div className="py-20 text-center text-slate-400">
            <h3>Diagnostic mismatch: core fallback mapping.</h3>
            <button onClick={() => setPage('home')} className="mt-4 px-4 py-2 bg-[#8b5cf6] text-white rounded-lg text-xs">
              Back to Home
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen relative bg-white dark:bg-[#030303] text-slate-800 dark:text-neutral-200 font-sans transition-colors duration-300 pb-0 select-none">
      {/* 1. Backdrop animated vector grids & glows */}
      <BlobBackground />

      {/* 2. Sticky Blurry Header */}
      <Navbar
        currentPage={currentPage}
        setPage={(page) => {
          setSelectedComponentId(null); // Clear selected item on tab change
          setPage(page);
          window.scrollTo(0, 0);
        }}
        config={themeConfig}
        setConfig={setThemeConfig}
        onOpenCommand={() => setCommandMenuOpen(true)}
        currentUser={currentUser}
      />

      {/* 3. Page Body Frame Wrapper with clean transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentPage}-${selectedComponentId || 'list'}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {renderLayoutContent()}
        </motion.div>
      </AnimatePresence>

      {/* 4. Modular Footer */}
      <Footer
        setPage={(page) => {
          setSelectedComponentId(null);
          setPage(page);
          window.scrollTo(0, 0);
        }}
      />

      {/* 5. Floating Bottom Navigation Dock */}
      <Dock 
        currentPage={currentPage} 
        setPage={(page) => {
          setSelectedComponentId(null);
          setPage(page);
          window.scrollTo(0, 0);
        }} 
        onTriggerToast={addToast} 
      />

      {/* 7. Cmd+K searching mechanism */}
      <CommandMenu
        isOpen={commandMenuOpen}
        onClose={() => setCommandMenuOpen(false)}
        onSelectComponent={handleSelectComponentFromQuery}
      />

      {/* 8. Toaster container overlay */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
