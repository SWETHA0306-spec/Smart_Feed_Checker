'use client';

import React from 'react';
import { Cpu, Radio, ShieldCheck, Activity, Layers } from 'lucide-react';

export const SensorSpecs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="p-2.5 bg-slate-900 text-agri-400 rounded-xl">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">NIR Sensor Hardware & Spectrometry Architecture</h2>
            <p className="text-xs text-slate-500">Problem Statement ID 26111 Simulated Optical Hardware Specifications</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 810nm Band */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-2">
              <Radio className="w-4 h-4 text-blue-600" />
              <span>810 nm Optical Band</span>
            </div>
            <p className="text-xs text-blue-950 font-medium">
              Target Wavelength: O-H Second Overtone. Optimized for detecting free and bound water molecules in forage tissue to calculate exact Moisture %.
            </p>
          </div>

          {/* 940nm Band */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>940 nm Optical Band</span>
            </div>
            <p className="text-xs text-emerald-950 font-medium">
              Target Wavelength: N-H Stretching Overtone. Directly measures peptide bonds and nitrogenous compounds for Crude Protein % determination.
            </p>
          </div>

          {/* 1050nm Band */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>1050 nm Optical Band</span>
            </div>
            <p className="text-xs text-amber-950 font-medium">
              Target Wavelength: C-H First Overtone. Measures structural carbohydrates (NDF/ADF, cellulose, lignin) to score Crude Fiber %.
            </p>
          </div>

        </div>

        <div className="mt-6 p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-agri-400 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold">Calibration & Verification Standard</h4>
              <p className="text-xs text-slate-400">Integrated PLS (Partial Least Squares) multivariate regression model calibrated against ICAR forage standards.</p>
            </div>
          </div>
          <span className="text-xs font-mono bg-agri-500/20 text-agri-300 border border-agri-500/30 px-3 py-1.5 rounded-lg whitespace-nowrap">
            ISO 12099 Compliant
          </span>
        </div>
      </div>
    </div>
  );
};
