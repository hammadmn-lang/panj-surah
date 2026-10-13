import { CalculationMethodKey, CalculationSettings, JuristicMethod, PrayerItem, PrayerKey, UserLocation } from '../types';

// Constants
const MAKKAH_LAT = 21.422487;
const MAKKAH_LNG = 39.826206;

// Calculation Method parameters
interface MethodParams {
  fajrAngle: number;
  ishaAngle?: number;
  ishaInterval?: number; // in minutes after Maghrib (e.g. Makkah: 90min)
  maghribAngle?: number;
}

export const CALCULATION_METHODS: Record<CalculationMethodKey, { name: string; desc: string; params: MethodParams }> = {
  MWL: {
    name: 'Muslim World League',
    desc: 'Fajr 18°, Isha 17° (Europe, Far East, parts of America)',
    params: { fajrAngle: 18, ishaAngle: 17 },
  },
  ISNA: {
    name: 'Islamic Society of North America (ISNA)',
    desc: 'Fajr 15°, Isha 15° (North America: US & Canada)',
    params: { fajrAngle: 15, ishaAngle: 15 },
  },
  Egypt: {
    name: 'Egyptian General Authority of Survey',
    desc: 'Fajr 19.5°, Isha 17.5° (Africa, Syria, Iraq, Lebanon, Malaysia)',
    params: { fajrAngle: 19.5, ishaAngle: 17.5 },
  },
  Makkah: {
    name: 'Umm Al-Qura University, Makkah',
    desc: 'Fajr 18.5°, Isha 90 min after Maghrib (Arabian Peninsula)',
    params: { fajrAngle: 18.5, ishaInterval: 90 },
  },
  Karachi: {
    name: 'University of Islamic Sciences, Karachi',
    desc: 'Fajr 18°, Isha 18° (Pakistan, India, Bangladesh, Afghanistan)',
    params: { fajrAngle: 18, ishaAngle: 18 },
  },
  Tehran: {
    name: 'Institute of Geophysics, University of Tehran',
    desc: 'Fajr 17.7°, Isha 14°, Maghrib 4.5° (Shia Ithna Ashari)',
    params: { fajrAngle: 17.7, ishaAngle: 14, maghribAngle: 4.5 },
  },
  Gulf: {
    name: 'Gulf Region',
    desc: 'Fajr 19.5°, Isha 90 min after Maghrib',
    params: { fajrAngle: 19.5, ishaInterval: 90 },
  },
  Singapore: {
    name: 'Majlis Ugama Islam Singapura',
    desc: 'Fajr 20°, Isha 18°',
    params: { fajrAngle: 20, ishaAngle: 18 },
  },
  Turkey: {
    name: 'Diyanet İşleri Başkanlığı (Turkey)',
    desc: 'Fajr 18°, Isha 17°',
    params: { fajrAngle: 18, ishaAngle: 17 },
  },
};

// Math helpers in degrees
const d2r = (d: number) => (d * Math.PI) / 180.0;
const r2d = (r: number) => (r * 180.0) / Math.PI;
const sinD = (d: number) => Math.sin(d2r(d));
const cosD = (d: number) => Math.cos(d2r(d));
const tanD = (d: number) => Math.tan(d2r(d));
const asinD = (x: number) => r2d(Math.asin(x));
const acosD = (x: number) => r2d(Math.acos(x));
const atan2D = (y: number, x: number) => r2d(Math.atan2(y, x));

// Julian Day & Solar coordinates
function julianDay(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

function sunCoordinates(d: number): { declination: number; equationOfTime: number } {
  const D = d - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * sinD(g) + 0.02 * sinD(2 * g));
  const e = 23.439 - 0.00000036 * D;

  const RA = atan2D(cosD(e) * sinD(L), cosD(L)) / 15.0;
  const declination = asinD(sinD(e) * sinD(L));
  const equationOfTime = q / 15.0 - fixHour(RA);

  return { declination, equationOfTime };
}

function fixAngle(a: number): number {
  a = a - 360.0 * Math.floor(a / 360.0);
  return a < 0 ? a + 360.0 : a;
}

function fixHour(h: number): number {
  h = h - 24.0 * Math.floor(h / 24.0);
  return h < 0 ? h + 24.0 : h;
}

