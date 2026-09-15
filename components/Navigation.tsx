'use client';

import React from 'react';
import { Sliders, History, BookOpen, Cpu } from 'lucide-react';

export type TabType = 'dashboard' | 'history' | 'advisory' | 'specs';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  historyCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, historyCount }) => {
  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: 'Spectrometry & AI Dashboard',
      shortLabel: 'Testing',
      icon: Sliders,
      badge: null,
    },
    {
      id: 'history' as TabType,
      label: 'Certified Audit History & CoA',
      shortLabel: 'History',
      icon: History,
      badge: historyCount > 0 ? historyCount : null,
    },
    {
      id: 'advisory' as TabType,
      label: 'Farmer Nutrition & Safety Guide',
      shortLabel: 'Guide',
      icon: BookOpen,
      badge: null,
    },
    {
      id: 'specs' as TabType,
      label: 'NIR Hardware Wavelength Specs',
      shortLabel: 'Specs',
      icon: Cpu,
      badge: null,
    },
  ];

  return (
    <>
      {/* Desktop Navigation Pills */}
      <nav className="hidden md:block bg-[#080c14]/80 border-b border-slate-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-xs font-black transition-all duration-200 border ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950 stroke-[2.5]' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full ${
                      isActive ? 'bg-slate-950 text-emerald-400' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#080c14]/95 border-t border-slate-800/90 backdrop-blur-xl px-2 py-2.5 shadow-2xl">
        <div className="grid grid-cols-4 gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-[10px] font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5 mb-0.5" />
                  {tab.badge && (
                    <span className="absolute -top-1 -right-2.5 w-4 h-4 bg-emerald-500 text-slate-950 rounded-full text-[9px] flex items-center justify-center font-black">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="truncate max-w-full font-mono">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
