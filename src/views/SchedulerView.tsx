import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Plus, Sparkles, MoreHorizontal,
  Instagram, Twitter, Linkedin, MessageSquare
} from 'lucide-react';
import { Card, Button } from '../components/ui-base';
import { cn } from '../lib/utils';
import type { View, User } from '../types';
import { BASE_URL, getToken, removeToken } from '../constants';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const getImageUrl = (url: string) => {
  if (!url) return 'placeholder-image-url-here';
  if (url.startsWith('http')) return url;
  const serverUrl = BASE_URL.replace('/api', ''); 
  return `${serverUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

const SchedulerView = ({ setView, user, onLogout, openCreateModal }: { setView: (v: View) => void, user: User | null, onLogout: () => void, openCreateModal: () => void }) => {
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [totalDrafts, setTotalDrafts] = useState(0);
  const [trendingPost, setTrendingPost] = useState<any>(null);
  const [queueHealth, setQueueHealth] = useState({ total: 0, score: 0 });
  const [activeView, setActiveView] = useState<'weekly' | 'monthly'>('weekly');
  const [isLoading, setIsLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedulerData = async () => {
      try {
        setIsLoading(true);
        const [queueRes, draftsRes, trendingRes] = await Promise.all([
          fetch(`${BASE_URL}/scheduler/queue`, {
            headers: { Authorization: `Bearer ${getToken()}` }
          }),
          fetch(`${BASE_URL}/scheduler/drafts`, {
            headers: { Authorization: `Bearer ${getToken()}` }
          }),
          fetch(`${BASE_URL}/scheduler/trending`, {
            headers: { Authorization: `Bearer ${getToken()}` }
          })
        ]);
        
        if (queueRes.status === 401 || draftsRes.status === 401 || trendingRes.status === 401) { 
          removeToken(); 
          onLogout();
          return; 
        }
        
        const queueData = await queueRes.ok ? await queueRes.json() : { scheduledPosts: [], totalScheduled: 0, queueHealthScore: 0 };
        const draftsData = await draftsRes.ok ? await draftsRes.json() : { drafts: [], totalDrafts: 0 };
        const trendingData = await trendingRes.ok ? await trendingRes.json() : { trendingPost: null };
        
        setScheduledPosts(queueData.scheduledPosts || []);
        setQueueHealth({ total: queueData.totalScheduled || 0, score: queueData.queueHealthScore || 0 });
        setDrafts(draftsData.drafts || []);
        setTotalDrafts(draftsData.totalDrafts || 0);
        setTrendingPost(trendingData.trendingPost || null);
      } catch (err) {
        console.error('Scheduler fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedulerData();
  }, [onLogout]);

  useEffect(() => {
    const closeMenu = () => setOpenMenuId(null);
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

  const handleDelete = async (postId: string) => {
    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/scheduler/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setScheduledPosts(prev => prev.filter(p => p.id !== postId));
        window.dispatchEvent(new CustomEvent('app-toast', { detail: 'Post deleted from queue' }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReschedule = (postId: string) => {
    window.dispatchEvent(new CustomEvent('app-toast', { detail: 'Reschedule feature coming soon!' }));
  };

  const getPlatformIcon = (platform: string) => {
    if (platform?.toLowerCase() === 'instagram') return <Instagram className="w-5 h-5 flex-shrink-0" />;
    if (platform?.toLowerCase() === 'twitter') return <Twitter className="w-5 h-5 flex-shrink-0" />;
    if (platform?.toLowerCase() === 'linkedin') return <Linkedin className="w-5 h-5 flex-shrink-0" />;
    return <MessageSquare className="w-5 h-5 flex-shrink-0" />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric'
  });

  const groupedPosts = scheduledPosts.reduce((acc, post) => {
    const timeStr = new Date(post.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    if (!acc[timeStr]) acc[timeStr] = [];
    acc[timeStr].push(post);
    return acc;
  }, {} as Record<string, any[]>);

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
                onClick={() => setActiveView('weekly')}
                className={cn("px-6 py-2 rounded-lg text-xs font-bold transition-all", activeView === 'weekly' ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-primary")}
              >Weekly</button>
              <button 
                onClick={() => setActiveView('monthly')}
                className={cn("px-6 py-2 rounded-lg text-xs font-bold transition-all", activeView === 'monthly' ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-primary")}
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
                <h3 className="text-2xl font-bold">{todayStr}</h3>
              </div>
            </motion.div>

            <div className="relative pl-12 border-l-2 border-outline-variant/20 space-y-12 pb-12">
              {activeView === 'monthly' ? (
                <div className="flex items-center justify-center h-64 text-on-surface-variant/50 font-bold">
                  Monthly view coming soon — showing {queueHealth.total} posts scheduled this month
                </div>
              ) : isLoading ? (
                <div className="animate-pulse space-y-12">
                   <div className="h-40 bg-surface-container rounded-2xl"></div>
                   <div className="h-40 bg-surface-container rounded-2xl"></div>
                </div>
              ) : scheduledPosts.length === 0 ? (
                <motion.div 
                  variants={itemVariants}
                  onClick={openCreateModal}
                  className="border-2 border-dashed border-outline-variant/30 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 text-on-surface-variant/50 group cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all mt-4 relative"
                >
                  <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold">No posts scheduled — click to add one</span>
                </motion.div>
              ) : (
                <>
                  {Object.entries(groupedPosts).map(([timeStr, posts]: [string, any]) => (
                    <div key={timeStr} className="relative space-y-6">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="absolute -left-[57px] top-4 w-4 h-4 rounded-full bg-primary border-4 border-background z-10" 
                      />
                      <div className="absolute -left-32 top-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 w-20 text-right">{timeStr}</div>
                      
                      {posts.map((post: any) => (
                        <motion.div variants={itemVariants} key={post.id}>
                          <Card className="p-8 hover:shadow-xl transition-shadow duration-300 relative group">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="relative group/menu">
                                <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === post.id ? null : post.id); }} className="p-2 text-on-surface-variant/50 hover:bg-surface-container rounded-lg">
                                  <MoreHorizontal className="w-5 h-5" />
                                </button>
                                <AnimatePresence>
                                  {openMenuId === post.id && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-xl border border-outline-variant/10 z-20 overflow-hidden"
                                    >
                                      <button onClick={(e) => { e.stopPropagation(); handleReschedule(post.id); setOpenMenuId(null); }} className="w-full text-left px-4 py-3 text-sm font-bold text-on-surface hover:bg-surface-container transition-colors">
                                        Reschedule
                                      </button>
                                      <button onClick={(e) => { e.stopPropagation(); handleDelete(post.id); setOpenMenuId(null); }} className="w-full text-left px-4 py-3 text-sm font-bold text-error hover:bg-error/10 transition-colors">
                                        Delete
                                      </button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                {getPlatformIcon(post.platform)}
                              </div>
                              <div>
                                <h4 className="font-bold pr-10">{post.title}</h4>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">
                                  {post.platform} • <span className="capitalize">{post.status}</span>
                                </p>
                              </div>
                            </div>
                            
                            {post.imageUrl && (
                              <div className="rounded-2xl overflow-hidden mb-6 h-48 bg-surface-container">
                                <img src={getImageUrl(post.imageUrl)} className="w-full h-full object-cover" alt="Post media" />
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
                      ))}
                    </div>
                  ))}

                  <motion.div 
                    variants={itemVariants}
                    onClick={openCreateModal}
                    className="border-2 border-dashed border-outline-variant/30 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 text-on-surface-variant/50 group cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all mt-8 relative"
                  >
                    <div className="absolute -left-[57px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-surface-container border-4 border-background z-10" />
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
                  <p className="text-white/70 text-sm mb-10">You have {queueHealth.total} posts scheduled for this week.</p>
                  <div className="flex items-center gap-6">
                    <div className="relative w-20 h-20">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                        <motion.circle 
                          initial={{ strokeDasharray: "0 251" }}
                          animate={{ strokeDasharray: `${(queueHealth.score / 100) * 251} 251` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          cx="50" cy="50" r="40" 
                          fill="none" stroke="white" 
                          strokeWidth="10" 
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">{queueHealth.score}%</div>
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
                  <span className="bg-surface-container px-2 py-0.5 rounded text-[10px] font-bold">{totalDrafts}</span>
                </div>
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-16 bg-surface-container rounded-xl"></div>
                      <div className="h-16 bg-surface-container rounded-xl"></div>
                    </div>
                  ) : drafts.length === 0 ? (
                    <p className="text-sm text-on-surface-variant font-medium">No drafts yet</p>
                  ) : (
                    drafts.slice(0, 2).map(draft => (
                      <div key={draft.id} className="flex items-center gap-4 p-4 bg-surface-container/30 rounded-xl group cursor-pointer hover:bg-surface-container transition-all">
                        <div className="w-12 h-12 rounded-lg bg-on-surface overflow-hidden">
                          <img src={`https://picsum.photos/seed/${draft.id}/100/100`} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" alt="Draft" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold leading-tight line-clamp-1">{draft.title || 'Untitled'}</h4>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 mt-1">
                            {draft.timeAgo}
                          </p>
                        </div>
                        <MoreHorizontal className="ml-auto w-4 h-4 text-on-surface-variant/30 flex-shrink-0" />
                      </div>
                    ))
                  )}
                  {totalDrafts > 0 && <Button variant="ghost" className="w-full mt-4 border-2 border-dashed border-outline-variant/20">View All Drafts</Button>}
                </div>
              </Card>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="p-6 bg-tertiary/10 rounded-2xl flex items-start gap-4 text-tertiary shadow-lg shadow-tertiary/5 border border-tertiary/20"
            >
              <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm mb-1 uppercase tracking-widest">Trending Alert</h4>
                {trendingPost ? (
                  <p className="text-xs font-bold leading-relaxed">
                    Post "{trendingPost.title}" is trending on <span className="capitalize">{trendingPost.platform}</span> with {trendingPost.likes.toLocaleString()} likes!
                  </p>
                ) : (
                  <p className="text-xs font-bold leading-relaxed">No trending posts yet — keep posting!</p>
                )}
              </div>
            </motion.div>
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