// Compute hour angle for sun elevation
function hourAngle(alpha: number, lat: number, dec: number): number {
  const cosH = (sinD(alpha) - sinD(lat) * sinD(dec)) / (cosD(lat) * cosD(dec));
  if (cosH > 1) return 0; // Sun never reaches angle
  if (cosH < -1) return 180; // Sun always below angle
  return acosD(cosH);
}

// Compute Asr hour angle given shadow length factor (1 for Standard, 2 for Hanafi)
function asrHourAngle(factor: number, lat: number, dec: number): number {
  // Sun elevation at Asr is positive (above horizon): arccot(factor + tan|lat - dec|)
  const shadowAngle = r2d(Math.atan(1 / (factor + tanD(Math.abs(lat - dec)))));
  return hourAngle(shadowAngle, lat, dec);
}

// Location Timezone Offset Helper
export function getLocationTimezoneOffsetHours(location: UserLocation, date: Date): number {
  if (
    location.timezone === 'Asia/Karachi' ||
    location.city?.toLowerCase() === 'lahore' ||
    location.city?.toLowerCase() === 'karachi' ||
    location.city?.toLowerCase() === 'islamabad' ||
    location.country?.toLowerCase() === 'pakistan'
  ) {
    return 5.0; // Pakistan Standard Time is UTC+5 year-round
  }
  if (location.timezone) {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: location.timezone,
        timeZoneName: 'shortOffset',
      });
      const parts = formatter.formatToParts(date);
      const tzPart = parts.find((p) => p.type === 'timeZoneName')?.value;
      if (tzPart) {
        const match = tzPart.match(/(?:GMT|UTC)([+-])(\d+)(?::(\d+))?/);
        if (match) {
          const sign = match[1] === '-' ? -1 : 1;
          const h = parseInt(match[2], 10);
          const m = match[3] ? parseInt(match[3], 10) : 0;
          return sign * (h + m / 60);
        }
      }
    } catch {
      // fallback
    }
  }
  return -date.getTimezoneOffset() / 60;
}

