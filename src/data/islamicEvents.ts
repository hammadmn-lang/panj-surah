import { IslamicEvent } from '../types';

export const ISLAMIC_EVENTS_CALENDAR: IslamicEvent[] = [
  // Muharram (Month 1)
  {
    hijriMonth: 1,
    hijriDay: 1,
    title: 'Islamic New Year (Hijri 1 AH)',
    category: 'Sacred Day',
    description: 'The commencement of the Islamic lunar calendar marking the Prophet Muhammad (ﷺ)’s historic migration (Hijrah) from Makkah to Madinah.',
    significance: 'One of the four sacred months in Islam (Ashhur al-Hurum). Recommended for voluntary fasting.',
  },
  {
    hijriMonth: 1,
    hijriDay: 9,
    title: 'Tasu’a (Day before Ashura)',
    category: 'Sacred Day',
    description: 'Sunnah day of fasting alongside the 10th of Muharram as advised by the Prophet Muhammad (ﷺ).',
    significance: 'Fasting on Tasu’a and Ashura expiates minor sins of the preceding year.',
  },
  {
    hijriMonth: 1,
    hijriDay: 10,
    title: 'Day of Ashura',
    category: 'Sacred Day',
    description: 'The blessed day on which Allah saved Prophet Musa (AS) and the Bani Israel from Pharaoh by parting the Red Sea. Also commemorates the martyrdom of Imam Hussain (RA) at Karbala.',
    significance: 'Prophet Muhammad (ﷺ) fasted on this day and highly encouraged believers to fast.',
  },

  // Safar (Month 2)
  {
    hijriMonth: 2,
    hijriDay: 18,
    title: 'Treaty of Hudaybiyyah & Pre-Islamic Misconceptions Disproved',
    category: 'Milestone',
    description: 'Islamic teachings dispel pre-Islamic superstitions regarding Safar; a month of barakah, repentance, and steady devotion.',
    significance: 'Prophet (ﷺ) said: "There is no bad omen in Safar" (Sahih Bukhari).',
  },
  {
    hijriMonth: 2,
    hijriDay: 27,
    title: 'The Prophet (ﷺ) Departs for the Great Hijrah',
    category: 'Prophetic',
    description: 'Prophet Muhammad (ﷺ) accompanied by Sayyidina Abu Bakr As-Siddiq (RA) left Makkah for the Cave of Thawr.',
    significance: 'A turning point that established the first righteous Islamic society in Madinah.',
  },

  // Rabi' al-Awwal (Month 3)
  {
    hijriMonth: 3,
    hijriDay: 8,
    title: 'Arrival at Quba & Construction of First Mosque',
    category: 'Prophetic',
    description: 'The Prophet (ﷺ) arrived at the outskirts of Madinah and built Masjid Quba, the first masjid founded on piety (taqwa).',
    significance: 'Praying 2 Rakah in Masjid Quba rewards the equivalent of an Umrah.',
  },
  {
    hijriMonth: 3,
    hijriDay: 12,
    title: 'Birth and Life of Prophet Muhammad (ﷺ)',
    category: 'Prophetic',
    description: 'The birth of the Mercy to all the Worlds (Rahmatan lil-’Alamin), Prophet Muhammad (ﷺ), bringing light, guidance, and truth.',
    significance: 'A day to send abundant Durood and Salawat upon the Messenger of Allah.',
  },

  // Rabi' al-Thani (Month 4)
  {
    hijriMonth: 4,
    hijriDay: 11,
    title: 'Ghyarween Sharif & Islamic Scholarship Revival',
    category: 'Milestone',
    description: 'Commemoration of righteous scholars and early Awliya who spread knowledge, Quranic ethics, and spiritual excellence across the Muslim world.',
    significance: 'Reflecting on sincere knowledge, charity, and steadfast adherence to the Sunnah.',
  },

  // Jumada al-Ula (Month 5)
  {
    hijriMonth: 5,
    hijriDay: 5,
    title: 'Birth of Sayyida Zainab (RA)',
    category: 'Milestone',
    description: 'Birth of the noble granddaughter of Prophet Muhammad (ﷺ), daughter of Ali ibn Abi Talib and Fatimah az-Zahra (RA), known for courage and faith.',
    significance: 'An exemplar of eloquence, unwavering resilience, and steadfast faith under trials.',
  },
  {
    hijriMonth: 5,
    hijriDay: 15,
    title: 'Battle of Mu’tah (8 AH)',
    category: 'Battle',
    description: 'Major battle demonstrating immense bravery under commanders Zaid ibn Harithah, Ja’far ibn Abi Talib, and Khalid ibn al-Walid (Sayfullah).',
    significance: 'Demonstrated tactical brilliance, brotherhood, and firm reliance on Allah.',
  },

  // Jumada al-Thaniyah (Month 6)
  {
    hijriMonth: 6,
    hijriDay: 3,
    title: 'Legacy of Sayyida Fatimah az-Zahra (RA)',
    category: 'Prophetic',
    description: 'Commemoration of the beloved daughter of the Prophet (ﷺ), the leader of the women of Paradise (Sayyidatu Nisa’il Jannah).',
    significance: 'A timeless role model for piety, devotion, humility, and generosity.',
  },
  {
    hijriMonth: 6,
    hijriDay: 22,
    title: 'Passing of Caliph Abu Bakr As-Siddiq (RA)',
    category: 'Milestone',
    description: 'Passing of the first Rightly Guided Caliph, the closest companion to the Prophet (ﷺ) and preserver of the early Muslim community.',
    significance: 'Compilation of the first written Mushaf of the Holy Quran occurred during his caliphate.',
  },

  // Rajab (Month 7 - Sacred Month)
  {
    hijriMonth: 7,
    hijriDay: 1,
    title: 'Beginning of the Sacred Month of Rajab',
    category: 'Sacred Day',
    description: 'Entry into the sacred pre-Ramadan spiritual season. The Prophet (ﷺ) made the supplication: "Allahumma barik lana fi Rajaba wa Sha’bana wa ballighna Ramadan".',
    significance: 'Spiritual preparation through increased Istighfar, voluntary charity, and Quran recitation.',
  },
  {
    hijriMonth: 7,
    hijriDay: 27,
    title: 'Al-Isra wal-Mi’raj (The Night Journey & Ascension)',
    category: 'Prophetic',
    description: 'The miraculous night journey of Prophet Muhammad (ﷺ) from Masjid al-Haram to Masjid al-Aqsa and through the Seven Heavens to Sidrat al-Muntaha.',
    significance: 'The greatest gift of the five daily prayers (Salah) was mandated during this blessed journey.',
  },

  // Sha'ban (Month 8)
  {
    hijriMonth: 8,
    hijriDay: 15,
    title: 'Laylat al-Bara’ah (Shab-e-Barat / 15th Sha’ban)',
    category: 'Sacred Day',
    description: 'The blessed night of divine mercy and forgiveness where Allah grants pardon to countless seeking believers.',
    significance: 'Recommended for night vigil prayers (Qiyam), sincere repentance, and fasting the next day.',
  },
  {
    hijriMonth: 8,
    hijriDay: 15,
    title: 'Change of the Qibla (Tahweel al-Qiblah)',
    category: 'Revelation',
    description: 'Allah commanded the redirecting of the Qibla from Jerusalem (Al-Quds) toward the Holy Kaaba in Makkah (Surah Al-Baqarah 2:144).',
    significance: 'Established the Kaaba as the universal eternal focal point for all Muslim prayers worldwide.',
  },

  // Ramadan (Month 9 - Month of Quran & Fasting)
  {
    hijriMonth: 9,
    hijriDay: 1,
    title: 'First Day of Holy Ramadan (Fasting Begins)',
    category: 'Sacred Day',
    description: 'The holiest month of the year wherein the gates of Paradise are opened, the gates of Hell are locked, and devils are chained.',
    significance: 'The month in which the Quran was revealed as a guidance for mankind.',
  },
  {
    hijriMonth: 9,
    hijriDay: 10,
    title: 'Demise of Umm al-Mu’mineen Sayyida Khadijah (RA)',
    category: 'Prophetic',
    description: 'Remembrance of the noble Mother of the Believers, first to accept Islam and prime supporter of the Messenger of Allah.',
    significance: 'The year was known as the Year of Sorrow (‘Am al-Huzn).',
  },
  {
    hijriMonth: 9,
    hijriDay: 17,
    title: 'Ghazwah Badr (Battle of Badr - 2 AH)',
    category: 'Battle',
    description: 'The decisive day of criterion (Yawm al-Furqan) where 313 Muslims triumphed over overwhelming odds through divine angelic assistance.',
    significance: 'Secured the early survival and establishment of the Islamic nation.',
  },
  {
    hijriMonth: 9,
    hijriDay: 20,
    title: 'Fath Makkah (The Peaceful Conquest of Makkah - 8 AH)',
    category: 'Milestone',
    description: 'Prophet Muhammad (ﷺ) entered Makkah in triumphant humility, cleansed the Kaaba of all 360 idols, and declared a general pardon.',
    significance: 'Manifestation of supreme mercy: "Go, for you are free!" (La tathreeba ‘alaikumul yawm).',
  },
  {
    hijriMonth: 9,
    hijriDay: 27,
    title: 'Laylat al-Qadr (The Night of Power & Decree)',
    category: 'Revelation',
    description: 'The most sacred night of the year, better than 1,000 months (83.3 years of continuous worship). Angels descend with blessings and peace until dawn.',
    significance: 'Sincere prayer, recitation of Surah Al-Qadr, and reciting: "Allahumma innaka ‘afuwwun tuhibbul ‘afwa fa’fu ‘anni".',
  },

  // Shawwal (Month 10)
  {
    hijriMonth: 10,
    hijriDay: 1,
    title: 'Eid-ul-Fitr (Festival of Breaking the Fast)',
    category: 'Sacred Day',
    description: 'Day of celebration, joy, charity (Zakat al-Fitr), communal prayer, and gratitude for completing Ramadan.',
    significance: 'Fasting is prohibited on this day; believers rejoice and maintain family ties.',
  },
  {
    hijriMonth: 10,
    hijriDay: 6,
    title: 'Six Sunnah Fasts of Shawwal',
    category: 'Sacred Day',
    description: 'The Prophet (ﷺ) said: "Whoever fasts Ramadan and follows it with six days of Shawwal, it is as if he fasted the entire year."',
    significance: 'Multiplied reward equivalent to perpetual fasting.',
  },

  // Dhu al-Qi'dah (Month 11 - Sacred Month)
  {
    hijriMonth: 11,
    hijriDay: 1,
    title: 'Month of Peace & Preparation for Hajj',
    category: 'Sacred Day',
    description: 'One of the four sacred months in which fighting was strictly forbidden in Arabia to allow safe transit for pilgrims.',
    significance: 'A period of spiritual discipline, inner peace, and anticipation for Hajj.',
  },

  // Dhu al-Hijjah (Month 12 - Sacred Month & Season of Hajj)
  {
    hijriMonth: 12,
    hijriDay: 1,
    title: 'First 10 Days of Dhu al-Hijjah Begin',
    category: 'Sacred Day',
    description: 'The greatest ten days of the entire year for righteous deeds. Allah swears by them in Surah Al-Fajr: "By the Ten Nights".',
    significance: 'Reciting abundant Takbeer (Allahu Akbar), Tahmeed (Alhamdulillah), and Tahlil (La ilaha illallah).',
  },
  {
    hijriMonth: 12,
    hijriDay: 8,
    title: 'Yawm at-Tarwiyah (Day of Deliberation - Hajj begins)',
    category: 'Milestone',
    description: 'Pilgrims depart from Makkah to the valley of Mina to spend the day and night in preparation for Arafat.',
    significance: 'Commencement of the major rites of the Fifth Pillar of Islam.',
  },
  {
    hijriMonth: 12,
    hijriDay: 9,
    title: 'Day of Arafah (Yawm ‘Arafat) & Farewell Sermon',
    category: 'Sacred Day',
    description: 'The pinnacle of Hajj at Mount Rahmah. The Prophet (ﷺ) delivered the historic Farewell Sermon (Khutbat al-Wada’) enshrining human rights, equality, and faith.',
    significance: 'Fasting on the Day of Arafah for non-pilgrims expiates the sins of two full years (prior and coming year).',
  },
  {
    hijriMonth: 12,
    hijriDay: 10,
    title: 'Eid-ul-Adha (Festival of Sacrifice)',
    category: 'Sacred Day',
    description: 'Commemoration of the ultimate devotion and obedience of Prophet Ibrahim (AS) and Prophet Ismail (AS). Sacrificial Qurbani offered worldwide.',
    significance: 'Days of Tashreeq (11th, 12th, 13th) follow with continuous Takbeerat and joyous gratitude.',
  },
  {
    hijriMonth: 12,
    hijriDay: 18,
    title: 'Event of Ghadir Khumm & Brotherhood of Believers',
    category: 'Milestone',
    description: 'The Prophet (ﷺ) affirmed deep spiritual brotherhood, unity, and love among all believers on his return journey from the Farewell Pilgrimage.',
    significance: 'Reinforcing unity, justice, and holding firmly to the Quran and Sunnah.',
  },
];

