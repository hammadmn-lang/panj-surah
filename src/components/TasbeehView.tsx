import React, { useState } from 'react';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Smartphone,
  Plus,
  Sparkles,
  Check,
  Award,
  CircleDot,
  Layers,
  Flame,
  Edit2,
  Hash,
  BarChart2,
  Clock,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  BookOpen,
} from 'lucide-react';
import { TasbeehDhikr, UserProfile } from '../types';
import { playCompletionChime, playTasbeehClick } from '../utils/audioAlarm';
import confetti from 'canvas-confetti';
import { TasbeehStats } from './TasbeehStats';

export type TasbeehPrayerTab = 'all' | 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerDhikrItem extends TasbeehDhikr {
  prayerCategory?: TasbeehPrayerTab;
  hadithRef?: string;
  timingNote?: string;
  urduMeaning?: string;
}

export const PRAYER_DHIKR_TABS: {
  id: TasbeehPrayerTab;
  label: string;
  urduLabel: string;
  timeLabel: string;
  hadithSummary: string;
}[] = [
  {
    id: 'all',
    label: 'All Adhkar',
    urduLabel: 'عام تسبیحات',
    timeLabel: 'General',
    hadithSummary: 'Continuous general remembrance of Allah (Al-Baqiyat as-Salihat) and custom dhikr counts.',
  },
  {
    id: 'fajr',
    label: 'After Fajr',
    urduLabel: 'بعد از فجر',
    timeLabel: 'Dawn Prayer',
    hadithSummary: 'Sunnah adhkar prescribed after Fajr before speaking: 7x Hellfire protection, 10x Kalima Tauheed, Ayat-ul-Kursi & Sayyidul Istighfar.',
  },
  {
    id: 'dhuhr',
    label: 'After Dhuhr',
    urduLabel: 'بعد از ظہر',
    timeLabel: 'Noon Prayer',
    hadithSummary: 'Midday prayer tasbihat: 3x Istighfar, Ayat-ul-Kursi, Tasbih Fatimi (33, 33, 34) & prayer for steadfast worship.',
  },
  {
    id: 'asr',
    label: 'After Asr',
    urduLabel: 'بعد از عصر',
    timeLabel: 'Afternoon Prayer',
    hadithSummary: 'Late afternoon adhkar: Tasbih Fatimi, Ayat-ul-Kursi, Sayyidul Istighfar & 3x evening shield from all harm.',
  },
  {
    id: 'maghrib',
    label: 'After Maghrib',
    urduLabel: 'بعد از مغرب',
    timeLabel: 'Sunset Prayer',
    hadithSummary: 'Sunset sunnah adhkar: 7x Hellfire protection, 10x Kalima Tauheed, Ayat-ul-Kursi, Tasbih Fatimi & 3 Quls (3x).',
  },
  {
    id: 'isha',
    label: 'After Isha & Witr',
    urduLabel: 'بعد از عشاء و وتر',
    timeLabel: 'Night Prayer',
    hadithSummary: 'Night prayers & Witr supplications: Tasbih Fatimi, Ayat-ul-Kursi, Dua-e-Qunoot & 3x Subhanal Malikil Quddus.',
  },
];

const DEFAULT_DHIKRS: PrayerDhikrItem[] = [
  {
    id: 'subhanallah',
    title: 'SubhanAllah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subḥānallāh',
    translation: 'Glory be to Allah',
    urduMeaning: 'اللہ پاک ہے',
    target: 33,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'all',
  },
  {
    id: 'alhamdulillah',
    title: 'Alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Al-ḥamdu lillāh',
    translation: 'All praise is due to Allah',
    urduMeaning: 'تمام تعریفیں اللہ ہی کے لیے ہیں',
    target: 33,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'all',
  },
  {
    id: 'allahuakbar',
    title: 'Allahu Akbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    translation: 'Allah is the Greatest',
    urduMeaning: 'اللہ سب سے بڑا ہے',
    target: 34,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'all',
  },
  {
    id: 'astaghfirullah',
    title: 'Astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullāh',
    translation: 'I seek forgiveness from Allah',
    urduMeaning: 'میں اللہ سے بخشش مانگتا ہوں',
    target: 100,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'all',
  },
  {
    id: 'lailahaillallah',
    title: 'La Ilaha Illallah',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
    transliteration: 'Lā ilāha illallāh',
    translation: 'There is no deity except Allah',
    urduMeaning: 'اللہ کے سوا کوئی معبود نہیں',
    target: 100,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'all',
  },
  {
    id: 'ayat-karima',
    title: 'Ayat-e-Karima (Dua Yunus)',
    arabic: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    transliteration: 'Lā ilāha illā Anta subḥānaka innī kuntu minaẓ-ẓālimīn',
    translation: 'There is no deity except You; exalted are You. Indeed, I was of the wrongdoers.',
    urduMeaning: 'تیرے سوا کوئی معبود نہیں، تو پاک ہے، بیشک میں ہی قصوروار ہوں',
    target: 100,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'all',
  },
  {
    id: 'hasbunallah',
    title: 'HasbunAllahu wa ni’mal wakeel',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: 'Ḥasbunallāhu wa ni‘mal-wakīl',
    translation: 'Sufficient for us is Allah, and [He is] the best Disposer of affairs.',
    urduMeaning: 'ہمیں اللہ کافی ہے اور وہ بہترین کارساز ہے',
    target: 100,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'all',
  },
  {
    id: 'durood-ibrahimi',
    title: 'Durood-e-Ibrahimi',
    arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration: 'Allāhumma ṣalli ‘alā Muḥammadin wa ‘alā āli Muḥammad...',
    translation: 'O Allah, send blessings upon Muhammad and upon the family of Muhammad...',
    urduMeaning: 'اے اللہ! درود بھیج حضرت محمد (ﷺ) پر اور ان کی آل پر',
    target: 100,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'all',
  },
];

