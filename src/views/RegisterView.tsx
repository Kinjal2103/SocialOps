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

const RegisterView = ({ setView, setCurrentUser }: { setView: (v: View) => void, setCurrentUser?: (u: User) => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword })
      });
      const data = await res.json();
      if (res.ok) {
        saveToken(data.token);
        if (setCurrentUser) setCurrentUser(data.user);
        setView('dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex flex-col md:flex-row bg-background">
    <section className="hidden md:flex md:w-1/2 lg:w-3/5 bg-surface-container relative items-center justify-center p-16 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 rounded-full bg-tertiary/5 blur-[100px]" />
      </div>
      
      <div className="relative z-10 max-w-xl space-y-12">
        <div className="space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase">SocialOps</span>
          <h1 className="text-6xl font-extrabold leading-[1.1] tracking-tighter">
            Experience data <br/>
            <span className="text-primary italic">as art.</span>
          </h1>
          <p className="text-xl text-on-surface-variant leading-relaxed max-w-md">
            Join over 2,500 editors who use SocialOps to transform cold metrics into actionable, high-end content strategies.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <Card className="p-8">
            <div className="text-4xl font-extrabold text-primary mb-2">99.9%</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">Accuracy Rate</div>
          </Card>
          <Card className="p-8">
            <div className="text-4xl font-extrabold text-tertiary mb-2">24/7</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">Live Insights</div>
          </Card>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20">
          <img alt="Dashboard" className="w-full h-auto" src="https://picsum.photos/seed/dashboard1/800/500" referrerPolicy="no-referrer" />
        </div>
      </div>
    </section>

    <section className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-20 pt-32 md:pt-16">
      <div className="w-full max-w-[440px] space-y-10">
        <div className="space-y-2">
          <h2 className="text-4xl font-extrabold tracking-tight">Create Account</h2>
          <p className="text-on-surface-variant">Join the SocialOps platform and start your journey.</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleRegister}>
          {error && <div className="text-red-500 text-sm font-bold text-center bg-red-50 py-2 rounded-lg">{error}</div>}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 ml-1">Full Name</label>
            <Input placeholder="Alex Rivera" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 ml-1">Email Address</label>
            <Input placeholder="alex@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 ml-1">Password</label>
              <Input placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 ml-1">Confirm</label>
              <Input placeholder="••••••••" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
          </div>
          
          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" className="h-5 w-5 rounded-lg border-outline-variant bg-surface-container text-primary focus:ring-primary" required />
              </div>
              <span className="text-sm text-on-surface-variant">I agree to <span className="text-primary font-bold">Terms & Conditions</span></span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="h-5 w-5 rounded-lg border-outline-variant bg-surface-container text-primary focus:ring-primary" />
              <span className="text-sm text-on-surface-variant">Sign up for our monthly editorial newsletter</span>
            </label>
          </div>
          
          <Button className="w-full py-5 text-lg" type="submit" disabled={loading}>
            {loading ? 'Moving data...' : 'Register'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant/30" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">Or continue with</span>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-3 bg-white border border-outline-variant/20 py-3.5 rounded-full hover:bg-surface-container transition-all font-bold text-sm">
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
          Google
        </button>

        <div className="text-center">
          <p className="text-sm text-on-surface-variant">
            Already have an account? 
            <button onClick={() => setView('login')} className="font-bold text-primary hover:underline ml-1">Login</button>
          </p>
        </div>
      </div>
    </section>
  </div>
  );
};

export default RegisterView;
