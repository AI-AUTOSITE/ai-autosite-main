// app/hooks/audio/useAudioExport.ts
// AudioBufferをWAV/MP3にエンコードしてダウンロードするHook
'use client';

import { useState, useCallback } from 'react';
import type { ExportOptions, AudioFormat } from '@/app/lib/audio-toolkit/types';

interface UseAudioExportReturn {
  isExporting: boolean;
  progress: number;
  error: Error | null;
  exportToWav: (buffer: AudioBuffer, options?: Partial<WavExportOptions>) => Promise<Blob>;
  exportToMp3: (buffer: AudioBuffer, options?: Partial<Mp3ExportOptions>) => Promise<Blob>;
  download: (blob: Blob, filename: string) => void;
  reset: () => void;
}

interface WavExportOptions {
  bitDepth: 16 | 24 | 32;
}

interface Mp3ExportOptions {
  bitrate: 128 | 192 | 256 | 320;
  sampleRate: 44100 | 48000;
}

/**
 * AudioBufferをWAV/MP3にエクスポートするHook
 * 
 * @example
 * ```tsx
 * const { exportToWav, download, isExporting } = useAudioExport();
 * 
 * const handleExport = async () => {
 *   const wavBlob = await exportToWav(audioBuffer, { bitDepth: 24 });
 *   download(wavBlob, 'output.wav');
 * };
 * ```
 */
export function useAudioExport(): UseAudioExportReturn {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  /**
   * AudioBufferをWAVにエンコード
   */
  const exportToWav = useCallback(async (
    buffer: AudioBuffer,
    options: Partial<WavExportOptions> = {}
  ): Promise<Blob> => {
    const { bitDepth = 24 } = options;

    setIsExporting(true);
    setProgress(0);
    setError(null);

    try {
      setProgress(10);

      // audiobuffer-to-wav を動的インポート
      const toWav = (await import('audiobuffer-to-wav')).default;

      setProgress(30);

      // WAVに変換
      // Note: audiobuffer-to-wavは16bitのみサポート
      // 24/32bitは手動実装が必要だが、まずは16bitで対応
      const wavBuffer = toWav(buffer);

      setProgress(80);

      // Blobに変換
      const blob = new Blob([wavBuffer], { type: 'audio/wav' });

      setProgress(100);
      return blob;

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to export to WAV');
      setError(error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, []);

  /**
   * AudioBufferをMP3にエンコード
   */
  const exportToMp3 = useCallback(async (
    buffer: AudioBuffer,
    options: Partial<Mp3ExportOptions> = {}
  ): Promise<Blob> => {
    const { bitrate = 192, sampleRate = 44100 } = options;

    setIsExporting(true);
    setProgress(0);
    setError(null);

    try {
      setProgress(5);

      // lamejs を動的インポート
      const lamejs = await import('@breezystack/lamejs');

      setProgress(10);

      const channels = buffer.numberOfChannels;
      const samples = buffer.length;
      const mp3encoder = new lamejs.Mp3Encoder(channels, buffer.sampleRate, bitrate);

      setProgress(15);

      // Float32 → Int16 変換
      const left = convertFloat32ToInt16(buffer.getChannelData(0));
      const right = channels > 1 
        ? convertFloat32ToInt16(buffer.getChannelData(1)) 
        : left;

      setProgress(30);

      // エンコード
      const mp3Data: Int8Array[] = [];
      const sampleBlockSize = 1152;

      for (let i = 0; i < samples; i += sampleBlockSize) {
        const leftChunk = left.subarray(i, i + sampleBlockSize);
        const rightChunk = right.subarray(i, i + sampleBlockSize);

        let mp3buf: Int8Array;
        if (channels === 1) {
          mp3buf = mp3encoder.encodeBuffer(leftChunk);
        } else {
          mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
        }

        if (mp3buf.length > 0) {
          mp3Data.push(mp3buf);
        }

        // 進捗更新
        const encodeProgress = 30 + ((i / samples) * 60);
        setProgress(Math.min(90, encodeProgress));
      }

      // フラッシュ
      const mp3buf = mp3encoder.flush();
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }

      setProgress(95);

      // Blobに変換
      const blob = new Blob(mp3Data, { type: 'audio/mpeg' });

      setProgress(100);
      return blob;

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to export to MP3');
      setError(error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, []);

  /**
   * Blobをダウンロード
   */
  const download = useCallback((blob: Blob, filename: string): void => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  /**
   * 状態をリセット
   */
  const reset = useCallback(() => {
    setIsExporting(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    isExporting,
    progress,
    error,
    exportToWav,
    exportToMp3,
    download,
    reset,
  };
}

/**
 * Float32Array を Int16Array に変換
 */
function convertFloat32ToInt16(float32Array: Float32Array): Int16Array {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    // クリッピング
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    // Int16に変換
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return int16Array;
}

export default useAudioExport;
