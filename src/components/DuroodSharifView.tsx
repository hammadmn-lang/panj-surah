import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Plus,
  RotateCcw,
  Volume2,
  Share2,
  Check,
  BookOpen,
  Award,
  CheckCircle2,
  FileText,
  Printer,
  Eye,
  Type,
  ExternalLink,
} from 'lucide-react';
import { DuroodItem, UserProfile } from '../types';
import { DUROOD_COLLECTION } from '../data/durood';
import { playCompletionChime, playTasbeehClick } from '../utils/audioAlarm';
import { DuroodPdfViewerModal } from './DuroodPdfViewerModal';

interface DuroodSharifViewProps {
  userProfile: UserProfile;
  onIncrementDurood: (duroodId: string, count: number) => void;
  onResetDurood: (duroodId: string) => void;
}

export const DuroodSharifView: React.FC<DuroodSharifViewProps> = ({
  userProfile,
  onIncrementDurood,
  onResetDurood,
}) => {
  const [selectedDurood, setSelectedDurood] = useState<DuroodItem>(DUROOD_COLLECTION[0]);
  const [showUrdu, setShowUrdu] = useState<boolean>(userProfile.language === 'ur' || true);
  const [showEnglish, setShowEnglish] = useState<boolean>(true);
  const [showTransliteration, setShowTransliteration] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [arabicFontSize, setArabicFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');

  // PDF Viewer Modal States
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [selectedDuroodForPdf, setSelectedDuroodForPdf] = useState<DuroodItem | null>(null);

  const isDark = userProfile.theme === 'dark' || userProfile.theme === 'emerald-dark';
  const isBright = userProfile.theme === 'bright';

  const currentCount = userProfile.duroodCounts[selectedDurood.id] || 0;
  const target = selectedDurood.recommendedCount;
  const progressPercent = Math.min(100, Math.round((currentCount / target) * 100));

  const handleTapCount = (durood: DuroodItem) => {
    playTasbeehClick(20);
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch {
        // ignore
      }
    }

    const nextVal = (userProfile.duroodCounts[durood.id] || 0) + 1;
    onIncrementDurood(durood.id, nextVal);

    if (nextVal === target) {
      playCompletionChime();
    }
  };

  const handleCopyText = (durood: DuroodItem) => {
    const text = `${durood.title}\n\n${durood.arabicText}\n\nTransliteration: ${durood.transliteration}\n\nTranslation: ${durood.translation}\n\nReference: ${durood.reference}`;
    navigator.clipboard.writeText(text);
    setCopiedId(durood.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenPdf = (duroodToView?: DuroodItem) => {
    setSelectedDuroodForPdf(duroodToView || selectedDurood);
    setIsPdfModalOpen(true);
  };

  const totalDuroodRecited = Object.values(userProfile.duroodCounts).reduce(
    (a: number, b: number) => a + (Number(b) || 0),
    0
  );

  const getArabicSizeClass = () => {
    switch (arabicFontSize) {
      case 'normal':
        return 'text-2xl sm:text-3xl leading-[2.5]';
      case 'large':
        return 'text-3xl sm:text-4xl lg:text-[40px] leading-[2.7] font-semibold';
      case 'xlarge':
        return 'text-4xl sm:text-5xl lg:text-[48px] leading-[3.0] font-bold';
    }
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-12 max-w-4xl mx-auto px-2 sm:px-0 animate-fade-in">
      {/* Header Banner - High Contrast & Theme Adaptive */}
      <div
        className={`rounded-3xl p-6 sm:p-8 shadow-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all ${
          isBright
            ? 'bg-white border-2 border-slate-900 text-black shadow-lg ring-1 ring-slate-900'
            : isDark
            ? 'bg-gradient-to-r from-neutral-950 via-emerald-950/70 to-neutral-950 border-emerald-800/60 text-white shadow-2xl shadow-emerald-950/60'
            : 'bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 border-emerald-700 text-white shadow-lg shadow-emerald-900/20'
        }`}
      >
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                isBright
                  ? 'bg-black text-white'
                  : isDark
                  ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-700/60'
                  : 'bg-emerald-900/80 text-emerald-100 border border-emerald-600/40'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-current text-rose-400" />
              <span>Salawat &amp; Durood Sharif Collection</span>
            </div>

            {/* Quick PDF Booklet trigger */}
            <button
              onClick={() => handleOpenPdf(selectedDurood)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm ${
                isBright
                  ? 'bg-emerald-100 text-emerald-950 border border-emerald-800 hover:bg-emerald-200'
                  : isDark
                  ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/50 hover:bg-emerald-500/30'
                  : 'bg-white text-emerald-900 hover:bg-emerald-50'
              }`}
              title="Open Mushaf PDF for large Duroods"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              <span>PDF Reader Option</span>
            </button>
          </div>

          <h2
            className={`text-2xl sm:text-3xl font-medium font-serif tracking-tight ${
              isBright ? 'text-black font-bold' : 'text-white'
            }`}
          >
            Sending Blessings Upon The Prophet <span className="font-arabic text-2xl text-emerald-400">ﷺ</span>
          </h2>
          <p
            className={`text-xs sm:text-sm max-w-xl leading-relaxed ${
              isBright ? 'text-slate-800 font-medium' : isDark ? 'text-neutral-300' : 'text-emerald-100'
            }`}
          >
            "Indeed, Allah and His angels send blessings upon the Prophet. O you who have believed, ask [Allah to confer] blessings upon him and ask [Allah to grant him] peace." (Surah Al-Ahzab 33:56)
          </p>
        </div>

        {/* Lifetime Salawat Tally Badge */}
        <div
          className={`rounded-2xl p-4 border text-center min-w-[160px] shrink-0 ${
            isBright
              ? 'bg-slate-50 border-2 border-slate-900 text-black'
              : isDark
              ? 'bg-neutral-900/90 border border-neutral-700/80 text-white'
              : 'bg-emerald-950/70 border border-emerald-600/50 text-white'
          }`}
        >
          <span
            className={`text-xs font-bold uppercase tracking-wider block ${
              isBright ? 'text-slate-800' : isDark ? 'text-neutral-300' : 'text-emerald-200'
            }`}
          >
            Total Salawat Recited
          </span>
          <div
            className={`text-3xl sm:text-4xl font-extrabold font-mono mt-1 ${
              isBright ? 'text-black' : isDark ? 'text-emerald-400' : 'text-emerald-300'
            }`}
          >
            {totalDuroodRecited.toLocaleString()}
          </div>
          <span
            className={`text-[11px] font-medium block mt-0.5 ${
              isBright ? 'text-slate-700' : isDark ? 'text-neutral-400' : 'text-emerald-200/80'
            }`}
          >
            Recitations logged
          </span>
        </div>
      </div>

      {/* Durood Selection Tabs / Horizontal Grid */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold px-1">
          <span className={isBright ? 'text-black' : isDark ? 'text-neutral-300' : 'text-slate-700'}>
            Select Durood Sharif to Recite or View:
          </span>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">
            {DUROOD_COLLECTION.length} Major Salawat Available
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {DUROOD_COLLECTION.map((d) => {
            const isSelected = selectedDurood.id === d.id;
            const count = userProfile.duroodCounts[d.id] || 0;
            return (
              <button
                key={d.id}
                id={`select-durood-${d.id}`}
                onClick={() => setSelectedDurood(d)}
                className={`p-3 rounded-2xl border text-left transition-all shrink-0 cursor-pointer min-w-[165px] ${
                  isSelected
                    ? isBright
                      ? 'bg-white border-2 border-black text-black shadow-md ring-2 ring-black'
                      : isDark
                      ? 'bg-emerald-950/80 text-white border-2 border-emerald-400 shadow-md shadow-emerald-950/50'
                      : 'bg-emerald-50 border-2 border-emerald-600 text-emerald-950 shadow-sm'
                    : isBright
                    ? 'bg-white border border-slate-300 text-slate-800 hover:border-slate-800'
                    : isDark
                    ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-850'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span
                    className={`text-xs font-bold truncate ${
                      isSelected
                        ? isBright
                          ? 'text-black'
                          : isDark
                          ? 'text-emerald-300'
                          : 'text-emerald-950'
                        : isBright
                        ? 'text-black'
                        : isDark
                        ? 'text-neutral-200'
                        : 'text-slate-900'
                    }`}
                  >
                    {d.title.split('(')[0].trim()}
                  </span>
                  {d.isBigger && (
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 shrink-0">
                      PDF
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] mt-1 font-medium">
                  <span
                    className={`font-arabic text-sm ${
                      isSelected
                        ? isBright
                          ? 'text-black font-bold'
                          : 'text-emerald-400 font-bold'
                        : isBright
                        ? 'text-slate-700'
                        : 'text-neutral-400'
                    }`}
                  >
                    {d.arabicTitle}
                  </span>
                  <span
                    className={`font-mono font-bold text-xs ${
                      isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500'
                    }`}
                  >
                    {count}x
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Selected Durood Detailed Card - High Contrast & Clean Background */}
      <div
        className={`rounded-3xl p-6 sm:p-8 shadow-sm border space-y-6 transition-all ${
          isBright
            ? 'bg-white border-2 border-slate-900 text-black shadow-md'
            : isDark
            ? 'bg-neutral-900/95 border border-neutral-800 text-white shadow-xl'
            : 'bg-white border border-slate-200/90 text-slate-900 shadow-sm'
        }`}
      >
        {/* Top Header of Card */}
        <div
          className={`flex flex-wrap items-center justify-between gap-4 pb-4 border-b ${
            isBright ? 'border-slate-300' : isDark ? 'border-neutral-800' : 'border-slate-100'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-extrabold uppercase tracking-wider ${
                  isBright ? 'text-black' : isDark ? 'text-emerald-400' : 'text-emerald-700'
                }`}
              >
                {selectedDurood.reference}
              </span>
              {selectedDurood.isBigger && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300">
                  Comprehensive Litany
                </span>
              )}
            </div>
            <h3
              className={`text-xl sm:text-2xl font-bold font-serif ${
                isBright ? 'text-black' : isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {selectedDurood.title}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* PDF View Button (Explicitly Requested: "like manzil and surah which are bigger option to see in PDF. also drood which are bigger make an option of pdf for them") */}
            <button
              id="btn-view-durood-pdf"
              onClick={() => handleOpenPdf(selectedDurood)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95"
              title="Open full page high-resolution PDF for this Durood (supports print and save)"
            >
              <FileText className="w-4 h-4" />
              <span>View in PDF</span>
            </button>

            {/* Font Size Adjuster for Arabic Calligraphy */}
            <div
              className={`flex items-center rounded-xl p-0.5 border text-xs font-bold ${
                isBright
                  ? 'bg-slate-100 border-slate-400 text-black'
                  : isDark
                  ? 'bg-neutral-800 border-neutral-700 text-neutral-200'
                  : 'bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              <button
                onClick={() => setArabicFontSize('normal')}
                className={`px-2 py-1 rounded-lg cursor-pointer ${
                  arabicFontSize === 'normal'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'hover:text-emerald-600'
                }`}
                title="Normal Font Size"
              >
                A
              </button>
              <button
                onClick={() => setArabicFontSize('large')}
                className={`px-2 py-1 rounded-lg cursor-pointer ${
                  arabicFontSize === 'large'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'hover:text-emerald-600'
                }`}
                title="Large Font Size"
              >
                A+
              </button>
              <button
                onClick={() => setArabicFontSize('xlarge')}
                className={`px-2 py-1 rounded-lg cursor-pointer ${
                  arabicFontSize === 'xlarge'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'hover:text-emerald-600'
                }`}
                title="Extra Large for Elderly"
              >
                XL
              </button>
            </div>

            {/* Urdu Toggle */}
            <button
              onClick={() => setShowUrdu(!showUrdu)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                showUrdu
                  ? isBright
                    ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                    : 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60'
                  : isBright
                  ? 'bg-slate-100 text-slate-800 border-slate-300'
                  : 'bg-neutral-800 text-neutral-300 border-neutral-700'
              }`}
            >
              {showUrdu ? 'اردو ON' : 'اردو OFF'}
            </button>

            {/* Copy button */}
            <button
              id="copy-durood-btn"
              onClick={() => handleCopyText(selectedDurood)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                isBright
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
                  : isDark
                  ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
              }`}
            >
              {copiedId === selectedDurood.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Large Beautiful Arabic Display - High Contrast & Clean Background */}
        <div
          className={`p-6 sm:p-10 rounded-3xl text-center relative overflow-hidden transition-all border-2 ${
            isBright
              ? 'bg-[#ffffff] border-black shadow-sm'
              : isDark
              ? 'bg-neutral-950/80 border-neutral-800 shadow-inner'
              : 'bg-[#fcfbf9] border-emerald-200/80 shadow-xs'
          }`}
        >
          <div
            className={`font-arabic text-center leading-loose select-text ${getArabicSizeClass()} ${
              isBright
                ? 'text-black font-bold'
                : isDark
                ? 'text-neutral-50 drop-shadow-sm'
                : 'text-slate-950 font-medium'
            }`}
            dir="rtl"
            style={{
              textShadow: isBright ? '0 0 0.5px #000' : undefined,
            }}
          >
            {selectedDurood.arabicText}
          </div>
        </div>

        {/* Roman Transliteration */}
        {showTransliteration && (
          <div
            className={`p-4 rounded-2xl border space-y-1 ${
              isBright
                ? 'bg-slate-50 border-slate-300'
                : isDark
                ? 'bg-neutral-950/60 border-neutral-800'
                : 'bg-emerald-50/50 border-emerald-100'
            }`}
          >
            <span
              className={`text-[11px] font-extrabold uppercase tracking-wider block ${
                isBright ? 'text-black' : isDark ? 'text-neutral-400' : 'text-emerald-800'
              }`}
            >
              Roman Transliteration
            </span>
            <p
              className={`text-sm sm:text-base font-medium leading-relaxed italic ${
                isBright ? 'text-slate-900 font-semibold' : isDark ? 'text-emerald-300' : 'text-emerald-900'
              }`}
            >
              {selectedDurood.transliteration}
            </p>
          </div>
        )}

        {/* Urdu Translation */}
        {showUrdu && selectedDurood.urduTranslation && (
          <div
            className={`p-5 rounded-2xl border space-y-1 text-right ${
              isBright
                ? 'bg-amber-50/70 border-2 border-amber-300'
                : isDark
                ? 'bg-neutral-950/60 border-neutral-800'
                : 'bg-amber-50/50 border-amber-200'
            }`}
          >
            <span
              className={`text-xs font-bold uppercase tracking-wider block text-left font-sans ${
                isBright ? 'text-black' : isDark ? 'text-neutral-400' : 'text-amber-900'
              }`}
            >
              اردو ترجمہ
            </span>
            <p
              className={`font-urdu text-base sm:text-lg leading-loose ${
                isBright ? 'text-black font-semibold' : isDark ? 'text-neutral-200' : 'text-slate-900 font-normal'
              }`}
              dir="rtl"
            >
              {selectedDurood.urduTranslation}
            </p>
          </div>
        )}

        {/* English Translation */}
        {showEnglish && (
          <div
            className={`p-4 rounded-2xl border space-y-1 ${
              isBright
                ? 'bg-slate-50 border-slate-300'
                : isDark
                ? 'bg-neutral-950/60 border-neutral-800'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span
              className={`text-[11px] font-extrabold uppercase tracking-wider block ${
                isBright ? 'text-black' : isDark ? 'text-neutral-400' : 'text-slate-600'
              }`}
            >
              English Translation
            </span>
            <p
              className={`text-sm sm:text-base leading-relaxed ${
                isBright ? 'text-black font-semibold' : isDark ? 'text-neutral-300' : 'text-slate-800'
              }`}
            >
              {selectedDurood.translation}
            </p>
          </div>
        )}

        {/* Virtues List */}
        {selectedDurood.virtues && selectedDurood.virtues.length > 0 && (
          <div
            className={`p-4 sm:p-5 rounded-2xl border text-xs space-y-2 ${
              isBright
                ? 'bg-emerald-50 border-2 border-emerald-600 text-black'
                : isDark
                ? 'bg-amber-950/20 border-amber-900/40 text-amber-200'
                : 'bg-amber-50/70 border-amber-200 text-amber-950'
            }`}
          >
            <div
              className={`font-bold flex items-center gap-1.5 text-sm ${
                isBright ? 'text-black' : isDark ? 'text-amber-300' : 'text-amber-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Spiritual Virtues &amp; Devotional Benefits:</span>
            </div>
            <ul
              className={`list-disc list-inside space-y-1 pl-1 leading-relaxed ${
                isBright ? 'text-slate-900 font-semibold' : isDark ? 'text-neutral-300' : 'text-slate-800'
              }`}
            >
              {selectedDurood.virtues.map((v, idx) => (
                <li key={idx}>{v}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Interactive Salawat Counter Box */}
        <div
          className={`p-6 rounded-3xl border space-y-4 ${
            isBright
              ? 'bg-slate-50 border-2 border-black'
              : isDark
              ? 'bg-neutral-950/70 border-neutral-800'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isBright ? 'text-black' : isDark ? 'text-neutral-400' : 'text-slate-600'
                }`}
              >
                Recitation Progress
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span
                  className={`text-3xl sm:text-4xl font-extrabold font-mono ${
                    isBright ? 'text-black' : isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {currentCount}
                </span>
                <span
                  className={`text-xs font-mono font-bold ${
                    isBright ? 'text-slate-800' : isDark ? 'text-neutral-400' : 'text-slate-500'
                  }`}
                >
                  / {target} Target
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenPdf(selectedDurood)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  isBright
                    ? 'bg-white border-black text-black hover:bg-slate-100'
                    : isDark
                    ? 'bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700'
                    : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
                }`}
                title="View PDF"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">PDF</span>
              </button>

              <button
                onClick={() => onResetDurood(selectedDurood.id)}
                className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                  isBright
                    ? 'bg-white border-slate-300 text-slate-700 hover:text-rose-600'
                    : isDark
                    ? 'text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 border-neutral-800'
                    : 'text-slate-500 hover:text-rose-600 hover:bg-slate-100 border-slate-200'
                }`}
                title="Reset Counter"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div
            className={`w-full h-3 rounded-full overflow-hidden border ${
              isBright
                ? 'bg-slate-200 border-slate-400'
                : isDark
                ? 'bg-neutral-800 border-neutral-700'
                : 'bg-slate-200 border-slate-300'
            }`}
          >
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isBright
                  ? 'bg-black'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Big Tap Recitation Button */}
          <button
            id="tap-salawat-btn"
            onClick={() => handleTapCount(selectedDurood)}
            className={`w-full py-5 rounded-2xl font-bold text-base shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer select-none ${
              isBright
                ? 'bg-black text-white hover:bg-neutral-900 shadow-slate-900/30'
                : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-emerald-950/40'
            }`}
          >
            <Heart className="w-5 h-5 fill-current text-rose-300 animate-pulse shrink-0" />
            <span>Tap to Recite Salawat (+1)</span>
          </button>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      <DuroodPdfViewerModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        durood={selectedDuroodForPdf || selectedDurood}
        allDuroods={DUROOD_COLLECTION}
      />
    </div>
  );
};
