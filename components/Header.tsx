'use client';

import React from 'react';
import { Sprout, Radio, ShieldCheck, Sparkles, Cpu, Play, Square } from 'lucide-react';

interface HeaderProps {
  sampleCount: number;
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean | ((prev: boolean) => boolean)) => void;
}

export const Header: React.FC<HeaderProps> = ({ sampleCount, isStreaming, setIsStreaming }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          
          {/* Logo & Main Title */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/25">
                <Sprout className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-black text-white tracking-tight font-sans">
                  SmartFeed <span className="text-emerald-400">AI</span>
                </h1>
                <span className="text-[10px] font-mono font-bold bg-slate-800/90 text-emerald-300 border border-slate-700/80 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-inner">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  NIR SPECTRAL v3.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Rapid Optical Feed & Silage Testing System <span className="text-slate-600">| ID 26111</span>
              </p>
            </div>
          </div>

          {/* Live Controls & Status Badges */}
          <div className="flex items-center flex-wrap gap-2.5 text-xs">
            
            {/* Live Streaming Toggle Button */}
            <button
              type="button"
              onClick={() => setIsStreaming((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl font-bold font-mono transition-all flex items-center gap-1.5 border shadow-md ${
                isStreaming
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
              }`}
            >
              {isStreaming ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-rose-400 text-rose-400 animate-pulse" />
                  <span>STOP LIVE TELEMETRY</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                  <span>START LIVE TELEMETRY</span>
                </>
              )}
            </button>

            {/* Hardware Status */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 font-mono text-[11px]">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>NIR Optic: <strong className="text-white">ONLINE</strong></span>
            </div>

            {/* Certified Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{sampleCount} Audits Verified</span>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
