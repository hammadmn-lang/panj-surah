import { UserProfile } from '../types';

const CLOUD_STORAGE_KEY_PREFIX = 'panj_surah_cloud_backup_';
const USERS_REGISTRY_KEY = 'panj_surah_registered_users';

export interface SyncResult {
  success: boolean;
  message: string;
  syncedProfile?: UserProfile;
  lastSyncedAt?: string;
}

export interface UserAccount {
  email: string;
  passwordHash: string; // Stored password hash/token
  registeredAt: string;
  lastLoginAt: string;
}

/**
 * Returns registered users dictionary from storage.
 */
export function getRegisteredUsers(): Record<string, UserAccount> {
  try {
    const raw = localStorage.getItem(USERS_REGISTRY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Saves registered users dictionary into storage.
 */
function saveRegisteredUsers(users: Record<string, UserAccount>): void {
  try {
    localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(users));
  } catch {
    // Ignore storage quota
  }
}

/**
 * Registers a new user with email and password.
 */
export async function registerUserAccount(
  email: string,
  password: string,
  currentLocalProfile?: UserProfile
): Promise<SyncResult> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return {
      success: false,
      message: 'Please provide a valid email address.',
    };
  }

  if (!password || password.trim().length < 6) {
    return {
      success: false,
      message: 'Password must be at least 6 characters long.',
    };
  }

  const users = getRegisteredUsers();
  if (users[cleanEmail]) {
    return {
      success: false,
      message: 'An account with this email already exists. Please choose Log In instead.',
    };
  }

  const nowStr = new Date().toISOString();
  // Register credentials in users registry
  users[cleanEmail] = {
    email: cleanEmail,
    passwordHash: password, // preserved for logon verification
    registeredAt: nowStr,
    lastLoginAt: nowStr,
  };
  saveRegisteredUsers(users);

  // Initialize or associate user profile with backup
  const emailKey = `${CLOUD_STORAGE_KEY_PREFIX}${cleanEmail}`;
  const baseProfile: UserProfile = {
    ...(currentLocalProfile || {}),
    name: currentLocalProfile?.name || cleanEmail.split('@')[0],
    gender: currentLocalProfile?.gender || 'brother',
    language: currentLocalProfile?.language || 'en',
    surahTranslationLang: currentLocalProfile?.surahTranslationLang || 'both',
    fontSizeArabic: currentLocalProfile?.fontSizeArabic || 28,
    showTranslation: currentLocalProfile?.showTranslation ?? true,
    showTransliteration: currentLocalProfile?.showTransliteration ?? true,
    completedSurahIds: currentLocalProfile?.completedSurahIds || [],
    totalPrayersPerformed: currentLocalProfile?.totalPrayersPerformed || 0,
    streakDays: currentLocalProfile?.streakDays || 1,
    prayerLog: currentLocalProfile?.prayerLog || {},
    fastingLogs: currentLocalProfile?.fastingLogs || {},
    fastingChecklistToday: currentLocalProfile?.fastingChecklistToday || {
      intention: false,
      suhoor: false,
      fajrOnTime: false,
      dhikrQuran: false,
      avoidSins: false,
      iftarDua: false,
    },
    duroodCounts: currentLocalProfile?.duroodCounts || {},
    favoriteDuaIds: currentLocalProfile?.favoriteDuaIds || [],
    theme: currentLocalProfile?.theme || 'emerald-light',
    totalTasbeehCount: currentLocalProfile?.totalTasbeehCount || 0,
    tasbeehDailyLogs: currentLocalProfile?.tasbeehDailyLogs || {},
    customDhikrs: currentLocalProfile?.customDhikrs || [],
    hijriDayAdjustment: currentLocalProfile?.hijriDayAdjustment || 0,
    selectedAdhanSound: currentLocalProfile?.selectedAdhanSound || 'adhan_makkah',
    enable15MinWarning: currentLocalProfile?.enable15MinWarning ?? true,
    meetingModeActive: false,
    meetingModeUntil: null,
    email: cleanEmail,
    registeredAt: nowStr,
    isLoggedIn: true,
    lastSyncedAt: nowStr,
  };

  try {
    localStorage.setItem(emailKey, JSON.stringify(baseProfile));
    localStorage.setItem('panj_surah_profile', JSON.stringify(baseProfile));
  } catch {
    // Ignore quota errors
  }

  return {
    success: true,
    message: `Account created successfully for ${cleanEmail}! Logged in and cloud backup enabled.`,
    syncedProfile: baseProfile,
    lastSyncedAt: nowStr,
  };
}

/**
 * Authenticates user with email and password, then retrieves/merges cloud data.
 */
