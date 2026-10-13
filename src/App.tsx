import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { PrayerTimesView } from './components/PrayerTimesView';
import { SurahsView } from './components/SurahsView';
import { QiblaCompassView } from './components/QiblaCompassView';
import { DuroodSharifView } from './components/DuroodSharifView';
import { DuasView } from './components/DuasView';
import { TasbeehView } from './components/TasbeehView';
import { ProfileDashboardView } from './components/ProfileDashboardView';
import { LocationPickerModal } from './components/LocationPickerModal';
import { MeetingModeModal } from './components/MeetingModeModal';
import { AccountSyncModal } from './components/AccountSyncModal';
import { HijriAdjustmentModal } from './components/HijriAdjustmentModal';
import { InternetUpdateModal } from './components/InternetUpdateModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { fetchHistoricalDataByEmail, syncUserDataToCloud } from './utils/cloudSync';
import {
  checkThreeDaySyncStatus,
  refreshThreeDayOnlineSync,
  simulateThreeDaysExpired,
} from './utils/offlinePrayerCache';
import {
  ActiveTab,
  CalculationSettings,
  OfflinePrayerSyncStatus,
  PrayerKey,
  TasbeehDailyRecord,
  TasbeehDhikr,
  UserLocation,
  UserProfile,
} from './types';
import { getHijriDate, fetchLiveHijriDate, HijriDate } from './utils/hijriCalendar';
import { getTodaysIslamicEvents } from './data/islamicEvents';
import { computePrayerTimes, formatPrayerTime } from './utils/prayerCalculator';
import { play15MinWarningTone, playAdhan, playPrayerAlarmTone } from './utils/audioAlarm';
import {
  Clock,
  BookOpen,
  Compass,
  Heart,
  Sparkles,
  CircleDot,
  User,
} from 'lucide-react';

const DEFAULT_LOCATION: UserLocation = {
  city: 'Lahore',
  country: 'Pakistan',
  latitude: 31.5204,
  longitude: 74.3587,
  timezone: 'Asia/Karachi',
  hijriOffset: -1,
};

const DEFAULT_SETTINGS: CalculationSettings = {
  method: 'Karachi',
  juristic: 'hanafi',
  highLatitudeRule: 'MiddleOfTheNight',
  fajrAngle: 18,
  ishaAngle: 18,
  adjustments: {
    fajr: 0,
    sunrise: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
  },
};

const generateDefault7Days = () => {
  const prayerLog: Record<string, { [key in PrayerKey]?: boolean }> = {};
  const tasbeehDailyLogs: Record<string, TasbeehDailyRecord> = {};

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];

    // Seed 7-day prayers (high consistency)
    prayerLog[dateKey] = {
      fajr: true,
      dhuhr: true,
      asr: i === 3 ? false : true,
      maghrib: true,
      isha: i === 5 ? false : true,
    };

    // Seed 7-day tasbeeh counts
    const dailyCount = [320, 450, 290, 510, 380, 420, 175][6 - i] || 280;
    tasbeehDailyLogs[dateKey] = {
      date: dateKey,
      totalCount: dailyCount,
      dhikrBreakdown: {
        SubhanAllah: Math.round(dailyCount * 0.35),
        Alhamdulillah: Math.round(dailyCount * 0.3),
        'Allahu Akbar': Math.round(dailyCount * 0.2),
        Astaghfirullah: Math.round(dailyCount * 0.15),
      },
    };
  }

  return { prayerLog, tasbeehDailyLogs };
};

const initial7Days = generateDefault7Days();

