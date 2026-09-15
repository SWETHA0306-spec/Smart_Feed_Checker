'use client';

import React from 'react';
import { AnalysisResults as ResultsType } from '@/lib/feedCalculators';
import { AlertTriangle, CheckCircle2, AlertOctagon, Info, Save, Award, Activity, Droplets, Dna, Layers, Zap } from 'lucide-react';

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

  // Grade color badges
  const ratingColors = {
    'A+': 'bg-emerald-500 text-white shadow-emerald-500/30',
    'A': 'bg-emerald-600 text-white shadow-emerald-600/30',
    'B': 'bg-blue-600 text-white shadow-blue-600/30',
    'C': 'bg-amber-500 text-white shadow-amber-500/30',
    'D': 'bg-rose-600 text-white shadow-rose-600/30',
  };

  const silageColorClasses = {
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    amber: 'bg-amber-100 text-amber-800 border-amber-300',
    rose: 'bg-rose-100 text-rose-800 border-rose-300',
  };

  return (
    <div className="space-y-5">
      
      {/* Critical Urea Alert Card (If Urea Adulteration Detected) */}
      {isUreaAdulterated && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white shadow-xl shadow-rose-600/20 border-2 border-rose-400 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <AlertOctagon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black uppercase tracking-wide">
                  CRITICAL: Urea Adulteration Detected!
                </h3>
                <span className="px-2.5 py-1 bg-white text-rose-700 font-extrabold text-xs rounded-full uppercase">
                  HIGH HAZARD
                </span>
              </div>
              <p className="text-xs text-rose-100 mt-1 font-medium leading-relaxed">
                Spectral markers indicate synthetic urea non-protein nitrogen (NPN) injection exceeding safety thresholds (&gt;65 Nitrogen Index). Toxic for pre-weaned calves and unbuffered cattle diets.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Composite Score Card & Silage Grade Banner */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-agri-600" />
              <h3 className="text-base font-bold text-slate-900">Feed Quality Score</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Composite index derived from NIR optical density & pH balance</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Score Number */}
            <div className="text-right">
              <div className="text-3xl font-black text-slate-900 font-mono leading-none">
                {overallScore}<span className="text-sm font-normal text-slate-400">/100</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">Overall Index</span>
            </div>

            {/* Letter Grade Badge */}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg ${ratingColors[qualityRating]}`}>
              {qualityRating}
            </div>
          </div>
        </div>

        {/* Silage Grade Status Row */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bold text-slate-700">Silage pH Fermentation Grade:</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${silageColorClasses[silagePhStatusColor]}`}>
            {silageGrade}
          </span>
        </div>
      </div>

      {/* Chemical Macronutrient Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Crude Protein */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Crude Protein</span>
            <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
              <Dna className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 font-mono">{crudeProtein}%</span>
            <span className="text-xs text-slate-500">CP</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {crudeProtein >= 16 ? 'High (Lactating Cow Suitable)' : crudeProtein >= 12 ? 'Moderate Level' : 'Low Protein Content'}
          </p>
        </div>

        {/* Moisture Content */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Moisture</span>
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 font-mono">{moisture}%</span>
            <span className="text-xs text-slate-500">H₂O</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {moisture >= 60 && moisture <= 68 ? 'Optimal Silage Range' : moisture > 70 ? 'High Moisture Risk' : 'Dry Storage'}
          </p>
        </div>

        {/* Crude Fiber */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Crude Fiber</span>
            <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 font-mono">{crudeFiber}%</span>
            <span className="text-xs text-slate-500">CF</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {crudeFiber > 35 ? 'High Digestibility Fiber' : 'Standard Roughage'}
          </p>
        </div>

      </div>

      {/* Actionable Farmer Advisories Section */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-agri-600" />
            <h3 className="text-base font-bold text-slate-900">Actionable AI Farmer Advisories</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">Real-time Feed Guidance</span>
        </div>

        <div className="mt-4 space-y-3">
          {advisories.map((advisory, idx) => {
            const isCritical = advisory.category === 'CRITICAL';
            const isWarning = advisory.category === 'WARNING';
            const isOptimal = advisory.category === 'OPTIMAL';

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                  isCritical
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : isWarning
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : isOptimal
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="mt-0.5">
                  {isCritical && <AlertOctagon className="w-5 h-5 text-rose-600 flex-shrink-0" />}
                  {isWarning && <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />}
                  {isOptimal && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
                  {!isCritical && !isWarning && !isOptimal && <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />}
                </div>

                <div className="flex-1">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider mb-0.5">
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

        {/* Save to History Button */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onSaveToHistory}
            disabled={isSaved}
            className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              isSaved
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
            }`}
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Test Certified & Saved to History Log</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-agri-400" />
                <span>Certify & Log Test Run</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