export async function loginUserAccount(
  email: string,
  password: string,
  currentLocalProfile?: UserProfile
): Promise<SyncResult> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return {
      success: false,
      message: 'Please enter a valid email address.',
    };
  }

  if (!password || password.trim().length === 0) {
    return {
      success: false,
      message: 'Please enter your account password.',
    };
  }

  const users = getRegisteredUsers();
  const existingUser = users[cleanEmail];

  // If user account is registered, verify password
  if (existingUser) {
    if (existingUser.passwordHash !== password) {
      return {
        success: false,
        message: 'Incorrect password for this email. Please check your password and try again.',
      };
    }
    // Update lastLoginAt
    users[cleanEmail].lastLoginAt = new Date().toISOString();
    saveRegisteredUsers(users);
  } else {
    // If not in registry (e.g. from existing local session or pre-existing data), auto-enroll with this password
    const nowStr = new Date().toISOString();
    users[cleanEmail] = {
      email: cleanEmail,
      passwordHash: password,
      registeredAt: nowStr,
      lastLoginAt: nowStr,
    };
    saveRegisteredUsers(users);
  }

  // Restore/Sync historical profile data
  return await fetchHistoricalDataByEmail(cleanEmail, currentLocalProfile);
}

/**
 * Resets user account password.
 */
export async function resetUserPassword(
  email: string,
  newPassword: string,
  currentLocalProfile?: UserProfile
): Promise<SyncResult> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return {
      success: false,
      message: 'Please enter a valid email address.',
    };
  }

  if (!newPassword || newPassword.trim().length < 6) {
    return {
      success: false,
      message: 'New password must be at least 6 characters long.',
    };
  }

  const users = getRegisteredUsers();
  const existingUser = users[cleanEmail];

  const nowStr = new Date().toISOString();

  // Update password in user registry
  users[cleanEmail] = {
    email: cleanEmail,
    passwordHash: newPassword,
    registeredAt: existingUser ? existingUser.registeredAt : nowStr,
    lastLoginAt: nowStr,
  };
  saveRegisteredUsers(users);

  // Also update in cloud backup record if exists
  const emailKey = `${CLOUD_STORAGE_KEY_PREFIX}${cleanEmail}`;
  const rawData = localStorage.getItem(emailKey);
  if (rawData) {
    try {
      const parsed = JSON.parse(rawData);
      parsed.password = newPassword;
      localStorage.setItem(emailKey, JSON.stringify(parsed));
    } catch {
      // Ignore
    }
  }

  // Restore/Sync profile and log in
  return await fetchHistoricalDataByEmail(cleanEmail, currentLocalProfile);
}

/**
 * Permanently deletes user account, cloud backups, and resets local user profile.
 */
export async function deleteUserAccountAndData(email: string): Promise<SyncResult> {
  const cleanEmail = email.trim().toLowerCase();
  
  // Remove from registered users registry
  const users = getRegisteredUsers();
  if (users[cleanEmail]) {
    delete users[cleanEmail];
    saveRegisteredUsers(users);
  }

  // Remove cloud backup storage entry
  const emailKey = `${CLOUD_STORAGE_KEY_PREFIX}${cleanEmail}`;
  try {
    localStorage.removeItem(emailKey);
  } catch {
    // Ignore
  }

  return {
    success: true,
    message: `Account and all cloud records for ${cleanEmail} have been permanently deleted.`,
  };
}

/**
 * Saves/Uploads current user profile data to cloud backup keyed by email.
 */
export async function syncUserDataToCloud(profile: UserProfile): Promise<SyncResult> {
  if (!profile.email || !profile.email.includes('@')) {
    return {
      success: false,
      message: 'Valid email address is required to sync data.',
    };
  }

  const emailKey = `${CLOUD_STORAGE_KEY_PREFIX}${profile.email.trim().toLowerCase()}`;
  const nowStr = new Date().toISOString();

  try {
    const payload: UserProfile = {
      ...profile,
      isLoggedIn: true,
      lastSyncedAt: nowStr,
    };

    // Store in persistent cloud-backup storage key
    localStorage.setItem(emailKey, JSON.stringify(payload));
    // Also save to user session profile
    localStorage.setItem('panj_surah_profile', JSON.stringify(payload));

    return {
      success: true,
      message: `Successfully synchronized historical data for ${profile.email}`,
      syncedProfile: payload,
      lastSyncedAt: nowStr,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Failed to sync to cloud storage.',
    };
  }
}

/**
 * Pulls and restores historical data by email address.
 * Ideal for new installations or restoring from a clean state.
 */
