import React, { useState } from 'react';
import { Sparkles, Printer, Copy, Check, BookOpen, Volume2, Heart, Share2, HelpCircle } from 'lucide-react';
import { DUA_JAMEELA } from '../data/duaJameela';

interface DuaJameelaViewProps {
  isDark?: boolean;
  isBright?: boolean;
}

export const DuaJameelaView: React.FC<DuaJameelaViewProps> = ({
  isDark = true,
  isBright = false,
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('large');
  const [showUrdu, setShowUrdu] = useState<boolean>(true);
  const [showEnglish, setShowEnglish] = useState<boolean>(false);
  const [showTransliteration, setShowTransliteration] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [showVirtues, setShowVirtues] = useState<boolean>(false);

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'normal':
        return 'text-2xl sm:text-3xl leading-[2.6]';
      case 'large':
        return 'text-3xl sm:text-4xl leading-[2.9] font-medium';
      case 'extra-large':
        return 'text-4xl sm:text-5xl leading-[3.3] font-semibold';
    }
  };

  const handleCopyAll = () => {
    const fullText = `${DUA_JAMEELA.titleArabic}\n${DUA_JAMEELA.titleUrdu} (${DUA_JAMEELA.title})\n\n${DUA_JAMEELA.arabicOpening}\n\n` +
      DUA_JAMEELA.phrases.map((p) => `${p.arabic} - ${p.meaningUr} (${p.meaningEn})`).join('\n') +
      `\n\n${DUA_JAMEELA.closingArabic}\n\n${DUA_JAMEELA.closingUrdu}`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
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
            ? 'bg-gradient-to-r from-emerald-950 via-neutral-900 to-neutral-950 text-white border-emerald-800/60'
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
                <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-emerald-500">
                  Madani Panj Surah • Special Dua
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mushaf font-arabic font-bold bg-emerald-900/40 text-emerald-300 border border-emerald-700/60">
                  دُعَاءُ الْجَمِيلَة
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif mt-1">
                {DUA_JAMEELA.titleUrdu} (Dua Jameela)
              </h2>
              <p
                className={`text-xs mt-1 max-w-2xl ${
                  isBright ? 'text-slate-700' : isDark ? 'text-neutral-400' : 'text-slate-600'
                }`}
              >
                {DUA_JAMEELA.description}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <button
              onClick={() => setShowVirtues(!showVirtues)}
              className="px-3.5 py-2 rounded-xl border border-emerald-600/40 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{showVirtues ? 'Hide Virtues' : 'Virtues & Benefits'}</span>
            </button>

            <button
              onClick={handleCopyAll}
              className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied All!' : 'Copy Dua'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Collapsible Virtues Panel */}
        {showVirtues && (
          <div className="mt-5 p-4 rounded-2xl bg-neutral-950/60 border border-emerald-800/40 text-xs space-y-2 text-neutral-300 animate-fade-in">
            <span className="font-bold text-emerald-400 block uppercase tracking-wider text-[11px]">
              فضائل و برکات (Virtues according to Dawat-e-Islami traditions):
            </span>
            <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
              {DUA_JAMEELA.virtues.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Toolbar: Font Sizing & Translation Toggles */}
      <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
        {/* Font size selectors */}
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-400 font-medium">Font Size:</span>
          {(['normal', 'large', 'extra-large'] as const).map((size) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition-all cursor-pointer ${
                fontSize === size
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {size.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Language toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUrdu(!showUrdu)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold font-urdu transition-all cursor-pointer ${
              showUrdu
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            اردو ترجمہ (Urdu)
          </button>
          <button
            onClick={() => setShowEnglish(!showEnglish)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              showEnglish
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setShowTransliteration(!showTransliteration)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              showTransliteration
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            Transliteration
          </button>
        </div>
      </div>

      {/* Printable Parchment Mushaf Container */}
      <div className="bg-[#fffefb] rounded-3xl border-4 border-double border-emerald-800/40 p-6 sm:p-10 shadow-2xl text-slate-950 space-y-8 print:border-none print:shadow-none print:p-0 print:m-0">
        {/* Ornamental Top Calligraphy Header */}
        <div className="text-center border-b-2 border-emerald-700/40 pb-6 bg-emerald-50/50 -mx-6 -mt-6 sm:-mx-10 sm:-mt-10 p-6 rounded-t-2xl">
          <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-800 font-bold block mb-1">
            مستند قرآنی مسنون دعائیں • مدنی پنج سورۃ
          </span>
          <h1 className="font-mushaf font-arabic text-3xl sm:text-4xl text-emerald-950 font-bold">
            {DUA_JAMEELA.titleArabic}
          </h1>
          <p className="font-urdu text-sm sm:text-base text-emerald-900 font-semibold mt-1">
            {DUA_JAMEELA.titleUrdu}
          </p>

          <div className="font-mushaf font-arabic text-2xl sm:text-3xl text-emerald-900 font-bold mt-4">
            {DUA_JAMEELA.arabicOpening}
          </div>
        </div>

        {/* 48 Sacred Attribute Phrases in Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DUA_JAMEELA.phrases.map((phrase) => (
            <div
              key={phrase.id}
              className="p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-xs hover:border-emerald-500/80 transition-all space-y-2"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-mono font-bold flex items-center justify-center shrink-0 border border-emerald-300">
                  {phrase.id}
                </span>
                <div
                  className={`font-mushaf font-arabic text-right text-slate-950 font-bold flex-1 ${getFontSizeClass()}`}
                  dir="rtl"
                >
                  {phrase.arabic}
                </div>
              </div>

              {showTransliteration && (
                <div className="text-xs text-slate-600 font-sans italic border-t border-slate-100 pt-1.5">
                  {phrase.transliteration}
                </div>
              )}

              {showUrdu && (
                <div className="font-urdu text-right text-emerald-950 text-sm leading-relaxed border-t border-emerald-50 pt-1.5" dir="rtl">
                  {phrase.meaningUr}
                </div>
              )}

              {showEnglish && (
                <div className="text-xs text-slate-700 font-sans border-t border-slate-100 pt-1">
                  {phrase.meaningEn}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sacred Closing Supplication & Salawat */}
        <div className="p-6 rounded-2xl bg-emerald-50/70 border-2 border-emerald-600/40 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block font-mono">
            ختمِ دعا مبارک و صلوات (Closing Supplication):
          </span>

          <div className={`font-mushaf font-arabic text-right text-emerald-950 font-bold leading-[2.9] ${getFontSizeClass()}`} dir="rtl">
            {DUA_JAMEELA.closingArabic}
          </div>

          {showTransliteration && (
            <div className="text-xs text-slate-700 font-sans italic border-t border-emerald-200 pt-3">
              {DUA_JAMEELA.closingTransliteration}
            </div>
          )}

          {showUrdu && (
            <div className="font-urdu text-right text-emerald-950 text-base leading-relaxed border-t border-emerald-200 pt-3" dir="rtl">
              <span className="font-sans font-bold text-xs text-emerald-800 ml-2">ترجمہ:</span>
              {DUA_JAMEELA.closingUrdu}
            </div>
          )}

          {showEnglish && (
            <div className="text-xs text-slate-800 leading-relaxed border-t border-emerald-200 pt-2 font-sans">
              <span className="font-bold mr-2">Translation:</span>
              {DUA_JAMEELA.closingEnglish}
            </div>
          )}
        </div>

        {/* Ornamental Bottom Footer */}
        <div className="border-t-2 border-emerald-700/40 pt-4 flex items-center justify-between text-xs text-slate-600 font-medium">
          <span>پنج سورۃ مبارک • مستند دعائیں</span>
          <span className="font-mushaf font-arabic text-emerald-900 font-bold text-sm">
            بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ
          </span>
          <span>Dawat-e-Islami Panj Surah Format</span>
        </div>
      </div>
    </div>
  );
};
