import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { View, User } from './types';
import { getToken, removeToken, BASE_URL } from './constants';
import { Toast } from './components/Toast';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import DashboardView from './views/DashboardView';
import AnalyticsView from './views/AnalyticsView';
import SchedulerView from './views/SchedulerView';
import IntegrationsView from './views/IntegrationsView';
import CreatePostModal from './views/CreatePostModal';

export default function App() {
  const [view, setView] = useState<View>('login');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appToast, setAppToast] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: any) => {
      setAppToast(e.detail);
      setTimeout(() => setAppToast(null), 3000);
    };
    window.addEventListener('app-toast', handler);
    return () => window.removeEventListener('app-toast', handler);
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const res = await fetch(`${BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const user = await res.json();
          setCurrentUser(user);
          setView('dashboard');
        } else {
          removeToken();
        }
      } catch (e) {
        removeToken();
      }
    };
    checkToken();
  }, []);

  const handleLogout = () => {
    removeToken();
    setCurrentUser(null);
    setView('login');
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {view === 'login' && <LoginView setView={setView} setCurrentUser={setCurrentUser} />}
          {view === 'register' && <RegisterView setView={setView} setCurrentUser={setCurrentUser} />}
          {view === 'dashboard' && <DashboardView setView={setView} user={currentUser} onLogout={handleLogout} openCreateModal={() => setIsCreateModalOpen(true)} />}
          {view === 'analytics' && <AnalyticsView setView={setView} user={currentUser} onLogout={handleLogout} />}
          {view === 'scheduler' && <SchedulerView setView={setView} user={currentUser} onLogout={handleLogout} openCreateModal={() => setIsCreateModalOpen(true)} />}
          {view === 'integrations' && <IntegrationsView setView={setView} user={currentUser} onLogout={handleLogout} />}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {isCreateModalOpen && (
          <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} user={currentUser} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {appToast && <Toast message={appToast} onClose={() => setAppToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
