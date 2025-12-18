// app/hooks/audio/useAudioContext.ts
// AudioContext管理Hook（シングルトン + Safari対応）
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// シングルトンでAudioContextを管理（Safari: 最大4インスタンス制限対応）
let globalAudioContext: AudioContext | null = null;
let contextRefCount = 0;

interface UseAudioContextReturn {
  audioContext: AudioContext | null;
  isReady: boolean;
  error: Error | null;
  resumeContext: () => Promise<void>;
  suspendContext: () => Promise<void>;
  createContext: () => AudioContext;
}

/**
 * AudioContextを管理するHook
 * 
 * 特徴:
 * - シングルトンパターン（Safari 4インスタンス制限対応）
 * - ユーザージェスチャー後に自動resume（Safari対応）
 * - 適切なクリーンアップ
 * 
 * @example
 * ```tsx
 * const { audioContext, isReady, resumeContext } = useAudioContext();
 * 
 * const handleClick = async () => {
 *   await resumeContext();
 *   // audioContext を使用
 * };
 * ```
 */
export function useAudioContext(): UseAudioContextReturn {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isInitialized = useRef(false);

  // AudioContextを取得または作成
  const createContext = useCallback((): AudioContext => {
    if (globalAudioContext && globalAudioContext.state !== 'closed') {
      return globalAudioContext;
    }

    // AudioContext または webkitAudioContext（Safari旧バージョン）
    const AudioContextClass = 
      typeof window !== 'undefined' 
        ? window.AudioContext || (window as any).webkitAudioContext
        : null;

    if (!AudioContextClass) {
      throw new Error('Web Audio API is not supported in this browser');
    }

    globalAudioContext = new AudioContextClass();
    return globalAudioContext;
  }, []);

  // ユーザージェスチャー後にresumeする（Safari対応）
  const resumeContext = useCallback(async (): Promise<void> => {
    try {
      const ctx = createContext();

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // Safari: interrupted状態の対応
      if ((ctx as any).state === 'interrupted') {
        await ctx.resume();
      }

      setIsReady(true);
      setError(null);
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to resume audio context');
      setError(error);
      throw error;
    }
  }, [createContext]);

  // AudioContextを一時停止
  const suspendContext = useCallback(async (): Promise<void> => {
    if (globalAudioContext && globalAudioContext.state === 'running') {
      await globalAudioContext.suspend();
      setIsReady(false);
    }
  }, []);

  // 初期化
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isInitialized.current) return;
    
    isInitialized.current = true;
    contextRefCount++;

    // ユーザーインタラクションでresume
    const handleUserGesture = () => {
      resumeContext().catch(console.error);
    };

    // 複数のイベントを登録（最初の1回だけ実行）
    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, handleUserGesture, { once: true });
    });

    // 初期状態チェック
    try {
      const ctx = createContext();
      if (ctx.state === 'running') {
        setIsReady(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize audio context'));
    }

    // クリーンアップ
    return () => {
      contextRefCount--;
      events.forEach(event => {
        document.removeEventListener(event, handleUserGesture);
      });

      // 最後の参照がなくなったらcloseしない（再利用のため）
      // 必要に応じてアプリ終了時にcloseする
    };
  }, [createContext, resumeContext]);

  // AudioContextのstate変更を監視
  useEffect(() => {
    if (!globalAudioContext) return;

    const handleStateChange = () => {
      if (globalAudioContext) {
        setIsReady(globalAudioContext.state === 'running');
      }
    };

    globalAudioContext.addEventListener('statechange', handleStateChange);
    
    return () => {
      globalAudioContext?.removeEventListener('statechange', handleStateChange);
    };
  }, []);

  return {
    audioContext: globalAudioContext,
    isReady,
    error,
    resumeContext,
    suspendContext,
    createContext,
  };
}

/**
 * AudioContextを強制的にcloseする（通常は使用しない）
 */
export function closeGlobalAudioContext(): void {
  if (globalAudioContext) {
    globalAudioContext.close();
    globalAudioContext = null;
    contextRefCount = 0;
  }
}

/**
 * AudioContextのサポート状況をチェック
 */
export function isAudioContextSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window.AudioContext || (window as any).webkitAudioContext);
}

export default useAudioContext;
