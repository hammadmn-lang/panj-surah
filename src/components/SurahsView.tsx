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
  X,
} from 'lucide-react';
import { Surah, UserProfile } from '../types';
import { SURAHS_DATA } from '../data/surahs';
import { downloadSurahAudio, getCachedAudioBlobUrl, isSurahCached, removeCachedSurah } from '../utils/audioCache';
import { SurahPdfViewerModal } from './SurahPdfViewerModal';
import confetti from 'canvas-confetti';

interface SurahsViewProps {
  userProfile: UserProfile;
  onToggleSurahCompleted: (surahId: number, details?: { name: string; arabic: string }) => void;
  initialSearchTerm?: string;
  onUpdateProfile?: (updated: Partial<UserProfile>) => void;
}

export const SurahsView: React.FC<SurahsViewProps> = ({
  userProfile,
  onToggleSurahCompleted,
  initialSearchTerm = '',
  onUpdateProfile,
}) => {
  const [activeFilter, setActiveFilter] = useState<'panj' | 'beginner' | 'all'>('panj');
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [pdfModalSurah, setPdfModalSurah] = useState<Surah | null>(null);
  const [isQuickSwitchOpen, setIsQuickSwitchOpen] = useState(false);
  const [quickSwitchSearch, setQuickSwitchSearch] = useState('');

  useEffect(() => {
    if (initialSearchTerm) {
      setSearchTerm(initialSearchTerm);
      setActiveFilter('all');
    }
  }, [initialSearchTerm]);

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

  // Reader Settings with robust local storage persistence (allows font 12px to 52px)
  const savedReaderSettings = (() => {
    try {
      const raw = localStorage.getItem('panj_surah_reader_settings');
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  })();

  const [readingMode, setReadingMode] = useState<'mushaf' | 'study'>(() => {
    if (savedReaderSettings && (savedReaderSettings.readingMode === 'mushaf' || savedReaderSettings.readingMode === 'study')) {
      return savedReaderSettings.readingMode;
    }
    return 'mushaf'; // 16-Line Mushaf Mode is standard
  });

  const [fontSize, setFontSize] = useState<number>(() => {
    if (savedReaderSettings && typeof savedReaderSettings.fontSize === 'number') {
      return Math.max(12, Math.min(52, savedReaderSettings.fontSize));
    }
    return userProfile.fontSizeArabic || 28;
  });

  const [showTransliteration, setShowTransliteration] = useState<boolean>(() => {
    if (savedReaderSettings && typeof savedReaderSettings.showTransliteration === 'boolean') {
      return savedReaderSettings.showTransliteration;
    }
    return userProfile.showTransliteration;
  });

  const [showTranslation, setShowTranslation] = useState<boolean>(() => {
    if (savedReaderSettings && typeof savedReaderSettings.showTranslation === 'boolean') {
      return savedReaderSettings.showTranslation;
    }
    return userProfile.showTranslation ?? true;
  });

  const [translationLanguage, setTranslationLanguage] = useState<'both' | 'ur' | 'en'>(() => {
    if (savedReaderSettings && savedReaderSettings.translationLanguage) {
      return savedReaderSettings.translationLanguage;
    }
    return userProfile.surahTranslationLang || 'ur';
  });

  const [showMushafKanzulIman, setShowMushafKanzulIman] = useState<boolean>(() => {
    if (savedReaderSettings && typeof savedReaderSettings.showMushafKanzulIman === 'boolean') {
      return savedReaderSettings.showMushafKanzulIman;
    }
    return true;
  });

  const [savedSettingsNotice, setSavedSettingsNotice] = useState<string | null>(null);

  // Helper to persist settings instantly to localStorage and userProfile
  const persistSettings = (updates: {
    fontSize?: number;
    showTranslation?: boolean;
    showTransliteration?: boolean;
    translationLanguage?: 'both' | 'ur' | 'en';
    showMushafKanzulIman?: boolean;
    readingMode?: 'mushaf' | 'study';
  }) => {
    const nextFont = updates.fontSize !== undefined ? updates.fontSize : fontSize;
    const nextTranslation = updates.showTranslation !== undefined ? updates.showTranslation : showTranslation;
    const nextTransliteration = updates.showTransliteration !== undefined ? updates.showTransliteration : showTransliteration;
    const nextLang = updates.translationLanguage !== undefined ? updates.translationLanguage : translationLanguage;
    const nextMushafKanzul = updates.showMushafKanzulIman !== undefined ? updates.showMushafKanzulIman : showMushafKanzulIman;
    const nextMode = updates.readingMode !== undefined ? updates.readingMode : readingMode;

    const payload = {
      fontSize: nextFont,
      showTranslation: nextTranslation,
      showTransliteration: nextTransliteration,
      translationLanguage: nextLang,
      showMushafKanzulIman: nextMushafKanzul,
      readingMode: nextMode,
    };

    try {
      localStorage.setItem('panj_surah_reader_settings', JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to save reader settings:', e);
    }

    onUpdateProfile?.({
      fontSizeArabic: nextFont,
      showTranslation: nextTranslation,
      showTransliteration: nextTransliteration,
      surahTranslationLang: nextLang,
    });

    setSavedSettingsNotice('ترتیبات محفوظ ہو گئیں • Settings saved');
    setTimeout(() => setSavedSettingsNotice(null), 3000);
  };

  // 11 Ayat per page Mushaf pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const AYAT_PER_PAGE = 11;

  useEffect(() => {
    setCurrentPage(1);
  }, [readingMode, selectedSurah?.id]);

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

  const isDark = userProfile.theme === 'dark' || userProfile.theme === 'emerald-dark';
  const isBright = userProfile.theme === 'bright';

  // Filter and align surahs by their exact Quran Pak Surah number
  const filteredSurahs = SURAHS_DATA.filter((s) => {
    const matchesSearch =
      s.nameEnglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nameTransliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nameArabic.includes(searchTerm) ||
      s.number.toString().includes(searchTerm.trim()) ||
      s.meaning.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === 'panj') return s.isPanjSurah;
    if (activeFilter === 'beginner') return s.isBeginnerRecommended;
    return true;
  }).sort((a, b) => a.number - b.number);

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

            {/* Title with Quran Pak Surah number */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-800/40 text-emerald-300 font-bold">
                  Surah #{selectedSurah.number} in Quran Pak
                </span>
                <span className="text-xs font-arabic text-emerald-400 font-bold">
                  قرآن پاک میں سورۃ نمبر {selectedSurah.number}
                </span>
              </div>
              <h2 className="font-serif font-medium text-lg sm:text-xl text-white">
                Surah {selectedSurah.nameTransliteration} ({selectedSurah.nameArabic})
              </h2>
              <p className="text-xs text-neutral-400">
                {selectedSurah.nameEnglish} • {selectedSurah.versesCount} Verses • {selectedSurah.revelationType}
              </p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-[11px] font-urdu font-medium text-emerald-300 bg-emerald-950/90 px-2.5 py-0.5 rounded-full border border-emerald-700/80 shadow-xs" dir="rtl">
                  دعوتِ اسلامی معیار • 16 سطری رسم الخط • ترجمہ کنز الایمان
                </span>
              </div>
            </div>

            {/* PDF View & Read / Memorized Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setQuickSwitchSearch('');
                  setIsQuickSwitchOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-800 text-neutral-200 border border-neutral-700 hover:bg-neutral-700 transition-all cursor-pointer"
                title="Search and jump directly to another Surah without closing"
              >
                <Search className="w-3.5 h-3.5 text-emerald-400" />
                <span>Search Surah</span>
              </button>

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
            {/* Font Size controls (Supports 12px to 52px) */}
            <div className="flex items-center gap-1.5 bg-neutral-900 px-2 py-1.5 rounded-xl border border-neutral-800">
              <Type className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-medium text-neutral-300 text-[11px]">Size:</span>
              <button
                onClick={() => {
                  const next = Math.max(12, fontSize - 2);
                  setFontSize(next);
                  persistSettings({ fontSize: next });
                }}
                className="w-6 h-6 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold flex items-center justify-center transition-all cursor-pointer"
                title="Reduce font size (minimum 12px)"
              >
                -
              </button>
              <span className="font-mono font-bold text-emerald-400 px-1 min-w-[36px] text-center text-xs">
                {fontSize}px
              </span>
              <button
                onClick={() => {
                  const next = Math.min(52, fontSize + 2);
                  setFontSize(next);
                  persistSettings({ fontSize: next });
                }}
                className="w-6 h-6 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold flex items-center justify-center transition-all cursor-pointer"
                title="Increase font size"
              >
                +
              </button>

              {/* Quick Presets: 12px, 16px, 20px, 24px, 28px, 36px */}
              <div className="hidden sm:flex items-center gap-1 pl-1 border-l border-neutral-700/80">
                {[12, 16, 20, 24, 28, 36].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      setFontSize(sz);
                      persistSettings({ fontSize: sz });
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      fontSize === sz
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-neutral-800/80 text-neutral-400 hover:text-white'
                    }`}
                    title={`Set font to ${sz}px`}
                  >
                    {sz}px
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Switcher: 16-Line Mushaf vs Verse-by-Verse (Identical to Dawat-e-Islami PDF Modal) */}
            <div className="flex items-center rounded-xl bg-neutral-900 border border-neutral-700/80 p-0.5 shadow-xs text-xs font-semibold">
              <button
                onClick={() => {
                  setReadingMode('mushaf');
                  persistSettings({ readingMode: 'mushaf' });
                }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  readingMode === 'mushaf'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-neutral-300 hover:text-white'
                }`}
                title="Continuous 16-Line Holy Mushaf Layout (Matches Dawat-e-Islami standard)"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>16-Line Mushaf</span>
              </button>
              <button
                onClick={() => {
                  setReadingMode('study');
                  persistSettings({ readingMode: 'study' });
                }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  readingMode === 'study'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-neutral-300 hover:text-white'
                }`}
                title="Verse-by-Verse Study Mode with Kanzul Iman Translation & Transliteration"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Verse by Verse</span>
              </button>
            </div>

            {/* Toggle Transliteration & Translation & Translation Language */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  const next = !showTransliteration;
                  setShowTransliteration(next);
                  persistSettings({ showTransliteration: next });
                }}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  showTransliteration
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
                title="Toggle Transliteration (saves preference for next logon)"
              >
                Transliteration
              </button>
              <button
                onClick={() => {
                  const next = !showTranslation;
                  setShowTranslation(next);
                  persistSettings({ showTranslation: next });
                }}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  showTranslation
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
                title="Toggle Urdu/English Translation (saves preference for next logon)"
              >
                Translation: {showTranslation ? 'ON' : 'OFF'}
              </button>

              {/* Urdu / English / Both Switcher */}
              {showTranslation && (
                <div className="flex items-center bg-neutral-800/90 rounded-lg p-0.5 border border-neutral-700">
                  <button
                    onClick={() => {
                      setTranslationLanguage('en');
                      persistSettings({ translationLanguage: 'en' });
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                      translationLanguage === 'en'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      setTranslationLanguage('ur');
                      persistSettings({ translationLanguage: 'ur' });
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all font-urdu cursor-pointer ${
                      translationLanguage === 'ur'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    اردو (کنز الایمان)
                  </button>
                  <button
                    onClick={() => {
                      setTranslationLanguage('both');
                      persistSettings({ translationLanguage: 'both' });
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
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

            {/* Saved Notification Indicator & Explicit Save Button */}
            <div className="flex items-center gap-2">
              {savedSettingsNotice && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-700/80 text-[11px] font-semibold animate-pulse select-none">
                  <Check className="w-3 h-3 text-emerald-400" />
                  {savedSettingsNotice}
                </span>
              )}
              <button
                onClick={() => persistSettings({})}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                title="Save current font size and translation options permanently"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Save Setting</span>
              </button>
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
              <div className="font-mushaf font-arabic text-3xl sm:text-4xl text-emerald-400 leading-relaxed font-bold">
                بِسۡمِ اللهِ الرَّحۡمٰنِ الرَّحِيۡمِ
              </div>
              <p className="text-xs text-emerald-400/80 mt-1 font-urdu font-medium" dir="rtl">
                اللہ کے نام سے شروع جو بہت مہربان رحمت والا
              </p>
            </div>
          )}

          {/* Verses Content: 16-Line Holy Mushaf Mode, OR Verse-by-Verse Study Mode with Kanzul Iman */}
          {readingMode === 'mushaf' ? (
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

                  {/* Mushaf Page Container (16-Line Holy Mushaf Style - Dawat-e-Islami Verified) */}
                  <div className="bg-[#fffefb] rounded-3xl border-2 border-emerald-700/40 p-6 sm:p-9 shadow-md relative dark:bg-neutral-900/90 dark:border-emerald-800/50">
                    <div className="border-b border-emerald-200/60 pb-3 mb-6 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-900 font-bold dark:text-emerald-400">
                      <span className="font-mushaf font-arabic text-base sm:text-lg text-emerald-900 dark:text-emerald-300">
                        سُورَةُ {selectedSurah.nameArabic}
                      </span>
                      <button
                        onClick={() => {
                          const next = !showMushafKanzulIman;
                          setShowMushafKanzulIman(next);
                          persistSettings({ showMushafKanzulIman: next });
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-bold font-urdu transition-all cursor-pointer flex items-center gap-1.5 ${
                          showMushafKanzulIman
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200 dark:bg-neutral-800 dark:text-emerald-300'
                        }`}
                        title="Toggle Kanzul Iman translation on this Mushaf page"
                      >
                        <span>{showMushafKanzulIman ? '✓ ساتھ ترجمہ کنز الایمان فعال ہے' : '📖 ساتھ ترجمہ کنز الایمان دیکھیں'}</span>
                      </button>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-mono dark:bg-neutral-800 dark:text-neutral-300">
                        16-Line Mushaf Mode • Page {currentPage} of {totalPages} ({fontSize}px)
                      </span>
                      <span>{selectedSurah.nameTransliteration}</span>
                    </div>

                    <div
                      className="font-mushaf font-arabic text-right text-slate-950 leading-[2.2] tracking-wide text-justify space-y-3 dark:text-neutral-100"
                      dir="rtl"
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {currentVerses.map((verse) => (
                        <span key={verse.id} className="inline ml-2.5">
                          <span className="font-normal text-slate-950 dark:text-neutral-100">
                            {verse.textArabic}
                          </span>
                          <span className="inline-flex items-center justify-center mx-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 text-xs font-mono font-bold border border-emerald-400 select-none shadow-xs dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700">
                            ۝ {verse.number}
                          </span>
                        </span>
                      ))}
                    </div>

                    {/* Kanzul Iman Urdu Translation on this Mushaf page */}
                    {showMushafKanzulIman && (
                      <div className="mt-8 pt-5 border-t-2 border-dashed border-emerald-300 dark:border-neutral-800 space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold font-urdu text-emerald-900 dark:text-emerald-400" dir="rtl">
                          <span className="bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800 shadow-xs">
                            ترجمہ کنز الایمان (امام احمد رضا خان علیہ الرحمہ) — آیات {startIdx + 1} تا {endIdx}
                          </span>
                          <span className="text-[11px] font-sans font-medium text-slate-500 dark:text-neutral-400">
                            دعوتِ اسلامی معیار
                          </span>
                        </div>
                        <div className="space-y-2.5">
                          {currentVerses.map((verse) => (
                            <div
                              key={`mushaf-ur-${verse.id}`}
                              className="font-urdu text-right text-emerald-950 dark:text-emerald-100 text-sm sm:text-base leading-loose p-3 rounded-xl bg-emerald-50/70 dark:bg-neutral-950/70 border border-emerald-200/80 dark:border-neutral-800"
                              dir="rtl"
                            >
                              <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300 ml-2 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-700 select-none">
                                آیت {verse.number}
                              </span>
                              {verse.translationUr}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

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
                  className="p-5 rounded-2xl bg-white dark:bg-neutral-900/80 border border-emerald-200 dark:border-neutral-800 space-y-3 transition-colors hover:border-emerald-300 dark:hover:border-neutral-700 shadow-sm"
                >
                  {/* Verse Number Badge & Arabic Text */}
                  <div className="flex items-start justify-between gap-4">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-neutral-800 text-emerald-900 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-300 dark:border-neutral-700">
                      {verse.number}
                    </span>

                    <div
                      className="font-mushaf font-arabic text-right text-slate-950 dark:text-neutral-100 flex-1 leading-[2.4] tracking-wide"
                      style={{ fontSize: `${fontSize}px` }}
                      dir="rtl"
                    >
                      <span className="font-normal">{verse.textArabic}</span>{' '}
                      <span className="inline-flex items-center justify-center mx-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 text-xs font-mono font-bold border border-emerald-400 select-none shadow-xs dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700">
                        ۝ {verse.number}
                      </span>
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
                      {/* Urdu Translation (Kanzul Iman by Ala Hazrat Imam Ahmad Raza Khan - Dawat-e-Islami Standard) */}
                      {(translationLanguage === 'ur' || translationLanguage === 'both') && verse.translationUr && (
                        <div
                          className="text-sm sm:text-base text-emerald-300/95 font-urdu text-right leading-loose bg-neutral-950/50 p-3 rounded-xl border border-emerald-900/40 space-y-1"
                          dir="rtl"
                        >
                          <div className="flex items-center justify-between text-xs text-emerald-400 font-sans pb-1 mb-1 border-b border-emerald-950/60">
                            <span className="font-urdu font-bold text-[11px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 shadow-xs">
                              ترجمہ: کنز الایمان (امام احمد رضا خان علیہ الرحمہ)
                            </span>
                            <span className="text-[10px] text-neutral-400 font-sans">
                              Dawat-e-Islami Standard
                            </span>
                          </div>
                          <div>{verse.translationUr}</div>
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
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  id="search-surahs-input"
                  type="text"
                  placeholder="Search Surah by name, #number, or meaning..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Search Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
              <span className="text-neutral-400 text-xs font-semibold shrink-0">Quick Search:</span>
              {[
                { name: 'Yaseen', query: 'Yaseen', num: '36' },
                { name: 'Al-Mulk', query: 'Mulk', num: '67' },
                { name: 'Ar-Rahman', query: 'Rahman', num: '55' },
                { name: 'Al-Kahf', query: 'Kahf', num: '18' },
                { name: 'Al-Waqi‘ah', query: 'Waqi', num: '56' },
                { name: 'Al-Fatihah', query: 'Fatihah', num: '1' },
                { name: 'Al-Ikhlas', query: 'Ikhlas', num: '112' },
                { name: 'Al-Baqarah', query: 'Baqarah', num: '2' },
              ].map((chip) => {
                const isActive = searchTerm.toLowerCase().includes(chip.query.toLowerCase());
                return (
                  <button
                    key={chip.name}
                    onClick={() => {
                      setSearchTerm(chip.query);
                      setActiveFilter('all');
                    }}
                    className={`px-2.5 py-1 rounded-xl border transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                      isActive
                        ? 'bg-emerald-600 text-white border-emerald-500 font-bold shadow-xs'
                        : 'bg-neutral-800/80 text-neutral-300 border-neutral-700/60 hover:bg-neutral-700 hover:text-white'
                    }`}
                  >
                    <span>{chip.name}</span>
                    <span className="opacity-60 text-[10px] font-mono">#{chip.num}</span>
                  </button>
                );
              })}
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-2.5 py-1 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white text-[11px] font-medium shrink-0 cursor-pointer"
                >
                  Clear ({filteredSurahs.length} found)
                </button>
              )}
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
                All Surahs (Quran Pak Order #1 → #114)
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
                        <div
                          className="w-11 h-11 rounded-2xl bg-neutral-800 border border-neutral-700 text-emerald-400 flex flex-col items-center justify-center shrink-0"
                          title={`Surah #${surah.number} in Quran Pak`}
                        >
                          <span className="text-[9px] uppercase font-mono tracking-tighter opacity-70">Surah</span>
                          <span className="font-bold font-mono text-sm leading-none">{surah.number}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-semibold text-white text-base group-hover:text-emerald-400 transition-colors">
                              {surah.nameTransliteration}
                            </h3>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/40">
                              #{surah.number}
                            </span>
                          </div>
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

      {/* Quick Switch / Search Surah Modal when in Reader View */}
      {isQuickSwitchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setIsQuickSwitchOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold font-serif text-white text-base">
                  Search &amp; Switch Surah (سورۃ تلاش کریں)
                </h3>
              </div>
              <button
                onClick={() => setIsQuickSwitchOpen(false)}
                className="p-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                autoFocus
                placeholder="Type Surah name or number (e.g. Yaseen, 67, Mulk)..."
                value={quickSwitchSearch}
                onChange={(e) => setQuickSwitchSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
              {quickSwitchSearch && (
                <button
                  onClick={() => setQuickSwitchSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Suggestions */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
              {['Yaseen', 'Mulk', 'Rahman', 'Waqiah', 'Muzzammil', 'Kahf', 'Sajdah', 'Fath', 'Ikhlas'].map((q) => (
                <button
                  key={q}
                  onClick={() => setQuickSwitchSearch(q)}
                  className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs shrink-0 cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {SURAHS_DATA.filter((s) => {
                if (!quickSwitchSearch.trim()) return true;
                const term = quickSwitchSearch.toLowerCase();
                return (
                  s.number.toString().includes(term) ||
                  s.nameTransliteration.toLowerCase().includes(term) ||
                  s.nameArabic.includes(quickSwitchSearch) ||
                  s.nameEnglish.toLowerCase().includes(term)
                );
              }).map((surah) => (
                <div
                  key={surah.id}
                  onClick={() => {
                    handleOpenSurah(surah);
                    setIsQuickSwitchOpen(false);
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedSurah?.id === surah.id
                      ? 'bg-emerald-950/70 border-emerald-500 text-white'
                      : 'bg-neutral-950/50 border-neutral-800 hover:bg-neutral-800 text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      #{surah.number}
                    </span>
                    <div>
                      <div className="font-semibold text-xs text-white">
                        Surah {surah.nameTransliteration}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {surah.nameEnglish} • {surah.versesCount} Ayat
                      </div>
                    </div>
                  </div>
                  <div className="font-mushaf font-arabic text-lg text-emerald-300" dir="rtl">
                    {surah.nameArabic}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
