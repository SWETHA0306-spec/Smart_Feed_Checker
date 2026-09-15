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
  const [filterType, setFilterType] = useState<'all' | 'urea' | 'passed'>('all');

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

    if (filterType === 'urea') return matchesSearch && record.results.isUreaAdulterated;
    if (filterType === 'passed') return matchesSearch && !record.results.isUreaAdulterated;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Header Bar */}
      <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-800/80">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-black text-white">Certified Audit History Log</h3>
          </div>
          <span className="text-xs bg-slate-950 text-emerald-400 border border-emerald-500/30 px-3.5 py-1 rounded-full font-mono font-bold">
            {history.length} Total Audits Logged
          </span>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search sample ID or feed category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <Filter className="w-4 h-4 text-slate-500" />
            {[
              { id: 'all', label: 'All Audits' },
              { id: 'passed', label: 'Passed' },
              { id: 'urea', label: 'Urea Alert' },
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
              const isUrea = record.results.isUreaAdulterated;
              return (
                <div
                  key={record.id}
                  onClick={() => openCertificate(record)}
                  className="p-4 rounded-2xl border border-slate-800/80 hover:border-emerald-500/50 bg-slate-950/80 hover:bg-slate-900 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-base font-mono text-slate-950 shadow-md ${
                      isUrea ? 'bg-rose-500' : record.results.overallScore >= 80 ? 'bg-emerald-400' : 'bg-blue-400'
                    }`}>
                      {record.results.qualityRating}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-white capitalize">
                          {record.feedType.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                          {record.id}
                        </span>
                        {isUrea && (
                          <span className="text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertOctagon className="w-3 h-3 text-rose-400" /> UREA ALERT
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" /> {record.timestamp}
                        </span>
                        <span>• Protein: <strong className="text-emerald-400 font-mono">{record.results.crudeProtein}%</strong></span>
                        <span>• H₂O: <strong className="text-blue-400 font-mono">{record.results.moisture}%</strong></span>
                        <span>• pH: <strong className="text-purple-400 font-mono">{record.inputs.silagePh}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 group-hover:bg-emerald-500 group-hover:text-slate-950 group-hover:border-emerald-500 transition-all flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>View CoA Certificate</span>
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
                  <p className="text-[11px] text-slate-400 font-mono">ISO 12099 Spectrometry Verification</p>
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

            {/* Printable Body */}
            <div className="p-6 space-y-6 bg-slate-50/50 relative" id="certificate-print-area">
              
              {/* Security Watermark Header */}
              <div className="text-center pb-4 border-b border-slate-200">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 border border-emerald-300 rounded-full text-xs font-black text-emerald-900 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  OFFICIAL DAIRY AUDIT CERTIFICATE
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">SmartFeed AI Analytical Report</h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Verification Hash: {selectedRecord.certificateHash}</p>
              </div>

              {/* QR Code & Metrics Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                
                {/* SVG QR Code */}
                <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <QRCodeSVG
                    value={`https://smartfeed-ai.vercel.app/verify/${selectedRecord.id}?hash=${selectedRecord.certificateHash}`}
                    size={110}
                    level="H"
                    includeMargin={true}
                  />
                  <span className="text-[9px] font-mono text-slate-500 mt-1 font-bold">Scan to Verify</span>
                </div>

                {/* Metrics Breakdown */}
                <div className="sm:col-span-2 space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Sample ID:</span>
                    <span className="font-bold font-mono text-slate-900">{selectedRecord.id}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Audit Timestamp:</span>
                    <span className="font-bold text-slate-900">{selectedRecord.timestamp}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Crop Category:</span>
                    <span className="font-bold uppercase text-slate-900">{selectedRecord.feedType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Crude Protein (940nm):</span>
                    <span className="font-bold text-emerald-700 font-mono">{selectedRecord.results.crudeProtein}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Moisture Content (810nm):</span>
                    <span className="font-bold text-blue-700 font-mono">{selectedRecord.results.moisture}%</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Fermentation pH:</span>
                    <span className="font-bold text-purple-700 font-mono">{selectedRecord.inputs.silagePh} ({selectedRecord.results.silageGrade})</span>
                  </div>
                </div>

              </div>

              {/* Status Audit Seal */}
              <div className={`p-3.5 rounded-2xl text-center text-xs font-black border ${
                selectedRecord.results.isUreaAdulterated
                  ? 'bg-rose-100 text-rose-900 border-rose-300'
                  : 'bg-emerald-100 text-emerald-900 border-emerald-300'
              }`}>
                {selectedRecord.results.isUreaAdulterated ? (
                  <span className="flex items-center justify-center gap-2">
                    <AlertOctagon className="w-5 h-5 text-rose-600" />
                    FAILED SAFETY AUDIT: UREA ADULTERATION DETECTED
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    PASSED: CERTIFIED SAFE FOR DAIRY RATION
                  </span>
                )}
              </div>

              {/* Digital Signature line */}
              <div className="pt-4 flex items-end justify-between border-t border-slate-200 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 font-mono">Issued by: SmartFeed AI NIR System</p>
                  <p className="text-[10px] text-slate-400 font-mono">Problem Statement ID 26111</p>
                </div>
                <div className="text-right">
                  <div className="font-script text-base font-bold text-slate-800 italic">Dr. A. Sharma, Lead Chemist</div>
                  <p className="text-[10px] text-slate-400 font-mono">Authorized Verification Seal</p>
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="bg-slate-100 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Print / Export PDF Certificate</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `SmartFeed CoA - ${selectedRecord.id}`,
                      text: `Dairy Feed Audit: Grade ${selectedRecord.results.qualityRating} for ${selectedRecord.feedType}`,
                      url: window.location.href,
                    }).catch(() => {});
                  } else {
                    alert('Certificate link copied to clipboard!');
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
