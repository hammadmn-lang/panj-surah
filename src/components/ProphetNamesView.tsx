import React, { useState } from 'react';
import { Search, Heart, Printer, Copy, Check, Info, X, BookOpen, Volume2, Sparkles } from 'lucide-react';
import { PROPHET_NAMES, ProphetName } from '../data/prophetNames';

interface ProphetNamesViewProps {
  isDark?: boolean;
  isBright?: boolean;
}

export const ProphetNamesView: React.FC<ProphetNamesViewProps> = ({
  isDark = true,
  isBright = false,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedName, setSelectedName] = useState<ProphetName | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [duroodCount, setDuroodCount] = useState<number>(0);

  const filteredNames = PROPHET_NAMES.filter((name) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      name.id.toString() === term ||
      name.transliteration.toLowerCase().includes(term) ||
      name.arabic.includes(searchTerm) ||
      name.meaningUr.includes(searchTerm) ||
      name.meaningEn.toLowerCase().includes(term)
    );
  });

  const handleCopy = (name: ProphetName) => {
    const text = `#${name.id} ${name.arabic} (${name.transliteration})\nاردو: ${name.meaningUr}\nEnglish: ${name.meaningEn}\nصَلَّى اللّٰهُ تَعَالَىٰ عَلَيْهِ وَآلِهِ وَسَلَّمَ`;
    navigator.clipboard.writeText(text);
    setCopiedId(name.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in print:m-0 print:p-0">
      {/* Featured Header Card */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
          isBright
            ? 'bg-white border-2 border-black text-black'
            : isDark
            ? 'bg-gradient-to-r from-emerald-950 via-teal-950 to-neutral-950 text-white border-emerald-800/60'
            : 'bg-emerald-50/90 border-2 border-emerald-300 text-slate-900'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 shadow-inner ${
                isBright
                  ? 'bg-black text-white border-black'
                  : isDark
                  ? 'bg-emerald-900/80 border-emerald-600/50 text-emerald-300'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}
            >
              <Heart className="w-7 h-7 fill-emerald-500/20 text-emerald-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-emerald-400">
                  Asma-un-Nabi • 99 Blessed Names of the Prophet ﷺ
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mushaf font-arabic font-bold bg-emerald-900/40 text-emerald-300 border border-emerald-700/60">
                  أَسْمَاءُ النَّبِيِّ الْمُصْطَفَىٰ ﷺ
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif mt-1">
                99 Blessed Names of Prophet Muhammad ﷺ (اسمائے مصطفیٰ ﷺ)
              </h2>
              <p
                className={`text-xs mt-1 max-w-2xl ${
                  isBright ? 'text-slate-700' : isDark ? 'text-neutral-400' : 'text-slate-600'
                }`}
              >
                Reciting, contemplating, and sending peace upon the Blessed Names of the Holy Prophet Muhammad ﷺ brings boundless barakah, spiritual elevation, and proximity to the Beloved Messenger of Allah (صَلَّى اللّٰهُ عَلَيْهِ وَآلِهِ وَسَلَّمَ).
              </p>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0 print:hidden"
          >
            <Printer className="w-4 h-4" />
            <span>Print 99 Names</span>
          </button>
        </div>
      </div>

      {/* Search & Counter Bar */}
      <div
        className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl border print:hidden ${
          isBright
            ? 'bg-slate-100 border-slate-300'
            : isDark
            ? 'bg-neutral-900 border-neutral-800'
            : 'bg-emerald-100/60 border-emerald-200'
        }`}
      >
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Blessed Name, meaning, or number..."
            className={`w-full pl-9 pr-8 py-2 rounded-xl border text-xs focus:outline-hidden transition-colors ${
              isBright
                ? 'bg-white border-black text-black placeholder-slate-400 focus:border-emerald-600'
                : isDark
                ? 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-500 focus:border-emerald-500'
                : 'bg-white border-emerald-300 text-slate-900 placeholder-slate-400 focus:border-emerald-600'
            }`}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <span className="text-xs text-neutral-400 font-mono">
          Showing <span className="text-emerald-400 font-bold">{filteredNames.length}</span> of 99 Blessed Names
        </span>
      </div>

      {/* Grid of 99 Names */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNames.map((name) => {
          const isCopied = copiedId === name.id;
          return (
            <div
              key={name.id}
              onClick={() => setSelectedName(name)}
              className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer relative group flex flex-col justify-between hover:scale-[1.01] hover:shadow-lg ${
                isBright
                  ? 'bg-white border-slate-300 hover:border-black'
                  : isDark
                  ? 'bg-neutral-900/90 border-neutral-800/80 hover:border-emerald-500/50 hover:bg-neutral-900'
                  : 'bg-white/95 border-emerald-200 hover:border-emerald-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                      isBright
                        ? 'bg-slate-200 text-black'
                        : isDark
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    #{name.id}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(name);
                      }}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800/60 transition-colors"
                      title="Copy Name"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Arabic Calligraphy */}
                <div className="text-center py-2">
                  <div
                    className={`font-mushaf font-arabic text-2xl sm:text-3xl leading-relaxed text-emerald-300 group-hover:text-emerald-200 transition-colors ${
                      isBright ? 'text-emerald-900' : ''
                    }`}
                    dir="rtl"
                  >
                    {name.arabic}
                  </div>
                  <div className="text-xs font-semibold tracking-wide text-neutral-300 mt-1 font-mono">
                    {name.transliteration}
                  </div>
                </div>

                {/* Urdu Meaning */}
                <div
                  className="text-center font-urdu text-base sm:text-lg text-amber-200/90 mt-2 leading-relaxed"
                  dir="rtl"
                >
                  {name.meaningUr}
                </div>

                {/* English Meaning */}
                <div className="text-center text-xs text-neutral-400 mt-1 italic">
                  {name.meaningEn}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-500">
                <span className="flex items-center gap-1 group-hover:text-emerald-400 transition-colors">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  <span>Click for Salawat &amp; details</span>
                </span>
                <span className="font-mushaf text-xs text-emerald-400">ﷺ</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Details & Durood Counter */}
      {selectedName && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedName(null)}
        >
          <div
            className={`w-full max-w-lg p-6 sm:p-8 rounded-3xl border shadow-2xl relative animate-scale-up ${
              isBright
                ? 'bg-white border-2 border-black text-black'
                : isDark
                ? 'bg-neutral-900 border-emerald-600/60 text-white'
                : 'bg-emerald-50 border-emerald-300 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedName(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-neutral-800/80 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/80 mb-2">
                Blessed Name #{selectedName.id} of 99
              </span>
              <h2 className="font-mushaf font-arabic text-4xl sm:text-5xl text-emerald-300 my-3 leading-relaxed" dir="rtl">
                {selectedName.arabic}
              </h2>
              <div className="text-base font-semibold tracking-wider text-neutral-300 font-mono">
                {selectedName.transliteration}
              </div>
            </div>

            {/* Meanings */}
            <div className="my-6 space-y-4">
              <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  اردو مفہوم (Urdu Meaning):
                </span>
                <div className="font-urdu text-xl text-amber-200 leading-loose" dir="rtl">
                  {selectedName.meaningUr}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  English Translation:
                </span>
                <div className="text-sm text-neutral-200">
                  {selectedName.meaningEn}
                </div>
              </div>

              {/* Salawat Counter & Virtues */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/90 to-teal-950/80 border border-emerald-700/60 text-center">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  درود و سلام (Send Peace &amp; Blessings)
                </span>
                <div className="font-mushaf font-arabic text-xl sm:text-2xl text-emerald-200 my-2" dir="rtl">
                  صَلَّى اللّٰهُ تَعَالَىٰ عَلَيْهِ وَآلِهِ وَسَلَّمَ
                </div>
                <div className="flex items-center justify-center gap-3 mt-3">
                  <button
                    onClick={() => setDuroodCount((c) => c + 1)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Recite Salawat ({duroodCount})</span>
                  </button>
                  {duroodCount > 0 && (
                    <button
                      onClick={() => setDuroodCount(0)}
                      className="px-2.5 py-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white text-xs transition-colors"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => handleCopy(selectedName)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedId === selectedName.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Name</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setSelectedName(null)}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
