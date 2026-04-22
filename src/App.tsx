import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Bell, 
  Plus, 
  ArrowUp, 
  Sparkles, 
  Heart, 
  MessageCircle, 
  ArrowRight,
  LayoutDashboard,
  BarChart3,
  Calendar,
  LogOut,
  TrendingUp,
  MoreHorizontal,
  Mail,
  Eye,
  EyeOff,
  Check,
  X,
  Upload,
  Trash2,
  Instagram,
  Twitter,
  Linkedin,
  Clock,
  ChevronDown,
  Phone,
  Video,
  FileText,
  MousePointerClick,
  PlusCircle,
  MessageSquare,
  Plug,
  Loader2,
  Send,
  Smartphone,
  Laptop,
  Youtube
} from 'lucide-react';
import { Card, Button, Input } from '@/src/components/ui-base';
import { cn } from '@/src/lib/utils';

// --- Types ---
type View = 'login' | 'register' | 'dashboard' | 'analytics' | 'scheduler' | 'integrations';
type User = { id: string; name: string; email: string };

const BASE_URL = 'http://localhost:5000/api';

const saveToken = (token: string) => localStorage.setItem('token', token);
const getToken = () => localStorage.getItem('token');
const removeToken = () => localStorage.removeItem('token');

// --- Mock Data ---

// --- Components ---

const Toast = ({ message, onClose }: { message: string, onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.9 }}
    className="fixed bottom-8 right-8 z-[100] glass-effect bg-[rgba(0,0,0,0.8)] text-white px-6 py-4 rounded-xl flex items-center gap-3 shadow-2xl"
  >
    <Check className="w-5 h-5 text-primary" />
    <span className="text-sm font-bold tracking-wide">{message}</span>
    <button onClick={onClose} className="ml-4 text-white/50 hover:text-white transition-colors">
      <X className="w-4 h-4" />
    </button>
  </motion.div>
);

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

const Footer = () => (
  <footer className="w-full py-12 border-t border-outline-variant/10 mt-20">
    <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="text-on-surface-variant/50 text-[10px] font-bold uppercase tracking-widest">
        © 2025 SocialOps. All rights reserved.
      </div>
      <div className="flex gap-8">
        {['Privacy Policy', 'Terms of Service', 'Help Center'].map((link) => (
          <a key={link} href="#" target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 hover:text-primary transition-colors">
            {link}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

// --- Views ---

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

const CreatePostModal = ({ isOpen, onClose, user }: { isOpen: boolean, onClose: () => void, user: User | null }) => {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
  const [contentType, setContentType] = useState('Post');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [mediaFiles, setMediaFiles] = useState<{ file: File, previewUrl: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setCaption('');
      setSelectedPlatforms(['instagram']);
      setContentType('Post');
      setIsScheduled(false);
      setScheduledDate('');
      setScheduledTime('');
      setMediaFiles([]);
      setIsSubmitting(false);
      setSubmitError(null);
      setPreviewMode('mobile');
      setIsUploading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setSubmitError(null);
    const token = getToken();

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('media', file as Blob);

        const res = await fetch(`${BASE_URL}/posts/upload-media`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

        if (!res.ok) throw new Error('Failed to upload media');
        const data = await res.json();
        
        setMediaFiles(prev => [...prev, { file, previewUrl: `http://localhost:5000${data.imageUrl}` }]);
      }
    } catch (err) {
      setSubmitError('Failed to upload some media files.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (status: 'draft' | 'published' | 'scheduled') => {
    setSubmitError(null);
    if (!title.trim()) {
      setSubmitError('Title is required.');
      return;
    }
    if (selectedPlatforms.length === 0) {
      setSubmitError('Please select at least one platform.');
      return;
    }
    if (status === 'scheduled' && (!scheduledDate || !scheduledTime)) {
      setSubmitError('Please provide both date and time for scheduled posts.');
      return;
    }

    setIsSubmitting(true);
    const token = getToken();
    
    // Convert previewUrl to backend relative path
    const imageUrls = mediaFiles.map(m => m.previewUrl.replace('http://localhost:5000', ''));

    let scheduledAt = null;
    if (status === 'scheduled') {
      scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
    }

    try {
      const res = await fetch(`${BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          caption,
          type: contentType,
          platforms: selectedPlatforms,
          status,
          scheduledAt,
          imageUrls
        })
      });

      if (!res.ok) throw new Error('Failed to create post');
      
      const successMsg = status === 'draft' ? "Draft saved successfully!" : status === 'scheduled' ? "Post scheduled!" : "Post published!";
      
      window.dispatchEvent(new CustomEvent('app-toast', { detail: successMsg }));
      onClose();
    } catch (err) {
      setSubmitError('Failed to submit post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 + (i * 0.05),
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-on-background/20 backdrop-blur-sm p-4 md:p-8"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-surface-container-lowest w-full max-w-6xl h-full max-h-[900px] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between px-8 py-6 border-b border-outline-variant/10 bg-white/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <PlusCircle className="text-primary w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-on-surface">Create Post</h1>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container transition-all duration-200 group"
          >
            <X className="text-on-surface-variant group-hover:text-on-surface w-5 h-5" />
          </button>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-full lg:w-[65%] overflow-y-auto no-scrollbar p-8 space-y-10">
            <motion.section custom={0} variants={formVariants} initial="hidden" animate="visible" className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 ml-1">Post Title</label>
                <Input 
                  placeholder="Summer Campaign Reveal..." 
                  className="bg-surface-container/50 border-none" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 ml-1">Caption</label>
                <textarea 
                  className="w-full bg-surface-container/50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/40 transition-all font-sans text-on-surface placeholder:text-on-surface-variant/30 resize-none h-32" 
                  placeholder="Write your story here..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>
            </motion.section>

            <motion.section custom={1} variants={formVariants} initial="hidden" animate="visible" className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 ml-1">Media Gallery</label>
              <div className="grid grid-cols-4 gap-4">
                <div 
                  className="col-span-2 relative aspect-square rounded-2xl border-2 border-dashed border-outline-variant/20 bg-surface-container/30 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" className="hidden" ref={fileInputRef} accept="image/*,video/mp4" multiple onChange={handleMediaUpload} />
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  ) : (
                    <>
                      <Upload className="text-on-surface-variant/30 group-hover:text-primary mb-2 w-8 h-8" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 group-hover:text-primary">Upload Media</span>
                    </>
                  )}
                </div>
                {mediaFiles.map((media, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="relative group rounded-2xl overflow-hidden aspect-square"
                  >
                    {media.file.type.startsWith('video') ? (
                       <video className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={media.previewUrl} autoPlay loop muted />
                    ) : (
                       <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={media.previewUrl} />
                    )}
                    <button 
                      onClick={() => removeMedia(i)}
                      className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <Trash2 className="w-4 h-4 text-tertiary" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <motion.div custom={2} variants={formVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 ml-1">Platforms</label>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => handlePlatformToggle('instagram')}
                    className={cn(
                      "px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all",
                      selectedPlatforms.includes('instagram') ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                    )}>
                    <Instagram className="w-3.5 h-3.5" /> Instagram
                  </button>
                  <button 
                    onClick={() => handlePlatformToggle('twitter')}
                    className={cn(
                      "px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all",
                      selectedPlatforms.includes('twitter') ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                    )}>
                    <Twitter className="w-3.5 h-3.5" /> Twitter
                  </button>
                  <button 
                    onClick={() => handlePlatformToggle('linkedin')}
                    className={cn(
                      "px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all",
                      selectedPlatforms.includes('linkedin') ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                    )}>
                    <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                  </button>
                </div>
              </section>
              <section className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 ml-1">Content Type</label>
                <div className="flex bg-surface-container rounded-full p-1 w-fit">
                  {['Post', 'Reel', 'Story'].map(type => (
                    <button 
                      key={type}
                      onClick={() => setContentType(type)}
                      className={cn(
                        "px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all",
                        contentType === type ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-primary"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </section>
            </motion.div>

            <motion.section custom={3} variants={formVariants} initial="hidden" animate="visible" className="bg-surface-container/30 p-6 rounded-2xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-on-surface">Schedule Posting</h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 mt-1">Optimize reach by selecting peak engagement times.</p>
                </div>
                <div 
                  className="relative inline-flex items-center cursor-pointer"
                  onClick={() => setIsScheduled(!isScheduled)}
                >
                  <div className={cn("w-12 h-6 rounded-full relative transition-[background]", isScheduled ? "bg-primary" : "bg-surface-container-high")}>
                    <motion.div 
                      layout
                      className={cn("absolute top-1 w-4 h-4 bg-white rounded-full", isScheduled ? "right-1" : "left-1")} 
                    />
                  </div>
                </div>
              </div>
              <AnimatePresence>
                {isScheduled && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="grid grid-cols-2 gap-4 overflow-hidden"
                  >
                    <div className="bg-white rounded-xl p-4 flex items-center gap-3 border border-outline-variant/10 shadow-sm relative focus-within:border-primary">
                      <Calendar className="text-primary w-5 h-5 flex-shrink-0" />
                      <input 
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm font-bold w-full"
                      />
                    </div>
                    <div className="bg-white rounded-xl p-4 flex items-center gap-3 border border-outline-variant/10 shadow-sm relative focus-within:border-primary">
                      <Clock className="text-primary w-5 h-5 flex-shrink-0" />
                      <input 
                        type="time" 
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm font-bold w-full"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:flex lg:w-[35%] bg-surface-container p-8 flex-col gap-6"
          >
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 ml-1">Live Preview</label>
            <div className="flex-1 bg-white rounded-2xl shadow-2xl shadow-primary/5 overflow-hidden border border-outline-variant/10 flex flex-col">
              <div className="p-4 flex items-center justify-between border-b border-surface-container">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-[10px] text-primary">{user?.name ? user.name[0] : 'U'}</div>
                  <div>
                    <p className="text-[10px] font-bold leading-none">{user?.name || 'User'}</p>
                    <p className="text-[8px] font-bold text-on-surface-variant/50 uppercase tracking-widest leading-none mt-1">{selectedPlatforms[0] || 'Instagram'}</p>
                  </div>
                </div>
                <MoreHorizontal className="text-on-surface-variant/30 w-4 h-4" />
              </div>
              <div className="aspect-square bg-surface-container/30 overflow-hidden">
                {mediaFiles.length > 0 ? (
                  mediaFiles[0].file.type.startsWith('video') ? (
                    <video className="w-full h-full object-cover" src={mediaFiles[0].previewUrl} autoPlay loop muted />
                  ) : (
                    <img className="w-full h-full object-cover" src={mediaFiles[0].previewUrl} />
                  )
                ) : (
                  <img className="w-full h-full object-cover" src="https://picsum.photos/seed/preview/600/600" />
                )}
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-4">
                  <Heart className="w-5 h-5" />
                  <MessageCircle className="w-5 h-5" />
                  <Send className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest">0 likes</p>
                  <p className="text-xs leading-relaxed text-on-surface-variant whitespace-pre-wrap"><span className="font-bold text-on-surface">{user?.name || 'User'}</span> {caption || 'Your caption will appear here...'}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => setPreviewMode('mobile')}
                className={cn("w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all", previewMode === 'mobile' ? 'bg-white text-primary' : 'bg-surface-container-high text-on-surface-variant/30')}
              >
                <Smartphone className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setPreviewMode('desktop')}
                className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-all", previewMode === 'desktop' ? 'bg-white text-primary shadow-lg' : 'bg-surface-container-high text-on-surface-variant/30')}
              >
                <Laptop className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>

        <footer className="px-8 py-6 border-t border-outline-variant/10 bg-white/50 backdrop-blur-md">
          {submitError && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-bold flex items-center gap-2">
              <X className="w-4 h-4" /> {submitError}
            </div>
          )}
          <div className="flex items-center justify-between">
            <button 
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleSubmit('draft')}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50"
              >
                Save Draft
              </button>
              <Button 
                disabled={isSubmitting}
                onClick={() => handleSubmit(isScheduled ? 'scheduled' : 'published')}
                className="px-8 py-2.5 rounded-full shadow-xl shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {isScheduled ? 'Schedule' : 'Publish'}
              </Button>
            </div>
          </div>
        </footer>
      </motion.div>
    </motion.div>
  );
};

const DashboardView = ({ setView, user, onLogout, openCreateModal }: { setView: (v: View) => void, user: User | null, onLogout: () => void, openCreateModal: () => void }) => {
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const isDashboardConnected = Boolean(dashboardStats?.isConnected);

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
                    d={isDashboardConnected ? "M0 100 Q 50 20, 100 80 T 200 40 T 300 90 T 400 30" : "M0 100 L400 100"}
                    fill="none" 
                    stroke="url(#lineGrad)" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    className={cn("opacity-80", !isDashboardConnected && "opacity-30")}
                  />
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6750a4" />
                      <stop offset="100%" stopColor="#a23256" />
                    </linearGradient>
                  </defs>
                  <motion.circle 
                    animate={isDashboardConnected ? { scale: [1, 1.5, 1] } : { scale: 1 }}
                    transition={isDashboardConnected ? { repeat: Infinity, duration: 2 } : { duration: 0 }}
                    cx="400" cy={isDashboardConnected ? "30" : "100"} r="6" fill="#a23256" 
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
                <Button variant="white" className="flex-shrink-0" onClick={handleApplyInsight} disabled={!isDashboardConnected}>Apply Now</Button>
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
                {dashboardStats?.audienceBreakdown?.length ? dashboardStats.audienceBreakdown.map((item: any, idx: number) => (
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
                )) : (
                  <div className="rounded-2xl border border-dashed border-outline-variant/30 p-6 text-sm font-medium text-on-surface-variant/60">
                    Connect an account to populate audience breakdown.
                  </div>
                )}
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
                    whileHover={isDashboardConnected ? { scale: 1.2 } : undefined}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className={cn(
                      "aspect-square rounded-full",
                      isDashboardConnected && "cursor-pointer",
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
                    <span className={cn("w-2 h-2 rounded-full", isDashboardConnected ? "bg-tertiary animate-ping" : "bg-white/40")} />
                    <span className={cn("text-[10px] font-bold uppercase tracking-widest", isDashboardConnected ? "text-tertiary" : "text-white/60")}>
                      {isDashboardConnected ? "Anomaly Detected" : "No Data"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold leading-snug">{dashboardStats?.anomaly?.title}</h3>
                  <p className="text-on-surface-variant/70 text-xs mt-3">{dashboardStats?.anomaly?.description}</p>
                </div>
                <div className="mt-10 flex items-end gap-2 h-24">
                  {(isDashboardConnected ? [20, 35, 25, 95, 30, 15, 20] : [0, 0, 0, 0, 0, 0, 0]).map((h, i) => (
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

const AnalyticsView = ({ setView, user, onLogout }: { setView: (v: View) => void, user: User | null, onLogout: () => void }) => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartTab, setChartTab] = useState<'Engagement' | 'Reach' | 'Conversions'>('Engagement');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        if (!token) {
          onLogout();
          return;
        }
        const res = await fetch(`${BASE_URL}/analytics/overview`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 401) {
          onLogout();
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setAnalyticsData(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [onLogout]);

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
  const audienceDna = analyticsData?.audienceDna || { topAgeGroup: '', regions: [] };
  const currentChartData = analyticsData?.chartData?.[chartTab] || [];

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
            { label: 'Followers', value: formatNumber(kpis.followers?.total || 0), change: kpis.followers?.change || 0, trend: (kpis.followers?.change || 0) >= 0 ? 'up' : 'down' },
            { label: 'Impressions', value: formatNumber(kpis.impressions?.total || 0), change: kpis.impressions?.change || 0, trend: (kpis.impressions?.change || 0) >= 0 ? 'up' : 'down' },
            { label: 'Engagement Rate', value: `${kpis.engagementRate?.total || 0}%`, change: kpis.engagementRate?.change || 0, trend: (kpis.engagementRate?.change || 0) >= 0 ? 'up' : 'down' },
            { label: 'Post Frequency', value: kpis.postFrequency?.total || 0, change: kpis.postFrequency?.change || 0, trend: (kpis.postFrequency?.change || 0) >= 0 ? 'up' : 'down' },
          ].map(stat => (
            <motion.div key={stat.label} variants={itemVariants}>
              <Card className="p-8 hover:shadow-2xl transition-shadow duration-500 h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-on-surface-variant/50 font-bold text-[10px] uppercase tracking-widest">{stat.label}</span>
                  <div className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1",
                    stat.trend === 'up' ? "bg-teal-50 text-teal-600" : "bg-tertiary/10 text-tertiary"
                  )}>
                    {stat.trend === 'up' ? '+' : ''}{stat.change}%
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
                    onClick={() => setChartTab(tab)}
                    className={cn(
                    "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                    chartTab === tab ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-primary"
                  )}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[400px] w-full relative">
              <svg className="w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
                {/* Dynamically drawing line chart mapped across 4 dates across 0-1000 width scale */}
                {currentChartData.length > 0 && (() => {
                  const maxVal = Math.max(...currentChartData.map((d: any) => d.value));
                  const scaledPoints = currentChartData.map((d: any, i: number) => {
                    const x = (i / (currentChartData.length - 1)) * 1000;
                    const y = 350 - ((d.value / maxVal) * 300); // 350 bottom padding
                    return `${x},${y}`;
                  }).join(' L ');
                  
                  return (
                    <motion.path 
                      key={chartTab}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.8 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      d={`M ${scaledPoints}`} 
                      fill="none" 
                      stroke="#6750a4" 
                      strokeWidth="6" 
                      strokeLinecap="round"
                    />
                  );
                })()}

              </svg>
              {currentChartData.length > 0 && (
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  {currentChartData.map((d: any, i: number) => {
                     const maxVal = Math.max(...currentChartData.map((v: any) => v.value));
                     const x = (i / (currentChartData.length - 1)) * 100;
                     const y = 350 - ((d.value / maxVal) * 300);
                     return (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1 + (i * 0.1) }}
                          className="absolute w-4 h-4 rounded-full bg-white border-4 border-primary shadow-lg pointer-events-auto shadow-black/20 group hover:scale-150 hover:z-10 transition-transform cursor-pointer"
                          style={{ left: `calc(${x}% - 8px)`, top: `${(y/400)*100}%` }}
                        >
                           <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                             {formatNumber(d.value)}
                           </div>
                        </motion.div>
                     );
                  })}
                </div>
              )}
              <div className="absolute bottom-0 w-full flex justify-between text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest">
                {currentChartData.map((d: any, i: number) => (
                  <span key={i}>{d.date}</span>
                ))}
              </div>
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
                {networkDistribution.map((item: any, idx: number) => (
                  <div key={item.platform}>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold uppercase tracking-widest text-on-surface-variant/50">{item.platform}</span>
                      <span className="text-sm font-bold">{item.percentage}% Total</span>
                    </div>
                    <div className="w-full h-6 bg-surface-container rounded-full overflow-hidden flex">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.8 + (idx * 0.2) }}
                        className={cn("h-full", item.color || "bg-primary")} 
                      />
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percentage * 0.5}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 1 + (idx * 0.2) }}
                        className={cn("h-full opacity-60", item.color || "bg-primary")} 
                      />
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percentage * 0.3}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 1.2 + (idx * 0.2) }}
                        className={cn("h-full opacity-30", item.color || "bg-primary")} 
                      />
                    </div>
                  </div>
                ))}
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
                      {audienceDna.topAgeGroup}
                    </motion.span>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-on-surface-variant/50">Primary Age</span>
                  </div>
                </div>
                <div className="flex-grow space-y-6 w-full">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 mb-4">Top Regions</p>
                  {audienceDna.regions.map((region: any, idx: number) => (
                    <motion.div 
                      key={region.name} 
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.2 + (idx * 0.1) }}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-bold">{region.name}</span>
                      <span className="text-sm font-bold text-on-surface-variant/50">{region.percentage}%</span>
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
      const res = await fetch(`${BASE_URL}/authIntegrations/${platform}/url`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        window.location.href = data.url;
      } else {
        console.error('Failed to get auth url');
        setActiveProcess(null);
      }
    } catch (err) {
      console.error(err);
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
    { id: 'twitter', name: 'Twitter/X', icon: <Twitter className="w-8 h-8" />, color: 'text-blue-500 bg-blue-100' },
    { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-8 h-8" />, color: 'text-red-600 bg-red-100' },
    { id: 'reddit', name: 'Reddit', icon: <MessageSquare className="w-8 h-8" />, color: 'text-orange-500 bg-orange-100' }
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

export default function App() {
  const [view, setView] = useState<View>('login');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appToast, setAppToast] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const integrationStatus = params.get('integration');
    if (integrationStatus) {
      if (integrationStatus === 'success') {
        setTimeout(() => window.dispatchEvent(new CustomEvent('app-toast', { detail: 'Account successfully connected!' })), 500);
        setView('integrations');
      } else if (integrationStatus === 'error') {
        setTimeout(() => window.dispatchEvent(new CustomEvent('app-toast', { detail: 'Failed to connect account.' })), 500);
      }
      window.history.replaceState({}, '', '/');
    }
  }, []);

  useEffect(() => {
    const handler = (e: any) => {
      setAppToast(e.detail);
      setTimeout(() => setAppToast(null), 3000);
    };
    window.addEventListener('app-toast', handler);
    return () => window.removeEventListener('app-toast', handler);
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const res = await fetch(`${BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const user = await res.json();
          setCurrentUser(user);
          setView('dashboard');
        } else {
          removeToken();
        }
      } catch (e) {
        removeToken();
      }
    };
    checkToken();
  }, []);

  const handleLogout = () => {
    removeToken();
    setCurrentUser(null);
    setView('login');
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {view === 'login' && <LoginView setView={setView} setCurrentUser={setCurrentUser} />}
          {view === 'register' && <RegisterView setView={setView} setCurrentUser={setCurrentUser} />}
          {view === 'dashboard' && <DashboardView setView={setView} user={currentUser} onLogout={handleLogout} openCreateModal={() => setIsCreateModalOpen(true)} />}
          {view === 'analytics' && <AnalyticsView setView={setView} user={currentUser} onLogout={handleLogout} />}
          {view === 'scheduler' && <SchedulerView setView={setView} user={currentUser} onLogout={handleLogout} openCreateModal={() => setIsCreateModalOpen(true)} />}
          {view === 'integrations' && <IntegrationsView setView={setView} user={currentUser} onLogout={handleLogout} />}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {isCreateModalOpen && (
          <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} user={currentUser} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {appToast && <Toast message={appToast} onClose={() => setAppToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
