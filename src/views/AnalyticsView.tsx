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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const AnalyticsView = ({ setView, user, onLogout }: { setView: (v: View) => void, user: User | null, onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<'Engagement' | 'Reach' | 'Conversions'>('Engagement');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        if (!token) {
          onLogout();
          return;
        }
        const res = await fetch(`${BASE_URL}/analytics/full`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 401) {
          removeToken();
          setView('login');
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setAnalyticsData(data);
          
          if (data.growthChart) {
            const gd = [];
            const eng = data.growthChart.engagement || [];
            const rch = data.growthChart.reach || [];
            const conv = data.growthChart.conversions || [];
            for (let i = 0; i < 4; i++) {
              gd.push({
                week: `Week ${i + 1}`,
                Engagement: eng[i] || 0,
                Reach: rch[i] || 0,
                Conversions: conv[i] || 0
              });
            }
            setGrowthData(gd);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [onLogout, setView]);

  const handleExport = () => {
    if (!analyticsData) return;
    const blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `socialops_analytics_${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    window.dispatchEvent(new CustomEvent('app-toast', { detail: 'Report exported successfully' }));
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`https://socialops.app/report/${user?.id || 'demo'}`);
      window.dispatchEvent(new CustomEvent('app-toast', { detail: 'Report link copied to clipboard' }));
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar currentView="analytics" setView={setView} user={user} onLogout={onLogout} />
        <main className="pt-32 pb-20 px-8 max-w-7xl mx-auto flex flex-col gap-8">
           <div className="animate-pulse h-20 bg-surface-container rounded-2xl w-1/3 mb-8"></div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
             {[1,2,3,4].map(i => <div key={i} className="animate-pulse h-32 bg-surface-container rounded-2xl"></div>)}
           </div>
           <div className="animate-pulse h-96 bg-surface-container rounded-2xl"></div>
        </main>
      </div>
    );
  }

  const kpis = analyticsData?.kpis || {};
  const networkDistribution = analyticsData?.networkDistribution || [];
  const audienceDna = analyticsData?.audienceDNA || { primaryAge: '', regions: [] };

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar currentView="analytics" setView={setView} user={user} onLogout={onLogout} />
      <main className="pt-32 pb-20 px-8 max-w-7xl mx-auto">
        <motion.header 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div>
            <p className="text-secondary font-bold tracking-[0.2em] text-[10px] uppercase mb-3">Performance Intelligence</p>
            <h1 className="text-5xl font-extrabold tracking-tight">Analytics Overview</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={handleExport}>Export</Button>
            <Button onClick={handleShare}>Share Report</Button>
          </div>
        </motion.header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
        >
          {[
            { label: 'Followers', value: kpis.followers || '0', change: kpis.followersChange || '0%', trend: (kpis.followersChange || '').startsWith('-') ? 'down' : 'up' },
            { label: 'Impressions', value: kpis.impressions || '0', change: kpis.impressionsChange || '0%', trend: (kpis.impressionsChange || '').startsWith('-') ? 'down' : 'up' },
            { label: 'Engagement Rate', value: kpis.engagementRate || '0%', change: kpis.engagementChange || '0%', trend: (kpis.engagementChange || '').startsWith('-') ? 'down' : 'up' },
            { label: 'Post Frequency', value: kpis.postFrequency || '0', change: kpis.frequencyChange || '0%', trend: (kpis.frequencyChange || '').startsWith('-') ? 'down' : 'up' },
          ].map(stat => (
            <motion.div key={stat.label} variants={itemVariants}>
              <Card className="p-8 hover:shadow-2xl transition-shadow duration-500 h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-on-surface-variant/50 font-bold text-[10px] uppercase tracking-widest">{stat.label}</span>
                  <div className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1",
                    stat.trend === 'up' ? "bg-teal-50 text-teal-600" : "bg-tertiary/10 text-tertiary"
                  )}>
                    {stat.change}
                  </div>
                </div>
                <div className="text-3xl font-extrabold">{stat.value}</div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-10 mb-12">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h3 className="text-2xl font-bold mb-2">Growth & Engagement</h3>
                <p className="text-on-surface-variant/50 text-xs">Multi-metric performance over time</p>
              </div>
              <div className="flex bg-surface-container p-1 rounded-xl">
                {(['Engagement', 'Reach', 'Conversions'] as const).map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                    "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                    activeTab === tab ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-primary"
                  )}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-[400px] w-full">
              {isLoading ? (
                <div className="w-full h-full bg-surface-container animate-pulse rounded-2xl" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="week" 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                      width={50}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                        fontSize: '12px',
                        fontWeight: 700
                      }} 
                    />
                    <Line
                      type="monotone"
                      dataKey={activeTab}
                      stroke="#6750a4"
                      strokeWidth={4}
                      dot={{ fill: '#6750a4', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, fill: '#a23256' }}
                      animationDuration={800}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-10 h-full">
              <h3 className="text-xl font-bold mb-8">Network Distribution</h3>
              <div className="space-y-10">
                {networkDistribution.map((item: any, idx: number) => {
                  const colors = ["bg-primary", "bg-secondary", "bg-tertiary", "bg-indigo-500"];
                  const color = colors[idx % colors.length];
                  return (
                  <div key={item.platform}>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold uppercase tracking-widest text-on-surface-variant/50">{item.platform}</span>
                      <span className="text-sm font-bold">{item.percent}% Total</span>
                    </div>
                    <div className="w-full h-6 bg-surface-container rounded-full overflow-hidden flex">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.8 + (idx * 0.2) }}
                        className={cn("h-full", color)} 
                      />
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percent * 0.5}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 1 + (idx * 0.2) }}
                        className={cn("h-full opacity-60", color)} 
                      />
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percent * 0.3}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 1.2 + (idx * 0.2) }}
                        className={cn("h-full opacity-30", color)} 
                      />
                    </div>
                  </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-10 h-full">
              <h3 className="text-xl font-bold mb-8">Audience DNA</h3>
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#eceef2" strokeWidth="12" />
                    <motion.circle 
                      initial={{ strokeDasharray: "0 251" }}
                      whileInView={{ strokeDasharray: "180 251" }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, delay: 1 }}
                      cx="50" cy="50" r="40" 
                      fill="none" stroke="#6750a4" 
                      strokeWidth="12" 
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", delay: 1.5 }}
                      className="text-3xl font-extrabold"
                    >
                      {audienceDna.primaryAge}
                    </motion.span>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-on-surface-variant/50">Primary Age</span>
                  </div>
                </div>
                <div className="flex-grow space-y-6 w-full">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 mb-4">Top Regions</p>
                  {audienceDna.regions.map((region: any, idx: number) => (
                    <motion.div 
                      key={region.label} 
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.2 + (idx * 0.1) }}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-bold">{region.label}</span>
                      <span className="text-sm font-bold text-on-surface-variant/50">{region.percent}%</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AnalyticsView;