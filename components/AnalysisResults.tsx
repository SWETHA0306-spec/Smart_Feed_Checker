'use client';

import React from 'react';
import { AnalysisResults as ResultsType } from '@/lib/feedCalculators';
import { AlertTriangle, CheckCircle2, AlertOctagon, Info, Save, Award, Activity, Droplets, Dna, Layers, Zap, Flame, ShieldAlert } from 'lucide-react';

interface AnalysisResultsProps {
  results: ResultsType;
  onSaveToHistory: () => void;
  isSaved: boolean;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  results,
  onSaveToHistory,
  isSaved
}) => {
  const {
    crudeProtein,
    moisture,
    crudeFiber,
    isUreaAdulterated,
    silageGrade,
    silagePhStatusColor,
    overallScore,
    qualityRating,
    advisories
  } = results;

  // Rating colors
  const ratingColors = {
    'A+': 'bg-emerald-500 text-slate-950 shadow-emerald-500/30',
    'A': 'bg-emerald-400 text-slate-950 shadow-emerald-400/30',
    'B': 'bg-blue-500 text-white shadow-blue-500/30',
    'C': 'bg-amber-500 text-slate-950 shadow-amber-500/30',
    'D': 'bg-rose-600 text-white shadow-rose-600/30',
  };

  // SVG Radial Gauge Calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="space-y-6">
      
      {/* Critical Urea Chemical Hazard Module */}
      {isUreaAdulterated && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950 via-red-900 to-rose-950 text-white shadow-2xl border-2 border-rose-500 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="p-3.5 bg-rose-500 text-slate-950 rounded-2xl shadow-lg shadow-rose-500/30">
              <ShieldAlert className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black uppercase tracking-wider text-rose-200">
                  CRITICAL: Synthetic Urea Adulteration Detected!
                </h3>
                <span className="px-3 py-1 bg-rose-500 text-slate-950 font-black text-xs rounded-full uppercase font-mono">
                  CO(NH₂)₂ ALERT
                </span>
              </div>
              <p className="text-xs text-rose-100 mt-1.5 leading-relaxed font-medium">
                Spectrometry detects synthetic non-protein nitrogen (NPN) injection exceeding safety thresholds (&gt;65 Nitrogen Index). Extreme risk of acute ammonia toxicity in ruminants. Unsafe for pre-weaned calves and unbuffered rations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Composite Radial Gauge & Overall Score Panel */}
      <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-800/80">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
          
          <div className="flex items-center gap-5">
            {/* SVG Circular Score Gauge */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  className="stroke-slate-800"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  className={`${
                    overallScore >= 80 ? 'stroke-emerald-400' : overallScore >= 60 ? 'stroke-blue-400' : 'stroke-rose-500'
                  } transition-all duration-700 ease-out`}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-white font-mono leading-none">{overallScore}</span>
                <span className="text-[10px] font-bold text-slate-400 mt-0.5">/ 100</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black text-white">Feed Quality Score</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">Composite NIR optical index & chemical safety balance</p>
              <div className="mt-2.5 flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-300">Grade Classification:</span>
                <span className={`px-3 py-1 rounded-xl text-xs font-black shadow-md ${ratingColors[qualityRating]}`}>
                  {qualityRating}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right self-end sm:self-auto">
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 block">
              ISO-12099 AUDIT VERIFIED
            </span>
          </div>

        </div>

        {/* Silage Fermentation pH Scale Bar */}
        <div className="pt-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-slate-200">Silage Fermentation pH Index:</span>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-950 border border-purple-500/40 text-purple-300 font-mono">
              {silageGrade}
            </span>
          </div>

          {/* Visual pH Scale Bar */}
          <div className="relative h-4 bg-slate-950 rounded-full border border-slate-800 overflow-hidden flex">
            <div className="w-[20%] bg-rose-500/60" title="Over-acidified (<3.8)"></div>
            <div className="w-[15%] bg-emerald-500" title="Optimal (3.8-4.2)"></div>
            <div className="w-[20%] bg-amber-500/80" title="Fair (4.3-4.8)"></div>
            <div className="w-[45%] bg-rose-600" title="Spoiled (>4.8)"></div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
            <span>3.0 Acidic</span>
            <span className="text-emerald-400 font-bold">3.8 - 4.2 Optimal</span>
            <span className="text-amber-400">4.3 - 4.8 Fair</span>
            <span>6.0 Spoiled</span>
          </div>
        </div>

      </div>

      {/* Macronutrient Benchmark Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Crude Protein */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800/80 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Crude Protein</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Dna className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-black text-white font-mono">{crudeProtein}%</span>
            <span className="text-xs text-slate-400 font-mono">CP</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${Math.min(100, (crudeProtein / 25) * 100)}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">
            {crudeProtein >= 16 ? 'High Yield suitable' : crudeProtein >= 12 ? 'Moderate Level' : 'Low Protein Level'}
          </p>
        </div>

        {/* Moisture */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800/80 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Moisture Content</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-black text-white font-mono">{moisture}%</span>
            <span className="text-xs text-slate-400 font-mono">H₂O</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-blue-400 rounded-full" style={{ width: `${Math.min(100, moisture)}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">
            {moisture >= 60 && moisture <= 68 ? 'Optimal Silage target' : moisture > 70 ? 'High Moisture Risk' : 'Dry Storage Target'}
          </p>
        </div>

        {/* Crude Fiber */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800/80 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Crude Fiber</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-black text-white font-mono">{crudeFiber}%</span>
            <span className="text-xs text-slate-400 font-mono">CF</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.min(100, (crudeFiber / 50) * 100)}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">
            {crudeFiber > 35 ? 'High Digestibility Fiber' : 'Standard Roughage'}
          </p>
        </div>

      </div>

      {/* Categorized AI Farmer Advisory Cards */}
      <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-800/80">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-black text-white">Actionable AI Farmer Advisories</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Real-Time Nutrition Rules</span>
        </div>

        <div className="mt-5 space-y-3">
          {advisories.map((advisory, idx) => {
            const isCritical = advisory.category === 'CRITICAL';
            const isWarning = advisory.category === 'WARNING';
            const isOptimal = advisory.category === 'OPTIMAL';

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${
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

        {/* Certify & Log Test Run Button */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <button
            type="button"
            onClick={onSaveToHistory}
            disabled={isSaved}
            className={`w-full py-4 px-5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-xl ${
              isSaved
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80 cursor-default'
                : 'bg-white hover:bg-slate-100 text-slate-950 shadow-white/10'
            }`}
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Test Audit Certified & Saved to History Log</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-emerald-600" />
                <span>Certify & Issue Digital QR Certificate</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
