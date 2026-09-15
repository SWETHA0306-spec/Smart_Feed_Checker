'use client';

import React, { useState } from 'react';
import { SensorInputs, calculateFeedQuality, QualityStatusType } from '@/lib/feedCalculators';
import { Bot, Sparkles, ShieldAlert, CheckCircle2, AlertTriangle, AlertOctagon, Send, FileCheck } from 'lucide-react';

interface AiNutritionistEvaluatorProps {
  inputs: SensorInputs;
}

export interface ExpertEvaluationOutput {
  qualityStatus: QualityStatusType;
  riskAnalysis: string[];
  actionPlan: string[];
}

export function generateExpertEvaluation(
  visualAnnotations: string[],
  inputs: SensorInputs
): ExpertEvaluationOutput {
  const baseResults = calculateFeedQuality(inputs);
  const risks: string[] = [];
  const actionPlan: string[] = [];

  // Evaluate Visual Annotations (YOLO) + Chemical Sensors
  const hasMold = visualAnnotations.includes('White Mold Growth') || visualAnnotations.includes('Fungal Spores') || inputs.mouldPresence;
  const hasSand = visualAnnotations.includes('Sand Contamination') || inputs.sandSilicaRatio > 8;
  const isUrea = inputs.nitrogenRatioIndex > 65;
  const isHighAflatoxin = inputs.aflatoxinPpb >= 18;
  const isHighPh = inputs.feedType === 'silage' && inputs.silagePh > 4.8;
  const isLowPh = inputs.feedType === 'silage' && inputs.silagePh < 3.8;

  // 1. Determine Quality Status
  let qualityStatus: QualityStatusType = baseResults.qualityStatus;
  if (isHighAflatoxin || (isUrea && hasSand) || (hasMold && isHighAflatoxin)) {
    qualityStatus = 'Unsafe';
  } else if (isUrea || hasSand || isHighPh) {
    qualityStatus = 'Poor';
  } else if (hasMold || (inputs.feedType === 'silage' && inputs.silagePh > 4.2)) {
    qualityStatus = 'Moderate';
  }

  // 2. Risk Analysis
  if (isUrea) {
    risks.push('Acute Ammonia Toxicity & Muscle Tremors (Non-protein Nitrogen spikes)');
  }
  if (isHighAflatoxin) {
    risks.push('Milk Contamination (Aflatoxin M1 excretion) & Liver Mycotoxicity');
  }
  if (hasSand) {
    risks.push('Abomasal Sand Impaction & Severe G.I. Dental Abrasion');
  }
  if (hasMold) {
    risks.push('Fungal Spore Mycotoxicoses & Reproductive Performance Decline');
  }
  if (isHighPh) {
    risks.push('Aerobic Spoilage, Yeast Blooming & Drop in Daily Milk Yield');
  }
  if (isLowPh) {
    risks.push('Sub-Acute Ruminal Acidosis (SARA) & Suppressed Dry Matter Intake (DMI)');
  }
  if (risks.length === 0) {
    risks.push('Minimal Physiological Risk — Optimal Rumen Microbial Fermentation');
  }

  // 3. Step-by-Step Action Plan (2 Short Instructions)
  if (qualityStatus === 'Unsafe') {
    actionPlan.push('Step 1: IMMEDIATELY DISCARD OR ISOLATE THIS FEED BATCH. Do not feed to lactating cows or pre-weaned calves under any circumstances.');
    actionPlan.push('Step 2: Administer rumen buffer (Sodium Bicarbonate 150g/head) and contact your herd veterinarian if cattle display lethargy or decreased appetite.');
  } else if (qualityStatus === 'Poor') {
    actionPlan.push('Step 1: Dilute this batch with 60% clean, dry legume hay (Alfalfa) and add a approved mycotoxin binder (0.5% TMR DM).');
    actionPlan.push('Step 2: Treat silage face with propionic acid to stop aerobic decay and increase compaction density.');
  } else if (qualityStatus === 'Moderate') {
    actionPlan.push('Step 1: Monitor dry matter intake (DMI) daily and feed only to dry cows or older replacement heifers.');
    actionPlan.push('Step 2: Winnow feed to reduce dust and store in a well-ventilated dry shed away from moisture.');
  } else {
    actionPlan.push('Step 1: Approved for immediate full-ration feeding to high-yielding lactating cows (25+ L/day target).');
    actionPlan.push('Step 2: Maintain dry pit storage conditions and rescan weekly to verify fermentation stability.');
  }

  return {
    qualityStatus,
    riskAnalysis: risks,
    actionPlan,
  };
}

export const AiNutritionistEvaluator: React.FC<AiNutritionistEvaluatorProps> = ({ inputs }) => {
  const [selectedAnnotations, setSelectedAnnotations] = useState<string[]>(['White Mold Growth']);
  
  const toggleAnnotation = (ann: string) => {
    setSelectedAnnotations((prev) =>
      prev.includes(ann) ? prev.filter((a) => a !== ann) : [...prev, ann]
    );
  };

  const evalResult = generateExpertEvaluation(selectedAnnotations, inputs);

  const statusColors = {
    Good: 'bg-emerald-500 text-slate-950 border-emerald-400',
    Moderate: 'bg-amber-500 text-slate-950 border-amber-400',
    Poor: 'bg-rose-500 text-white border-rose-400',
    Unsafe: 'bg-red-600 text-white border-red-500 animate-pulse',
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/15 text-emerald-400 rounded-2xl border border-emerald-500/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              SmartFeed AI — Precision Livestock Nutritionist
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Multi-Modal Veterinary Feed & Safety Diagnostic System</p>
          </div>
        </div>

        <span className="text-xs font-mono bg-slate-950 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
          AI Expert Mode Active
        </span>
      </div>

      {/* YOLO Visual Annotation Selectors */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Select YOLO Computer Vision Visual Annotations:
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            'White Mold Growth',
            'Sand Contamination',
            'Fungal Spores',
            'Clumping / Moisture Binding',
            'Insect Infestation',
          ].map((ann) => {
            const isSelected = selectedAnnotations.includes(ann);
            return (
              <button
                key={ann}
                type="button"
                onClick={() => toggleAnnotation(ann)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {ann}
              </button>
            );
          })}
        </div>
      </div>

      {/* Structured 3-Part Output Panel */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        
        {/* 1. Quality Status */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">1. Quality Status:</span>
          <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase border shadow-lg ${statusColors[evalResult.qualityStatus]}`}>
            [{evalResult.qualityStatus}]
          </span>
        </div>

        {/* 2. Risk Analysis */}
        <div className="space-y-2 pb-3 border-b border-slate-800">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            2. Direct Cattle Risk Analysis:
          </span>
          <ul className="space-y-1.5 pl-2">
            {evalResult.riskAnalysis.map((risk, idx) => (
              <li key={idx} className="text-xs text-rose-200 font-medium flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Action Plan */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            3. Step-by-Step Farmer Action Plan:
          </span>
          <div className="space-y-2 pl-2">
            {evalResult.actionPlan.map((step, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 leading-relaxed">
                {step}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
