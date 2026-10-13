import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  Circle,
  Bell,
  BellOff,
  Volume2,
  Calendar,
  Sparkles,
  Compass,
  ArrowRight,
  Sun,
  Sunset,
  Sunrise,
  Moon,
  Star,
  Award,
  ChevronRight,
  MapPin,
  Wifi,
  WifiOff,
  AlertTriangle,
  HardDrive,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { HijriDate } from '../utils/hijriCalendar';
import { CalculationSettings, IslamicEvent, OfflinePrayerSyncStatus, PrayerItem, PrayerKey, ThreeDayPrayerCache, UserLocation, UserProfile } from '../types';
import { computePrayerTimes, formatPrayerTime, formatRemainingTime, calculateQibla } from '../utils/prayerCalculator';
import { playCompletionChime, playPrayerAlarmTone } from '../utils/audioAlarm';
import {
  loadThreeDayPrayerSchedule,
  refreshThreeDayOnlineSync,
  checkThreeDaySyncStatus,
  simulateThreeDaysExpired,
  getLocalDeviceClockInfo,
} from '../utils/offlinePrayerCache';
import { ThreeDayPrayerScheduleCard } from './ThreeDayPrayerScheduleCard';
import { InternetUpdateModal } from './InternetUpdateModal';
import confetti from 'canvas-confetti';
import { WeeklyPrayerChart } from './WeeklyPrayerChart';

interface PrayerTimesViewProps {
  location: UserLocation;
  settings: CalculationSettings;
  hijriDate: HijriDate;
  todayEvents: IslamicEvent[];
  userProfile: UserProfile;
  onUpdatePrayerLog: (dateKey: string, prayerKey: PrayerKey, isDone: boolean) => void;
  onNavigateTab: (tab: any) => void;
  onOpenLocationModal: () => void;
  onOpenHijriModal?: () => void;
  onOpenMeetingModeModal?: () => void;
  onOpenAccountSyncModal?: () => void;
  onOpenInternetUpdateModal?: () => void;
  isInternetUpdateModalOpen?: boolean;
  onCloseInternetUpdateModal?: () => void;
  syncStatus?: OfflinePrayerSyncStatus;
  onRefreshOnlineSync?: () => void;
  onQuickSelectLocation?: (newLoc: UserLocation) => void;
}