// Get Islamic events matching today's Hijri month and day
export function getTodaysIslamicEvents(hijriMonth: number, hijriDay: number): IslamicEvent[] {
  // Direct match
  const directMatches = ISLAMIC_EVENTS_CALENDAR.filter(
    (ev) => ev.hijriMonth === hijriMonth && ev.hijriDay === hijriDay
  );

  if (directMatches.length > 0) return directMatches;

  // If no exact match today, provide the nearest upcoming or general monthly milestone
  const monthEvents = ISLAMIC_EVENTS_CALENDAR.filter((ev) => ev.hijriMonth === hijriMonth);
  if (monthEvents.length > 0) {
    // Find closest event in this month
    const upcoming = monthEvents.find((ev) => ev.hijriDay >= hijriDay);
    if (upcoming) return [upcoming];
    return [monthEvents[0]];
  }

  // Fallback daily reflection
  return [
    {
      hijriMonth,
      hijriDay,
      title: 'Daily Islamic Reflection & Sunnah',
      category: 'Prophetic',
      description: 'Every day in the life of a believer is a blessed opportunity for sincere Dhikr, continuous repentance (Tawbah), maintaining kinship ties, and punctual prayers.',
      significance: 'The Prophet (ﷺ) said: "The best deeds are those done consistently, even if they are small."',
    },
  ];
}
