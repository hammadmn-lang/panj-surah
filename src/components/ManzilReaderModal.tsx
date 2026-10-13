import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Volume2,
  VolumeX,
  Share2,
  Check,
  CheckCircle2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Shield,
  Layers,
  Sliders,
  RotateCcw,
} from 'lucide-react';
import { MANZIL_COLLECTION, ManzilSection } from '../data/manzilData';
import confetti from 'canvas-confetti';

interface ManzilReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite?: (id: string) => void;
  favoriteIds?: string[];
  initialCompletedSections?: Record<string, boolean>;
  onRecordSectionRead?: (sectionId: string, isRead?: boolean) => void;
  onRecordFullCompletion?: () => void;
  totalCompletionsCount?: number;
}

export const ManzilReaderModal: React.FC<ManzilReaderModalProps> = ({
  isOpen,
  onClose,
  onToggleFavorite,
  favoriteIds = [],
  initialCompletedSections = {},
  onRecordSectionRead,
  onRecordFullCompletion,
  totalCompletionsCount = 0,
}) => {
  const [viewMode, setViewMode] = useState<'continuous' | 'stepper'>('continuous');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [fontSizeClass, setFontSizeClass] = useState<'text-xl' | 'text-2xl' | 'text-3xl' | 'text-4xl'>('text-3xl');
  const [showUrdu, setShowUrdu] = useState<boolean>(true);
  const [showEnglish, setShowEnglish] = useState<boolean>(true);
  const [showTransliteration, setShowTransliteration] = useState<boolean>(true);
  const [completedSections, setCompletedSections] = useState<Record<string, boolean>>(initialCompletedSections);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [justCompletedFull, setJustCompletedFull] = useState(false);

  if (!isOpen) return null;

  const totalSections = MANZIL_COLLECTION.length;
  const completedCount = Object.values(completedSections).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalSections) * 100);

  const toggleSectionCompleted = (id: string) => {
    const nextVal = !completedSections[id];
    setCompletedSections((prev) => ({ ...prev, [id]: nextVal }));
    onRecordSectionRead?.(id, nextVal);

    const newCompletedCount = completedCount + (nextVal ? 1 : -1);
    if (newCompletedCount === totalSections && nextVal) {
      onRecordFullCompletion?.();
      setJustCompletedFull(true);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#6ee7b7', '#f59e0b'],
        });
      } catch {
        // Ignore
      }
    }
  };

  const handleMarkAllCompleted = () => {
    const allDone: Record<string, boolean> = {};
    MANZIL_COLLECTION.forEach((item) => {
      allDone[item.id] = true;
      onRecordSectionRead?.(item.id, true);
    });
    setCompletedSections(allDone);
    onRecordFullCompletion?.();
    setJustCompletedFull(true);
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
      });
    } catch {
      // Ignore
    }
  };

  const handleCopySection = (item: ManzilSection) => {
    const text = `${item.title}\n\n${item.arabicText}\n\nTransliteration:\n${item.transliteration}\n\nEnglish Translation:\n${item.translation}\n\nUrdu Translation:\n${item.urduTranslation || ''}\n\nReference: ${item.reference}\nBenefit: ${item.benefit}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const fullText = MANZIL_COLLECTION.map(
      (item) => `${item.title}\n${item.arabicText}\n\n${item.translation}\n${item.urduTranslation || ''}\n`
    ).join('\n---\n\n');
    navigator.clipboard.writeText(`MANZIL (منزل مبارک) - COMPLETE PROTECTIVE RUQYAH\n\n${fullText}`);
    setCopiedId('all');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSpeak = (item: ManzilSection) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not available in your browser.');
      return;
    }

    if (speakingId === item.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `${item.title}. ${item.translation}. Benefit: ${item.benefit}`
    );
    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(item.id);
    window.speechSynthesis.speak(utterance);
  };

  const handleResetProgress = () => {
    if (confirm('Reset your Manzil recitation progress for this session?')) {
      setCompletedSections({});
    }
  };

  const currentItem = MANZIL_COLLECTION[activeStep] || MANZIL_COLLECTION[0];

  return (
    <div
      id="manzil-reader-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400 shrink-0">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-serif text-white">
                  منزل مبارک — Complete Manzil Reader
                </h3>
                <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 font-medium">
                  33 Verses
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Quranic Ruqyah for divine protection against evil eye, magic, fear & illness
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors cursor-pointer"
              title="Copy all 18 sections of Manzil"
            >
              {copiedId === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedId === 'all' ? 'Copied All!' : 'Copy All'}</span>
            </button>

            <button
              id="close-manzil-modal-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Close reader"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Progress, Toggles & Font Controls */}
        <div className="px-4 py-3 border-b border-neutral-800 bg-neutral-900/90 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Progress Indicator */}
          <div className="flex items-center gap-2.5">
            <div className="w-24 sm:w-36 h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-neutral-300 font-mono text-[11px]">
              {completedCount}/{totalSections} ({progressPercent}%)
            </span>
            {completedCount > 0 && (
              <button
                onClick={handleResetProgress}
                className="text-neutral-500 hover:text-neutral-300 transition-colors p-1"
                title="Reset progress"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}

            <button
              id="mark-all-manzil-read-btn"
              onClick={handleMarkAllCompleted}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer shadow-sm ${
                completedCount === totalSections
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300'
              }`}
              title="Mark all 18 sections as read and record in your profile statistics"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {completedCount === totalSections ? '✓ Read (Recorded in Profile)' : 'Mark Full Manzil Read (+1 Profile)'}
              </span>
            </button>
          </div>

          {/* View Mode & Toggles */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* View Mode Selector */}
            <div className="inline-flex rounded-xl p-0.5 bg-neutral-950 border border-neutral-800">
              <button
                onClick={() => setViewMode('continuous')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'continuous'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Continuous
              </button>
              <button
                onClick={() => setViewMode('stepper')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'stepper'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Card by Card
              </button>
            </div>

            {/* Translation Toggles */}
            <button
              onClick={() => setShowUrdu(!showUrdu)}
              className={`px-2 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                showUrdu
                  ? 'bg-emerald-950/70 border-emerald-700 text-emerald-300'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-500'
              }`}
              title="Toggle Urdu Translation"
            >
              اردو
            </button>

            <button
              onClick={() => setShowEnglish(!showEnglish)}
              className={`px-2 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                showEnglish
                  ? 'bg-emerald-950/70 border-emerald-700 text-emerald-300'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-500'
              }`}
              title="Toggle English Translation"
            >
              EN
            </button>

            <button
              onClick={() => setShowTransliteration(!showTransliteration)}
              className={`px-2 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                showTransliteration
                  ? 'bg-emerald-950/70 border-emerald-700 text-emerald-300'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-500'
              }`}
              title="Toggle Transliteration"
            >
              Translit
            </button>

            {/* Font Size controls */}
            <div className="inline-flex items-center gap-1 pl-1">
              <button
                onClick={() => {
                  if (fontSizeClass === 'text-4xl') setFontSizeClass('text-3xl');
                  else if (fontSizeClass === 'text-3xl') setFontSizeClass('text-2xl');
                  else if (fontSizeClass === 'text-2xl') setFontSizeClass('text-xl');
                }}
                disabled={fontSizeClass === 'text-xl'}
                className="px-2 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white disabled:opacity-40 cursor-pointer"
                title="Decrease Arabic font size"
              >
                A-
              </button>
              <button
                onClick={() => {
                  if (fontSizeClass === 'text-xl') setFontSizeClass('text-2xl');
                  else if (fontSizeClass === 'text-2xl') setFontSizeClass('text-3xl');
                  else if (fontSizeClass === 'text-3xl') setFontSizeClass('text-4xl');
                }}
                disabled={fontSizeClass === 'text-4xl'}
                className="px-2 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white disabled:opacity-40 cursor-pointer"
                title="Increase Arabic font size"
              >
                A+
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {viewMode === 'continuous' ? (
            /* Continuous Reading Mode */
            <div className="space-y-6">
              {MANZIL_COLLECTION.map((item, index) => {
                const isCompleted = !!completedSections[item.id];
                const isFav = favoriteIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    id={`manzil-section-${item.sectionNumber}`}
                    className={`rounded-3xl p-5 sm:p-6 border transition-all ${
                      isCompleted
                        ? 'bg-neutral-950/70 border-emerald-800/40 opacity-95'
                        : 'bg-neutral-950/90 border-neutral-800 shadow-md hover:border-neutral-700'
                    }`}
                  >
                    {/* Item Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80 mb-4 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 text-xs font-mono font-bold flex items-center justify-center">
                          {item.sectionNumber}
                        </span>
                        <div>
                          <h4 className="text-sm sm:text-base font-semibold text-white">
                            {item.title}
                          </h4>
                          <span className="text-[11px] text-emerald-400 font-mono">
                            {item.reference}
                            {item.recommendedRepetitions && item.recommendedRepetitions > 1
                              ? ` • Recite ${item.recommendedRepetitions} Times`
                              : ''}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleSectionCompleted(item.id)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                            isCompleted
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                          }`}
                          title="Mark this section as recited"
                        >
                          <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-white' : 'text-neutral-400'}`} />
                          <span className="hidden sm:inline">{isCompleted ? 'Recited' : 'Mark Done'}</span>
                        </button>

                        <button
                          onClick={() => handleCopySection(item)}
                          className="p-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors cursor-pointer"
                          title="Copy this section"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Share2 className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => handleSpeak(item)}
                          className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                            speakingId === item.id
                              ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                          }`}
                          title="Read translation aloud"
                        >
                          {speakingId === item.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>

                        {onToggleFavorite && (
                          <button
                            onClick={() => onToggleFavorite(item.id)}
                            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                              isFav
                                ? 'bg-rose-950/70 border-rose-800 text-rose-400'
                                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                            }`}
                            title="Bookmark"
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-400' : ''}`} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Arabic Verse Body */}
                    <div className="py-2 text-right dir-rtl">
                      <p
                        className={`font-arabic text-emerald-200 leading-[2.3] ${fontSizeClass} tracking-wide select-text`}
                        style={{ wordSpacing: '4px' }}
                      >
                        {item.arabicText}
                      </p>
                    </div>

                    {/* Transliteration */}
                    {showTransliteration && (
                      <div className="mt-3 p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800/60 text-xs sm:text-sm text-neutral-300 italic font-sans leading-relaxed">
                        <strong className="text-emerald-400 font-semibold not-italic text-[11px] uppercase tracking-wider block mb-0.5">
                          Pronunciation:
                        </strong>
                        {item.transliteration}
                      </div>
                    )}

                    {/* Urdu Translation */}
                    {showUrdu && item.urduTranslation && (
                      <div className="mt-3 p-3 rounded-2xl bg-emerald-950/30 border border-emerald-900/40 text-right dir-rtl">
                        <strong className="text-emerald-400 text-xs font-semibold block mb-1">
                          اردو ترجمہ:
                        </strong>
                        <p className="font-arabic text-neutral-200 text-base leading-relaxed">
                          {item.urduTranslation}
                        </p>
                      </div>
                    )}

                    {/* English Translation */}
                    {showEnglish && (
                      <div className="mt-3 p-3 rounded-2xl bg-neutral-900/40 border border-neutral-800/50 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                        <strong className="text-neutral-400 text-[11px] font-semibold uppercase tracking-wider block mb-0.5">
                          English Translation:
                        </strong>
                        {item.translation}
                      </div>
                    )}

                    {/* Virtue / Benefit note */}
                    <div className="mt-3 p-2.5 rounded-xl bg-neutral-900/30 border border-neutral-800/40 text-[11px] text-neutral-400 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{item.benefit}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Card by Card Stepper Mode */
            <div className="max-w-2xl mx-auto space-y-5">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                <span>
                  Section {activeStep + 1} of {totalSections}
                </span>
                <span className="font-mono text-emerald-400">{currentItem.reference}</span>
              </div>

              <div className="rounded-3xl p-6 sm:p-8 bg-neutral-950 border border-neutral-800 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    {currentItem.title}
                  </h4>
                  <button
                    onClick={() => toggleSectionCompleted(currentItem.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      completedSections[currentItem.id]
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{completedSections[currentItem.id] ? 'Recited' : 'Mark as Read'}</span>
                  </button>
                </div>

                {/* Arabic */}
                <div className="py-3 text-right dir-rtl">
                  <p
                    className={`font-arabic text-emerald-200 leading-[2.4] ${fontSizeClass} tracking-wide`}
                    style={{ wordSpacing: '4px' }}
                  >
                    {currentItem.arabicText}
                  </p>
                </div>

                {/* Transliteration */}
                {showTransliteration && (
                  <div className="p-3.5 rounded-2xl bg-neutral-900/70 border border-neutral-800 text-xs sm:text-sm text-neutral-300 italic">
                    <span className="text-emerald-400 block not-italic font-semibold text-[11px] mb-0.5">
                      Transliteration:
                    </span>
                    {currentItem.transliteration}
                  </div>
                )}

                {/* Urdu */}
                {showUrdu && currentItem.urduTranslation && (
                  <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-900/50 text-right dir-rtl">
                    <span className="text-emerald-400 block font-semibold text-xs mb-1">اردو ترجمہ:</span>
                    <p className="font-arabic text-neutral-200 text-base leading-relaxed">
                      {currentItem.urduTranslation}
                    </p>
                  </div>
                )}

                {/* English */}
                {showEnglish && (
                  <div className="p-3.5 rounded-2xl bg-neutral-900/50 border border-neutral-800 text-xs sm:text-sm text-neutral-300">
                    <span className="text-neutral-400 block font-semibold text-[11px] mb-0.5">Translation:</span>
                    {currentItem.translation}
                  </div>
                )}

                {/* Benefit */}
                <div className="p-3 rounded-2xl bg-neutral-900/40 border border-neutral-800 text-xs text-neutral-400 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{currentItem.benefit}</span>
                </div>
              </div>

              {/* Stepper Navigation */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  disabled={activeStep === 0}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 disabled:opacity-40 text-xs font-semibold transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {MANZIL_COLLECTION.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveStep(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        activeStep === i
                          ? 'w-6 bg-emerald-500'
                          : completedSections[MANZIL_COLLECTION[i].id]
                          ? 'bg-emerald-800'
                          : 'bg-neutral-800'
                      }`}
                      title={`Go to section ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setActiveStep((prev) => Math.min(totalSections - 1, prev + 1))}
                  disabled={activeStep === totalSections - 1}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 text-xs font-semibold shadow-md transition-all cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
          <div className="text-xs text-neutral-400 hidden sm:flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Recite daily in morning & evening for continuous spiritual protection.</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {completedCount === totalSections && (
              <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Full Manzil Completed!
              </span>
            )}
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              Done Reading
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
