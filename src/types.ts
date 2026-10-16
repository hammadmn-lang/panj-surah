export type PrayerKey = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'qiyam';

export interface PrayerItem {
  key: PrayerKey;
  name: string;
  arabicName: string;
  timeFormatted: string;
  rawDate: Date;
  isPassed: boolean;
  isCurrent: boolean;
  isNext: boolean;
  isPerformed: boolean;
  alarmEnabled: boolean;
  alarmSound: 'adhan_makkah' | 'adhan_madinah' | 'adhan_alaqsa' | 'adhan_mishary' | 'chime' | 'takbeer' | 'beep';
}

export type CalculationMethodKey =
  | 'MWL' // Muslim World League
  | 'ISNA' // Islamic Society of North America
  | 'Egypt' // Egyptian General Authority
  | 'Makkah' // Umm Al-Qura, Makkah
  | 'Karachi' // University of Islamic Sciences, Karachi
  | 'Tehran' // Institute of Geophysics, Univ of Tehran
  | 'Gulf' // Gulf Region
  | 'Singapore' // Majlis Ugama Islam Singapura
  | 'Turkey'; // Diyanet

export type JuristicMethod = 'standard' | 'hanafi'; // Asr shadow factor

export interface UserLocation {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  isAuto?: boolean;
  timezone?: string;
  hijriOffset?: number; // regional moon sighting adjustment
}

