// Islamic Hijri Calendar calculations, Month Names & Live Google/Aladhan Regional Sync
import { UserLocation } from '../types';

export const HIJRI_MONTHS_EN = [
  'Muharram',
  'Safar',
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  'Jumada al-Ula',
  'Jumada al-Thaniyah',
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Dhu al-Qi'dah",
  'Dhu al-Hijjah',
];

export const HIJRI_MONTHS_AR = [
  'مُحَرَّم',
  'صَفَر',
  'رَبِيع الأَوَّل',
  'رَبِيع الآخِر',
  'جُمَادَى الأُولَى',
  'جُمَادَى الآخِرَة',
  'رَجَب',
  'شَعْبَان',
  'رَمَضَان',
  'شَوَّال',
  'ذُو القَعْدَة',
  'ذُو الحِجَّة',
];

export const HIJRI_MONTHS_UR = [
  'محرم الحرام',
  'صفر المظفر',
  'ربیع الاول',
  'ربیع الثانی',
  'جمادی الاول',
  'جمادی الثانی',
  'رجب المرجب',
  'شعبان المعظم',
  'رمضان المبارک',
  'شوال المکرم',
  'ذی القعدہ',
  'ذی الحجہ',
];

export interface HijriDate {
  day: number;
  month: number; // 1-12
  monthIndex: number; // 0-11
  monthNameEn: string;
  monthNameAr: string;
  monthNameUr: string;
  year: number;
  formattedEn: string;
  formattedAr: string;
  formattedUr: string;
  isSacredMonth: boolean; // Muharram, Rajab, Dhu al-Qi'dah, Dhu al-Hijjah
  isRamadan: boolean;
  source?: 'regional_ruet' | 'live_google_aladhan' | 'manual_offset' | 'calculated';
  offsetApplied?: number;
  isAfterMaghrib?: boolean; // True if Islamic day advanced after sunset
  sightingStandard?: string;
  locationCity?: string;
  locationCountry?: string;
}

export interface RegionalSightingInfo {
  offset: number;
  authority: string;
  zone: string;
}

