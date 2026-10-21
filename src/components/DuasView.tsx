import React, { useState } from 'react';
import {
  Heart,
  Bookmark,
  Search,
  Volume2,
  VolumeX,
  Share2,
  Check,
  Sparkles,
  BookOpen,
  Filter,
  CheckCircle2,
  Shield,
} from 'lucide-react';
import { DuaCategory, DuaItem, UserProfile } from '../types';
import { DUAS_COLLECTION } from '../data/duas';
import { ManzilReaderModal } from './ManzilReaderModal';
import confetti from 'canvas-confetti';

interface DuasViewProps {
  userProfile: UserProfile;
  onToggleFavoriteDua: (duaId: string) => void;
  onRecordManzilSectionRead?: (sectionId: string, isRead?: boolean) => void;
  onRecordManzilFullCompletion?: () => void;
}

const CATEGORIES: DuaCategory[] = [
  'All',
  'Manzil (منزل - Protection & Ruqyah)',
  'Six Kalimas (کلمات)',
  'Iman Mufassal & Mujmal (ایمان)',
  'Eating & Drinking (کھانا پینا)',
  'Daily Life Prayers (روزمرہ مسنون دعائیں)',
  'Essential & Quranic',
  'Friday (Jummah)',
  'Fasting & Ramadan',
  'Morning & Evening',
  'Before Sleep & Waking',
  'Distress & Anxiety',
  'Health & Shifa',
  'Parents & Family',
  'Forgiveness',
  'Travel & Journey',
  'Mosque & Home',
  'Protection & Evil Eye',
  'Knowledge & Success',
];