const FAJR_DHIKRS: PrayerDhikrItem[] = [
  {
    id: 'fajr-astaghfirullah',
    title: 'Astaghfirullah (3x)',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullāh',
    translation: 'I ask Allah for forgiveness',
    urduMeaning: 'میں اللہ سے بخشش مانگتا ہوں (3 مرتبہ سلام کے بعد)',
    target: 3,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'fajr',
    timingNote: 'Immediately upon completing Salam',
    hadithRef: 'Sahih Muslim 591: The Prophet (ﷺ) would seek forgiveness 3 times after finishing prayer.',
  },
  {
    id: 'fajr-antas-salam',
    title: 'Allahumma Antas-Salam',
    arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالإِكْرَامِ',
    transliteration: 'Allāhumma Antas-Salāmu wa minkas-salām, tabārakta yā Dhal-Jalāli wal-Ikrām',
    translation: 'O Allah, You are Peace, and from You comes peace. Blessed are You, Owner of Majesty and Honor.',
    urduMeaning: 'اے اللہ! تو سلامتی والا ہے اور تجھ ہی سے سلامتی ہے، تو بابرکت ہے عظمت اور بزرگی والے۔',
    target: 1,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'fajr',
    timingNote: 'After completing the prayer',
    hadithRef: 'Sahih Muslim: Recited after completing Salah.',
  },
  {
    id: 'fajr-hellfire-7x',
    title: 'Protection from Hell (7x)',
    arabic: 'اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ',
    transliteration: 'Allāhumma ajirnī minan-nār',
    translation: 'O Allah, protect and save me from the Fire of Hell.',
    urduMeaning: 'اے اللہ! مجھے جہنم کی آگ سے پناہ عطا فرما (فجر کے بعد 7 بار بولنے سے پہلے)',
    target: 7,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'fajr',
    timingNote: 'Recite 7 times after Fajr before speaking to anyone',
    hadithRef: 'Abu Dawud (5079): "Say 7 times before speaking. If you die that day, Allah decrees protection from the Fire."',
  },
  {
    id: 'fajr-kalima-10x',
    title: 'Kalima Tauheed (10x)',
    arabic: 'لَا إِلٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'Lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu yuḥyī wa yumītu wa Huwa ‘alā kulli shay’in Qadīr',
    translation: 'There is no deity except Allah alone without partner. His is the dominion and praise, He gives life and causes death, and He is over all things capable.',
    urduMeaning: 'اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اسی کی بادشاہی اور تعریف ہے، وہی زندہ کرتا اور مارتا ہے اور ہر چیز پر قادر ہے۔',
    target: 10,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'fajr',
    timingNote: 'Recite 10 times after Fajr while seated in prayer position',
    hadithRef: 'Tirmidhi (3474): 10 good deeds recorded, 10 sins erased, raised 10 ranks, and shielded from Satan all day.',
  },
  {
    id: 'fajr-ayat-kursi',
    title: 'Ayat al-Kursi (آية الكرسي)',
    arabic: 'اللَّهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ...',
    transliteration: 'Allāhu lā ilāha illā Huwal-Ḥayyul-Qayyūm...',
    translation: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence...',
    urduMeaning: 'اللہ کے سوا کوئی معبود نہیں، وہ ہمیشہ زندہ رہنے والا اور کائنات کو سنبھالنے والا ہے۔',
    target: 1,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'fajr',
    timingNote: 'After every obligatory prayer',
    hadithRef: 'An-Nasa’i (Sahih): "Whoever recites Ayat al-Kursi after every fard prayer, nothing stands between him and entering Paradise except death."',
  },
  {
    id: 'fajr-subhanallah',
    title: 'Tasbih Fatimi: SubhanAllah (33x)',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subḥānallāh',
    translation: 'Glory be to Allah',
    urduMeaning: 'اللہ پاک ہے (33 بار)',
    target: 33,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'fajr',
    timingNote: 'After every obligatory Salah',
    hadithRef: 'Sahih al-Bukhari & Muslim: 33x SubhanAllah, 33x Alhamdulillah, 34x Allahu Akbar.',
  },
  {
    id: 'fajr-alhamdulillah',
    title: 'Tasbih Fatimi: Alhamdulillah (33x)',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Al-ḥamdu lillāh',
    translation: 'All praise is due to Allah',
    urduMeaning: 'سب تعریف اللہ کے لیے ہے (33 بار)',
    target: 33,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'fajr',
    timingNote: 'After every obligatory Salah',
    hadithRef: 'Sahih Muslim: Erases sins even if like the foam of the sea.',
  },
  {
    id: 'fajr-allahuakbar',
    title: 'Tasbih Fatimi: Allahu Akbar (34x)',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    translation: 'Allah is the Greatest',
    urduMeaning: 'اللہ سب سے بڑا ہے (34 بار)',
    target: 34,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'fajr',
    timingNote: 'Completing the 100-dhikr tally',
    hadithRef: 'Sahih Muslim & Sunan Abu Dawud',
  },
  {
    id: 'fajr-knowledge',
    title: 'Beneficial Knowledge & Rizq',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
    transliteration: 'Allāhumma innī as’aluka ‘ilman nāfi‘an, wa rizqan ṭayyiban, wa ‘amalan mutaqabbalan',
    translation: 'O Allah, I ask You for beneficial knowledge, lawful pure sustenance, and deeds that are accepted.',
    urduMeaning: 'اے اللہ! میں تجھ سے نفع بخش علم، حلال روزی اور قبول ہونے والے عمل کا سوال کرتا ہوں۔',
    target: 1,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'fajr',
    timingNote: 'Directly after the Fajr Salam',
    hadithRef: 'Sunan Ibn Majah (925): Umm Salamah (RA) reported the Prophet (ﷺ) said this when he prayed Fajr.',
  },
  {
    id: 'fajr-sayyidul-istighfar',
    title: 'Sayyidul Istighfar (سید الاستغفار)',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلٰهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: 'Allāhumma Anta Rabbī lā ilāha illā Ant, khalaqtanī wa anā ‘abduk, wa anā ‘alā ‘ahdika wa wa‘dika mastata‘t, a‘ūdhu bika min sharri mā ṣana‘t, abū’u laka bi-ni‘matika ‘alayya wa abū’u bi-dhambī faghfir lī fa-innahū lā yaghfirudh-dhunūba illā Ant.',
    translation: 'O Allah, You are my Lord! None has the right to be worshiped but You. You created me and I am Your slave, and I am faithful to my covenant and promise to You as much as I can...',
    urduMeaning: 'سید الاستغفار - مغفرت کی سب سے عظیم دعا۔ صبح کے وقت پڑھنے والا اگر شام سے پہلے فوت ہو جائے تو جنتی ہے۔',
    target: 1,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'fajr',
    timingNote: 'Morning after Fajr prayer',
    hadithRef: 'Sahih al-Bukhari (6306): Master supplication for forgiveness.',
  },
  {
    id: 'fajr-3quls',
    title: '3 Quls (Ikhlas, Falaq, Nas - 3x)',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
    transliteration: 'Surah Al-Ikhlas, Al-Falaq, An-Nas (Recited 3 times each)',
    translation: 'The 3 Surahs of Purity and Divine Protection against all harm, black magic, envy, and evil eye.',
    urduMeaning: 'تینوں قل (اخلاص، فلق، ناس) تین تین مرتبہ۔ تمام شرور اور برائیوں سے حفاظت کے لیے کافی ہیں۔',
    target: 3,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'fajr',
    timingNote: 'After Fajr and after Maghrib (3x each)',
    hadithRef: 'Abu Dawud (5082) & Tirmidhi: "Recite them 3 times morning and evening, they will suffice you against everything."',
  },
];

