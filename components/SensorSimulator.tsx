'use client';

import React from 'react';
import { SensorInputs, PRESET_SCENARIOS } from '@/lib/feedCalculators';
import { Sliders, Zap, AlertTriangle, Droplets, Dna, Layers, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

interface SensorSimulatorProps {
  inputs: SensorInputs;
  setInputs: React.Dispatch<React.SetStateAction<SensorInputs>>;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const SensorSimulator: React.FC<SensorSimulatorProps> = ({
  inputs,
  setInputs,
  onAnalyze,
  isAnalyzing
}) => {
  const handleChange = (field: keyof SensorInputs, value: number | string) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyPreset = (presetInputs: SensorInputs) => {
    setInputs(presetInputs);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-agri-500/20 text-agri-400 rounded-xl border border-agri-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">NIR Spectral Sensor Simulator</h2>
              <p className="text-xs text-slate-400">Simulate hardware optical reflection spectra and physical chemistry markers</p>
            </div>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-agri-500/20 border border-agri-500/40 rounded-full text-xs font-semibold text-agri-300">
            <Sparkles className="w-3.5 h-3.5" />
            Real-time Reactivity
          </span>
        </div>
      </div>

      <div className="p-5 space-y-6">
        
        {/* Preset Scenarios Buttons */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            Quick Scenario Presets:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_SCENARIOS.map((scenario) => (
              <button
                key={scenario.name}
                type="button"
                onClick={() => applyPreset(scenario.inputs)}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-agri-50 hover:border-agri-300 transition-all text-left group flex flex-col justify-between"
              >
                <div className="font-semibold text-xs text-slate-800 group-hover:text-agri-800 line-clamp-1">
                  {scenario.name}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                  {scenario.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Feed Sample Type Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Target Feed Crop Type:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'corn_silage', label: 'Corn Silage' },
              { id: 'alfalfa_hay', label: 'Alfalfa Hay' },
              { id: 'grass_hay', label: 'Grass Hay' },
              { id: 'mixed_ration', label: 'Total Mixed Ration (TMR)' },
            ].map((feed) => (
              <button
                key={feed.id}
                type="button"
                onClick={() => handleChange('feedType', feed.id)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all text-center ${
                  inputs.feedType === feed.id
                    ? 'bg-agri-600 border-agri-600 text-white shadow-md shadow-agri-600/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {feed.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="space-y-5 pt-2">
          
          {/* Slider 1: Moisture Spectrum (810nm) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900">Moisture Spectrum</span>
                  <span className="ml-2 text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    810 nm Band
                  </span>
                </div>
              </div>
              <span className="text-base font-extrabold text-slate-900 font-mono">
                {inputs.moisture810nm} <span className="text-xs font-normal text-slate-500">% Intensity</span>
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={inputs.moisture810nm}
              onChange={(e) => handleChange('moisture810nm', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1.5 font-medium">
              <span>Dry (0% Reflection)</span>
              <span>Optimal Silage (60-75%)</span>
              <span>High Moisture (100%)</span>
            </div>
          </div>

          {/* Slider 2: Protein Spectrum (940nm) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                  <Dna className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900">Protein Spectrum</span>
                  <span className="ml-2 text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    940 nm N-H Band
                  </span>
                </div>
              </div>
              <span className="text-base font-extrabold text-slate-900 font-mono">
                {inputs.protein940nm} <span className="text-xs font-normal text-slate-500">% Intensity</span>
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={inputs.protein940nm}
              onChange={(e) => handleChange('protein940nm', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1.5 font-medium">
              <span>Low Protein (&lt;10%)</span>
              <span>Balanced (40-60%)</span>
              <span>High Legume Protein (80%+)</span>
            </div>
          </div>

          {/* Slider 3: Fiber Spectrum (1050nm) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900">Fiber Spectrum</span>
                  <span className="ml-2 text-xs font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    1050 nm C-H Band
                  </span>
                </div>
              </div>
              <span className="text-base font-extrabold text-slate-900 font-mono">
                {inputs.fiber1050nm} <span className="text-xs font-normal text-slate-500">% Intensity</span>
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={inputs.fiber1050nm}
              onChange={(e) => handleChange('fiber1050nm', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1.5 font-medium">
              <span>Tender (Low Fiber)</span>
              <span>Medium Fiber (30-50%)</span>
              <span>Coarse Stalk (High Fiber)</span>
            </div>
          </div>

          {/* Slider 4: Nitrogen Ratio Index (Urea Detection Marker) */}
          <div className={`p-4 rounded-xl transition-colors ${
            inputs.nitrogenRatioIndex > 65
              ? 'bg-rose-50 border-2 border-rose-400'
              : 'bg-slate-50 border border-slate-200 hover:border-rose-300'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${
                  inputs.nitrogenRatioIndex > 65 ? 'bg-rose-200 text-rose-800 animate-bounce' : 'bg-rose-100 text-rose-700'
                }`}>
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900">Nitrogen Ratio Index</span>
                  <span className="ml-2 text-xs font-mono text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-semibold">
                    Urea Detector
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {inputs.nitrogenRatioIndex > 65 && (
                  <span className="text-[10px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    UREA ALERT
                  </span>
                )}
                <span className="text-base font-extrabold text-slate-900 font-mono">
                  {inputs.nitrogenRatioIndex} <span className="text-xs font-normal text-slate-500">/ 100</span>
                </span>
              </div>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="1"
              value={inputs.nitrogenRatioIndex}
              onChange={(e) => handleChange('nitrogenRatioIndex', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1.5 font-medium">
              <span>Natural Protein (10-45)</span>
              <span className="text-rose-600 font-bold">Critical Threshold: 65</span>
              <span className="text-rose-700 font-bold">Synthetic Urea (65-100)</span>
            </div>
          </div>

          {/* Slider 5: Silage pH Level */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900">Silage pH Level</span>
                  <span className="ml-2 text-xs font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    Fermentation Index
                  </span>
                </div>
              </div>
              <span className="text-base font-extrabold text-slate-900 font-mono">
                {inputs.silagePh.toFixed(1)} <span className="text-xs font-normal text-slate-500">pH</span>
              </span>
            </div>
            <input
              type="range"
              min="3.0"
              max="6.0"
              step="0.1"
              value={inputs.silagePh}
              onChange={(e) => handleChange('silagePh', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1.5 font-medium">
              <span className="text-rose-600">&lt;3.8 (Acidic Risk)</span>
              <span className="text-emerald-600 font-bold">3.8 - 4.2 (Excellent)</span>
              <span className="text-amber-600">4.3 - 4.8 (Fair)</span>
              <span className="text-rose-600 font-bold">&gt;4.8 (Spoiled)</span>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-agri-600 to-agri-700 hover:from-agri-500 hover:to-agri-600 text-white font-bold text-base shadow-lg shadow-agri-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-75"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Processing Spectrum Data...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-white text-white" />
                <span>Run Real-Time AI Analysis Scan</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
