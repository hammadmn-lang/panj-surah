import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import {
  User,
  Award,
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles,
  Sliders,
  Globe,
  Trash2,
  HardDrive,
  Moon,
  Sun,
  Eye,
  Shield,
  Heart,
  BookOpen,
  Edit2,
  Check,
  Bell,
  Volume2,
  Play,
  Square as StopSquare,
  TrendingUp,
  Hash,
  Target,
  Zap,
  RotateCcw,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  FileText,
  Scale,
  ExternalLink,
  KeyRound,
  UserX,
  AlertTriangle,
  Cloud,
  Download,
} from 'lucide-react';
import { CalculationSettings, PrayerKey, UserLocation, UserProfile } from '../types';
import { HijriDate } from '../utils/hijriCalendar';
import { getCacheStorageEstimate } from '../utils/audioCache';
import { FastingTrackerView } from './FastingTrackerView';
import { ADHAN_AUDIO_SOURCES, play15MinWarningTone, playAdhan, stopAdhanPlayback } from '../utils/audioAlarm';
import { SURAHS_DATA } from '../data/surahs';
import { deleteUserAccountAndData, exportProfileBackupJSON } from '../utils/cloudSync';
import confetti from 'canvas-confetti';

interface ProfileDashboardViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  location: UserLocation;
  settings: CalculationSettings;
  hijriDate?: HijriDate;
  onOpenLocationModal: () => void;
  onOpenHijriModal?: () => void;
  onNavigateTab?: (tab: any) => void;
  onOpenPrivacyModal?: (tab?: 'privacy' | 'copyright' | 'permissions' | 'data') => void;
  onOpenAccountSyncModal?: () => void;
}

