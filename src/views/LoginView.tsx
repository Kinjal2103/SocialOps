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

const LoginView = ({ setView, setCurrentUser }: { setView: (v: View) => void, setCurrentUser?: (u: User) => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        saveToken(data.token);
        if (setCurrentUser) setCurrentUser(data.user);
        setView('dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <section className="hidden md:flex md:w-1/2 lg:w-3/5 bg-surface-container relative overflow-hidden flex-col justify-between p-16">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-tertiary/5 blur-[100px] rounded-full" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-20">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <BarChart3 className="text-white w-6 h-6" />
            </div>
            <span className="font-display font-extrabold text-2xl tracking-tight text-primary">SocialOps</span>
          </div>
          
          <div className="max-w-xl">
            <h1 className="text-6xl font-extrabold leading-[1.1] mb-8">
              The Weightless <br/>
              <span className="text-primary">Gallery of Data.</span>
            </h1>
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
              Transform your social media metrics into a curated exhibition. Experience data through soft layers and intentional breathing room.
            </p>
          </div>
        </div>

        <div className="relative z-10 self-end w-full max-w-md">
          <Card className="p-8 rounded-[2rem]">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 mb-1">Weekly Reach</p>
                <p className="text-4xl font-bold">1.2M</p>
              </div>
              <div className="bg-tertiary/10 text-tertiary px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12%
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-primary rounded-full" 
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest">
                <span>Platform Performance</span>
                <span>Optimized</span>
              </div>
            </div>
          </Card>
          <div className="absolute -bottom-6 -left-12 w-32 h-32 rounded-3xl overflow-hidden border-8 border-surface-container rotate-6 shadow-xl">
            <img alt="Abstract" className="w-full h-full object-cover" src="https://picsum.photos/seed/data1/300/300" referrerPolicy="no-referrer" />
          </div>
        </div>
      </section>

      <section className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 lg:p-24">
        <div className="w-full max-w-[400px] space-y-10">
          <header className="text-center md:text-left">
            <h2 className="text-3xl font-extrabold mb-2">Login</h2>
            <p className="text-on-surface-variant">Access your analytics dashboard</p>
          </header>
          
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && <div className="text-red-500 text-sm font-bold text-center bg-red-50 py-2 rounded-lg">{error}</div>}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 ml-1">Email or Username</label>
              <div className="relative">
                <Input placeholder="name@company.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/30 w-4 h-4" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-end ml-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">Password</label>
                <button type="button" className="text-[10px] font-bold text-primary hover:underline">Forgot Password?</button>
              </div>
              <div className="relative">
                <Input placeholder="••••••••" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/30 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <Button className="w-full py-4 text-base" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
              {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
            </Button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/30" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">Or continue with</span>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-3 bg-white border border-outline-variant/20 py-3.5 rounded-xl hover:bg-surface-container transition-colors font-bold text-sm">
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
            Google
          </button>

          <footer className="text-center pt-8">
            <p className="text-sm text-on-surface-variant">
              Don't have an account? 
              <button onClick={() => setView('register')} className="font-bold text-primary hover:underline ml-1">Register now</button>
            </p>
          </footer>
        </div>
      </section>
    </div>
  );
};

export default LoginView;