export interface CalculationSettings {
  method: CalculationMethodKey;
  juristic: JuristicMethod;
  fajrAngle?: number;
  ishaAngle?: number;
  highLatitudeRule?: string;
  adjustments: {
    fajr: number;
    sunrise: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
  enable15MinWarning?: boolean;
  defaultAdhanSound?: 'adhan_makkah' | 'adhan_madinah' | 'adhan_alaqsa' | 'adhan_mishary' | 'chime' | 'takbeer' | 'beep';
}

export interface Verse {
  id: number;
  number: number;
  textArabic: string;
  transliteration: string;
  translation: string;
  translationUr?: string; // Urdu translation for Quran verse
  audioUrl?: string;
}

export interface Surah {
  id: number;
  number: number;
  nameArabic: string;
  nameEnglish: string;
  nameTransliteration: string;
  meaning: string;
  versesCount: number;
  revelationType: 'Meccan' | 'Medinan';
  isPanjSurah: boolean;
  isBeginnerRecommended: boolean;
  summary: string;
  virtues: string[];
  audioUrl: string; // Reciter complete surah audio URL
  verses: Verse[];
}

export interface DuroodItem {
  id: string;
  title: string;
  arabicTitle: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  urduTranslation?: string;
  virtues: string[];
  reference: string;
  recommendedCount: number;
  isBigger?: boolean;
  pdfPages?: number;
}

export type DuaCategory =
  | 'All'
  | 'Manzil (منزل - Protection & Ruqyah)'
  | 'Six Kalimas (کلمات)'
  | 'Iman Mufassal & Mujmal (ایمان)'
  | 'Eating & Drinking (کھانا پینا)'
  | 'Daily Life Prayers (روزمرہ مسنون دعائیں)'
  | 'Essential & Quranic'
  | 'Friday (Jummah)'
  | 'Morning & Evening'
  | 'Before Sleep & Waking'
  | 'Distress & Anxiety'
  | 'Health & Shifa'
  | 'Parents & Family'
  | 'Forgiveness'
  | 'Travel & Journey'
  | 'Mosque & Home'
  | 'Protection & Evil Eye'
  | 'Knowledge & Success'
  | 'Fasting & Ramadan';

export interface DuaItem {
  id: string;
  category: DuaCategory;
  title: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  urduTranslation?: string;
  reference: string;
  situation: string;
  benefit: string;
}

export interface IslamicEvent {
  hijriDay: number;
  hijriMonth: number; // 1-12
  hijriYear?: number;
  title: string;
  category: 'Milestone' | 'Prophetic' | 'Sacred Day' | 'Battle' | 'Revelation';
  description: string;
  significance: string;
}

export interface TasbeehDhikr {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  target: number;
  count: number;
  totalSaved: number;
}

export interface TasbeehDailyRecord {
  date: string; // YYYY-MM-DD
  totalCount: number;
  dhikrBreakdown?: Record<string, number>; // title/id -> count
}

export type FastingType =
  | 'ramadan'
  | 'sunnah_monday_thursday'
  | 'ayyam_beed'
  | 'shawwal'
  | 'qadha'
  | 'ashura'
  | 'arafah'
  | 'voluntary';

export interface FastingRecord {
  date: string; // YYYY-MM-DD
  type: FastingType;
  notes?: string;
  completed: boolean;
  suhoorDone?: boolean;
  iftarDone?: boolean;
}

export interface UserProfile {
  name: string;
  email?: string;
  password?: string;
  registeredAt?: string;
  isLoggedIn?: boolean;
  lastSyncedAt?: string;
  title?: string;
  gender: 'brother' | 'sister' | 'unspecified';
  streakDays: number;
  lastActiveDate?: string;
  totalPrayersPerformed?: number;
  prayerLog: Record<string, { [key in PrayerKey]?: boolean }>; // date string YYYY-MM-DD -> prayers done
  fastingLogs: Record<string, FastingRecord>; // date string YYYY-MM-DD -> fasting entry
  fastingChecklistToday: {
    intention: boolean;
    suhoor: boolean;
    fajrOnTime: boolean;
    dhikrQuran: boolean;
    avoidSins: boolean;
    iftarDua: boolean;
  };
  isFastingToday?: boolean;
  favoriteDuaIds: string[];
  completedSurahIds: number[];
  surahReadCount?: Record<number, number>; // surahId -> times read
  surahReadHistory?: Array<{
    surahId: number;
    surahName: string;
    surahArabic: string;
    readAt: string; // ISO timestamp
  }>;
  totalSurahsReadCount?: number;
  // Manzil Reading Statistics
  manzilSectionsCompleted?: Record<string, boolean>; // section id -> completed today
  manzilTotalCompletions?: number; // total times full Manzil was recited
  manzilLastReadAt?: string;
  manzilTotalSectionsRead?: number;
  manzilDailyLogs?: Record<string, number>; // YYYY-MM-DD -> times read
  duroodCounts: Record<string, number>;
  totalTasbeehCount: number;
  tasbeehDailyLogs: Record<string, TasbeehDailyRecord>; // YYYY-MM-DD -> TasbeehDailyRecord
  customDhikrs: TasbeehDhikr[];
  language: 'en' | 'ur' | 'ar' | 'tr' | 'id' | 'fr';
  surahTranslationLang: 'en' | 'ur' | 'both';
  theme: 'emerald-light' | 'emerald-dark' | 'dark' | 'bright';
  fontSizeArabic: number;
  showTransliteration: boolean;
  showTranslation: boolean;
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
  audioAutoDownload?: boolean;
  hijriDayAdjustment: number;
  enable15MinWarning: boolean;
  selectedAdhanSound: 'adhan_makkah' | 'adhan_madinah' | 'adhan_alaqsa' | 'adhan_mishary' | 'chime' | 'takbeer' | 'beep';
  meetingModeActive: boolean;
  meetingModeUntil: number | null; // epoch timestamp ms, or null if indefinite/disabled
  dailyDhikrGoal?: number; // e.g. 300
  dailyPrayerGoal?: number; // e.g. 5
  weeklyDhikrGoal?: number; // e.g. 2100
  weeklyPrayerGoal?: number; // e.g. 35
  prayerTimesLastOnlineSync?: number; // epoch ms when prayer times were last verified online
  useDeviceLocationSetting?: boolean; // whether to prioritize local device GPS/network location
}

export interface CachedPrayerDay {
  dayOffset: number; // 0 for today, 1 for tomorrow, 2 for +2 days, 3 for +3 days
  dateKey: string; // YYYY-MM-DD
  dayName: string; // "Monday", "Tuesday", etc.
  formattedDate: string; // e.g. "Sep 3, 2026"
  isToday: boolean;
  hijriDate: {
    day: number;
    month: number;
    monthNameEn: string;
    monthNameAr: string;
    year: number;
    formattedEn: string;
  };
  times: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
    qiyam: string;
  };
  rawTimestamps: {
    fajr: number;
    sunrise: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
    qiyam: number;
  };
}

export interface ThreeDayPrayerCache {
  savedAt: number; // epoch ms
  lastOnlineSyncAt: number; // epoch ms
  expiresAt: number; // epoch ms (72h after lastOnlineSyncAt)
  location: UserLocation;
  days: CachedPrayerDay[];
  isDeviceTimeBased: boolean;
}

export interface OfflinePrayerSyncStatus {
  lastOnlineSyncAt: number;
  expiresAt: number;
  isExpired: boolean;
  elapsedMs: number;
  remainingMs: number;
  hoursRemaining: number;
  daysElapsed: number;
  lastUpdateFormatted: string;
  expiresAtFormatted: string;
  isOnline: boolean;
}

export type AppTab = 'prayers' | 'surahs' | 'qibla' | 'durood' | 'duas' | 'tasbeeh' | 'profile';
export type ActiveTab = AppTab;