const DHUHR_DHIKRS: PrayerDhikrItem[] = [
  {
    id: 'dhuhr-astaghfirullah',
    title: 'Astaghfirullah (3x)',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullāh',
    translation: 'I ask Allah for forgiveness',
    urduMeaning: 'میں اللہ سے بخشش مانگتا ہوں (3 مرتبہ)',
    target: 3,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'dhuhr',
    timingNote: 'Immediately after Salam',
    hadithRef: 'Sahih Muslim 591',
  },
  {
    id: 'dhuhr-antas-salam',
    title: 'Allahumma Antas-Salam',
    arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالإِكْرَامِ',
    transliteration: 'Allāhumma Antas-Salām...',
    translation: 'O Allah, You are Peace, and from You comes peace...',
    urduMeaning: 'اے اللہ! تو سلامتی والا ہے اور تجھ ہی سے سلامتی ہے۔',
    target: 1,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'dhuhr',
  },
  {
    id: 'dhuhr-ayat-kursi',
    title: 'Ayat al-Kursi (آية الكرسي)',
    arabic: 'اللَّهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ...',
    transliteration: 'Allāhu lā ilāha illā Huwal-Ḥayyul-Qayyūm...',
    translation: 'The Throne Verse (Surah Al-Baqarah 2:255)',
    urduMeaning: 'آیت الکرسی - ہر فرض نماز کے بعد پڑھنے سے جنت میں داخلے کی بشارت ہے۔',
    target: 1,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'dhuhr',
    hadithRef: 'An-Nasa’i: Guaranteed Jannah upon death for reciting after every fard prayer.',
  },
  {
    id: 'dhuhr-subhanallah',
    title: 'Tasbih Fatimi: SubhanAllah (33x)',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subḥānallāh',
    translation: 'Glory be to Allah',
    urduMeaning: 'اللہ پاک ہے (33 بار)',
    target: 33,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'dhuhr',
  },
  {
    id: 'dhuhr-alhamdulillah',
    title: 'Tasbih Fatimi: Alhamdulillah (33x)',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Al-ḥamdu lillāh',
    translation: 'All praise is due to Allah',
    urduMeaning: 'سب تعریف اللہ کے لیے ہے (33 بار)',
    target: 33,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'dhuhr',
  },
  {
    id: 'dhuhr-allahuakbar',
    title: 'Tasbih Fatimi: Allahu Akbar (34x)',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    translation: 'Allah is the Greatest',
    urduMeaning: 'اللہ سب سے بڑا ہے (34 بار)',
    target: 34,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'dhuhr',
  },
  {
    id: 'dhuhr-tauheed',
    title: 'Kalima Tauheed Seal',
    arabic: 'لَا إِلٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'Lā ilāha illallāhu waḥdahū lā sharīka lah...',
    translation: 'There is no deity except Allah alone without partner...',
    urduMeaning: 'کلمہ توحید تسبیح فاطمہ کے بعد پڑھنا۔',
    target: 1,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'dhuhr',
    hadithRef: 'Sahih Muslim 597: Whoever says this after Tasbih Fatimi, sins are forgiven.',
  },
  {
    id: 'dhuhr-help-worship',
    title: 'Prayer for Devotion & Gratitude',
    arabic: 'اللَّهُمَّ أَعِنِّي عَلَىٰ ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    transliteration: 'Allāhumma a‘innī ‘alā dhikrika wa shukrika wa ḥusni ‘ibādatik',
    translation: 'O Allah, help me in remembering You, expressing gratitude to You, and worshiping You in the best manner.',
    urduMeaning: 'اے اللہ! اپنے ذکر، اپنے شکر اور اپنی بہترین عبادت پر میری مدد فرما۔',
    target: 1,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'dhuhr',
    hadithRef: 'Abu Dawud (1522): Prophet (ﷺ) advised Mu’adh (RA) never to omit after any prayer.',
  },
];

