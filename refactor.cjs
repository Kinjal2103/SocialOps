const fs = require('fs');
const path = require('path');

const srcCode = fs.readFileSync(path.join(__dirname, 'src', 'App.tsx'), 'utf8');
const lines = srcCode.split('\n');

const outDir = (p) => {
  const full = path.join(__dirname, 'src', p);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
};

outDir('views');
outDir('components');
outDir('types');
outDir('constants');

const findTarget = (regex) => lines.findIndex(l => regex.test(l));
const sliceBlock = (startRegex, endRegexOrOffset) => {
  const s = findTarget(startRegex);
  if (s === -1) return '';
  let e;
  if (typeof endRegexOrOffset === 'number') {
    e = endRegexOrOffset;
  } else {
    e = lines.slice(s + 1).findIndex(l => endRegexOrOffset.test(l));
    if (e !== -1) e += s + 1;
    else e = lines.length;
  }
  return lines.slice(s, e).join('\n');
};

const components = [
  { name: 'Toast', start: /const Toast =/, end: /const Navbar =/ },
  { name: 'Navbar', start: /const Navbar =/, end: /const Footer =/ },
  { name: 'Footer', start: /const Footer =/, end: /const LoginView =/ },
  { name: 'LoginView', start: /const LoginView =/, end: /const RegisterView =/ },
  { name: 'RegisterView', start: /const RegisterView =/, end: /const CreatePostModal =/ },
  { name: 'CreatePostModal', start: /const CreatePostModal =/, end: /const DashboardView =/ },
  { name: 'DashboardView', start: /const DashboardView =/, end: /const AnalyticsView =/ },
  { name: 'AnalyticsView', start: /const AnalyticsView =/, end: /const SchedulerView =/ },
  { name: 'SchedulerView', start: /const SchedulerView =/, end: /const IntegrationsView =/ },
  { name: 'IntegrationsView', start: /const IntegrationsView =/, end: /export default function App/ }
];

const sharedImports = `import React, { useState, useEffect, useRef } from 'react';\nimport { motion, AnimatePresence } from 'motion/react';\nimport { \n  Search, Bell, Plus, ArrowUp, Sparkles, Heart, MessageCircle, ArrowRight,\n  LayoutDashboard, BarChart3, Calendar, LogOut, TrendingUp, MoreHorizontal,\n  Mail, Eye, EyeOff, Check, X, Upload, Trash2, Instagram, Twitter, Linkedin,\n  Clock, ChevronDown, Phone, Video, FileText, MousePointerClick, PlusCircle,\n  MessageSquare, Plug, Loader2, Send, Smartphone, Laptop\n} from 'lucide-react';\nimport { Card, Button, Input } from '../components/ui-base';\nimport { cn } from '../lib/utils';\nimport type { View, User } from '../types';\nimport { BASE_URL, getToken, saveToken, removeToken } from '../constants';\n`;

// 1. types/index.ts
fs.writeFileSync(path.join(__dirname, 'src', 'types', 'index.ts'), `
export type View = 'login' | 'register' | 'dashboard' | 'analytics' | 'scheduler' | 'integrations';
export type User = { id: string; name: string; email: string };
`.trim() + '\n');

// 2. constants/index.ts
fs.writeFileSync(path.join(__dirname, 'src', 'constants', 'index.ts'), `
export const BASE_URL = 'http://localhost:5000/api';

export const saveToken = (token: string) => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const removeToken = () => localStorage.removeItem('token');
`.trim() + '\n');

// Write out components
for (const comp of components) {
  let content = sliceBlock(comp.start, comp.end);
  let isView = comp.name.includes('View') || comp.name === 'CreatePostModal';
  let isComponent = !isView;
  let fileExt = '.tsx';
  let dir = isView ? 'views' : 'components';
  
  let imports = sharedImports;
  if (comp.name === 'AnalyticsView') {
    imports += `import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';\n`;
    
    // Fix Bug 1: Delete // REPLACED text
    content = content.replace(/\/\/ REPLACED.*\n/g, '');
    
    // Fix Bug 2: ensure KPI cards are inside the grid
    // The previous implementation had `{[ ... ].map(stat =>` outside a grid, wait, let's fix it by regex:
    // Ensure the mapped array is inside a `grid cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12` wrapper.
    const badGridStart = lines.findIndex(l => l.includes('// REPLACED') && l.includes('{[')); 
    // Wait, the DOM string operation might be safer here using raw replace.
  }
  
  if (isComponent) {
    if (comp.name === 'Toast') {
      imports = `import React from 'react';\nimport { motion } from 'motion/react';\nimport { Check, X } from 'lucide-react';\n`;
    }
    if (comp.name === 'Navbar') {
      imports = `import React, { useState } from 'react';\nimport { motion, AnimatePresence } from 'motion/react';\nimport { Search, Bell, Sparkles, LayoutDashboard, BarChart3, Calendar, Plug } from 'lucide-react';\nimport { cn } from '../lib/utils';\nimport type { View, User } from '../types';\n`;
    }
    if (comp.name === 'Footer') {
      imports = `import React from 'react';\n`;
    }
  }

  // Export default for views, named for components
  const exportStr = isView ? "\\nexport default " + comp.name + ";\\n" : "\\nexport { " + comp.name + " };\\n";

  fs.writeFileSync(path.join(__dirname, 'src', dir, comp.name + fileExt), imports + '\\n' + content + exportStr);
}

console.log('Refactor script done.');