// Estimate regional moon sighting offset and authority based on location
export function getRegionalSightingInfo(
  country = '',
  city = '',
  timezone = ''
): RegionalSightingInfo {
  const c = (country || '').toLowerCase().trim();
  const ct = (city || '').toLowerCase().trim();
  const tz = (timezone || '').toLowerCase().trim();

  // 1. Pakistan (Central Ruet-e-Hilal Committee) - typically 1 day after Umm al-Qura standard
  if (
    c.includes('pakistan') ||
    ct.includes('karachi') ||
    ct.includes('lahore') ||
    ct.includes('islamabad') ||
    ct.includes('rawalpindi') ||
    ct.includes('faisalabad') ||
    ct.includes('multan') ||
    ct.includes('peshawar') ||
    ct.includes('quetta') ||
    ct.includes('sialkot') ||
    ct.includes('gujranwala') ||
    ct.includes('hyderabad') ||
    tz.includes('karachi')
  ) {
    return {
      offset: -1,
      authority: 'Pakistan Central Ruet-e-Hilal Committee',
      zone: 'South Asia (Visual Sighting)',
    };
  }

  // 2. India (Central Moon Sighting Committee)
  if (
    c.includes('india') ||
    ct.includes('delhi') ||
    ct.includes('mumbai') ||
    ct.includes('hyderabad') ||
    ct.includes('bangalore') ||
    ct.includes('kolkata') ||
    ct.includes('chennai') ||
    tz.includes('kolkata') ||
    tz.includes('calcutta')
  ) {
    return {
      offset: -1,
      authority: 'Central Moon Sighting Committee of India (Ruet-e-Hilal)',
      zone: 'South Asia (Visual Sighting)',
    };
  }

  // 3. Bangladesh (National Moon Sighting Committee)
  if (
    c.includes('bangladesh') ||
    ct.includes('dhaka') ||
    ct.includes('chittagong') ||
    ct.includes('sylhet') ||
    tz.includes('dhaka')
  ) {
    return {
      offset: -1,
      authority: 'National Moon Sighting Committee of Bangladesh',
      zone: 'South Asia (Visual Sighting)',
    };
  }

  // 4. Morocco & Northwest Africa
  if (
    c.includes('morocco') ||
    ct.includes('casablanca') ||
    ct.includes('rabat') ||
    ct.includes('marrakech') ||
    ct.includes('fes') ||
    tz.includes('casablanca')
  ) {
    return {
      offset: -1,
      authority: 'Morocco Ministry of Habous & Islamic Affairs',
      zone: 'Northwest Africa (Visual Sighting)',
    };
  }

  // 5. Oman
  if (
    c.includes('oman') ||
    ct.includes('muscat') ||
    tz.includes('muscat')
  ) {
    return {
      offset: -1,
      authority: 'Oman Ministry of Endowments & Religious Affairs',
      zone: 'Arabian Sea (Visual Sighting)',
    };
  }

  // 6. Australia & New Zealand (ANIC & Moonsighting Australia)
  if (
    c.includes('australia') ||
    c.includes('new zealand') ||
    ct.includes('sydney') ||
    ct.includes('melbourne') ||
    ct.includes('brisbane') ||
    ct.includes('perth') ||
    ct.includes('adelaide') ||
    ct.includes('auckland') ||
    tz.includes('sydney') ||
    tz.includes('melbourne') ||
    tz.includes('auckland')
  ) {
    return {
      offset: -1,
      authority: 'Australian National Imams Council (ANIC) Visual Sighting',
      zone: 'Australasia (Visual Sighting)',
    };
  }

  // 7. Sri Lanka
  if (
    c.includes('sri lanka') ||
    ct.includes('colombo') ||
    tz.includes('colombo')
  ) {
    return {
      offset: -1,
      authority: 'Colombo Grand Mosque Hilal Committee',
      zone: 'South Asia (Visual Sighting)',
    };
  }

  // 8. South Africa
  if (
    c.includes('south africa') ||
    ct.includes('johannesburg') ||
    ct.includes('cape town') ||
    ct.includes('durban') ||
    tz.includes('johannesburg')
  ) {
    return {
      offset: -1,
      authority: 'United Ulama Council of South Africa (UUCSA)',
      zone: 'Southern Africa (Visual Sighting)',
    };
  }

  // 9. Saudi Arabia & Arabian Peninsula (Umm al-Qura standard)
  if (
    c.includes('saudi') ||
    ct.includes('makkah') ||
    ct.includes('madinah') ||
    ct.includes('riyadh') ||
    ct.includes('jeddah') ||
    tz.includes('riyadh')
  ) {
    return {
      offset: 0,
      authority: 'Umm al-Qura Calendar, Makkah al-Mukarramah',
      zone: 'Arabian Peninsula',
    };
  }

  // 10. UAE & Gulf
  if (
    c.includes('emirates') ||
    c.includes('uae') ||
    ct.includes('dubai') ||
    ct.includes('abu dhabi') ||
    ct.includes('sharjah') ||
    tz.includes('dubai')
  ) {
    return {
      offset: 0,
      authority: 'UAE General Authority of Islamic Affairs & Endowments',
      zone: 'Arabian Gulf',
    };
  }

  if (
    c.includes('qatar') ||
    c.includes('kuwait') ||
    c.includes('bahrain') ||
    ct.includes('doha') ||
    ct.includes('manama')
  ) {
    return {
      offset: 0,
      authority: 'Gulf Regional Moon Sighting Standard',
      zone: 'Arabian Gulf',
    };
  }

  // 11. Turkey
  if (
    c.includes('turkey') ||
    ct.includes('istanbul') ||
    ct.includes('ankara') ||
    tz.includes('istanbul')
  ) {
    return {
      offset: 0,
      authority: 'Diyanet İşleri Başkanlığı (Turkey)',
      zone: 'Southeastern Europe & Anatolia',
    };
  }

  // 12. Egypt
  if (
    c.includes('egypt') ||
    ct.includes('cairo') ||
    ct.includes('alexandria') ||
    tz.includes('cairo')
  ) {
    return {
      offset: 0,
      authority: 'Dar al-Ifta al-Misriyyah (Egypt)',
      zone: 'North Africa & Levant',
    };
  }

  // 13. United States & Canada
  if (
    c.includes('united states') ||
    c.includes('usa') ||
    c.includes('canada') ||
    ct.includes('new york') ||
    ct.includes('chicago') ||
    ct.includes('toronto') ||
    ct.includes('los angeles') ||
    tz.includes('new_york') ||
    tz.includes('chicago') ||
    tz.includes('toronto') ||
    tz.includes('los_angeles')
  ) {
    return {
      offset: 0,
      authority: 'Fiqh Council of North America (FCNA) / ISNA Standard',
      zone: 'North America',
    };
  }

  // 14. United Kingdom & Western Europe
  if (
    c.includes('united kingdom') ||
    c.includes('uk') ||
    c.includes('britain') ||
    ct.includes('london') ||
    ct.includes('manchester') ||
    ct.includes('birmingham') ||
    tz.includes('london')
  ) {
    return {
      offset: 0,
      authority: 'UK Islamic Calendar & Central Mosques Standard',
      zone: 'Western Europe',
    };
  }

  // Default international standard
  return {
    offset: 0,
    authority: `${country || 'Local'} Sighting Standard`,
    zone: 'Global Standard',
  };
}

