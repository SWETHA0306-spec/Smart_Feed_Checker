'use client';

import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from '@/components/Header';
import { Navigation, TabType } from '@/components/Navigation';
import { SensorSimulator } from '@/components/SensorSimulator';
import { AnalysisResults } from '@/components/AnalysisResults';
import { HistoryAndCertificate } from '@/components/HistoryAndCertificate';
import { AdvisoryGuide } from '@/components/AdvisoryGuide';
import { SensorSpecs } from '@/components/SensorSpecs';
import {
  SensorInputs,
  calculateFeedQuality,
  PRESET_SCENARIOS,
  MOCK_HISTORY,
  TestRecord,
} from '@/lib/feedCalculators';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [inputs, setInputs] = useState<SensorInputs>(PRESET_SCENARIOS[0].inputs);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [sampleMeta, setSampleMeta] = useState({
    farmName: 'GreenPastures Dairy Farm',
    batchId: 'BATCH-8821',
    operator: 'Inspector R. Kumar',
  });
  const [history, setHistory] = useState<TestRecord[]>(MOCK_HISTORY);
  const [lastSavedId, setLastSavedId] = useState<string | null>(null);

  // Live sensor streaming simulation effect
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setInputs((prev) => {
        const deltaM = (Math.random() - 0.5) * 2;
        const deltaP = (Math.random() - 0.5) * 2;
        const deltaF = (Math.random() - 0.5) * 2;

        return {
          ...prev,
          moisture810nm: Math.min(100, Math.max(0, Math.round(prev.moisture810nm + deltaM))),
          protein940nm: Math.min(100, Math.max(0, Math.round(prev.protein940nm + deltaP))),
          fiber1050nm: Math.min(100, Math.max(0, Math.round(prev.fiber1050nm + deltaF))),
        };
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Real-time calculated results using useMemo
  const results = useMemo(() => calculateFeedQuality(inputs), [inputs]);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      // Trigger confetti celebration on high quality scans
      if (results.overallScore >= 80 && !results.isUreaAdulterated) {
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      }
    }, 450);
  };

  const handleSaveToHistory = () => {
    const newId = `SMP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const hash = '0x' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const newRecord: TestRecord = {
      id: newId,
      timestamp: formattedDate,
      feedType: inputs.feedType,
      inputs: { ...inputs },
      results: { ...results },
      certificateHash: hash,
    };

    setHistory((prev) => [newRecord, ...prev]);
    setLastSavedId(newId);

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch {
      // ignore
    }
  };

  const currentSavedState = lastSavedId !== null && history[0]?.id === lastSavedId;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Header */}
      <Header
        sampleCount={history.length}
        isStreaming={isStreaming}
        setIsStreaming={setIsStreaming}
      />

      {/* Navigation (Desktop Top Bar / Mobile Fixed Bottom Bar) */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Tab 1: Testing Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Top Info Strip */}
            <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-white">
                    Live Optical NIR Spectrometry & pH Audit Console
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Adjust Wavelength sliders or activate live hardware stream for instant nutritional analysis.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono bg-slate-950 text-slate-300 font-bold px-3 py-1 rounded-xl border border-slate-800">
                  Farm: <strong className="text-emerald-400">{sampleMeta.farmName}</strong>
                </span>
              </div>
            </div>

            {/* Responsive Dual-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Sensor Simulator */}
              <div className="lg:col-span-6 space-y-6">
                <SensorSimulator
                  inputs={inputs}
                  setInputs={setInputs}
                  sampleMeta={sampleMeta}
                  setSampleMeta={setSampleMeta}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                  isStreaming={isStreaming}
                />
              </div>

              {/* Right Column: Analytics & Advisories */}
              <div className="lg:col-span-6 space-y-6">
                <AnalysisResults
                  results={results}
                  onSaveToHistory={handleSaveToHistory}
                  isSaved={currentSavedState}
                />
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: History & Certificates */}
        {activeTab === 'history' && (
          <HistoryAndCertificate history={history} />
        )}

        {/* Tab 3: Advisory Guide */}
        {activeTab === 'advisory' && (
          <AdvisoryGuide />
        )}

        {/* Tab 4: NIR Sensor Specs */}
        {activeTab === 'specs' && (
          <SensorSpecs />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 bg-slate-950 text-slate-500 text-xs border-t border-slate-900 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-bold text-slate-400">
            SmartFeed AI — Problem Statement ID 26111
          </p>
          <p className="mt-1 text-slate-600">
            Rapid AI-Enabled Feed & Silage Quality Testing System for Dairy Farmers • Next.js 14 & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
