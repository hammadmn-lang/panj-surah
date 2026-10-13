import React, { useState } from 'react';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Smartphone,
  Plus,
  Sparkles,
  Check,
  Award,
  CircleDot,
  Layers,
  Flame,
  Edit2,
  Hash,
  BarChart2,
} from 'lucide-react';
import { TasbeehDhikr, UserProfile } from '../types';
import { playCompletionChime, playTasbeehClick } from '../utils/audioAlarm';
import confetti from 'canvas-confetti';
import { TasbeehStats } from './TasbeehStats';

interface TasbeehViewProps {
  userProfile: UserProfile;
  onUpdateTasbeehTotal: (newTotal: number, dhikrTitle?: string, countDelta?: number) => void;
  onSaveCustomDhikr: (dhikr: TasbeehDhikr) => void;
}

const DEFAULT_DHIKRS: TasbeehDhikr[] = [
  {
    id: 'subhanallah',
    title: 'SubhanAllah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subḥānallāh',
    translation: 'Glory be to Allah',
    target: 33,
    count: 0,
    totalSaved: 0,
  },
  {
    id: 'alhamdulillah',
    title: 'Alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Al-ḥamdu lillāh',
    translation: 'All praise is due to Allah',
    target: 33,
    count: 0,
    totalSaved: 0,
  },
  {
    id: 'allahuakbar',
    title: 'Allahu Akbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    translation: 'Allah is the Greatest',
    target: 34,
    count: 0,
    totalSaved: 0,
  },
  {
    id: 'astaghfirullah',
    title: 'Astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullāh',
    translation: 'I seek forgiveness from Allah',
    target: 100,
    count: 0,
    totalSaved: 0,
  },
  {
    id: 'lailahaillallah',
    title: 'La Ilaha Illallah',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
    transliteration: 'Lā ilāha illallāh',
    translation: 'There is no deity except Allah',
    target: 100,
    count: 0,
    totalSaved: 0,
  },
  {
    id: 'ayat-karima',
    title: 'Ayat-e-Karima (Dua Yunus)',
    arabic: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    transliteration: 'Lā ilāha illā Anta subḥānaka innī kuntu minaẓ-ẓālimīn',
    translation: 'There is no deity except You; exalted are You. Indeed, I was of the wrongdoers.',
    target: 100,
    count: 0,
    totalSaved: 0,
  },
  {
    id: 'hasbunallah',
    title: 'HasbunAllahu wa ni’mal wakeel',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: 'Ḥasbunallāhu wa ni‘mal-wakīl',
    translation: 'Sufficient for us is Allah, and [He is] the best Disposer of affairs.',
    target: 100,
    count: 0,
    totalSaved: 0,
  },
];