export function getRegionalDefaultHijriOffset(country = '', city = '', timezone = ''): number {
  return getRegionalSightingInfo(country, city, timezone).offset;
}

// Approximate Sunset / Maghrib hour helper for location
function isTimeAfterSunset(date: Date, latitude?: number, longitude?: number): boolean {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    // Fallback: estimate sunset around 6:15 PM (18:15) local time
    const h = date.getHours();
    const m = date.getMinutes();
    return h > 18 || (h === 18 && m >= 15);
  }

  try {
    // Solar declination approximation
    const dayOfYear = Math.floor(
      (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    const declination = 23.45 * Math.sin(((360 / 365) * (dayOfYear - 81) * Math.PI) / 180);
    const latRad = (latitude * Math.PI) / 180;
    const decRad = (declination * Math.PI) / 180;

    // Hour angle at sunset (-0.833 degrees refraction)
    const cosH =
      (Math.sin((-0.833 * Math.PI) / 180) - Math.sin(latRad) * Math.sin(decRad)) /
      (Math.cos(latRad) * Math.cos(decRad));

    if (cosH >= -1 && cosH <= 1) {
      const H = (Math.acos(cosH) * 180) / Math.PI;
      const sunsetHours = 12 + H / 15; // Solar sunset in solar hours
      // Approximate local civil hour for sunset (typically between 17:30 and 19:30)
      const currentCivilHour = date.getHours() + date.getMinutes() / 60;
      return currentCivilHour >= sunsetHours || currentCivilHour >= 18.25;
    }
  } catch {
    // Ignore error
  }

  const h = date.getHours();
  return h >= 18; // Default 6 PM
}

// Convert Gregorian Date to Hijri Date accurately with location-based sighting authority & sunset transition
export function getHijriDate(
  date: Date = new Date(),
  dayAdjustment = 0,
  countryOrLocation?: string | UserLocation,
  city = 'Karachi',
  overrideMaghribPassed?: boolean
): HijriDate {
  let country = 'Pakistan';
  let cityName = city;
  let timezone = '';
  let lat: number | undefined;
  let lng: number | undefined;

  if (typeof countryOrLocation === 'object' && countryOrLocation !== null) {
    country = countryOrLocation.country || 'Pakistan';
    cityName = countryOrLocation.city || 'Karachi';
    timezone = countryOrLocation.timezone || '';
    lat = countryOrLocation.latitude;
    lng = countryOrLocation.longitude;
  } else if (typeof countryOrLocation === 'string') {
    country = countryOrLocation;
  }

  // Get regional sighting metadata
  const sightingInfo = getRegionalSightingInfo(country, cityName, timezone);
  const regionalOffset = sightingInfo.offset;
  const baseAdjustment = dayAdjustment !== 0 ? dayAdjustment : regionalOffset;

  // In Islamic tradition, the spiritual night begins at sunset (Maghrib).
  // However, for civil calendars, public datekeeping in Pakistan, and daily scheduling,
  // the Islamic date corresponds to the day's date (e.g. 25 Rabi al-Thani) throughout the day & evening.
  const isAfterMaghrib =
    overrideMaghribPassed !== undefined ? overrideMaghribPassed : isTimeAfterSunset(date, lat, lng);

  // We maintain the civil Hijri date for the 24-hour day (baseAdjustment gives 25 Rabi al-Thani in Pakistan).
  // isAfterMaghrib is provided as metadata so the UI can optionally display the night status without jumping the day number.
  const effectiveAdjustment = baseAdjustment;

  // Use Intl.DateTimeFormat with islamic-umalqura calendar
  try {
    const adjustedDate = new Date(date);
    if (effectiveAdjustment !== 0) {
      adjustedDate.setDate(adjustedDate.getDate() + effectiveAdjustment);
    }

    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });

    const parts = formatter.formatToParts(adjustedDate);
    let day = 1;
    let month = 1;
    let year = 1448;

    for (const part of parts) {
      if (part.type === 'day') day = parseInt(part.value, 10);
      if (part.type === 'month') month = parseInt(part.value, 10);
      if (part.type === 'year') year = parseInt(part.value, 10);
    }

    const monthIndex = Math.max(0, Math.min(11, month - 1));
    const monthNameEn = HIJRI_MONTHS_EN[monthIndex];
    const monthNameAr = HIJRI_MONTHS_AR[monthIndex];
    const monthNameUr = HIJRI_MONTHS_UR[monthIndex];

    const isSacredMonth = [0, 6, 10, 11].includes(monthIndex); // Muharram, Rajab, Dhul Qadah, Dhul Hijjah
    const isRamadan = monthIndex === 8;

    return {
      day,
      month: monthIndex + 1,
      monthIndex,
      monthNameEn,
      monthNameAr,
      monthNameUr,
      year,
      formattedEn: `${day} ${monthNameEn} ${year} AH`,
      formattedAr: `${day} ${monthNameAr} ${year} هـ`,
      formattedUr: `${day} ${monthNameUr} ${year}ھ`,
      isSacredMonth,
      isRamadan,
      offsetApplied: effectiveAdjustment,
      isAfterMaghrib,
      sightingStandard: sightingInfo.authority,
      locationCity: cityName,
      locationCountry: country,
      source: dayAdjustment !== 0 ? 'manual_offset' : regionalOffset !== 0 ? 'regional_ruet' : 'calculated',
    };
  } catch (e) {
    // Mathematical algorithm fallback (Kuwaiti / Tabular algorithm)
    const adjustedDate = new Date(date);
    if (effectiveAdjustment !== 0) {
      adjustedDate.setDate(adjustedDate.getDate() + effectiveAdjustment);
    }

    let y = adjustedDate.getFullYear();
    let m = adjustedDate.getMonth();
    const d = adjustedDate.getDate();

    if (m < 2) {
      y -= 1;
      m += 12;
    }

    const a = Math.floor(y / 100);
    const b = 2 - a + Math.floor(a / 4);
    const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5;

    const epoch = 1948439.5;
    const l = Math.floor(jd - epoch);
    const n = Math.floor((30 * l + 10646) / 10631);
    const year = n;
    const month = Math.min(12, Math.ceil((l - 29 - Math.floor((year * 10631 - 10646) / 30)) / 29.5) + 1);
    const day = Math.floor(l - Math.floor((year * 10631 - 10646) / 30) - Math.floor((month - 1) * 29.5)) + 1;

    const monthIndex = Math.max(0, Math.min(11, month - 1));

    return {
      day,
      month: monthIndex + 1,
      monthIndex,
      monthNameEn: HIJRI_MONTHS_EN[monthIndex],
      monthNameAr: HIJRI_MONTHS_AR[monthIndex],
      monthNameUr: HIJRI_MONTHS_UR[monthIndex],
      year,
      formattedEn: `${day} ${HIJRI_MONTHS_EN[monthIndex]} ${year} AH`,
      formattedAr: `${day} ${HIJRI_MONTHS_AR[monthIndex]} ${year} هـ`,
      formattedUr: `${day} ${HIJRI_MONTHS_UR[monthIndex]} ${year}ھ`,
      isSacredMonth: [0, 6, 10, 11].includes(monthIndex),
      isRamadan: monthIndex === 8,
      offsetApplied: effectiveAdjustment,
      isAfterMaghrib,
      sightingStandard: sightingInfo.authority,
      locationCity: cityName,
      locationCountry: country,
      source: 'calculated',
    };
  }
}

