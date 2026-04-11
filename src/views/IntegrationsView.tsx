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

const IntegrationsView = ({ setView, user, onLogout }: { setView: (v: View) => void, user: User | null, onLogout: () => void }) => {
  const [connectedApps, setConnectedApps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeProcess, setActiveProcess] = useState<string | null>(null);

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const token = getToken();
        if (!token) return onLogout();
        const res = await fetch(`${BASE_URL}/integrations`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setConnectedApps(data);
        } else if (res.status === 401) {
          onLogout();
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIntegrations();
  }, [onLogout]);

  const handleConnect = async (platform: string) => {
    setActiveProcess(platform);
    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/integrations/${platform}/connect`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setConnectedApps(prev => [...prev.filter(a => a.platform !== platform), data.account]);
        window.dispatchEvent(new CustomEvent('app-toast', { detail: `Successfully connected ${platform}!` }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActiveProcess(null);
    }
  };

  const handleDisconnect = async (platform: string) => {
    setActiveProcess(platform);
    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/integrations/${platform}/disconnect`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setConnectedApps(prev => prev.filter(a => a.platform !== platform));
        window.dispatchEvent(new CustomEvent('app-toast', { detail: `Disconnected ${platform}` }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActiveProcess(null);
    }
  };

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-8 h-8" />, color: 'text-pink-600 bg-pink-100' },
    { id: 'twitter', name: 'Twitter/X', icon: <Twitter className="w-8 h-8" />, color: 'text-blue-500 bg-blue-100' },
    { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="w-8 h-8" />, color: 'text-blue-700 bg-blue-100' },
    { id: 'tiktok', name: 'TikTok', icon: <Video className="w-8 h-8" />, color: 'text-black bg-gray-200' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar currentView="integrations" setView={setView} user={user} onLogout={onLogout} />
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 pt-32">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Connect your social accounts</h1>
          <p className="text-on-surface-variant font-medium max-w-xl">Link your active profiles to SocialOps to start orchestrating cross-platform campaigns seamlessly from one centralized dashboard.</p>
        </div>

        {isLoading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[1,2,3,4].map(i => <div key={i} className="animate-pulse h-48 bg-surface-container rounded-2xl" />)}
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map(p => {
              const connectedAccount = connectedApps.find(a => a.platform === p.id);
              const isConnecting = activeProcess === p.id;
              
              return (
                <Card key={p.id} className="p-8 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${p.color}`}>
                        {p.icon}
                      </div>
                      {connectedAccount && (
                        <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-200">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          Connected
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-1">{p.name}</h3>
                    {connectedAccount ? (
                      <p className="text-sm font-bold text-on-surface-variant/70">{connectedAccount.username}</p>
                    ) : (
                      <p className="text-sm font-bold text-on-surface-variant/40">Not connected</p>
                    )}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t-2 border-surface-container/50">
                    {connectedAccount ? (
                      <Button 
                        variant="ghost" 
                        className="w-full text-tertiary hover:bg-tertiary/10 border border-tertiary/20"
                        onClick={() => handleDisconnect(p.id)}
                        disabled={isConnecting}
                      >
                        {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Disconnect'}
                      </Button>
                    ) : (
                      <Button 
                        className="w-full shadow-lg"
                        onClick={() => handleConnect(p.id)}
                        disabled={isConnecting}
                      >
                        {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Connect'}
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default IntegrationsView;
