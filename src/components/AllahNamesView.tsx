import React, { useState } from 'react';
import { Search, Sparkles, Printer, Copy, Check, Info, Heart, X, BookOpen } from 'lucide-react';
import { ALLAH_NAMES, DivineName } from '../data/allahNames';

interface AllahNamesViewProps {
  isDark?: boolean;
  isBright?: boolean;
}

export const AllahNamesView: React.FC<AllahNamesViewProps> = ({
  isDark = true,
  isBright = false,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedName, setSelectedName] = useState<DivineName | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filteredNames = ALLAH_NAMES.filter((name) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      name.id.toString() === term ||
      name.transliteration.toLowerCase().includes(term) ||
      name.arabic.includes(searchTerm) ||
      name.meaningUr.includes(searchTerm) ||
      name.meaningEn.toLowerCase().includes(term) ||
      name.benefit.toLowerCase().includes(term)
    );
  });

  const handleCopy = (name: DivineName) => {
    const text = `#${name.id} ${name.arabic} (${name.transliteration})\nUrdu: ${name.meaningUr}\nEnglish: ${name.meaningEn}\nBenefit: ${name.benefit}`;
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
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-emerald-400">
                  Asma-ul-Husna • 99 Divine Names
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mushaf font-arabic font-bold bg-emerald-900/40 text-emerald-300 border border-emerald-700/60">
                  أَسْمَاءُ اللَّهِ الْحُسْنَى
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif mt-1">
                99 Beautiful Names of Allah (اسماء الحسنى)
              </h2>
              <p
                className={`text-xs mt-1 max-w-2xl ${
                  isBright ? 'text-slate-700' : isDark ? 'text-neutral-400' : 'text-slate-600'
                }`}
              >
                The Prophet Muhammad (ﷺ) said: "Allah has ninety-nine names, one hundred less one; whoever memorizes them and lives by them will enter Paradise." (Sahih al-Bukhari 2736, Sahih Muslim 2677).
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 print:hidden">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, meaning, or number..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
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
          Showing <strong>{filteredNames.length}</strong> of <strong>99</strong> Divine Names
        </span>
      </div>

      {/* 99 Names Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredNames.map((name) => (
          <div
            key={name.id}
            onClick={() => setSelectedName(name)}
            className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-emerald-600/60 transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between group"
          >
            <div>
              {/* Top row: Number & Calligraphy */}
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="w-7 h-7 rounded-full bg-emerald-950 text-emerald-400 text-xs font-mono font-bold flex items-center justify-center border border-emerald-800/60">
                  {name.id}
                </span>

                <div className="font-mushaf font-arabic text-2xl sm:text-3xl text-emerald-300 font-bold group-hover:text-emerald-400 transition-colors" dir="rtl">
                  {name.arabic}
                </div>
              </div>

              {/* Transliteration & English Meaning */}
              <div className="mt-1">
                <h4 className="text-sm font-bold text-white tracking-wide">
                  {name.transliteration}
                </h4>
                <p className="text-xs text-neutral-400 line-clamp-1">
                  {name.meaningEn}
                </p>
              </div>

              {/* Urdu Meaning */}
              <div className="mt-2 pt-2 border-t border-neutral-800/80 font-urdu text-right text-emerald-300 text-sm" dir="rtl">
                {name.meaningUr}
              </div>
            </div>

            {/* Bottom benefit snippet */}
            <div className="mt-3 pt-2 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
              <span className="truncate max-w-[200px] italic">
                {name.benefit}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(name);
                }}
                className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors ml-2"
                title="Copy name details"
              >
                {copiedId === name.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal for Selected Divine Name */}
      {selectedName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border-2 border-emerald-600/50 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-5 text-white">
            <button
              onClick={() => setSelectedName(null)}
              className="absolute right-4 top-4 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pt-2">
              <span className="w-9 h-9 rounded-full bg-emerald-950 text-emerald-400 font-mono text-sm font-bold inline-flex items-center justify-center border border-emerald-800 mb-2">
                #{selectedName.id}
              </span>
              <div className="font-mushaf font-arabic text-4xl sm:text-5xl text-emerald-400 font-bold mb-2" dir="rtl">
                {selectedName.arabic}
              </div>
              <h3 className="text-xl font-bold font-serif">
                {selectedName.transliteration}
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">English Meaning</span>
                <p className="text-sm text-neutral-200 font-medium">{selectedName.meaningEn}</p>
              </div>

              <div className="pt-2 border-t border-neutral-800 text-right" dir="rtl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 block font-sans">اردو معنی و مفہوم</span>
                <p className="font-urdu text-base text-emerald-200 mt-0.5">{selectedName.meaningUr}</p>
              </div>

              <div className="pt-2 border-t border-neutral-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">روحانی برکات و وظیفہ (Spiritual Benefit)</span>
                <p className="text-xs text-neutral-300 leading-relaxed mt-0.5">{selectedName.benefit}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => handleCopy(selectedName)}
                className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedId === selectedName.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === selectedName.id ? 'Copied Details' : 'Copy'}</span>
              </button>
              <button
                onClick={() => setSelectedName(null)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
