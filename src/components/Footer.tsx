import React from 'react';

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

export { Footer };