const ASR_DHIKRS: PrayerDhikrItem[] = [
  {
    id: 'asr-astaghfirullah',
    title: 'Astaghfirullah (3x)',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullāh',
    translation: 'I ask Allah for forgiveness',
    urduMeaning: 'میں اللہ سے بخشش مانگتا ہوں (3 بار)',
    target: 3,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'asr',
  },
  {
    id: 'asr-antas-salam',
    title: 'Allahumma Antas-Salam',
    arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالإِكْرَامِ',
    transliteration: 'Allāhumma Antas-Salām...',
    translation: 'O Allah, You are Peace, and from You comes peace...',
    urduMeaning: 'اے اللہ! تو سلامتی والا ہے اور تجھ ہی سے سلامتی ہے۔',
    target: 1,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'asr',
  },
  {
    id: 'asr-ayat-kursi',
    title: 'Ayat al-Kursi (آية الكرسي)',
    arabic: 'اللَّهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ...',
    transliteration: 'Allāhu lā ilāha illā Huwal-Ḥayyul-Qayyūm...',
    translation: 'The Throne Verse (Surah Al-Baqarah 2:255)',
    urduMeaning: 'آیت الکرسی - ہر فرض نماز کے بعد پڑھنا۔',
    target: 1,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'asr',
  },
  {
    id: 'asr-subhanallah',
    title: 'Tasbih Fatimi: SubhanAllah (33x)',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subḥānallāh',
    translation: 'Glory be to Allah',
    urduMeaning: 'اللہ پاک ہے (33 بار)',
    target: 33,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'asr',
  },
  {
    id: 'asr-alhamdulillah',
    title: 'Tasbih Fatimi: Alhamdulillah (33x)',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Al-ḥamdu lillāh',
    translation: 'All praise is due to Allah',
    urduMeaning: 'سب تعریف اللہ کے لیے ہے (33 بار)',
    target: 33,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'asr',
  },
  {
    id: 'asr-allahuakbar',
    title: 'Tasbih Fatimi: Allahu Akbar (34x)',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    translation: 'Allah is the Greatest',
    urduMeaning: 'اللہ سب سے بڑا ہے (34 بار)',
    target: 34,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'asr',
  },
  {
    id: 'asr-sayyidul-istighfar',
    title: 'Sayyidul Istighfar (Evening • سید الاستغفار)',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلٰهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: 'Allāhumma Anta Rabbī lā ilāha illā Ant...',
    translation: 'The Master Supplication for forgiveness (recited in evening)',
    urduMeaning: 'شام کے وقت سید الاستغفار پڑھنے والا اگر رات کو فوت ہو جائے تو جنتی ہے۔',
    target: 1,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'asr',
    hadithRef: 'Sahih al-Bukhari 6306: Evening recitation secures Jannah.',
  },
  {
    id: 'asr-shield-3x',
    title: 'Shield from All Harm (3x)',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ العَلِيمُ',
    transliteration: 'Bismillāhilladhī lā yaḍurru ma‘as-mihī shay’un fil-arḍi wa lā fis-samā’i wa Huwas-Samī‘ul-‘Alīm',
    translation: 'In the name of Allah, with whose name nothing can cause harm on earth nor in heaven, and He is the All-Hearing, the All-Knowing.',
    urduMeaning: 'اللہ کے نام سے جس کے نام کی برکت سے کوئی چیز زمین و آسمان میں نقصان نہیں پہنچا سکتی۔',
    target: 3,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'asr',
    hadithRef: 'Tirmidhi (3388): Whoever recites 3 times in the evening, nothing shall harm him until morning.',
  },
  {
    id: 'asr-contentment',
    title: 'Contentment with Allah (3x)',
    arabic: 'رَضِيتُ بِاللَّهِ رَبًّا وَبِالإِسْلَامِ دِينًا وَبِمُحَمَّدٍ نَبِيًّا',
    transliteration: 'Raḍītu billāhi Rabban wa bil-Islāmi dīnan wa bi-Muḥammadin Nabiyyā',
    translation: 'I am pleased with Allah as my Lord, Islam as my religion, and Muhammad (ﷺ) as my Prophet.',
    urduMeaning: 'میں راضی ہوا اللہ کے رب ہونے پر، اسلام کے دین ہونے پر، اور محمد (ﷺ) کے نبی ہونے پر۔',
    target: 3,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'asr',
    hadithRef: 'Abu Dawud (5072): Allah has promised to satisfy whoever says this 3 times in evening.',
  },
];

