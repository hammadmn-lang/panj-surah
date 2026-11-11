import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Copy,
  Check,
  Share2,
  RefreshCw,
  Volume2,
  VolumeX,
  Search,
  X,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  ExternalLink,
} from 'lucide-react';
import { DAILY_HADITHS, DailyHadith, getDailyHadithForDate } from '../data/dailyHadiths';

interface DailyHadithCardProps {
  isDark?: boolean;
  isBright?: boolean;
  onOpenSurahSearch?: () => void;
}

export const DailyHadithCard: React.FC<DailyHadithCardProps> = ({
  isDark = true,
  isBright = false,
  onOpenSurahSearch,
}) => {
  const [currentHadith, setCurrentHadith] = useState<DailyHadith>(() => getDailyHadithForDate());
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isBrowseModalOpen, setIsBrowseModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'Sahih al-Bukhari' | 'Sahih Muslim'>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('panj_surah_hadith_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const isBookmarked = bookmarkedIds.includes(currentHadith.id);

  const toggleBookmark = (id: number) => {
    setBookmarkedIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id];
      try {
        localStorage.setItem('panj_surah_hadith_bookmarks', JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  const handleNextHadith = () => {
    const currentIndex = DAILY_HADITHS.findIndex((h) => h.id === currentHadith.id);
    const nextIndex = (currentIndex + 1) % DAILY_HADITHS.length;
    setCurrentHadith(DAILY_HADITHS[nextIndex]);
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
  };

  const handlePrevHadith = () => {
    const currentIndex = DAILY_HADITHS.findIndex((h) => h.id === currentHadith.id);
    const prevIndex = (currentIndex - 1 + DAILY_HADITHS.length) % DAILY_HADITHS.length;
    setCurrentHadith(DAILY_HADITHS[prevIndex]);
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
  };

  const handleCopy = (hadith: DailyHadith = currentHadith) => {
    const text = `📖 حدیثِ نبوی ﷺ (${hadith.source} #${hadith.hadithNumber})\n\nعربی:\n${hadith.arabic}\n\nاردو:\n${hadith.urdu}\n\nEnglish:\n"${hadith.english}"\n\nراوی: ${hadith.narrator}\nحوالہ: ${hadith.source} (${hadith.bookChapter}, #${hadith.hadithNumber})\n— Panj Surah & Daily Islamic Companion`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Daily Hadith • ${currentHadith.source}`,
          text: `${currentHadith.arabic}\n\n"${currentHadith.english}"\n\n— ${currentHadith.source} #${currentHadith.hadithNumber}`,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `Hadith from ${currentHadith.source}, narrated by ${currentHadith.narrator}. ${currentHadith.english}`
    );
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const filteredHadiths = DAILY_HADITHS.filter((h) => {
    if (sourceFilter !== 'all' && h.source !== sourceFilter) return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      h.topic.toLowerCase().includes(term) ||
      h.topicUrdu.includes(searchTerm) ||
      h.arabic.includes(searchTerm) ||
      h.urdu.includes(searchTerm) ||
      h.english.toLowerCase().includes(term) ||
      h.narrator.toLowerCase().includes(term) ||
      h.hadithNumber.includes(searchTerm)
    );
  });

  return (
    <div
      className={`rounded-3xl border shadow-xl transition-all relative overflow-hidden ${
        isBright
          ? 'bg-white border-2 border-black text-black'
          : isDark
          ? 'bg-gradient-to-br from-neutral-900 via-neutral-900 to-emerald-950/60 border-emerald-900/60 text-white'
          : 'bg-emerald-50/90 border-2 border-emerald-300 text-slate-900'
      }`}
    >
      {/* Top Banner Ribbon */}
      <div className="px-5 sm:px-7 pt-5 sm:pt-6 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-inner ${
              isBright
                ? 'bg-black text-white'
                : isDark
                ? 'bg-emerald-900/80 border border-emerald-600/50 text-emerald-300'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}
          >
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-emerald-400">
                Daily Hadith • حدیثِ مبارکہ
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-sans font-bold bg-emerald-950 border border-emerald-800/80 text-emerald-300">
                {currentHadith.source}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-white mt-0.5">
              {currentHadith.topic}{' '}
              <span className="font-urdu text-sm font-normal text-amber-200/90 ml-1">
                ({currentHadith.topicUrdu})
              </span>
            </h3>
          </div>
        </div>

        {/* Top Control Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => toggleBookmark(currentHadith.id)}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isBookmarked
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-neutral-800/80 text-neutral-400 hover:text-white'
            }`}
            title={isBookmarked ? 'Saved to Bookmarks' : 'Bookmark Hadith'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            onClick={handleSpeak}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isSpeaking
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-800/80 text-neutral-400 hover:text-white'
            }`}
            title={isSpeaking ? 'Stop Audio' : 'Listen to Hadith'}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => handleCopy()}
            className="p-2 rounded-xl bg-neutral-800/80 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Copy Hadith Text"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-neutral-800/80 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Share Hadith"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsBrowseModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 hover:bg-emerald-900 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ml-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Browse All</span>
          </button>
        </div>
      </div>

      {/* Main Hadith Content Body */}
      <div className="p-5 sm:p-7 space-y-4">
        {/* Arabic Text with Tashkeel */}
        <div
          className="font-mushaf font-arabic text-right text-xl sm:text-2xl leading-[2.6] text-emerald-200 bg-neutral-950/40 p-4 sm:p-5 rounded-2xl border border-neutral-800/80 select-text"
          dir="rtl"
        >
          {currentHadith.arabic}
        </div>

        {/* Urdu Translation */}
        <div className="font-urdu text-right text-base sm:text-lg text-amber-200/90 leading-loose" dir="rtl">
          {currentHadith.urdu}
        </div>

        {/* English Translation */}
        <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans italic border-l-2 border-emerald-500/60 pl-3">
          "{currentHadith.english}"
        </div>

        {/* Bottom Metadata & Controls */}
        <div className="pt-3 border-t border-neutral-800/70 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-neutral-400">
            <span className="font-semibold text-emerald-400">
              {currentHadith.narrator}
            </span>
            <span>•</span>
            <span className="font-mono text-[11px] text-neutral-400">
              {currentHadith.source} #{currentHadith.hadithNumber} ({currentHadith.bookChapter})
            </span>
          </div>

          {/* Navigation Controls: Previous / Next Hadith */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevHadith}
              className="px-3 py-1.5 rounded-xl bg-neutral-800/90 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNextHadith}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Next Hadith</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Browse All 30 Authentic Daily Hadiths with Search */}
      {isBrowseModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setIsBrowseModalOpen(false)}
        >
          <div
            className={`w-full max-w-2xl max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden animate-scale-up ${
              isBright
                ? 'bg-white border-2 border-black text-black'
                : isDark
                ? 'bg-neutral-900 border-emerald-600/60 text-white'
                : 'bg-emerald-50 border-emerald-300 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  Authentic Daily Hadiths (صحیح احادیث مبارکہ)
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Verified traditions strictly from Sahih al-Bukhari &amp; Sahih Muslim
                </p>
              </div>
              <button
                onClick={() => setIsBrowseModalOpen(false)}
                className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search and Source Filter */}
            <div className="p-4 bg-neutral-950/60 border-b border-neutral-800 flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by topic, keyword, or narrator..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {(['all', 'Sahih al-Bukhari', 'Sahih Muslim'] as const).map((source) => (
                  <button
                    key={source}
                    onClick={() => setSourceFilter(source)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      sourceFilter === source
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {source === 'all' ? 'All Books' : source.replace('Sahih ', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Hadiths */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filteredHadiths.map((hadith) => (
                <div
                  key={hadith.id}
                  onClick={() => {
                    setCurrentHadith(hadith);
                    setIsBrowseModalOpen(false);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 hover:border-emerald-500/60 ${
                    currentHadith.id === hadith.id
                      ? 'bg-emerald-950/40 border-emerald-500/80 ring-1 ring-emerald-500/50'
                      : 'bg-neutral-950/60 border-neutral-800/80 hover:bg-neutral-900'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-400">
                      {hadith.topic} • {hadith.topicUrdu}
                    </span>
                    <span className="font-mono text-[11px] text-neutral-400">
                      {hadith.source} #{hadith.hadithNumber}
                    </span>
                  </div>

                  <div className="font-mushaf font-arabic text-right text-lg text-emerald-200 leading-relaxed" dir="rtl">
                    {hadith.arabic}
                  </div>

                  <div className="font-urdu text-right text-sm text-amber-200/90" dir="rtl">
                    {hadith.urdu}
                  </div>

                  <div className="text-xs text-neutral-300 italic">
                    "{hadith.english}"
                  </div>

                  <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-400">
                    <span>Narrated by {hadith.narrator}</span>
                    <span className="text-emerald-400 font-semibold hover:underline">
                      Read on Dashboard →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
