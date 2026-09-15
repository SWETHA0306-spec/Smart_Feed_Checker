'use client';

import React, { useState } from 'react';
import { TestRecord } from '@/lib/feedCalculators';
import { QRCodeSVG } from 'qrcode.react';
import { History, ShieldCheck, Download, Share2, AlertOctagon, CheckCircle2, ChevronRight, X, Calendar, FileText, Sparkles } from 'lucide-react';

interface HistoryAndCertificateProps {
  history: TestRecord[];
  onSelectRecord?: (record: TestRecord) => void;
}

export const HistoryAndCertificate: React.FC<HistoryAndCertificateProps> = ({ history }) => {
  const [selectedRecord, setSelectedRecord] = useState<TestRecord | null>(history[0] || null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const openCertificate = (record: TestRecord) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* History Log Table & Cards */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-agri-600" />
            <h3 className="text-base font-bold text-slate-900">Certified Test History Log</h3>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold">
            {history.length} Saved Scans
          </span>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No certified feed test scans saved yet.</p>
            <p className="text-xs mt-1">Run a scan on the dashboard tab and click &quot;Certify & Log Test Run&quot;.</p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {history.map((record) => {
              const isUrea = record.results.isUreaAdulterated;
              return (
                <div
                  key={record.id}
                  onClick={() => openCertificate(record)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-agri-400 bg-slate-50 hover:bg-agri-50/50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm font-mono text-white ${
                      isUrea ? 'bg-rose-600' : record.results.overallScore >= 80 ? 'bg-emerald-600' : 'bg-blue-600'
                    }`}>
                      {record.results.qualityRating}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 capitalize">
                          {record.feedType.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                          {record.id}
                        </span>
                        {isUrea && (
                          <span className="text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-300 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <AlertOctagon className="w-3 h-3" /> UREA
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {record.timestamp}
                        </span>
                        <span>• Protein: <strong>{record.results.crudeProtein}%</strong></span>
                        <span>• Moisture: <strong>{record.results.moisture}%</strong></span>
                        <span>• pH: <strong>{record.inputs.silagePh}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 group-hover:bg-agri-600 group-hover:text-white group-hover:border-agri-600 transition-all flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>View QR Cert</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QR Certificate Modal / Card */}
      {showModal && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-8">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-agri-950 to-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-agri-400" />
                <div>
                  <h3 className="font-bold text-base tracking-wide">Feed Quality Digital QR Certificate</h3>
                  <p className="text-[11px] text-slate-400 font-mono">ID 26111 NIR Verification Standard</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Certificate Body */}
            <div className="p-6 space-y-6" id="certificate-print-area">
              
              {/* Header Badge */}
              <div className="text-center pb-4 border-b border-slate-100">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-agri-50 border border-agri-200 rounded-full text-xs font-extrabold text-agri-800 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-agri-600" />
                  OFFICIAL DAIRY QUALITY AUDIT PASSED
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">SmartFeed AI Test Certification</h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Certificate Hash: {selectedRecord.certificateHash}</p>
              </div>

              {/* QR Code & Main Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
                
                {/* QR Code Graphic */}
                <div className="flex flex-col items-center justify-center p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <QRCodeSVG
                    value={`https://smartfeed-ai.vercel.app/verify/${selectedRecord.id}?hash=${selectedRecord.certificateHash}`}
                    size={120}
                    level="H"
                    includeMargin={true}
                  />
                  <span className="text-[9px] font-mono text-slate-400 mt-1">Scan to Verify</span>
                </div>

                {/* Main Metrics Summary */}
                <div className="sm:col-span-2 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Sample ID:</span>
                    <span className="font-bold text-slate-900 font-mono">{selectedRecord.id}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Timestamp:</span>
                    <span className="font-bold text-slate-900">{selectedRecord.timestamp}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Crop Type:</span>
                    <span className="font-bold text-slate-900 uppercase">{selectedRecord.feedType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Crude Protein (940nm):</span>
                    <span className="font-bold text-emerald-700 font-mono">{selectedRecord.results.crudeProtein}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Moisture Content (810nm):</span>
                    <span className="font-bold text-blue-700 font-mono">{selectedRecord.results.moisture}%</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Fermentation pH:</span>
                    <span className="font-bold text-purple-700 font-mono">{selectedRecord.inputs.silagePh} ({selectedRecord.results.silageGrade})</span>
                  </div>
                </div>

              </div>

              {/* Status Indicator */}
              <div className={`p-3 rounded-xl text-center text-xs font-bold border ${
                selectedRecord.results.isUreaAdulterated
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                {selectedRecord.results.isUreaAdulterated ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <AlertOctagon className="w-4 h-4 text-rose-600" />
                    FAILED SAFETY AUDIT: UREA ADULTERATION DETECTED
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    PASSED: APPROVED FOR DAIRY HERD RATION
                  </span>
                )}
              </div>

            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Print / Download Certificate PDF</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `SmartFeed AI Certificate - ${selectedRecord.id}`,
                      text: `Dairy Feed Quality Audit: Grade ${selectedRecord.results.qualityRating} for ${selectedRecord.feedType}`,
                      url: window.location.href,
                    }).catch(() => {});
                  } else {
                    alert('Certificate verification link copied to clipboard!');
                  }
                }}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share QR Code</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
