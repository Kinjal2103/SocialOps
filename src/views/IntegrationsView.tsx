import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, Button, Input } from '../components/ui-base';
import { cn } from '../lib/utils';
import type { View, User } from '../types';
import { BASE_URL, getToken, removeToken } from '../constants';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Instagram, Twitter, Linkedin, Music2, Youtube, X } from 'lucide-react';

const IntegrationsView = ({ setView, user, onLogout }: { setView: (v: View) => void, user: User | null, onLogout: () => void }) => {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<any>(null);
  const [platformStats, setPlatformStats] = useState<any>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectUsername, setConnectUsername] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/integrations`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        if (res.status === 401) { removeToken(); setView('login'); return; }
        const data = await res.json();
        setIntegrations(data.integrations);
      } catch (err) {
        setError('Failed to load integrations');
      } finally {
        setIsLoading(false);
      }
    };
    fetchIntegrations();
  }, [setView]);

  const handleConnectClick = (integration: any) => {
    setSelectedPlatform(integration);
    setConnectUsername('');
    setShowConnectModal(true);
  };

  const handleConnect = async () => {
    if (!connectUsername.trim()) return;
    setConnectingPlatform(selectedPlatform.platform);
    try {
      const res = await fetch(`${BASE_URL}/integrations/connect`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          platform: selectedPlatform.platform,
          username: connectUsername
        })
      });
      const data = await res.json();
      if (data.success) {
        setIntegrations(prev => prev.map(i =>
          i.platform === selectedPlatform.platform
            ? { ...i, connected: true, username: connectUsername }
            : i
        ));
        setShowConnectModal(false);
        window.dispatchEvent(new CustomEvent('app-toast', { detail: `✅ ${selectedPlatform.label} connected successfully!` }));
      }
    } catch (err) {
      window.dispatchEvent(new CustomEvent('app-toast', { detail: '❌ Failed to connect. Please try again.' }));
    } finally {
      setConnectingPlatform(null);
    }
  };

  const handleDisconnect = async (platform: string) => {
    setConnectingPlatform(platform);
    try {
      const res = await fetch(`${BASE_URL}/integrations/disconnect`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ platform })
      });
      const data = await res.json();
      if (data.success) {
        setIntegrations(prev => prev.map(i =>
          i.platform === platform
            ? { ...i, connected: false, username: '', followers: 0 }
            : i
        ));
        if (selectedPlatform?.platform === platform) {
           setPlatformStats(null);
           setSelectedPlatform(null);
        }
        window.dispatchEvent(new CustomEvent('app-toast', { detail: `🔌 ${platform} disconnected` }));
      }
    } catch (err) {
      window.dispatchEvent(new CustomEvent('app-toast', { detail: '❌ Failed to disconnect. Please try again.' }));
    } finally {
      setConnectingPlatform(null);
    }
  };

  const handleViewStats = async (integration: any) => {
    setSelectedPlatform(integration);
    const res = await fetch(`${BASE_URL}/integrations/${integration.platform}/stats`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    const data = await res.json();
    setPlatformStats(data);
  };

  const renderIcon = (platform: string) => {
    if (platform === 'instagram') return <Instagram className="w-6 h-6" />;
    if (platform === 'twitter') return <Twitter className="w-6 h-6" />;
    if (platform === 'linkedin') return <Linkedin className="w-6 h-6" />;
    if (platform === 'tiktok') return <Music2 className="w-6 h-6" />;
    if (platform === 'youtube') return <Youtube className="w-6 h-6" />;
    return null;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar currentView="integrations" setView={setView} user={user} onLogout={onLogout} />
      
      <main className="pt-32 pb-20 px-8 max-w-7xl mx-auto">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">Connected Apps</h1>
          <p className="text-on-surface-variant font-medium">Manage your social platform connections</p>
        </motion.header>

        {error ? (
          <div className="text-center py-20 text-on-surface-variant/50">
            <p className="font-bold text-lg mb-2">Could not load integrations</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-8 rounded-2xl bg-surface-container animate-pulse h-64" />
              ))
            ) : (
              integrations.map((integration: any) => (
                <motion.div key={integration.platform} variants={itemVariants}>
                  <Card className="p-8 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col relative group">
                    {integration.platform === 'youtube' && (
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none text-sm font-bold text-on-surface-variant text-center px-4">
                        YouTube integration coming soon
                      </div>
                    )}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: `${integration.color}15`, color: integration.color }}>
                        {renderIcon(integration.platform)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{integration.label}</h3>
                        {integration.connected && (
                          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">
                            {integration.username}
                          </p>
                        )}
                      </div>
                      <div className={cn(
                        "ml-auto w-2.5 h-2.5 rounded-full",
                        integration.connected ? "bg-teal-500" : "bg-surface-container-high"
                      )} />
                    </div>

                    <div className="flex-grow">
                      {integration.connected && (
                        <div className="mb-6 p-4 bg-surface-container/50 rounded-xl">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 mb-1">Followers</p>
                          <p className="text-2xl font-extrabold">{integration.followers.toLocaleString()}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 mt-auto">
                      {integration.connected ? (
                        <>
                          <Button
                            variant="ghost"
                            className="flex-1 border border-outline-variant/20"
                            onClick={() => handleViewStats(integration)}
                          >
                            View Stats
                          </Button>
                          <Button
                            variant="secondary"
                            className="flex-1"
                            onClick={() => handleDisconnect(integration.platform)}
                            disabled={connectingPlatform === integration.platform || integration.platform === 'youtube'}
                          >
                            {connectingPlatform === integration.platform ? 'Disconnecting...' : 'Disconnect'}
                          </Button>
                        </>
                      ) : (
                        <Button
                          className="w-full"
                          onClick={() => handleConnectClick(integration)}
                          disabled={connectingPlatform === integration.platform || integration.platform === 'youtube'}
                        >
                          {connectingPlatform === integration.platform ? 'Connecting...' : 'Connect'}
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {platformStats && selectedPlatform && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <Card className="p-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">{selectedPlatform.label} Stats</h3>
                <button 
                  onClick={() => { setPlatformStats(null); setSelectedPlatform(null); }}
                  className="p-2 hover:bg-surface-container rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="p-6 bg-surface-container rounded-2xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 mb-2">Total Posts</p>
                  <p className="text-3xl font-extrabold">{platformStats.posts}</p>
                </div>
                <div className="p-6 bg-surface-container rounded-2xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 mb-2">Avg Likes</p>
                  <p className="text-3xl font-extrabold">{platformStats.avgLikes?.toLocaleString()}</p>
                </div>
                <div className="p-6 bg-surface-container rounded-2xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 mb-2">Avg Comments</p>
                  <p className="text-3xl font-extrabold">{platformStats.avgComments}</p>
                </div>
                <div className="p-6 bg-surface-container rounded-2xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 mb-2">Best Time</p>
                  <p className="text-3xl font-extrabold">{platformStats.bestTime}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </main>
      
      <Footer />

      {showConnectModal && selectedPlatform && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Card className="p-10 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold mb-2">Connect {selectedPlatform.label}</h3>
              <p className="text-on-surface-variant text-sm mb-8">
                Enter your {selectedPlatform.label} username to connect your account.
              </p>
              <div className="space-y-4">
                <Input
                  placeholder={`Your ${selectedPlatform.label} username`}
                  value={connectUsername}
                  onChange={(e) => setConnectUsername(e.target.value)}
                />
                <div className="flex gap-4 pt-4">
                  <Button variant="ghost" className="flex-1"
                    onClick={() => setShowConnectModal(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={handleConnect}
                    disabled={!connectUsername.trim() || connectingPlatform !== null}>
                    Connect
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default IntegrationsView;
