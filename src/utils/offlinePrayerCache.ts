import { CalculationSettings, CachedPrayerDay, ThreeDayPrayerCache, OfflinePrayerSyncStatus, UserLocation } from '../types';
import { computePrayerTimes, formatPrayerTime } from './prayerCalculator';
import { getHijriDate } from './hijriCalendar';

export const PRAYER_CACHE_KEY = 'panj_surah_prayer_times_cache_3days';
export const LAST_ONLINE_SYNC_KEY = 'panj_surah_prayer_last_online_sync';
export const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000; // Exactly 72 Hours / 3 Days

/**
 * Generates prayer times for today and the next 3 days ahead (4 days total).
 * Uses local device date and time calculations so it works 100% offline.
 */
export function buildThreeDayPrayerSchedule(
  baseDate: Date,
  location: UserLocation,
  settings: CalculationSettings,
  hijriAdjustment = 0
): CachedPrayerDay[] {
  const days: CachedPrayerDay[] = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Generate today (0), tomorrow (1), +2 days, +3 days
  for (let offset = 0; offset <= 3; offset++) {
    const targetDate = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate() + offset,
      12,
      0,
      0
    );

    const dateKey = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;
    const dayName = dayNames[targetDate.getDay()];
    const formattedDate = `${dayName.slice(0, 3)}, ${monthNames[targetDate.getMonth()]} ${targetDate.getDate()}, ${targetDate.getFullYear()}`;

    // Astronomical calculation from device location and solar algorithms
    const rawTimes = computePrayerTimes(targetDate, location, settings);
    const hijri = getHijriDate(targetDate, hijriAdjustment, location, location.city);

    days.push({
      dayOffset: offset,
      dateKey,
      dayName,
      formattedDate,
      isToday: offset === 0,
      hijriDate: {
        day: hijri.day,
        month: hijri.month,
        monthNameEn: hijri.monthNameEn,
        monthNameAr: hijri.monthNameAr,
        year: hijri.year,
        formattedEn: hijri.formattedEn,
      },
      times: {
        fajr: formatPrayerTime(rawTimes.fajr),
        sunrise: formatPrayerTime(rawTimes.sunrise),
        dhuhr: formatPrayerTime(rawTimes.dhuhr),
        asr: formatPrayerTime(rawTimes.asr),
        maghrib: formatPrayerTime(rawTimes.maghrib),
        isha: formatPrayerTime(rawTimes.isha),
        qiyam: formatPrayerTime(rawTimes.qiyam),
      },
      rawTimestamps: {
        fajr: rawTimes.fajr.getTime(),
        sunrise: rawTimes.sunrise.getTime(),
        dhuhr: rawTimes.dhuhr.getTime(),
        asr: rawTimes.asr.getTime(),
        maghrib: rawTimes.maghrib.getTime(),
        isha: rawTimes.isha.getTime(),
        qiyam: rawTimes.qiyam.getTime(),
      },
    });
  }

  return days;
}

/**
 * Saves the 3-day ahead prayer schedule to localStorage.
 * Keeps track of the last online sync timestamp.
 */
export function saveThreeDayPrayerSchedule(
  baseDate: Date,
  location: UserLocation,
  settings: CalculationSettings,
  hijriAdjustment = 0,
  markOnlineSync = false,
  customSyncTimestamp?: number
): ThreeDayPrayerCache {
  const days = buildThreeDayPrayerSchedule(baseDate, location, settings, hijriAdjustment);
  const now = Date.now();

  let lastOnlineSyncAt = now;
  if (customSyncTimestamp) {
    lastOnlineSyncAt = customSyncTimestamp;
  } else if (!markOnlineSync) {
    // Preserve existing sync timestamp if not explicitly marking online
    const saved = localStorage.getItem(LAST_ONLINE_SYNC_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0) {
        lastOnlineSyncAt = parsed;
      }
    }
  }

  const expiresAt = lastOnlineSyncAt + THREE_DAYS_MS;

  const cachePayload: ThreeDayPrayerCache = {
    savedAt: now,
    lastOnlineSyncAt,
    expiresAt,
    location,
    days,
    isDeviceTimeBased: true,
  };

  try {
    localStorage.setItem(PRAYER_CACHE_KEY, JSON.stringify(cachePayload));
    localStorage.setItem(LAST_ONLINE_SYNC_KEY, String(lastOnlineSyncAt));
  } catch (err) {
    console.error('Failed to save 3-day prayer cache in localStorage:', err);
  }

  return cachePayload;
}

/**
 * Loads the 3-day ahead cached prayer times from localStorage.
 * If cache is missing or outdated relative to today's date, recalculates while preserving sync time.
 */
