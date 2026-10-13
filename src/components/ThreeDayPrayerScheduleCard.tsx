import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Wifi,
  WifiOff,
  ChevronRight,
  HardDrive,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { CachedPrayerDay, OfflinePrayerSyncStatus, ThreeDayPrayerCache, UserLocation } from '../types';

interface ThreeDayPrayerScheduleCardProps {
  schedule?: ThreeDayPrayerCache;
  days?: CachedPrayerDay[];
  syncStatus: OfflinePrayerSyncStatus;
  location: UserLocation;
  deviceTimeZone?: string;
  onOpenUpdateModal: () => void;
  onRefreshOnline?: () => void;
  onRefreshNow?: () => void;
  onSimulateExpired?: () => void;
}

export const ThreeDayPrayerScheduleCard: React.FC<ThreeDayPrayerScheduleCardProps> = ({
  schedule,
  days: propDays,
  syncStatus,
  location,
  deviceTimeZone,
  onOpenUpdateModal,
  onRefreshOnline,
  onRefreshNow,
  onSimulateExpired,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const days = propDays || schedule?.days || [];
  const activeDay = (days.length > 0 && days[selectedDayIndex]) ? days[selectedDayIndex] : (days.length > 0 ? days[0] : null);
  const activeTimeZone =
    deviceTimeZone ||
    location.timezone ||
    (typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Local') ||
    'Local';

  const handleRefresh = onRefreshOnline || onRefreshNow || (() => {});

  const prayerIcons: Record<string, React.ReactNode> = {
    fajr: <Sunrise className="w-4 h-4 text-cyan-400" />,
    sunrise: <Sun className="w-4 h-4 text-amber-400" />,
    dhuhr: <Sun className="w-4 h-4 text-yellow-400" />,
    asr: <Sun className="w-4 h-4 text-orange-400" />,
    maghrib: <Sunset className="w-4 h-4 text-rose-400" />,
    isha: <Moon className="w-4 h-4 text-indigo-400" />,
    qiyam: <Sparkles className="w-4 h-4 text-emerald-400" />,
  };

  const prayerNames: Record<string, { en: string; ar: string }> = {
    fajr: { en: 'Fajr', ar: 'الفَجْر' },
    sunrise: { en: 'Sunrise', ar: 'الشُّرُوق' },
    dhuhr: { en: 'Dhuhr', ar: 'الظُّهْر' },
    asr: { en: 'Asr', ar: 'العَصْر' },
    maghrib: { en: 'Maghrib', ar: 'المَغْرِب' },
    isha: { en: 'Isha', ar: 'العِشَاء' },
    qiyam: { en: 'Qiyam', ar: 'قِيَام اللَّيْل' },
  };

  return (
    <div
      id="three-day-prayer-cache-card"
      className="bg-neutral-900 rounded-3xl p-5 sm:p-6 shadow-sm border border-neutral-800 space-y-5"
    >
      {/* Header section with offline badge and sync status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-medium font-serif text-white flex items-center gap-2">
                3-Day Saved Prayer Schedule
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-300">
                  Offline Saved
                </span>
              </h3>
            </div>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Precomputed from device clock & location setting • Fully available without internet for 3 days
          </p>
        </div>

        {/* Sync Status Button & Expiration Alert */}
        <div className="flex items-center gap-2">
          {syncStatus.isExpired ? (
            <button
              onClick={onOpenUpdateModal}
              id="btn-expired-update-alert"
              className="px-3.5 py-1.5 rounded-xl bg-amber-950/80 border border-amber-600/80 text-amber-300 text-xs font-semibold hover:bg-amber-900 transition-all flex items-center gap-1.5 cursor-pointer animate-pulse shadow-sm"
              title="3 days passed since last online update. Click to connect and refresh."
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Update Required (3d)</span>
            </button>
          ) : (
            <button
              onClick={onOpenUpdateModal}
              className="px-3 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified ({syncStatus.hoursRemaining}h left)</span>
            </button>
          )}

          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 cursor-pointer"
            title="Refresh Schedule Cache Now"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3-Day Expiration Banner (if expired) */}
      {syncStatus.isExpired && (
        <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200 animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">
                3 Days Elapsed Since Last Online Sync ({syncStatus.daysElapsed} days ago)
              </span>
              <span className="text-[11px] text-neutral-300">
                Please connect to the internet to verify astronomical coordinates and renew the 3-day prayer cache.
              </span>
            </div>
          </div>
          <button
            onClick={onOpenUpdateModal}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shrink-0 cursor-pointer shadow-sm transition-all"
          >
            Connect & Update Now
          </button>
        </div>
      )}

      {/* Day Selector Tabs (Today, Tomorrow, Day +2, Day +3) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {days.map((day, idx) => {
          const isSelected = selectedDayIndex === idx;
          const labelTitle =
            idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : `+${idx} Days`;

          return (
            <button
              key={day.dateKey}
              id={`tab-day-schedule-${idx}`}
              onClick={() => setSelectedDayIndex(idx)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md'
                  : 'bg-neutral-950 border-neutral-800/90 text-neutral-300 hover:bg-neutral-850 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isSelected ? 'text-emerald-300' : 'text-neutral-200'}`}>
                  {labelTitle}
                </span>
                {day.isToday && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Active
                  </span>
                )}
              </div>
              <div className="text-[11px] text-neutral-400 font-medium mt-0.5 truncate">
                {day.dayName}, {day.formattedDate.split(', ')[1]}
              </div>
              <div className="text-[10px] text-neutral-500 font-arabic truncate mt-0.5">
                {day.hijriDate.day} {day.hijriDate.monthNameEn} {day.hijriDate.year}H
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Selected Day Prayer Times Table */}
      {activeDay && (
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-800/80">
            <div>
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                <span>{activeDay.dayName}, {activeDay.formattedDate}</span>
                <span className="text-xs text-emerald-400 font-arabic">
                  ({activeDay.hijriDate.formattedEn})
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Saved for {location.city}, {location.country} • Timezone: {activeTimeZone}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-lg border border-neutral-800">
                {activeDay.isToday ? 'Current Day Schedule' : `Day +${activeDay.dayOffset} Ahead`}
              </span>
            </div>
          </div>

          {/* Times Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {(['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha', 'qiyam'] as const).map((key) => {
              const info = prayerNames[key];
              const time = activeDay.times[key];
              const icon = prayerIcons[key];

              return (
                <div
                  key={key}
                  className="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80 flex flex-col justify-between space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">{icon}</span>
                    <span className="text-[10px] font-arabic text-neutral-400 font-medium">
                      {info.ar}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-neutral-300 block">
                      {info.en}
                    </span>
                    <span className="text-sm font-bold font-mono text-white block mt-0.5">
                      {time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Offline Reliability & Synchronization Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-neutral-400 pt-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>
            <strong>Local Time Synchronization:</strong> Operates directly on your device clock. No internet needed
            for countdowns or alarms.
          </span>
        </div>

        <button
          onClick={onOpenUpdateModal}
          className="text-emerald-400 hover:text-emerald-300 font-medium underline-offset-2 hover:underline cursor-pointer text-right shrink-0"
        >
          Manage 3-Day Sync Settings →
        </button>
      </div>
    </div>
  );
};