const MAGHRIB_DHIKRS: PrayerDhikrItem[] = [
  {
    id: 'maghrib-hellfire-7x',
    title: 'Protection from Hell (7x)',
    arabic: 'اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ',
    transliteration: 'Allāhumma ajirnī minan-nār',
    translation: 'O Allah, protect and save me from the Fire of Hell.',
    urduMeaning: 'اے اللہ! مجھے جہنم کی آگ سے پناہ عطا فرما (مغرب کے بعد 7 بار بولنے سے پہلے)',
    target: 7,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'maghrib',
    timingNote: 'Recite 7 times immediately after Maghrib before speaking',
    hadithRef: 'Abu Dawud (5079): "Say 7 times after Maghrib before speaking. If you die that night, protection from Hell is decreed."',
  },
  {
    id: 'maghrib-kalima-10x',
    title: 'Kalima Tauheed (10x)',
    arabic: 'لَا إِلٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'Lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu yuḥyī wa yumītu wa Huwa ‘alā kulli shay’in Qadīr',
    translation: 'There is no deity except Allah alone without partner...',
    urduMeaning: 'کلمہ توحید 10 مرتبہ مغرب کے بعد۔ 10 نیکیاں لکھی جاتی ہیں اور 10 گناہ معاف ہوتے ہیں۔',
    target: 10,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'maghrib',
    hadithRef: 'Tirmidhi: 10 blessings, 10 sins wiped, divine protection from Satan all night.',
  },
  {
    id: 'maghrib-ayat-kursi',
    title: 'Ayat al-Kursi (آية الكرسي)',
    arabic: 'اللَّهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ...',
    transliteration: 'Allāhu lā ilāha illā Huwal-Ḥayyul-Qayyūm...',
    translation: 'The Throne Verse (Surah Al-Baqarah 2:255)',
    urduMeaning: 'آیت الکرسی - ہر فرض نماز کے بعد پڑھنا۔',
    target: 1,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'maghrib',
  },
  {
    id: 'maghrib-subhanallah',
    title: 'Tasbih Fatimi: SubhanAllah (33x)',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subḥānallāh',
    translation: 'Glory be to Allah',
    urduMeaning: 'اللہ پاک ہے (33 بار)',
    target: 33,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'maghrib',
  },
  {
    id: 'maghrib-alhamdulillah',
    title: 'Tasbih Fatimi: Alhamdulillah (33x)',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Al-ḥamdu lillāh',
    translation: 'All praise is due to Allah',
    urduMeaning: 'سب تعریف اللہ کے لیے ہے (33 بار)',
    target: 33,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'maghrib',
  },
  {
    id: 'maghrib-allahuakbar',
    title: 'Tasbih Fatimi: Allahu Akbar (34x)',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    translation: 'Allah is the Greatest',
    urduMeaning: 'اللہ سب سے بڑا ہے (34 بار)',
    target: 34,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'maghrib',
  },
  {
    id: 'maghrib-3quls',
    title: '3 Quls (Ikhlas, Falaq, Nas - 3x)',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
    transliteration: 'Surah Al-Ikhlas, Al-Falaq, An-Nas (3 times each)',
    translation: 'Recited 3 times each after Maghrib for complete night safeguard.',
    urduMeaning: 'تینوں قل (اخلاص، فلق، ناس) تین تین مرتبہ مغرب کے بعد۔',
    target: 3,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'maghrib',
    hadithRef: 'Abu Dawud (5082) & Tirmidhi',
  },
  {
    id: 'maghrib-refuge-3x',
    title: 'Refuge in Perfect Words (3x)',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: 'A‘ūdhu bi-kalimātillāhit-tāmmāti min sharri mā khalaq',
    translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
    urduMeaning: 'میں پناہ مانگتا ہوں اللہ کے مکمل کلمات کے ساتھ اس کی تمام مخلوق کے شر سے (3 بار)۔',
    target: 3,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'maghrib',
    hadithRef: 'Sahih Muslim (2709): Protects against insect bites, stings, and venom all night.',
  },
];

const ISHA_DHIKRS: PrayerDhikrItem[] = [
  {
    id: 'isha-astaghfirullah',
    title: 'Astaghfirullah (3x)',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullāh',
    translation: 'I ask Allah for forgiveness',
    urduMeaning: 'میں اللہ سے بخشش مانگتا ہوں (3 بار)',
    target: 3,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'isha',
  },
  {
    id: 'isha-antas-salam',
    title: 'Allahumma Antas-Salam',
    arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالإِكْرَامِ',
    transliteration: 'Allāhumma Antas-Salām...',
    translation: 'O Allah, You are Peace, and from You comes peace...',
    urduMeaning: 'اے اللہ! تو سلامتی والا ہے اور تجھ ہی سے سلامتی ہے۔',
    target: 1,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'isha',
  },
  {
    id: 'isha-ayat-kursi',
    title: 'Ayat al-Kursi (آية الكرسي)',
    arabic: 'اللَّهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ...',
    transliteration: 'Allāhu lā ilāha illā Huwal-Ḥayyul-Qayyūm...',
    translation: 'The Throne Verse (Surah Al-Baqarah 2:255)',
    urduMeaning: 'آیت الکرسی - رات کو پڑھنے سے ایک فرشتہ حفاظت کرتا ہے اور شیطان قریب نہیں آتا۔',
    target: 1,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'isha',
    hadithRef: 'Sahih al-Bukhari 2311: An angel guards you and no devil comes near until morning.',
  },
  {
    id: 'isha-subhanallah',
    title: 'Tasbih Fatimi: SubhanAllah (33x)',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subḥānallāh',
    translation: 'Glory be to Allah',
    urduMeaning: 'اللہ پاک ہے (33 بار)',
    target: 33,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'isha',
  },
  {
    id: 'isha-alhamdulillah',
    title: 'Tasbih Fatimi: Alhamdulillah (33x)',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Al-ḥamdu lillāh',
    translation: 'All praise is due to Allah',
    urduMeaning: 'سب تعریف اللہ کے لیے ہے (33 بار)',
    target: 33,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'isha',
  },
  {
    id: 'isha-allahuakbar',
    title: 'Tasbih Fatimi: Allahu Akbar (34x)',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    translation: 'Allah is the Greatest',
    urduMeaning: 'اللہ سب سے بڑا ہے (34 بار)',
    target: 34,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'isha',
  },
  {
    id: 'isha-qunoot',
    title: 'Dua-e-Qunoot (دعاء القنوت)',
    arabic: 'اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنُؤْمِنُ بِكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ وَنَشْكُرُكَ وَلَا نَكْفُرُكَ وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ ۝ اللَّهُمَّ إِيَّاكَ نَعْبُدُ وَلَكَ نُصَلِّي وَنَسْجُدُ وَإِلَيْكَ نَسْعَىٰ وَنَحْفِدُ وَنَرْجُو رَحْمَتَكَ وَنَخْشَىٰ عَذَابَكَ إِنَّ عَذَابَكَ بِالْكُفَّارِ مُلْحَقٌ',
    transliteration: 'Allāhumma innā nasta‘īnuka wa nastaghfiruka wa nu’minu bika wa natawakkalu ‘alayka...',
    translation: 'O Allah, we seek Your assistance, we ask for Your forgiveness, we believe in You, we place our trust in You...',
    urduMeaning: 'دعائے قنوت - نمازِ وتر کی تیسری رکعت میں رکوع سے پہلے تکبیر کہہ کر پڑھی جاتی ہے۔',
    target: 1,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'isha',
    timingNote: 'Recited during 3rd Rakah of Salatul Witr',
    hadithRef: 'Musannaf Ibn Abi Shaybah 6965 & Sunan al-Kubra Bayhaqi: The established Witr Qunoot of the Sahabah.',
  },
  {
    id: 'isha-subhanal-malik',
    title: 'Subhanal Malikil Quddus (3x)',
    arabic: 'سُبْحَانَ الْمَلِكِ الْقُدُّوسِ',
    transliteration: 'Subḥānal-Malikil-Quddūs',
    translation: 'Glory be to the Sovereign, the Most Holy.',
    urduMeaning: 'پاک ہے وہ ذات جو بادشاہ ہے، نہایت مقدس ہے (وتر کے بعد 3 بار، تیسری بار آواز بلند کر کے)۔',
    target: 3,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'isha',
    timingNote: 'Upon completing Witr prayer',
    hadithRef: 'Sunan an-Nasa’i (1732): Prophet (ﷺ) recited this 3 times after Witr, raising voice on the 3rd.',
  },
  {
    id: 'isha-amanar-rasulu',
    title: 'Amanar-Rasulu (Baqarah 285-286)',
    arabic: 'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ...',
    transliteration: 'Āmanar-Rasūlu bi-mā unzila ilayhi mir-Rabbihī wal-mu’minūn...',
    translation: 'The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers...',
    urduMeaning: 'سورۃ البقرہ کی آخری دو آیات۔ رات کو پڑھنے والے کے لیے ہر آفت و بلا سے کفایت کرتی ہیں۔',
    target: 1,
    count: 0,
    totalSaved: 0,
    prayerCategory: 'isha',
    timingNote: 'At night before going to sleep',
    hadithRef: 'Sahih al-Bukhari (5009): "Whoever recites the last two verses of Surah Al-Baqarah at night, they will suffice him."',
  },
];

