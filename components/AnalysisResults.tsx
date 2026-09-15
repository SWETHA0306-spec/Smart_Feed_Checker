'use client';

import React from 'react';
import { AnalysisResults as ResultsType, LanguageCode, TRANSLATIONS } from '@/lib/feedCalculators';
import { AlertTriangle, CheckCircle2, AlertOctagon, Info, Save, Award, Activity, Droplets, Dna, Layers, Zap, Flame, ShieldAlert } from 'lucide-react';

interface AnalysisResultsProps {
  results: ResultsType;
  onSaveToHistory: () => void;
  isSaved: boolean;
  currentLang: LanguageCode;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  results,
  onSaveToHistory,
  isSaved,
  currentLang,
}) => {
  const {
    crudeProtein,
    moisture,
    crudeFiber,
    energyTdn,
    energyNel,
    aflatoxinPpb,
    adulterationDetected,
    isUreaAdulterated,
    isSandContaminated,
    isExcessSalt,
    isMouldPresent,
    isAflatoxinUnsafe,
    silageGrade,
    silagePhStatusColor,
    overallScore,
    qualityStatus,
    qualityRating,
    advisories,
  } = results;

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const statusColors = {
    Good: 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-emerald-500/30 glow-emerald',
    Moderate: 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/30',
    Poor: 'bg-rose-500 text-white border-rose-400 shadow-rose-500/30',
    Unsafe: 'bg-red-600 text-white border-red-500 shadow-red-600/30 animate-pulse glow-rose',
  };

  return (
    <div className="space-y-6">
      
      {/* Critical Hazard Alert Module */}
      {(isAflatoxinUnsafe || isUreaAdulterated || isSandContaminated) && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950 via-red-900 to-rose-950 text-white shadow-2xl border-2 border-rose-500/80 glow-rose">
          <div className="flex items-start gap-4">
            <div className="p-3.5 bg-rose-500 text-slate-950 rounded-2xl shadow-lg">
              <ShieldAlert className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black uppercase tracking-wider text-rose-200">
                  HAZARD DETECTED: {qualityStatus.toUpperCase()} FEED
                </h3>
                <span className="px-3 py-1 bg-rose-500 text-slate-950 font-black text-xs rounded-full uppercase font-mono">
                  PS ID 26111 ALERT
                </span>
              </div>
              <p className="text-xs text-rose-100 mt-1.5 leading-relaxed font-medium">
                Detected: <strong>{adulterationDetected.join(', ')}</strong>. Urgent nutritional adjustment required.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Score & Quality Status Panel */}
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-800/80">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
          
          <div className="flex items-center gap-5">
            <div className="relative w-24 h-24 flex items-center justify-center bg-slate-950 rounded-3xl border border-slate-800 shadow-inner">
              <div className="text-center">
                <span className="text-3xl font-black text-white font-mono leading-none">{overallScore}</span>
                <span className="text-[10px] font-bold text-slate-400 block mt-0.5">/ 100</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black text-white">{t.qualityStatus}</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">NIR Spectrometry & Contamination Index</p>
              
              <div className="mt-2.5 flex items-center gap-2">
                <span className={`px-4 py-1.5 rounded-xl text-xs font-black border shadow-md font-mono ${statusColors[qualityStatus]}`}>
                  STATUS: {qualityStatus.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3.5 py-2 rounded-2xl border border-slate-800 block">
              Grade: <strong className="text-emerald-400 text-base">{qualityRating}</strong>
            </span>
          </div>

        </div>

        {/* Adulteration Chips Row */}
        <div className="pt-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            {t.adulteration}:
          </span>
          <div className="flex flex-wrap gap-2">
            {adulterationDetected.map((adj, i) => (
              <span
                key={i}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold border font-mono ${
                  adj === 'None'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                }`}
              >
                {adj}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Extended Nutritional Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        
        {/* Crude Protein */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Crude Protein</span>
          <div className="mt-2 text-2xl font-black text-white font-mono">
            {typeof crudeProtein === 'number' ? `${crudeProtein}%` : 'NA'}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">940nm Wavelength</span>
        </div>

        {/* Moisture */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Moisture Content</span>
          <div className="mt-2 text-2xl font-black text-blue-400 font-mono">
            {moisture}%
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">810nm Water Band</span>
        </div>

        {/* Crude Fiber */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Crude Fiber</span>
          <div className="mt-2 text-2xl font-black text-amber-400 font-mono">
            {typeof crudeFiber === 'number' ? `${crudeFiber}%` : 'NA'}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">1050nm C-H Band</span>
        </div>

        {/* Energy Value TDN */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Energy (TDN)</span>
          <div className="mt-2 text-2xl font-black text-emerald-400 font-mono">
            {typeof energyTdn === 'number' ? `${energyTdn}%` : 'NA'}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {typeof energyNel === 'number' ? `NEL: ${energyNel} Mcal/kg` : 'Digestible Energy'}
          </span>
        </div>

      </div>

      {/* Aflatoxins & Mycotoxins Module */}
      <div className="bg-slate-900/80 rounded-3xl p-5 border border-slate-800/80 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${isAflatoxinUnsafe ? 'bg-rose-500 text-slate-950 glow-rose' : 'bg-slate-800 text-slate-400'}`}>
            <Flame className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Aflatoxins & Mycotoxin Level</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Threshold: &lt;18 ppb for dairy cattle milk safety</p>
          </div>
        </div>

        <div className="text-right font-mono">
          <span className={`text-2xl font-black ${isAflatoxinUnsafe ? 'text-rose-400' : 'text-emerald-400'}`}>
            {aflatoxinPpb} ppb
          </span>
          <span className={`text-[10px] block font-black uppercase ${isAflatoxinUnsafe ? 'text-rose-400' : 'text-slate-500'}`}>
            {isAflatoxinUnsafe ? 'UNSAFE TOXIN' : 'SAFE LIMIT'}
          </span>
        </div>
      </div>

      {/* Categorized AI Farmer Advisories */}
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-800/80">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-black text-white">Actionable AI Farmer Advisories</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Multilingual Rules</span>
        </div>

        <div className="mt-4 space-y-3">
          {advisories.map((advisory, idx) => {
            const isCritical = advisory.category === 'CRITICAL';
            const isWarning = advisory.category === 'WARNING';
            const isOptimal = advisory.category === 'OPTIMAL';

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                  isCritical
                    ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                    : isWarning
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                    : isOptimal
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <div className="mt-0.5">
                  {isCritical && <AlertOctagon className="w-5 h-5 text-rose-400 flex-shrink-0" />}
                  {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />}
                  {isOptimal && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
                  {!isCritical && !isWarning && !isOptimal && <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />}
                </div>

                <div className="flex-1">
                  <h4 className="text-xs font-black uppercase tracking-wider mb-1">
                    {advisory.title}
                  </h4>
                  <p className="text-xs leading-relaxed font-medium">
                    {advisory.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Certify Button */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <button
            type="button"
            onClick={onSaveToHistory}
            disabled={isSaved}
            className={`w-full py-4 px-5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-xl font-sans ${
              isSaved
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80 cursor-default'
                : 'bg-white hover:bg-slate-100 text-slate-950 shadow-white/10'
            }`}
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Test Certified & Saved to History Log</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-emerald-600" />
                <span>{t.certify}</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
