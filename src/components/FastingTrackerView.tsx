import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  Sparkles,
  Moon,
  Sun,
  Award,
  ListTodo,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  Info,
  Clock,
} from 'lucide-react';
import { FastingRecord, FastingType, UserProfile } from '../types';
import { playCompletionChime } from '../utils/audioAlarm';
import confetti from 'canvas-confetti';

interface FastingTrackerViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  hijriYear?: number;
}

const FASTING_TYPE_LABELS: Record<FastingType, { label: string; color: string }> = {
  ramadan: { label: 'Ramadan Obligatory', color: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60' },
  sunnah_monday_thursday: { label: 'Sunnah (Mon/Thu)', color: 'bg-teal-950/60 text-teal-300 border-teal-800/60' },
  ayyam_beed: { label: 'White Days (13,14,15)', color: 'bg-amber-950/60 text-amber-300 border-amber-800/60' },
  shawwal: { label: '6 Days of Shawwal', color: 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60' },
  qadha: { label: 'Qadha (Make-up)', color: 'bg-rose-950/60 text-rose-300 border-rose-800/60' },
  ashura: { label: 'Ashura (Muharram)', color: 'bg-purple-950/60 text-purple-300 border-purple-800/60' },
  arafah: { label: 'Day of Arafah', color: 'bg-amber-900/60 text-amber-200 border-amber-700/60' },
  voluntary: { label: 'Voluntary (Nafl)', color: 'bg-neutral-800 text-neutral-300 border-neutral-700' },
};

const FASTING_CHECKLIST_ITEMS = [
  { key: 'intention', label: 'Made Niyyah / Intention before Fajr', desc: 'نَوَيْتُ أَنْ أَصُومَ صَوْمَ شَهْرِ رَمَضَانَ' },
  { key: 'suhoor', label: 'Ate Suhoor (Pre-dawn meal)', desc: 'Sunnah barakah meal before Fajr enters' },
  { key: 'fajrOnTime', label: 'Fajr Salah performed with congregation/on-time', desc: 'Preserved obligatory prayer with devotion' },
  { key: 'dhikrQuran', label: 'Read Quran portion & Morning Azkar', desc: 'Spiritual nourishment during the fasting day' },
  { key: 'avoidSins', label: 'Guarded tongue from anger & backbiting', desc: 'Preserving the reward of the fast' },
  { key: 'iftarDua', label: 'Broke fast on time with Sunnah Iftar Dua', desc: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ' },
];

export const FastingTrackerView: React.FC<FastingTrackerViewProps> = ({
  userProfile,
  onUpdateProfile,
  hijriYear = 1447,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedTypeForLog, setSelectedTypeForLog] = useState<FastingType>('ramadan');
  const [logNotes, setLogNotes] = useState<string>('');
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [targetLogDate, setTargetLogDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const todayKey = new Date().toISOString().split('T')[0];
  const fastingLogs = userProfile.fastingLogs || {};
  const checklist = userProfile.fastingChecklistToday || {
    intention: false,
    suhoor: false,
    fajrOnTime: false,
    dhikrQuran: false,
    avoidSins: false,
    iftarDua: false,
  };

  // Yearly Fast Totals Calculations
  const allFastKeys = Object.keys(fastingLogs).filter((k) => fastingLogs[k]?.completed);
  const totalFastsYear = allFastKeys.length;
  const ramadanFasts = allFastKeys.filter((k) => fastingLogs[k]?.type === 'ramadan').length;
  const sunnahFasts = allFastKeys.filter(
    (k) => fastingLogs[k]?.type === 'sunnah_monday_thursday' || fastingLogs[k]?.type === 'ayyam_beed'
  ).length;
  const qadhaFasts = allFastKeys.filter((k) => fastingLogs[k]?.type === 'qadha').length;
  const otherFasts = totalFastsYear - ramadanFasts - sunnahFasts - qadhaFasts;

  // Toggle Fast on specific date
  const handleToggleFastDate = (dateKey: string, type: FastingType = 'ramadan') => {
    const existing = fastingLogs[dateKey];
    const isCompleted = !existing?.completed;

    const updatedLogs: Record<string, FastingRecord> = {
      ...fastingLogs,
      [dateKey]: {
        date: dateKey,
        type: existing?.type || type,
        completed: isCompleted,
        notes: existing?.notes || '',
      },
    };

    onUpdateProfile({
      fastingLogs: updatedLogs,
      isFastingToday: dateKey === todayKey ? isCompleted : userProfile.isFastingToday,
    });

    if (isCompleted) {
      playCompletionChime();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#14b8a6', '#f59e0b'],
        });
      } catch {
        // ignore
      }
    }
  };

  // Toggle checklist item for today
  const handleToggleChecklist = (key: keyof typeof checklist) => {
    const updated = { ...checklist, [key]: !checklist[key] };
    onUpdateProfile({ fastingChecklistToday: updated });
    playCompletionChime();
  };

  const handleSaveCustomLog = (e: React.FormEvent) => {
    e.preventDefault();
    handleToggleFastDate(targetLogDate, selectedTypeForLog);
    if (logNotes.trim() && fastingLogs[targetLogDate]) {
      const updatedLogs = {
        ...fastingLogs,
        [targetLogDate]: {
          ...fastingLogs[targetLogDate],
          notes: logNotes.trim(),
        },
      };
      onUpdateProfile({ fastingLogs: updatedLogs });
    }
    setShowLogModal(false);
    setLogNotes('');
  };

  // Fasting days checklist completion percentage
  const completedChecksCount = Object.values(checklist).filter(Boolean).length;
  const checklistPercent = Math.round((completedChecksCount / FASTING_CHECKLIST_ITEMS.length) * 100);

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Fasting Hero Summary Card with Yearly Calculator */}
      <div className="bg-neutral-900 rounded-3xl p-6 sm:p-7 border border-neutral-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                <Moon className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-xl font-serif font-medium text-white">
                  Ramadan & Fasting Tracker ({hijriYear} AH / {selectedYear})
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Record your completed fasts, calculate yearly totals & track Sunnah fasts
                </p>
              </div>
            </div>

            {/* Quick Status / I Am Fasting Toggle */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                id="toggle-fasting-today-btn"
                onClick={() => handleToggleFastDate(todayKey, 'ramadan')}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
                  fastingLogs[todayKey]?.completed
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                    : 'bg-neutral-950/80 border-neutral-700 text-neutral-300 hover:border-emerald-600 hover:text-white'
                }`}
              >
                {fastingLogs[todayKey]?.completed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Fasting Today: Completed ✓</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4 text-emerald-400" />
                    <span>I am Fasting Today (Tap to Mark)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setTargetLogDate(todayKey);
                  setShowLogModal(true);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium border border-neutral-700 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                Log Specific Date / Qadha
              </button>
            </div>
          </div>

          {/* Yearly Totals Scoreboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 min-w-[280px]">
            <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-center">
              <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block">
                Total Fasted
              </span>
              <span className="text-2xl font-bold font-mono text-emerald-400">{totalFastsYear}</span>
              <span className="text-[10px] text-neutral-500 block">This Year</span>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-center">
              <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block">
                Ramadan
              </span>
              <span className="text-2xl font-bold font-mono text-emerald-300">{ramadanFasts} / 30</span>
              <span className="text-[10px] text-neutral-500 block">Days</span>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-center">
              <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block">
                Sunnah / Nafl
              </span>
              <span className="text-2xl font-bold font-mono text-teal-400">{sunnahFasts}</span>
              <span className="text-[10px] text-neutral-500 block">Mon/Thu/13-15</span>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-center">
              <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block">
                Qadha Made Up
              </span>
              <span className="text-2xl font-bold font-mono text-amber-400">{qadhaFasts}</span>
              <span className="text-[10px] text-neutral-500 block">Compensated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Fasting Checklist (Ensuring nothing is missing during fast) */}
      <div className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-semibold text-white flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-emerald-400" />
              Daily Fasting Checklist & Sunnah Habits
            </h4>
            <p className="text-xs text-neutral-400 mt-0.5">
              Ensure you don't miss essential Sunnahs, Niyyah, or Iftar Duas while fasting today
            </p>
          </div>

          <div className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-xs font-semibold text-emerald-300">
            {completedChecksCount} / {FASTING_CHECKLIST_ITEMS.length} Completed ({checklistPercent}%)
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
            style={{ width: `${checklistPercent}%` }}
          />
        </div>

        {/* Checklist items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {FASTING_CHECKLIST_ITEMS.map((item) => {
            const isChecked = !!checklist[item.key as keyof typeof checklist];
            return (
              <button
                key={item.key}
                id={`fasting-check-${item.key}`}
                onClick={() => handleToggleChecklist(item.key as keyof typeof checklist)}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-emerald-950/30 border-emerald-700/60 shadow-xs'
                    : 'bg-neutral-950/50 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5 text-neutral-500" />
                  )}
                </div>
                <div>
                  <span className={`text-xs sm:text-sm font-semibold block ${isChecked ? 'text-white' : 'text-neutral-300'}`}>
                    {item.label}
                  </span>
                  <span className="text-[11px] text-neutral-400 block mt-0.5 font-arabic">
                    {item.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 30-Day Ramadan Fast Grid & Calendar Tracker */}
      <div className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              30 Days of Ramadan Quick Matrix
            </h4>
            <p className="text-xs text-neutral-400">
              Tap any day number (1 to 30) to mark or toggle your Ramadan fast
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/40">
            {ramadanFasts} / 30 Fasts
          </span>
        </div>

        {/* 30 Day Grid */}
        <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 pt-2">
          {Array.from({ length: 30 }, (_, i) => {
            const dayNum = i + 1;
            // Map to simulated ramadan date keys or sequential slots
            const simulatedKey = `ramadan-day-${dayNum}`;
            const isFasted = !!fastingLogs[simulatedKey]?.completed;

            return (
              <button
                key={dayNum}
                id={`ramadan-grid-day-${dayNum}`}
                onClick={() => handleToggleFastDate(simulatedKey, 'ramadan')}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-1 border transition-all cursor-pointer ${
                  isFasted
                    ? 'bg-emerald-600 border-emerald-500 text-white font-bold shadow-md shadow-emerald-950/50 scale-100'
                    : 'bg-neutral-950/70 border-neutral-800 text-neutral-400 hover:border-emerald-600/60 hover:text-white'
                }`}
              >
                <span className="text-xs sm:text-sm font-mono font-bold">{dayNum}</span>
                <span className="text-[9px] uppercase tracking-tighter opacity-80">
                  {isFasted ? '✓' : 'Day'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Fast Log / Qadha Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in text-left">
          <div className="w-full max-w-md bg-neutral-900 rounded-3xl p-6 shadow-2xl border border-neutral-800 space-y-4">
            <h3 className="text-lg font-medium font-serif text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              Log Fast / Qadha Entry
            </h3>

            <form onSubmit={handleSaveCustomLog} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase mb-1">Date</label>
                <input
                  type="date"
                  value={targetLogDate}
                  onChange={(e) => setTargetLogDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase mb-1">Fasting Type</label>
                <select
                  value={selectedTypeForLog}
                  onChange={(e) => setSelectedTypeForLog(e.target.value as FastingType)}
                  className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ramadan">Ramadan (Obligatory)</option>
                  <option value="sunnah_monday_thursday">Sunnah (Monday / Thursday)</option>
                  <option value="ayyam_beed">White Days (13th, 14th, 15th)</option>
                  <option value="shawwal">6 Days of Shawwal</option>
                  <option value="qadha">Qadha (Make-up for missed fast)</option>
                  <option value="ashura">Ashura (10th Muharram)</option>
                  <option value="arafah">Day of Arafah (9th Dhul Hijjah)</option>
                  <option value="voluntary">Voluntary (Nafl)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Compensating for missed travel fast in Ramadan"
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:bg-neutral-800 text-sm font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow cursor-pointer transition-colors"
                >
                  Save Fast Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
