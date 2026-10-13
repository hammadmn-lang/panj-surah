import { DuaItem } from '../types';
import { MANZIL_COLLECTION } from './manzilData';

export const DUAS_COLLECTION: DuaItem[] = [
  // ==========================================
  // MANZIL (منزل مبارک - 33 Protective Verses)
  // ==========================================
  ...MANZIL_COLLECTION,

  // ==========================================
  // SIX KALIMAS (6 کلماتِ اسلام)
  // ==========================================
  {
    id: 'kalima-first-tayyibah',
    category: 'Six Kalimas (کلمات)',
    title: 'First Kalima: Tayyibah (کلمہ طیبہ - The Word of Purity)',
    arabicText: 'لَا إِلٰهَ إِلَّا اللَّهُ مُحَمَّدٌ رَّسُولُ اللَّهِ',
    transliteration: 'Lā ilāha illallāhu Muḥammadur-Rasūlullāh.',
    translation: 'There is no deity worthy of worship except Allah, and Muhammad (ﷺ) is the Messenger of Allah.',
    urduTranslation: 'اللہ کے سوا کوئی معبود نہیں، محمد (ﷺ) اللہ کے رسول ہیں۔',
    reference: 'Sahih al-Bukhari & Sahih Muslim',
    situation: 'The fundamental declaration of faith for every Muslim. Recited upon entering Islam, throughout the day, and at the end of life.',
    benefit: 'Prophet (ﷺ) said: "The best dhikr is La ilaha illallah." Whoever utters this sincerely from their heart will enter Jannah.',
  },
  {
    id: 'kalima-second-shahadat',
    category: 'Six Kalimas (کلمات)',
    title: 'Second Kalima: Shahadat (کلمہ شہادت - The Word of Testimony)',
    arabicText: 'أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    transliteration: 'Ash-hadu allā ilāha illallāhu waḥdahū lā sharīka lah, wa ash-hadu anna Muḥammadan ‘abduhū wa rasūluh.',
    translation: 'I bear witness that there is no deity except Allah, alone without partner, and I bear witness that Muhammad is His servant and Messenger.',
    urduTranslation: 'میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اور میں گواہی دیتا ہوں کہ محمد (ﷺ) اس کے بندے اور رسول ہیں۔',
    reference: 'Sahih Muslim (234) & Tashahhud',
    situation: 'Recited during Tashahhud in every prayer (Attahiyyat), after making Wudu, and during the Adhan/Iqamah response.',
    benefit: 'Prophet (ﷺ) said: "Whoever makes Wudu properly and recites this, all eight gates of Paradise are opened for him to enter from whichever he wills."',
  },
  {
    id: 'kalima-third-tamjeed',
    category: 'Six Kalimas (کلمات)',
    title: 'Third Kalima: Tamjeed (کلمہ تمجید - The Word of Glorification)',
    arabicText: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ',
    transliteration: 'Subḥānallāhi wal-ḥamdu lillāhi wa lā ilāha illallāhu wallāhu Akbar, wa lā ḥawla wa lā quwwata illā billāhil-‘Aliyyil-‘Aẓīm.',
    translation: 'Glory be to Allah, and all praise is for Allah, and there is no deity except Allah, and Allah is the Greatest. And there is no power nor might except with Allah, the Most High, the Most Supreme.',
    urduTranslation: 'اللہ پاک ہے، اور سب تعریفیں اللہ ہی کے لیے ہیں، اور اللہ کے سوا کوئی معبود نہیں، اور اللہ سب سے بڑا ہے، اور گناہوں سے بچنے کی طاقت اور نیکی کرنے کی قوت نہیں مگر اللہ کی توفیق سے جو بہت بلند اور عظمت والا ہے۔',
    reference: 'Sunan an-Nasa’i & Tirmidhi (3460)',
    situation: 'Recited as continuous daily Tasbeeh, in Salatul Tasbeeh, and after Salah.',
    benefit: 'These are the beloved four phrases to Allah (Al-Baqiyat as-Salihat) which wipe away sins like dry leaves falling from a tree.',
  },
  {
    id: 'kalima-fourth-tauheed',
    category: 'Six Kalimas (کلمات)',
    title: 'Fourth Kalima: Tauheed (کلمہ توحید - The Word of Divine Oneness)',
    arabicText: 'لَا إِلٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، يُحْيِي وَيُمِيتُ، وَهُوَ حَيٌّ لَّا يَمُوتُ أَبَدًا أَبَدًا، ذُو الْجَلَالِ وَالْإِكْرَامِ، بِيَدِهِ الْخَيْرُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'Lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu, yuḥyī wa yumītu, wa Huwa ḥayyul-lā yamūtu abadā, Dhul-Jalāli wal-Ikrām, bi-yadihil-khayr, wa Huwa ‘alā kulli shay’in Qadīr.',
    translation: 'There is no deity except Allah, alone without partner. To Him belongs the dominion and to Him belongs all praise. He gives life and causes death, and He is Ever-Living who never dies. Owner of Majesty and Honor, in His hand is all good, and He has power over all things.',
    urduTranslation: 'اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اسی کی بادشاہی ہے اور اسی کے لیے تمام تعریف ہے، وہی زندہ کرتا ہے اور وہی مارتا ہے، اور وہ ہمیشہ زندہ ہے اسے کبھی موت نہیں آئے گی، وہ عظمت اور بزرگی والا ہے، اسی کے ہاتھ میں تمام بھلائی ہے اور وہ ہر چیز پر قادر ہے۔',
    reference: 'Sahih al-Bukhari (3293) & Tirmidhi (3534)',
    situation: 'Recited 100 times in the morning and evening, or upon entering marketplaces.',
    benefit: 'Prophet (ﷺ) said: "Whoever says this 100 times in a day will have reward equal to freeing 10 slaves, 100 good deeds written, 100 bad deeds forgiven, and protection from Shaytan all day."',
  },
  {
    id: 'kalima-fifth-astaghfar',
    category: 'Six Kalimas (کلمات)',
    title: 'Fifth Kalima: Astaghfar (کلمہ استغفار - The Word of Penitence)',
    arabicText: 'أَسْتَغْفِرُ اللَّهَ رَبِّي مِنْ كُلِّ ذَنْبٍ أَذْنَبْتُهُ عَمْدًا أَوْ خَطَأً، سِرًّا أَوْ عَلَانِيَةً، وَأَتُوبُ إِلَيْهِ مِنَ الذَّنْبِ الَّذِي أَعْلَمُ وَمِنَ الذَّنْبِ الَّذِي لَا أَعْلَمُ، إِنَّكَ أَنْتَ عَلَّامُ الْغُيُوبِ وَسَتَّارُ الْعُيُوبِ وَغَفَّارُ الذُّنُوبِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ',
    transliteration: 'Astaghfirullāha Rabbī min kulli dhambin adhnabtuhū ‘amdan aw khaṭa’an, sirran aw ‘alāniyah, wa atūbu ilayhi minadh-dhambil-ladhī a‘lamu wa minadh-dhambil-ladhī lā a‘lam, innaka Anta ‘Allāmul-ghuyūbi wa Sattārul-‘uyūbi wa Ghaffārudh-dhunūb, wa lā ḥawla wa lā quwwata illā billāhil-‘Aliyyil-‘Aẓīm.',
    translation: 'I seek forgiveness from Allah, my Lord, for every sin I committed knowingly or unknowingly, secretly or openly. I turn to Him from the sins that I know and the sins that I know not. Indeed You are the Knower of the unseen, the Concealer of faults, and the Forgiver of sins. And there is no power nor might except with Allah, the Most High, the Most Supreme.',
    urduTranslation: 'میں اللہ سے بخشش مانگتا ہوں جو میرا رب ہے، ہر اس گناہ سے جو میں نے جان بوجھ کر کیا یا بھول کر، چھپ کر کیا یا کھلم کھلا، اور میں اس کی بارگاہ میں توبہ کرتا ہوں اس گناہ سے جس کو میں جانتا ہوں اور اس گناہ سے جس کو میں نہیں جانتا، بیشک تو غیب کی باتوں کو جاننے والا اور عیبوں کو چھپانے والا اور گناہوں کو بخشنے والا ہے، اور گناہ سے بچنے اور نیکی کرنے کی طاقت نہیں مگر اللہ کی توفیق سے۔',
    reference: 'Musnad Ahmad & Sunan Ibn Majah (Al-Istighfar)',
    situation: 'Recited for sincere Taubah (repentance) and spiritual purification every day.',
    benefit: 'Cleanses the heart, removes grief and anxiety, and opens the doors of abundant sustenance (Rizq).',
  },
  {
    id: 'kalima-sixth-radde-kufr',
    category: 'Six Kalimas (کلمات)',
    title: 'Sixth Kalima: Rad-de-Kufr (کلمہ رد کفر - The Word of Rejecting Disbelief)',
    arabicText: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ أَنْ أُشْرِكَ بِكَ شَيْئًا وَأَنَا أَعْلَمُ بِهِ، وَأَسْتَغْفِرُكَ لِمَا لَا أَعْلَمُ بِهِ، تُبْتُ عَنْهُ وَتَبَرَّأْتُ مِنَ الْكُفْرِ وَالشِّرْكِ وَالْكِذْبِ وَالْغِيبَةِ وَالْبِدْعَةِ وَالنَّمِيمَةِ وَالْفَوَاحِشِ وَالْبُهْتَانِ وَالْمَعَاصِي كُلِّهَا، وَأَسْلَمْتُ وَأَقُولُ: لَا إِلٰهَ إِلَّا اللَّهُ مُحَمَّدٌ رَّسُولُ اللَّهِ',
    transliteration: 'Allāhumma innī a‘ūdhu bika min an ushrika bika shay’aw-wa anā a‘lamu bih, wa astaghfiruka limā lā a‘lamu bih, tubtu ‘anhu wa tabarra’tu minal-kufri wash-shirki wal-kidhibi wal-ghībati wal-bid‘ati wan-namīmati wal-fawāḥishi wal-buhtāni wal-ma‘āṣī kullihā, wa aslamtu wa aqūlu: Lā ilāha illallāhu Muḥammadur-Rasūlullāh.',
    translation: 'O Allah, I seek Your protection from associating any partner with You knowingly, and I ask Your forgiveness for that which I do not know. I repent from it and disassociate myself from disbelief, polytheism, falsehood, backbiting, heresy, tale-bearing, indecency, slander, and all acts of disobedience. I surrender to Your will and declare: There is no deity except Allah, Muhammad is the Messenger of Allah.',
    urduTranslation: 'اے اللہ! میں تیری پناہ مانگتا ہوں اس بات سے کہ تیرے ساتھ کسی چیز کو شریک ٹھہراؤں جان بوجھ کر، اور تجھ سے معافی مانگتا ہوں اس کی جس کو میں نہیں جانتا، میں نے اس سے توبہ کی اور میں بیزار ہوا کفر سے، شرک سے، جھوٹ سے، غیبت سے، بدعت سے، چغلی سے، بے حیائی کے کاموں سے، بہتان سے اور تمام گناہوں سے، اور میں اسلام لایا اور میں کہتا ہوں کہ اللہ کے سوا کوئی معبود نہیں، محمد (ﷺ) اللہ کے رسول ہیں۔',
    reference: 'Musnad Ahmad (4/403) & Al-Adab al-Mufrad (716)',
    situation: 'Recited for safeguarding one’s Iman and protecting oneself from minor & major Shirk and hidden hypocrisies.',
    benefit: 'Prophet (ﷺ) taught this to Abu Bakr (RA) as the supreme antidote to Shirk that is subtler than the footstep of an ant.',
  },

  // ==========================================
  // IMAN-E-MUFASSAL & IMAN-E-MUJMAL (ایمانِ مفصل اور ایمانِ مجمل)
  // ==========================================
  {
    id: 'iman-mujmal',
    category: 'Iman Mufassal & Mujmal (ایمان)',
    title: 'Iman-e-Mujmal (ایمانِ مجمل - Declaration of Faith in Brief)',
    arabicText: 'آمَنْتُ بِاللَّهِ كَمَا هُوَ بِأَسْمَائِهِ وَصِفَاتِهِ، وَقَبِلْتُ جَمِيعَ أَحْكَامِهِ',
    transliteration: 'Āmantu billāhi kamā huwa bi-asmā’ihī wa ṣifātih, wa qabiltu jamī‘a aḥkāmih.',
    translation: 'I believe in Allah as He is with His sublime Names and Attributes, and I wholeheartedly accept all of His divine commands and ordinances.',
    urduTranslation: 'میں ایمان لایا اللہ پر جیسا کہ وہ اپنے ناموں اور اپنی صفتوں کے ساتھ ہے، اور میں نے اس کے تمام احکام کو قبول کیا۔',
    reference: 'Classical Islamic Creed (Aqeedah Tahawiyyah & Fiqh Akbar)',
    situation: 'Core declaration of Islamic faith affirming unconditional acceptance of Allah’s sovereignty and sacred shariah.',
    benefit: 'Deepens the believer’s surrender and tranquil conviction in the perfection and commandments of Allah.',
  },
  {
    id: 'iman-mufassal',
    category: 'Iman Mufassal & Mujmal (ایمان)',
    title: 'Iman-e-Mufassal (ایمانِ مفصل - Declaration of Faith in Detail)',
    arabicText: 'آمَنْتُ بِاللَّهِ، وَمَلَائِكَتِهِ، وَكُتُبِهِ، وَرُسُلِهِ، وَالْيَوْمِ الْآخِرِ، وَالْقَدْرِ خَيْرِهِ وَشَرِّهِ مِنَ اللَّهِ تَعَالَىٰ، وَالْبَعْثِ بَعْدَ الْمَوْتِ',
    transliteration: 'Āmantu billāhi, wa malā’ikatihī, wa kutubihī, wa rusulihī, wal-yawmil-ākhiri, wal-qadri khayrihī wa sharrihī minallāhi Ta‘ālā, wal-ba‘thi ba‘dal-mawt.',
    translation: 'I believe in Allah, in His Angels, in His revealed Scriptures, in His Messengers, in the Last Day (Day of Judgment), in Destiny (Qadr)—that all good and bad is determined by Allah the Exalted—and in the Resurrection after death.',
    urduTranslation: 'میں ایمان لایا اللہ پر، اس کے فرشتوں پر، اس کی کتابوں پر، اس کے رسولوں پر، قیامت کے دن پر، اور اس بات پر کہ اچھی اور بری تقدیر اللہ تعالیٰ کی طرف سے ہے، اور موت کے بعد دوبارہ زندہ کیے جانے پر۔',
    reference: 'Surah Al-Baqarah (2:285) & Sahih Muslim (Hadith Jibril)',
    situation: 'The 6 fundamental Pillars of Faith (Arkan al-Iman) recited to reinforce complete Islamic creed.',
    benefit: 'Affirms complete Islamic Aqeedah; guarantees ideological firmness against doubts and trials of the modern world.',
  },

  // ==========================================
  // EATING & DRINKING PRAYERS (کھانے پینے کی دعائیں)
  // ==========================================
  {
    id: 'dua-before-eating',
    category: 'Eating & Drinking (کھانا پینا)',
    title: 'Dua Before Eating Food (کھانا کھانے سے پہلے کی دعا)',
    arabicText: 'بِسْمِ اللَّهِ وَعَلَىٰ بَرَكَةِ اللَّهِ',
    transliteration: 'Bismillāhi wa ‘alā barakatillāh.',
    translation: 'In the name of Allah and upon the blessings of Allah [I begin eating].',
    urduTranslation: 'اللہ کے نام کے ساتھ اور اللہ کی برکت پر (ہم نے کھانا شروع کیا)۔',
    reference: 'Al-Mustadrak al-Hakim (7084) & Abu Dawud (3767)',
    situation: 'Recited with the right hand just before starting any meal, snack, or drink.',
    benefit: 'Infuses barakah (divine blessing) into the food and prevents Shaytan from sharing in your sustenance.',
  },
  {
    id: 'dua-forgot-before-eating',
    category: 'Eating & Drinking (کھانا پینا)',
    title: 'Dua If You Forgot to Recite Before Eating (کھانے کے دوران یاد آنے پر)',
    arabicText: 'بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ',
    transliteration: 'Bismillāhi awwalahū wa ākhirah.',
    translation: 'In the name of Allah, from its beginning to its end.',
    urduTranslation: 'اللہ کے نام سے، اس کے شروع میں اور اس کے آخر میں۔',
    reference: 'Abu Dawud (3767) & Tirmidhi (1858) - Sahih',
    situation: 'Recited immediately upon remembering if you forgot to say Bismillah before starting your food.',
    benefit: 'Prophet (ﷺ) said that reciting this causes Shaytan to vomit back whatever portion he partook in.',
  },
  {
    id: 'dua-after-eating',
    category: 'Eating & Drinking (کھانا پینا)',
    title: 'Dua After Finishing Meal (کھانا کھانے کے بعد کی دعا)',
    arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    transliteration: 'Al-ḥamdu lillāhil-ladhī aṭ‘amanā wa saqānā wa ja‘alanā Muslimīn.',
    translation: 'All praise is due to Allah Who has fed us, given us drink, and made us Muslims.',
    urduTranslation: 'تمام تعریفیں اللہ ہی کے لیے ہیں جس نے ہمیں کھلایا اور پلایا اور ہمیں مسلمان بنایا۔',
    reference: 'Abu Dawud (3850), Tirmidhi (3457), Ibn Majah (3283)',
    situation: 'Recited right after finishing eating food or finishing a meal.',
    benefit: 'Demonstrates deep gratitude (Shukr) to Allah for physical sustenance and the supreme blessing of Islam.',
  },
  {
    id: 'dua-after-eating-forgiveness',
    category: 'Eating & Drinking (کھانا پینا)',
    title: 'Comprehensive Prophetic Dua After Eating for Forgiveness',
    arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَٰذَا الطَّعَامَ وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    transliteration: 'Al-ḥamdu lillāhil-ladhī aṭ‘amanī hādhāṭ-ṭa‘āma wa razaqanīhi min ghayri ḥawlim-minnī wa lā quwwah.',
    translation: 'All praise is for Allah Who fed me this food and provided it for me without any power or strength on my part.',
    urduTranslation: 'تمام تعریفیں اللہ کے لیے ہیں جس نے مجھے یہ کھانا کھلایا اور بغیر میری طاقت اور قوت کے یہ رزق مجھے عطا فرمایا۔',
    reference: 'Tirmidhi (3458), Abu Dawud (4023), Ibn Majah (3285) - Hasan',
    situation: 'Recited upon concluding any meal.',
    benefit: 'Prophet (ﷺ) said: "Whoever says this after eating, all his previous minor sins will be forgiven."',
  },
  {
    id: 'dua-for-host-food',
    category: 'Eating & Drinking (کھانا پینا)',
    title: 'Dua for the Host after Being Served a Meal (میزبان کے لیے دعا)',
    arabicText: 'اللَّهُمَّ بَارِكْ لَهُمْ فِيمَا رَزَقْتَهُمْ، وَاغْفِرْ لَهُمْ وَارْحَمْهُمْ',
    transliteration: 'Allāhumma bārik lahum fīmā razaqtahum, wagh-fir lahum war-ḥamhum.',
    translation: 'O Allah, bless for them what You have provided them, forgive them, and have mercy upon them.',
    urduTranslation: 'اے اللہ! ان کے رزق میں برکت عطا فرما جو تو نے انہیں دیا ہے، ان کی مغفرت فرما اور ان پر رحم فرما۔',
    reference: 'Sahih Muslim (2042)',
    situation: 'Recited by guests to pray for the family or host who provided hospitality and food.',
    benefit: 'Brings immense Barakah to the host’s house, wealth, and household.',
  },
  {
    id: 'dua-after-drinking-water',
    category: 'Eating & Drinking (کھانا پینا)',
    title: 'Dua After Drinking Water (پانی پینے کے بعد کی دعا)',
    arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي سَقَانَا عَذْبًا فُرَاتًا بِرَحْمَتِهِ، وَلَمْ يَجْعَلْهُ مِلْحًا أُجَاجًا بِذُنُوبِنَا',
    transliteration: 'Al-ḥamdu lillāhil-ladhī saqānā ‘adhban furātam-bi-raḥmatih, wa lam yaj‘alhu milḥan ujājam-bi-dhunūbinā.',
    translation: 'All praise is due to Allah Who quenched our thirst with sweet, refreshing water by His mercy, and did not make it bitter and salty due to our sins.',
    urduTranslation: 'تمام تعریفیں اللہ کے لیے ہیں جس نے اپنی رحمت سے ہمیں میٹھا خوشگوار پانی پلایا اور ہمارے گناہوں کے سبب اسے کھارا و کڑوا نہیں بنایا۔',
    reference: 'Ibn Abi ad-Dunya (Kitab ash-Shukr) & Tabarani',
    situation: 'Recited after drinking water in 3 calm sips sitting down.',
    benefit: 'Awakens gratitude for the invaluable blessing of clean, sweet drinking water.',
  },
  {
    id: 'dua-drinking-milk',
    category: 'Eating & Drinking (کھانا پینا)',
    title: 'Dua When Drinking Milk (دودھ پیتے وقت کی دعا)',
    arabicText: 'اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَزِدْنَا مِنْهُ',
    transliteration: 'Allāhumma bārik lanā fīhi wa zidnā minh.',
    translation: 'O Allah, bless it for us and grant us an increase thereof.',
    urduTranslation: 'اے اللہ! ہمارے لیے اس میں برکت عطا فرما اور ہمیں اس میں سے مزید عطا فرما۔',
    reference: 'Tirmidhi (3455) & Abu Dawud (3730) - Hasan',
    situation: 'Recited specifically when drinking milk.',
    benefit: 'Prophet (ﷺ) mentioned milk is the single beverage that satisfies both hunger and thirst comprehensively.',
  },
  {
    id: 'dua-drinking-zamzam',
    category: 'Eating & Drinking (کھانا پینا)',
    title: 'Dua When Drinking Zamzam Water (آبِ زم زم پیتے وقت کی دعا)',
    arabicText: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا وَاسِعًا، وَشِفَاءً مِنْ كُلِّ دَاءٍ',
    transliteration: 'Allāhumma innī as’aluka ‘ilman nāfi‘an, wa rizqaw-wāsi‘an, wa shifā’am-min kulli dā’.',
    translation: 'O Allah, I ask You for beneficial knowledge, abundant provision, and a cure from every illness and ailment.',
    urduTranslation: 'اے اللہ! میں تجھ سے نفع بخش علم، کشادہ رزق، اور ہر بیماری سے شفا کا سوال کرتا ہوں۔',
    reference: 'Al-Mustadrak al-Hakim (1/473) & Sunan ad-Daraqutni',
    situation: 'Recited facing the Qiblah while drinking the sacred water of Zamzam.',
    benefit: 'Prophet (ﷺ) said: "The water of Zamzam is for whatever intention it is drunk for."',
  },

  // ==========================================
  // DAILY LIFE SUNNAH PRAYERS (روزمرہ کی مسنون دعائیں)
  // ==========================================
  {
    id: 'dua-waking-up',
    category: 'Daily Life Prayers (روزمرہ مسنون دعائیں)',
    title: 'Upon Waking Up in the Morning (صبح بیدار ہونے کی دعا)',
    arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Al-ḥamdu lillāhil-ladhī aḥyānā ba‘da mā amātanā wa ilayhin-nushūr.',
    translation: 'All praise is for Allah Who gave us life after having caused us to die, and unto Him is the resurrection.',
    urduTranslation: 'تمام تعریفیں اللہ ہی کے لیے ہیں جس نے ہمیں زندہ کیا بعد اس کے کہ ہمیں موت (نیند) دی تھی اور اسی کی طرف اٹھ کر جانا ہے۔',
    reference: 'Sahih al-Bukhari (6312) & Sahih Muslim (2711)',
    situation: 'Recited immediately upon opening your eyes and waking up.',
    benefit: 'Starts the day with consciousness of Allah and gratitude for another day of good deeds.',
  },
  {
    id: 'dua-before-sleeping',
    category: 'Daily Life Prayers (روزمرہ مسنون دعائیں)',
    title: 'Before Going to Sleep at Night (سوتے وقت کی دعا)',
    arabicText: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allāhumma amūtu wa aḥyā.',
    translation: 'In Your Name, O Allah, I die and I live.',
    urduTranslation: 'اے اللہ! تیرے ہی نام کے ساتھ میں مرتا (سوتا) ہوں اور جیتا (جاگتا) ہوں۔',
    reference: 'Sahih al-Bukhari (6324)',
    situation: 'Recited when lying on the right side on your bed before sleeping.',
    benefit: 'Places one’s soul in divine trust and protection through the night.',
  },
  {
    id: 'dua-entering-washroom',
    category: 'Daily Life Prayers (روزمرہ مسنون دعائیں)',
    title: 'Entering the Washroom / Toilet (بیت الخلاء میں داخل ہونے کی دعا)',
    arabicText: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    transliteration: 'Allāhumma innī a‘ūdhu bika minal-khubuthi wal-khabā’ith.',
    translation: 'O Allah, I seek refuge in You from evil male and female devils.',
    urduTranslation: 'اے اللہ! میں تیری پناہ مانگتا ہوں ناپاک جنوں اور جننیوں (خبیثوں) کے شر سے۔',
    reference: 'Sahih al-Bukhari (142) & Sahih Muslim (375)',
    situation: 'Recited before stepping into the bathroom with the left foot.',
    benefit: 'Creates a veil and divine shield preventing Shaytan and harmful spirits from seeing or harming you.',
  },
  {
    id: 'dua-leaving-washroom',
    category: 'Daily Life Prayers (روزمرہ مسنون دعائیں)',
    title: 'Leaving the Washroom / Toilet (بیت الخلاء سے نکلنے کی دعا)',
    arabicText: 'غُفْرَانَكَ، الْحَمْدُ لِلَّهِ الَّذِي أَذْهَبَ عَنِّي الْأَذَىٰ وَعَافَانِي',
    transliteration: 'Ghufrānak. Al-ḥamdu lillāhil-ladhī adh-haba ‘annil-adhā wa ‘āfānī.',
    translation: 'I ask Your forgiveness. All praise is for Allah Who removed harm from me and granted me health and relief.',
    urduTranslation: 'اے اللہ! میں تجھ سے بخشش مانگتا ہوں۔ تمام تعریفیں اللہ ہی کے لیے ہیں جس نے مجھ سے تکلیف دہ چیز دور فرمائی اور مجھے عافیت بخشی۔',
    reference: 'Abu Dawud (30), Tirmidhi (7), Ibn Majah (300)',
    situation: 'Recited upon stepping out of the bathroom with the right foot.',
    benefit: 'Gratitude for the internal bodily mechanism of waste removal and health.',
  },
  {
    id: 'dua-before-wudu',
    category: 'Daily Life Prayers (روزمرہ مسنون دعائیں)',
    title: 'Before Starting Wudu (وضو شروع کرتے وقت کی دعا)',
    arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    transliteration: 'Bismillāhir-Raḥmānir-Raḥīm.',
    translation: 'In the name of Allah, the Most Gracious, the Most Merciful.',
    urduTranslation: 'اللہ کے نام سے شروع جو نہایت مہربان بہت رحم فرمانے والا ہے۔',
    reference: 'Abu Dawud (101) & Ibn Majah (399)',
    situation: 'Recited right before washing the hands at the start of ablution.',
    benefit: 'Prophet (ﷺ) said: "There is no complete Wudu for one who does not mention the name of Allah upon it."',
  },
  {
    id: 'dua-after-wudu',
    category: 'Daily Life Prayers (روزمرہ مسنون دعائیں)',
    title: 'Supplication After Completing Wudu (وضو مکمل کرنے کے بعد)',
    arabicText: 'أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
    transliteration: 'Ash-hadu allā ilāha illallāhu waḥdahū lā sharīka lah, wa ash-hadu anna Muḥammadan ‘abduhū wa rasūluh. Allāhummaj-‘alnī minat-tawwābīna waj-‘alnī minal-mutaṭahhirīn.',
    translation: 'I bear witness that there is no deity except Allah alone without partner, and I bear witness that Muhammad is His servant and Messenger. O Allah, make me among those who constantly repent and make me among those who purify themselves.',
    urduTranslation: 'میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے اس کا کوئی شریک نہیں، اور میں گواہی دیتا ہوں کہ محمد (ﷺ) اس کے بندے اور رسول ہیں۔ اے اللہ! مجھے کثرت سے توبہ کرنے والوں میں بنا اور مجھے پاک صاف رہنے والوں میں شامل فرما۔',
    reference: 'Sahih Muslim (234) & Tirmidhi (55)',
    situation: 'Recited immediately upon completing ablution while looking upward.',
    benefit: 'Opens all eight gates of Jannah for the worshipper.',
  },
  {
    id: 'dua-wearing-clothes',
    category: 'Daily Life Prayers (روزمرہ مسنون دعائیں)',
    title: 'When Putting on Clothes (لباس پہنتے وقت کی دعا)',
    arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَٰذَا الثَّوْبَ وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    transliteration: 'Al-ḥamdu lillāhil-ladhī kasānī hādhāth-thawba wa razaqanīhi min ghayri ḥawlim-minnī wa lā quwwah.',
    translation: 'All praise is for Allah Who clothed me with this garment and provided it for me without any power or strength on my part.',
    urduTranslation: 'تمام تعریفیں اللہ کے لیے ہیں جس نے مجھے یہ کپڑا پہنایا اور بغیر میری قوت و طاقت کے یہ مجھے عطا فرمایا۔',
    reference: 'Abu Dawud (4023) & Tirmidhi (3458)',
    situation: 'Recited when wearing clothes or changing in the morning.',
    benefit: 'Prophet (ﷺ) said whoever recites this upon wearing clothes, their previous sins are forgiven.',
  },
  {
    id: 'dua-looking-mirror',
    category: 'Daily Life Prayers (روزمرہ مسنون دعائیں)',
    title: 'When Looking in the Mirror (آئینہ دیکھتے وقت کی دعا)',
    arabicText: 'اللَّهُمَّ أَنْتَ حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي',
    transliteration: 'Allāhumma Anta ḥassanta khalqī fa-ḥassin khuluqī.',
    translation: 'O Allah, as You have made my physical appearance beautiful, make my character and manners beautiful as well.',
    urduTranslation: 'اے اللہ! جیسا کہ تو نے میری صورت کو اچھا بنایا ہے، ویسے ہی میرے اخلاق و کردار کو بھی خوبصورت بنا دے۔',
    reference: 'Musnad Ahmad (24392) & Sahih Ibn Hibban',
    situation: 'Recited whenever looking at your reflection in a mirror.',
    benefit: 'Instills humility, beautifies inner morality, and protects from narcissism and arrogance.',
  },
  {
    id: 'dua-sneezing',
    category: 'Daily Life Prayers (روزمرہ مسنون دعائیں)',
    title: 'Etiquette and Duas of Sneezing (چھینک آنے کے آداب اور دعائیں)',
    arabicText: 'الْحَمْدُ لِلَّهِ ۝ يَرْحَمُكَ اللَّهُ ۝ يَهْدِيكُمُ اللَّهُ وَيُصْلِحُ بَالَكُمْ',
    transliteration: 'Sneezer says: "Al-ḥamdu lillāh". Listener responds: "Yarḥamukallāh". Sneezer replies: "Yahdīkumullāhu wa yuṣliḥu bālakum".',
    translation: 'Sneezer: "All praise is for Allah". Listener: "May Allah have mercy on you". Sneezer replies: "May Allah guide you and rectify your condition".',
    urduTranslation: 'چھینکنے والا کہے: "الحمد لله" (سب تعریف اللہ کے لیے ہے)۔ سننے والا کہے: "يرحمك الله" (اللہ تم پر رحم فرمائے)۔ جواب میں چھینکنے والا کہے: "يهديكم الله ويصلح بالكم" (اللہ تمہیں ہدایت دے اور تمہارا حال درست فرمائے)۔',
    reference: 'Sahih al-Bukhari (6224)',
    situation: 'When sneezing, cover the face and lower voice, then complete the 3-part Sunnah response.',
    benefit: 'Prophet (ﷺ) said: "Allah loves the sneeze because it brings vitality and clears the head."',
  },
  {
    id: 'dua-entering-home',
    category: 'Daily Life Prayers (روزمرہ مسنون دعائیں)',
    title: 'Entering One’s Home (گھر میں داخل ہونے کی دعا)',
    arabicText: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَىٰ رَبِّنَا تَوَكَّلْنَا',
    transliteration: 'Bismillāhi walajnā, wa bismillāhi kharajnā, wa ‘alā Rabbinā tawakkalnā.',
    translation: 'In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we rely.',
    urduTranslation: 'اللہ کے نام کے ساتھ ہم داخل ہوئے، اور اللہ کے نام کے ساتھ ہم نکلے، اور اپنے پروردگار پر ہم نے بھروسہ کیا۔',
    reference: 'Abu Dawud (5096) & Sahih Muslim',
    situation: 'Recited when unlocking or opening your home door, followed by greeting with "Assalamu Alaikum".',
    benefit: 'Shaytan says to his cohorts: "There is no lodging for you here tonight and no dinner."',
  },
  {
    id: 'dua-ease-difficulty',
    category: 'Daily Life Prayers (روزمرہ مسنون دعائیں)',
    title: 'When Facing Any Hardship or Difficulty (مشکل اور پریشانی میں آسانی کی دعا)',
    arabicText: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا',
    transliteration: 'Allāhumma lā sahla illā mā ja‘altahū sahlā, wa Anta taj‘alul-ḥazna idhā shi’ta sahlā.',
    translation: 'O Allah, there is nothing made easy except what You make easy, and You turn grief and difficulty into ease whenever You will.',
    urduTranslation: 'اے اللہ! کوئی چیز آسان نہیں مگر جس کو تو آسان بنا دے، اور تو جب چاہے مشکل اور غم کو آسانی میں بدل دیتا ہے۔',
    reference: 'Sahih Ibn Hibban (974) & Ibn as-Sunni (351)',
    situation: 'Recited before difficult exams, tasks, unexpected roadblocks, or stressful life situations.',
    benefit: 'Immediately relieves mental tension and invites divine assistance to solve complex problems.',
  },

  // ==========================================
  // ESSENTIAL & QURANIC SUPPLICATIONS
  // ==========================================
  {
    id: 'dua-ayatul-kursi',
    category: 'Essential & Quranic',
    title: 'Ayat al-Kursi (The Throne Verse - آية الكرسي)',
    arabicText:
      'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration:
      'Allāhu lā ilāha illā Huwal-Ḥayyul-Qayyūm, lā ta’khudhuhū sinatuw-wa lā nawm, lahū mā fis-samāwāti wa mā fil-arḍ, man dhal-ladhī yashfa‘u ‘indahū illā bi-idhnih, ya‘lamu mā bayna aydīhim wa mā khalfahum, wa lā yuḥīṭūna bi-shay’im-min ‘ilmihī illā bi-mā shā’, wasi‘a kursiyyuhus-samāwāti wal-arḍ, wa lā ya’ūduhū ḥifẓuhumā, wa Huwal-‘Aliyyul-‘Aẓīm.',
    translation:
      'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi (Throne) extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
    urduTranslation:
      'اللہ کے سوا کوئی معبود نہیں، وہ ہمیشہ زندہ رہنے والا اور تمام کائنات کو سنبھالنے والا ہے۔ اسے نہ اونگھ آتی ہے نہ نیند۔ جو کچھ آسمانوں میں ہے اور جو کچھ زمین میں ہے سب اسی کا ہے۔ کون ہے جو اس کی اجازت کے بغیر اس کے حضور سفارش کر سکے؟ وہ جانتا ہے جو کچھ ان کے آگے ہے اور جو کچھ ان کے پیچھے ہے، اور وہ اس کے علم میں سے کسی چیز کا احاطہ نہیں کر سکتے مگر جتنا وہ چاہے۔ اس کی کرسی آسمانوں اور زمین پر محیط ہے، اور ان دونوں کی حفاظت اس پر گراں نہیں گزرتی، اور وہ سب سے بلند اور عظمت والا ہے۔',
    reference: 'Surah Al-Baqarah (2:255) & Sahih al-Bukhari',
    situation: 'Recited after every obligatory prayer (Fard Salah), before sleeping, and for supreme spiritual protection from evils and Shaytan.',
    benefit: 'Prophet Muhammad (ﷺ) said: "Whoever recites Ayat al-Kursi after every prescribed prayer, nothing stands between him and entering Paradise except death." (An-Nasa’i, Sahih).',
  },
  {
    id: 'dua-qunoot-witr-hanafi',
    category: 'Essential & Quranic',
    title: 'Dua-e-Qunoot for Witr Prayer (دعاء القنوت - Hanafi Tradition)',
    arabicText:
      'اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنُؤْمِنُ بِكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ وَنَشْكُرُكَ وَلَا نَكْفُرُكَ وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ ۝ اللَّهُمَّ إِيَّاكَ نَعْبُدُ وَلَكَ نُصَلِّي وَنَسْجُدُ وَإِلَيْكَ نَسْعَىٰ وَنَحْفِدُ وَنَرْجُو رَحْمَتَكَ وَنَخْشَىٰ عَذَابَكَ إِنَّ عَذَابَكَ بِالْكُفَّارِ مُلْحَقٌ',
    transliteration:
      'Allāhumma innā nasta‘īnuka wa nastaghfiruka wa nu’minu bika wa natawakkalu ‘alayka wa nuthnī ‘alaykal-khayr, wa nashkuruka wa lā nakfuruka wa nakhla‘u wa natruku may-yafjuruk. Allāhumma iyyāka na‘budu wa laka nuṣallī wa nasjudu wa ilayka nas‘ā wa naḥfid, wa narjū raḥmataka wa nakhshā ‘adhābaka inna ‘adhābaka bil-kuffāri mulḥaq.',
    translation:
      'O Allah, we seek Your assistance, we ask for Your forgiveness, we believe in You, we place our trust in You, we praise You for all goodness, we thank You and we are not ungrateful to You, and we reject and abandon whoever disobeys You. O Allah, You alone we worship, to You we pray and prostrate, toward You we strive and rush, we hope for Your mercy and we fear Your punishment. Indeed, Your punishment will surely overtake the disbelievers.',
    urduTranslation:
      'اے اللہ! ہم تجھ ہی سے مدد چاہتے ہیں، تجھ ہی سے بخشش مانگتے ہیں، تجھ پر ایمان لاتے ہیں، تجھ پر بھروسہ کرتے ہیں، تیری بہترین تعریف کرتے ہیں، تیرا شکر ادا کرتے ہیں اور تیری ناشکری نہیں کرتے، اور ہم ہر اس شخص سے بیزار اور الگ ہوتے ہیں جو تیری نافرمانی کرے۔ اے اللہ! ہم تیری ہی بندگی کرتے ہیں، تیرے ہی لیے نماز پڑھتے اور سجدہ کرتے ہیں، تیری ہی طرف دوڑتے اور حاضر ہوتے ہیں، تیری رحمت کے امیدوار ہیں اور تیرے عذاب سے ڈرتے ہیں، بیشک تیرا عذاب کافروں کو پہنچنے والا ہے۔',
    reference: 'Musannaf Ibn Abi Shaybah (6965) & Bayhaqi (Sunan al-Kubra 2/210)',
    situation: 'Recited in the 3rd Rakah of Salatul Witr after Takbeer before Ruku (or in Qunoot).',
    benefit: 'The established comprehensive supplication of the Sahabah declaring utter reliance, dedication, and refuge in Allah alone during night prayers.',
  },
  {
    id: 'dua-qunoot-prophetic-hasan',
    category: 'Essential & Quranic',
    title: 'Dua Qunoot taught by the Prophet (ﷺ) to Hasan ibn Ali',
    arabicText:
      'اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَىٰ عَلَيْكَ، وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، وَلَا يَعِزُّ مَنْ عَادَيْتَ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ',
    transliteration:
      'Allāhummah-dinī fīman hadayt, wa ‘āfinī fīman ‘āfayt, wa tawallanī fīman tawallayt, wa bārik lī fīmā a‘ṭayt, wa qinī sharra mā qaḍayt, fa-innaka taqḍī wa lā yuqḍā ‘alayk, wa innahū lā yadhillu maw-wālayt, wa lā ya‘izzu man ‘ādayt, tabārakta Rabbanā wa ta‘ālayt.',
    translation:
      'O Allah, guide me among those whom You have guided, grant me well-being among those whom You have granted well-being, take me into Your care among those whom You have taken into Your care, bless for me what You have given, and save me from the evil of what You have decreed. For indeed You decree and none can decree against You. Indeed, he whom You befriend is never humiliated, and he whom You oppose is never exalted. Blessed are You, our Lord, and Exalted.',
    urduTranslation:
      'اے اللہ! مجھے ہدایت دے ان لوگوں میں جنہیں تو نے ہدایت دی، اور مجھے عافیت دے ان لوگوں میں جنہیں تو نے عافیت دی، اور میرا کارساز بن ان لوگوں میں جن کا تو کارساز بنا، اور میرے لیے برکت دے اس میں جو تو نے عطا فرمایا، اور مجھے اس چیز کے شر سے بچا جو تو نے فیصلہ کیا ہے، کیونکہ تو ہی فیصلہ فرماتا ہے اور تیرے خلاف کوئی فیصلہ نہیں کیا جا سکتا۔ بیشک جسے تو دوست رکھے وہ کبھی ذلیل نہیں ہوتا، اور جس سے تو دشمنی رکھے وہ کبھی عزت نہیں پا سکتا، اے ہمارے رب! تو بابرکت اور نہایت بلند و بالا ہے۔',
    reference: 'Abu Dawud (1425), Tirmidhi (464), An-Nasa’i (1745) - Sahih',
    situation: 'Recited in Witr prayer and in Fajr Qunoot / Qunoot an-Nazilah during times of difficulty.',
    benefit: 'Brings total divine guidance, holistic mental and physical health (Afiyah), barakah in sustenance, and divine patronage.',
  },
  {
    id: 'dua-rabbana-atina',
    category: 'Essential & Quranic',
    title: 'The Most Frequent Prophetic Dua for Dunya & Akhirah (رَبَّنَا آتِنَا)',
    arabicText:
      'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration:
      'Rabbanā ātinā fid-dunyā ḥasanataw-wa fil-ākhirati ḥasanataw-wa qinā ‘adhāban-Nār.',
    translation:
      'Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.',
    urduTranslation:
      'اے ہمارے رب! ہمیں دنیا میں بھی بھلائی عطا فرما اور آخرت میں بھی بھلائی عطا فرما اور ہمیں دوزخ کے عذاب سے بچا۔',
    reference: 'Surah Al-Baqarah (2:201) & Sahih al-Bukhari (6389)',
    situation: 'The most recited supplication of Prophet Muhammad (ﷺ), recited in Tawaf, Salah (Tashahhud), and daily moments.',
    benefit: 'Encompasses every earthly blessing (sound health, lawful livelihood, righteous family) and supreme eternal salvation.',
  },
  {
    id: 'dua-after-adhan',
    category: 'Essential & Quranic',
    title: 'Supplication After Hearing the Adhan (دعاء بعد الأذان)',
    arabicText:
      'اللَّهُمَّ رَبَّ هَٰذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَّحْمُودًا الَّذِي وَعَدْتَّهُ',
    transliteration:
      'Allāhumma Rabba hādhihid-da‘watit-tāmmah, waṣ-ṣalātil-qā’imah, āti Muḥammadanil-wasīlata wal-faḍīlah, wab‘ath-hu maqāmam-maḥmūdanil-ladhī wa‘adtah.',
    translation:
      'O Allah, Lord of this perfect call and of the established prayer, grant Muhammad the Wasilah (highest station in Jannah) and distinction, and resurrect him to the Praised Station which You have promised him.',
    urduTranslation:
      'اے اللہ! اس کامل پکار اور قائم ہونے والی نماز کے رب! ہمارے نبی محمد (ﷺ) کو وسیلہ اور فضیلت عطا فرما، اور انہیں اس مقامِ محمود پر فائز فرما جس کا تو نے ان سے وعدہ فرمایا ہے۔',
    reference: 'Sahih al-Bukhari (614)',
    situation: 'Recited immediately upon the completion of the Adhan call to prayer.',
    benefit: 'Prophet (ﷺ) said: "Whoever says this upon hearing the Adhan, my intercession (Shafa‘ah) becomes guaranteed for him on the Day of Resurrection."',
  },
  {
    id: 'dua-abu-bakr-salah-forgiveness',
    category: 'Forgiveness',
    title: 'Supplication of Abu Bakr as-Siddiq in Salah before Salam',
    arabicText:
      'اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا، وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِّنْ عِندِكَ، وَارْحَمْنِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ',
    transliteration:
      'Allāhumma innī ẓalamtu nafsī ẓulman kathīrā, wa lā yaghfirudh-dhunūba illā Ant, faghfir lī maghfiratam-min ‘indik, war-ḥamnī innaka Antal-Ghafūrur-Raḥīm.',
    translation:
      'O Allah, I have wronged myself greatly, and none forgives sins except You. So grant me forgiveness from You, and have mercy upon me, indeed You are the Most Forgiving, the Most Merciful.',
    urduTranslation:
      'اے اللہ! میں نے اپنی جان پر بہت زیادہ ظلم کیا ہے، اور تیرے سوا کوئی گناہوں کو معاف نہیں کر سکتا، پس تو اپنے پاس سے میری مغفرت فرما دے اور مجھ پر رحم فرما، بیشک تو ہی بڑا بخشنے والا نہایت رحم فرمانے والا ہے۔',
    reference: 'Sahih al-Bukhari (834) & Sahih Muslim (2705)',
    situation: 'Recited in the final sitting (Tashahhud) of Salah before making Tasleem.',
    benefit: 'Directly taught by the Prophet (ﷺ) to his closest companion Abu Bakr (RA) to wipe away all spiritual shortcomings.',
  },
  {
    id: 'dua-between-sujood-afiyah',
    category: 'Essential & Quranic',
    title: 'Supplication Between the Two Sujood (Sitting in Salah)',
    arabicText:
      'رَبِّ اغْفِرْ لِي، وَارْحَمْنِي، وَعَافِنِي، وَاهْدِنِي، وَارْزُقْنِي',
    transliteration:
      'Rabbigh-fir lī, war-ḥamnī, wa ‘āfinī, wah-dinī, war-zuqnī.',
    translation:
      'My Lord, forgive me, have mercy on me, grant me health/well-being, guide me, and provide for me.',
    urduTranslation:
      'اے میرے رب! مجھے بخش دے، مجھ پر رحم فرما، مجھے عافیت دے، مجھے سیدھی راہ دکھا، اور مجھے رزق عطا فرما۔',
    reference: 'Abu Dawud (850), Tirmidhi (284), Ibn Majah (898)',
    situation: 'Recited in the pause (Jalsah) between the first and second prostrations in every Rak’ah.',
    benefit: 'Asks for complete physical and spiritual provisions, health, and Divine forgiveness 5 times every Salah.',
  },

  // Friday (Jummah) Supplications & Sunnahs
  {
    id: 'dua-friday-hour-response',
    category: 'Friday (Jummah)',
    title: 'Dua for the Hour of Response on Friday (ساعة الاستجابة)',
    arabicText: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ وَرَحْمَتِكَ، فَإِنَّهُ لَا يَمْلِكُهَا إِلَّا أَنْتَ',
    transliteration: 'Allāhumma innī as’aluka min faḍlika wa raḥmatik, fa-innahū lā yamlikuhā illā Ant.',
    translation: 'O Allah, I ask You from Your bounty and Your mercy, for none possesses it except You.',
    urduTranslation: 'اے اللہ! میں تجھ سے تیرے فضل اور تیری رحمت کا سوال کرتا ہوں، کیونکہ تیرے سوا اس کا کوئی مالک نہیں ہے۔',
    reference: 'Sahih al-Jami (1278) & Sahih al-Bukhari',
    situation: 'Recited during Friday afternoon, especially between Asr and Maghrib (the Golden Hour of Acceptance).',
    benefit: 'The Prophet (ﷺ) said: "On Friday there is an hour in which no Muslim asks Allah for anything good except that He gives it to him."',
  },
  {
    id: 'dua-friday-salawat',
    category: 'Friday (Jummah)',
    title: 'Abundant Salawat upon Prophet Muhammad (ﷺ) on Friday',
    arabicText: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration: 'Allāhumma ṣalli ‘alā Muḥammadiw-wa ‘alā āli Muḥammad, kamā ṣallayta ‘alā Ibrāhīma wa ‘alā āli Ibrāhīm, innaka Ḥamīdum-Majīd.',
    translation: 'O Allah, bestow Your peace and blessings upon Muhammad and the family of Muhammad, as You bestowed upon Ibrahim and the family of Ibrahim. Indeed, You are Praiseworthy, Glorious.',
    urduTranslation: 'اے اللہ! درود بھیج محمد (ﷺ) پر اور ان کی آل پر جیسا کہ تو نے درود بھیجا ابراہیم (علیہ السلام) پر اور ان کی آل پر، بیشک تو تعریف کے لائق اور بزرگی والا ہے۔',
    reference: 'Abu Dawud (1047) & Sahih Bukhari',
    situation: 'Read continuously throughout Friday night and day.',
    benefit: 'Prophet (ﷺ) said: "Increase your supplications for me on Friday, for your blessings are presented to me."',
  },
  {
    id: 'dua-friday-kahf-light',
    category: 'Friday (Jummah)',
    title: 'Supplication & Protection through Surah Al-Kahf',
    arabicText: 'اللَّهُمَّ نَوِّرْ قُلُوبَنَا بِالْقُرْآنِ وَاحْفَظْنَا مِنْ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',
    transliteration: 'Allāhumma nawwir qulūbanā bil-Qur’ān, waḥ-faẓnā min fitnatil-Masīḥid-Dajjāl.',
    translation: 'O Allah, illuminate our hearts with the Quran, and protect us from the trials and tribulation of the False Messiah (Dajjal).',
    urduTranslation: 'اے اللہ! ہمارے دلوں کو قرآن پاک کے نور سے منور فرما اور ہمیں دجال کے فتنے سے محفوظ رکھ۔',
    reference: 'Mustadrak al-Hakim (3392) & Sahih Muslim',
    situation: 'Recited on Friday alongside the complete reading of Surah Al-Kahf.',
    benefit: 'Prophet (ﷺ) said: "Whoever reads Surah Al-Kahf on Friday will have a light shining for him between the two Fridays."',
  },
  {
    id: 'dua-leaving-jummah-bounty',
    category: 'Friday (Jummah)',
    title: 'Supplication When Dispersing After Jummah Prayer',
    arabicText: 'اللَّهُمَّ إِنِّي قَدْ صَلَّيْتُ مَا فَرَضْتَ، وَانْتَشَرْتُ كَمَا أَمَرْتَ، فَارْزُقْنِي مِنْ فَضْلِكَ وَأَنْتَ خَيْرُ الرَّازِقِينَ',
    transliteration: 'Allāhumma innī qad ṣallaytu mā faraḍt, wan-tashartu kamā amart, far-zuqnī min faḍlika wa Anta Khayrur-rāziqīn.',
    translation: 'O Allah, I have prayed what You made obligatory, and I have dispersed as You commanded, so provide for me from Your bounty, for You are the Best of Providers.',
    urduTranslation: 'اے اللہ! میں نے تیری فرض نماز ادا کی اور تیرے حکم کے مطابق زمین میں پھیل گیا، پس مجھے اپنے فضل سے رزق عطا فرما، اور تو سب سے بہترین رزق دینے والا ہے۔',
    reference: 'Surah Al-Jumu’ah (62:10) & Tafsir Ibn Kathir',
    situation: 'Exiting the Masjid after completing the Friday Congregational Prayer.',
    benefit: 'Invokes lawful wealth, barakah in livelihood, and divine protection throughout the week.',
  },

  // Fasting & Ramadan Supplications
  {
    id: 'dua-iftar-dhahaba',
    category: 'Fasting & Ramadan',
    title: 'Prophetic Dua for Breaking the Fast (Iftar)',
    arabicText: 'ذَهَبَ الظَّمَأُ، وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ',
    transliteration: 'Dhahabadh-dhama’u, wabtallatil-‘urūq, wa thabatal-ajru in shā’Allāh.',
    translation: 'The thirst is gone, the veins are moistened, and the reward is confirmed, if Allah wills.',
    urduTranslation: 'پیاس بجھ گئی، رگیں تر ہو گئیں اور اجر ثابت ہو گیا اگر اللہ نے چاہا۔',
    reference: 'Abu Dawud (2357) - Hasan',
    situation: 'Recited immediately upon taking the first sip or date at Iftar time.',
    benefit: 'The authentic sunnah dua upon opening the fast that brings immediate fulfillment and blessings.',
  },
  {
    id: 'dua-suhoor-intention',
    category: 'Fasting & Ramadan',
    title: 'Intention (Niyyah) for Fasting',
    arabicText: 'وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ',
    transliteration: 'Wa bi-ṣawmi ghadin nawaytu min shahri Ramaḍān.',
    translation: 'I intend to keep the fast tomorrow for the month of Ramadan (or for the sake of Allah).',
    urduTranslation: 'اور میں نے کل کے رمضان المبارک کے روزے کی نیت کی۔',
    reference: 'Fiqh Tradition & Sunan',
    situation: 'At Suhoor/Sehri before the Fajr adhan.',
    benefit: 'Solidifies sincere intention for fasting solely for Allah’s pleasure.',
  },

  // Morning & Evening
  {
    id: 'dua-sayyidul-istighfar',
    category: 'Forgiveness',
    title: 'Sayyidul Istighfar (The Master Supplication for Forgiveness)',
    arabicText:
      'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration:
      'Allāhumma Anta Rabbī lā ilāha illā Ant, khalaqtanī wa anā ‘abduk, wa anā ‘alā ‘ahdika wa wa‘dika mastata‘t, a‘ūdhu bika min sharri mā ṣana‘t, abū’u laka bini‘matika ‘alayya wa abū’u bidhanbī faghfir lī fa-innahū lā yaghfirudh-dhunūba illā Ant.',
    translation:
      'O Allah, You are my Lord; there is no deity worthy of worship except You. You created me, and I am Your servant, and I uphold Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge before You Your favors upon me, and I confess my sins to You, so forgive me, for none forgives sins except You.',
    reference: 'Sahih al-Bukhari (6306)',
    situation: 'Recited every morning upon waking and every evening after Asr/Maghrib.',
    benefit: 'Prophet (ﷺ) said: "Whoever recites it during the day with firm faith and dies before evening will be of the people of Paradise, and whoever recites it at night and dies before morning will be of the people of Paradise."',
  },
  {
    id: 'dua-morning-evening-protection',
    category: 'Morning & Evening',
    title: 'Protection in the Name of Allah (3 Times Morning & Evening)',
    arabicText:
      'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration:
      'Bismillāhil-ladhī lā yaḍurru ma‘as-mihī shay’un fil-arḍi wa lā fis-samā’i wa Huwas-Samī‘ul-‘Alīm.',
    translation:
      'In the name of Allah, with whose Name nothing can cause harm on the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.',
    reference: 'Abu Dawud (5088) & Tirmidhi (3388)',
    situation: 'Morning & evening protection against all physical and spiritual harms.',
    benefit: 'Whoever recites it three times in the morning and evening, nothing will harm them.',
  },
  {
    id: 'dua-morning-affirmation',
    category: 'Morning & Evening',
    title: 'Morning Gratitude & Renewal of Faith',
    arabicText:
      'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration:
      'Aṣbaḥnā wa aṣbaḥal-mulku lillāhi wal-ḥamdu lillāh, lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa Huwa ‘alā kulli shay’in Qadīr.',
    translation:
      'We have entered the morning and the kingdom belongs to Allah, and all praise is for Allah. None has the right to be worshipped except Allah alone without partner. To Him belongs the dominion and to Him belongs praise, and He is over all things capable.',
    reference: 'Sahih Muslim (2723)',
    situation: 'Immediately after waking and at the beginning of the morning.',
    benefit: 'Aligns the day with spiritual clarity, protection, and gratitude.',
  },

  // Before Sleep & Waking
  {
    id: 'dua-before-sleep',
    category: 'Before Sleep & Waking',
    title: 'Supplication Before Sleeping',
    arabicText: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismikallāhumma amūtu wa aḥyā.',
    translation: 'In Your Name, O Allah, I die and I live.',
    reference: 'Sahih al-Bukhari (6324)',
    situation: 'Lying on the right side before falling asleep.',
    benefit: 'Puts the soul under Allah’s divine care and protection during sleep.',
  },
  {
    id: 'dua-after-waking',
    category: 'Before Sleep & Waking',
    title: 'Supplication Upon Waking Up',
    arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Al-ḥamdu lillāhil-ladhī aḥyānā ba‘da mā amātanā wa ilayhin-nushūr.',
    translation: 'All praise is for Allah who gave us life after having caused us to die, and unto Him is the resurrection.',
    reference: 'Sahih al-Bukhari (6312)',
    situation: 'Said the moment you open your eyes in the morning.',
    benefit: 'Fills the first moments of consciousness with gratitude for the gift of a new day.',
  },

  // Distress & Anxiety
  {
    id: 'dua-distress-yunus',
    category: 'Distress & Anxiety',
    title: 'Dua of Prophet Yunus (Ayat-e-Karima for Removing Distress)',
    arabicText: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    transliteration: 'Lā ilāha illā Anta subḥānaka innī kuntu minaẓ-ẓālimīn.',
    translation: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.',
    reference: 'Surah Al-Anbiya (21:87) & Tirmidhi (3505)',
    situation: 'Times of severe depression, despair, hardship, anxiety, or legal/personal crises.',
    benefit: 'Prophet (ﷺ) said: "No Muslim supplicates with this Dua for any matter except that Allah answers him."',
  },
  {
    id: 'dua-anxiety-relief',
    category: 'Distress & Anxiety',
    title: 'Supplication for Grief, Worry, and Debt Relief',
    arabicText:
      'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    transliteration:
      'Allāhumma innī a‘ūdhu bika minal-hammi wal-ḥazan, wal-‘ajzi wal-kasal, wal-bukhli wal-jubn, wa ḍala‘id-dayni wa ghalabatir-rijāl.',
    translation:
      'O Allah, I seek refuge in You from grief and sorrow, from incapacity and laziness, from stinginess and cowardice, and from the heavy burden of debt and being overpowered by people.',
    reference: 'Sahih al-Bukhari (2893)',
    situation: 'Mental distress, financial pressure, burnout, or overcoming lethargy.',
    benefit: 'Eliminates mental paralysis and delivers comprehensive ease and resilience.',
  },

  // Parents & Family
  {
    id: 'dua-for-parents',
    category: 'Parents & Family',
    title: 'Quranic Supplication for Parents',
    arabicText: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration: 'Rabbir-ḥamhumā kamā rabbayānī ṣaghīrā.',
    translation: 'My Lord, have mercy upon them as they brought me up [when I was] small.',
    reference: 'Surah Al-Isra (17:24)',
    situation: 'Recited for living or deceased parents.',
    benefit: 'Earns immense ongoing mercy and elevates the spiritual rank of parents.',
  },
  {
    id: 'dua-righteous-spouse-children',
    category: 'Parents & Family',
    title: 'Supplication for Righteous Spouse & Family',
    arabicText: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
    transliteration:
      'Rabbanā hab lanā min azwājinā wa dhurriyyātinā qurrata a‘yuniw-waj‘alnā lil-muttaqīna imāmā.',
    translation:
      'Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.',
    reference: 'Surah Al-Furqan (25:74)',
    situation: 'For household peace, loving relationships, and pious children.',
    benefit: 'Cultivates deep love, harmony, and mutual respect within the family.',
  },

  // Health & Shifa
  {
    id: 'dua-illness-cure',
    category: 'Health & Shifa',
    title: 'Prophetic Dua for Healing & Shifa',
    arabicText:
      'اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَاسَ، اشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا',
    transliteration:
      'Allāhumma Rabban-nās, adh-hibil-ba’s, ishfi Antash-Shāfī, lā shifā’a illā shifā’uk, shifā’al-lā yughādiru saqamā.',
    translation:
      'O Allah, Lord of mankind, remove the hardship and grant cure. You are the Healer; there is no cure except Your cure, a cure that leaves no illness behind.',
    reference: 'Sahih al-Bukhari (5743) & Sahih Muslim (2191)',
    situation: 'Recited when visiting the sick or placing your right hand on where you feel physical pain.',
    benefit: 'Prophetic cure invoked by the Messenger of Allah for physical and emotional ailments.',
  },

  // Travel & Journey
  {
    id: 'dua-travel',
    category: 'Travel & Journey',
    title: 'Supplication for Travel & Boarding a Vehicle',
    arabicText:
      'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ ۝ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ',
    transliteration:
      'Subḥānal-ladhī sakhkhara lanā hādhā wa mā kunnā lahū muqrinīn. Wa innā ilā Rabbinā lamunqalibūn.',
    translation:
      'Exalted is He who has subjected this to us, and we could not have [otherwise] subdued it. And indeed, to our Lord we will return.',
    reference: 'Surah Az-Zukhruf (43:13-14) & Sahih Muslim (1342)',
    situation: 'Upon entering a car, boarding an airplane, train, or starting a journey.',
    benefit: 'Secures angelic protection and safety throughout traveling.',
  },

  // Mosque & Home
  {
    id: 'dua-entering-mosque',
    category: 'Mosque & Home',
    title: 'Entering the Mosque',
    arabicText: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transliteration: 'Allāhummaf-taḥ lī abwāba raḥmatik.',
    translation: 'O Allah, open for me the gates of Your mercy.',
    reference: 'Sahih Muslim (713)',
    situation: 'Stepping into the Masjid with the right foot.',
    benefit: 'Invokes divine mercy and focus in prayers.',
  },
  {
    id: 'dua-leaving-home',
    category: 'Mosque & Home',
    title: 'Stepping Out of the Home',
    arabicText: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'Bismillāhi tawakkaltu ‘alallāh, lā ḥawla wa lā quwwata illā billāh.',
    translation: 'In the name of Allah, I place my trust in Allah; there is no might and no power except with Allah.',
    reference: 'Abu Dawud (5095) & Tirmidhi (3426)',
    situation: 'Stepping out of the front door.',
    benefit: 'Angels announce: "You are guided, defended, and protected," and devils distance themselves.',
  },

  // Protection & Evil Eye
  {
    id: 'dua-protection-children-evil',
    category: 'Protection & Evil Eye',
    title: 'Protection from Evil Eye and Devilish Harm',
    arabicText: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ، وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ',
    transliteration:
      'A‘ūdhu bi-kalimātillāhit-tāmmati min kulli shayṭāniw-wa hāmmah, wa min kulli ‘aynil-lāmmah.',
    translation:
      'I seek refuge in the perfect words of Allah from every devil, poisonous creature, and from every evil, envious eye.',
    reference: 'Sahih al-Bukhari (3371)',
    situation: 'Recited for yourself, children, loved ones, and possessions to ward off jealousy (Hasad).',
    benefit: 'The exact supplication Prophet Ibrahim (AS) made for Ismail and Ishaq, and Prophet Muhammad (ﷺ) for Hasan and Husain.',
  },

  // Knowledge & Success
  {
    id: 'dua-increase-knowledge',
    category: 'Knowledge & Success',
    title: 'Supplication for Knowledge and Memory',
    arabicText: 'رَّبِّ زِدْنِي عِلْمًا',
    transliteration: 'Rabbi zidnī ‘ilmā.',
    translation: 'My Lord, increase me in knowledge.',
    reference: 'Surah Ta-Ha (20:114)',
    situation: 'Before studying, taking exams, reading Quran, or starting work.',
    benefit: 'Expands comprehension, retention, and wisdom.',
  },
  {
    id: 'dua-ease-hardship-speech',
    category: 'Knowledge & Success',
    title: 'Supplication of Musa (AS) for Eloquence and Ease',
    arabicText: 'رَبِّ اشْرَحْ لِي صَدْرِي ۝ وَيَسِّرْ لِي أَمْرِي ۝ وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي ۝ يَفْقَهُوا قَوْلِي',
    transliteration:
      'Rabbish-raḥ lī ṣadrī, wa yassir lī amrī, waḥlul ‘uqdatam mil-lisānī, yafqahū qawlī.',
    translation:
      'My Lord, expand for me my breast [with confidence], and ease for me my task, and untie the knot from my tongue that they may understand my speech.',
    reference: 'Surah Ta-Ha (20:25-28)',
    situation: 'Interviews, public speaking, negotiations, exams, or complex tasks.',
    benefit: 'Instills confidence, clarity of thought, and removes fear of speaking.',
  },
];
