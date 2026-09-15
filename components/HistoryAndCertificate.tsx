'use client';

import React, { useState } from 'react';
import { TestRecord } from '@/lib/feedCalculators';
import { QRCodeSVG } from 'qrcode.react';
import { History, ShieldCheck, Download, Share2, AlertOctagon, CheckCircle2, ChevronRight, X, Calendar, FileText, Sparkles, Search, Filter } from 'lucide-react';

interface HistoryAndCertificateProps {
  history: TestRecord[];
  onSelectRecord?: (record: TestRecord) => void;
}

export const HistoryAndCertificate: React.FC<HistoryAndCertificateProps> = ({ history }) => {
  const [selectedRecord, setSelectedRecord] = useState<TestRecord | null>(history[0] || null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'unsafe' | 'good'>('all');

  const openCertificate = (record: TestRecord) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredHistory = history.filter((record) => {
    const matchesSearch =
      record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.feedType.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === 'unsafe') return matchesSearch && (record.results.qualityStatus === 'Unsafe' || record.results.qualityStatus === 'Poor');
    if (filterType === 'good') return matchesSearch && record.results.qualityStatus === 'Good';
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Header Bar */}
      <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-800/80">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-black text-white">Certified Problem Statement 3 Audit History</h3>
          </div>
          <span className="text-xs bg-slate-950 text-emerald-400 border border-emerald-500/30 px-3.5 py-1 rounded-full font-mono font-bold">
            {history.length} Logged Scans
          </span>
        </div>

        {/* Toolbar */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search sample ID (F001, F002...) or feed category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <Filter className="w-4 h-4 text-slate-500" />
            {[
              { id: 'all', label: 'All Samples' },
              { id: 'good', label: 'Good' },
              { id: 'unsafe', label: 'Unsafe/Poor' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterType(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterType === f.id
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* History Log List */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold text-slate-400">No test audit records found.</p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {filteredHistory.map((record) => {
              const status = record.results.qualityStatus;
              return (
                <div
                  key={record.id}
                  onClick={() => openCertificate(record)}
                  className="p-4 rounded-2xl border border-slate-800/80 hover:border-emerald-500/50 bg-slate-950/80 hover:bg-slate-900 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs font-mono text-slate-950 shadow-md ${
                      status === 'Good' ? 'bg-emerald-400' : status === 'Moderate' ? 'bg-amber-400' : 'bg-rose-500 text-white'
                    }`}>
                      {record.id}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-white capitalize">
                          {record.feedType}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          status === 'Good'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : status === 'Moderate'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}>
                          {status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1 font-medium">
                        <span>Protein: <strong className="text-emerald-400 font-mono">{record.results.crudeProtein}%</strong></span>
                        <span>Moisture: <strong className="text-blue-400 font-mono">{record.results.moisture}%</strong></span>
                        <span>Aflatoxin: <strong className="text-rose-400 font-mono">{record.results.aflatoxinPpb} ppb</strong></span>
                        <span>Adulteration: <strong className="text-slate-200">{record.results.adulterationDetected.join(', ')}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 group-hover:bg-emerald-500 group-hover:text-slate-950 group-hover:border-emerald-500 transition-all flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>View CoA Cert</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Official Certificate of Analysis (CoA) Modal */}
      {showModal && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-950 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-300 my-8 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Top Banner */}
            <div className="bg-slate-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-base tracking-wide">Certificate of Analysis (CoA)</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Problem Statement 3 Traceability System</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Certificate Body */}
            <div className="p-6 space-y-5 bg-slate-50/50" id="certificate-print-area">
              
              <div className="text-center pb-4 border-b border-slate-200">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 border border-emerald-300 rounded-full text-xs font-black text-emerald-900 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  OFFICIAL FEED & SILAGE QUALITY REPORT
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">SmartFeed AI Analytical Certificate</h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Verification Hash: {selectedRecord.certificateHash}</p>
              </div>

              {/* QR Code & Summary Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                
                <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <QRCodeSVG
                    value={`https://smartfeed-ai.vercel.app/verify/${selectedRecord.id}?hash=${selectedRecord.certificateHash}`}
                    size={110}
                    level="H"
                    includeMargin={true}
                  />
                  <span className="text-[9px] font-mono text-slate-500 mt-1 font-bold">Scan to Verify</span>
                </div>

                <div className="sm:col-span-2 space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Sample ID:</span>
                    <span className="font-bold font-mono text-slate-900">{selectedRecord.id}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Feed Type:</span>
                    <span className="font-bold uppercase text-slate-900">{selectedRecord.feedType}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Quality Status:</span>
                    <span className="font-bold uppercase text-emerald-700">{selectedRecord.results.qualityStatus}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Adulterations Detected:</span>
                    <span className="font-bold text-slate-900">{selectedRecord.results.adulterationDetected.join(', ')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Aflatoxin level:</span>
                    <span className="font-bold text-rose-700 font-mono">{selectedRecord.results.aflatoxinPpb} ppb</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Protein / Moisture:</span>
                    <span className="font-bold font-mono text-slate-900">
                      CP: {selectedRecord.results.crudeProtein}% | H₂O: {selectedRecord.results.moisture}%
                    </span>
                  </div>
                </div>

              </div>

              {/* Status Banner */}
              <div className={`p-3.5 rounded-2xl text-center text-xs font-black border ${
                selectedRecord.results.qualityStatus === 'Good'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-rose-100 text-rose-900 border-rose-300'
              }`}>
                {selectedRecord.results.qualityStatus === 'Good' ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    PASSED: APPROVED FOR DAIRY HERD RATION
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <AlertOctagon className="w-5 h-5 text-rose-600" />
                    ATTENTION: {selectedRecord.results.qualityStatus.toUpperCase()} QUALITY DETECTED
                  </span>
                )}
              </div>

            </div>

            {/* Modal Actions */}
            <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Print / Download PDF Certificate</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `SmartFeed CoA - ${selectedRecord.id}`,
                      text: `Feed Audit Report for ${selectedRecord.feedType}: ${selectedRecord.results.qualityStatus}`,
                      url: window.location.href,
                    }).catch(() => {});
                  } else {
                    alert('Certificate verification link copied!');
                  }
                }}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share QR</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
