import React, { useState } from 'react';
import { Sparkles, Heart, Plus, RotateCcw, Volume2, Share2, Check, BookOpen, Award, CheckCircle2 } from 'lucide-react';
import { DuroodItem, UserProfile } from '../types';
import { DUROOD_COLLECTION } from '../data/durood';
import { playCompletionChime, playTasbeehClick } from '../utils/audioAlarm';

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
  const [showUrdu, setShowUrdu] = useState<boolean>(userProfile.language === 'ur');
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const totalDuroodRecited = Object.values(userProfile.duroodCounts).reduce(
    (a: number, b: number) => a + (Number(b) || 0),
    0
  );

  return (
    <div className="space-y-6 pb-20 sm:pb-12 max-w-4xl mx-auto px-2 sm:px-0 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
            <Heart className="w-3.5 h-3.5 fill-current text-rose-400" />
            Salawat & Durood Sharif Collection
          </div>
          <h2 className="text-2xl sm:text-3xl font-medium font-serif tracking-tight text-white">
            Sending Blessings Upon The Prophet <span className="font-arabic text-2xl text-emerald-400">ﷺ</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
            "Indeed, Allah and His angels send blessings upon the Prophet. O you who have believed, ask [Allah to confer] blessings upon him and ask [Allah to grant him] peace." (Surah Al-Ahzab 33:56)
          </p>
        </div>

        {/* Lifetime Salawat Tally Badge */}
        <div className="bg-neutral-950/80 rounded-2xl p-4 border border-neutral-800 text-center min-w-[160px] shrink-0">
          <span className="text-xs text-neutral-400 font-medium">Total Salawat Recited</span>
          <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">
            {totalDuroodRecited.toLocaleString()}
          </div>
          <span className="text-[10px] text-neutral-500">Recitations logged</span>
        </div>
      </div>

      {/* Durood Selection Carousel / Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DUROOD_COLLECTION.map((d) => {
          const isSelected = selectedDurood.id === d.id;
          const count = userProfile.duroodCounts[d.id] || 0;
          return (
            <button
              key={d.id}
              id={`select-durood-${d.id}`}
              onClick={() => setSelectedDurood(d)}
              className={`p-3 rounded-2xl border text-left transition-all shrink-0 cursor-pointer min-w-[150px] ${
                isSelected
                  ? 'bg-emerald-950/60 text-emerald-200 border-emerald-700/60 shadow-md'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
              }`}
            >
              <div className="text-xs font-semibold truncate text-white">{d.title}</div>
              <div className="flex items-center justify-between text-[11px] mt-1 opacity-80 text-neutral-400">
                <span className="font-arabic text-emerald-400">{d.arabicTitle}</span>
                <span className="font-mono font-bold text-neutral-200">{count}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Selected Durood Detailed Card */}
      <div className="bg-neutral-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-800 space-y-6">
        {/* Top Header of Card */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              {selectedDurood.reference}
            </span>
            <h3 className="text-xl sm:text-2xl font-medium font-serif text-white">
              {selectedDurood.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Urdu Toggle */}
            <button
              onClick={() => setShowUrdu(!showUrdu)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                showUrdu
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {showUrdu ? 'Urdu Active' : 'Show Urdu'}
            </button>

            {/* Copy button */}
            <button
              id="copy-durood-btn"
              onClick={() => handleCopyText(selectedDurood)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer border border-neutral-700"
            >
              {copiedId === selectedDurood.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
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

        {/* Large Beautiful Arabic Display */}
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-950/70 border border-neutral-800 text-center relative overflow-hidden">
          <div className="font-arabic text-2xl sm:text-3xl lg:text-4xl text-neutral-100 leading-loose selection:bg-emerald-600 selection:text-white" dir="rtl">
            {selectedDurood.arabicText}
          </div>
        </div>

        {/* Transliteration */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Transliteration</span>
          <p className="text-sm sm:text-base text-emerald-300 font-medium italic leading-relaxed">
            {selectedDurood.transliteration}
          </p>
        </div>

        {/* English Translation */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">English Translation</span>
          <p className="text-sm text-neutral-300 leading-relaxed">
            {selectedDurood.translation}
          </p>
        </div>

        {/* Urdu Translation */}
        {showUrdu && selectedDurood.urduTranslation && (
          <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-1 text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block text-left">اردو ترجمہ</span>
            <p className="font-arabic text-base sm:text-lg text-neutral-200 leading-loose" dir="rtl">
              {selectedDurood.urduTranslation}
            </p>
          </div>
        )}

        {/* Virtues List */}
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/30 text-xs text-amber-200 space-y-1.5">
          <div className="font-semibold flex items-center gap-1.5 text-sm text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Spiritual Benefits & Virtues:
          </div>
          <ul className="list-disc list-inside space-y-1 pl-1 opacity-90 leading-relaxed text-neutral-300">
            {selectedDurood.virtues.map((v, idx) => (
              <li key={idx}>{v}</li>
            ))}
          </ul>
        </div>

        {/* Interactive Salawat Counter Box */}
        <div className="p-6 rounded-3xl bg-neutral-950/60 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-neutral-400">Recitation Progress</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-white">
                  {currentCount}
                </span>
                <span className="text-xs text-neutral-400 font-mono">/ {target} Target</span>
              </div>
            </div>

            <button
              onClick={() => onResetDurood(selectedDurood.id)}
              className="p-2 rounded-xl text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Reset Counter"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Big Tap Recitation Button */}
          <button
            id="tap-salawat-btn"
            onClick={() => handleTapCount(selectedDurood)}
            className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-semibold text-base shadow-lg shadow-emerald-950/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer select-none"
          >
            <Heart className="w-5 h-5 fill-current text-rose-300 animate-pulse" />
            <span>Tap to Recite Salawat (+1)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