export function computePrayerTimes(
  date: Date,
  location: UserLocation,
  settings: CalculationSettings
): {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
  qiyam: Date;
} {
  const targetOffsetHours = getLocationTimezoneOffsetHours(location, date);
  const tz = location.timezone || (location.country?.toLowerCase().includes('pakistan') ? 'Asia/Karachi' : undefined);

  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (tz) {
    try {
      const fmt = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
      const parts = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]));
      if (parts.year && parts.month && parts.day) {
        year = parseInt(parts.year, 10);
        month = parseInt(parts.month, 10);
        day = parseInt(parts.day, 10);
      }
    } catch {
      // fallback
    }
  }

  const jd = julianDay(year, month, day);
  const { declination, equationOfTime } = sunCoordinates(jd);

  const methodConfig = CALCULATION_METHODS[settings.method] || CALCULATION_METHODS.MWL;
  const fajrAngle = -(settings.fajrAngle ?? methodConfig.params.fajrAngle);
  const ishaAngle = methodConfig.params.ishaAngle ? -(settings.ishaAngle ?? methodConfig.params.ishaAngle) : null;
  const maghribAngle = methodConfig.params.maghribAngle ? -methodConfig.params.maghribAngle : -0.833; // standard refraction

  // Midday (Dhuhr in target timezone civil hours)
  const dhuhrBase = fixHour(12 + targetOffsetHours - location.longitude / 15.0 - equationOfTime);

  // Fajr
  const fajrHA = hourAngle(fajrAngle, location.latitude, declination);
  const fajrBase = fixHour(dhuhrBase - fajrHA / 15.0);

  // Sunrise
  const sunriseHA = hourAngle(-0.833, location.latitude, declination);
  const sunriseBase = fixHour(dhuhrBase - sunriseHA / 15.0);

  // Asr
  const asrFactor = settings.juristic === 'hanafi' ? 2 : 1;
  const asrHA = asrHourAngle(asrFactor, location.latitude, declination);
  const asrBase = fixHour(dhuhrBase + asrHA / 15.0);

  // Maghrib (Sunset)
  const maghribHA = hourAngle(maghribAngle, location.latitude, declination);
  const maghribBase = fixHour(dhuhrBase + maghribHA / 15.0);

  // Isha
  let ishaBase: number;
  if (methodConfig.params.ishaInterval) {
    ishaBase = fixHour(maghribBase + methodConfig.params.ishaInterval / 60.0);
  } else if (ishaAngle !== null) {
    const ishaHA = hourAngle(ishaAngle, location.latitude, declination);
    ishaBase = fixHour(dhuhrBase + ishaHA / 15.0);
  } else {
    ishaBase = fixHour(maghribBase + 1.5);
  }

  // Create absolute Date objects in UTC matching the target timezone instant
  const makeDate = (hoursFraction: number, adjustmentMinutes: number) => {
    const totalMinutes = hoursFraction * 60 + adjustmentMinutes;
    const h = Math.floor(totalMinutes / 60);
    const m = Math.floor(totalMinutes % 60);
    const s = Math.floor((totalMinutes * 60) % 60);
    
    // Exact absolute timestamp calculated by offsetting local civil time back to UTC
    const utcTimestamp = Date.UTC(year, month - 1, day, h, m, s) - targetOffsetHours * 3600 * 1000;
    return new Date(utcTimestamp);
  };

  const fajr = makeDate(fajrBase, settings.adjustments.fajr);
  const sunrise = makeDate(sunriseBase, settings.adjustments.sunrise);
  const dhuhr = makeDate(dhuhrBase, settings.adjustments.dhuhr);
  const asr = makeDate(asrBase, settings.adjustments.asr);
  const maghrib = makeDate(maghribBase, settings.adjustments.maghrib);
  const isha = makeDate(ishaBase, settings.adjustments.isha);

  // Qiyam (Last third of the night between Maghrib and Fajr of next day)
  const nextFajrTime = fajr.getTime() < maghrib.getTime() ? fajr.getTime() + 24 * 3600 * 1000 : fajr.getTime();
  const nightDurationMs = nextFajrTime - maghrib.getTime();
  const qiyam = new Date(maghrib.getTime() + (nightDurationMs * 2) / 3);

  return { fajr, sunrise, dhuhr, asr, maghrib, isha, qiyam };
}

// Calculate Qibla Azimuth & Distance to Makkah
export function calculateQibla(latitude: number, longitude: number): {
  qiblaBearing: number; // 0-360 degrees from True North
  distanceKm: number;
  distanceMiles: number;
  compassDirection: string;
} {
  const phi1 = d2r(latitude);
  const phi2 = d2r(MAKKAH_LAT);
  const deltaLambda = d2r(MAKKAH_LNG - longitude);

  // Qibla Azimuth
  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);
  let qiblaDeg = r2d(Math.atan2(y, x));
  qiblaDeg = (qiblaDeg + 360) % 360;

  // Haversine Distance
  const R = 6371; // Earth radius in km
  const dLat = phi2 - phi1;
  const dLon = deltaLambda;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.round(R * c);
  const distanceMiles = Math.round(distanceKm * 0.621371);

  // Compass Cardinal
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(qiblaDeg / 22.5) % 16;
  const compassDirection = directions[index];

  return {
    qiblaBearing: Math.round(qiblaDeg * 10) / 10,
    distanceKm,
    distanceMiles,
    compassDirection,
  };
}

// Format time HH:MM AM/PM
export function formatPrayerTime(date: Date, is24Hour = false, timeZone?: string): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: is24Hour ? '2-digit' : 'numeric',
    minute: '2-digit',
    hour12: !is24Hour,
  };
  if (timeZone) {
    options.timeZone = timeZone;
  }
  return date.toLocaleTimeString([], options);
}

// Format remaining time in a clean format e.g. "2h 45m"
export function formatRemainingTime(targetDate: Date): { hours: number; minutes: number; seconds: number; text: string; isPast: boolean } {
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  if (diffMs <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, text: '00:00:00', isPast: true };
  }
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  const pad = (n: number) => n.toString().padStart(2, '0');
  const text = hours > 0 ? `${hours}h ${minutes}m ${seconds}s` : `${minutes}m ${seconds}s`;
  return { hours, minutes, seconds, text, isPast: false };
}
