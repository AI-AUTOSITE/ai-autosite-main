// app/hooks/audio/useAudioBuffer.ts
// 音声ファイルをAudioBufferにデコードするHook
'use client';

import { useState, useCallback, useRef } from 'react';
import { useAudioContext } from './useAudioContext';
import type { AudioBufferInfo, ProcessingProgress } from '@/app/lib/audio-toolkit/types';

interface UseAudioBufferReturn {
  buffer: AudioBuffer | null;
  bufferInfo: AudioBufferInfo | null;
  isLoading: boolean;
  progress: ProcessingProgress;
  error: Error | null;
  loadFromFile: (file: File) => Promise<AudioBuffer>;
  loadFromUrl: (url: string) => Promise<AudioBuffer>;
  loadFromBlob: (blob: Blob) => Promise<AudioBuffer>;
  reset: () => void;
}

/**
 * 音声ファイルをAudioBufferにデコードするHook
 * 
 * @example
 * ```tsx
 * const { buffer, isLoading, loadFromFile, reset } = useAudioBuffer();
 * 
 * const handleFileSelect = async (file: File) => {
 *   try {
 *     const audioBuffer = await loadFromFile(file);
 *     console.log('Duration:', audioBuffer.duration);
 *   } catch (err) {
 *     console.error('Failed to load:', err);
 *   }
 * };
 * ```
 */
export function useAudioBuffer(): UseAudioBufferReturn {
  const { audioContext, resumeContext, createContext } = useAudioContext();
  
  const [buffer, setBuffer] = useState<AudioBuffer | null>(null);
  const [bufferInfo, setBufferInfo] = useState<AudioBufferInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState<ProcessingProgress>({
    status: 'idle',
    progress: 0,
    message: '',
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * ArrayBufferからAudioBufferにデコード
   */
  const decodeArrayBuffer = useCallback(async (arrayBuffer: ArrayBuffer): Promise<AudioBuffer> => {
    // AudioContextを確保
    await resumeContext();
    const ctx = createContext();

    setProgress({
      status: 'processing',
      progress: 50,
      message: 'Decoding audio...',
    });

    try {
      // decodeAudioData
      const decodedBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
      
      // バッファ情報を保存
      const info: AudioBufferInfo = {
        duration: decodedBuffer.duration,
        sampleRate: decodedBuffer.sampleRate,
        numberOfChannels: decodedBuffer.numberOfChannels,
        length: decodedBuffer.length,
      };
      
      setBuffer(decodedBuffer);
      setBufferInfo(info);
      setProgress({
        status: 'complete',
        progress: 100,
        message: 'Audio loaded successfully',
      });
      
      return decodedBuffer;
    } catch (err) {
      const decodeError = new Error(
        'Failed to decode audio file. The file may be corrupted or in an unsupported format.'
      );
      throw decodeError;
    }
  }, [resumeContext, createContext]);

  /**
   * Fileからロード
   */
  const loadFromFile = useCallback(async (file: File): Promise<AudioBuffer> => {
    // 前回の処理をキャンセル
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);
    setProgress({
      status: 'loading',
      progress: 0,
      message: 'Reading file...',
    });

    try {
      // ファイルを読み込み
      setProgress({
        status: 'loading',
        progress: 20,
        message: 'Reading file...',
      });

      const arrayBuffer = await file.arrayBuffer();

      // キャンセルチェック
      if (abortControllerRef.current?.signal.aborted) {
        throw new Error('Operation cancelled');
      }

      setProgress({
        status: 'loading',
        progress: 40,
        message: 'Preparing to decode...',
      });

      // デコード
      const decodedBuffer = await decodeArrayBuffer(arrayBuffer);
      return decodedBuffer;

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load audio file');
      setError(error);
      setProgress({
        status: 'error',
        progress: 0,
        message: error.message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [decodeArrayBuffer]);

  /**
   * URLからロード
   */
  const loadFromUrl = useCallback(async (url: string): Promise<AudioBuffer> => {
    // 前回の処理をキャンセル
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);
    setProgress({
      status: 'loading',
      progress: 0,
      message: 'Fetching audio...',
    });

    try {
      setProgress({
        status: 'loading',
        progress: 10,
        message: 'Downloading...',
      });

      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.status} ${response.statusText}`);
      }

      setProgress({
        status: 'loading',
        progress: 30,
        message: 'Processing download...',
      });

      const arrayBuffer = await response.arrayBuffer();

      setProgress({
        status: 'loading',
        progress: 40,
        message: 'Preparing to decode...',
      });

      // デコード
      const decodedBuffer = await decodeArrayBuffer(arrayBuffer);
      return decodedBuffer;

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('Download cancelled');
      }
      const error = err instanceof Error ? err : new Error('Failed to load audio from URL');
      setError(error);
      setProgress({
        status: 'error',
        progress: 0,
        message: error.message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [decodeArrayBuffer]);

  /**
   * Blobからロード
   */
  const loadFromBlob = useCallback(async (blob: Blob): Promise<AudioBuffer> => {
    setIsLoading(true);
    setError(null);
    setProgress({
      status: 'loading',
      progress: 0,
      message: 'Reading blob...',
    });

    try {
      setProgress({
        status: 'loading',
        progress: 20,
        message: 'Converting blob...',
      });

      const arrayBuffer = await blob.arrayBuffer();

      setProgress({
        status: 'loading',
        progress: 40,
        message: 'Preparing to decode...',
      });

      // デコード
      const decodedBuffer = await decodeArrayBuffer(arrayBuffer);
      return decodedBuffer;

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load audio from blob');
      setError(error);
      setProgress({
        status: 'error',
        progress: 0,
        message: error.message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [decodeArrayBuffer]);

  /**
   * 状態をリセット
   */
  const reset = useCallback(() => {
    // 進行中の処理をキャンセル
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setBuffer(null);
    setBufferInfo(null);
    setIsLoading(false);
    setError(null);
    setProgress({
      status: 'idle',
      progress: 0,
      message: '',
    });
  }, []);

  return {
    buffer,
    bufferInfo,
    isLoading,
    progress,
    error,
    loadFromFile,
    loadFromUrl,
    loadFromBlob,
    reset,
  };
}

export default useAudioBuffer;
