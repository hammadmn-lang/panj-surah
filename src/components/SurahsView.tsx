import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  Download,
  Check,
  Search,
  Sparkles,
  Volume2,
  VolumeX,
  Type,
  ChevronLeft,
  Share2,
  Bookmark,
  CheckCircle2,
  Info,
  Sliders,
  ExternalLink,
  Layers,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { Surah, UserProfile } from '../types';
import { SURAHS_DATA } from '../data/surahs';
import { downloadSurahAudio, getCachedAudioBlobUrl, isSurahCached, removeCachedSurah } from '../utils/audioCache';
import { SurahPdfViewerModal } from './SurahPdfViewerModal';
import confetti from 'canvas-confetti';

interface SurahsViewProps {
  userProfile: UserProfile;
  onToggleSurahCompleted: (surahId: number, details?: { name: string; arabic: string }) => void;
}

export const SurahsView: React.FC<SurahsViewProps> = ({ userProfile, onToggleSurahCompleted }) => {
  const [activeFilter, setActiveFilter] = useState<'panj' | 'beginner' | 'all'>('panj');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [pdfModalSurah, setPdfModalSurah] = useState<Surah | null>(null);

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Offline Caching State
  const [cachedMap, setCachedMap] = useState<Record<number, boolean>>({});
  const [downloadingMap, setDownloadingMap] = useState<Record<number, number>>({}); // surahId -> percent

  // Reader Settings
  const [fontSize, setFontSize] = useState<number>(userProfile.fontSizeArabic || 28);
  const [showTransliteration, setShowTransliteration] = useState(userProfile.showTransliteration);
  const [showTranslation, setShowTranslation] = useState(userProfile.showTranslation);
  const [translationLanguage, setTranslationLanguage] = useState<'both' | 'ur' | 'en'>(
    userProfile.surahTranslationLang || (userProfile.language === 'ur' ? 'ur' : 'both')
  );

  // 11 Ayat per page Mushaf pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const AYAT_PER_PAGE = 11;
  const isAllTranslationsOff = !showTranslation && !showTransliteration;

  // Auto set font to 14 when all translations are switched off
  useEffect(() => {
    if (isAllTranslationsOff) {
      setFontSize(14);
      setCurrentPage(1);
    }
  }, [isAllTranslationsOff]);

  // Check offline cache on mount
  useEffect(() => {
    async function checkCaches() {
      const results: Record<number, boolean> = {};
      for (const surah of SURAHS_DATA) {
        results[surah.id] = await isSurahCached(surah.audioUrl);
      }
      setCachedMap(results);
    }
    checkCaches();
  }, []);

  // Filter surahs
  const filteredSurahs = SURAHS_DATA.filter((s) => {
    const matchesSearch =
      s.nameEnglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nameTransliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nameArabic.includes(searchTerm) ||
      s.meaning.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === 'panj') return s.isPanjSurah;
    if (activeFilter === 'beginner') return s.isBeginnerRecommended;
    return true;
  });

  // Handle open Surah reader
  const handleOpenSurah = async (surah: Surah) => {
    setSelectedSurah(surah);
    setIsPlaying(false);
    setCurrentTime(0);

    // Check if offline cached audio exists
    const cachedUrl = await getCachedAudioBlobUrl(surah.audioUrl);
    setAudioBlobUrl(cachedUrl);
  };

  const handleCloseSurah = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setSelectedSurah(null);
  };

  // Audio Controls
  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.error('Audio play error:', e));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleChangePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  // Download Offline handler
  const handleDownloadOffline = async (surah: Surah, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      setDownloadingMap((prev) => ({ ...prev, [surah.id]: 1 }));
      await downloadSurahAudio(surah.id, surah.audioUrl, (percent) => {
        setDownloadingMap((prev) => ({ ...prev, [surah.id]: percent }));
      });
      setCachedMap((prev) => ({ ...prev, [surah.id]: true }));
      setDownloadingMap((prev) => {
        const next = { ...prev };
        delete next[surah.id];
        return next;
      });

      // Update active blob if reader is open
      if (selectedSurah?.id === surah.id) {
        const blobUrl = await getCachedAudioBlobUrl(surah.audioUrl);
        setAudioBlobUrl(blobUrl);
      }
    } catch (err) {
      alert('Could not download audio for offline use.');
      setDownloadingMap((prev) => {
        const next = { ...prev };
        delete next[surah.id];
        return next;
      });
    }
  };

  const handleRemoveOffline = async (surah: Surah, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    await removeCachedSurah(surah.audioUrl);
    setCachedMap((prev) => ({ ...prev, [surah.id]: false }));
    if (selectedSurah?.id === surah.id) {
      setAudioBlobUrl(null);
    }
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-12 max-w-5xl mx-auto px-2 sm:px-0 animate-fade-in">
      {/* Reader View Modal / Screen */}
      {selectedSurah ? (
        <div id="surah-reader-container" className="bg-neutral-900 rounded-3xl p-5 sm:p-8 shadow-2xl border border-neutral-800 animate-scale-in space-y-6">
          {/* Top Bar with Back Button & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
            <button
              id="back-to-surahs-list-btn"
              onClick={handleCloseSurah}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-medium transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Surahs
            </button>

            {/* Title */}
            <div className="text-center">
              <h2 className="font-serif font-medium text-lg sm:text-xl text-white">
                Surah {selectedSurah.nameTransliteration} ({selectedSurah.nameArabic})
              </h2>
              <p className="text-xs text-neutral-400">
                {selectedSurah.nameEnglish} • {selectedSurah.versesCount} Verses • {selectedSurah.revelationType}
              </p>
            </div>

            {/* PDF View & Read / Memorized Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPdfModalSurah(selectedSurah)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 transition-all cursor-pointer dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60"
                title="Open Big Surah in In-App Printable PDF Mushaf"
              >
                <FileText className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>Open as PDF</span>
              </button>

              <button
                id="mark-surah-completed-btn"
                onClick={() => {
                  const wasCompleted = userProfile.completedSurahIds.includes(selectedSurah.id);
                  onToggleSurahCompleted(selectedSurah.id, {
                    name: selectedSurah.nameTransliteration,
                    arabic: selectedSurah.nameArabic,
                  });
                  if (!wasCompleted) {
                    try {
                      confetti({
                        particleCount: 70,
                        spread: 60,
                        origin: { y: 0.6 },
                      });
                    } catch {
                      // Ignore
                    }
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  userProfile.completedSurahIds.includes(selectedSurah.id)
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{userProfile.completedSurahIds.includes(selectedSurah.id) ? 'Memorized / Read' : 'Mark as Read'}</span>
              </button>
            </div>
          </div>

          {/* Reader Preferences Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800 text-xs">
            {/* Font Size controls */}
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-neutral-400" />
              <span className="font-medium text-neutral-300">Arabic Size:</span>
              <button
                onClick={() => setFontSize((f) => Math.max(12, f - 2))}
                className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold"
              >
                -
              </button>
              <span className="font-mono font-bold text-emerald-400">{fontSize}px</span>
              <button
                onClick={() => setFontSize((f) => Math.min(46, f + 2))}
                className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold"
              >
                +
              </button>
            </div>

            {/* Quick 11 Ayat / Page (Arabic Only) Mode Toggle */}
            <button
              onClick={() => {
                if (isAllTranslationsOff) {
                  setShowTranslation(true);
                  setShowTransliteration(true);
                  setFontSize(28);
                } else {
                  setShowTranslation(false);
                  setShowTransliteration(false);
                  setFontSize(14);
                  setCurrentPage(1);
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isAllTranslationsOff
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200 dark:bg-neutral-800 dark:text-neutral-300'
              }`}
              title="When all translations are switched off, default font is 14 and exactly 11 ayat per page are displayed"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isAllTranslationsOff ? '📖 11 Ayat/Page Active (Font 14)' : '📖 Switch to 11 Ayat/Page (No Translation)'}</span>
            </button>

            {/* Toggle Transliteration & Translation & Translation Language */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowTransliteration(!showTransliteration)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  showTransliteration
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                Transliteration
              </button>
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  showTranslation
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                Translation
              </button>

              {/* Urdu / English / Both Switcher */}
              {showTranslation && (
                <div className="flex items-center bg-neutral-800/90 rounded-lg p-0.5 border border-neutral-700">
                  <button
                    onClick={() => setTranslationLanguage('en')}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                      translationLanguage === 'en'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setTranslationLanguage('ur')}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all font-urdu ${
                      translationLanguage === 'ur'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    اردو
                  </button>
                  <button
                    onClick={() => setTranslationLanguage('both')}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                      translationLanguage === 'both'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Both
                  </button>
                </div>
              )}
            </div>

            {/* Offline Audio Badge / Button */}
            <div>
              {cachedMap[selectedSurah.id] ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-900/30 text-emerald-300 border border-emerald-800/40 font-semibold">
                  <Check className="w-3.5 h-3.5" /> Offline Cached
                </span>
              ) : downloadingMap[selectedSurah.id] ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950 text-amber-300 font-semibold">
                  Downloading {downloadingMap[selectedSurah.id]}%
                </span>
              ) : (
                <button
                  onClick={() => handleDownloadOffline(selectedSurah)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-emerald-600 hover:text-white text-neutral-300 font-medium transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download Offline
                </button>
              )}
            </div>
          </div>

          {/* Sticky Audio Player Bar */}
          <div className="sticky top-20 z-30 p-4 rounded-2xl bg-neutral-900 text-white shadow-2xl border border-neutral-800 backdrop-blur-md">
            {/* Hidden native audio element */}
            <audio
              ref={audioRef}
              src={audioBlobUrl || selectedSurah.audioUrl}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => {
                if (isRepeat && audioRef.current) {
                  audioRef.current.currentTime = 0;
                  audioRef.current.play();
                } else {
                  setIsPlaying(false);
                }
              }}
            />

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                {/* Play/Pause Button */}
                <button
                  id="surah-audio-play-pause-btn"
                  onClick={togglePlayAudio}
                  className="w-12 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-950/50 transition-transform active:scale-95 cursor-pointer shrink-0"
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                </button>

                {/* Reciter Info & Time */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs font-medium text-neutral-400 mb-1">
                    <span className="truncate">Reciter: Sheikh Mishary Rashid Alafasy</span>
                    <span className="font-mono text-emerald-400">
                      {formatSeconds(currentTime)} / {formatSeconds(duration)}
                    </span>
                  </div>
                  {/* Seek bar */}
                  <input
                    id="audio-seek-slider"
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Speed & Repeat controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      const speeds = [0.75, 1.0, 1.25, 1.5];
                      const nextIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
                      handleChangePlaybackRate(speeds[nextIndex]);
                    }}
                    className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-mono font-bold text-emerald-400"
                    title="Change Playback Speed"
                  >
                    {playbackRate}x
                  </button>

                  <button
                    onClick={() => setIsRepeat(!isRepeat)}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      isRepeat ? 'bg-emerald-600 text-white font-bold' : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                    title="Repeat Surah"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Virtues Banner */}
          {selectedSurah.virtues.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-900/40 text-xs text-amber-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-400">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Virtues & Hadith on Surah {selectedSurah.nameTransliteration}:
              </div>
              <ul className="list-disc list-inside space-y-0.5 opacity-90 pl-1">
                {selectedSurah.virtues.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Bismillah Header (except for Surah At-Tawbah) */}
          {selectedSurah.number !== 9 && (
            <div className="text-center py-6 border-b border-neutral-800">
              <div className="font-arabic text-3xl sm:text-4xl text-emerald-400 leading-relaxed">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
              <p className="text-xs text-neutral-400 mt-1 italic">
                In the name of Allah, the Entirely Merciful, the Especially Merciful
              </p>
            </div>
          )}

          {/* Verses Content: 11 Ayat/Page Mushaf Mode when translations off, OR full continuous translated list */}
          {isAllTranslationsOff ? (
            (() => {
              const totalPages = Math.ceil(selectedSurah.verses.length / AYAT_PER_PAGE);
              const startIdx = (currentPage - 1) * AYAT_PER_PAGE;
              const endIdx = Math.min(startIdx + AYAT_PER_PAGE, selectedSurah.verses.length);
              const currentVerses = selectedSurah.verses.slice(startIdx, endIdx);

              return (
                <div className="space-y-5 pt-2">
                  {/* Top Pagination Control Bar */}
                  <div className="p-3.5 rounded-2xl bg-white border border-emerald-200/90 flex flex-wrap items-center justify-between gap-3 shadow-xs dark:bg-neutral-900/90 dark:border-neutral-800">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage <= 1}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1.5 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Prev 11 Ayat</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-950 dark:text-emerald-400">
                        Page {currentPage} of {totalPages}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        (Ayat {startIdx + 1} – {endIdx})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Jump to page selector */}
                      <select
                        value={currentPage}
                        onChange={(e) => setCurrentPage(Number(e.target.value))}
                        className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold cursor-pointer dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700"
                        title="Jump to page"
                      >
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            Page {i + 1} (Ayat {i * 11 + 1}–{Math.min((i + 1) * 11, selectedSurah.verses.length)})
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage >= totalPages}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1.5 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700"
                      >
                        <span>Next 11 Ayat</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Mushaf Page Container (11 Ayat styled at font size 14) */}
                  <div className="bg-white rounded-3xl border-2 border-emerald-600/30 p-6 sm:p-9 shadow-md relative dark:bg-neutral-900/90 dark:border-emerald-800/50">
                    <div className="border-b border-emerald-200/60 pb-3 mb-6 flex items-center justify-between text-xs text-emerald-900 font-bold dark:text-emerald-400">
                      <span>سُورَةُ {selectedSurah.nameArabic}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-mono dark:bg-neutral-800 dark:text-neutral-300">
                        11 Ayat / Page Mode (Font: {fontSize}px)
                      </span>
                      <span>{selectedSurah.nameTransliteration}</span>
                    </div>

                    <div
                      className="font-arabic text-right text-slate-900 leading-[2.5] space-y-3 dark:text-neutral-100"
                      dir="rtl"
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {currentVerses.map((verse) => (
                        <span key={verse.id} className="inline ml-2.5">
                          <span className="font-normal text-slate-900 dark:text-neutral-100">
                            {verse.textArabic}
                          </span>
                          <span className="inline-flex items-center justify-center mx-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-mono font-bold border border-emerald-300 select-none dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
                            ۝ {verse.number}
                          </span>
                        </span>
                      ))}
                    </div>

                    <div className="mt-8 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400">
                      <span>Panj Surah Sacred Mushaf</span>
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200 dark:bg-neutral-800 dark:text-emerald-400 dark:border-neutral-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <span>الجزء {selectedSurah.nameArabic}</span>
                    </div>
                  </div>

                  {/* Bottom Pagination Bar */}
                  <div className="p-3.5 rounded-2xl bg-white border border-emerald-200/90 flex flex-wrap items-center justify-between gap-3 shadow-xs dark:bg-neutral-900/90 dark:border-neutral-800">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage <= 1}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1.5 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Prev 11 Ayat</span>
                    </button>

                    <span className="text-xs font-bold text-emerald-950 dark:text-emerald-400">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1.5 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700"
                    >
                      <span>Next 11 Ayat</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="space-y-4 pt-2">
              {selectedSurah.verses.map((verse) => (
                <div
                  key={verse.id}
                  id={`verse-${selectedSurah.id}-${verse.number}`}
                  className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3 transition-colors hover:border-neutral-700 shadow-sm"
                >
                  {/* Verse Number Badge & Arabic Text */}
                  <div className="flex items-start justify-between gap-4">
                    <span className="w-8 h-8 rounded-full bg-neutral-800 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 border border-neutral-700">
                      {verse.number}
                    </span>

                    <div
                      className="font-arabic text-right text-neutral-100 flex-1 leading-loose"
                      style={{ fontSize: `${fontSize}px` }}
                      dir="rtl"
                    >
                      {verse.textArabic}
                    </div>
                  </div>

                  {/* Transliteration */}
                  {showTransliteration && (
                    <div className="text-xs sm:text-sm text-emerald-400 font-medium italic pl-10 leading-relaxed">
                      {verse.transliteration}
                    </div>
                  )}

                  {/* Translations (Urdu / English / Both) */}
                  {showTranslation && (
                    <div className="space-y-2 pl-2 sm:pl-10">
                      {/* Urdu Translation */}
                      {(translationLanguage === 'ur' || translationLanguage === 'both') && verse.translationUr && (
                        <div
                          className="text-sm sm:text-base text-emerald-300/95 font-urdu text-right leading-loose bg-neutral-950/40 p-2.5 rounded-xl border border-neutral-800/80"
                          dir="rtl"
                        >
                          {verse.translationUr}
                        </div>
                      )}

                      {/* English Translation */}
                      {(translationLanguage === 'en' || translationLanguage === 'both') && (
                        <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                          {verse.translation}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Bottom Completion Button */}
          <div className="text-center pt-6 border-t border-neutral-800">
            <button
              onClick={() => {
                onToggleSurahCompleted(selectedSurah.id);
                handleCloseSurah();
              }}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-950/40 inline-flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-5 h-5" />
              Completed Reading Surah {selectedSurah.nameTransliteration}
            </button>
          </div>
        </div>
      ) : (
        /* Main Surahs List View */
        <>
          {/* Header & Filter Tabs */}
          <div className="bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-medium font-serif text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  Panj Surah & Beginner Quran Reader
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Complete Arabic text, English translations, transliterations & offline audio downloads
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  id="search-surahs-input"
                  type="text"
                  placeholder="Search Surah by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 pt-1 border-t border-neutral-800 overflow-x-auto pb-1">
              <button
                id="filter-panj-surah-btn"
                onClick={() => setActiveFilter('panj')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeFilter === 'panj'
                    ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/40 shadow-sm'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                ✨ Panj Surah (5 Core Surahs)
              </button>

              <button
                id="filter-beginner-surahs-btn"
                onClick={() => setActiveFilter('beginner')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeFilter === 'beginner'
                    ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/40 shadow-sm'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                🌱 10 Surahs for Beginners
              </button>

              <button
                id="filter-all-surahs-btn"
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/40 shadow-sm'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                All 15 Key Surahs
              </button>
            </div>
          </div>

          {/* Surahs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSurahs.map((surah) => {
              const isCached = cachedMap[surah.id];
              const downloadPercent = downloadingMap[surah.id];
              const isMemorized = userProfile.completedSurahIds.includes(surah.id);

              return (
                <div
                  key={surah.id}
                  id={`surah-card-${surah.id}`}
                  onClick={() => handleOpenSurah(surah)}
                  className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 shadow-sm transition-all group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Number + Badges + Arabic Name */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-neutral-800 border border-neutral-700 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                          {surah.number}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-base group-hover:text-emerald-400 transition-colors">
                            {surah.nameTransliteration}
                          </h3>
                          <p className="text-xs text-neutral-400">
                            {surah.nameEnglish} • {surah.versesCount} Verses
                          </p>
                        </div>
                      </div>

                      <div className="font-arabic text-2xl text-emerald-400 font-bold">
                        {surah.nameArabic}
                      </div>
                    </div>

                    {/* Summary / Meaning */}
                    <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed mb-3">
                      {surah.summary}
                    </p>
                  </div>

                  {/* Bottom Row: Actions & Offline Status */}
                  <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {surah.isPanjSurah && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800/40 font-semibold text-[10px]">
                          Panj Surah
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-400 text-[10px]">
                        {surah.revelationType}
                      </span>
                      {isMemorized && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 font-semibold text-[10px] flex items-center gap-1 border border-emerald-800/40">
                          <Check className="w-2.5 h-2.5" /> Memorized
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Quick Mark Read Toggle Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSurahCompleted(surah.id, {
                            name: surah.nameTransliteration,
                            arabic: surah.nameArabic,
                          });
                          if (!isMemorized) {
                            try {
                              confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
                            } catch {
                              // Ignore
                            }
                          }
                        }}
                        className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all cursor-pointer ${
                          isMemorized
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-emerald-400'
                        }`}
                        title={isMemorized ? 'Marked Read (Click to unmark)' : 'Mark as Read (Adds to profile statistics)'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>

                      {/* Offline Download button */}
                      {isCached ? (
                        <button
                          onClick={(e) => handleRemoveOffline(surah, e)}
                          className="p-1.5 rounded-lg text-emerald-400 bg-emerald-950/50 hover:bg-rose-950 hover:text-rose-400 transition-colors"
                          title="Cached Offline (Click to remove)"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      ) : downloadPercent !== undefined ? (
                        <span className="text-[11px] font-mono font-bold text-amber-400 animate-pulse">
                          {downloadPercent}%
                        </span>
                      ) : (
                        <button
                          onClick={(e) => handleDownloadOffline(surah, e)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800 transition-colors"
                          title="Download for offline listening"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}

                      {/* Open as PDF Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPdfModalSurah(surah);
                        }}
                        className="px-2 py-1 rounded-lg text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 transition-colors flex items-center gap-1 text-[11px] font-bold cursor-pointer dark:bg-neutral-800 dark:text-emerald-300 dark:border-neutral-700"
                        title="Open Surah in In-App PDF Mushaf Reader"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                        <span>PDF</span>
                      </button>

                      <div className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Read & Listen <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* In-App PDF Mushaf Viewer Modal for Big Surahs */}
      <SurahPdfViewerModal
        surah={pdfModalSurah}
        isOpen={!!pdfModalSurah}
        onClose={() => setPdfModalSurah(null)}
      />
    </div>
  );
};
