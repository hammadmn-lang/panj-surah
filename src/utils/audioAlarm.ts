// Web Audio Synthesizer & Adhan Audio Player for Alarms

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Gentle Tasbeeh bead click sound
export function playTasbeehClick(pitchOffset = 0) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520 + pitchOffset, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(380 + pitchOffset, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch {
    // ignore
  }
}

// Tasbeeh target completed milestone chime
export function playCompletionChime() {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

      gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.65);
    });
  } catch {
    // ignore
  }
}

export const ADHAN_AUDIO_SOURCES: Record<string, { name: string; url: string; origin: string }> = {
  adhan_makkah: {
    name: 'Masjid al-Haram, Makkah (Sheikh Ali Mulla)',
    url: 'https://cdn.islamic.network/adhan/makkah.mp3',
    origin: 'Makkah Mukarramah',
  },
  adhan_madinah: {
    name: 'Al-Masjid an-Nabawi, Madinah',
    url: 'https://cdn.islamic.network/adhan/madina.mp3',
    origin: 'Madinah Munawwarah',
  },
  adhan_alaqsa: {
    name: 'Al-Aqsa Mosque, Jerusalem',
    url: 'https://cdn.islamic.network/adhan/alaqsa.mp3',
    origin: 'Al-Quds Al-Sharif',
  },
  adhan_mishary: {
    name: 'Sheikh Mishary Rashid Alafasy',
    url: 'https://cdn.islamic.network/adhan/alafasy.mp3',
    origin: 'Kuwait',
  },
};

let currentAdhanAudio: HTMLAudioElement | null = null;

// Stop any currently playing Adhan audio
export function stopAdhanPlayback() {
  if (currentAdhanAudio) {
    currentAdhanAudio.pause();
    currentAdhanAudio.currentTime = 0;
    currentAdhanAudio = null;
  }
}

// Play Adhan by audio type (stream or synthesized fallback)
export function playAdhan(
  soundType: 'adhan_makkah' | 'adhan_madinah' | 'adhan_alaqsa' | 'adhan_mishary' | 'chime' | 'takbeer' | 'beep' = 'adhan_makkah',
  onEnded?: () => void
): HTMLAudioElement | null {
  stopAdhanPlayback();

  if (soundType === 'chime' || soundType === 'takbeer' || soundType === 'beep') {
    playPrayerAlarmTone(soundType);
    if (onEnded) setTimeout(onEnded, 2000);
    return null;
  }

  const source = ADHAN_AUDIO_SOURCES[soundType] || ADHAN_AUDIO_SOURCES.adhan_makkah;
  try {
    const audio = new Audio(source.url);
    currentAdhanAudio = audio;
    audio.play().catch(() => {
      // If network fails or blocked, fallback to synthesized chime
      playPrayerAlarmTone('takbeer');
      if (onEnded) onEnded();
    });

    if (onEnded) {
      audio.onended = onEnded;
    }
    return audio;
  } catch {
    playPrayerAlarmTone('chime');
    if (onEnded) onEnded();
    return null;
  }
}

// 15-Minute Warning Alarm Tone (Gentle reminding chime)
export function play15MinWarningTone() {
  try {
    const ctx = getAudioContext();
    const notes = [659.25, 587.33, 523.25]; // E5 -> D5 -> C5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.18);
      gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.18 + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.18);
      osc.stop(ctx.currentTime + idx * 0.18 + 0.55);
    });
  } catch {
    // ignore
  }
}

// Spiritual prayer alarm chime / Adhan synthesis
export function playPrayerAlarmTone(type: 'chime' | 'takbeer' | 'beep' = 'chime') {
  try {
    const ctx = getAudioContext();
    if (type === 'beep') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
      return;
    }

    // Melodic Eastern harmonic chime
    const chords = [
      { freq: 440, time: 0, dur: 0.8 }, // A4
      { freq: 554.37, time: 0.25, dur: 0.9 }, // C#5
      { freq: 659.25, time: 0.5, dur: 1.2 }, // E5
      { freq: 880, time: 0.75, dur: 1.5 }, // A5
      { freq: 659.25, time: 1.2, dur: 1.0 },
      { freq: 554.37, time: 1.6, dur: 1.5 },
    ];

    chords.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

      gain.gain.setValueAtTime(0.3, ctx.currentTime + note.time);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.time + note.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + note.time);
      osc.stop(ctx.currentTime + note.time + note.dur + 0.1);
    });
  } catch {
    // ignore
  }
}

// Request and trigger browser notifications for prayer times
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

export function sendPrayerNotification(prayerName: string, message?: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(`🕌 Time for ${prayerName} Prayer`, {
        body: message || `It is now time for ${prayerName}. "Indeed, prayer has been decreed upon the believers a decree of specified times."`,
        icon: '/favicon.ico',
      });
    } catch {
      // fallback
    }
  }
}

export function send15MinWarningNotification(currentPrayer: string, nextPrayer: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(`⏰ 15 Minutes Remaining for ${currentPrayer}`, {
        body: `${currentPrayer} prayer time is closing in 15 minutes before ${nextPrayer} begins. Make sure to perform your prayer!`,
        icon: '/favicon.ico',
      });
    } catch {
      // fallback
    }
  }
}
