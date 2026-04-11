import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Bell, Sparkles, LayoutDashboard, BarChart3, Calendar, Plug } from 'lucide-react';
import { cn } from '../lib/utils';
import type { View, User } from '../types';

const Navbar = ({ currentView, setView, user, onLogout }: { currentView: View, setView: (v: View) => void, user: User | null, onLogout: () => void }) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'scheduler', label: 'Scheduler', icon: Calendar },
    { id: 'integrations', label: 'Integrations', icon: Plug },
  ];

  const searchResults = navItems.filter(item => 
    searchQuery && item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect border-b border-outline-variant/10">
      <div className="flex justify-between items-center px-8 h-20 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-12">
          <span className="text-2xl font-bold tracking-tighter text-primary cursor-pointer" onClick={() => setView('dashboard')}>SocialOps</span>
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id as View)}
                className={cn(
                  "relative text-sm font-display font-bold tracking-wide transition-all duration-300",
                  currentView === item.id ? "text-primary" : "text-on-surface-variant hover:text-primary"
                )}
              >
                {item.label}
                {currentView === item.id && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="hidden lg:flex items-center bg-surface-container px-4 py-2 rounded-xl border border-transparent focus-within:border-primary/30 focus-within:bg-surface-container-lowest transition-all">
              <Search className="text-on-surface-variant/50 w-4 h-4 mr-2" />
              <input 
                className="bg-transparent border-none focus:ring-0 text-sm w-48 font-sans placeholder:text-on-surface-variant/50 outline-none" 
                placeholder="Search views..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Search Dropdown */}
            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full mt-2 w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl shadow-2xl p-2 z-50 flex flex-col gap-1"
                >
                  {searchResults.map(result => (
                    <button
                      key={result.id}
                      onClick={() => {
                        setView(result.id as View);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-on-surface hover:bg-surface-container rounded-lg transition-colors flex items-center gap-3"
                    >
                      <result.icon className="w-4 h-4 text-primary" />
                      {result.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="relative">
            <button 
              className="p-2 text-on-surface-variant hover:bg-surface-container rounded-xl transition-all relative"
              onClick={() => setNotifOpen(!notifOpen)}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
            </button>
            
            {/* Notifications Dropdown */}
            <AnimatePresence>
              {notifOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl shadow-2xl p-4 z-50"
                  style={{ transformOrigin: 'top right' }}
                >
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 mb-3 px-2">Notifications</h4>
                  <div className="space-y-1">
                    <div className="p-3 bg-surface-container/30 rounded-xl hover:bg-surface-container transition-colors cursor-pointer">
                      <p className="text-sm font-bold">Your post is trending!</p>
                      <p className="text-xs text-on-surface-variant mt-1">Spring Campaign Teaser reached 10k views.</p>
                    </div>
                    <div className="p-3 bg-surface-container/30 rounded-xl hover:bg-surface-container transition-colors cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Insight</span>
                      </div>
                      <p className="text-sm font-bold">New follower milestone reached</p>
                      <p className="text-xs text-on-surface-variant mt-1">You just crossed 850k total followers.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button 
            className="h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center bg-primary text-white font-bold text-sm tracking-widest hover:scale-105 transition-transform" 
            onClick={onLogout}
          >
            {getInitials(user?.name)}
          </button>
        </div>
      </div>
    </nav>
  );
};

export { Navbar };
