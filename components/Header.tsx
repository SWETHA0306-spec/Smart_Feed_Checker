'use client';

import React from 'react';
import { Sprout, Activity, Wifi, ShieldCheck, Sparkles } from 'lucide-react';

interface HeaderProps {
  sampleCount: number;
}

export const Header: React.FC<HeaderProps> = ({ sampleCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-agri-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          
          {/* Logo & Main Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agri-500 to-agri-700 flex items-center justify-center text-white shadow-md shadow-agri-500/20">
              <Sprout className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">SmartFeed AI</h1>
                <span className="text-xs bg-agri-100 text-agri-800 font-semibold px-2.5 py-0.5 rounded-full border border-agri-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-agri-600" />
                  NIR Spectrometer v2.4
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Rapid NIR Feed & Silage Quality Testing System <span className="text-slate-400">| ID 26111</span>
              </p>
            </div>
          </div>

          {/* Status Badges & Metrics */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-xs">
            {/* Live Sensor Connection Status */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Activity className="w-3.5 h-3.5" />
              <span>NIR Sensor Ready</span>
            </div>

            {/* Offline PWA Ready Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium">
              <Wifi className="w-3.5 h-3.5 text-slate-500" />
              <span>Field Offline Ready</span>
            </div>

            {/* Verified Cert Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>{sampleCount} Tests Certified</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
