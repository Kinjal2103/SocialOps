import React from 'react';
import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';

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

export { Toast };