export const PrayerTimesView: React.FC<PrayerTimesViewProps> = ({
  location,
  settings,
  hijriDate,
  todayEvents,
  userProfile,
  onUpdatePrayerLog,
  onNavigateTab,
  onOpenLocationModal,
  onOpenHijriModal,
  onOpenInternetUpdateModal,
  isInternetUpdateModalOpen,
  onCloseInternetUpdateModal,
  syncStatus: propSyncStatus,
  onRefreshOnlineSync,
  onQuickSelectLocation,
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [alarmSettings, setAlarmSettings] = useState<Record<PrayerKey, boolean>>({
    fajr: true,
    sunrise: false,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
    qiyam: false,
  });

  // 3-Day Ahead Offline Prayer Cache & Sync Status
  const [threeDayCache, setThreeDayCache] = useState<ThreeDayPrayerCache>(() =>
    loadThreeDayPrayerSchedule(new Date(), location, settings, userProfile.hijriDayAdjustment)
  );

  const [localSyncStatus, setLocalSyncStatus] = useState<OfflinePrayerSyncStatus>(() =>
    propSyncStatus || checkThreeDaySyncStatus(userProfile.prayerTimesLastOnlineSync)
  );

  const [internalUpdateModalOpen, setInternalUpdateModalOpen] = useState(false);
  const [deviceClockInfo, setDeviceClockInfo] = useState(getLocalDeviceClockInfo());
  const [hasPromptedExpiredOnce, setHasPromptedExpiredOnce] = useState(false);

  const activeSyncStatus = propSyncStatus || localSyncStatus;
  const isModalOpen = isInternetUpdateModalOpen !== undefined ? isInternetUpdateModalOpen : internalUpdateModalOpen;

  const handleOpenModal = () => {
    if (onOpenInternetUpdateModal) {
      onOpenInternetUpdateModal();
    } else {
      setInternalUpdateModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    if (onCloseInternetUpdateModal) {
      onCloseInternetUpdateModal();
    } else {
      setInternalUpdateModalOpen(false);
    }
  };

  // Re-check and load 3-day schedule whenever location, settings or date changes
  useEffect(() => {
    const updatedCache = loadThreeDayPrayerSchedule(currentTime, location, settings, userProfile.hijriDayAdjustment);
    setThreeDayCache(updatedCache);
    const status = checkThreeDaySyncStatus(userProfile.prayerTimesLastOnlineSync);
    setLocalSyncStatus(status);
    setDeviceClockInfo(getLocalDeviceClockInfo());

    // Prompt user for internet connection if 3 days have expired
    if (status.isExpired && !hasPromptedExpiredOnce) {
      handleOpenModal();
      setHasPromptedExpiredOnce(true);
    }
  }, [location, settings, userProfile.hijriDayAdjustment, userProfile.prayerTimesLastOnlineSync]);

  // Online / Offline Connectivity Listener
  useEffect(() => {
    const handleConnectivity = () => {
      const status = checkThreeDaySyncStatus(userProfile.prayerTimesLastOnlineSync);
      setLocalSyncStatus(status);
      setDeviceClockInfo(getLocalDeviceClockInfo());
    };

    window.addEventListener('online', handleConnectivity);
    window.addEventListener('offline', handleConnectivity);
    return () => {
      window.removeEventListener('online', handleConnectivity);
      window.removeEventListener('offline', handleConnectivity);
    };
  }, [userProfile.prayerTimesLastOnlineSync]);

  const handleRefreshOnline = () => {
    if (onRefreshOnlineSync) {
      onRefreshOnlineSync();
    }
    const freshCache = refreshThreeDayOnlineSync(new Date(), location, settings, userProfile.hijriDayAdjustment);
    setThreeDayCache(freshCache);
    const updatedStatus = checkThreeDaySyncStatus();
    setLocalSyncStatus(updatedStatus);
  };

  const handleSimulateExpired = () => {
    const expiredCache = simulateThreeDaysExpired(new Date(), location, settings, userProfile.hijriDayAdjustment);
    setThreeDayCache(expiredCache);
    const expiredStatus = checkThreeDaySyncStatus();
    setLocalSyncStatus(expiredStatus);
    handleOpenModal();
  };

  const handleResetFresh = () => {
    handleRefreshOnline();
  };

  // Ticking timer for local device time (runs second by second from hardware RTC)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const todayKey = currentTime.toISOString().split('T')[0];
  const todayLog = userProfile.prayerLog[todayKey] || {};

  // Compute calculated times
  const rawTimes = computePrayerTimes(currentTime, location, settings);
  const nowMs = currentTime.getTime();

  // Determine single active current prayer window & next upcoming prayer
  // Cycle:
  // Before Fajr: current = Isha, next = Fajr (today)
  // Fajr - Sunrise: current = Fajr, next = Dhuhr (or Sunrise)
  // Sunrise - Dhuhr: current = Sunrise, next = Dhuhr
  // Dhuhr - Asr: current = Dhuhr, next = Asr
  // Asr - Maghrib: current = Asr, next = Maghrib
  // Maghrib - Isha: current = Maghrib, next = Isha
  // After Isha: current = Isha, next = Fajr (tomorrow morning)
  let currentKey: PrayerKey = 'isha';
  let nextKey: PrayerKey = 'fajr';
  let nextPrayerDate: Date = rawTimes.fajr;

  if (nowMs < rawTimes.fajr.getTime()) {
    currentKey = 'isha';
    nextKey = 'fajr';
    nextPrayerDate = rawTimes.fajr;
  } else if (nowMs < rawTimes.sunrise.getTime()) {
    currentKey = 'fajr';
    nextKey = 'dhuhr';
    nextPrayerDate = rawTimes.dhuhr;
  } else if (nowMs < rawTimes.dhuhr.getTime()) {
    currentKey = 'sunrise';
    nextKey = 'dhuhr';
    nextPrayerDate = rawTimes.dhuhr;
  } else if (nowMs < rawTimes.asr.getTime()) {
    currentKey = 'dhuhr';
    nextKey = 'asr';
    nextPrayerDate = rawTimes.asr;
  } else if (nowMs < rawTimes.maghrib.getTime()) {
    currentKey = 'asr';
    nextKey = 'maghrib';
    nextPrayerDate = rawTimes.maghrib;
  } else if (nowMs < rawTimes.isha.getTime()) {
    currentKey = 'maghrib';
    nextKey = 'isha';
    nextPrayerDate = rawTimes.isha;
  } else {
    // Current is Isha
    currentKey = 'isha';
    nextKey = 'fajr';
    const tomorrow = new Date(currentTime);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowTimes = computePrayerTimes(tomorrow, location, settings);
    nextPrayerDate = tomorrowTimes.fajr;
  }

  const prayerItems: PrayerItem[] = [
    {
      key: 'fajr',
      name: 'Fajr',
      arabicName: 'الفَجْر',
      rawDate: rawTimes.fajr,
      timeFormatted: formatPrayerTime(rawTimes.fajr, false, location.timezone),
      isPassed: nowMs >= rawTimes.sunrise.getTime(),
      isCurrent: currentKey === 'fajr',
      isNext: nextKey === 'fajr',
      isPerformed: !!todayLog.fajr,
      alarmEnabled: alarmSettings.fajr,
      alarmSound: 'adhan_makkah',
    },
    {
      key: 'sunrise',
      name: 'Sunrise',
      arabicName: 'الشُّرُوق',
      rawDate: rawTimes.sunrise,
      timeFormatted: formatPrayerTime(rawTimes.sunrise, false, location.timezone),
      isPassed: nowMs >= rawTimes.dhuhr.getTime(),
      isCurrent: currentKey === 'sunrise',
      isNext: false,
      isPerformed: false,
      alarmEnabled: alarmSettings.sunrise,
      alarmSound: 'chime',
    },
    {
      key: 'dhuhr',
      name: 'Dhuhr',
      arabicName: 'الظُّهْر',
      rawDate: rawTimes.dhuhr,
      timeFormatted: formatPrayerTime(rawTimes.dhuhr, false, location.timezone),
      isPassed: nowMs >= rawTimes.asr.getTime(),
      isCurrent: currentKey === 'dhuhr',
      isNext: nextKey === 'dhuhr',
      isPerformed: !!todayLog.dhuhr,
      alarmEnabled: alarmSettings.dhuhr,
      alarmSound: 'adhan_makkah',
    },
    {
      key: 'asr',
      name: 'Asr',
      arabicName: 'العَصْر',
      rawDate: rawTimes.asr,
      timeFormatted: formatPrayerTime(rawTimes.asr, false, location.timezone),
      isPassed: nowMs >= rawTimes.maghrib.getTime(),
      isCurrent: currentKey === 'asr',
      isNext: nextKey === 'asr',
      isPerformed: !!todayLog.asr,
      alarmEnabled: alarmSettings.asr,
      alarmSound: 'adhan_makkah',
    },
    {
      key: 'maghrib',
      name: 'Maghrib',
      arabicName: 'المَغْرِب',
      rawDate: rawTimes.maghrib,
      timeFormatted: formatPrayerTime(rawTimes.maghrib, false, location.timezone),
      isPassed: nowMs >= rawTimes.isha.getTime(),
      isCurrent: currentKey === 'maghrib',
      isNext: nextKey === 'maghrib',
      isPerformed: !!todayLog.maghrib,
      alarmEnabled: alarmSettings.maghrib,
      alarmSound: 'adhan_makkah',
    },
    {
      key: 'isha',
      name: 'Isha',
      arabicName: 'العِشَاء',
      rawDate: rawTimes.isha,
      timeFormatted: formatPrayerTime(rawTimes.isha, false, location.timezone),
      isPassed: nowMs < rawTimes.fajr.getTime(),
      isCurrent: currentKey === 'isha',
      isNext: nextKey === 'isha',
      isPerformed: !!todayLog.isha,
      alarmEnabled: alarmSettings.isha,
      alarmSound: 'adhan_makkah',
    },
    {
      key: 'qiyam',
      name: 'Qiyam (Tahajjud)',
      arabicName: 'قِيَامُ اللَّيْل',
      rawDate: rawTimes.qiyam,
      timeFormatted: formatPrayerTime(rawTimes.qiyam, false, location.timezone),
      isPassed: false,
      isCurrent: false,
      isNext: false,
      isPerformed: !!todayLog.qiyam,
      alarmEnabled: alarmSettings.qiyam,
      alarmSound: 'chime',
    },
  ];

  const nextPrayerItem = prayerItems.find((p) => p.key === nextKey) || prayerItems[0];
  const nextPrayer = {
    ...nextPrayerItem,
    rawDate: nextPrayerDate,
    timeFormatted: formatPrayerTime(nextPrayerDate, false, location.timezone),
  };
  const remaining = formatRemainingTime(nextPrayerDate);
  const qiblaInfo = calculateQibla(location.latitude, location.longitude);

  // 5 Main prayers performed count
  const obligatoryKeys: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  const performedCount = obligatoryKeys.filter((k) => todayLog[k]).length;

  const handleTogglePrayer = (key: PrayerKey) => {
    const newVal = !todayLog[key];
    onUpdatePrayerLog(todayKey, key, newVal);

    if (newVal) {
      playCompletionChime();
      if (performedCount + 1 === 5) {
        // Trigger celebratory confetti for completing all 5 prayers!
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899'],
          });
        } catch {
          // ignore
        }
      }
    }
  };

  const handleToggleAlarm = (key: PrayerKey, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...alarmSettings, [key]: !alarmSettings[key] };
    setAlarmSettings(updated);
    if (updated[key]) {
      playPrayerAlarmTone('chime');
    }
  };

  const getPrayerIcon = (key: PrayerKey) => {
    switch (key) {
      case 'fajr':
        return <Sunrise className="w-4 h-4 text-amber-500" />;
      case 'sunrise':
        return <Sun className="w-4 h-4 text-orange-400" />;
      case 'dhuhr':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'asr':
        return <Sunset className="w-4 h-4 text-orange-500" />;
      case 'maghrib':
        return <Sunset className="w-4 h-4 text-rose-500" />;
      case 'isha':
        return <Moon className="w-4 h-4 text-indigo-400" />;
      case 'qiyam':
        return <Star className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-12 max-w-5xl mx-auto px-2 sm:px-0 animate-fade-in">
      {/* Local Device Clock, Date & Location Settings Bar (Ensures Offline Accuracy) */}
      <div
        id="device-clock-offline-status-bar"
        className="bg-neutral-900/90 rounded-2xl p-3 sm:p-4 border border-neutral-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
      >
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 font-mono font-bold">
            <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </span>
            <span className="text-[10px] text-neutral-400 font-normal hidden md:inline">
              (Device Clock)
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300">
            <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>
              {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 hidden lg:flex">
            <span className="text-[11px] font-mono text-neutral-300">{deviceClockInfo.timeZone}</span>
            <span className="text-[10px] text-neutral-500">({deviceClockInfo.gmtString})</span>
          </div>

          <button
            onClick={onOpenLocationModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-emerald-400 transition-colors cursor-pointer"
            title="Active Location Setting (Click to change)"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate max-w-[130px] sm:max-w-[200px]">
              {location.isAuto ? 'GPS Setting (Auto)' : `${location.city}, ${location.country}`}
            </span>
          </button>
        </div>

        {/* Offline Guarantee and 3-Day Sync State Chip */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-[11px] font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">Offline Reliable</span>
            <span className="text-[10px] text-emerald-400/80 font-mono">3d Saved</span>
          </div>

          {activeSyncStatus.isExpired ? (
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-950/90 border border-amber-500/80 text-amber-300 font-bold text-[11px] animate-pulse hover:bg-amber-900 transition-all cursor-pointer shadow-md shadow-amber-950/40"
              title="3-Day window expired. Connect to internet to update prayer times."
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Update Required (3d)</span>
            </button>
          ) : (
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 text-[11px] transition-colors cursor-pointer"
              title="Click to check 3-day sync schedule details"
            >
              {activeSyncStatus.isOnline ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              )}
              <span>{activeSyncStatus.isOnline ? 'Online' : 'Offline'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3-Day Expiration Alert Banner (Prompt to Connect to Internet) */}
      {activeSyncStatus.isExpired && (
        <div
          id="prayer-times-expired-banner"
          className="p-4 sm:p-5 rounded-3xl bg-amber-950/40 border border-amber-500/80 text-amber-200 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-300"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                Internet Connection Required to Update Prayer Times
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/40">
                  3 Days Passed
                </span>
              </h4>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                Your prayer times were saved ahead for 3 days and have reached the 3-day verification window.
                Please connect to the internet to refresh solar coordinates and extend your prayer schedule for the next 3 days.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenModal}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shrink-0 cursor-pointer shadow-lg shadow-amber-950/50 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Connect & Update Now</span>
          </button>
        </div>
      )}

      {/* Top Greeting & Next Prayer Banner */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <img
              src="/src/assets/images/app_logo_1791491470615.jpg"
              alt="Panj Surah App Logo"
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-2xl shadow-lg border border-emerald-600/40 object-cover shrink-0"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white flex flex-wrap items-center gap-2">
                Panj Surah
                <span className="text-xs font-sans font-medium px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-300">
                  Assalamu Alaikum{userProfile.name ? `, ${userProfile.name}` : ''}
                </span>
              </h1>
              <p className="text-[11px] text-neutral-400 font-sans">
                Authentic Daily Prayers • Panj Surah Reciter • Manzil &amp; Digital Tasbeeh
              </p>
            </div>
          </div>

          <div className="text-neutral-400 text-sm flex flex-wrap items-center gap-2">
            <button
              id="prayer-header-hijri-btn"
              onClick={onOpenHijriModal}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900/60 text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              title="Click to adjust Islamic Moon Sighting / Hijri Date"
            >
              <Moon className="w-3.5 h-3.5 text-emerald-400" />
              <span>{hijriDate.formattedEn}</span>
              <span className="font-arabic text-emerald-400 font-medium">({hijriDate.formattedUr})</span>
              {hijriDate.isAfterMaghrib && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-800/60 text-amber-300 font-normal">
                  🌙 Evening
                </span>
              )}
            </button>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenLocationModal}
                className="text-neutral-200 hover:text-emerald-400 font-semibold text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 transition-colors cursor-pointer"
                title="Active Location Setting (Click to change)"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{location.city}, {location.country}</span>
              </button>

              {/* Quick 1-Click Switcher between Lahore and Karachi */}
              {onQuickSelectLocation && (
                <div className="hidden sm:inline-flex items-center gap-1 text-[11px]">
                  {location.city !== 'Lahore' && (
                    <button
                      onClick={() =>
                        onQuickSelectLocation({
                          city: 'Lahore',
                          country: 'Pakistan',
                          latitude: 31.5204,
                          longitude: 74.3587,
                          timezone: 'Asia/Karachi',
                          hijriOffset: -1,
                          isAuto: false,
                        })
                      }
                      className="px-2 py-0.5 rounded-full bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 font-semibold transition-all cursor-pointer"
                      title="Set location to Lahore"
                    >
                      📍 Switch to Lahore
                    </button>
                  )}
                  {location.city !== 'Karachi' && (
                    <button
                      onClick={() =>
                        onQuickSelectLocation({
                          city: 'Karachi',
                          country: 'Pakistan',
                          latitude: 24.8607,
                          longitude: 67.0011,
                          timezone: 'Asia/Karachi',
                          hijriOffset: -1,
                          isAuto: false,
                        })
                      }
                      className="px-2 py-0.5 rounded-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-400 transition-all cursor-pointer"
                      title="Set location to Karachi"
                    >
                      Karachi
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>


        </div>

        {/* Dual Cards: Current Time (Clock) and Next/Active Prayer */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          {/* Card 1: Live Hardware Clock */}
          <div className="flex-1 sm:flex-initial bg-neutral-900/90 p-3.5 sm:p-4 rounded-2xl border border-neutral-800 shadow-xl text-left min-w-[170px]">
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1.5 font-mono">
              <Clock className="w-3 h-3 text-emerald-400" />
              Current Time ({location.city})
            </p>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </p>
            <p className="text-[10px] text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active: {prayerItems.find((p) => p.isCurrent)?.name || 'Isha'} Prayer
            </p>
          </div>

          {/* Card 2: Next Prayer Adhan Card */}
          <div className="flex-1 sm:flex-initial bg-gradient-to-br from-neutral-900 via-neutral-900 to-emerald-950/40 p-3.5 sm:p-4 rounded-2xl border border-emerald-800/60 shadow-xl text-left min-w-[190px]">
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Next Prayer: {nextPrayer.name}
            </p>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
              {nextPrayer.timeFormatted}
            </p>
            <p className="text-[10px] text-neutral-400 mt-0.5">
              {remaining.text} remaining ({nextPrayer.arabicName})
            </p>
          </div>
        </div>
      </header>

      {/* Ramadan / Fasting Status Quick Card on Dashboard */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-emerald-950/30 p-4 sm:p-5 rounded-3xl border border-neutral-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-950/70 text-emerald-400 border border-emerald-800/40 flex items-center justify-center font-bold shrink-0">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">Ramadan & Fasting Tracker</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/40 text-emerald-300 border border-emerald-800/40 font-mono">
                {Object.keys(userProfile.fastingLogs || {}).filter((k) => userProfile.fastingLogs[k]?.completed).length} Fasts Completed
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              {userProfile.fastingLogs?.[todayKey]?.completed
                ? '✓ You have marked your fast for today as completed.'
                : 'Are you fasting today? Track your intention, Suhoor, Iftar Duas & annual record.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('profile')}
          className="px-4 py-2 rounded-2xl bg-neutral-800 hover:bg-emerald-600 text-neutral-200 hover:text-white text-xs font-semibold border border-neutral-700 transition-all cursor-pointer whitespace-nowrap"
        >
          Open Fasting Tracker →
        </button>
      </div>

      {/* Visual Prayer Tracker (5 Daily Prayers) */}
      <div className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-medium text-white">Daily Prayer Tracker</h3>
            <p className="text-xs text-neutral-400">Mark prayers performed today to maintain your spiritual streak</p>
          </div>
          <div className="px-3 py-1 rounded-xl bg-neutral-800/80 border border-neutral-700/80 text-xs font-semibold text-emerald-400">
            {performedCount} / 5 Completed
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-4">
          {obligatoryKeys.map((pKey) => {
            const isDone = !!todayLog[pKey];
            const isNext = pKey === nextPrayer?.key;
            const pName = pKey.charAt(0).toUpperCase() + pKey.slice(1);
            const pTime = prayerItems.find((p) => p.key === pKey)?.timeFormatted || '';

            return (
              <button
                key={pKey}
                id={`tracker-square-${pKey}`}
                onClick={() => handleTogglePrayer(pKey)}
                className="flex flex-col items-center gap-2 p-2 rounded-2xl hover:bg-neutral-800/40 transition-all cursor-pointer group"
              >
                <div
                  className={`w-full aspect-square max-w-[72px] rounded-2xl flex items-center justify-center text-lg font-bold transition-all shadow-md ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-emerald-950/40 scale-100'
                      : isNext
                      ? 'bg-neutral-800 border-2 border-dashed border-emerald-500/60 text-emerald-400 animate-pulse'
                      : 'bg-neutral-800 border border-neutral-700 text-neutral-600 group-hover:border-neutral-600'
                  }`}
                >
                  {isDone ? (
                    <span>✓</span>
                  ) : isNext ? (
                    <span className="text-xs font-mono font-bold">NEXT</span>
                  ) : (
                    <span className="text-base opacity-40">○</span>
                  )}
                </div>
                <div className="text-center">
                  <span className={`text-xs font-medium block ${isNext ? 'text-emerald-400 font-bold' : isDone ? 'text-white' : 'text-neutral-400'}`}>
                    {pName}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500 hidden sm:block">
                    {pTime}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Weekly Prayer Completion Percentage Visualizer Chart (Recharts) */}
      <WeeklyPrayerChart userProfile={userProfile} />

      {/* Main Prayer Schedule & Tracker List */}
      <div className="bg-neutral-900 rounded-3xl p-5 sm:p-6 shadow-sm border border-neutral-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              Prayer Schedule & Adhan Times
            </h3>
            <p className="text-xs text-neutral-400">
              Astronomical calculations for {location.city} ({settings.method})
            </p>
          </div>
          <button
            onClick={() => playPrayerAlarmTone('takbeer')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium border border-neutral-700 cursor-pointer transition-colors"
            title="Test Prayer Sound"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            Test Audio
          </button>
        </div>

        {/* Prayer Rows */}
        <div className="divide-y divide-neutral-800">
          {prayerItems.map((prayer) => {
            const isObligatory = prayer.key !== 'sunrise' && prayer.key !== 'qiyam';
            return (
              <div
                key={prayer.key}
                id={`prayer-row-${prayer.key}`}
                className={`py-3.5 px-3 rounded-2xl flex items-center justify-between transition-all ${
                  prayer.isNext
                    ? 'bg-emerald-950/25 border border-emerald-800/40 shadow-sm'
                    : prayer.isCurrent
                    ? 'bg-amber-950/20 border border-amber-900/30'
                    : 'hover:bg-neutral-800/40'
                }`}
              >
                {/* Left: Icon + Name */}
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-neutral-800 border border-neutral-700/80 flex items-center justify-center shrink-0">
                    {getPrayerIcon(prayer.key)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm sm:text-base">
                        {prayer.name}
                      </span>
                      {prayer.isNext && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-600 text-white">
                          Next
                        </span>
                      )}
                      {prayer.isCurrent && !prayer.isNext && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-white">
                          Current
                        </span>
                      )}
                    </div>
                    <span className="font-arabic text-sm text-neutral-500 font-normal">
                      {prayer.arabicName}
                    </span>
                  </div>
                </div>

                {/* Right: Time + Alarm toggle + Performed Checkbox */}
                <div className="flex items-center gap-3 sm:gap-5">
                  <span className="font-mono font-bold text-base sm:text-lg text-white">
                    {prayer.timeFormatted}
                  </span>

                  {/* Alarm reminder button */}
                  <button
                    id={`alarm-toggle-${prayer.key}`}
                    onClick={(e) => handleToggleAlarm(prayer.key, e)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      prayer.alarmEnabled
                        ? 'text-emerald-400 bg-emerald-950/50 border-emerald-800/50 hover:bg-emerald-900/40'
                        : 'text-neutral-500 border-neutral-800 hover:text-neutral-300'
                    }`}
                    title={prayer.alarmEnabled ? 'Alarm enabled for ' + prayer.name : 'Enable alarm'}
                  >
                    {prayer.alarmEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  </button>

                  {/* Mark performed check box */}
                  {isObligatory ? (
                    <button
                      id={`mark-done-${prayer.key}`}
                      onClick={() => handleTogglePrayer(prayer.key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        prayer.isPerformed
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950/40'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white border border-neutral-700'
                      }`}
                    >
                      {prayer.isPerformed ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Performed</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4" />
                          <span>Mark Done</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="w-20" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span>Method: <strong className="text-neutral-200">{settings.method}</strong> ({settings.juristic === 'hanafi' ? 'Hanafi' : 'Standard'})</span>
            <button
              onClick={onOpenLocationModal}
              className="text-emerald-400 hover:underline cursor-pointer ml-1"
            >
              Change
            </button>
          </div>
          <button
            onClick={() => onNavigateTab('qibla')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium transition-all border border-neutral-700 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            Qibla {qiblaInfo.qiblaBearing}° ({qiblaInfo.compassDirection}) • {qiblaInfo.distanceKm.toLocaleString()} km
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 3-Day Ahead Prayer Schedule Card (Saved Ahead for 3 Days Offline) */}
      <ThreeDayPrayerScheduleCard
        schedule={threeDayCache}
        days={threeDayCache?.days || []}
        syncStatus={activeSyncStatus}
        location={location}
        deviceTimeZone={deviceClockInfo.timeZone}
        onOpenUpdateModal={handleOpenModal}
        onRefreshOnline={handleRefreshOnline}
        onSimulateExpired={handleSimulateExpired}
      />

      {/* Today's Islamic Event Card */}
      {todayEvents.length > 0 && (
        <div
          id="today-islamic-event-card"
          className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-neutral-800 text-emerald-400 border border-neutral-700 flex items-center justify-center font-bold shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Islamic Event of the Day • {hijriDate.day} {hijriDate.monthNameEn}
                </span>
                <h4 className="font-serif font-medium text-white text-base sm:text-lg">
                  {todayEvents[0].title}
                </h4>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-900/30 text-emerald-300 border border-emerald-800/40 shrink-0">
              {todayEvents[0].category}
            </span>
          </div>

          <p className="text-sm text-neutral-300 leading-relaxed mb-3">
            {todayEvents[0].description}
          </p>

          <div className="p-3 rounded-2xl bg-neutral-800/50 border border-neutral-800 text-xs text-neutral-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Spiritual Significance: </span>
              {todayEvents[0].significance}
            </div>
          </div>
        </div>
      )}

      {/* Recommended Surahs & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Panj Surah shortcut */}
        <button
          id="quick-action-panj-surah"
          onClick={() => onNavigateTab('surahs')}
          className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/60 transition-all text-left shadow-sm group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-900/30 border border-emerald-800/40 text-emerald-400 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
            <span className="font-arabic text-lg">قرآن</span>
          </div>
          <h4 className="font-semibold text-white text-base">Panj Surah & Beginner</h4>
          <p className="text-xs text-neutral-400 mt-1">
            Yasin, Al-Mulk, Rahman, Waqi'ah with verse audio & offline caching
          </p>
          <div className="mt-3 text-xs font-semibold text-emerald-400 flex items-center gap-1">
            Open Quran Reader <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Durood Sharif shortcut */}
        <button
          id="quick-action-durood"
          onClick={() => onNavigateTab('durood')}
          className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/60 transition-all text-left shadow-sm group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-900/30 border border-emerald-800/40 text-emerald-400 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
            <span className="font-arabic text-lg">ﷺ</span>
          </div>
          <h4 className="font-semibold text-white text-base">Durood Sharif</h4>
          <p className="text-xs text-neutral-400 mt-1">
            Durood-e-Ibrahim, Taj, Tunajjina, Shifa with built-in counters
          </p>
          <div className="mt-3 text-xs font-semibold text-emerald-400 flex items-center gap-1">
            Send Salawat <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Situational Duas shortcut */}
        <button
          id="quick-action-duas"
          onClick={() => onNavigateTab('duas')}
          className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/60 transition-all text-left shadow-sm group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-900/30 border border-emerald-800/40 text-emerald-400 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
            <span className="font-arabic text-lg">دعاء</span>
          </div>
          <h4 className="font-semibold text-white text-base">Masnoon Duas</h4>
          <p className="text-xs text-neutral-400 mt-1">
            Morning, distress relief, health, travel, parents & protection
          </p>
          <div className="mt-3 text-xs font-semibold text-emerald-400 flex items-center gap-1">
            Explore Duas <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* 3-Day Internet Connection & Prayer Times Update Modal */}
      <InternetUpdateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        syncStatus={activeSyncStatus}
        location={location}
        onRefreshOnline={handleRefreshOnline}
        onSimulateExpired={handleSimulateExpired}
        onResetFresh={handleResetFresh}
      />
    </div>
  );
};