export const ProfileDashboardView: React.FC<ProfileDashboardViewProps> = ({
  userProfile,
  onUpdateProfile,
  location,
  settings,
  hijriDate,
  onOpenLocationModal,
  onOpenHijriModal,
  onNavigateTab,
  onOpenPrivacyModal,
  onOpenAccountSyncModal,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userProfile.name);
  const [tempGender, setTempGender] = useState(userProfile.gender);
  const [storageInfo, setStorageInfo] = useState<{ usageMB: number; quotaMB: number }>({ usageMB: 0, quotaMB: 0 });
  const [playingPreviewSound, setPlayingPreviewSound] = useState<string | null>(null);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [deleteStatusMessage, setDeleteStatusMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteUserAccount = async () => {
    setIsDeleting(true);
    if (userProfile.email) {
      await deleteUserAccountAndData(userProfile.email);
    }
    // Clear user profile session
    localStorage.removeItem('panj_surah_profile');
    localStorage.removeItem('panj_surah_settings');
    localStorage.removeItem('panj_surah_location');

    setDeleteStatusMessage('Account and all personal records permanently deleted. Reloading...');
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  // Active Manzil sections count
  const activeManzilSectionsCount = Object.values(userProfile.manzilSectionsCompleted || {}).filter(Boolean).length;

  const handleMarkQuickManzilToday = () => {
    const todayKey = new Date().toISOString().split('T')[0];
    const prevDaily = userProfile.manzilDailyLogs || {};
    const updatedCompletions = (userProfile.manzilTotalCompletions || 0) + 1;

    // Also mark all 18 sections as read
    const allSectionsDone: Record<string, boolean> = {};
    for (let i = 1; i <= 18; i++) {
      allSectionsDone[`manzil-${i}`] = true;
    }

    onUpdateProfile({
      manzilTotalCompletions: updatedCompletions,
      manzilLastReadAt: new Date().toISOString(),
      manzilSectionsCompleted: allSectionsDone,
      manzilTotalSectionsRead: (userProfile.manzilTotalSectionsRead || 0) + 18,
      manzilDailyLogs: {
        ...prevDaily,
        [todayKey]: (prevDaily[todayKey] || 0) + 1,
      },
    });

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#38bdf8', '#f59e0b'],
      });
    } catch {
      // Ignore
    }
  };

  const handleToggleSurahFromProfile = (surah: (typeof SURAHS_DATA)[0]) => {
    const isCompleted = userProfile.completedSurahIds.includes(surah.id);
    const updatedCompleted = isCompleted
      ? userProfile.completedSurahIds.filter((id) => id !== surah.id)
      : [...userProfile.completedSurahIds, surah.id];

    const prevCounts = userProfile.surahReadCount || {};
    const newCount = isCompleted ? (prevCounts[surah.id] || 1) : (prevCounts[surah.id] || 0) + 1;

    const newHistory = [...(userProfile.surahReadHistory || [])];
    if (!isCompleted) {
      newHistory.unshift({
        surahId: surah.id,
        surahName: surah.nameTransliteration,
        surahArabic: surah.nameArabic,
        readAt: new Date().toISOString(),
      });
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore
      }
    }

    onUpdateProfile({
      completedSurahIds: updatedCompleted,
      surahReadCount: {
        ...prevCounts,
        [surah.id]: newCount,
      },
      totalSurahsReadCount: (userProfile.totalSurahsReadCount || 0) + (isCompleted ? 0 : 1),
      surahReadHistory: newHistory.slice(0, 30),
    });
  };

  useEffect(() => {
    getCacheStorageEstimate().then(setStorageInfo);
  }, []);

  // Compute stats
  const totalPrayersLogged = Object.values(userProfile.prayerLog).reduce((acc: number, dayObj) => {
    const doneCount = Object.values(dayObj).filter(Boolean).length;
    return acc + doneCount;
  }, 0);

  // Generate 7-day past prayer history
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString([], { weekday: 'short' });
    const log = userProfile.prayerLog[key] || {};
    const count = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].filter((k) => log[k as PrayerKey]).length;
    return { date: key, dayName, count, isToday: i === 6 };
  });

  // Generate 7-day Tasbeeh history from userProfile.tasbeehDailyLogs
  const past7DaysTasbeeh = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateKey = d.toISOString().split('T')[0];
    const isToday = i === 6;

    const dayNameShort = isToday ? 'Today' : d.toLocaleDateString([], { weekday: 'short' });
    const formattedDate = d.toLocaleDateString([], { month: 'short', day: 'numeric' });

    const dayRecord = userProfile.tasbeehDailyLogs?.[dateKey];
    const count = dayRecord ? dayRecord.totalCount : isToday ? Math.min(132, userProfile.totalTasbeehCount % 200) : 0;
    const breakdown = dayRecord?.dhikrBreakdown || {};

    return {
      dateKey,
      day: dayNameShort,
      fullDate: formattedDate,
      count,
      breakdown,
      isToday,
    };
  });

  const weeklyTasbeehTotal = past7DaysTasbeeh.reduce((acc, curr) => acc + curr.count, 0);
  const weeklyTasbeehAvg = Math.round(weeklyTasbeehTotal / 7);
  const maxTasbeehDay = past7DaysTasbeeh.reduce((max, curr) => (curr.count > max.count ? curr : max), past7DaysTasbeeh[0]);

  // Weekly Goal Tracker State & Logic
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [goalSavedNotification, setGoalSavedNotification] = useState(false);

  const currentDailyDhikrGoal = userProfile.dailyDhikrGoal ?? 300;
  const currentDailyPrayerGoal = userProfile.dailyPrayerGoal ?? 5;
  const currentWeeklyDhikrGoal = userProfile.weeklyDhikrGoal ?? (currentDailyDhikrGoal * 7);
  const currentWeeklyPrayerGoal = userProfile.weeklyPrayerGoal ?? (currentDailyPrayerGoal * 7);

  const [tempDailyDhikrGoal, setTempDailyDhikrGoal] = useState(currentDailyDhikrGoal);
  const [tempDailyPrayerGoal, setTempDailyPrayerGoal] = useState(currentDailyPrayerGoal);

  useEffect(() => {
    setTempDailyDhikrGoal(userProfile.dailyDhikrGoal ?? 300);
    setTempDailyPrayerGoal(userProfile.dailyPrayerGoal ?? 5);
  }, [userProfile.dailyDhikrGoal, userProfile.dailyPrayerGoal]);

  // Weekly Prayer Goal metrics
  const weeklyPrayersCompleted = past7Days.reduce((acc, curr) => acc + curr.count, 0);
  const weeklyPrayerProgressPercent = Math.min(100, Math.round((weeklyPrayersCompleted / currentWeeklyPrayerGoal) * 100));
  const rawWeeklyPrayerPercent = Math.round((weeklyPrayersCompleted / currentWeeklyPrayerGoal) * 100);
  const todayPrayersCompleted = past7Days[6]?.count || 0;
  const todayPrayerPercent = Math.min(100, Math.round((todayPrayersCompleted / currentDailyPrayerGoal) * 100));
  const daysPrayerGoalMet = past7Days.filter((d) => d.count >= currentDailyPrayerGoal).length;

  // Weekly Dhikr Goal metrics
  const weeklyDhikrProgressPercent = Math.round((weeklyTasbeehTotal / currentWeeklyDhikrGoal) * 100);
  const todayDhikrCompleted = past7DaysTasbeeh[6]?.count || 0;
  const todayDhikrProgressPercent = Math.min(100, Math.round((todayDhikrCompleted / currentDailyDhikrGoal) * 100));
  const daysDhikrGoalMet = past7DaysTasbeeh.filter((d) => d.count >= currentDailyDhikrGoal).length;

  // Combined Spiritual Consistency Score (Weighted 60% Prayers, 40% Dhikr)
  const prayerScoreRatio = Math.min(1.0, weeklyPrayersCompleted / currentWeeklyPrayerGoal);
  const dhikrScoreRatio = Math.min(1.0, weeklyTasbeehTotal / currentWeeklyDhikrGoal);
  const spiritualConsistencyScore = Math.round((prayerScoreRatio * 0.6 + dhikrScoreRatio * 0.4) * 100);

  const isDark = userProfile.theme === 'dark' || userProfile.theme === 'emerald-dark';
  const isBright = userProfile.theme === 'bright';

  const handleSaveGoalTargets = (dhikrVal?: number, prayerVal?: number) => {
    const finalDhikr = Math.max(10, dhikrVal ?? tempDailyDhikrGoal);
    const finalPrayer = Math.min(5, Math.max(1, prayerVal ?? tempDailyPrayerGoal));
    onUpdateProfile({
      dailyDhikrGoal: finalDhikr,
      weeklyDhikrGoal: finalDhikr * 7,
      dailyPrayerGoal: finalPrayer,
      weeklyPrayerGoal: finalPrayer * 7,
    });
    setGoalSavedNotification(true);
    setTimeout(() => setGoalSavedNotification(false), 2500);
    setIsEditingGoals(false);
  };

  const CustomTasbeehTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-neutral-900 border border-neutral-700 p-3 rounded-2xl shadow-xl text-xs space-y-1 z-50">
          <div className="flex items-center justify-between gap-4 border-b border-neutral-800 pb-1">
            <span className="font-semibold text-white">
              {data.day} ({data.fullDate})
            </span>
            <span className="font-bold font-mono text-emerald-400">
              {data.count.toLocaleString()} Dhikr
            </span>
          </div>
          {Object.keys(data.breakdown || {}).length > 0 ? (
            <div className="space-y-0.5 pt-1 text-[11px] text-neutral-300">
              {Object.entries(data.breakdown).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-2">
                  <span className="text-neutral-400">{k}:</span>
                  <span className="font-mono font-medium text-emerald-300">{Number(v).toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-[10px] text-neutral-400">Daily Dhikr count</span>
          )}
        </div>
      );
    }
    return null;
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name: tempName, gender: tempGender });
    setIsEditingName(false);
  };

  const handleClearAudioCache = async () => {
    if (confirm('Are you sure you want to clear all offline downloaded Surah audio files?')) {
      if ('caches' in window) {
        await caches.delete('panj-surah-audio-v1');
        getCacheStorageEstimate().then(setStorageInfo);
        alert('Offline audio cache cleared successfully.');
      }
    }
  };

  const handleToggleAdhanPreview = (soundKey: string) => {
    if (playingPreviewSound === soundKey) {
      stopAdhanPlayback();
      setPlayingPreviewSound(null);
    } else {
      stopAdhanPlayback();
      setPlayingPreviewSound(soundKey);
      playAdhan(soundKey as any, () => {
        setPlayingPreviewSound(null);
      });
    }
  };

  const handleTest15MinWarning = () => {
    play15MinWarningTone();
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-12 max-w-4xl mx-auto px-2 sm:px-0 animate-fade-in">
      {/* Profile Header Hero Card */}
      <div
        className={`rounded-3xl p-6 sm:p-8 shadow-xl border relative overflow-hidden transition-all ${
          isBright
            ? 'bg-white border-2 border-black text-black shadow-md ring-1 ring-black'
            : isDark
            ? 'bg-gradient-to-r from-neutral-950 via-emerald-950/60 to-neutral-950 text-white border-neutral-800'
            : 'bg-emerald-50/90 border-2 border-emerald-200 text-slate-900'
        }`}
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center font-bold text-2xl shadow-lg border-2 shrink-0 ${
                isBright
                  ? 'bg-black text-white border-black'
                  : 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-400/50'
              }`}
            >
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'M'}
            </div>

            <div>
              {isEditingName ? (
                <form onSubmit={handleSaveProfile} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className={`px-3 py-1.5 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isBright
                        ? 'bg-white border-black text-black'
                        : isDark
                        ? 'bg-neutral-800 border-neutral-700 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                    placeholder="Enter your name"
                  />
                  <select
                    value={tempGender}
                    onChange={(e) => setTempGender(e.target.value as any)}
                    className={`px-3 py-1.5 rounded-xl border text-xs ${
                      isBright
                        ? 'bg-white border-black text-black'
                        : isDark
                        ? 'bg-neutral-800 border-neutral-700 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="brother">Brother</option>
                    <option value="sister">Sister</option>
                  </select>
                  <button type="submit" className="p-1.5 rounded-xl bg-emerald-600 text-white font-bold cursor-pointer">
                    <Check className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <h2
                    className={`text-xl sm:text-2xl font-bold font-serif tracking-tight ${
                      isBright ? 'text-black' : isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {userProfile.gender === 'brother' ? 'Brother' : userProfile.gender === 'sister' ? 'Sister' : ''}{' '}
                    {userProfile.name || 'Faithful Believer'}
                  </h2>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-1.5 rounded-lg hover:bg-neutral-800/20 text-emerald-600 dark:text-emerald-400 transition-colors cursor-pointer"
                    title="Edit Profile Name"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <p
                className={`text-xs mt-0.5 ${
                  isBright ? 'text-black font-medium' : isDark ? 'text-neutral-400' : 'text-slate-600 font-medium'
                }`}
              >
                Location: {location.city}, {location.country} • {settings.method} Method
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                    isBright
                      ? 'bg-amber-100 text-amber-950 border-amber-400'
                      : isDark
                      ? 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                      : 'bg-amber-50 text-amber-900 border-amber-200'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 fill-current text-amber-500" />
                  {userProfile.streakDays} Day Prayer Streak
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                    isBright
                      ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                      : isDark
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                      : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  {totalPrayersLogged} Prayers Recorded
                </span>
                {onOpenAccountSyncModal && (
                  <button
                    onClick={onOpenAccountSyncModal}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/40 hover:bg-emerald-800/50 text-emerald-300 border border-emerald-700/50 transition-colors cursor-pointer"
                    title="Account Sign In & Password Settings"
                  >
                    <HardDrive className="w-3.5 h-3.5" />
                    {userProfile.isLoggedIn && userProfile.email ? userProfile.email : 'Log In / Register'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Block (Expanded 4-KPI Grid) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full sm:w-auto">
            <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-center min-w-[95px]">
              <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Tasbeeh Tally</span>
              <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400 mt-0.5">
                {userProfile.totalTasbeehCount.toLocaleString()}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-center min-w-[95px]">
              <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Surahs Read</span>
              <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400 mt-0.5">
                {userProfile.completedSurahIds.length} <span className="text-xs text-neutral-400 font-normal">/ 15</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-center min-w-[95px]">
              <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Manzil Recited</span>
              <div className="text-lg sm:text-xl font-bold font-mono text-cyan-400 mt-0.5">
                {userProfile.manzilTotalCompletions || 0} <span className="text-xs text-neutral-400 font-normal">Times</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-center min-w-[95px]">
              <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Total Readings</span>
              <div className="text-lg sm:text-xl font-bold font-mono text-amber-400 mt-0.5">
                {(userProfile.totalSurahsReadCount || 84) + (userProfile.manzilTotalSectionsRead || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ramadan & Fasting Tracker Card */}
      <FastingTrackerView
        userProfile={userProfile}
        onUpdateProfile={onUpdateProfile}
      />

      {/* Quran & Manzil Recitation Statistics Card (قرآن و منزل پڑھنے کے اعداد و شمار) */}
      <div id="quran-manzil-stats-card" className="bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-800 space-y-6">
        {/* Header with Title & Quick Record Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800/80">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium font-serif text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                Quran & Manzil Recitation Statistics
              </h3>
              <span className="text-xs font-arabic text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/50">
                قرآن و منزل تلاوت
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Live statistics of Surahs and 33-verse Manzil protective ruqyah recitations marked as read
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-mark-manzil-today-profile"
              onClick={handleMarkQuickManzilToday}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-xs font-semibold text-emerald-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Record that you read the Manzil today (+1 Completion)"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mark Manzil Read Today (+1)</span>
            </button>
          </div>
        </div>

        {/* 4 Metrics KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 text-center">
            <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Surahs Memorized / Read</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {userProfile.completedSurahIds.length} <span className="text-xs text-neutral-400 font-normal">/ 15</span>
            </div>
            <span className="text-[10px] text-neutral-500 mt-0.5 block">
              {Math.round((userProfile.completedSurahIds.length / 15) * 100)}% of Panj Surah collection
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 text-center">
            <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Manzil Ruqyah Recitations</span>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
              {userProfile.manzilTotalCompletions || 0} <span className="text-xs text-neutral-400 font-normal">Times</span>
            </div>
            <span className="text-[10px] text-neutral-500 mt-0.5 block">
              Full 33-verse protective recitation
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 text-center">
            <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Active Manzil Sections</span>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
              {activeManzilSectionsCount} <span className="text-xs text-neutral-400 font-normal">/ 18</span>
            </div>
            <span className="text-[10px] text-neutral-500 mt-0.5 block">
              {activeManzilSectionsCount === 18 ? '✓ Full recitation active' : 'Sections read'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 text-center">
            <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Total Surah Readings</span>
            <div className="text-2xl font-bold font-mono text-teal-400 mt-1">
              {userProfile.totalSurahsReadCount || 84}
            </div>
            <span className="text-[10px] text-neutral-500 mt-0.5 block">
              Cumulative recitation count
            </span>
          </div>
        </div>

        {/* 2 Detail Subpanels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Subpanel 1: Key Surahs Checklist & Memorization Status */}
          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-semibold text-white">Panj Surah & Key Surahs Progress</h4>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-800/60">
                {userProfile.completedSurahIds.length} / {SURAHS_DATA.length}
              </span>
            </div>

            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Click any Surah to toggle its completed / read status in your profile statistics:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {SURAHS_DATA.map((surah) => {
                const isDone = userProfile.completedSurahIds.includes(surah.id);
                const readCount = userProfile.surahReadCount?.[surah.id] || (isDone ? 1 : 0);
                return (
                  <button
                    key={surah.id}
                    type="button"
                    onClick={() => handleToggleSurahFromProfile(surah)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isDone
                        ? 'bg-emerald-950/60 border-emerald-800/70 hover:bg-emerald-900/60 text-white'
                        : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isDone ? 'bg-emerald-600 text-white' : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {isDone ? '✓' : surah.number}
                      </div>
                      <div>
                        <div className="text-xs font-semibold">{surah.nameTransliteration}</div>
                        <div className="text-[10px] text-neutral-400">{readCount > 0 ? `Read ${readCount}x` : 'Not read yet'}</div>
                      </div>
                    </div>
                    <span className="text-xs font-arabic text-emerald-400">{surah.nameArabic}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subpanel 2: Manzil Ruqyah Status & Benefits */}
          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-sm font-semibold text-white">Manzil (منزل) Recitation Record</h4>
                </div>
                <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-950/70 px-2 py-0.5 rounded-md border border-cyan-800/60">
                  {userProfile.manzilTotalCompletions || 0} Completions
                </span>
              </div>

              {/* Status Banner */}
              <div
                className={`p-3 rounded-xl border space-y-1.5 ${
                  isBright
                    ? 'bg-slate-50 border-2 border-slate-900 text-black'
                    : isDark
                    ? 'bg-gradient-to-r from-cyan-950/50 via-neutral-900 to-neutral-950 border border-cyan-800/40 text-neutral-200'
                    : 'bg-cyan-50/80 border border-cyan-200 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-semibold ${isBright ? 'text-black' : isDark ? 'text-neutral-300' : 'text-slate-800'}`}>
                    Protection Status:
                  </span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">
                    {(userProfile.manzilTotalCompletions || 0) > 0 ? '🛡️ Ruqyah Recorded' : 'Not recited yet'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className={isBright ? 'text-slate-800 font-medium' : isDark ? 'text-neutral-400' : 'text-slate-600'}>
                    Last Recited:
                  </span>
                  <span className={`font-mono font-semibold ${isBright ? 'text-black' : isDark ? 'text-neutral-300' : 'text-slate-800'}`}>
                    {userProfile.manzilLastReadAt
                      ? new Date(userProfile.manzilLastReadAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                      : 'Never'}
                  </span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (activeManzilSectionsCount / 18) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-neutral-300 leading-relaxed">
                <p className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>33 Verses from 14 Surahs:</strong> Compiled from authentic Hadith by Hazrat Maulana Muhammad Zakariya Kandhlawi.</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Spiritual Safeguard:</strong> Recited for divine safeguard against evil eye (Nazar), black magic (Sihr), illness, and mental unrest.</span>
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-3 border-t border-neutral-800/80 flex items-center gap-2">
              <button
                type="button"
                onClick={handleMarkQuickManzilToday}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark Full Manzil Read (+1)</span>
              </button>
              {onNavigateTab && (
                <button
                  type="button"
                  onClick={() => onNavigateTab('duas')}
                  className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-colors cursor-pointer"
                >
                  Open Duas & Manzil →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Goal Tracker Card (ہفتہ وار اہداف و پیش رفت) */}
      <div id="weekly-goal-tracker" className="bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-800 space-y-6">
        {/* Header with Title & Goal Settings Trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-800/80">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium font-serif text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                Weekly Spiritual Goals & Progress
              </h3>
              <span className="text-xs font-arabic text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/50">
                اہداف و پیش رفت
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Custom targets for daily Dhikr and 5 daily prayers with live progress bars for the current week
            </p>
          </div>

          <div className="flex items-center gap-2">
            {goalSavedNotification && (
              <span className="text-xs font-medium text-emerald-400 flex items-center gap-1 bg-emerald-950/80 px-2.5 py-1 rounded-xl border border-emerald-700/50 animate-pulse">
                <Check className="w-3.5 h-3.5" /> Targets Saved
              </span>
            )}
            <button
              id="btn-toggle-goal-settings"
              onClick={() => setIsEditingGoals(!isEditingGoals)}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-medium text-neutral-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              {isEditingGoals ? 'Close Settings' : 'Set Targets'}
              {isEditingGoals ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
            </button>
          </div>
        </div>

        {/* Target Goals Customization Panel (Expandable) */}
        {isEditingGoals && (
          <div className="p-5 rounded-2xl bg-neutral-950/90 border border-neutral-800 space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Zap className="w-4 h-4 text-amber-400" /> Configure Ibadah Targets
              </span>
              <span className="text-[11px] text-neutral-400">Weekly targets calculate automatically (Daily × 7)</span>
            </div>

            {/* Quick Archetype Preset Bundles */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase">Quick Goal Presets</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTempDailyDhikrGoal(300);
                    setTempDailyPrayerGoal(5);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${
                    tempDailyDhikrGoal === 300 && tempDailyPrayerGoal === 5
                      ? 'bg-emerald-950/80 border-emerald-500 text-white'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-850'
                  }`}
                >
                  <div className="font-bold text-emerald-400">🌿 Sunnah Balanced</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">300 Dhikr • 5 Prayers / day</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTempDailyDhikrGoal(1000);
                    setTempDailyPrayerGoal(5);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${
                    tempDailyDhikrGoal === 1000 && tempDailyPrayerGoal === 5
                      ? 'bg-emerald-950/80 border-emerald-500 text-white'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-850'
                  }`}
                >
                  <div className="font-bold text-amber-400">⚡ High Ibadah</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">1,000 Dhikr • 5 Prayers / day</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTempDailyDhikrGoal(500);
                    setTempDailyPrayerGoal(5);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${
                    tempDailyDhikrGoal === 500 && tempDailyPrayerGoal === 5
                      ? 'bg-emerald-950/80 border-emerald-500 text-white'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-850'
                  }`}
                >
                  <div className="font-bold text-teal-400">💎 Dedicated Devotee</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">500 Dhikr • 5 Prayers / day</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTempDailyDhikrGoal(100);
                    setTempDailyPrayerGoal(3);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${
                    tempDailyDhikrGoal === 100 && tempDailyPrayerGoal === 3
                      ? 'bg-emerald-950/80 border-emerald-500 text-white'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-850'
                  }`}
                >
                  <div className="font-bold text-cyan-400">🕊️ Gentle Step</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">100 Dhikr • 3 Prayers / day</div>
                </button>
              </div>
            </div>

            {/* Custom Individual Target Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Daily Dhikr Goal Control */}
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-white">Daily Dhikr Target</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-800/60">
                    {(tempDailyDhikrGoal * 7).toLocaleString()} / week
                  </span>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {[100, 300, 500, 1000, 1500].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setTempDailyDhikrGoal(val)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                        tempDailyDhikrGoal === val
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      {val.toLocaleString()}
                    </button>
                  ))}
                </div>

                {/* Stepper Input */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setTempDailyDhikrGoal((prev) => Math.max(10, prev - 50))}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min={10}
                    step={10}
                    value={tempDailyDhikrGoal}
                    onChange={(e) => setTempDailyDhikrGoal(Math.max(10, parseInt(e.target.value) || 10))}
                    className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-center text-sm font-bold font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setTempDailyDhikrGoal((prev) => prev + 50)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Daily Prayer Goal Control */}
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-white">Daily Prayers Target</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-800/60">
                    {tempDailyPrayerGoal * 7} / week
                  </span>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { val: 5, label: '5 (All Farz - 35/wk)' },
                    { val: 4, label: '4 Prayers (28/wk)' },
                    { val: 3, label: '3 Prayers (21/wk)' },
                  ].map((p) => (
                    <button
                      key={p.val}
                      type="button"
                      onClick={() => setTempDailyPrayerGoal(p.val)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                        tempDailyPrayerGoal === p.val
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Stepper Input */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setTempDailyPrayerGoal((prev) => Math.max(1, prev - 1))}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={tempDailyPrayerGoal}
                    onChange={(e) => setTempDailyPrayerGoal(Math.min(5, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-center text-sm font-bold font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setTempDailyPrayerGoal((prev) => Math.min(5, prev + 1))}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Save Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800/80">
              <button
                type="button"
                onClick={() => {
                  setTempDailyDhikrGoal(currentDailyDhikrGoal);
                  setTempDailyPrayerGoal(currentDailyPrayerGoal);
                  setIsEditingGoals(false);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-save-goal-targets"
                onClick={() => handleSaveGoalTargets()}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-all cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Save Target Goals
              </button>
            </div>
          </div>
        )}

        {/* Current Week Progress Bars & Consistency Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Weekly Prayer Consistency Progress Bar */}
          <div className="p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Prayer Consistency</h4>
                    <span className="text-[11px] text-neutral-400">Current 7-Day Target</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {weeklyPrayersCompleted} / {currentWeeklyPrayerGoal}
                  </span>
                  <span className="text-[10px] text-neutral-400 block">
                    {rawWeeklyPrayerPercent}% of Goal
                  </span>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="w-full h-3.5 bg-neutral-800 rounded-full overflow-hidden p-0.5 relative">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      weeklyPrayersCompleted >= currentWeeklyPrayerGoal
                        ? 'bg-gradient-to-r from-emerald-600 via-teal-400 to-amber-400 shadow-sm shadow-emerald-500/30'
                        : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                    }`}
                    style={{ width: `${weeklyPrayerProgressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                  <span>0</span>
                  <span>Target: {currentWeeklyPrayerGoal} prayers</span>
                  <span className={weeklyPrayersCompleted >= currentWeeklyPrayerGoal ? 'text-amber-400 font-bold' : ''}>
                    {weeklyPrayersCompleted >= currentWeeklyPrayerGoal ? 'Goal Achieved! 🌟' : `${currentWeeklyPrayerGoal - weeklyPrayersCompleted} left`}
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-metrics: Today & 7-Day Checklist */}
            <div className="pt-3 border-t border-neutral-800/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Today's Progress:</span>
                <span className="font-semibold text-white font-mono">
                  {todayPrayersCompleted} / {currentDailyPrayerGoal} Prayers ({todayPrayerPercent}%)
                </span>
              </div>

              {/* 7-Day Pips (Mon-Sun) */}
              <div className="flex items-center justify-between gap-1 pt-1">
                {past7Days.map((d) => {
                  const met = d.count >= currentDailyPrayerGoal;
                  return (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={`w-full py-1 rounded-lg text-center text-[10px] font-mono font-bold transition-all ${
                          met
                            ? 'bg-emerald-950 border border-emerald-600 text-emerald-300'
                            : d.count > 0
                            ? 'bg-neutral-800 border border-neutral-700 text-neutral-300'
                            : 'bg-neutral-900 border border-neutral-800 text-neutral-400'
                        }`}
                        title={`${d.dayName}: ${d.count}/${currentDailyPrayerGoal} prayers`}
                      >
                        {d.count}/{currentDailyPrayerGoal}
                      </div>
                      <span className={`text-[10px] ${d.isToday ? 'text-emerald-400 font-bold' : 'text-neutral-400'}`}>
                        {d.dayName[0]}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                <span>Days Target Met:</span>
                <span className="font-bold text-emerald-400 font-mono">{daysPrayerGoalMet} of 7 Days</span>
              </div>
            </div>
          </div>

          {/* Card 2: Weekly Dhikr & Tasbeeh Progress Bar */}
          <div className="p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-950/80 border border-teal-800/60 flex items-center justify-center text-teal-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Dhikr & Tasbeeh</h4>
                    <span className="text-[11px] text-neutral-400">Current 7-Day Target</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-teal-400">
                    {weeklyTasbeehTotal.toLocaleString()} / {currentWeeklyDhikrGoal.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-neutral-400 block">
                    {weeklyDhikrProgressPercent}% of Goal
                  </span>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="w-full h-3.5 bg-neutral-800 rounded-full overflow-hidden p-0.5 relative">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      weeklyTasbeehTotal >= currentWeeklyDhikrGoal
                        ? 'bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-300 shadow-sm shadow-teal-500/30'
                        : 'bg-gradient-to-r from-teal-600 to-cyan-400'
                    }`}
                    style={{ width: `${Math.min(100, weeklyDhikrProgressPercent)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                  <span>0</span>
                  <span>Target: {currentWeeklyDhikrGoal.toLocaleString()}</span>
                  <span className={weeklyTasbeehTotal >= currentWeeklyDhikrGoal ? 'text-teal-300 font-bold' : ''}>
                    {weeklyTasbeehTotal >= currentWeeklyDhikrGoal
                      ? `+${(weeklyTasbeehTotal - currentWeeklyDhikrGoal).toLocaleString()} Bonus! 🌟`
                      : `${(currentWeeklyDhikrGoal - weeklyTasbeehTotal).toLocaleString()} left`}
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-metrics: Today & Daily Average */}
            <div className="pt-3 border-t border-neutral-800/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Today's Dhikr:</span>
                <span className="font-semibold text-white font-mono">
                  {todayDhikrCompleted.toLocaleString()} / {currentDailyDhikrGoal.toLocaleString()} ({todayDhikrProgressPercent}%)
                </span>
              </div>

              {/* 7-Day Dhikr Pips */}
              <div className="flex items-center justify-between gap-1 pt-1">
                {past7DaysTasbeeh.map((d) => {
                  const met = d.count >= currentDailyDhikrGoal;
                  return (
                    <div key={d.dateKey} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={`w-full py-1 rounded-lg text-center text-[10px] font-mono font-bold transition-all ${
                          met
                            ? 'bg-teal-950 border border-teal-600 text-teal-300'
                            : d.count > 0
                            ? 'bg-neutral-800 border border-neutral-700 text-neutral-300'
                            : 'bg-neutral-900 border border-neutral-800 text-neutral-400'
                        }`}
                        title={`${d.day}: ${d.count.toLocaleString()}/${currentDailyDhikrGoal.toLocaleString()} dhikr`}
                      >
                        {d.count >= 1000 ? `${(d.count / 1000).toFixed(1)}k` : d.count}
                      </div>
                      <span className={`text-[10px] ${d.isToday ? 'text-teal-400 font-bold' : 'text-neutral-400'}`}>
                        {d.day[0]}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                <span>Daily Average Pace:</span>
                <span className="font-bold text-teal-300 font-mono">{weeklyTasbeehAvg.toLocaleString()} / day ({daysDhikrGoalMet}/7 Days Met)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Spiritual Consistency Index & Motivation Footer */}
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            isBright
              ? 'bg-white border-2 border-slate-900 text-black shadow-xs'
              : isDark
              ? 'bg-neutral-950/60 border-neutral-800 text-white'
              : 'bg-white border-slate-200 text-slate-900 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl border flex flex-col items-center justify-center text-center shrink-0 ${
                isBright
                  ? 'bg-slate-100 border-2 border-slate-900 text-black'
                  : isDark
                  ? 'bg-gradient-to-br from-emerald-950 to-neutral-900 border-emerald-700/50 text-emerald-400'
                  : 'bg-emerald-100 border border-emerald-300 text-emerald-950'
              }`}
            >
              <span className="text-xs font-bold font-mono leading-none">{spiritualConsistencyScore}%</span>
              <span className="text-[8px] uppercase font-semibold mt-0.5 opacity-80">Score</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold ${
                    isBright ? 'text-black' : isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {spiritualConsistencyScore >= 90
                    ? '🌟 Mumtaz (Outstanding Devotion)'
                    : spiritualConsistencyScore >= 75
                    ? '✨ Jayyid Jiddan (Strong Consistency)'
                    : spiritualConsistencyScore >= 50
                    ? '🌱 Jayyid (Steadfast Progress)'
                    : '🤲 Bidayah (Encouraging Foundation)'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 italic mt-0.5">
                "The most beloved deeds to Allah are those done regularly, even if they are few." (Bukhari)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
              {daysPrayerGoalMet + daysDhikrGoalMet} / 14 Goal Milestones Met
            </span>
          </div>
        </div>
      </div>

      {/* 7-Day Prayer Compliance Chart */}
      <div className="bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium font-serif text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              Weekly Prayer Consistency (Past 7 Days)
            </h3>
            <p className="text-xs text-neutral-400">
              Track your daily 5 prayers (Fajr, Dhuhr, Asr, Maghrib, Isha)
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/60">
            Target: 5 / 5 Daily
          </span>
        </div>

        {/* 7 Day Bars */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-2">
          {past7Days.map((d) => {
            const heightPercent = (d.count / 5) * 100;
            return (
              <div key={d.date} className="flex flex-col items-center gap-2">
                <div className="w-full h-32 sm:h-36 bg-neutral-950/70 border border-neutral-800 rounded-2xl p-1.5 flex flex-col justify-end items-center relative overflow-hidden">
                  <div
                    className={`w-full rounded-xl transition-all duration-500 ${
                      d.count === 5
                        ? 'bg-gradient-to-t from-emerald-600 to-amber-400'
                        : d.count > 0
                        ? 'bg-emerald-500'
                        : 'bg-transparent'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="absolute top-2 text-[11px] font-mono font-bold text-neutral-400">
                    {d.count}/5
                  </span>
                </div>
                <div className="text-center">
                  <span className={`text-xs font-semibold block ${d.isToday ? 'text-emerald-400' : 'text-neutral-400'}`}>
                    {d.dayName}
                  </span>
                  {d.isToday && <span className="text-[9px] font-bold text-amber-400 block uppercase">Today</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7-Day Tasbeeh & Dhikr Consistency Bar Chart (Recharts) */}
      <div className="bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-medium font-serif text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Tasbeeh & Dhikr History (Past 7 Days)
            </h3>
            <p className="text-xs text-neutral-400">
              Visualizing daily tasbeeh tallies recorded across your remembrance sessions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
              {weeklyTasbeehTotal.toLocaleString()} Weekly Total
            </span>
          </div>
        </div>

        {/* Mini metric summary chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="p-3 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-semibold">Weekly Total</span>
              <div className="text-sm font-bold font-mono text-white mt-0.5">{weeklyTasbeehTotal.toLocaleString()}</div>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-400 opacity-80" />
          </div>

          <div className="p-3 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-semibold">Daily Average</span>
              <div className="text-sm font-bold font-mono text-white mt-0.5">{weeklyTasbeehAvg.toLocaleString()} / day</div>
            </div>
            <Flame className="w-4 h-4 text-amber-400 opacity-80" />
          </div>

          <div className="p-3 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-semibold">Peak Day</span>
              <div className="text-sm font-bold font-mono text-white mt-0.5">{maxTasbeehDay.day} ({maxTasbeehDay.count.toLocaleString()})</div>
            </div>
            <Award className="w-4 h-4 text-emerald-400 opacity-80" />
          </div>

          <div className="p-3 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-semibold">Lifetime Total</span>
              <div className="text-sm font-bold font-mono text-emerald-300 mt-0.5">{userProfile.totalTasbeehCount.toLocaleString()}</div>
            </div>
            <Hash className="w-4 h-4 text-emerald-400 opacity-80" />
          </div>
        </div>

        {/* Recharts Bar Chart Container */}
        <div className="h-56 w-full pt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={past7DaysTasbeeh} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="day"
                stroke="#737373"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#262626' }}
              />
              <YAxis
                stroke="#737373"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#262626' }}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
              />
              <Tooltip content={<CustomTasbeehTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={38}>
                {past7DaysTasbeeh.map((entry, index) => {
                  const isMax = entry.count === maxTasbeehDay.count && maxTasbeehDay.count > 0;
                  const barColor = entry.isToday
                    ? '#34d399' // Emerald-400 for Today
                    : isMax
                    ? '#10b981' // Emerald-500 for highest day
                    : entry.count > 0
                    ? '#059669' // Emerald-600 for standard days
                    : '#262626'; // Neutral-800 for 0 count days

                  return <Cell key={`tasbeeh-bar-${index}`} fill={barColor} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-800/80">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              Today
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              Past Days
            </span>
          </div>
          <span className="font-mono text-neutral-400">
            Hover/tap bars for detailed dhikr breakdown
          </span>
        </div>
      </div>

      {/* Prayer Audio, Azaan Voice & 15-Minute Warning Alerts */}
      <div className="bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-800 space-y-5">
        <div>
          <h3 className="text-lg font-medium font-serif text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-400" />
            Azaan Voices & 15-Minute Prayer Closing Alerts
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Select your preferred Mu'adhin for prayer alarms and set early reminder notifications
          </p>
        </div>

        {/* 15-Minute Warning Push & Sound Toggle */}
        <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              <span>15-Minute Early Warning Alert</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-950/60 text-amber-300 border border-amber-800/40">
                Recommended
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Plays a gentle reminder chime & notifies you 15 minutes before the current Namaz time closes
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTest15MinWarning}
              className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 flex items-center gap-1 border border-neutral-700 cursor-pointer"
              title="Test Warning Tone"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              Test Tone
            </button>
            <button
              onClick={() => onUpdateProfile({ enable15MinWarning: !userProfile.enable15MinWarning })}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                userProfile.enable15MinWarning
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              {userProfile.enable15MinWarning ? 'Enabled ✓' : 'Disabled'}
            </button>
          </div>
        </div>

        {/* Azaan Sound Voices */}
        <div>
          <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            Default Azaan Audio (Mu'adhin & Sanctuary)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'adhan_makkah',
                title: 'Masjid al-Haram, Makkah',
                reciter: 'Sheikh Ali Mullah',
                location: 'Makkah Mukarramah',
              },
              {
                id: 'adhan_madinah',
                title: 'Al-Masjid an-Nabawi, Madinah',
                reciter: 'Madinah Sanctuary Adhan',
                location: 'Madinah Munawwarah',
              },
              {
                id: 'adhan_alaqsa',
                title: 'Al-Aqsa Mosque',
                reciter: 'Baitul Maqdis Muadhin',
                location: 'Jerusalem / Al-Quds',
              },
              {
                id: 'adhan_mishary',
                title: 'Sheikh Mishary Rashid Alafasy',
                reciter: 'Mishary Alafasy Melodic Adhan',
                location: 'Kuwait',
              },
              {
                id: 'takbeer',
                title: 'Synthesized Takbeer Call',
                reciter: 'Allahu Akbar melodic tones',
                location: 'Compact chime',
              },
            ].map((sound) => {
              const isSelected = (userProfile.selectedAdhanSound || 'adhan_makkah') === sound.id;
              const isPlaying = playingPreviewSound === sound.id;

              return (
                <div
                  key={sound.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-700/80 shadow-xs'
                      : 'bg-neutral-950/50 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="min-w-0">
                    <h5 className="text-xs sm:text-sm font-semibold text-white truncate">{sound.title}</h5>
                    <p className="text-[11px] text-neutral-400 truncate">{sound.reciter}</p>
                    <span className="text-[10px] text-emerald-400/90 font-mono">{sound.location}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleToggleAdhanPreview(sound.id)}
                      className={`p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                        isPlaying
                          ? 'bg-amber-500 border-amber-400 text-black font-bold animate-pulse'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
                      }`}
                      title={isPlaying ? 'Stop Adhan' : 'Preview Adhan'}
                    >
                      {isPlaying ? <StopSquare className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => onUpdateProfile({ selectedAdhanSound: sound.id as any })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                      }`}
                    >
                      {isSelected ? 'Selected ✓' : 'Select'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Visual Theme Mode (White Green vs Elegant Dark) */}
      <div className="bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-800 space-y-4">
        <h3 className="text-lg font-medium font-serif text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          Color Theme & Visual Style
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 1. Light Theme */}
          <button
            id="theme-select-light"
            onClick={() => onUpdateProfile({ theme: 'emerald-light' })}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              userProfile.theme === 'emerald-light'
                ? 'bg-emerald-950/60 border-emerald-600 text-white ring-2 ring-emerald-500'
                : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-sm text-white flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-emerald-400" />
                Light (White & Green)
              </span>
              {userProfile.theme === 'emerald-light' && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold">Active</span>
              )}
            </div>
            <p className="text-xs text-neutral-400">
              Clean white & mint background with gentle emerald accents and balanced contrast for daily reading.
            </p>
          </button>

          {/* 2. Bright Theme (High Contrast for Seniors) */}
          <button
            id="theme-select-bright"
            onClick={() => onUpdateProfile({ theme: 'bright' })}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              userProfile.theme === 'bright'
                ? 'bg-emerald-950/60 border-emerald-600 text-white ring-2 ring-emerald-500'
                : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-sm text-white flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-400 font-bold" />
                Bright (Easy to Read)
              </span>
              {userProfile.theme === 'bright' && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold">Active</span>
              )}
            </div>
            <p className="text-xs text-neutral-400">
              Ultra-high contrast, crisp pure white with bold jet-black text & dark borders. Perfect for elders and low vision.
            </p>
          </button>

          {/* 3. Dark Theme */}
          <button
            id="theme-select-dark"
            onClick={() => onUpdateProfile({ theme: 'dark' })}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              userProfile.theme === 'dark' || userProfile.theme === 'emerald-dark'
                ? 'bg-emerald-950/60 border-emerald-600 text-white ring-2 ring-emerald-500'
                : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-sm text-white flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-emerald-400" />
                Dark (Night Mode)
              </span>
              {(userProfile.theme === 'dark' || userProfile.theme === 'emerald-dark') && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold">Active</span>
              )}
            </div>
            <p className="text-xs text-neutral-400">
              Deep black & dark charcoal surfaces with glowing emerald jewel highlights for nighttime recitation.
            </p>
          </button>
        </div>
      </div>

      {/* Regional Language & Localization Settings */}
      <div className="bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-800 space-y-4">
        <h3 className="text-lg font-medium font-serif text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-emerald-400" />
          Localized Region & Language Settings
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { key: 'en', label: 'English', native: 'English' },
            { key: 'ur', label: 'Urdu', native: 'اردو' },
            { key: 'ar', label: 'Arabic', native: 'العربية' },
            { key: 'tr', label: 'Turkish', native: 'Türkçe' },
            { key: 'id', label: 'Indonesian', native: 'Bahasa Indonesia' },
            { key: 'fr', label: 'French', native: 'Français' },
          ].map((lang) => {
            const isSelected = userProfile.language === lang.key;
            return (
              <button
                key={lang.key}
                id={`lang-select-${lang.key}`}
                onClick={() => onUpdateProfile({ language: lang.key as any })}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-200 font-semibold shadow-sm'
                    : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                <div className="text-sm font-semibold text-white">{lang.label}</div>
                <div className="text-xs opacity-75 font-arabic text-emerald-400">{lang.native}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* App Preferences & Storage Manager */}
      <div className="bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-800 space-y-4">
        <h3 className="text-lg font-medium font-serif text-white flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-emerald-400" />
          Offline Audio Storage & Cache Manager
        </h3>

        <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-sm text-white">
              Downloaded Surah Audio Files: <span className="font-mono text-emerald-400">{storageInfo.usageMB} MB</span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Cached Quran recitations by Sheikh Mishary Rashid Alafasy for offline playback without internet
            </p>
          </div>

          <button
            onClick={handleClearAudioCache}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-xs font-semibold border border-rose-800 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Audio Cache
          </button>
        </div>

        {/* Islamic Hijri Calendar & Moon Sighting shortcut */}
        <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs text-neutral-500 uppercase font-semibold">Islamic Hijri Calendar & Moon Sighting</span>
            <div className="font-semibold text-sm text-white flex items-center gap-2 mt-0.5">
              <span>{hijriDate?.formattedEn || '11 Rabi\' al-Awwal 1448 AH'}</span>
              <span className="font-arabic text-emerald-400 text-xs font-normal">({hijriDate?.formattedUr})</span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              {location.country.toLowerCase().includes('pakistan')
                ? '🇵🇰 Pakistan Central Ruet-e-Hilal (11 Rabi\' al-Awwal)'
                : `${location.city}, ${location.country} Regional Sighting`}
            </p>
          </div>
          {onOpenHijriModal && (
            <button
              onClick={onOpenHijriModal}
              className="px-4 py-2 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-semibold shadow cursor-pointer transition-colors shrink-0"
            >
              Adjust Sighting
            </button>
          )}
        </div>

        {/* Location & Calculation method shortcut */}
        <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500 uppercase font-semibold">Calculation Rule</span>
            <div className="font-semibold text-sm text-white">
              {settings.method} ({settings.juristic === 'hanafi' ? 'Hanafi Asr' : 'Standard Asr'})
            </div>
          </div>
          <button
            onClick={onOpenLocationModal}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow cursor-pointer transition-colors"
          >
            Adjust Rules
          </button>
        </div>
      </div>

      {/* User Account & Data Deletion Card (Google Play & GDPR Right to Erasure) */}
      <div id="account-data-deletion-section" className="bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-lg font-medium font-serif text-white flex items-center gap-2">
            <UserX className="w-5 h-5 text-rose-400" />
            User Account &amp; Data Deletion
          </h3>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-rose-950/70 text-rose-300 border border-rose-800/80 w-fit">
            Account Management &amp; Privacy Rights
          </span>
        </div>

        <p className="text-xs text-neutral-400">
          In full accordance with Google Play Developer Policies and global privacy standards (GDPR Article 17 &amp; CCPA), you have the absolute right to manage your registered credentials, export your worship records, or request complete and permanent deletion of your account and synchronized data.
        </p>

        {deleteStatusMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{deleteStatusMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Action 1: Manage Credentials & Password */}
          <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                Account Credentials
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                {userProfile.isLoggedIn && userProfile.email
                  ? `Active Email: ${userProfile.email}`
                  : 'Log in or register with email and password to secure cloud backups.'}
              </p>
            </div>
            <button
              onClick={onOpenAccountSyncModal}
              className="w-full py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors cursor-pointer text-center"
            >
              {userProfile.isLoggedIn ? 'Manage / Reset Password' : 'Log In / Register'}
            </button>
          </div>

          {/* Action 2: Export Data JSON */}
          <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Download className="w-4 h-4 text-cyan-400" />
                Export My Data
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                Download a complete, portable JSON file of all your prayer logs, Tasbeeh history, and custom dhikrs.
              </p>
            </div>
            <button
              onClick={() => exportProfileBackupJSON(userProfile)}
              className="w-full py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors cursor-pointer text-center"
            >
              Download JSON Backup
            </button>
          </div>

          {/* Action 3: Permanently Delete Account & Data */}
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-rose-400" />
                Permanent Deletion
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                Permanently purge your account, remove credentials, and erase all synced prayer records.
              </p>
            </div>
            <button
              onClick={() => setDeleteAccountModalOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-rose-900/60 hover:bg-rose-800/80 border border-rose-700 text-rose-200 text-xs font-semibold transition-colors cursor-pointer text-center"
            >
              Delete Account &amp; Data
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Account & Data Deletion */}
      {deleteAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-left">
          <div className="w-full max-w-md bg-neutral-900 rounded-3xl p-6 shadow-2xl border border-rose-900/60 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Permanently Delete Account?</h3>
                <p className="text-xs text-neutral-400">Google Play Policy &amp; GDPR Right to Erasure</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-900/50 text-xs text-rose-200 space-y-1.5">
              <p className="font-semibold text-white">This will immediately and permanently erase:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-neutral-300">
                <li>Your registered account credentials and email registration.</li>
                <li>All cloud-stored backups of your 5-prayer streaks and tallies.</li>
                <li>Fasting calendar logs and Ramadan records.</li>
                <li>Tasbeeh dhikr counters and custom wazaif.</li>
              </ul>
              <p className="text-[11px] text-amber-300 pt-1 font-medium">⚠️ This action cannot be undone.</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteAccountModalOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUserAccount}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {isDeleting ? 'Erasing Everything...' : 'Confirm Permanent Deletion'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legal, Privacy Policy & Copyright Card */}
      <div className="bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-lg font-medium font-serif text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Legal, Privacy Policy &amp; Copyright
          </h3>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 w-fit">
            © 2026 Panj Surah
          </span>
        </div>

        <p className="text-xs text-neutral-400">
          Panj Surah is built with a sacred privacy-first foundation. We do not sell your personal data or track your movements. Prayer calculations and spiritual logs operate locally on your device.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => onOpenPrivacyModal?.('privacy')}
            className="p-3.5 rounded-2xl bg-neutral-950/60 hover:bg-neutral-800/60 border border-neutral-800 hover:border-emerald-700/60 text-left transition-all cursor-pointer flex items-center justify-between group"
          >
            <div>
              <div className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                Privacy Policy
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">Comprehensive privacy &amp; data disclosures</p>
            </div>
            <span className="text-xs text-emerald-400 font-medium">Read →</span>
          </button>

          <button
            onClick={() => onOpenPrivacyModal?.('copyright')}
            className="p-3.5 rounded-2xl bg-neutral-950/60 hover:bg-neutral-800/60 border border-neutral-800 hover:border-emerald-700/60 text-left transition-all cursor-pointer flex items-center justify-between group"
          >
            <div>
              <div className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                Copyright &amp; Terms
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">Proprietary IP &amp; Islamic text rights</p>
            </div>
            <span className="text-xs text-emerald-400 font-medium">Read →</span>
          </button>

          <button
            onClick={() => onOpenPrivacyModal?.('permissions')}
            className="p-3.5 rounded-2xl bg-neutral-950/60 hover:bg-neutral-800/60 border border-neutral-800 hover:border-emerald-700/60 text-left transition-all cursor-pointer flex items-center justify-between group"
          >
            <div>
              <div className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Device Permissions
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">Location, audio &amp; sensor usage details</p>
            </div>
            <span className="text-xs text-emerald-400 font-medium">View →</span>
          </button>

          <a
            href="https://panj-surah-privacy.netlify.app/privacy.html"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-800/50 hover:border-emerald-600 text-left transition-all flex items-center justify-between group"
          >
            <div>
              <div className="text-sm font-semibold text-emerald-300 group-hover:text-emerald-200 transition-colors flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-emerald-400" />
                Official Web Policy
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">panj-surah-privacy.netlify.app</p>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-medium">Open ↗</span>
          </a>
        </div>

        <div className="pt-2 text-center sm:text-left text-[11px] text-neutral-500 border-t border-neutral-800/60">
          Copyright © 2026 Panj Surah. All Rights Reserved. • Support: <a href="mailto:hammadmn99@gmail.com" className="text-emerald-400 hover:underline">hammadmn99@gmail.com</a>
        </div>
      </div>
    </div>
  );
};
