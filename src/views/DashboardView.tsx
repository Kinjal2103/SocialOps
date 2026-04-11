import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Bell, Plus, ArrowUp, Sparkles, Heart, MessageCircle, ArrowRight,
  LayoutDashboard, BarChart3, Calendar, LogOut, TrendingUp, MoreHorizontal,
  Mail, Eye, EyeOff, Check, X, Upload, Trash2, Instagram, Twitter, Linkedin,
  Clock, ChevronDown, Phone, Video, FileText, MousePointerClick, PlusCircle,
  MessageSquare, Plug, Loader2, Send, Smartphone, Laptop
} from 'lucide-react';
import { Card, Button, Input } from '../components/ui-base';
import { cn } from '../lib/utils';
import type { View, User } from '../types';
import { BASE_URL, getToken, saveToken, removeToken } from '../constants';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const DashboardView = ({ setView, user, onLogout, openCreateModal }: { setView: (v: View) => void, user: User | null, onLogout: () => void, openCreateModal: () => void }) => {
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) {
        onLogout();
        return;
      }
      try {
        const [statsRes, postsRes] = await Promise.all([
          fetch(`${BASE_URL}/dashboard/stats`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${BASE_URL}/posts/recent`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (statsRes.status === 401 || postsRes.status === 401) {
          onLogout();
          return;
        }

        if (!statsRes.ok || !postsRes.ok) throw new Error('Failed to fetch data');

        const stats = await statsRes.json();
        const posts = await postsRes.json();

        setDashboardStats(stats);
        setRecentPosts(posts);
      } catch (err) {
        setError('Failed to load dashboard data. Please make sure the backend server was restarted.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [onLogout]);

  const handleApplyInsight = async () => {
    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/dashboard/apply-insight`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ insightId: 'peak-time' })
      });
      if (res.ok) {
        setToast("Insight applied! Posts scheduled for 6 PM.");
        setTimeout(() => setToast(null), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background relative">
        <Navbar currentView="dashboard" setView={setView} user={user} onLogout={onLogout} />
        <main className="pt-32 pb-20 px-8 max-w-7xl mx-auto space-y-8 animate-pulse">
          <div className="h-20 bg-surface-container/50 rounded-xl max-w-sm mb-16"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="h-64 bg-surface-container/50 rounded-3xl"></div>
            <div className="lg:col-span-2 h-64 bg-surface-container/50 rounded-3xl"></div>
            <div className="h-96 bg-surface-container/50 rounded-3xl"></div>
            <div className="h-96 bg-surface-container/50 rounded-3xl"></div>
            <div className="h-96 bg-surface-container/50 rounded-3xl"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar currentView="dashboard" setView={setView} user={user} onLogout={onLogout} />
      <main className="pt-32 pb-20 px-8 max-w-7xl mx-auto">
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl flex items-center gap-3 font-bold text-sm">
            <X className="w-5 h-5 flex-shrink-0" />
            {error}
          </motion.div>
        )}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div>
            <p className="text-secondary font-bold tracking-[0.2em] text-[10px] uppercase mb-3">Editorial Workspace</p>
            <h1 className="text-5xl font-extrabold tracking-tight">Morning, {user?.name?.split(' ')[0] || 'Editor'}.</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3 items-center mr-6">
              {[1, 2, 3].map(i => (
                <img 
                  key={i}
                  alt="Team" 
                  className="h-9 w-9 rounded-full border-2 border-white object-cover" 
                  src={`https://picsum.photos/seed/team${i}/100/100`}
                  referrerPolicy="no-referrer"
                />
              ))}
              <div className="h-9 w-9 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">+4</div>
            </div>
            <Button className="shadow-xl" onClick={openCreateModal}>
              <Plus className="w-5 h-5 mr-2" />
              Create Post
            </Button>
          </div>
        </motion.header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {/* Followers Card */}
          <motion.div variants={itemVariants}>
            <Card className="p-8 group hover:shadow-2xl transition-shadow duration-500">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="text-on-surface-variant/50 font-bold text-[10px] uppercase tracking-widest">Total Followers</span>
                  <h2 className="text-5xl font-extrabold mt-3 tracking-tighter">{dashboardStats?.followers?.total?.toLocaleString()}</h2>
                </div>
                <div className="flex items-center gap-1 bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-[10px] font-bold">
                  <ArrowUp className="w-3 h-3" />
                  {dashboardStats?.followers?.growthPercent}%
                </div>
              </div>
              <div className="w-full h-32 mt-4 relative overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 400 120">
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    d="M0 100 Q 50 20, 100 80 T 200 40 T 300 90 T 400 30" 
                    fill="none" 
                    stroke="url(#lineGrad)" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    className="opacity-80"
                  />
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6750a4" />
                      <stop offset="100%" stopColor="#a23256" />
                    </linearGradient>
                  </defs>
                  <motion.circle 
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    cx="400" cy="30" r="6" fill="#a23256" 
                  />
                </svg>
              </div>
            </Card>
          </motion.div>

          {/* AI Insight Card */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="bg-primary/5 p-8 relative overflow-hidden border border-primary/10 h-full">
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 h-full">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary/10 flex-shrink-0">
                  <Sparkles className="text-primary w-8 h-8 fill-primary" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">Smart Insight</span>
                    <span className="text-on-surface-variant/50 text-[10px] font-bold uppercase tracking-widest">{dashboardStats?.smartInsight?.confidence}% Confidence</span>
                  </div>
                  <p className="text-2xl font-bold leading-tight">
                    {dashboardStats?.smartInsight?.text}
                  </p>
                  <div className="mt-8 w-full h-2 bg-primary/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${dashboardStats?.smartInsight?.confidence || 0}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-primary rounded-full" 
                    />
                  </div>
                </div>
                <Button variant="white" className="flex-shrink-0" onClick={handleApplyInsight}>Apply Now</Button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
            </Card>
          </motion.div>

          {/* Audience Breakdown */}
          <motion.div variants={itemVariants}>
            <Card className="p-8 h-full">
              <div className="mb-10">
                <h3 className="text-lg font-bold">Audience Breakdown</h3>
                <p className="text-on-surface-variant/50 text-[10px] font-bold uppercase tracking-widest">Top performing territories</p>
              </div>
              <div className="space-y-8">
                {dashboardStats?.audienceBreakdown?.map((item: any, idx: number) => (
                  <div key={item.country}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-bold">{item.country}</span>
                      <span className="text-sm font-bold">{item.percent}%</span>
                    </div>
                    <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={cn("h-full rounded-full", idx === 0 ? 'bg-primary' : idx === 1 ? 'bg-secondary' : 'bg-tertiary')} 
                      />
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full mt-4" onClick={() => setView('analytics')}>View Full Report</Button>
              </div>
            </Card>
          </motion.div>

          {/* Activity Density */}
          <motion.div variants={itemVariants}>
            <Card className="p-8 h-full">
              <div className="mb-10 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">Activity Density</h3>
                  <p className="text-on-surface-variant/50 text-[10px] font-bold uppercase tracking-widest">Post frequency by time</p>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary/20" />
                  <div className="w-2 h-2 rounded-full bg-primary/60" />
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
              </div>
              <div className="grid grid-cols-7 gap-3">
                {dashboardStats?.activityDensity?.map((val: number, i: number) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.2 }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className={cn(
                      "aspect-square rounded-full cursor-pointer",
                      val >= 0.8 ? "bg-primary" : 
                      val >= 0.5 ? "bg-primary/60" : 
                      val >= 0.2 ? "bg-primary/30" : "bg-primary/10"
                    )}
                  />
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Anomaly Detection */}
          <motion.div variants={itemVariants}>
            <Card className="bg-on-surface p-8 relative overflow-hidden group cursor-pointer h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-black/90" />
              <div className="relative z-10 flex flex-col justify-between h-full text-white">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-2 h-2 rounded-full bg-tertiary animate-ping" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Anomaly Detected</span>
                  </div>
                  <h3 className="text-xl font-bold leading-snug">{dashboardStats?.anomaly?.title}</h3>
                  <p className="text-on-surface-variant/70 text-xs mt-3">{dashboardStats?.anomaly?.description}</p>
                </div>
                <div className="mt-10 flex items-end gap-2 h-24">
                  {[20, 35, 25, 95, 30, 15, 20].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={cn(
                        "w-full rounded-t-sm transition-colors",
                        h === 95 ? "bg-tertiary shadow-[0_0_20px_rgba(162,50,86,0.5)]" : "bg-white/10 group-hover:bg-primary/40"
                      )}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        <section className="mt-24">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-3xl font-bold">Recent Performance</h3>
            <button className="text-sm font-bold text-primary flex items-center gap-2 group" onClick={() => setView('scheduler')}>
              View Archive 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {recentPosts.length === 0 ? (
              <div className="col-span-full border-2 border-dashed border-outline-variant/30 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 text-on-surface-variant/50">
                <p className="text-lg font-bold">No posts yet</p>
                <Button onClick={openCreateModal}>Create your first post</Button>
              </div>
            ) : (
              recentPosts.map(post => (
                <motion.div key={post.id} variants={itemVariants}>
                  <Card className="overflow-hidden group cursor-pointer hover:-translate-y-2 transition-all duration-300">
                    <div className="h-52 relative overflow-hidden">
                      <img 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        src={post.image || `https://picsum.photos/seed/${post.id}/800/600`}
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold tracking-widest">
                        {post.type}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-5">
                        <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest">{post.date}</span>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-on-surface-variant">
                            <Heart className="w-3.5 h-3.5" /> {post.likes}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-on-surface-variant">
                            <MessageCircle className="w-3.5 h-3.5" /> {post.comments}
                          </div>
                        </div>
                      </div>
                      <h4 className="font-bold text-sm leading-relaxed line-clamp-2">{post.title}</h4>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </section>
      </main>
      <Footer />
      <button 
        onClick={openCreateModal}
        className="fixed bottom-8 right-8 w-14 h-14 bg-on-surface text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-50"
      >
        <Plus className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default DashboardView;
