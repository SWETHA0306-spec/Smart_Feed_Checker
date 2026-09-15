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
      label: 'Testing Dashboard',
      icon: Sliders,
      badge: null,
    },
    {
      id: 'history' as TabType,
      label: 'History & Certificates',
      icon: History,
      badge: historyCount > 0 ? historyCount : null,
    },
    {
      id: 'advisory' as TabType,
      label: 'Farmer Advisory Guide',
      icon: BookOpen,
      badge: null,
    },
    {
      id: 'specs' as TabType,
      label: 'NIR Sensor Specs',
      icon: Cpu,
      badge: null,
    },
  ];

  return (
    <>
      {/* Desktop Top Navigation Bar */}
      <nav className="hidden md:block bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-agri-600 text-white shadow-md shadow-agri-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="ml-1 px-2 py-0.5 text-xs font-bold rounded-full bg-agri-500 text-white">
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 shadow-lg px-2 py-2">
        <div className="grid grid-cols-4 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[11px] font-medium transition-all ${
                  isActive
                    ? 'bg-agri-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5 mb-0.5" />
                  {tab.badge && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 bg-agri-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="truncate max-w-full">{tab.id === 'dashboard' ? 'Test' : tab.id === 'history' ? 'History' : tab.id === 'advisory' ? 'Guide' : 'Specs'}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
