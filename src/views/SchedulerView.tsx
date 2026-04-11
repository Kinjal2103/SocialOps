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

const SchedulerView = ({ setView, user, onLogout, openCreateModal }: { setView: (v: View) => void, user: User | null, onLogout: () => void, openCreateModal: () => void }) => {
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [timelinePosts, setTimelinePosts] = useState<any[]>([]);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [queueHealth, setQueueHealth] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) {
        onLogout();
        return;
      }
      try {
        const [timelineRes, draftsRes, healthRes] = await Promise.all([
          fetch(`${BASE_URL}/scheduler/timeline`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${BASE_URL}/scheduler/drafts`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${BASE_URL}/scheduler/health`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (timelineRes.status === 401 || draftsRes.status === 401 || healthRes.status === 401) {
          onLogout();
          return;
        }

        if (!timelineRes.ok || !draftsRes.ok || !healthRes.ok) throw new Error('Failed to fetch scheduler data');

        const tlData = await timelineRes.json();
        const drData = await draftsRes.json();
        const qhData = await healthRes.json();

        setTimelinePosts(tlData);
        setDrafts(drData);
        setQueueHealth(qhData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [onLogout]);

  const handleDelete = async (postId: string) => {
    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setTimelinePosts(prev => prev.filter(p => p.id !== postId));
        window.dispatchEvent(new CustomEvent('app-toast', { detail: 'Post removed from queue' }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getPlatformIcon = (platform: string) => {
    if (platform.toLowerCase() === 'instagram') return <Instagram className="w-5 h-5 flex-shrink-0" />;
    if (platform.toLowerCase() === 'twitter') return <Twitter className="w-5 h-5 flex-shrink-0" />;
    if (platform.toLowerCase() === 'linkedin') return <Linkedin className="w-5 h-5 flex-shrink-0" />;
    return <MessageSquare className="w-5 h-5 flex-shrink-0" />;
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

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar currentView="scheduler" setView={setView} user={user} onLogout={onLogout} />
      <main className="pt-32 pb-20 px-8 max-w-7xl mx-auto">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight mb-4">Social Queue</h1>
            <p className="text-on-surface-variant font-medium">Manage and orchestrate your editorial workspace across platforms.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-surface-container p-1 rounded-xl">
              <button 
                onClick={() => setViewMode('weekly')}
                className={cn("px-6 py-2 rounded-lg text-xs font-bold transition-all", viewMode === 'weekly' ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-primary")}
              >Weekly</button>
              <button 
                onClick={() => setViewMode('monthly')}
                className={cn("px-6 py-2 rounded-lg text-xs font-bold transition-all", viewMode === 'monthly' ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-primary")}
              >Monthly</button>
            </div>
            <Button variant="secondary">Filters</Button>
          </div>
        </motion.header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-10"
        >
          <div className="lg:col-span-2 space-y-12">
            <motion.div variants={itemVariants} className="flex items-center gap-6">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">Today</p>
                <h3 className="text-2xl font-bold">Monday, Oct 24</h3>
              </div>
            </motion.div>

            <div className="relative pl-12 border-l-2 border-outline-variant/20 space-y-12 pb-12">
              {isLoading ? (
                <div className="animate-pulse space-y-12">
                   <div className="h-40 bg-surface-container rounded-2xl"></div>
                   <div className="h-40 bg-surface-container rounded-2xl"></div>
                </div>
              ) : timelinePosts.length === 0 ? (
                <motion.div 
                  variants={itemVariants}
                  onClick={openCreateModal}
                  className="border-2 border-dashed border-outline-variant/30 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 text-on-surface-variant/50 group cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all mt-4"
                >
                  <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold">Your queue is empty. Click to schedule a post.</span>
                </motion.div>
              ) : (
                <>
                  {timelinePosts.map((post, index) => {
                    const dateObj = new Date(post.scheduledAt);
                    const timeString = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                    return (
                      <div key={post.id} className="relative">
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="absolute -left-[57px] top-4 w-4 h-4 rounded-full bg-primary border-4 border-background" 
                        />
                        <div className="absolute -left-32 top-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 w-20 text-right">{timeString}</div>
                        
                        <motion.div variants={itemVariants}>
                          <Card className="p-8 hover:shadow-xl transition-shadow duration-300 relative group">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="relative group/menu">
                                <button className="p-2 text-on-surface-variant/50 hover:bg-surface-container rounded-lg">
                                  <MoreHorizontal className="w-5 h-5" />
                                </button>
                                <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-xl border border-outline-variant/10 opacity-0 group-hover/menu:opacity-100 pointer-events-none group-hover/menu:pointer-events-auto transition-all z-10 overflow-hidden">
                                  <button onClick={() => handleDelete(post.id)} className="w-full text-left px-4 py-3 text-sm font-bold text-tertiary hover:bg-tertiary/10 transition-colors">
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                {getPlatformIcon(post.platforms[0] || '')}
                              </div>
                              <div>
                                <h4 className="font-bold pr-10">{post.title}</h4>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">
                                  {post.platforms.join(', ')} • {post.status}
                                </p>
                              </div>
                            </div>
                            
                            {post.imageUrl && (
                              <div className="rounded-2xl overflow-hidden mb-6 h-48 bg-surface-container">
                                <img src={post.imageUrl.startsWith('http') ? post.imageUrl : `http://localhost:5000${post.imageUrl}`} className="w-full h-full object-cover" alt="Post media" />
                              </div>
                            )}

                            {post.hashtags && post.hashtags.length > 0 && (
                              <div className="flex gap-3 flex-wrap">
                                {post.hashtags.map((tag: string) => (
                                  <span key={tag} className="px-3 py-1 bg-surface-container rounded-lg text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </Card>
                        </motion.div>
                      </div>
                    );
                  })}

                  <motion.div 
                    variants={itemVariants}
                    onClick={openCreateModal}
                    className="border-2 border-dashed border-outline-variant/30 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 text-on-surface-variant/50 group cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all mt-8"
                  >
                    <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold">Drag a post here or click to schedule</span>
                  </motion.div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <Card className="p-10 bg-primary text-white overflow-hidden relative">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-3">Queue Health</h3>
                  <p className="text-white/70 text-sm mb-10">You have {queueHealth?.scheduledCount || 0} posts scheduled for this week.</p>
                  <div className="flex items-center gap-6">
                    <div className="relative w-20 h-20">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                        <motion.circle 
                          initial={{ strokeDasharray: "0 251" }}
                          animate={{ strokeDasharray: `${(queueHealth?.optimisationScore || 0) * 2.51} 251` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          cx="50" cy="50" r="40" 
                          fill="none" stroke="white" 
                          strokeWidth="10" 
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">{queueHealth?.optimisationScore || 0}%</div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Optimized Timing</span>
                  </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg font-bold">Drafts</h3>
                  <span className="bg-surface-container px-2 py-0.5 rounded text-[10px] font-bold">{drafts.length}</span>
                </div>
                <div className="space-y-4">
                  {drafts.length === 0 ? (
                    <p className="text-sm text-on-surface-variant font-medium">No drafts saved.</p>
                  ) : (
                    drafts.map(draft => (
                      <div key={draft.id} className="flex items-center gap-4 p-4 bg-surface-container/30 rounded-xl group cursor-pointer hover:bg-surface-container transition-all">
                        <div className="w-12 h-12 rounded-lg bg-on-surface overflow-hidden">
                          <img src={`https://picsum.photos/seed/${draft.id}/100/100`} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" alt="Draft" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold leading-tight line-clamp-1">{draft.title || 'Untitled'}</h4>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 mt-1">
                            {new Date(draft.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <MoreHorizontal className="ml-auto w-4 h-4 text-on-surface-variant/30 flex-shrink-0" />
                      </div>
                    ))
                  )}
                  {drafts.length > 0 && <Button variant="ghost" className="w-full mt-4 border-2 border-dashed border-outline-variant/20">View All Drafts</Button>}
                </div>
              </Card>
            </motion.div>

            {queueHealth?.trendingAlert?.active && (
              <motion.div 
                variants={itemVariants}
                className="p-6 bg-tertiary/10 rounded-2xl flex items-start gap-4 text-tertiary shadow-lg shadow-tertiary/5 border border-tertiary/20"
              >
                <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm mb-1 uppercase tracking-widest">{queueHealth.trendingAlert.platform} Alert</h4>
                  <p className="text-xs font-bold leading-relaxed">{queueHealth.trendingAlert.message}</p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
      <Button className="fixed bottom-8 right-8 w-16 h-16 shadow-2xl z-50" onClick={openCreateModal}>
        <Plus className="w-8 h-8" />
      </Button>
    </div>
  );
};

export default SchedulerView;
