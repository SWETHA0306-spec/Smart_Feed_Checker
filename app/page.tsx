'use client';

import React, { useState, useMemo } from 'react';
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
  const [history, setHistory] = useState<TestRecord[]>(MOCK_HISTORY);
  const [lastSavedId, setLastSavedId] = useState<string | null>(null);

  // Real-time calculated results using useMemo for instant reactivity
  const results = useMemo(() => calculateFeedQuality(inputs), [inputs]);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      // Trigger confetti celebration on good scans
      if (results.overallScore >= 80 && !results.isUreaAdulterated) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {
          // Ignore if confetti context missing
        }
      }
    }, 400);
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

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
      });
    } catch {
      // ignore
    }
  };

  const currentSavedState = lastSavedId !== null && history[0]?.id === lastSavedId;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col">
      {/* Top Header */}
      <Header sampleCount={history.length} />

      {/* Navigation (Desktop Top / Mobile Bottom) */}
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
            
            {/* Mobile & Desktop Banner */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">
                  Live NIR Spectral Feed Quality Scanner
                </h2>
                <p className="text-xs text-slate-500">
                  Adjust NIR spectral inputs below or choose a scenario preset for instant analysis.
                </p>
              </div>
              <div className="hidden sm:block text-right">
                <span className="text-xs font-mono bg-agri-100 text-agri-800 font-bold px-3 py-1 rounded-lg">
                  ISO-12099 NIR Model Active
                </span>
              </div>
            </div>

            {/* Responsive Dual-Column Grid (Single column on mobile, 2 columns on desktop) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Sensor Simulator Controls */}
              <div className="lg:col-span-6 space-y-6">
                <SensorSimulator
                  inputs={inputs}
                  setInputs={setInputs}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                />
              </div>

              {/* Right Column: Real-time Analytics & Advisory Results */}
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
      <footer className="mt-auto py-6 bg-slate-900 text-slate-400 text-xs border-t border-slate-800 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-300">
            SmartFeed AI — Problem Statement ID 26111
          </p>
          <p className="mt-1 text-slate-500">
            Rapid AI-Enabled Feed & Silage Quality Testing System for Dairy Farmers • Built with Next.js 14 & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
