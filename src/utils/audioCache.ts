// Offline Audio Cache Manager using browser Cache API & IndexedDB

const CACHE_NAME = 'panj-surah-audio-v1';

export interface DownloadProgress {
  surahId: number;
  progress: number; // 0 to 100
  isDownloading: boolean;
  error?: string;
}

export async function isSurahCached(audioUrl: string): Promise<boolean> {
  if (!('caches' in window)) return false;
  try {
    const cache = await caches.open(CACHE_NAME);
    const match = await cache.match(audioUrl);
    return !!match;
  } catch {
    return false;
  }
}

export async function downloadSurahAudio(
  surahId: number,
  audioUrl: string,
  onProgress?: (percent: number) => void
): Promise<boolean> {
  if (!('caches' in window)) {
    throw new Error('Cache storage is not supported in this browser.');
  }

  try {
    const response = await fetch(audioUrl);
    if (!response.ok) throw new Error('Failed to fetch audio stream');

    const contentLength = response.headers.get('content-length');
    const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;

    if (!response.body || totalBytes === 0) {
      // Fallback direct cache
      const cache = await caches.open(CACHE_NAME);
      await cache.put(audioUrl, response);
      if (onProgress) onProgress(100);
      return true;
    }

    const reader = response.body.getReader();
    let receivedBytes = 0;
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      receivedBytes += value.length;
      if (onProgress && totalBytes > 0) {
        const percent = Math.min(99, Math.round((receivedBytes / totalBytes) * 100));
        onProgress(percent);
      }
    }

    const blob = new Blob(chunks, { type: 'audio/mpeg' });
    const cachedResponse = new Response(blob, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': blob.size.toString(),
      },
    });

    const cache = await caches.open(CACHE_NAME);
    await cache.put(audioUrl, cachedResponse);

    if (onProgress) onProgress(100);
    return true;
  } catch (error) {
    console.error('Audio download error:', error);
    throw error;
  }
}

export async function removeCachedSurah(audioUrl: string): Promise<boolean> {
  if (!('caches' in window)) return false;
  try {
    const cache = await caches.open(CACHE_NAME);
    return await cache.delete(audioUrl);
  } catch {
    return false;
  }
}

export async function getCachedAudioBlobUrl(audioUrl: string): Promise<string | null> {
  if (!('caches' in window)) return null;
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(audioUrl);
    if (response) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
  } catch (e) {
    console.warn('Error reading from cache', e);
  }
  return null;
}

export async function getCacheStorageEstimate(): Promise<{ usageMB: number; quotaMB: number }> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const { usage = 0, quota = 0 } = await navigator.storage.estimate();
      return {
        usageMB: Math.round((usage / (1024 * 1024)) * 10) / 10,
        quotaMB: Math.round((quota / (1024 * 1024)) * 10) / 10,
      };
    } catch {
      // ignore
    }
  }
  return { usageMB: 0, quotaMB: 0 };
}