const DEFAULT_PROFILE: UserProfile = {
  name: 'Believer',
  gender: 'brother',
  language: 'en',
  theme: 'emerald-light',
  surahTranslationLang: 'both',
  audioAutoDownload: false,
  fontSizeArabic: 28,
  showTranslation: true,
  showTransliteration: true,
  streakDays: 7,
  totalPrayersPerformed: 43,
  fastingLogs: {},
  fastingChecklistToday: {
    intention: false,
    suhoor: false,
    fajrOnTime: false,
    dhikrQuran: false,
    avoidSins: false,
    iftarDua: false,
  },
  isFastingToday: false,
  hijriDayAdjustment: 0,
  enable15MinWarning: true,
  selectedAdhanSound: 'adhan_makkah',
  meetingModeActive: false,
  meetingModeUntil: null,
  dailyDhikrGoal: 300,
  dailyPrayerGoal: 5,
  weeklyDhikrGoal: 2100,
  weeklyPrayerGoal: 35,
  email: 'hammadmn99@gmail.com',
  isLoggedIn: true,
  lastSyncedAt: new Date().toISOString(),
  prayerLog: initial7Days.prayerLog,
  tasbeehDailyLogs: initial7Days.tasbeehDailyLogs,
  duroodCounts: {
    'durood-ibrahim': 45,
    'durood-taj': 12,
  },
  favoriteDuaIds: ['dua-morning-1', 'dua-distress-1', 'dua-parents', 'dua-friday-1', 'dua-fasting-iftar'],
  completedSurahIds: [1, 112, 113, 114],
  surahReadCount: {
    1: 14,
    112: 21,
    113: 15,
    114: 15,
    36: 4, // Surah Yaseen
    67: 7, // Surah Al-Mulk
    56: 3, // Surah Al-Waqi'ah
  },
  surahReadHistory: [
    { surahId: 36, surahName: 'Yaseen', surahArabic: 'يس', readAt: new Date(Date.now() - 3600000 * 4).toISOString() },
    { surahId: 67, surahName: 'Al-Mulk', surahArabic: 'الملك', readAt: new Date(Date.now() - 3600000 * 20).toISOString() },
    { surahId: 1, surahName: 'Al-Fatiha', surahArabic: 'الفاتحة', readAt: new Date(Date.now() - 3600000 * 28).toISOString() },
  ],
  totalSurahsReadCount: 84,
  manzilSectionsCompleted: {
    'manzil-1': true,
    'manzil-2': true,
    'manzil-3': true,
  },
  manzilTotalCompletions: 3,
  manzilLastReadAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  manzilTotalSectionsRead: 42,
  manzilDailyLogs: {
    [new Date().toISOString().split('T')[0]]: 1,
  },
  totalTasbeehCount: 2545,
  customDhikrs: [],
};