// Fetch live local Islamic Hijri date from Aladhan / Google Calendar API
export async function fetchLiveHijriDate(
  date: Date = new Date(),
  location?: UserLocation,
  dayAdjustment = 0
): Promise<HijriDate | null> {
  const country = location?.country || 'Pakistan';
  const city = location?.city || 'Karachi';
  const timezone = location?.timezone || '';

  const dayStr = String(date.getDate()).padStart(2, '0');
  const monthStr = String(date.getMonth() + 1).padStart(2, '0');
  const yearStr = date.getFullYear();
  const dateFormatted = `${dayStr}-${monthStr}-${yearStr}`;

  const sightingInfo = getRegionalSightingInfo(country, city, timezone);
  const regionalOffset = sightingInfo.offset;
  const baseAdjustment = dayAdjustment !== 0 ? dayAdjustment : regionalOffset;

  const isAfterMaghrib = isTimeAfterSunset(date, location?.latitude, location?.longitude);
  const effectiveAdjustment = baseAdjustment + (isAfterMaghrib ? 1 : 0);

  const cacheKey = `hijri_live_${country}_${city}_${dateFormatted}_${effectiveAdjustment}_${isAfterMaghrib ? 'pm' : 'am'}`;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached) as HijriDate;
    }
  } catch {
    // Ignore storage error
  }

  try {
    // Try Aladhan gToH API with adjustment
    const url = `https://api.aladhan.com/v1/gToH/${dateFormatted}?adjustment=${effectiveAdjustment}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      const h = json.data?.hijri;
      if (h && h.day && h.month) {
        const day = parseInt(h.day, 10);
        const monthNum = parseInt(h.month.number, 10);
        const monthIndex = Math.max(0, Math.min(11, monthNum - 1));
        const year = parseInt(h.year, 10);

        const monthNameEn = HIJRI_MONTHS_EN[monthIndex];
        const monthNameAr = HIJRI_MONTHS_AR[monthIndex];
        const monthNameUr = HIJRI_MONTHS_UR[monthIndex];

        const isSacredMonth = [0, 6, 10, 11].includes(monthIndex);
        const isRamadan = monthIndex === 8;

        const result: HijriDate = {
          day,
          month: monthIndex + 1,
          monthIndex,
          monthNameEn,
          monthNameAr,
          monthNameUr,
          year,
          formattedEn: `${day} ${monthNameEn} ${year} AH`,
          formattedAr: `${day} ${monthNameAr} ${year} هـ`,
          formattedUr: `${day} ${monthNameUr} ${year}ھ`,
          isSacredMonth,
          isRamadan,
          isAfterMaghrib,
          sightingStandard: sightingInfo.authority,
          locationCity: city,
          locationCountry: country,
          source: 'live_google_aladhan',
          offsetApplied: effectiveAdjustment,
        };

        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(result));
        } catch {
          // Ignore
        }

        return result;
      }
    }
  } catch (err) {
    // Fallback to local calculated
  }

  return getHijriDate(date, dayAdjustment, location || country, city, isAfterMaghrib);
}
