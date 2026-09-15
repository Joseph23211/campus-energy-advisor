import React from 'react';

export default function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#f6f7f5] dark:bg-void-950" />
      <div
        className="absolute inset-0 opacity-0 dark:opacity-40 transition-opacity"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-60 dark:opacity-0 transition-opacity"
        style={{
          backgroundImage:
            'linear-gradient(rgba(10,20,20,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(10,20,20,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
        }}
      />
      <div className="absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-current-teal/10 blur-[120px]" />
      <div className="absolute top-1/3 right-0 h-[420px] w-[420px] rounded-full bg-current-cyan/10 blur-[120px] animate-drift" />
    </div>
  );
}