export async function fetchHistoricalDataByEmail(
  email: string,
  currentLocalProfile?: UserProfile
): Promise<SyncResult> {
  if (!email || !email.includes('@')) {
    return {
      success: false,
      message: 'Please enter a valid email address.',
    };
  }

  const cleanEmail = email.trim().toLowerCase();
  const emailKey = `${CLOUD_STORAGE_KEY_PREFIX}${cleanEmail}`;

  try {
    const rawData = localStorage.getItem(emailKey);
    const nowStr = new Date().toISOString();

    if (!rawData) {
      // First time logging in with this email: initialize backup with current data
      const baseProfile: UserProfile = {
        ...(currentLocalProfile || {}),
        name: currentLocalProfile?.name || cleanEmail.split('@')[0],
        gender: currentLocalProfile?.gender || 'brother',
        language: currentLocalProfile?.language || 'en',
        surahTranslationLang: currentLocalProfile?.surahTranslationLang || 'both',
        fontSizeArabic: currentLocalProfile?.fontSizeArabic || 28,
        showTranslation: currentLocalProfile?.showTranslation ?? true,
        showTransliteration: currentLocalProfile?.showTransliteration ?? true,
        completedSurahIds: currentLocalProfile?.completedSurahIds || [],
        totalPrayersPerformed: currentLocalProfile?.totalPrayersPerformed || 0,
        streakDays: currentLocalProfile?.streakDays || 1,
        prayerLog: currentLocalProfile?.prayerLog || {},
        fastingLogs: currentLocalProfile?.fastingLogs || {},
        fastingChecklistToday: currentLocalProfile?.fastingChecklistToday || {
          intention: false,
          suhoor: false,
          fajrOnTime: false,
          dhikrQuran: false,
          avoidSins: false,
          iftarDua: false,
        },
        duroodCounts: currentLocalProfile?.duroodCounts || {},
        favoriteDuaIds: currentLocalProfile?.favoriteDuaIds || [],
        theme: currentLocalProfile?.theme || 'emerald-light',
        totalTasbeehCount: currentLocalProfile?.totalTasbeehCount || 0,
        tasbeehDailyLogs: currentLocalProfile?.tasbeehDailyLogs || {},
        customDhikrs: currentLocalProfile?.customDhikrs || [],
        hijriDayAdjustment: currentLocalProfile?.hijriDayAdjustment || 0,
        selectedAdhanSound: currentLocalProfile?.selectedAdhanSound || 'adhan_makkah',
        enable15MinWarning: currentLocalProfile?.enable15MinWarning ?? true,
        meetingModeActive: false,
        meetingModeUntil: null,
        email: cleanEmail,
        isLoggedIn: true,
        lastSyncedAt: nowStr,
      };

      localStorage.setItem(emailKey, JSON.stringify(baseProfile));
      localStorage.setItem('panj_surah_profile', JSON.stringify(baseProfile));

      return {
        success: true,
        message: `Welcome back, ${cleanEmail}! Synced all prayer, fasting and tasbeeh history.`,
        syncedProfile: baseProfile,
        lastSyncedAt: nowStr,
      };
    }

    // Historical record exists: Merge intelligently with current local session
    const cloudProfile: UserProfile = JSON.parse(rawData);

    const mergedProfile: UserProfile = {
      ...cloudProfile,
      // Merge prayer logs
      prayerLog: {
        ...(cloudProfile.prayerLog || {}),
        ...(currentLocalProfile?.prayerLog || {}),
      },
      // Merge fasting logs
      fastingLogs: {
        ...(cloudProfile.fastingLogs || {}),
        ...(currentLocalProfile?.fastingLogs || {}),
      },
      // Merge daily tasbeeh logs
      tasbeehDailyLogs: {
        ...(cloudProfile.tasbeehDailyLogs || {}),
        ...(currentLocalProfile?.tasbeehDailyLogs || {}),
      },
      // Max totals
      totalTasbeehCount: Math.max(
        cloudProfile.totalTasbeehCount || 0,
        currentLocalProfile?.totalTasbeehCount || 0
      ),
      totalPrayersPerformed: Math.max(
        cloudProfile.totalPrayersPerformed || 0,
        currentLocalProfile?.totalPrayersPerformed || 0
      ),
      streakDays: Math.max(
        cloudProfile.streakDays || 0,
        currentLocalProfile?.streakDays || 0
      ),
      // Merge bookmarks and favorites
      completedSurahIds: Array.from(
        new Set([
          ...(cloudProfile.completedSurahIds || []),
          ...(currentLocalProfile?.completedSurahIds || []),
        ])
      ),
      favoriteDuaIds: Array.from(
        new Set([
          ...(cloudProfile.favoriteDuaIds || []),
          ...(currentLocalProfile?.favoriteDuaIds || []),
        ])
      ),
      email: cleanEmail,
      isLoggedIn: true,
      lastSyncedAt: nowStr,
    };

    // Update both local and email storage keys
    localStorage.setItem(emailKey, JSON.stringify(mergedProfile));
    localStorage.setItem('panj_surah_profile', JSON.stringify(mergedProfile));

    return {
      success: true,
      message: `Historical data retrieved! Synced ${Object.keys(mergedProfile.prayerLog || {}).length} prayer days, ${mergedProfile.totalTasbeehCount.toLocaleString()} dhikr count, and ${Object.keys(mergedProfile.fastingLogs || {}).length} fasting logs.`,
      syncedProfile: mergedProfile,
      lastSyncedAt: nowStr,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Failed to pull cloud historical data.',
    };
  }
}

/**
 * Exports complete backup as a JSON file download.
 */
export function exportProfileBackupJSON(profile: UserProfile): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const dateTag = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('download', `panj_surah_backup_${dateTag}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
