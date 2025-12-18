// app/hooks/audio/useMediaRecorder.ts
// マイク録音Hook（MediaRecorder API使用）
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export type RecordingState = 'inactive' | 'recording' | 'paused';

interface UseMediaRecorderOptions {
  mimeType?: string;
  audioBitsPerSecond?: number;
  onDataAvailable?: (blob: Blob) => void;
}

interface UseMediaRecorderReturn {
  state: RecordingState;
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
  audioUrl: string;
  error: Error | null;
  start: () => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  hasPermission: boolean | null;
  requestPermission: () => Promise<boolean>;
}

/**
 * マイク録音を管理するHook
 * 
 * @example
 * ```tsx
 * const { isRecording, start, stop, audioBlob, duration } = useMediaRecorder();
 * 
 * return (
 *   <div>
 *     <button onClick={isRecording ? stop : start}>
 *       {isRecording ? 'Stop' : 'Start'}
 *     </button>
 *     <p>Duration: {duration}s</p>
 *   </div>
 * );
 * ```
 */
export function useMediaRecorder(options: UseMediaRecorderOptions = {}): UseMediaRecorderReturn {
  const {
    mimeType = 'audio/webm;codecs=opus',
    audioBitsPerSecond = 128000,
    onDataAvailable,
  } = options;

  const [state, setState] = useState<RecordingState>('inactive');
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedDurationRef = useRef<number>(0);

  // サポートされているMIMEタイプを取得
  const getSupportedMimeType = useCallback((): string => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/wav',
    ];
    
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    
    return '';
  }, []);

  // 録音時間を更新
  const updateDuration = useCallback(() => {
    if (state === 'recording' && startTimeRef.current > 0) {
      const elapsed = (Date.now() - startTimeRef.current) / 1000 + pausedDurationRef.current;
      setDuration(Math.floor(elapsed));
    }
  }, [state]);

  // タイマー管理
  useEffect(() => {
    if (state === 'recording') {
      timerRef.current = setInterval(updateDuration, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state, updateDuration]);

  // パーミッション確認
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      return true;
    } catch (err) {
      setHasPermission(false);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError(new Error('Microphone permission denied. Please allow access in your browser settings.'));
        } else if (err.name === 'NotFoundError') {
          setError(new Error('No microphone found. Please connect a microphone.'));
        } else {
          setError(err);
        }
      }
      return false;
    }
  }, []);

  // 録音開始
  const start = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      chunksRef.current = [];

      // 既存のURLをクリーンアップ
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl('');
      }
      setAudioBlob(null);

      // マイクアクセス
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      streamRef.current = stream;
      setHasPermission(true);

      // MIMEタイプ決定
      const actualMimeType = MediaRecorder.isTypeSupported(mimeType) 
        ? mimeType 
        : getSupportedMimeType();

      if (!actualMimeType) {
        throw new Error('No supported audio format found');
      }

      // MediaRecorder作成
      const recorder = new MediaRecorder(stream, {
        mimeType: actualMimeType,
        audioBitsPerSecond,
      });
      mediaRecorderRef.current = recorder;

      // イベントハンドラ
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
          onDataAvailable?.(e.data);
        }
      };

      recorder.onstop = () => {
        // Blobを作成
        const blob = new Blob(chunksRef.current, { type: actualMimeType });
        setAudioBlob(blob);
        
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // ストリームを停止
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      recorder.onerror = (e) => {
        setError(new Error('Recording error occurred'));
        setState('inactive');
      };

      // 録音開始
      recorder.start(1000); // 1秒ごとにデータを取得
      startTimeRef.current = Date.now();
      pausedDurationRef.current = 0;
      setDuration(0);
      setState('recording');

    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError(new Error('Microphone permission denied'));
          setHasPermission(false);
        } else if (err.name === 'NotFoundError') {
          setError(new Error('No microphone found'));
        } else {
          setError(err);
        }
      }
      setState('inactive');
    }
  }, [mimeType, audioBitsPerSecond, audioUrl, getSupportedMimeType, onDataAvailable]);

  // 録音停止
  const stop = useCallback((): void => {
    if (mediaRecorderRef.current && state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setState('inactive');
    }
  }, [state]);

  // 一時停止
  const pause = useCallback((): void => {
    if (mediaRecorderRef.current && state === 'recording') {
      mediaRecorderRef.current.pause();
      pausedDurationRef.current = duration;
      setState('paused');
    }
  }, [state, duration]);

  // 再開
  const resume = useCallback((): void => {
    if (mediaRecorderRef.current && state === 'paused') {
      mediaRecorderRef.current.resume();
      startTimeRef.current = Date.now();
      setState('recording');
    }
  }, [state]);

  // リセット
  const reset = useCallback((): void => {
    stop();
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    
    setAudioBlob(null);
    setAudioUrl('');
    setDuration(0);
    setError(null);
    chunksRef.current = [];
    pausedDurationRef.current = 0;
  }, [stop, audioUrl]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    state,
    isRecording: state === 'recording',
    isPaused: state === 'paused',
    duration,
    audioBlob,
    audioUrl,
    error,
    start,
    stop,
    pause,
    resume,
    reset,
    hasPermission,
    requestPermission,
  };
}

export default useMediaRecorder;
