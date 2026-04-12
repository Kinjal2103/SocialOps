import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, Button } from '../components/ui-base';
import { cn } from '../lib/utils';
import type { View, User } from '../types';
import { BASE_URL, getToken, removeToken } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const AnalyticsView = ({ setView, user, onLogout }: { setView: (v: View) => void, user: User | null, onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<'Engagement' | 'Reach' | 'Conversions'>('Engagement');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = getToken();
      if (!token) {
        onLogout();
        return;
      }
      
      const [res, intRes] = await Promise.all([
        fetch(`${BASE_URL}/analytics/full`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${BASE_URL}/integrations`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (res.status === 401 || intRes.status === 401) {
        removeToken();
        setView('login');
        return;
      }
      if (!res.ok) throw new Error('Failed to load analytics data.');

      const data = await res.json();
      const intData = await intRes.json();

      setAnalyticsData(data);
      if (intData && intData.integrations) {
        setConnectedPlatforms(
          intData.integrations
            .filter((i: any) => i.connected)
            .map((i: any) => i.platform.toLowerCase())
        );
      }
      
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
    } catch (err: any) {
      setError(err.message || 'Network error');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [onLogout, setView]);

  const handleExport = async () => {
    try {
      const res = await fetch(`${BASE_URL}/analytics/export`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ format: 'json' })
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'socialops-analytics.json';
      a.click();
      window.URL.revokeObjectURL(url);
      window.dispatchEvent(new CustomEvent('app-toast', { detail: '📊 Analytics exported successfully!' }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    try {
      const res = await fetch(`${BASE_URL}/analytics/share`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success && data.shareUrl) {
        await navigator.clipboard.writeText(data.shareUrl);
        window.dispatchEvent(new CustomEvent('app-toast', { detail: '🔗 Report link copied to clipboard!' }));
      }
    } catch (err) {
      console.error('Failed to share', err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  const kpiCards = analyticsData ? [
    { label: 'Followers', value: analyticsData.kpis.followers, change: analyticsData.kpis.followersChange },
    { label: 'Impressions', value: analyticsData.kpis.impressions, change: analyticsData.kpis.impressionsChange },
    { label: 'Engagement Rate', value: analyticsData.kpis.engagementRate, change: analyticsData.kpis.engagementChange },
    { label: 'Post Frequency', value: analyticsData.kpis.postFrequency, change: analyticsData.kpis.frequencyChange },
  ] : [];

  const platformColors = ['bg-primary', 'bg-secondary', 'bg-tertiary', 'bg-teal-500', 'bg-blue-500'];
  const networkDistribution = analyticsData?.networkDistribution
    ?.filter((item: any) => connectedPlatforms.includes(item.platform.toLowerCase()))
    ?.map((item: any, idx: number) => ({
      ...item,
      color: platformColors[idx] || 'bg-primary'
    })) || [];

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

        {error ? (
          <div className="text-center py-20 text-on-surface-variant/50">
            <p className="font-bold text-lg mb-2">Could not load analytics</p>
            <p className="text-sm">{error}</p>
            <Button className="mt-6" onClick={fetchAnalytics}>Try Again</Button>
          </div>
        ) : (
          <>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
            >
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-8 rounded-2xl bg-surface-container animate-pulse h-36" />
                ))
              ) : (
                kpiCards.map(stat => {
                  const trend = stat.change.startsWith('+') ? 'up' : 'down';
                  return (
                    <motion.div key={stat.label} variants={itemVariants}>
                      <Card className="p-8 hover:shadow-2xl transition-shadow duration-500 h-full">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-on-surface-variant/50 font-bold text-[10px] uppercase tracking-widest">{stat.label}</span>
                          <div className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1",
                            trend === 'up' ? "bg-teal-50 text-teal-600" : "bg-tertiary/10 text-tertiary"
                          )}>
                            {stat.change}
                          </div>
                        </div>
                        <div className="text-3xl font-extrabold">{stat.value}</div>
                      </Card>
                    </motion.div>
                  );
                })
              )}
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
                    {isLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-4">
                          <div className="flex justify-between">
                            <div className="w-20 h-4 bg-surface-container animate-pulse rounded"></div>
                            <div className="w-16 h-4 bg-surface-container animate-pulse rounded"></div>
                          </div>
                          <div className="w-full h-6 bg-surface-container animate-pulse rounded-full"></div>
                        </div>
                      ))
                    ) : (
                      networkDistribution.length === 0 ? (
                        <div className="text-center py-8 text-on-surface-variant/50">
                          <p className="font-bold text-sm">No connected platforms</p>
                          <p className="text-xs">Connect platforms in Integrations to view distribution.</p>
                        </div>
                      ) : (
                        networkDistribution.map((item: any, idx: number) => {
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
                                className={cn("h-full", item.color)} 
                              />
                              <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: `${item.percent * 0.5}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 1 + (idx * 0.2) }}
                                className={cn("h-full opacity-60", item.color)} 
                              />
                              <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: `${item.percent * 0.3}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 1.2 + (idx * 0.2) }}
                                className={cn("h-full opacity-30", item.color)} 
                              />
                            </div>
                          </div>
                          );
                        })
                      )
                    )}
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
                        {!isLoading && (
                          <motion.circle 
                            initial={{ strokeDasharray: "0 251" }}
                            whileInView={{ strokeDasharray: `${(72 / 100) * 251} 251` }}
                            viewport={{ once: true }}
                            transition={{ duration: 2, delay: 1 }}
                            cx="50" cy="50" r="40" 
                            fill="none" stroke="#6750a4" 
                            strokeWidth="12" 
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                          />
                        )}
                      </svg>
                      {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-8 bg-surface-container animate-pulse rounded"></div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <motion.span 
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", delay: 1.5 }}
                            className="text-3xl font-extrabold"
                          >
                            {analyticsData?.audienceDNA?.primaryAge}
                          </motion.span>
                          <span className="text-[8px] font-bold uppercase tracking-widest text-on-surface-variant/50">Primary Age</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow space-y-6 w-full">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 mb-4">Top Regions</p>
                      {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="flex justify-between">
                            <div className="w-24 h-4 bg-surface-container animate-pulse rounded"></div>
                            <div className="w-8 h-4 bg-surface-container animate-pulse rounded"></div>
                          </div>
                        ))
                      ) : (
                        analyticsData?.audienceDNA?.regions?.map((region: any, idx: number) => (
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
                        ))
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AnalyticsView;