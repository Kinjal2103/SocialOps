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

export default CreatePostModal;
