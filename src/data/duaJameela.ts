export interface DuaJameelaData {
  title: string;
  titleArabic: string;
  titleUrdu: string;
  category: string;
  description: string;
  virtues: string[];
  arabicOpening: string;
  phrases: Array<{
    id: number;
    arabic: string;
    transliteration: string;
    meaningUr: string;
    meaningEn: string;
  }>;
  closingArabic: string;
  closingUrdu: string;
  closingEnglish: string;
  closingTransliteration: string;
}

export const DUA_JAMEELA: DuaJameelaData = {
  title: 'Dua Jameela (The Beautiful Supplication)',
  titleArabic: 'دُعَاءُ الْجَمِيلَة',
  titleUrdu: 'دعائے جمیلہ مبارک',
  category: 'Special Duas (دعائے جمیلہ)',
  description: 'One of the most blessed and widely recited supplications in the Islamic tradition and Madani Panj Surah. Contains praise of Allah Almighty by His magnificent Divine Attributes.',
  virtues: [
    'Traditional scholarship and Dawat-e-Islami traditions mention great spiritual blessings, peace of heart, and acceptance of supplications for the one who recites it regularly.',
    'It contains comprehensive Tawheed (Monotheism), calling upon Allah by His Most Sublime Names (Al-Asma-ul-Husna).',
    'Recommended to recite with Wudu, especially after morning (Fajr) or Friday prayers, seeking forgiveness, protection from calamity, and abundant Rizq (halal sustenance).',
  ],
  arabicOpening: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  phrases: [
    { id: 1, arabic: 'يَا جَمِيلُ يَا اللَّهُ', transliteration: 'Yā Jamīlu Yā Allāh', meaningUr: 'اے کمال حسن و جمال والے اے اللہ!', meaningEn: 'O Beautiful One! O Allah!' },
    { id: 2, arabic: 'يَا قَرِيبُ يَا اللَّهُ', transliteration: 'Yā Qarību Yā Allāh', meaningUr: 'اے سب سے زیادہ قریب اے اللہ!', meaningEn: 'O Ever Near One! O Allah!' },
    { id: 3, arabic: 'يَا مُجِيبُ يَا اللَّهُ', transliteration: 'Yā Mujību Yā Allāh', meaningUr: 'اے دعائیں قبول فرمانے والے اے اللہ!', meaningEn: 'O Answerer of Prayers! O Allah!' },
    { id: 4, arabic: 'يَا حَبِيبُ يَا اللَّهُ', transliteration: 'Yā Ḥabību Yā Allāh', meaningUr: 'اے سب کے محبوب اے اللہ!', meaningEn: 'O Beloved One! O Allah!' },
    { id: 5, arabic: 'يَا رَؤُوفُ يَا اللَّهُ', transliteration: 'Yā Ra’ūfu Yā Allāh', meaningUr: 'اے بے پایاں مہربان اے اللہ!', meaningEn: 'O Compassionate One! O Allah!' },
    { id: 6, arabic: 'يَا عَطُوفُ يَا اللَّهُ', transliteration: 'Yā ‘Aṭūfu Yā Allāh', meaningUr: 'اے شفقت و کرم فرمانے والے اے اللہ!', meaningEn: 'O Most Affectionate One! O Allah!' },
    { id: 7, arabic: 'يَا مَعْرُوفُ يَا اللَّهُ', transliteration: 'Yā Ma‘rūfu Yā Allāh', meaningUr: 'اے اپنی نشانیوں سے پہچانے گئے اے اللہ!', meaningEn: 'O Well-Known by Signs! O Allah!' },
    { id: 8, arabic: 'يَا لَطِيفُ يَا اللَّهُ', transliteration: 'Yā Laṭīfu Yā Allāh', meaningUr: 'اے باریک بین اور لطف و کرم والے اے اللہ!', meaningEn: 'O Subtle & Kind One! O Allah!' },
    { id: 9, arabic: 'يَا عَظِيمُ يَا اللَّهُ', transliteration: 'Yā ‘Aẓīmu Yā Allāh', meaningUr: 'اے سب سے بڑی عظمت و جلال والے اے اللہ!', meaningEn: 'O Magnificent & Tremendous One! O Allah!' },
    { id: 10, arabic: 'يَا حَنَّانُ يَا اللَّهُ', transliteration: 'Yā Ḥannānu Yā Allāh', meaningUr: 'اے کمال رحمت فرمانے والے اے اللہ!', meaningEn: 'O Source of Deep Pity & Mercy! O Allah!' },
    { id: 11, arabic: 'يَا مَنَّانُ يَا اللَّهُ', transliteration: 'Yā Mannānu Yā Allāh', meaningUr: 'اے احسان و نعمتیں عطا فرمانے والے اے اللہ!', meaningEn: 'O Bestower of Favors! O Allah!' },
    { id: 12, arabic: 'يَا دَيَّانُ يَا اللَّهُ', transliteration: 'Yā Dayyānu Yā Allāh', meaningUr: 'اے جزا اور بدلہ دینے والے حاکم اے اللہ!', meaningEn: 'O Supreme Judge & Requiter! O Allah!' },
    { id: 13, arabic: 'يَا سُبْحَانُ يَا اللَّهُ', transliteration: 'Yā Subḥānu Yā Allāh', meaningUr: 'اے ہر عیب و نقص سے پاک اے اللہ!', meaningEn: 'O Pure & Flawless One! O Allah!' },
    { id: 14, arabic: 'يَا أَمَانُ يَا اللَّهُ', transliteration: 'Yā Amānu Yā Allāh', meaningUr: 'اے خوف سے امان دینے والے اے اللہ!', meaningEn: 'O Granter of Safety! O Allah!' },
    { id: 15, arabic: 'يَا بُرْهَانُ يَا اللَّهُ', transliteration: 'Yā Burhānu Yā Allāh', meaningUr: 'اے واضح حجت و دلیل والے اے اللہ!', meaningEn: 'O Clear Proof! O Allah!' },
    { id: 16, arabic: 'يَا سُلْطَانُ يَا اللَّهُ', transliteration: 'Yā Sulṭānu Yā Allāh', meaningUr: 'اے مطلق بادشاہی اور غلبے والے اے اللہ!', meaningEn: 'O Sovereign Lord! O Allah!' },
    { id: 17, arabic: 'يَا مُسْتَعَانُ يَا اللَّهُ', transliteration: 'Yā Musta‘ānu Yā Allāh', meaningUr: 'اے وہ ذات جس سے مدد مانگی جائے اے اللہ!', meaningEn: 'O One Whose Help is Sought! O Allah!' },
    { id: 18, arabic: 'يَا مُحْسِنُ يَا اللَّهُ', transliteration: 'Yā Muḥsinu Yā Allāh', meaningUr: 'اے بھلائی اور احسان فرمانے والے اے اللہ!', meaningEn: 'O Benefactor! O Allah!' },
    { id: 19, arabic: 'يَا رَحْمَٰنُ يَا اللَّهُ', transliteration: 'Yā Raḥmānu Yā Allāh', meaningUr: 'اے بے پایاں رحم فرمانے والے اے اللہ!', meaningEn: 'O All-Merciful! O Allah!' },
    { id: 20, arabic: 'يَا رَحِيمُ يَا اللَّهُ', transliteration: 'Yā Raḥīmu Yā Allāh', meaningUr: 'اے نہایت رحم فرمانے والے اے اللہ!', meaningEn: 'O Ever-Merciful! O Allah!' },
    { id: 21, arabic: 'يَا كَرِيمُ يَا اللَّهُ', transliteration: 'Yā Karīmu Yā Allāh', meaningUr: 'اے بے انتہا کرم فرمانے والے اے اللہ!', meaningEn: 'O Most Generous One! O Allah!' },
    { id: 22, arabic: 'يَا مَجِيدُ يَا اللَّهُ', transliteration: 'Yā Majīdu Yā Allāh', meaningUr: 'اے بزرگی اور شرف والے اے اللہ!', meaningEn: 'O All-Glorious One! O Allah!' },
    { id: 23, arabic: 'يَا فَرْدُ يَا اللَّهُ', transliteration: 'Yā Fardu Yā Allāh', meaningUr: 'اے یگانہ و بے مثل اے اللہ!', meaningEn: 'O Unique One! O Allah!' },
    { id: 24, arabic: 'يَا وِتْرُ يَا اللَّهُ', transliteration: 'Yā Witru Yā Allāh', meaningUr: 'اے طاق و یکتا اے اللہ!', meaningEn: 'O Odd & Peerless One! O Allah!' },
    { id: 25, arabic: 'يَا أَحَدُ يَا اللَّهُ', transliteration: 'Yā Aḥadu Yā Allāh', meaningUr: 'اے اکیلے و واحد معبود اے اللہ!', meaningEn: 'O The Sole One! O Allah!' },
    { id: 26, arabic: 'يَا صَمَدُ يَا اللَّهُ', transliteration: 'Yā Ṣamadu Yā Allāh', meaningUr: 'اے بے نیاز سب کے سہارے اے اللہ!', meaningEn: 'O Eternal Refuge! O Allah!' },
    { id: 27, arabic: 'يَا مَحْمُودُ يَا اللَّهُ', transliteration: 'Yā Maḥmūdu Yā Allāh', meaningUr: 'اے تعریف کے لائق اے اللہ!', meaningEn: 'O Praised One! O Allah!' },
    { id: 28, arabic: 'يَا صَادِقَ الْوَعْدِ يَا اللَّهُ', transliteration: 'Yā Ṣādiqal-Wa‘di Yā Allāh', meaningUr: 'اے وعدے کے سچے اے اللہ!', meaningEn: 'O True to Your Promise! O Allah!' },
    { id: 29, arabic: 'يَا عَلِيُّ يَا اللَّهُ', transliteration: 'Yā ‘Aliyyu Yā Allāh', meaningUr: 'اے سب سے بلند و بالا اے اللہ!', meaningEn: 'O Most High! O Allah!' },
    { id: 30, arabic: 'يَا غَنِيُّ يَا اللَّهُ', transliteration: 'Yā Ghaniyyu Yā Allāh', meaningUr: 'اے سب سے بے نیاز اور غنی اے اللہ!', meaningEn: 'O Self-Sufficient One! O Allah!' },
    { id: 31, arabic: 'يَا شَافِي يَا اللَّهُ', transliteration: 'Yā Shāfī Yā Allāh', meaningUr: 'اے بیماریوں سے شفا بخشنے والے اے اللہ!', meaningEn: 'O Healer & Cure! O Allah!' },
    { id: 32, arabic: 'يَا كَافِي يَا اللَّهُ', transliteration: 'Yā Kāfī Yā Allāh', meaningUr: 'اے تمام ضرورتوں کے لیے کافی اے اللہ!', meaningEn: 'O Sufficient One! O Allah!' },
    { id: 33, arabic: 'يَا مُعَافِي يَا اللَّهُ', transliteration: 'Yā Mu‘āfī Yā Allāh', meaningUr: 'اے عافیت اور معافی دینے والے اے اللہ!', meaningEn: 'O Bestower of Well-Being! O Allah!' },
    { id: 34, arabic: 'يَا بَاقِي يَا اللَّهُ', transliteration: 'Yā Bāqī Yā Allāh', meaningUr: 'اے ہمیشہ باقی رہنے والے اے اللہ!', meaningEn: 'O Everlasting One! O Allah!' },
    { id: 35, arabic: 'يَا هَادِي يَا اللَّهُ', transliteration: 'Yā Hādī Yā Allāh', meaningUr: 'اے سیدھا راستہ دکھانے والے اے اللہ!', meaningEn: 'O Guide to the Straight Path! O Allah!' },
    { id: 36, arabic: 'يَا قَادِرُ يَا اللَّهُ', transliteration: 'Yā Qādiru Yā Allāh', meaningUr: 'اے ہر چیز پر قدرت رکھنے والے اے اللہ!', meaningEn: 'O All-Powerful One! O Allah!' },
    { id: 37, arabic: 'يَا سَاتِرُ يَا اللَّهُ', transliteration: 'Yā Sātiru Yā Allāh', meaningUr: 'اے عیبوں کو چھپانے والے اے اللہ!', meaningEn: 'O Concealer of Faults! O Allah!' },
    { id: 38, arabic: 'يَا قَهَّارُ يَا اللَّهُ', transliteration: 'Yā Qahhāru Yā Allāh', meaningUr: 'اے سب پر غالب و زبردست اے اللہ!', meaningEn: 'O Subduer of All! O Allah!' },
    { id: 39, arabic: 'يَا جَبَّارُ يَا اللَّهُ', transliteration: 'Yā Jabbāru Yā Allāh', meaningUr: 'اے بگڑے کام سنوارنے والے زبردست اے اللہ!', meaningEn: 'O Restorer & Compeller! O Allah!' },
    { id: 40, arabic: 'يَا غَفَّارُ يَا اللَّهُ', transliteration: 'Yā Ghaffāru Yā Allāh', meaningUr: 'اے گناہوں کو کثرت سے بخشنے والے اے اللہ!', meaningEn: 'O Perpetual Forgiver! O Allah!' },
    { id: 41, arabic: 'يَا فَتَّاحُ يَا اللَّهُ', transliteration: 'Yā Fattāḥu Yā Allāh', meaningUr: 'اے رحمت و فتح کے دروازے کھولنے والے اے اللہ!', meaningEn: 'O Supreme Opener! O Allah!' },
    { id: 42, arabic: 'يَا رَزَّاقُ يَا اللَّهُ', transliteration: 'Yā Razzāqu Yā Allāh', meaningUr: 'اے بے حساب رزق دینے والے اے اللہ!', meaningEn: 'O Provider of Sustenance! O Allah!' },
    { id: 43, arabic: 'يَا عَلِيمُ يَا اللَّهُ', transliteration: 'Yā ‘Alīmu Yā Allāh', meaningUr: 'اے ہر بات جاننے والے علیم اے اللہ!', meaningEn: 'O All-Knowing One! O Allah!' },
    { id: 44, arabic: 'يَا حَكِيمُ يَا اللَّهُ', transliteration: 'Yā Ḥakīmu Yā Allāh', meaningUr: 'اے کمال حکمت والے اے اللہ!', meaningEn: 'O Most Wise! O Allah!' },
    { id: 45, arabic: 'يَا سَمِيعُ يَا اللَّهُ', transliteration: 'Yā Samī‘u Yā Allāh', meaningUr: 'اے ہر پکار سننے والے اے اللہ!', meaningEn: 'O All-Hearing One! O Allah!' },
    { id: 46, arabic: 'يَا بَصِيرُ يَا اللَّهُ', transliteration: 'Yā Baṣīru Yā Allāh', meaningUr: 'اے ہر حال دیکھنے والے اے اللہ!', meaningEn: 'O All-Seeing One! O Allah!' },
    { id: 47, arabic: 'يَا حَيُّ يَا قَيُّومُ يَا اللَّهُ', transliteration: 'Yā Ḥayyu Yā Qayyūmu Yā Allāh', meaningUr: 'اے خود زندہ اور کائنات کو قائم رکھنے والے اے اللہ!', meaningEn: 'O Ever-Living, Self-Sustaining Lord! O Allah!' },
    { id: 48, arabic: 'يَا ذَا الْجَلَالِ وَالْإِكْرَامِ يَا اللَّهُ', transliteration: 'Yā Dhal-Jalāli wal-Ikrāmi Yā Allāh', meaningUr: 'اے عظمت، جلالت اور بزرگی والے اے اللہ!', meaningEn: 'O Lord of Majesty and Bounty! O Allah!' },
  ],
  closingArabic: 'اللَّهُمَّ اغْفِرْ لَنَا، وَارْحَمْنَا، وَتُبْ عَلَيْنَا، وَعَافِنَا وَاعْفُ عَنَّا، وَاقْضِ حَاجَاتِنَا، وَاشْفِ مَرْضَانَا، وَارْحَمْ مَوْتَانَا، وَصَلَّى اللَّهُ تَعَالَى عَلَى خَيْرِ خَلْقِهِ سَيِّدِنَا وَمَوْلَانَا مُحَمَّدٍ وَآلِهِ وَصَحْبِهِ أَجْمَعِينَ، بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ.',
  closingTransliteration: 'Allāhummagh-fir lanā, war-ḥamnā, wa tub ‘alaynā, wa ‘āfinā wa‘fu ‘annā, waq-ḍi ḥājātinā, wash-fi marḍānā, war-ḥam mawtānā, wa ṣallallāhu Ta‘ālā ‘alā khayri khalqihī Sayyidinā wa Mawlānā Muḥammadin wa ālihī wa ṣaḥbihī ajma‘īn, bi-raḥmatika yā Arḥamar-Rāḥimīn.',
  closingUrdu: 'اے اللہ! ہمیں بخش دے، ہم پر رحم فرما، ہماری توبہ قبول فرما، ہمیں عافیت عطا فرما اور ہم سے درگزر فرما، ہماری حاجتیں پوری فرما، ہمارے بیماروں کو شفا بخش، اور ہمارے مرحومین پر رحم فرما۔ اور اللہ تعالیٰ درود و سلام نازل فرمائے اپنی مخلوق کے بہترین سردار ہمارے آقا و مولا حضرت محمد مصطفیٰ ﷺ پر اور آپ کی تمام آل اور اصحاب پر، تیری رحمت کے طفیل اے سب سے زیادہ رحم فرمانے والے!',
  closingEnglish: 'O Allah! Forgive us, have mercy on us, accept our repentance, grant us well-being, pardon us, fulfill our needs, heal our sick, and have mercy upon our deceased. And may Allah send blessings and peace upon the best of His creation, our Master and Guide Muhammad (ﷺ), and upon his family and all his companions, by Your infinite mercy, O Most Merciful of the merciful!',
};