export const DuasView: React.FC<DuasViewProps> = ({
  userProfile,
  onToggleFavoriteDua,
  onRecordManzilSectionRead,
  onRecordManzilFullCompletion,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<DuaCategory>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);
  const [isManzilReaderOpen, setIsManzilReaderOpen] = useState<boolean>(false);
  const [specialFilter, setSpecialFilter] = useState<'none' | 'ayatul-kursi' | 'qunoot' | 'sleep'>('none');

  const isDark = userProfile.theme === 'dark' || userProfile.theme === 'emerald-dark';
  const isBright = userProfile.theme === 'bright';

  // Filter duas
  const filteredDuas = DUAS_COLLECTION.filter((d) => {
    if (specialFilter === 'ayatul-kursi') {
      return d.id === 'dua-ayatul-kursi';
    }
    if (specialFilter === 'qunoot') {
      return d.id.includes('qunoot');
    }
    if (specialFilter === 'sleep') {
      return (
        d.category === 'Before Sleep & Waking' ||
        d.id.includes('sleep') ||
        d.id.includes('waking') ||
        d.id === 'dua-before-sleeping' ||
        d.id === 'dua-bedtime-lying-down'
      );
    }

    const isFav = userProfile.favoriteDuaIds.includes(d.id);
    if (showOnlyFavorites && !isFav) return false;

    if (selectedCategory !== 'All' && d.category !== selectedCategory) {
      return false;
    }

    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    const isManzilSearch =
      term.includes('munzil') ||
      term.includes('manzil') ||
      term.includes('منزل') ||
      term.includes('ruqyah');

    if (isManzilSearch && d.category === 'Manzil (منزل - Protection & Ruqyah)') {
      return true;
    }

    return (
      d.title.toLowerCase().includes(term) ||
      d.arabicText.includes(searchTerm) ||
      d.transliteration.toLowerCase().includes(term) ||
      d.translation.toLowerCase().includes(term) ||
      d.situation.toLowerCase().includes(term) ||
      d.category.toLowerCase().includes(term) ||
      (d.urduTranslation && d.urduTranslation.includes(searchTerm))
    );
  });

  const handleCopy = (dua: DuaItem) => {
    const text = `${dua.title}\n\n${dua.arabicText}\n\nTransliteration: ${dua.transliteration}\n\nTranslation: ${dua.translation}\n\nSituation: ${dua.situation}\nReference: ${dua.reference}`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (dua: DuaItem) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not available in your browser.');
      return;
    }

    if (speakingId === dua.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Speak English translation & situation
    const utterance = new SpeechSynthesisUtterance(`${dua.title}. Translation: ${dua.translation}. Benefit: ${dua.benefit}`);
    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(dua.id);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-12 max-w-4xl mx-auto px-2 sm:px-0 animate-fade-in">
      {/* Hero Header */}
      <div
        className={`rounded-3xl p-6 sm:p-8 shadow-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all ${
          isBright
            ? 'bg-white border-2 border-black text-black shadow-md ring-1 ring-black'
            : isDark
            ? 'bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 text-white border-neutral-800'
            : 'bg-emerald-50/80 border-2 border-emerald-200 text-slate-900'
        }`}
      >
        <div className="space-y-1.5">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              isBright
                ? 'bg-black text-white border-black'
                : isDark
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Authentic Masnoon Supplications</span>
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-bold font-serif tracking-tight ${
              isBright ? 'text-black' : isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Recommended Duas for Every Situation
          </h2>
          <p
            className={`text-xs sm:text-sm max-w-xl leading-relaxed ${
              isBright ? 'text-black font-medium' : isDark ? 'text-neutral-400' : 'text-slate-700 font-medium'
            }`}
          >
            "And when My servants ask you concerning Me, indeed I am near. I respond to the invocation of the supplicant when he calls upon Me." (Surah Al-Baqarah 2:186)
          </p>
        </div>

        {/* Favorite Duas Count */}
        <button
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          className={`p-4 rounded-2xl border transition-all text-center min-w-[150px] shrink-0 cursor-pointer ${
            showOnlyFavorites
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg'
              : isBright
              ? 'bg-slate-50 text-black border-2 border-slate-900 hover:bg-slate-100'
              : isDark
              ? 'bg-neutral-950/80 text-white border-neutral-800 hover:bg-neutral-800'
              : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold">
            <Bookmark className={`w-4 h-4 ${showOnlyFavorites ? 'fill-white' : 'text-emerald-500'}`} />
            <span>Saved Bookmarks</span>
          </div>
          <div
            className={`text-2xl font-bold font-mono mt-1 ${
              isBright ? 'text-black' : isDark ? 'text-emerald-300' : 'text-emerald-700'
            }`}
          >
            {userProfile.favoriteDuaIds.length}
          </div>
          <span
            className={`text-[10px] ${
              isBright ? 'text-slate-700 font-bold' : isDark ? 'text-neutral-400' : 'text-slate-500'
            }`}
          >
            {showOnlyFavorites ? 'Showing Bookmarks' : 'Filter Bookmarked'}
          </span>
        </button>
      </div>

      {/* Featured Manzil (Munzil) Ruqyah Card */}
      <div
        id="manzil-featured-banner"
        className={`p-5 sm:p-6 rounded-3xl border shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden transition-all ${
          isBright
            ? 'bg-white border-2 border-black text-black shadow-md'
            : isDark
            ? 'bg-gradient-to-r from-emerald-950 via-neutral-900 to-neutral-950 text-white border-emerald-800/60'
            : 'bg-emerald-50/90 border-2 border-emerald-300 text-slate-900'
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-inner ${
              isBright
                ? 'bg-black text-white border-black'
                : isDark
                ? 'bg-emerald-900/70 border-emerald-600/50 text-emerald-300'
                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
            }`}
          >
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider font-mono ${
                  isBright ? 'text-black' : isDark ? 'text-emerald-400' : 'text-emerald-800'
                }`}
              >
                Divine Protection &amp; Ruqyah
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-arabic font-bold border ${
                  isBright
                    ? 'bg-black text-white border-black'
                    : isDark
                    ? 'bg-emerald-900/60 text-emerald-200 border-emerald-700/60'
                    : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                }`}
              >
                منزل مبارک
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  isBright
                    ? 'bg-slate-200 text-black border border-slate-400'
                    : isDark
                    ? 'bg-neutral-800 text-neutral-300'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                33 Verses • 18 Sections
              </span>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold flex items-center gap-1 border ${
                  isBright
                    ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                    : isDark
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                }`}
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {userProfile.manzilTotalCompletions || 0} In Profile Stats
              </span>
            </div>
            <h3
              className={`text-lg sm:text-xl font-bold font-serif mt-1 ${
                isBright ? 'text-black' : isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Manzil (منزل) — 33 Protective Quranic Verses
            </h3>
            <p
              className={`text-xs sm:text-sm mt-1 max-w-xl leading-relaxed ${
                isBright ? 'text-black font-medium' : isDark ? 'text-neutral-300' : 'text-slate-700 font-medium'
              }`}
            >
              Prophetic verses and Quranic supplications recited for safeguard against the evil eye (Nazar), black magic (Sihr), illness, and anxiety.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0">
          <button
            id="open-manzil-reader-btn"
            onClick={() => setIsManzilReaderOpen(true)}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-950/60 transition-all cursor-pointer whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open Manzil Reader</span>
          </button>
          <button
            id="mark-manzil-read-quick-btn"
            onClick={() => {
              onRecordManzilFullCompletion?.();
              try {
                confetti({
                  particleCount: 80,
                  spread: 70,
                  origin: { y: 0.6 },
                });
              } catch {}
            }}
            className="px-4 py-3 rounded-2xl bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-300 text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            title="Mark Manzil as recited today and record in your profile statistics"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Mark Read (+1)</span>
          </button>
          <button
            id="btn-quick-manzil-filter"
            onClick={() => {
              setSelectedCategory('Manzil (منزل - Protection & Ruqyah)');
              setShowOnlyFavorites(false);
              setSearchTerm('');
            }}
            className="px-4 py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs sm:text-sm font-medium border border-neutral-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            18 Sections
          </button>
        </div>
      </div>

      {/* Special Highlights: Ayat-ul-Kursi, Dua-e-Qunoot & Night Sleeping Duas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Ayat-ul-Kursi Card */}
        <button
          id="btn-quick-ayatul-kursi"
          onClick={() => {
            setSpecialFilter('ayatul-kursi');
            setShowOnlyFavorites(false);
            setSearchTerm('');
          }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
            specialFilter === 'ayatul-kursi'
              ? isBright
                ? 'bg-white border-2 border-black ring-2 ring-black text-black'
                : isDark
                ? 'bg-emerald-950/90 border-emerald-500 shadow-lg ring-2 ring-emerald-500 text-white'
                : 'bg-emerald-100/90 border-2 border-emerald-600 shadow-md text-emerald-950'
              : isBright
              ? 'bg-white border-2 border-slate-300 hover:border-black text-black'
              : isDark
              ? 'bg-neutral-900 border-neutral-800 hover:border-emerald-700/60 hover:bg-neutral-850 text-white'
              : 'bg-white border border-slate-200 hover:border-emerald-400 text-slate-900 shadow-xs'
          }`}
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider font-mono ${
                  isBright ? 'text-black' : isDark ? 'text-amber-400' : 'text-amber-800'
                }`}
              >
                Crown of Quran
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-arabic font-semibold border ${
                  isBright
                    ? 'bg-black text-white border-black'
                    : isDark
                    ? 'bg-amber-950/60 text-amber-300 border-amber-800/40'
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}
              >
                آية الكرسي
              </span>
            </div>
            <h4
              className={`text-sm sm:text-base font-bold ${
                isBright ? 'text-black' : isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Ayat al-Kursi (آية الكرسي)
            </h4>
            <p
              className={`text-xs ${
                isBright ? 'text-black font-medium' : isDark ? 'text-neutral-400' : 'text-slate-600 font-medium'
              }`}
            >
              Surah Al-Baqarah 2:255. Supreme protection day and night.
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shrink-0 shadow-sm">
            View
          </span>
        </button>

        {/* Dua-e-Qunoot Card */}
        <button
          id="btn-quick-dua-qunoot"
          onClick={() => {
            setSpecialFilter('qunoot');
            setShowOnlyFavorites(false);
            setSearchTerm('');
          }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
            specialFilter === 'qunoot'
              ? isBright
                ? 'bg-white border-2 border-black ring-2 ring-black text-black'
                : isDark
                ? 'bg-emerald-950/90 border-emerald-500 shadow-lg ring-2 ring-emerald-500 text-white'
                : 'bg-emerald-100/90 border-2 border-emerald-600 shadow-md text-emerald-950'
              : isBright
              ? 'bg-white border-2 border-slate-300 hover:border-black text-black'
              : isDark
              ? 'bg-neutral-900 border-neutral-800 hover:border-emerald-700/60 hover:bg-neutral-850 text-white'
              : 'bg-white border border-slate-200 hover:border-emerald-400 text-slate-900 shadow-xs'
          }`}
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider font-mono ${
                  isBright ? 'text-black' : isDark ? 'text-emerald-400' : 'text-emerald-800'
                }`}
              >
                Salatul Witr
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-arabic font-semibold border ${
                  isBright
                    ? 'bg-black text-white border-black'
                    : isDark
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                    : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                }`}
              >
                دعاء القنوت
              </span>
            </div>
            <h4
              className={`text-sm sm:text-base font-bold ${
                isBright ? 'text-black' : isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Dua-e-Qunoot (دعاء القنوت)
            </h4>
            <p
              className={`text-xs ${
                isBright ? 'text-black font-medium' : isDark ? 'text-neutral-400' : 'text-slate-600 font-medium'
              }`}
            >
              Hanafi &amp; Prophetic Witr supplications with translation.
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shrink-0 shadow-sm">
            View
          </span>
        </button>

        {/* Night Sleeping Duas Spotlight Card */}
        <button
          id="btn-quick-sleeping-dua"
          onClick={() => {
            setSpecialFilter('sleep');
            setShowOnlyFavorites(false);
            setSearchTerm('');
          }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
            specialFilter === 'sleep'
              ? isBright
                ? 'bg-white border-2 border-black ring-2 ring-black text-black'
                : isDark
                ? 'bg-emerald-950/90 border-emerald-500 shadow-lg ring-2 ring-emerald-500 text-white'
                : 'bg-emerald-100/90 border-2 border-emerald-600 shadow-md text-emerald-950'
              : isBright
              ? 'bg-white border-2 border-slate-300 hover:border-black text-black'
              : isDark
              ? 'bg-neutral-900 border-neutral-800 hover:border-emerald-700/60 hover:bg-neutral-850 text-white'
              : 'bg-white border border-slate-200 hover:border-emerald-400 text-slate-900 shadow-xs'
          }`}
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider font-mono ${
                  isBright ? 'text-black' : isDark ? 'text-cyan-400' : 'text-cyan-800'
                }`}
              >
                Bedtime Sunnah
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-arabic font-semibold border ${
                  isBright
                    ? 'bg-black text-white border-black'
                    : isDark
                    ? 'bg-cyan-950/60 text-cyan-300 border-cyan-800/40'
                    : 'bg-cyan-100 text-cyan-900 border-cyan-300'
                }`}
              >
                دعاء النوم
              </span>
            </div>
            <h4
              className={`text-sm sm:text-base font-bold ${
                isBright ? 'text-black' : isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Night Sleeping Duas (سوتے وقت کی دعائیں)
            </h4>
            <p
              className={`text-xs ${
                isBright ? 'text-black font-medium' : isDark ? 'text-neutral-400' : 'text-slate-600 font-medium'
              }`}
            >
              Authentic Sunnah Duas for sleeping, protection from nightmares &amp; waking.
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shrink-0 shadow-sm">
            View
          </span>
        </button>
      </div>

      {/* Active Special Filter Banner */}
      {specialFilter !== 'none' && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-700/70 text-emerald-200 text-xs flex items-center justify-between gap-2 shadow-md">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Showing:{' '}
              <strong>
                {specialFilter === 'ayatul-kursi'
                  ? 'Ayat al-Kursi (The Throne Verse - آية الكرسي)'
                  : specialFilter === 'qunoot'
                  ? 'Dua-e-Qunoot (Hanafi & Prophetic Witr - دعاء القنوت)'
                  : 'Night Sleeping & Bedtime Duas (سوتے وقت کی مسنون دعائیں)'}
              </strong>
            </span>
          </div>
          <button
            onClick={() => setSpecialFilter('none')}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer shrink-0 shadow-sm"
          >
            Show All Duas
          </button>
        </div>
      )}

      {/* Featured Quick Category Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <button
          id="btn-quick-manzil"
          onClick={() => {
            setSelectedCategory('Manzil (منزل - Protection & Ruqyah)');
            setShowOnlyFavorites(false);
            setSpecialFilter('none');
            setSearchTerm('');
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            selectedCategory === 'Manzil (منزل - Protection & Ruqyah)' && !showOnlyFavorites && specialFilter === 'none'
              ? 'bg-emerald-950/90 border-emerald-500 shadow-md ring-1 ring-emerald-500'
              : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Ruqyah</span>
            <span className="text-xs font-arabic text-emerald-400 font-bold">منزل مبارک</span>
          </div>
          <span className="text-xs font-semibold text-white">Manzil (منزل)</span>
          <span className="text-[10px] text-neutral-400 mt-0.5">33 Protective Verses, Nazar, Shifa</span>
        </button>

        <button
          id="btn-quick-kalimas"
          onClick={() => {
            setSelectedCategory('Six Kalimas (کلمات)');
            setShowOnlyFavorites(false);
            setSpecialFilter('none');
            setSearchTerm('');
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            selectedCategory === 'Six Kalimas (کلمات)' && !showOnlyFavorites && specialFilter === 'none'
              ? 'bg-emerald-950/90 border-emerald-500 shadow-md ring-1 ring-emerald-500'
              : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-mono">6 Kalimas</span>
            <span className="text-xs font-arabic text-emerald-400 font-bold">چھ کلمات</span>
          </div>
          <span className="text-xs font-semibold text-white">Six Kalimas of Islam</span>
          <span className="text-[10px] text-neutral-400 mt-0.5">Tayyibah, Shahadat, Tauheed...</span>
        </button>

        <button
          id="btn-quick-iman"
          onClick={() => {
            setSelectedCategory('Iman Mufassal & Mujmal (ایمان)');
            setShowOnlyFavorites(false);
            setSpecialFilter('none');
            setSearchTerm('');
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            selectedCategory === 'Iman Mufassal & Mujmal (ایمان)' && !showOnlyFavorites && specialFilter === 'none'
              ? 'bg-emerald-950/90 border-emerald-500 shadow-md ring-1 ring-emerald-500'
              : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider font-mono">Aqeedah</span>
            <span className="text-xs font-arabic text-teal-400 font-bold">ایمانِ مفصل و مجمل</span>
          </div>
          <span className="text-xs font-semibold text-white">Iman Mufassal & Mujmal</span>
          <span className="text-[10px] text-neutral-400 mt-0.5">Articles of Faith & Beliefs</span>
        </button>

        <button
          id="btn-quick-eating"
          onClick={() => {
            setSelectedCategory('Eating & Drinking (کھانا پینا)');
            setShowOnlyFavorites(false);
            setSpecialFilter('none');
            setSearchTerm('');
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            selectedCategory === 'Eating & Drinking (کھانا پینا)' && !showOnlyFavorites && specialFilter === 'none'
              ? 'bg-emerald-950/90 border-emerald-500 shadow-md ring-1 ring-emerald-500'
              : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider font-mono">Meals</span>
            <span className="text-xs font-arabic text-amber-400 font-bold">کھانے پینے کی دعائیں</span>
          </div>
          <span className="text-xs font-semibold text-white">Eating & Drinking Duas</span>
          <span className="text-[10px] text-neutral-400 mt-0.5">Before/After meals, Host, Zamzam</span>
        </button>

        <button
          id="btn-quick-daily"
          onClick={() => {
            setSelectedCategory('Daily Life Prayers (روزمرہ مسنون دعائیں)');
            setShowOnlyFavorites(false);
            setSpecialFilter('none');
            setSearchTerm('');
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            selectedCategory === 'Daily Life Prayers (روزمرہ مسنون دعائیں)' && !showOnlyFavorites && specialFilter === 'none'
              ? 'bg-emerald-950/90 border-emerald-500 shadow-md ring-1 ring-emerald-500'
              : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider font-mono">Sunnah</span>
            <span className="text-xs font-arabic text-cyan-400 font-bold">روزمرہ مسنون دعائیں</span>
          </div>
          <span className="text-xs font-semibold text-white">Daily Life Sunnah Duas</span>
          <span className="text-[10px] text-neutral-400 mt-0.5">Waking, Sleep, Wudu, Washroom...</span>
        </button>
      </div>

      {/* Search & Category Filter Section */}
      <div className="bg-neutral-900 rounded-3xl p-5 shadow-sm border border-neutral-800 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            id="search-duas-input"
            type="text"
            placeholder="Search by topic (e.g. kalima, qunoot, kursi, iman, eating, sleep, wudu, washroom, shifa)..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (specialFilter !== 'none') setSpecialFilter('none');
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat && !showOnlyFavorites && specialFilter === 'none';
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowOnlyFavorites(false);
                  setSpecialFilter('none');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border border-neutral-700/60'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Duas List */}
      <div className="space-y-4">
        {filteredDuas.length === 0 ? (
          <div className="p-12 text-center bg-neutral-900 rounded-3xl border border-neutral-800 space-y-3">
            <BookOpen className="w-10 h-10 text-neutral-500 mx-auto" />
            <h3 className="font-semibold text-white">No Duas Found</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Try searching with different keywords like 'protection', 'forgiveness', or select 'All'.
            </p>
          </div>
        ) : (
          filteredDuas.map((dua) => {
            const isFav = userProfile.favoriteDuaIds.includes(dua.id);
            const isSpeaking = speakingId === dua.id;

            return (
              <div
                key={dua.id}
                id={`dua-card-${dua.id}`}
                className="bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-800 hover:border-neutral-700 transition-all space-y-4"
              >
                {/* Header: Title + Category badge + Actions */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-800 pb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                        {dua.category}
                      </span>
                      {dua.category === 'Manzil (منزل - Protection & Ruqyah)' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 flex items-center gap-1 font-arabic">
                          <Shield className="w-3 h-3 text-emerald-400" />
                          <span>منزل Ruqyah</span>
                        </span>
                      )}
                      <span className="text-[11px] text-neutral-400 font-medium">
                        {dua.reference}
                      </span>
                    </div>
                    <h3 className="font-medium font-serif text-white text-base sm:text-lg">
                      {dua.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Audio read */}
                    <button
                      onClick={() => handleSpeak(dua)}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        isSpeaking
                          ? 'bg-emerald-600 text-white animate-pulse'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border border-neutral-700'
                      }`}
                      title={isSpeaking ? 'Stop Audio' : 'Listen to translation'}
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    {/* Bookmark Favorite */}
                    <button
                      id={`bookmark-dua-${dua.id}`}
                      onClick={() => onToggleFavoriteDua(dua.id)}
                      className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                        isFav
                          ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-neutral-200'
                      }`}
                      title={isFav ? 'Remove from bookmarks' : 'Save bookmark'}
                    >
                      <Bookmark className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    {/* Copy */}
                    <button
                      onClick={() => handleCopy(dua)}
                      className="p-2 rounded-xl bg-neutral-800 border border-neutral-700 text-neutral-300 hover:bg-neutral-700 transition-colors cursor-pointer"
                      title="Copy Dua"
                    >
                      {copiedId === dua.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Large Arabic Text Box */}
                <div className="p-5 sm:p-6 rounded-2xl bg-neutral-950/70 border border-neutral-800 text-right">
                  <div className="font-arabic text-xl sm:text-2xl lg:text-3xl text-neutral-100 leading-loose selection:bg-emerald-600 selection:text-white" dir="rtl">
                    {dua.arabicText}
                  </div>
                </div>

                {/* Transliteration */}
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Transliteration</span>
                  <p className="text-xs sm:text-sm text-emerald-300 font-medium italic leading-relaxed">
                    {dua.transliteration}
                  </p>
                </div>

                {/* Urdu Translation if available */}
                {dua.urduTranslation && (
                  <div className="space-y-0.5 p-3 rounded-2xl bg-neutral-950/40 border border-neutral-800/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 font-urdu">اردو ترجمہ (Urdu Meaning)</span>
                    <p className="text-sm text-neutral-200 leading-relaxed font-urdu" dir="rtl">
                      {dua.urduTranslation}
                    </p>
                  </div>
                )}

                {/* Translation */}
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">English Meaning</span>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                    {dua.translation}
                  </p>
                </div>

                {/* Situation & Benefit */}
                <div className="pt-2 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80 text-neutral-300">
                    <span className="font-semibold text-white block mb-0.5">When to Recite:</span>
                    {dua.situation}
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80 text-amber-200">
                    <span className="font-semibold text-amber-300 block mb-0.5">Virtue & Reward:</span>
                    {dua.benefit}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Dedicated Full Manzil Reader Modal */}
      <ManzilReaderModal
        isOpen={isManzilReaderOpen}
        onClose={() => setIsManzilReaderOpen(false)}
        onToggleFavorite={onToggleFavoriteDua}
        favoriteIds={userProfile.favoriteDuaIds}
        initialCompletedSections={userProfile.manzilSectionsCompleted}
        onRecordSectionRead={onRecordManzilSectionRead}
        onRecordFullCompletion={onRecordManzilFullCompletion}
        totalCompletionsCount={userProfile.manzilTotalCompletions}
      />
    </div>
  );
};
