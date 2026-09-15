'use client';

import React from 'react';
import { SensorInputs, PRESET_SCENARIOS } from '@/lib/feedCalculators';
import { Sliders, Zap, AlertTriangle, Droplets, Dna, Layers, ShieldAlert, Sparkles, RefreshCw, Activity, Plus, Minus, Tag, User, MapPin } from 'lucide-react';

interface SensorSimulatorProps {
  inputs: SensorInputs;
  setInputs: React.Dispatch<React.SetStateAction<SensorInputs>>;
  sampleMeta: { farmName: string; batchId: string; operator: string };
  setSampleMeta: React.Dispatch<React.SetStateAction<{ farmName: string; batchId: string; operator: string }>>;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  isStreaming: boolean;
}

export const SensorSimulator: React.FC<SensorSimulatorProps> = ({
  inputs,
  setInputs,
  sampleMeta,
  setSampleMeta,
  onAnalyze,
  isAnalyzing,
  isStreaming
}) => {
  const handleChange = (field: keyof SensorInputs, value: number | string) => {
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

  // Generate SVG cubic bezier path for spectral absorption wave curve
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
    <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800/80 overflow-hidden">
      
      {/* Visual Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 border-b border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-emerald-500/15 text-emerald-400 rounded-2xl border border-emerald-500/30 shadow-inner">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">NIR Spectrometry Hardware Console</h2>
                {isStreaming && (
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md animate-pulse">
                    LIVE TELEMETRY ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Optical absorption wavelength modulation & physical chemistry parameters</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              810 / 940 / 1050 nm
            </span>
          </div>
        </div>

        {/* Real-time SVG Spectrometry Graph */}
        <div className="mt-5 p-4 bg-slate-950/80 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1 text-blue-400 font-bold">
              <Droplets className="w-3.5 h-3.5" /> 810nm (H₂O: {inputs.moisture810nm}%)
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Dna className="w-3.5 h-3.5" /> 940nm (CP: {inputs.protein940nm}%)
            </span>
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Layers className="w-3.5 h-3.5" /> 1050nm (CF: {inputs.fiber1050nm}%)
            </span>
          </div>

          <div className="relative h-28 w-full bg-slate-900/90 rounded-xl overflow-hidden border border-slate-800/80">
            {/* Grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-40"></div>
            
            <svg className="w-full h-full overflow-visible" viewBox="0 0 650 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="spectrumGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#10b981" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
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
                strokeWidth="3"
              />
              {/* Peak Dots */}
              <circle cx="140" cy={p810} r="5" className="fill-blue-400 stroke-white stroke-2 animate-ping" />
              <circle cx="340" cy={p940} r="5" className="fill-emerald-400 stroke-white stroke-2 animate-ping" />
              <circle cx="540" cy={p1050} r="5" className="fill-amber-400 stroke-white stroke-2 animate-ping" />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">

        {/* Sample Metadata Form Inputs */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Audit Sample Metadata:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-[11px] text-slate-400 font-medium mb-1 block flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" /> Farm Location
              </span>
              <input
                type="text"
                value={sampleMeta.farmName}
                onChange={(e) => setSampleMeta({ ...sampleMeta, farmName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium mb-1 block flex items-center gap-1">
                <Tag className="w-3 h-3 text-emerald-400" /> Batch Serial ID
              </span>
              <input
                type="text"
                value={sampleMeta.batchId}
                onChange={(e) => setSampleMeta({ ...sampleMeta, batchId: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs font-mono font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium mb-1 block flex items-center gap-1">
                <User className="w-3 h-3 text-emerald-400" /> Lead Inspector
              </span>
              <input
                type="text"
                value={sampleMeta.operator}
                onChange={(e) => setSampleMeta({ ...sampleMeta, operator: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Preset Scenarios */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Quick Scenario Benchmarks:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {PRESET_SCENARIOS.map((scenario) => (
              <button
                key={scenario.name}
                type="button"
                onClick={() => applyPreset(scenario.inputs)}
                className="p-3 rounded-2xl border border-slate-800 bg-slate-950/80 hover:bg-slate-800/80 hover:border-emerald-500/50 transition-all text-left group flex flex-col justify-between"
              >
                <div className="font-bold text-xs text-slate-200 group-hover:text-emerald-400 line-clamp-1">
                  {scenario.name}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {scenario.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Target Crop Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Target Forage Category:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'corn_silage', label: 'Corn Silage' },
              { id: 'alfalfa_hay', label: 'Alfalfa Hay' },
              { id: 'grass_hay', label: 'Grass Hay' },
              { id: 'mixed_ration', label: 'Total Mixed Ration' },
            ].map((feed) => (
              <button
                key={feed.id}
                type="button"
                onClick={() => handleChange('feedType', feed.id)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all text-center ${
                  inputs.feedType === feed.id
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
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
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white">Moisture Spectrum</span>
                  <span className="ml-2 text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    810 nm
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => adjustValue('moisture810nm', -5, 0, 100)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-base font-black text-white font-mono min-w-[50px] text-center">
                  {inputs.moisture810nm}%
                </span>
                <button
                  type="button"
                  onClick={() => adjustValue('moisture810nm', 5, 0, 100)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={inputs.moisture810nm}
              onChange={(e) => handleChange('moisture810nm', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Slider 2: Protein Spectrum (940nm) */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <Dna className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white">Protein Spectrum</span>
                  <span className="ml-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    940 nm N-H
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => adjustValue('protein940nm', -5, 0, 100)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-base font-black text-white font-mono min-w-[50px] text-center">
                  {inputs.protein940nm}%
                </span>
                <button
                  type="button"
                  onClick={() => adjustValue('protein940nm', 5, 0, 100)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={inputs.protein940nm}
              onChange={(e) => handleChange('protein940nm', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Slider 3: Fiber Spectrum (1050nm) */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white">Fiber Spectrum</span>
                  <span className="ml-2 text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    1050 nm C-H
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => adjustValue('fiber1050nm', -5, 0, 100)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-base font-black text-white font-mono min-w-[50px] text-center">
                  {inputs.fiber1050nm}%
                </span>
                <button
                  type="button"
                  onClick={() => adjustValue('fiber1050nm', 5, 0, 100)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={inputs.fiber1050nm}
              onChange={(e) => handleChange('fiber1050nm', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Slider 4: Nitrogen Ratio Index (Urea Detection Marker) */}
          <div className={`p-4 rounded-2xl transition-all ${
            inputs.nitrogenRatioIndex > 65
              ? 'bg-rose-950/40 border-2 border-rose-500/80 shadow-lg shadow-rose-900/20'
              : 'bg-slate-950/80 border border-slate-800 hover:border-rose-500/40'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${
                  inputs.nitrogenRatioIndex > 65 ? 'bg-rose-500 text-slate-950 animate-bounce' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white">Nitrogen Ratio Index</span>
                  <span className="ml-2 text-xs font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 font-bold">
                    Urea Marker
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => adjustValue('nitrogenRatioIndex', -5, 10, 100)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-base font-black text-white font-mono min-w-[50px] text-center">
                  {inputs.nitrogenRatioIndex}
                </span>
                <button
                  type="button"
                  onClick={() => adjustValue('nitrogenRatioIndex', 5, 10, 100)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="1"
              value={inputs.nitrogenRatioIndex}
              onChange={(e) => handleChange('nitrogenRatioIndex', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-medium">
              <span>Natural Protein (10-45)</span>
              <span className="text-rose-400 font-bold">Urea Risk &gt; 65</span>
              <span className="text-rose-500 font-bold">Adulterated (65-100)</span>
            </div>
          </div>

          {/* Slider 5: Silage pH Level */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/40 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white">Silage pH Fermentation</span>
                  <span className="ml-2 text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    pH Level
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => adjustValue('silagePh', -0.1, 3.0, 6.0)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-base font-black text-white font-mono min-w-[50px] text-center">
                  {inputs.silagePh.toFixed(1)}
                </span>
                <button
                  type="button"
                  onClick={() => adjustValue('silagePh', 0.1, 3.0, 6.0)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <input
              type="range"
              min="3.0"
              max="6.0"
              step="0.1"
              value={inputs.silagePh}
              onChange={(e) => handleChange('silagePh', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

        </div>

        {/* Analyze Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] disabled:opacity-75 uppercase tracking-wide"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Running Spectrometry AI Engine...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-slate-950 text-slate-950" />
                <span>Execute Real-Time AI Quality Audit</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
