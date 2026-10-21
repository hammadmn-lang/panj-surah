import React, { useRef } from 'react';
import { X, Printer, Download, BookOpen, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
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

  if (!isOpen || !surah) return null;

  const AYAT_PER_PDF_PAGE = 11;
  const totalPdfPages = Math.ceil(surah.verses.length / AYAT_PER_PDF_PAGE);

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-emerald-200 overflow-hidden text-slate-800">
        {/* Top Control Bar (Hidden during printing) */}
        <div className="p-4 sm:p-5 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-3 bg-emerald-50/70 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-emerald-950 flex items-center gap-2">
                Surah #{surah.number} {surah.nameTransliteration} ({surah.nameArabic}) — Mushaf PDF
              </h3>
              <p className="text-xs text-slate-600">
                Surah #{surah.number} in Holy Quran • {surah.versesCount} Ayahs • {totalPdfPages} Mushaf Pages
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintPdf}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
              title="Print or Save as PDF using browser print dialog"
            >
              <Printer className="w-4 h-4" />
              <span>Save / Print PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close PDF View"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Mushaf Document Content */}
        <div
          ref={printAreaRef}
          className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 bg-slate-50/50 print:bg-white print:p-0 print:overflow-visible"
        >
          {Array.from({ length: totalPdfPages }).map((_, pageIdx) => {
            const pageNumber = pageIdx + 1;
            const startAyah = pageIdx * AYAT_PER_PDF_PAGE;
            const endAyah = Math.min(startAyah + AYAT_PER_PDF_PAGE, surah.verses.length);
            const pageVerses = surah.verses.slice(startAyah, endAyah);

            return (
              <div
                key={pageNumber}
                className="bg-white rounded-2xl border-2 border-emerald-600/30 p-6 sm:p-8 shadow-sm relative print:shadow-none print:border-emerald-700 print:page-break-after-always print:m-0"
              >
                {/* Ornamental Islamic Header on each PDF Page */}
                <div className="border-b-2 border-emerald-500/30 pb-3 mb-6 flex items-center justify-between text-xs text-emerald-900 font-semibold">
                  <span>سُورَةُ {surah.nameArabic}</span>
                  <span className="font-mono text-[11px] text-slate-500">
                    Ayat {startAyah + 1} – {endAyah}
                  </span>
                  <span>Surah {surah.nameTransliteration}</span>
                </div>

                {/* Bismillah on Page 1 */}
                {pageNumber === 1 && surah.number !== 9 && (
                  <div className="text-center py-4 mb-4 border-b border-emerald-100">
                    <div className="font-arabic text-2xl sm:text-3xl text-emerald-800 leading-loose">
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </div>
                  </div>
                )}

                {/* 11 Ayat Content formatted in clean 14px Mushaf style */}
                <div
                  className="font-arabic text-right text-slate-900 leading-[2.6] space-y-3"
                  dir="rtl"
                  style={{ fontSize: '15px' }}
                >
                  {pageVerses.map((verse) => (
                    <span key={verse.id} className="inline ml-2.5">
                      <span className="text-slate-900 font-medium">
                        {verse.textArabic}
                      </span>
                      <span className="inline-flex items-center justify-center mx-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-mono font-bold border border-emerald-300 select-none">
                        ۝ {verse.number}
                      </span>
                    </span>
                  ))}
                </div>

                {/* Ornamental Page Footer */}
                <div className="mt-8 pt-3 border-t border-emerald-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Panj Surah Official Companion</span>
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Page {pageNumber} of {totalPdfPages}
                  </span>
                  <span>القرآن الكريم</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar with Page Navigation & Print Action */}
        <div className="p-3 sm:p-4 bg-emerald-50/70 border-t border-emerald-100 flex items-center justify-between text-xs print:hidden">
          <span className="text-slate-600 font-medium">
            💡 Tip: Click <strong>"Save / Print PDF"</strong> and select <strong>"Save as PDF"</strong> as printer destination.
          </span>
          <button
            onClick={handlePrintPdf}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all shadow-sm cursor-pointer"
          >
            Print / Save {surah.nameTransliteration} PDF
          </button>
        </div>
      </div>
    </div>
  );
};