export function loadThreeDayPrayerSchedule(
  baseDate: Date,
  location: UserLocation,
  settings: CalculationSettings,
  hijriAdjustment = 0
): ThreeDayPrayerCache {
  try {
    const saved = localStorage.getItem(PRAYER_CACHE_KEY);
    if (saved) {
      const parsed: ThreeDayPrayerCache = JSON.parse(saved);
      const todayKey = `${baseDate.getFullYear()}-${String(baseDate.getMonth() + 1).padStart(2, '0')}-${String(baseDate.getDate()).padStart(2, '0')}`;
      
      // Check if today is still the first day in cache (dayOffset 0)
      if (parsed.days && parsed.days.length > 0 && parsed.days[0].dateKey === todayKey) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading prayer cache:', err);
  }

  // If cache is empty or date shifted, recompute and save
  return saveThreeDayPrayerSchedule(baseDate, location, settings, hijriAdjustment, false);
}

/**
 * Checks whether 3 days have elapsed since the last online sync.
 */
export function checkThreeDaySyncStatus(customLastSync?: number): OfflinePrayerSyncStatus {
  let lastOnlineSyncAt = customLastSync;
  if (!lastOnlineSyncAt) {
    try {
      const saved = localStorage.getItem(LAST_ONLINE_SYNC_KEY);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > 0) {
          lastOnlineSyncAt = parsed;
        }
      }
    } catch {
      // ignore
    }
  }

  if (!lastOnlineSyncAt) {
    // Default to current time minus 1 hour if never synced before
    lastOnlineSyncAt = Date.now() - 3600000;
    try {
      localStorage.setItem(LAST_ONLINE_SYNC_KEY, String(lastOnlineSyncAt));
    } catch {
      // ignore
    }
  }

  const now = Date.now();
  const elapsedMs = Math.max(0, now - lastOnlineSyncAt);
  const isExpired = elapsedMs >= THREE_DAYS_MS;
  const remainingMs = Math.max(0, THREE_DAYS_MS - elapsedMs);
  const hoursRemaining = Math.max(0, Math.floor(remainingMs / (3600 * 1000)));
  const daysElapsed = Math.floor(elapsedMs / (24 * 3600 * 1000));
  const expiresAt = lastOnlineSyncAt + THREE_DAYS_MS;

  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  // Format date strings
  const lastUpdateDate = new Date(lastOnlineSyncAt);
  const expiresDate = new Date(expiresAt);

  const formatOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  };

  const lastUpdateFormatted = lastUpdateDate.toLocaleDateString(undefined, formatOptions);
  const expiresAtFormatted = expiresDate.toLocaleDateString(undefined, formatOptions);

  return {
    lastOnlineSyncAt,
    expiresAt,
    isExpired,
    elapsedMs,
    remainingMs,
    hoursRemaining,
    daysElapsed,
    lastUpdateFormatted,
    expiresAtFormatted,
    isOnline,
  };
}

/**
 * Resets/Refreshes the online sync timestamp to now.
 * Simulates or performs a fresh online verification of prayer times.
 */
export function refreshThreeDayOnlineSync(
  baseDate: Date,
  location: UserLocation,
  settings: CalculationSettings,
  hijriAdjustment = 0
): ThreeDayPrayerCache {
  return saveThreeDayPrayerSchedule(baseDate, location, settings, hijriAdjustment, true);
}

/**
 * Simulation tool: sets last online sync to 3 days and 2 hours ago.
 * Useful for verifying the prompt requiring internet connection after 3 days.
 */
export function simulateThreeDaysExpired(
  baseDate: Date,
  location: UserLocation,
  settings: CalculationSettings,
  hijriAdjustment = 0
): ThreeDayPrayerCache {
  const expiredTimestamp = Date.now() - (THREE_DAYS_MS + 2 * 3600 * 1000);
  return saveThreeDayPrayerSchedule(baseDate, location, settings, hijriAdjustment, false, expiredTimestamp);
}

/**
 * Returns detailed local device clock and timezone info
 * ensuring the app displays that it's synchronized with device hardware clock.
 */
export function getLocalDeviceClockInfo(): {
  timeZone: string;
  timeZoneOffsetMinutes: number;
  gmtString: string;
  isOnline: boolean;
} {
  const now = new Date();
  let timeZone = 'UTC';
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
  } catch {
    // fallback
  }

  const offsetMin = -now.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offsetMin) / 60);
  const offsetRemainderMin = Math.abs(offsetMin) % 60;
  const sign = offsetMin >= 0 ? '+' : '-';
  const gmtString = `GMT${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetRemainderMin).padStart(2, '0')}`;

  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  return {
    timeZone,
    timeZoneOffsetMinutes: offsetMin,
    gmtString,
    isOnline,
  };
}
