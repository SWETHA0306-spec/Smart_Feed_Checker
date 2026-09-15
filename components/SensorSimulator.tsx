'use client';

import React, { useState } from 'react';
import { SensorInputs, OFFICIAL_DATASET_PRESETS, LanguageCode, TRANSLATIONS } from '@/lib/feedCalculators';
import { Activity, Droplets, Dna, Layers, ShieldAlert, Sparkles, RefreshCw, Plus, Minus, Tag, User, MapPin, Camera, AlertTriangle, Flame, ShieldX } from 'lucide-react';

interface SensorSimulatorProps {
  inputs: SensorInputs;
  setInputs: React.Dispatch<React.SetStateAction<SensorInputs>>;
  sampleMeta: { farmName: string; batchId: string; operator: string };
  setSampleMeta: React.Dispatch<React.SetStateAction<{ farmName: string; batchId: string; operator: string }>>;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  isStreaming: boolean;
  currentLang: LanguageCode;
}

export const SensorSimulator: React.FC<SensorSimulatorProps> = ({
  inputs,
  setInputs,
  sampleMeta,
  setSampleMeta,
  onAnalyze,
  isAnalyzing,
  isStreaming,
  currentLang,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'nir' | 'cv'>('nir');
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const handleChange = (field: keyof SensorInputs, value: number | string | boolean) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const adjustValue = (field: keyof SensorInputs, delta: number, min: number, max: number) => {
    setInputs((prev) => {
      const current = typeof prev[field] === 'number' ? (prev[field] as number) : 0;
      const nextVal = Math.min(max, Math.max(min, Math.round((current + delta) * 10) / 10));
      return { ...prev, [field]: nextVal };
    });
  };

  const applyPreset = (presetInputs: SensorInputs) => {
    setInputs(presetInputs);
  };

  // SVG Spectrum Waveform calculation
  const m = inputs.moisture810nm;
  const p = inputs.protein940nm;
  const f = inputs.fiber1050nm;

  const yBase = 120;
  const p810 = yBase - (m * 0.9);
  const p940 = yBase - (p * 0.9);
  const p1050 = yBase - (f * 0.9);

  const wavePath = `M 10 130 
    C 60 130, 90 ${p810}, 140 ${p810} 
    S 200 130, 240 130 
    S 290 ${p940}, 340 ${p940} 
    S 400 130, 440 130 
    S 490 ${p1050}, 540 ${p1050} 
    C 580 ${p1050}, 610 130, 640 130 L 640 150 L 10 150 Z`;

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800/80 overflow-hidden">
      
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 border-b border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-emerald-500/15 text-emerald-400 rounded-2xl border border-emerald-500/30 shadow-inner">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">NIR & CV Telemetry Console</h2>
                {isStreaming && (
                  <span className="text-[10px] font-mono font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md animate-pulse">
                    LIVE TELEMETRY
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Spectrometry absorption bands & computer vision texture scanner</p>
            </div>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveSubTab('nir')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeSubTab === 'nir' ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              NIR Spectrum
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('cv')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeSubTab === 'cv' ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              CV Scanner
            </button>
          </div>
        </div>

        {/* Real-time SVG Spectrometry Graph */}
        {activeSubTab === 'nir' && (
          <div className="mt-5 p-4 bg-slate-950/90 rounded-2xl border border-slate-800/90 relative overflow-hidden">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 text-blue-400 font-bold">
                <Droplets className="w-3.5 h-3.5" /> 810nm ({inputs.moisture810nm}%)
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Dna className="w-3.5 h-3.5" /> 940nm ({inputs.protein940nm}%)
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Layers className="w-3.5 h-3.5" /> 1050nm ({inputs.fiber1050nm}%)
              </span>
            </div>

            <div className="relative h-28 w-full bg-slate-900/90 rounded-xl overflow-hidden border border-slate-800/80">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-40"></div>
              
              <svg className="w-full h-full overflow-visible" viewBox="0 0 650 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="spectrumGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                    <stop offset="50%" stopColor="#10b981" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.45" />
                  </linearGradient>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="50%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>
                <path d={wavePath} fill="url(#spectrumGradient)" />
                <path
                  d={`M 10 130 C 60 130, 90 ${p810}, 140 ${p810} S 200 130, 240 130 S 290 ${p940}, 340 ${p940} S 400 130, 440 130 S 490 ${p1050}, 540 ${p1050} C 580 ${p1050}, 610 130, 640 130`}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="3.5"
                />
                <circle cx="140" cy={p810} r="5" className="fill-blue-400 stroke-white stroke-2 animate-ping" />
                <circle cx="340" cy={p940} r="5" className="fill-emerald-400 stroke-white stroke-2 animate-ping" />
                <circle cx="540" cy={p1050} r="5" className="fill-amber-400 stroke-white stroke-2 animate-ping" />
              </svg>
            </div>
          </div>
        )}

        {/* Computer Vision Simulated Camera Scan */}
        {activeSubTab === 'cv' && (
          <div className="mt-5 p-4 bg-slate-950/90 rounded-2xl border border-slate-800 text-center">
            <div className="relative h-28 w-full rounded-xl bg-slate-900 border-2 border-dashed border-emerald-500/40 flex flex-col items-center justify-center p-3">
              <Camera className="w-8 h-8 text-emerald-400 animate-bounce mb-1" />
              <span className="text-xs font-mono font-bold text-white">Smartphone Visual Texture Analysis Active</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Detecting mould spots, discoloration & sand particles via AI Edge Model</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">

        {/* Official Problem Statement Dataset Presets (F001 - F005) */}
        <div>
          <label className="block text-xs font-black text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Official Problem Statement Presets (PDF Data Set):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            {OFFICIAL_DATASET_PRESETS.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                onClick={() => applyPreset(scenario.inputs)}
                className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                  inputs.feedType === scenario.inputs.feedType && inputs.aflatoxinPpb === scenario.inputs.aflatoxinPpb
                    ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-lg glow-emerald'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="font-mono font-bold text-xs text-white">
                  {scenario.id}
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-medium">
                  {scenario.feedTypeLabel}
                </div>
                <span className={`mt-2 text-[9px] font-black px-2 py-0.5 rounded-full text-center uppercase ${
                  scenario.expectedStatus === 'Good'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : scenario.expectedStatus === 'Moderate'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {scenario.expectedStatus}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Target Forage Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Target Feed Category:
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              { id: 'pellet', label: 'Cattle Pellet' },
              { id: 'silage', label: 'Silage' },
              { id: 'mineral_mixture', label: 'Mineral Mix' },
              { id: 'feed_mash', label: 'Feed Mash' },
              { id: 'alfalfa_hay', label: 'Alfalfa Hay' },
              { id: 'mixed_ration', label: 'Mixed Ration' },
            ].map((feed) => (
              <button
                key={feed.id}
                type="button"
                onClick={() => handleChange('feedType', feed.id as any)}
                className={`py-2 px-2 rounded-xl border text-[11px] font-bold transition-all text-center ${
                  inputs.feedType === feed.id
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 border-emerald-400 text-slate-950 font-black shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {feed.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="space-y-4 pt-1">
          
          {/* Slider 1: Moisture Spectrum (810nm) */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-blue-500/40 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-white">Moisture Content (810nm)</span>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => adjustValue('moisture810nm', -5, 0, 100)} className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-black text-white font-mono min-w-[45px] text-center">
                  {inputs.moisture810nm}%
                </span>
                <button type="button" onClick={() => adjustValue('moisture810nm', 5, 0, 100)} className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={inputs.moisture810nm}
              onChange={(e) => handleChange('moisture810nm', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Slider 2: Aflatoxins & Mycotoxins (ppb) */}
          <div className={`p-4 rounded-2xl border transition-all ${
            inputs.aflatoxinPpb >= 18 ? 'bg-rose-950/40 border-rose-500/80 glow-rose' : 'bg-slate-950/80 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold text-white">Aflatoxins & Mycotoxins</span>
                <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 font-bold">
                  ppb Marker
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => adjustValue('aflatoxinPpb', -2, 0, 50)} className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-black text-white font-mono min-w-[45px] text-center">
                  {inputs.aflatoxinPpb} ppb
                </span>
                <button type="button" onClick={() => adjustValue('aflatoxinPpb', 2, 0, 50)} className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={inputs.aflatoxinPpb}
              onChange={(e) => handleChange('aflatoxinPpb', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
              <span>0 ppb (Safe)</span>
              <span className="text-rose-400 font-bold">Unsafe Limit &gt; 18 ppb</span>
              <span>50 ppb (Severe)</span>
            </div>
          </div>

          {/* Slider 3: Sand / Silica Contamination (%) */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShieldX className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">Sand / Silica Contamination</span>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => adjustValue('sandSilicaRatio', -2, 0, 30)} className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-black text-white font-mono min-w-[45px] text-center">
                  {inputs.sandSilicaRatio}%
                </span>
                <button type="button" onClick={() => adjustValue('sandSilicaRatio', 2, 0, 30)} className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={inputs.sandSilicaRatio}
              onChange={(e) => handleChange('sandSilicaRatio', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Slider 4: Excess Salt Level (%) */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white">Salt Ratio (Adulterant Detector)</span>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => adjustValue('saltRatio', -1, 0, 20)} className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-black text-white font-mono min-w-[45px] text-center">
                  {inputs.saltRatio}%
                </span>
                <button type="button" onClick={() => adjustValue('saltRatio', 1, 0, 20)} className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={inputs.saltRatio}
              onChange={(e) => handleChange('saltRatio', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Mould Presence Toggle */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-white">Mould / Fungal Spore Presence:</span>
            <button
              type="button"
              onClick={() => handleChange('mouldPresence', !inputs.mouldPresence)}
              className={`px-4 py-1.5 rounded-xl font-black text-xs transition-all ${
                inputs.mouldPresence
                  ? 'bg-rose-500 text-slate-950 font-black shadow-md glow-rose'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {inputs.mouldPresence ? 'MOULD DETECTED' : 'CLEAR / NONE'}
            </button>
          </div>

        </div>

        {/* Analyze Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] disabled:opacity-75 uppercase tracking-wider font-sans glow-emerald"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Running AI Spectrometry Engine...</span>
              </>
            ) : (
              <>
                <Activity className="w-5 h-5 fill-slate-950 text-slate-950 stroke-[2.5]" />
                <span>{t.runAudit}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
