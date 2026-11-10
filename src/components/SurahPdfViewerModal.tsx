import React, { useRef, useState } from 'react';
import { X, Printer, FileText, ZoomIn, ZoomOut, BookOpen, Sparkles, Check, Globe, HelpCircle } from 'lucide-react';
import { Surah } from '../types';

interface SurahPdfViewerModalProps {
  surah: Surah | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SurahPdfViewerModal: React.FC<SurahPdfViewerModalProps> = ({
  surah,
  isOpen,
  onClose,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'mushaf' | 'study'>('mushaf');
  const [fontSize, setFontSize] = useState<'medium' | 'large' | 'extra-large'>('large');
  const [showUrdu, setShowUrdu] = useState<boolean>(true);
  const [showEnglish, setShowEnglish] = useState<boolean>(false);
  const [showTransliteration, setShowTransliteration] = useState<boolean>(false);

  if (!isOpen || !surah) return null;

  // Number of ayat per page in Mushaf mode for optimal spacing
  const AYAT_PER_PDF_PAGE = viewMode === 'mushaf' ? 10 : 6;
  const totalPdfPages = Math.ceil(surah.verses.length / AYAT_PER_PDF_PAGE);

  const handlePrintPdf = () => {
    window.print();
  };

  const getArabicSizeClass = () => {
    switch (fontSize) {
      case 'medium':
        return 'text-2xl sm:text-3xl leading-[2.6]';
      case 'large':
        return 'text-3xl sm:text-4xl leading-[3.0] font-medium';
      case 'extra-large':
        return 'text-4xl sm:text-5xl leading-[3.4] font-semibold';
    }
  };

  const isMakki = surah.revelationType.toLowerCase().includes('mecc');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border-2 border-emerald-600/40 overflow-hidden text-slate-900 print:max-h-none print:border-none print:shadow-none print:w-full">
        {/* Top Control Bar (Hidden when printing or saving as PDF) */}
        <div className="p-3 sm:p-5 border-b border-emerald-200 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 print:hidden select-none">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-950/20 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-950 font-extrabold">
                  Dawat-e-Islami Style Mushaf PDF
                </span>
                <span className="text-xs text-emerald-800 font-semibold hidden sm:inline">
                  Surah #{surah.number} in Quran Pak
                </span>
              </div>
              <h3 className="font-bold text-base sm:text-lg text-emerald-950 flex items-center gap-2 mt-0.5">
                سُورَةُ {surah.nameArabic} — {surah.nameTransliteration} ({surah.nameEnglish})
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl bg-white border border-emerald-300 p-0.5 shadow-sm text-xs font-semibold">
              <button
                onClick={() => setViewMode('mushaf')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'mushaf'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-700 hover:text-emerald-900'
                }`}
                title="Continuous 16-Line Holy Mushaf Layout"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>16-Line Mushaf</span>
              </button>
              <button
                onClick={() => setViewMode('study')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'study'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-700 hover:text-emerald-900'
                }`}
                title="Verse-by-Verse with Translations"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Verse by Verse</span>
              </button>
            </div>

            {/* Font Size Selector (Medium, Large, Extra-Large) */}
            <div className="flex items-center rounded-xl bg-white border border-emerald-300 p-0.5 shadow-sm text-xs font-semibold">
              <button
                onClick={() => setFontSize('medium')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  fontSize === 'medium'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-700 hover:text-emerald-900'
                }`}
                title="Standard font size"
              >
                Normal
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  fontSize === 'large'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-700 hover:text-emerald-900'
                }`}
                title="Large readable font (Recommended)"
              >
                Large
              </button>
              <button
                onClick={() => setFontSize('extra-large')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  fontSize === 'extra-large'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-700 hover:text-emerald-900'
                }`}
                title="Extra large font for easy reading"
              >
                Extra Large
              </button>
            </div>

            {/* Translation Toggles when in Verse-by-Verse mode */}
            {viewMode === 'study' && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowUrdu(!showUrdu)}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    showUrdu
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                      : 'bg-white border-slate-300 text-slate-500'
                  }`}
                >
                  اردو (کنز الایمان)
                </button>
                <button
                  onClick={() => setShowEnglish(!showEnglish)}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    showEnglish
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                      : 'bg-white border-slate-300 text-slate-500'
                  }`}
                >
                  English
                </button>
              </div>
            )}

            {/* Print / Save PDF Button */}
            <button
              onClick={handlePrintPdf}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-md shadow-emerald-950/20 transition-all cursor-pointer"
              title="Save or Print as PDF using your browser dialog"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close PDF View"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Mushaf Document Content */}
        <div
          ref={printAreaRef}
          className="flex-1 overflow-y-auto p-3 sm:p-8 space-y-8 bg-slate-100/70 print:bg-white print:p-0 print:overflow-visible"
        >
          {Array.from({ length: totalPdfPages }).map((_, pageIdx) => {
            const pageNumber = pageIdx + 1;
            const startAyah = pageIdx * AYAT_PER_PDF_PAGE;
            const endAyah = Math.min(startAyah + AYAT_PER_PDF_PAGE, surah.verses.length);
            const pageVerses = surah.verses.slice(startAyah, endAyah);

            return (
              <div
                key={pageNumber}
                className="bg-[#fffefb] rounded-2xl border-4 border-double border-emerald-800/40 p-6 sm:p-10 shadow-lg relative print:shadow-none print:border-emerald-900 print:page-break-after-always print:m-0 print:rounded-none"
              >
                {/* Dawat-e-Islami Style Ornamental Islamic Top Header on each PDF Page */}
                <div className="border-b-2 border-emerald-700/40 pb-3 mb-6 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-950 font-bold bg-emerald-50/60 -mx-6 -mt-6 sm:-mx-10 sm:-mt-10 p-4 rounded-t-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mushaf font-arabic text-base sm:text-lg text-emerald-900">
                      سُورَةُ {surah.nameArabic} {isMakki ? 'مَكِّيَّةٌ' : 'مَدَنِيَّةٌ'}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-200/80 text-emerald-900 font-sans">
                      Surah #{surah.number}
                    </span>
                  </div>

                  <div className="font-mono text-[11px] text-slate-600 font-semibold">
                    آیات {startAyah + 1} تا {endAyah} (کل آیات {surah.versesCount})
                  </div>

                  <div className="font-sans text-xs text-emerald-900 font-semibold hidden sm:block">
                    Surah {surah.nameTransliteration} ({surah.nameEnglish})
                  </div>
                </div>

                {/* Bismillah on Page 1 (Never duplicated in Ayah 1) */}
                {pageNumber === 1 && surah.number !== 9 && (
                  <div className="text-center py-5 mb-6 border-y-2 border-dashed border-emerald-600/30 bg-emerald-50/40 rounded-xl">
                    <div className="font-mushaf font-arabic text-3xl sm:text-4xl text-emerald-950 font-bold leading-relaxed tracking-wide">
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </div>
                    <div className="font-urdu text-xs text-emerald-900/80 mt-1">
                      اللہ کے نام سے شروع جو نہایت مہربان، ہمیشہ رحم فرمانے والا ہے (کنز الایمان)
                    </div>
                  </div>
                )}

                {/* Quranic Verses Presentation */}
                {viewMode === 'mushaf' ? (
                  /* 16-Line Continuous Mushaf Flow */
                  <div
                    className={`font-mushaf font-arabic text-right text-slate-950 text-justify tracking-wide ${getArabicSizeClass()}`}
                    dir="rtl"
                  >
                    {pageVerses.map((verse) => (
                      <span key={verse.id} className="inline ml-2.5">
                        <span className="text-slate-950 font-medium">
                          {verse.textArabic}
                        </span>
                        <span className="inline-flex items-center justify-center mx-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 text-xs font-mono font-bold border border-emerald-400 select-none shadow-xs">
                          ۝ {verse.number}
                        </span>
                      </span>
                    ))}
                  </div>
                ) : (
                  /* Verse-by-Verse Study Mode with Kanzul Iman Urdu & English */
                  <div className="space-y-6">
                    {pageVerses.map((verse) => (
                      <div
                        key={verse.id}
                        className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-200/80 shadow-xs space-y-3"
                      >
                        {/* Ayah Number Badge & Arabic Verse */}
                        <div className="flex items-start justify-between gap-4">
                          <span className="w-8 h-8 rounded-full bg-emerald-700 text-white text-xs font-bold font-mono flex items-center justify-center shrink-0 shadow-xs">
                            {verse.number}
                          </span>
                          <div
                            className={`font-mushaf font-arabic text-right text-slate-950 flex-1 ${getArabicSizeClass()}`}
                            dir="rtl"
                          >
                            {verse.textArabic}
                          </div>
                        </div>

                        {/* Transliteration */}
                        {showTransliteration && (
                          <div className="text-xs text-slate-600 font-sans italic border-t border-slate-100 pt-2">
                            {verse.transliteration}
                          </div>
                        )}

                        {/* Urdu Translation (Kanzul Iman / Dawat-e-Islami Style) */}
                        {showUrdu && verse.translationUr && (
                          <div
                            className="font-urdu text-right text-emerald-950 text-sm sm:text-base leading-relaxed border-t border-emerald-100 pt-2"
                            dir="rtl"
                          >
                            <span className="text-xs text-emerald-700 font-sans font-bold ml-2">ترجمہ:</span>
                            {verse.translationUr}
                          </div>
                        )}

                        {/* English Translation */}
                        {showEnglish && (
                          <div className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed border-t border-slate-100 pt-2">
                            <span className="font-semibold text-slate-900 mr-2">Translation:</span>
                            {verse.translation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Ornamental Page Footer */}
                <div className="mt-8 pt-4 border-t-2 border-emerald-700/40 flex items-center justify-between text-xs text-slate-600 font-medium bg-emerald-50/50 -mx-6 -mb-6 sm:-mx-10 sm:-mb-10 p-3 rounded-b-xl">
                  <span className="font-sans font-semibold text-emerald-950">
                    پنج سورۃ مبارک • مستند قرآنی متن
                  </span>
                  <span className="font-bold text-emerald-950 bg-white px-3 py-1 rounded-full border border-emerald-300 shadow-xs">
                    Page {pageNumber} of {totalPdfPages}
                  </span>
                  <span className="font-mushaf font-arabic text-sm text-emerald-900 font-bold">
                    الْقُرْآنُ الْكَرِيمُ
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar with Page Navigation & Print Action */}
        <div className="p-3 sm:p-4 bg-emerald-50/80 border-t border-emerald-200 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
          <div className="text-slate-700 font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>
              <strong>Dawat-e-Islami Standard:</strong> Fully vocalized Arabic script with large readable font, verified Ayah stops, and optional Kanzul Iman Urdu translation.
            </span>
          </div>

          <button
            onClick={handlePrintPdf}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all shadow-md shadow-emerald-950/20 cursor-pointer flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print or Download {surah.nameTransliteration} PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