export const TasbeehView: React.FC<TasbeehViewProps> = ({
  userProfile,
  onUpdateTasbeehTotal,
  onSaveCustomDhikr,
}) => {
  const allDhikrs = [...DEFAULT_DHIKRS, ...userProfile.customDhikrs];
  const [activeViewTab, setActiveViewTab] = useState<'counter' | 'stats'>('counter');
  const [selectedDhikr, setSelectedDhikr] = useState<TasbeehDhikr>(allDhikrs[0]);
  const [count, setCount] = useState<number>(0);
  const [target, setTarget] = useState<number>(allDhikrs[0].target);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [isBeadAnimating, setIsBeadAnimating] = useState<boolean>(false);

  // Manual Name Edit state
  const [isEditingName, setIsEditingName] = useState(false);
  const [manualTitle, setManualTitle] = useState(selectedDhikr.title);

  // Manual Count Input Modal state
  const [showManualCountModal, setShowManualCountModal] = useState<boolean>(false);
  const [manualCountInput, setManualCountInput] = useState<string>('');
  const [manualLifetimeInput, setManualLifetimeInput] = useState<string>('');

  // Custom Dhikr Modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customArabic, setCustomArabic] = useState('');
  const [customTrans, setCustomTrans] = useState('');
  const [customTarget, setCustomTarget] = useState('33');

  const handleSelectDhikr = (d: TasbeehDhikr) => {
    setSelectedDhikr(d);
    setManualTitle(d.title);
    setTarget(d.target);
    setCount(0);
    setIsEditingName(false);
  };

  const handleSaveManualName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;
    const updated: TasbeehDhikr = {
      ...selectedDhikr,
      title: manualTitle.trim(),
    };
    setSelectedDhikr(updated);
    setIsEditingName(false);
  };

  const handleApplyManualCount = (e: React.FormEvent) => {
    e.preventDefault();
    const newCountVal = parseInt(manualCountInput, 10);
    if (!isNaN(newCountVal) && newCountVal >= 0) {
      const diff = newCountVal - count;
      setCount(newCountVal);
      if (diff > 0) {
        onUpdateTasbeehTotal(userProfile.totalTasbeehCount + diff, selectedDhikr.title, diff);
      }
    }

    const newLifetimeVal = parseInt(manualLifetimeInput, 10);
    if (!isNaN(newLifetimeVal) && newLifetimeVal >= 0) {
      const diff = newLifetimeVal - userProfile.totalTasbeehCount;
      onUpdateTasbeehTotal(newLifetimeVal, selectedDhikr.title, diff > 0 ? diff : 0);
    }

    setShowManualCountModal(false);
    setManualCountInput('');
    setManualLifetimeInput('');
  };

  const handleTap = () => {
    setIsBeadAnimating(true);
    setTimeout(() => setIsBeadAnimating(false), 120);

    const nextCount = count + 1;
    setCount(nextCount);

    // Audio & Haptic
    if (soundEnabled) {
      playTasbeehClick((nextCount % target) * 2);
    }
    if (vibrationEnabled && 'vibrate' in navigator) {
      try {
        navigator.vibrate(nextCount === target ? [50, 50, 100] : 15);
      } catch {
        // ignore
      }
    }

    // Lifetime & Daily Tally
    onUpdateTasbeehTotal(userProfile.totalTasbeehCount + 1, selectedDhikr.title, 1);

    // Target reached
    if (nextCount === target) {
      playCompletionChime();
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#10b981', '#f59e0b', '#06b6d4'],
        });
      } catch {
        // ignore
      }
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const newDhikr: TasbeehDhikr = {
      id: 'custom-' + Date.now(),
      title: customTitle,
      arabic: customArabic || customTitle,
      transliteration: customTrans,
      translation: customTitle,
      target: parseInt(customTarget, 10) || 33,
      count: 0,
      totalSaved: 0,
    };

    onSaveCustomDhikr(newDhikr);
    setSelectedDhikr(newDhikr);
    setTarget(newDhikr.target);
    setCount(0);
    setShowAddModal(false);
    setCustomTitle('');
    setCustomArabic('');
    setCustomTrans('');
  };

  const progressPercent = Math.min(100, Math.round((count / target) * 100));

  return (
    <div className="space-y-6 pb-20 sm:pb-12 max-w-xl mx-auto px-2 sm:px-0 animate-fade-in text-center">
      {/* Top Segmented Mode Selector: Active Counter vs Daily & Weekly Stats */}
      <div className="flex items-center justify-center p-1.5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-sm max-w-sm mx-auto">
        <button
          onClick={() => setActiveViewTab('counter')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeViewTab === 'counter'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <CircleDot className="w-3.5 h-3.5" />
          <span>Active Counter</span>
        </button>
        <button
          onClick={() => setActiveViewTab('stats')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeViewTab === 'stats'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Weekly & Daily Stats</span>
        </button>
      </div>

      {activeViewTab === 'stats' ? (
        <TasbeehStats userProfile={userProfile} />
      ) : (
        <>
          {/* Header card with lifetime total */}
          <div className="bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-800">
            <div className="flex items-center justify-between gap-4">
              <div className="text-left">
                <h2 className="text-xl font-medium font-serif text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  Digital Tasbeeh & Dhikr Counter
                </h2>
                <p className="text-xs text-neutral-400">
                  Tactile bead feedback, customizable dhikrs & target milestones
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-center min-w-[120px]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                  Lifetime Total
                </span>
                <div className="text-2xl font-bold font-mono text-emerald-300">
                  {userProfile.totalTasbeehCount.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Dhikr Selector Carousel */}
            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {allDhikrs.map((d) => {
                const isSelected = selectedDhikr.id === d.id;
                return (
                  <button
                    key={d.id}
                    id={`tasbeeh-dhikr-btn-${d.id}`}
                    onClick={() => handleSelectDhikr(d)}
                    className={`px-4 py-2 rounded-2xl border text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-emerald-900/40 text-emerald-300 border-emerald-700/60 shadow-sm'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {d.title} ({d.target})
                  </button>
                );
              })}

              <button
                onClick={() => setShowAddModal(true)}
                className="px-3.5 py-2 rounded-2xl border border-dashed border-emerald-500/60 text-emerald-400 text-xs font-semibold whitespace-nowrap flex items-center gap-1 hover:bg-emerald-950/30 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Custom
              </button>
            </div>
          </div>

      {/* Main Digital Tasbeeh Machine Card */}
      <div className="bg-neutral-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-800 space-y-6">
        {/* Selected Dhikr Display with Inline Manual Name Edit */}
        <div className="space-y-1">
          <div className="font-arabic text-2xl sm:text-3xl text-emerald-400 font-bold leading-loose" dir="rtl">
            {selectedDhikr.arabic}
          </div>

          {isEditingName ? (
            <form onSubmit={handleSaveManualName} className="flex items-center justify-center gap-2 max-w-sm mx-auto">
              <input
                type="text"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                placeholder="Enter tasbeeh name manually"
                className="w-full px-3 py-1.5 rounded-xl bg-neutral-800 border border-emerald-600 text-sm text-white focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditingName(false)}
                className="px-2 py-1.5 rounded-xl bg-neutral-800 text-neutral-400 text-xs"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <h3 className="font-semibold text-white text-lg">{selectedDhikr.title}</h3>
              <button
                onClick={() => {
                  setManualTitle(selectedDhikr.title);
                  setIsEditingName(true);
                }}
                className="p-1 text-neutral-400 hover:text-emerald-400 transition-colors cursor-pointer"
                title="Edit Tasbeeh name manually"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {selectedDhikr.transliteration && (
            <p className="text-xs text-neutral-400 italic">
              {selectedDhikr.transliteration} • {selectedDhikr.translation}
            </p>
          )}
        </div>

        {/* Big Circular Counter Ring & Tap Button */}
        <div className="flex flex-col items-center justify-center relative py-2">
          {/* Target Milestone Progress Ring */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              {/* Track */}
              <circle
                cx="50%"
                cy="50%"
                r="42%"
                className="text-neutral-800 stroke-current"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Progress */}
              <circle
                cx="50%"
                cy="50%"
                r="42%"
                className="text-emerald-500 stroke-current transition-all duration-150"
                strokeWidth="12"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Tap Action Center Disk */}
            <button
              id="tasbeeh-tap-action-btn"
              onClick={handleTap}
              className={`absolute w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-2xl shadow-emerald-950/60 flex flex-col items-center justify-center transition-transform active:scale-90 cursor-pointer select-none border-4 border-neutral-800 ${
                isBeadAnimating ? 'scale-95' : 'scale-100'
              }`}
            >
              <span className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tight leading-none drop-shadow">
                {count}
              </span>
              <span className="text-xs font-semibold text-emerald-200 mt-1 uppercase tracking-wider">
                Tap / Count
              </span>
              <span className="text-[10px] opacity-80 mt-0.5">Target: {target}</span>
            </button>
          </div>
        </div>

        {/* Quick Target Selectors & Reset */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs font-semibold text-neutral-400 mr-1">Target:</span>
          {[33, 99, 100, 1000].map((t) => (
            <button
              key={t}
              onClick={() => setTarget(t)}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                target === t
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {t}
            </button>
          ))}

          {/* Manual Enter Total / Count Button */}
          <button
            onClick={() => {
              setManualCountInput(count.toString());
              setManualLifetimeInput(userProfile.totalTasbeehCount.toString());
              setShowManualCountModal(true);
            }}
            className="px-3 py-1 rounded-xl bg-neutral-800 hover:bg-emerald-950/60 hover:text-emerald-300 text-neutral-300 text-xs font-semibold border border-neutral-700 flex items-center gap-1 transition-all cursor-pointer"
            title="Enter Count or Total Manually"
          >
            <Hash className="w-3.5 h-3.5 text-emerald-400" />
            <span>Enter Manually</span>
          </button>

          {/* Reset Button */}
          <button
            id="tasbeeh-reset-btn"
            onClick={handleReset}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-rose-950/60 hover:text-rose-400 text-neutral-400 transition-colors ml-2 cursor-pointer"
            title="Reset Count to 0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Sound & Vibration Controls */}
        <div className="flex items-center justify-center gap-4 pt-2 border-t border-neutral-800 text-xs text-neutral-400">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 font-semibold'
                : 'border-neutral-700 text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            Sound {soundEnabled ? 'On' : 'Off'}
          </button>

          <button
            onClick={() => setVibrationEnabled(!vibrationEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
              vibrationEnabled
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 font-semibold'
                : 'border-neutral-700 text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Haptic {vibrationEnabled ? 'On' : 'Off'}
          </button>
        </div>
      </div>
        </>
      )}

      {/* Manual Count & Lifetime Entry Modal */}
      {showManualCountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in text-left">
          <div className="w-full max-w-md bg-neutral-900 rounded-3xl p-6 shadow-2xl border border-neutral-800 space-y-4">
            <h3 className="text-lg font-medium font-serif text-white flex items-center gap-2">
              <Hash className="w-5 h-5 text-emerald-400" />
              Enter Count / Total Manually
            </h3>
            <p className="text-xs text-neutral-400">
              Update your active counter or sync your past lifetime dhikr tallies directly.
            </p>

            <form onSubmit={handleApplyManualCount} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase mb-1">
                  Active Counter (Current Dhikr)
                </label>
                <input
                  type="number"
                  min="0"
                  max="1000000"
                  value={manualCountInput}
                  onChange={(e) => setManualCountInput(e.target.value)}
                  placeholder="e.g. 33, 100, 500"
                  className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm font-mono text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase mb-1">
                  Overall Lifetime Total
                </label>
                <input
                  type="number"
                  min="0"
                  max="100000000"
                  value={manualLifetimeInput}
                  onChange={(e) => setManualLifetimeInput(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm font-mono text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualCountModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:bg-neutral-800 text-sm font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow cursor-pointer transition-colors"
                >
                  Apply Count
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Custom Dhikr Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in text-left">
          <div className="w-full max-w-md bg-neutral-900 rounded-3xl p-6 shadow-2xl border border-neutral-800 space-y-4">
            <h3 className="text-lg font-medium font-serif text-white">Create Custom Dhikr / Wazeefa</h3>

            <form onSubmit={handleAddCustom} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase mb-1">Dhikr Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HasbunAllahu wa ni'mal wakeel"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase mb-1">Arabic Text (Optional)</label>
                <input
                  type="text"
                  placeholder="حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ"
                  value={customArabic}
                  onChange={(e) => setCustomArabic(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm font-arabic text-right text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase mb-1">Target Count</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100000"
                  value={customTarget}
                  onChange={(e) => setCustomTarget(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm font-mono text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:bg-neutral-800 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow cursor-pointer transition-colors"
                >
                  Save Dhikr
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
