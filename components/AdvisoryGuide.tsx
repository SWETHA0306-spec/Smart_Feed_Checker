'use client';

import React from 'react';
import { BookOpen, ShieldAlert, CheckCircle2, Droplets, Zap, AlertTriangle } from 'lucide-react';

export const AdvisoryGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="p-2.5 bg-agri-100 text-agri-700 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Farmer Nutrition & Safety Advisory Guide</h2>
            <p className="text-xs text-slate-500">Standard Operating Guidelines for Dairy Herd Feed & Silage Management</p>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          
          {/* Section 1: Urea Adulteration */}
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
            <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm mb-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>1. Urea Adulteration & Ammonia Toxicity Risk</span>
            </div>
            <p className="text-xs text-rose-950 leading-relaxed font-medium">
              Synthetic urea is sometimes illegal added to poor quality cattle feed to artificially inflate total crude protein readings measured by basic Kjeldahl nitrogen testing. In ruminants, rumen microflora convert urea into ammonia. If urea levels exceed 65 on our Nitrogen Ratio Index:
            </p>
            <ul className="mt-2 space-y-1 text-xs text-rose-900 list-disc list-inside font-medium">
              <li>High risk of acute ammonia toxicity, causing muscle tremors and respiratory distress.</li>
              <li>Pre-weaned calves lack functional rumen microbes and cannot metabolize urea; strictly prohibit feeding.</li>
              <li>Lactating cows require carbohydrate-rich energy (ground corn/molasses) to utilize non-protein nitrogen.</li>
            </ul>
          </div>

          {/* Section 2: Silage Fermentation & pH */}
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
            <div className="flex items-center gap-2 text-purple-900 font-extrabold text-sm mb-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <span>2. Silage pH Fermentation Scale Reference</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mt-3">
              <div className="p-3 bg-white rounded-lg border border-purple-200">
                <span className="font-extrabold text-emerald-700 block">pH 3.8 – 4.2 (Excellent)</span>
                <p className="text-[11px] text-slate-600 mt-1">Lactic acid dominates. Stable storage, low nutrient loss, optimal intake.</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-purple-200">
                <span className="font-extrabold text-amber-700 block">pH 4.3 – 4.8 (Fair)</span>
                <p className="text-[11px] text-slate-600 mt-1">Moderate fermentation. Requires close monitoring for face spoilage.</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-purple-200">
                <span className="font-extrabold text-rose-700 block">pH &gt; 4.8 (Spoiled)</span>
                <p className="text-[11px] text-slate-600 mt-1">Aerobic deterioration, yeast/mold blooming, potential mycotoxin threat.</p>
              </div>
            </div>
          </div>

          {/* Section 3: Moisture Management */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-2 text-blue-900 font-extrabold text-sm mb-2">
              <Droplets className="w-5 h-5 text-blue-600" />
              <span>3. Moisture Targets for Silage vs Hay</span>
            </div>
            <div className="text-xs text-blue-950 space-y-2 font-medium">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span><strong>Corn & Whole Crop Silage:</strong> Target 60% – 68% moisture for optimal pit packing and air exclusion.</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <span><strong>Baled Dry Hay (Alfalfa/Grass):</strong> Target &lt;16% moisture. Moisture &gt;18% triggers internal heating and mold spore growth.</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
