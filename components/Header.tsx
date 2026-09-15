'use client';

import React from 'react';
import { Sprout, Radio, ShieldCheck, Sparkles, Globe, Play, Square, Cpu } from 'lucide-react';
import { LANGUAGES, LanguageCode } from '@/lib/feedCalculators';

interface HeaderProps {
  sampleCount: number;
  isStreaming: boolean;
  setIsStreaming: React.Dispatch<React.SetStateAction<boolean>>;
  currentLang: LanguageCode;
  setCurrentLang: React.Dispatch<React.SetStateAction<LanguageCode>>;
}

export const Header: React.FC<HeaderProps> = ({
  sampleCount,
  isStreaming,
  setIsStreaming,
  currentLang,
  setCurrentLang,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#080c14]/90 backdrop-blur-2xl border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/25">
                <Sprout className="w-7 h-7 stroke-[2.5]" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black text-white tracking-tight font-sans">
                  SmartFeed <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">AI</span>
                </h1>
                <span className="text-[10px] font-mono font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-inner">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  PROBLEM STATEMENT 3
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Rapid AI Feed & Silage Quality System <span className="text-slate-500">| ID 26111</span>
              </p>
            </div>
          </div>

          {/* Controls & Multilingual Toolbar */}
          <div className="flex items-center flex-wrap gap-3 text-xs">
            
            {/* Multilingual Selector */}
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-2xl px-3 py-1.5 text-slate-200 shadow-md">
              <Globe className="w-4 h-4 text-emerald-400" />
              <select
                value={currentLang}
                onChange={(e) => setCurrentLang(e.target.value as LanguageCode)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-white font-sans">
                    {lang.native} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Live Streaming Toggle */}
            <button
              type="button"
              onClick={() => setIsStreaming((prev) => !prev)}
              className={`px-4 py-2 rounded-2xl font-bold font-mono transition-all flex items-center gap-2 border shadow-lg ${
                isStreaming
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30 glow-rose'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25 glow-emerald'
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
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/80 text-slate-300 border border-slate-800 font-mono text-[11px]">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>NIR Optic: <strong className="text-emerald-400">READY</strong></span>
            </div>

            {/* Audit Counter */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 font-semibold text-[11px] shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{sampleCount} Certified Audits</span>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
