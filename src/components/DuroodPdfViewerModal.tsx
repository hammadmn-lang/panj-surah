import React, { useRef, useState } from 'react';
import { X, Printer, FileText, ZoomIn, ZoomOut, Heart, BookOpen, Sparkles, Check } from 'lucide-react';
import { DuroodItem } from '../types';

interface DuroodPdfViewerModalProps {
  durood: DuroodItem | null;
  allDuroods?: DuroodItem[];
  isOpen: boolean;
  onClose: () => void;
}

export const DuroodPdfViewerModal: React.FC<DuroodPdfViewerModalProps> = ({
  durood,
  allDuroods = [],
  isOpen,
  onClose,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'single' | 'collection'>('single');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('large');
  const [showUrdu, setShowUrdu] = useState<boolean>(true);
  const [showEnglish, setShowEnglish] = useState<boolean>(true);
  const [showTransliteration, setShowTransliteration] = useState<boolean>(true);

  if (!isOpen || !durood) return null;

  const handlePrintPdf = () => {
    window.print();
  };

  const getArabicFontSize = () => {
    switch (fontSize) {
      case 'normal':
        return 'text-2xl sm:text-3xl leading-[2.6]';
      case 'large':
        return 'text-3xl sm:text-4xl leading-[2.8] font-semibold';
      case 'extra-large':
        return 'text-4xl sm:text-5xl leading-[3.1] font-bold';
    }
  };

  const biggerDuroods = allDuroods.filter((d) => d.isBigger);
  const displayItems = viewMode === 'collection' ? (biggerDuroods.length > 0 ? biggerDuroods : allDuroods) : [durood];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border-2 border-emerald-600/40 overflow-hidden text-slate-900 print:max-h-none print:border-none print:shadow-none print:w-full">
        {/* Top Control Bar (Hidden when printing or saving as PDF) */}
        <div className="p-4 sm:p-5 border-b border-emerald-200 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 print:hidden select-none">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-950/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-950 font-extrabold">
                  PDF &amp; Print Edition
                </span>
                <span className="text-xs text-emerald-800 font-semibold hidden sm:inline">
                  High-Legibility Mushaf
                </span>
              </div>
              <h3 className="font-bold text-base sm:text-lg text-emerald-950 flex items-center gap-2 mt-0.5">
                {viewMode === 'single' ? durood.title : 'Complete Major Salawat & Durood Collection'}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            {allDuroods.length > 1 && (
              <div className="flex items-center rounded-xl bg-white border border-emerald-300 p-0.5 shadow-sm text-xs font-semibold">
                <button
                  onClick={() => setViewMode('single')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'single'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-700 hover:text-emerald-900'
                  }`}
                >
                  This Durood
                </button>
                <button
                  onClick={() => setViewMode('collection')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'collection'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-700 hover:text-emerald-900'
                  }`}
                >
                  All Bigger ({biggerDuroods.length})
                </button>
              </div>
            )}

            {/* Font Size Adjuster for Elderly Eyes */}
            <div className="flex items-center rounded-xl bg-white border border-emerald-300 p-0.5 shadow-sm text-xs font-semibold">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  fontSize === 'normal'
                    ? 'bg-emerald-700 text-white'
                    : 'text-slate-700 hover:text-emerald-900'
                }`}
                title="Normal text size"
              >
                Normal
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  fontSize === 'large'
                    ? 'bg-emerald-700 text-white'
                    : 'text-slate-700 hover:text-emerald-900'
                }`}
                title="Large text size"
              >
                Large
              </button>
              <button
                onClick={() => setFontSize('extra-large')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  fontSize === 'extra-large'
                    ? 'bg-emerald-700 text-white'
                    : 'text-slate-700 hover:text-emerald-900'
                }`}
                title="Extra Large (Elderly / Low-vision)"
              >
                Senior (XL)
              </button>
            </div>

            {/* Save / Print Button */}
            <button
              onClick={handlePrintPdf}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
              title="Save as PDF or Print directly"
            >
              <Printer className="w-4 h-4" />
              <span>Save / Print PDF</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close PDF view"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Visibility Toggles bar */}
        <div className="px-5 py-2.5 bg-emerald-100/60 border-b border-emerald-200 flex flex-wrap items-center justify-between text-xs font-medium text-emerald-950 print:hidden select-none">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showUrdu}
                onChange={(e) => setShowUrdu(e.target.checked)}
                className="rounded accent-emerald-700"
              />
              <span>Urdu Translation (اردو ترجمہ)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showEnglish}
                onChange={(e) => setShowEnglish(e.target.checked)}
                className="rounded accent-emerald-700"
              />
              <span>English Translation</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showTransliteration}
                onChange={(e) => setShowTransliteration(e.target.checked)}
                className="rounded accent-emerald-700"
              />
              <span>Roman Transliteration</span>
            </label>
          </div>
          <span className="text-[11px] text-emerald-800 font-mono">
            {displayItems.length} {displayItems.length === 1 ? 'Litany' : 'Litanies'} • High-Contrast Mode
          </span>
        </div>

        {/* Printable Document Body */}
        <div
          ref={printAreaRef}
          className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 bg-slate-100/60 print:bg-white print:p-0 print:overflow-visible"
        >
          {displayItems.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border-2 border-emerald-700/40 p-6 sm:p-10 shadow-sm relative print:shadow-none print:border-2 print:border-emerald-800 print:page-break-after-always print:m-0 print:rounded-none"
            >
              {/* Ornamental Islamic Top Header with Arch & Crest */}
              <div className="border-b-2 border-emerald-600/30 pb-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold uppercase tracking-wider">
                    <Heart className="w-3 h-3 text-rose-600 fill-current" />
                    Salawat &amp; Durood Sharif
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 mt-1">
                    {item.title}
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">
                    {item.reference} • Recommended: {item.recommendedCount}x Recitations
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-arabic text-2xl sm:text-3xl text-emerald-800 font-bold" dir="rtl">
                    {item.arabicTitle}
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    Item {idx + 1} of {displayItems.length}
                  </span>
                </div>
              </div>

              {/* Bismillah Calligraphy Banner */}
              <div className="text-center py-4 mb-6 border-b border-emerald-100/80 bg-emerald-50/40 rounded-2xl">
                <div className="font-arabic text-2xl sm:text-3xl text-emerald-900 font-bold leading-loose select-none" dir="rtl">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>
                <p className="text-[11px] text-emerald-800 font-mono italic">
                  In the Name of Allah, the Most Compassionate, the Most Merciful
                </p>
              </div>

              {/* Magnificent Arabic Calligraphy with high contrast */}
              <div
                className="bg-[#fafaf9] rounded-2xl p-6 sm:p-8 border-2 border-emerald-200/80 text-center my-6 print:border print:border-emerald-700"
              >
                <div
                  className={`font-arabic text-slate-950 font-bold text-center tracking-normal ${getArabicFontSize()}`}
                  dir="rtl"
                  style={{
                    color: '#000000',
                    textShadow: '0 0 0.5px #000000',
                  }}
                >
                  {item.arabicText}
                </div>
              </div>

              {/* Roman Transliteration */}
              {showTransliteration && (
                <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                    Roman Transliteration (Pronunciation Guide)
                  </span>
                  <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed italic">
                    {item.transliteration}
                  </p>
                </div>
              )}

              {/* Urdu Translation */}
              {showUrdu && item.urduTranslation && (
                <div className="mb-6 p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 text-right space-y-1" dir="rtl">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-950 block text-left font-sans">
                    اردو ترجمہ و مفہوم
                  </span>
                  <p className="font-urdu text-lg sm:text-xl text-slate-950 font-semibold leading-[2.4]">
                    {item.urduTranslation}
                  </p>
                </div>
              )}

              {/* English Translation */}
              {showEnglish && (
                <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                    English Translation &amp; Meaning
                  </span>
                  <p className="text-sm sm:text-base text-slate-900 leading-relaxed font-normal">
                    {item.translation}
                  </p>
                </div>
              )}

              {/* Spiritual Virtues & Benefits */}
              {item.virtues && item.virtues.length > 0 && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-sm text-emerald-900">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    Spiritual Virtues &amp; Classical Devotional Benefits:
                  </div>
                  <ul className="list-disc list-inside space-y-1 pl-1 text-slate-800 leading-relaxed font-medium">
                    {item.virtues.map((v, vIdx) => (
                      <li key={vIdx}>{v}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ornamental Page Footer */}
              <div className="mt-8 pt-4 border-t-2 border-emerald-600/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-600 fill-current" />
                  Panj Surah Official Devotional Companion • Salawat Collection
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  {item.title} — Page {idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Status / Footer */}
        <div className="p-3.5 px-6 border-t border-emerald-200 bg-white flex items-center justify-between text-xs text-slate-600 print:hidden select-none">
          <span className="hidden sm:inline">
            💡 Tip: Click <strong>Save / Print PDF</strong> to download a clean offline PDF copy directly through your browser's print dialog.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold cursor-pointer ml-auto"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