export function App() {
  // Persistent State
  const [activeTab, setActiveTab] = useState<ActiveTab>('prayers');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isHijriModalOpen, setIsHijriModalOpen] = useState(false);
  const [isInternetUpdateModalOpen, setIsInternetUpdateModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [privacyModalTab, setPrivacyModalTab] = useState<'privacy' | 'copyright' | 'permissions' | 'data'>('privacy');

  const [location, setLocation] = useState<UserLocation>(() => {
    try {
      const saved = localStorage.getItem('panj_surah_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If saved was old default Karachi, upgrade to Lahore (user's active location)
        if (parsed.city === 'Karachi' && !parsed.userExplicitlyPickedKarachi) {
          localStorage.setItem('panj_surah_location', JSON.stringify(DEFAULT_LOCATION));
          return DEFAULT_LOCATION;
        }
        return parsed;
      }
      return DEFAULT_LOCATION;
    } catch {
      return DEFAULT_LOCATION;
    }
  });

  const [settings, setSettings] = useState<CalculationSettings>(() => {
    try {
      const saved = localStorage.getItem('panj_surah_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('panj_surah_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.email === 'hammadmn@gmail.com') {
          parsed.email = 'hammadmn99@gmail.com';
          localStorage.setItem('panj_surah_profile', JSON.stringify(parsed));
        }
        return parsed;
      }
      return DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // 3-Day Offline Sync Status
  const [threeDaySyncStatus, setThreeDaySyncStatus] = useState<OfflinePrayerSyncStatus>(() =>
    checkThreeDaySyncStatus(userProfile.prayerTimesLastOnlineSync)
  );

  // Auto-pick local device time, timezone & location setting so it remains accurate offline
  useEffect(() => {
    const deviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (deviceTimezone && (!location.timezone || location.timezone !== deviceTimezone)) {
      setLocation((prev) => ({ ...prev, timezone: deviceTimezone }));
    }

    // If location is configured for Auto or device setting, try to get hardware GPS/network
    if (location.isAuto && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation((prev) => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            city: 'Device GPS Location',
            country: (deviceTimezone || 'Local').replace(/_/g, ' '),
            isAuto: true,
            timezone: deviceTimezone || prev.timezone,
          }));
        },
        () => {
          // Gracefully fallback to saved location without interrupting offline usage
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    }
  }, []);

  // Check 3-day sync expiration status on mount and when last sync changes
  useEffect(() => {
    const status = checkThreeDaySyncStatus(userProfile.prayerTimesLastOnlineSync);
    setThreeDaySyncStatus(status);
    if (status.isExpired) {
      setIsInternetUpdateModalOpen(true);
    }
  }, [userProfile.prayerTimesLastOnlineSync]);

  // Online / Offline Connectivity listener for 3-day sync
  useEffect(() => {
    const handleConn = () => {
      setThreeDaySyncStatus(checkThreeDaySyncStatus(userProfile.prayerTimesLastOnlineSync));
    };
    window.addEventListener('online', handleConn);
    window.addEventListener('offline', handleConn);
    return () => {
      window.removeEventListener('online', handleConn);
      window.removeEventListener('offline', handleConn);
    };
  }, [userProfile.prayerTimesLastOnlineSync]);

  const handleRefreshPrayerTimesOnline = () => {
    const now = Date.now();
    refreshThreeDayOnlineSync(new Date(), location, settings, userProfile.hijriDayAdjustment);
    setUserProfile((prev) => {
      const updated = { ...prev, prayerTimesLastOnlineSync: now };
      try {
        localStorage.setItem('panj_surah_profile', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    setThreeDaySyncStatus(checkThreeDaySyncStatus(now));
  };

  const handleSimulateThreeDaysExpired = () => {
    simulateThreeDaysExpired(new Date(), location, settings, userProfile.hijriDayAdjustment);
    const expiredTs = Date.now() - (3 * 24 * 60 * 60 * 1000 + 3600000);
    setUserProfile((prev) => {
      const updated = { ...prev, prayerTimesLastOnlineSync: expiredTs };
      try {
        localStorage.setItem('panj_surah_profile', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    setThreeDaySyncStatus(checkThreeDaySyncStatus(expiredTs));
    setIsInternetUpdateModalOpen(true);
  };

  // Hijri Date and Islamic events for today (Auto-aligned with regional moon sighting authority and local sunset)
  const [hijriDate, setHijriDate] = useState<HijriDate>(() =>
    getHijriDate(new Date(), userProfile.hijriDayAdjustment, location, location.city)
  );
  const todayEvents = getTodaysIslamicEvents(hijriDate.month, hijriDate.day);

  // Sync Hijri Date with location-based calculation and live Google / Aladhan Islamic Calendar API
  const refreshHijriDate = async () => {
    const calculated = getHijriDate(new Date(), userProfile.hijriDayAdjustment, location, location.city);
    setHijriDate(calculated);

    try {
      const live = await fetchLiveHijriDate(new Date(), location, userProfile.hijriDayAdjustment);
      if (live) {
        setHijriDate(live);
      }
    } catch {
      // Keep calculated
    }
  };

  useEffect(() => {
    refreshHijriDate();
    const interval = setInterval(refreshHijriDate, 60000);
    return () => clearInterval(interval);
  }, [location.country, location.city, location.latitude, location.longitude, location.timezone, userProfile.hijriDayAdjustment]);

  // Sync theme to root html
  useEffect(() => {
    const root = document.documentElement;
    if (userProfile.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [userProfile.theme]);

  // Save location
  useEffect(() => {
    try {
      localStorage.setItem('panj_surah_location', JSON.stringify(location));
    } catch (e) {
      console.error(e);
    }
  }, [location]);

  // Save settings
  useEffect(() => {
    try {
      localStorage.setItem('panj_surah_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  // Save profile
  useEffect(() => {
    try {
      localStorage.setItem('panj_surah_profile', JSON.stringify(userProfile));
    } catch (e) {
      console.error(e);
    }
  }, [userProfile]);

  // Automatic Prayer Alarm Checker in background
  const lastAlarmRungRef = useRef<string>('');
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const rawTimes = computePrayerTimes(now, location, settings);
      const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      const prayersToCheck: { key: PrayerKey; date: Date }[] = [
        { key: 'fajr', date: rawTimes.fajr },
        { key: 'dhuhr', date: rawTimes.dhuhr },
        { key: 'asr', date: rawTimes.asr },
        { key: 'maghrib', date: rawTimes.maghrib },
        { key: 'isha', date: rawTimes.isha },
      ];

      // Check if user is in Meeting Mode (silence all audible alarms & azaans)
      const isMeetingMode =
        userProfile.meetingModeActive &&
        (!userProfile.meetingModeUntil || now.getTime() < userProfile.meetingModeUntil);

      // 1. Exact Prayer Time Alarm / Adhan
      for (const p of prayersToCheck) {
        const pStr = `${p.date.getHours().toString().padStart(2, '0')}:${p.date.getMinutes().toString().padStart(2, '0')}`;
        const alarmKey = `${p.key}-${currentTimeStr}-${now.toDateString()}`;

        if (pStr === currentTimeStr && lastAlarmRungRef.current !== alarmKey) {
          lastAlarmRungRef.current = alarmKey;
          if (!isMeetingMode) {
            playAdhan(userProfile.selectedAdhanSound || 'adhan_makkah');
          }
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`🕌 Prayer Time: ${p.key.toUpperCase()}${isMeetingMode ? ' (Muted for Meeting)' : ''}`, {
              body: `It is now time for ${p.key.toUpperCase()} in ${location.city}.${isMeetingMode ? ' Audio muted due to Meeting Mode.' : ''}`,
              icon: '/favicon.ico',
            });
          }
          break;
        }
      }

      // 2. 15-Minute Closing Warning Alert before previous prayer closes
      if (userProfile.enable15MinWarning) {
        for (let i = 0; i < prayersToCheck.length; i++) {
          const nextP = prayersToCheck[i];
          const prevP = prayersToCheck[(i - 1 + prayersToCheck.length) % prayersToCheck.length];
          const warnDate = new Date(nextP.date.getTime() - 15 * 60 * 1000);
          const warnStr = `${warnDate.getHours().toString().padStart(2, '0')}:${warnDate.getMinutes().toString().padStart(2, '0')}`;
          const warnKey = `warn-15min-${nextP.key}-${currentTimeStr}-${now.toDateString()}`;

          if (warnStr === currentTimeStr && lastAlarmRungRef.current !== warnKey) {
            lastAlarmRungRef.current = warnKey;
            if (!isMeetingMode) {
              play15MinWarningTone();
            }
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`⏰ 15-Minute Warning: ${prevP.key.toUpperCase()} Closing Soon${isMeetingMode ? ' (Silent)' : ''}`, {
                body: `Only 15 minutes left before ${nextP.key.toUpperCase()} enters. Please complete ${prevP.key.toUpperCase()}!`,
                icon: '/favicon.ico',
              });
            }
            break;
          }
        }
      }
    };

    const interval = setInterval(checkAlarms, 25000);
    return () => clearInterval(interval);
  }, [location, settings, userProfile.selectedAdhanSound, userProfile.enable15MinWarning, userProfile.meetingModeActive, userProfile.meetingModeUntil]);

  // Profile Update Handlers
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleToggleTheme = () => {
    const nextTheme = userProfile.theme === 'emerald-light' ? 'dark' : 'emerald-light';
    handleUpdateProfile({ theme: nextTheme });
  };

  const handleUpdatePrayerLog = (dateKey: string, prayerKey: PrayerKey, isDone: boolean) => {
    setUserProfile((prev) => {
      const currentDayLog = prev.prayerLog[dateKey] || {};
      const newDayLog = { ...currentDayLog, [prayerKey]: isDone };

      // Calculate streak
      const allDone = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].every((k) => newDayLog[k as PrayerKey]);
      const currentTotal = Object.values({ ...prev.prayerLog, [dateKey]: newDayLog }).reduce(
        (acc: number, d) => acc + Object.values(d).filter(Boolean).length,
        0
      );

      return {
        ...prev,
        totalPrayersPerformed: currentTotal,
        streakDays: allDone ? prev.streakDays + 1 : prev.streakDays,
        prayerLog: {
          ...prev.prayerLog,
          [dateKey]: newDayLog,
        },
      };
    });
  };

  const handleToggleSurahCompleted = (
    surahId: number,
    surahDetails?: { name: string; arabic: string }
  ) => {
    setUserProfile((prev) => {
      const exists = prev.completedSurahIds.includes(surahId);
      const nextList = exists
        ? prev.completedSurahIds.filter((id) => id !== surahId)
        : [...prev.completedSurahIds, surahId];

      const prevCounts = prev.surahReadCount || {};
      const newCount = exists ? (prevCounts[surahId] || 1) : (prevCounts[surahId] || 0) + 1;

      const newHistory = [...(prev.surahReadHistory || [])];
      if (!exists && surahDetails) {
        newHistory.unshift({
          surahId,
          surahName: surahDetails.name,
          surahArabic: surahDetails.arabic,
          readAt: new Date().toISOString(),
        });
      }

      return {
        ...prev,
        completedSurahIds: nextList,
        surahReadCount: {
          ...prevCounts,
          [surahId]: newCount,
        },
        totalSurahsReadCount: (prev.totalSurahsReadCount || 0) + (exists ? 0 : 1),
        surahReadHistory: newHistory.slice(0, 30),
      };
    });
  };

  const handleRecordManzilSectionRead = (sectionId: string, isRead = true) => {
    setUserProfile((prev) => {
      const currentSections = prev.manzilSectionsCompleted || {};
      const updatedSections = { ...currentSections, [sectionId]: isRead };
      const currentTotal = prev.manzilTotalSectionsRead || 0;

      return {
        ...prev,
        manzilSectionsCompleted: updatedSections,
        manzilTotalSectionsRead: isRead ? currentTotal + 1 : Math.max(0, currentTotal - 1),
        manzilLastReadAt: new Date().toISOString(),
      };
    });
  };

  const handleRecordManzilFullCompletion = () => {
    const todayKey = new Date().toISOString().split('T')[0];
    setUserProfile((prev) => {
      const daily = prev.manzilDailyLogs || {};
      const todayCount = (daily[todayKey] || 0) + 1;

      return {
        ...prev,
        manzilTotalCompletions: (prev.manzilTotalCompletions || 0) + 1,
        manzilLastReadAt: new Date().toISOString(),
        manzilDailyLogs: {
          ...daily,
          [todayKey]: todayCount,
        },
      };
    });
  };

  const handleIncrementDurood = (duroodId: string, count: number) => {
    setUserProfile((prev) => ({
      ...prev,
      duroodCounts: {
        ...prev.duroodCounts,
        [duroodId]: count,
      },
    }));
  };

  const handleResetDurood = (duroodId: string) => {
    setUserProfile((prev) => ({
      ...prev,
      duroodCounts: {
        ...prev.duroodCounts,
        [duroodId]: 0,
      },
    }));
  };

  const handleToggleFavoriteDua = (duaId: string) => {
    setUserProfile((prev) => {
      const isFav = prev.favoriteDuaIds.includes(duaId);
      const nextFavs = isFav
        ? prev.favoriteDuaIds.filter((id) => id !== duaId)
        : [...prev.favoriteDuaIds, duaId];
      return { ...prev, favoriteDuaIds: nextFavs };
    });
  };

  const handleUpdateTasbeehTotal = (newTotal: number, dhikrTitle?: string, countDelta?: number) => {
    const todayKey = new Date().toISOString().split('T')[0];
    const delta = countDelta !== undefined ? countDelta : Math.max(0, newTotal - userProfile.totalTasbeehCount);

    setUserProfile((prev) => {
      const currentDayRecord = prev.tasbeehDailyLogs?.[todayKey] || {
        date: todayKey,
        totalCount: 0,
        dhikrBreakdown: {},
      };

      const title = dhikrTitle || 'SubhanAllah';
      const prevDhikrCount = currentDayRecord.dhikrBreakdown?.[title] || 0;

      const updatedDailyLogs = {
        ...(prev.tasbeehDailyLogs || {}),
        [todayKey]: {
          date: todayKey,
          totalCount: currentDayRecord.totalCount + delta,
          dhikrBreakdown: {
            ...(currentDayRecord.dhikrBreakdown || {}),
            [title]: prevDhikrCount + delta,
          },
        },
      };

      return {
        ...prev,
        totalTasbeehCount: newTotal,
        tasbeehDailyLogs: updatedDailyLogs,
      };
    });
  };

  const handleSaveCustomDhikr = (dhikr: TasbeehDhikr) => {
    setUserProfile((prev) => ({
      ...prev,
      customDhikrs: [...prev.customDhikrs, dhikr],
    }));
  };

  const navTabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'prayers', label: 'Prayers', icon: <Clock className="w-5 h-5" /> },
    { id: 'surahs', label: 'Panj Surah', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'qibla', label: 'Qibla', icon: <Compass className="w-5 h-5" /> },
    { id: 'durood', label: 'Durood', icon: <Heart className="w-5 h-5" /> },
    { id: 'duas', label: 'Duas', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'tasbeeh', label: 'Tasbeeh', icon: <CircleDot className="w-5 h-5" /> },
    { id: 'profile', label: 'Dashboard', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 transition-colors duration-200 flex flex-col font-sans">
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        location={location}
        hijriDate={hijriDate}
        theme={userProfile.theme}
        userProfile={userProfile}
        isSyncExpired={threeDaySyncStatus.isExpired}
        onOpenInternetUpdateModal={() => setIsInternetUpdateModalOpen(true)}
        onToggleTheme={handleToggleTheme}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenHijriModal={() => setIsHijriModalOpen(true)}
        onOpenMeetingModeModal={() => setIsMeetingModalOpen(true)}
        onOpenAccountSyncModal={() => setIsSyncModalOpen(true)}
        onOpenPrivacyModal={() => {
          setPrivacyModalTab('privacy');
          setIsPrivacyModalOpen(true);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto pt-4 sm:pt-6 px-3 sm:px-6">
        {activeTab === 'prayers' && (
          <PrayerTimesView
            location={location}
            settings={settings}
            hijriDate={hijriDate}
            todayEvents={todayEvents}
            userProfile={userProfile}
            onUpdatePrayerLog={handleUpdatePrayerLog}
            onNavigateTab={setActiveTab}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onOpenHijriModal={() => setIsHijriModalOpen(true)}
            onOpenMeetingModeModal={() => setIsMeetingModalOpen(true)}
            onOpenAccountSyncModal={() => setIsSyncModalOpen(true)}
            onOpenInternetUpdateModal={() => setIsInternetUpdateModalOpen(true)}
            isInternetUpdateModalOpen={isInternetUpdateModalOpen}
            onCloseInternetUpdateModal={() => setIsInternetUpdateModalOpen(false)}
            syncStatus={threeDaySyncStatus}
            onRefreshOnlineSync={handleRefreshPrayerTimesOnline}
            onQuickSelectLocation={(newLoc) => {
              setLocation(newLoc);
              localStorage.setItem('panj_surah_location', JSON.stringify(newLoc));
              setHijriDate(getHijriDate(new Date(), userProfile.hijriDayAdjustment, newLoc, newLoc.city));
            }}
          />
        )}

        {activeTab === 'surahs' && (
          <SurahsView
            userProfile={userProfile}
            onToggleSurahCompleted={handleToggleSurahCompleted}
          />
        )}

        {activeTab === 'qibla' && (
          <QiblaCompassView
            location={location}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
          />
        )}

        {activeTab === 'durood' && (
          <DuroodSharifView
            userProfile={userProfile}
            onIncrementDurood={handleIncrementDurood}
            onResetDurood={handleResetDurood}
          />
        )}

        {activeTab === 'duas' && (
          <DuasView
            userProfile={userProfile}
            onToggleFavoriteDua={handleToggleFavoriteDua}
            onRecordManzilSectionRead={handleRecordManzilSectionRead}
            onRecordManzilFullCompletion={handleRecordManzilFullCompletion}
          />
        )}

        {activeTab === 'tasbeeh' && (
          <TasbeehView
            userProfile={userProfile}
            onUpdateTasbeehTotal={handleUpdateTasbeehTotal}
            onSaveCustomDhikr={handleSaveCustomDhikr}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileDashboardView
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            location={location}
            settings={settings}
            hijriDate={hijriDate}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onOpenHijriModal={() => setIsHijriModalOpen(true)}
            onNavigateTab={setActiveTab}
            onOpenPrivacyModal={(tab) => {
              setPrivacyModalTab(tab || 'privacy');
              setIsPrivacyModalOpen(true);
            }}
            onOpenAccountSyncModal={() => setIsSyncModalOpen(true)}
          />
        )}
      </main>

      {/* App Global Footer with Copyright and Privacy Policy */}
      <footer className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-28 md:pb-10 border-t border-neutral-900/80 mt-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span className="font-semibold text-neutral-300">© 2026 Panj Surah. All Rights Reserved.</span>
            <span className="hidden sm:inline text-neutral-600">•</span>
            <span className="text-neutral-500">Daily Prayers &amp; Quran Companion</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <button
              onClick={() => {
                setPrivacyModalTab('privacy');
                setIsPrivacyModalOpen(true);
              }}
              className="text-neutral-400 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-neutral-700">•</span>
            <button
              onClick={() => {
                setPrivacyModalTab('copyright');
                setIsPrivacyModalOpen(true);
              }}
              className="text-neutral-400 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Copyright Notice
            </button>
            <span className="text-neutral-700">•</span>
            <button
              onClick={() => {
                setPrivacyModalTab('permissions');
                setIsPrivacyModalOpen(true);
              }}
              className="text-neutral-400 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Permissions
            </button>
            <span className="text-neutral-700">•</span>
            <a
              href="https://panj-surah-privacy.netlify.app/privacy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 transition-colors"
            >
              Public Privacy Policy ↗
            </a>
          </div>
        </div>
      </footer>

      {/* Bottom Mobile Tab Bar (Applet iOS/Android experience) */}
      <nav
        id="mobile-tab-bar"
        className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800 py-1.5 px-2 flex md:hidden items-center justify-around shadow-2xl"
      >
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`mobile-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-emerald-400 font-bold scale-105'
                  : 'text-neutral-500 hover:text-neutral-300 font-medium'
              }`}
            >
              <div className={`p-1.5 rounded-xl ${isActive ? 'bg-emerald-950/70 text-emerald-400' : ''}`}>
                {tab.icon}
              </div>
              <span className="text-[10px] mt-0.5 whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Location & Calculation Rule Modal */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        location={location}
        settings={settings}
        onSaveLocation={(newLoc) => {
          setLocation(newLoc);
          setHijriDate(getHijriDate(new Date(), userProfile.hijriDayAdjustment, newLoc, newLoc.city));
        }}
        onSaveSettings={(newSet) => setSettings(newSet)}
        onClose={() => setIsLocationModalOpen(false)}
      />

      {/* Hijri Calendar & Moon Sighting Adjustment Modal */}
      <HijriAdjustmentModal
        isOpen={isHijriModalOpen}
        hijriDate={hijriDate}
        location={location}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
        onRefreshLiveDate={refreshHijriDate}
        onClose={() => setIsHijriModalOpen(false)}
      />

      {/* Meeting Mode (Silent Adhan for Meetings) Modal */}
      <MeetingModeModal
        isOpen={isMeetingModalOpen}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
        onClose={() => setIsMeetingModalOpen(false)}
      />

      {/* Cloud Backup & Email Account Sync Modal */}
      <AccountSyncModal
        isOpen={isSyncModalOpen}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
        onClose={() => setIsSyncModalOpen(false)}
      />

      {/* 3-Day Internet Connection & Prayer Times Update Modal */}
      <InternetUpdateModal
        isOpen={isInternetUpdateModalOpen}
        onClose={() => setIsInternetUpdateModalOpen(false)}
        syncStatus={threeDaySyncStatus}
        location={location}
        onRefreshOnline={handleRefreshPrayerTimesOnline}
        onSimulateExpired={handleSimulateThreeDaysExpired}
        onResetFresh={handleRefreshPrayerTimesOnline}
      />

      {/* Privacy Policy, Copyright & Permissions Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        initialTab={privacyModalTab}
        userProfile={userProfile}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
}

export default App;