interface TasbeehViewProps {
  userProfile: UserProfile;
  onUpdateTasbeehTotal: (newTotal: number, dhikrTitle?: string, countDelta?: number) => void;
  onSaveCustomDhikr: (dhikr: TasbeehDhikr) => void;
}

export const TasbeehView: React.FC<TasbeehViewProps> = ({
  userProfile,
  onUpdateTasbeehTotal,
  onSaveCustomDhikr,
}) => {
  const [selectedPrayerTab, setSelectedPrayerTab] = useState<TasbeehPrayerTab>('all');
  const [activeViewTab, setActiveViewTab] = useState<'counter' | 'stats'>('counter');

  const getActiveDhikrs = (tab: TasbeehPrayerTab): PrayerDhikrItem[] => {
    switch (tab) {
      case 'fajr':
        return FAJR_DHIKRS;
      case 'dhuhr':
        return DHUHR_DHIKRS;
      case 'asr':
        return ASR_DHIKRS;
      case 'maghrib':
        return MAGHRIB_DHIKRS;
      case 'isha':
        return ISHA_DHIKRS;
      default:
        return [...DEFAULT_DHIKRS, ...userProfile.customDhikrs];
    }
  };

  const currentTabDhikrs = getActiveDhikrs(selectedPrayerTab);
  const [selectedDhikr, setSelectedDhikr] = useState<PrayerDhikrItem>(DEFAULT_DHIKRS[0]);
  const [count, setCount] = useState<number>(0);
  const [target, setTarget] = useState<number>(DEFAULT_DHIKRS[0].target);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [isBeadAnimating, setIsBeadAnimating] = useState<boolean>(false);

  // Manual Name Edit state
  const [isEditingName, setIsEditingName] = useState(false);
  const [manualTitle, setManualTitle] = useState(selectedDhikr.title);

  // Manual Count Input Modal state
  const [showManualCountModal, setShowManualCountModal] = useState<boolean>(false);
  const [manualCountInput, setManualCountInput] = useState<string>('');
  const [manualLifetimeInput, setManualLifetimeInput] = useState<string>('');

  // Custom Dhikr Modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customArabic, setCustomArabic] = useState('');
  const [customTrans, setCustomTrans] = useState('');
  const [customTarget, setCustomTarget] = useState('33');

  const handleSelectDhikr = (d: PrayerDhikrItem | TasbeehDhikr) => {
    setSelectedDhikr(d as PrayerDhikrItem);
    setManualTitle(d.title);
    setTarget(d.target);
    setCount(0);
    setIsEditingName(false);
  };

  const handleSelectPrayerTab = (tab: TasbeehPrayerTab) => {
    setSelectedPrayerTab(tab);
    const dhikrs = getActiveDhikrs(tab);
    if (dhikrs.length > 0) {
      handleSelectDhikr(dhikrs[0]);
    }
  };

  const handleSaveManualName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;
    const updated: TasbeehDhikr = {
      ...selectedDhikr,
      title: manualTitle.trim(),
    };
    setSelectedDhikr(updated);
    setIsEditingName(false);
  };

  const handleApplyManualCount = (e: React.FormEvent) => {
    e.preventDefault();
    const newCountVal = parseInt(manualCountInput, 10);
    if (!isNaN(newCountVal) && newCountVal >= 0) {
      const diff = newCountVal - count;
      setCount(newCountVal);
      if (diff > 0) {
        onUpdateTasbeehTotal(userProfile.totalTasbeehCount + diff, selectedDhikr.title, diff);
      }
    }

    const newLifetimeVal = parseInt(manualLifetimeInput, 10);
    if (!isNaN(newLifetimeVal) && newLifetimeVal >= 0) {
      const diff = newLifetimeVal - userProfile.totalTasbeehCount;
      onUpdateTasbeehTotal(newLifetimeVal, selectedDhikr.title, diff > 0 ? diff : 0);
    }

    setShowManualCountModal(false);
    setManualCountInput('');
    setManualLifetimeInput('');
  };

  const handleTap = () => {
    setIsBeadAnimating(true);
    setTimeout(() => setIsBeadAnimating(false), 120);

    const nextCount = count + 1;
    setCount(nextCount);

    // Audio & Haptic
    if (soundEnabled) {
      playTasbeehClick((nextCount % target) * 2);
    }
    if (vibrationEnabled && 'vibrate' in navigator) {
      try {
        navigator.vibrate(nextCount === target ? [50, 50, 100] : 15);
      } catch {
        // ignore
      }
    }

    // Lifetime & Daily Tally
    onUpdateTasbeehTotal(userProfile.totalTasbeehCount + 1, selectedDhikr.title, 1);

    // Target reached
    if (nextCount === target) {
      playCompletionChime();
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#10b981', '#f59e0b', '#06b6d4'],
        });
      } catch {
        // ignore
      }
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const newDhikr: TasbeehDhikr = {
      id: 'custom-' + Date.now(),
      title: customTitle,
      arabic: customArabic || customTitle,
      transliteration: customTrans,
      translation: customTitle,
      target: parseInt(customTarget, 10) || 33,
      count: 0,
      totalSaved: 0,
    };

    onSaveCustomDhikr(newDhikr);
    setSelectedDhikr(newDhikr);
    setTarget(newDhikr.target);
    setCount(0);
    setShowAddModal(false);
    setCustomTitle('');
    setCustomArabic('');
    setCustomTrans('');
  };

  const progressPercent = Math.min(100, Math.round((count / target) * 100));

  return (
    <div className="space-y-6 pb-20 sm:pb-12 max-w-xl mx-auto px-2 sm:px-0 animate-fade-in text-center">
      {/* Top Segmented Mode Selector: Active Counter vs Daily & Weekly Stats */}
      <div className="flex items-center justify-center p-1.5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-sm max-w-sm mx-auto">
        <button
          onClick={() => setActiveViewTab('counter')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeViewTab === 'counter'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <CircleDot className="w-3.5 h-3.5" />
          <span>Active Counter</span>
        </button>
        <button
          onClick={() => setActiveViewTab('stats')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeViewTab === 'stats'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Weekly & Daily Stats</span>
        </button>
      </div>

      {activeViewTab === 'stats' ? (
        <TasbeehStats userProfile={userProfile} />
      ) : (
        <>
          {/* Header card with lifetime total */}
          <div className="bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-800">
            <div className="flex items-center justify-between gap-4">
              <div className="text-left">
                <h2 className="text-xl font-medium font-serif text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  Digital Tasbeeh & Dhikr Counter
                </h2>
                <p className="text-xs text-neutral-400">
                  Tactile bead feedback, customizable dhikrs & target milestones
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-center min-w-[120px]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                  Lifetime Total
                </span>
                <div className="text-2xl font-bold font-mono text-emerald-300">
                  {userProfile.totalTasbeehCount.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Daily After-Prayer Tabs (Fajr, Dhuhr, Asr, Maghrib, Isha) */}
            <div className="mt-4 pt-4 border-t border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Daily Prayer Adhkar
                </span>
                <span className="text-[11px] text-emerald-400 font-mono font-bold">
                  {currentTabDhikrs.length} Sunnah Adhkar
                </span>
              </div>

              {/* Prayer Tab Buttons: All, After Fajr, After Dhuhr, After Asr, After Maghrib, After Isha */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {PRAYER_DHIKR_TABS.map((tab) => {
                  const isActive = selectedPrayerTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      id={`tasbeeh-prayer-tab-${tab.id}`}
                      onClick={() => handleSelectPrayerTab(tab.id)}
                      className={`py-2 px-2 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center border ${
                        isActive
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md font-bold ring-2 ring-emerald-500/30'
                          : 'bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 border-neutral-700/80'
                      }`}
                    >
                      <span className="text-xs font-semibold leading-tight">{tab.label}</span>
                      <span className={`text-[10px] font-arabic mt-0.5 ${isActive ? 'text-emerald-100 font-bold' : 'text-emerald-400'}`}>
                        {tab.urduLabel}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Tab Hadith / Sunnah Summary Banner */}
              <div className="mt-2.5 p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-left flex items-start gap-2 text-[11px] text-neutral-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{PRAYER_DHIKR_TABS.find((t) => t.id === selectedPrayerTab)?.hadithSummary}</span>
              </div>
            </div>

            {/* Dhikr Selector Carousel */}
            <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {currentTabDhikrs.map((d) => {
                const isSelected = selectedDhikr.id === d.id;
                return (
                  <button
                    key={d.id}
                    id={`tasbeeh-dhikr-btn-${d.id}`}
                    onClick={() => handleSelectDhikr(d)}
                    className={`px-3.5 py-2 rounded-2xl border text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 text-left ${
                      isSelected
                        ? 'bg-emerald-900/50 text-emerald-200 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    <span>{d.title}</span>
                    <span className="ml-1 font-mono text-[11px] opacity-75">({d.target})</span>
                  </button>
                );
              })}

              {selectedPrayerTab === 'all' && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-3.5 py-2 rounded-2xl border border-dashed border-emerald-500/60 text-emerald-400 text-xs font-semibold whitespace-nowrap flex items-center gap-1 hover:bg-emerald-950/30 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Custom
                </button>
              )}
            </div>
          </div>

      {/* Main Digital Tasbeeh Machine Card */}
      <div className="bg-neutral-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-800 space-y-6">
        {/* Selected Dhikr Display with Inline Manual Name Edit */}
        <div className="space-y-1">
          <div className="font-arabic text-2xl sm:text-3xl text-emerald-400 font-bold leading-loose" dir="rtl">
            {selectedDhikr.arabic}
          </div>

          {isEditingName ? (
            <form onSubmit={handleSaveManualName} className="flex items-center justify-center gap-2 max-w-sm mx-auto">
              <input
                type="text"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                placeholder="Enter tasbeeh name manually"
                className="w-full px-3 py-1.5 rounded-xl bg-neutral-800 border border-emerald-600 text-sm text-white focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditingName(false)}
                className="px-2 py-1.5 rounded-xl bg-neutral-800 text-neutral-400 text-xs"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <h3 className="font-semibold text-white text-lg">{selectedDhikr.title}</h3>
              <button
                onClick={() => {
                  setManualTitle(selectedDhikr.title);
                  setIsEditingName(true);
                }}
                className="p-1 text-neutral-400 hover:text-emerald-400 transition-colors cursor-pointer"
                title="Edit Tasbeeh name manually"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {selectedDhikr.timingNote && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-800/60">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>{selectedDhikr.timingNote}</span>
            </div>
          )}

          {selectedDhikr.urduMeaning && (
            <p className="text-xs text-emerald-300/90 font-urdu mt-1" dir="rtl">
              {selectedDhikr.urduMeaning}
            </p>
          )}

          {selectedDhikr.transliteration && (
            <p className="text-xs text-neutral-300 italic">
              {selectedDhikr.transliteration} • {selectedDhikr.translation}
            </p>
          )}

          {selectedDhikr.hadithRef && (
            <div className="max-w-md mx-auto p-2.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-[11px] text-neutral-300 leading-relaxed text-left flex items-start gap-2 mt-2">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{selectedDhikr.hadithRef}</span>
            </div>
          )}
        </div>

        {/* Big Circular Counter Ring & Tap Button */}
        <div className="flex flex-col items-center justify-center relative py-2">
          {/* Target Milestone Progress Ring */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              {/* Track */}
              <circle
                cx="50%"
                cy="50%"
                r="42%"
                className="text-neutral-800 stroke-current"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Progress */}
              <circle
                cx="50%"
                cy="50%"
                r="42%"
                className="text-emerald-500 stroke-current transition-all duration-150"
                strokeWidth="12"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Tap Action Center Disk */}
            <button
              id="tasbeeh-tap-action-btn"
              onClick={handleTap}
              className={`absolute w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-2xl shadow-emerald-950/60 flex flex-col items-center justify-center transition-transform active:scale-90 cursor-pointer select-none border-4 border-neutral-800 ${
                isBeadAnimating ? 'scale-95' : 'scale-100'
              }`}
            >
              <span className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tight leading-none drop-shadow">
                {count}
              </span>
              <span className="text-xs font-semibold text-emerald-200 mt-1 uppercase tracking-wider">
                Tap / Count
              </span>
              <span className="text-[10px] opacity-80 mt-0.5">Target: {target}</span>
            </button>
          </div>
        </div>

        {/* Quick Target Selectors & Reset */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs font-semibold text-neutral-400 mr-1">Target:</span>
          {[33, 99, 100, 1000].map((t) => (
            <button
              key={t}
              onClick={() => setTarget(t)}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                target === t
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {t}
            </button>
          ))}

          {/* Manual Enter Total / Count Button */}
          <button
            onClick={() => {
              setManualCountInput(count.toString());
              setManualLifetimeInput(userProfile.totalTasbeehCount.toString());
              setShowManualCountModal(true);
            }}
            className="px-3 py-1 rounded-xl bg-neutral-800 hover:bg-emerald-950/60 hover:text-emerald-300 text-neutral-300 text-xs font-semibold border border-neutral-700 flex items-center gap-1 transition-all cursor-pointer"
            title="Enter Count or Total Manually"
          >
            <Hash className="w-3.5 h-3.5 text-emerald-400" />
            <span>Enter Manually</span>
          </button>

          {/* Reset Button */}
          <button
            id="tasbeeh-reset-btn"
            onClick={handleReset}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-rose-950/60 hover:text-rose-400 text-neutral-400 transition-colors ml-2 cursor-pointer"
            title="Reset Count to 0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Sound & Vibration Controls */}
        <div className="flex items-center justify-center gap-4 pt-2 border-t border-neutral-800 text-xs text-neutral-400">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 font-semibold'
                : 'border-neutral-700 text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            Sound {soundEnabled ? 'On' : 'Off'}
          </button>

          <button
            onClick={() => setVibrationEnabled(!vibrationEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
              vibrationEnabled
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 font-semibold'
                : 'border-neutral-700 text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Haptic {vibrationEnabled ? 'On' : 'Off'}
          </button>
        </div>
      </div>
        </>
      )}

      {/* Manual Count & Lifetime Entry Modal */}
      {showManualCountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in text-left">
          <div className="w-full max-w-md bg-neutral-900 rounded-3xl p-6 shadow-2xl border border-neutral-800 space-y-4">
            <h3 className="text-lg font-medium font-serif text-white flex items-center gap-2">
              <Hash className="w-5 h-5 text-emerald-400" />
              Enter Count / Total Manually
            </h3>
            <p className="text-xs text-neutral-400">
              Update your active counter or sync your past lifetime dhikr tallies directly.
            </p>

            <form onSubmit={handleApplyManualCount} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase mb-1">
                  Active Counter (Current Dhikr)
                </label>
                <input
                  type="number"
                  min="0"
                  max="1000000"
                  value={manualCountInput}
                  onChange={(e) => setManualCountInput(e.target.value)}
                  placeholder="e.g. 33, 100, 500"
                  className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm font-mono text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase mb-1">
                  Overall Lifetime Total
                </label>
                <input
                  type="number"
                  min="0"
                  max="100000000"
                  value={manualLifetimeInput}
                  onChange={(e) => setManualLifetimeInput(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm font-mono text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualCountModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:bg-neutral-800 text-sm font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow cursor-pointer transition-colors"
                >
                  Apply Count
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Custom Dhikr Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in text-left">
          <div className="w-full max-w-md bg-neutral-900 rounded-3xl p-6 shadow-2xl border border-neutral-800 space-y-4">
            <h3 className="text-lg font-medium font-serif text-white">Create Custom Dhikr / Wazeefa</h3>

            <form onSubmit={handleAddCustom} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase mb-1">Dhikr Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HasbunAllahu wa ni'mal wakeel"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase mb-1">Arabic Text (Optional)</label>
                <input
                  type="text"
                  placeholder="حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ"
                  value={customArabic}
                  onChange={(e) => setCustomArabic(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm font-arabic text-right text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase mb-1">Target Count</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100000"
                  value={customTarget}
                  onChange={(e) => setCustomTarget(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm font-mono text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:bg-neutral-800 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow cursor-pointer transition-colors"
                >
                  Save Dhikr
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
