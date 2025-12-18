// app/components/audio/ProgressIndicator.tsx
// 処理進捗表示コンポーネント
'use client';

import React from 'react';
import { Loader2, X } from 'lucide-react';

interface ProgressIndicatorProps {
  progress: number;           // 0-100
  isIndeterminate?: boolean;
  message?: string;
  currentStep?: string;
  totalSteps?: number;
  currentStepIndex?: number;
  estimatedTimeRemaining?: number;  // seconds
  canCancel?: boolean;
  onCancel?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink';
  className?: string;
}

/**
 * 処理進捗を表示するコンポーネント
 * 
 * @example
 * ```tsx
 * <ProgressIndicator
 *   progress={65}
 *   message="Transcribing audio..."
 *   canCancel
 *   onCancel={handleCancel}
 * />
 * ```
 */
export function ProgressIndicator({
  progress,
  isIndeterminate = false,
  message,
  currentStep,
  totalSteps,
  currentStepIndex,
  estimatedTimeRemaining,
  canCancel = false,
  onCancel,
  size = 'md',
  showPercentage = true,
  color = 'blue',
  className = '',
}: ProgressIndicatorProps) {
  // サイズ設定
  const sizeConfig = {
    sm: {
      bar: 'h-1',
      text: 'text-xs',
      icon: 'w-3 h-3',
      padding: 'p-2',
    },
    md: {
      bar: 'h-2',
      text: 'text-sm',
      icon: 'w-4 h-4',
      padding: 'p-3',
    },
    lg: {
      bar: 'h-3',
      text: 'text-base',
      icon: 'w-5 h-5',
      padding: 'p-4',
    },
  };

  // カラー設定
  const colorConfig = {
    blue: {
      gradient: 'from-blue-500 to-cyan-500',
      text: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
    },
    green: {
      gradient: 'from-emerald-500 to-green-500',
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
    },
    purple: {
      gradient: 'from-violet-500 to-purple-500',
      text: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/30',
    },
    orange: {
      gradient: 'from-amber-500 to-orange-500',
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
    },
    pink: {
      gradient: 'from-pink-500 to-rose-500',
      text: 'text-pink-400',
      bg: 'bg-pink-500/10',
      border: 'border-pink-500/30',
    },
  };

  const config = sizeConfig[size];
  const colors = colorConfig[color];

  // 残り時間をフォーマット
  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 進捗を0-100に正規化
  const normalizedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`space-y-2 ${className}`}>
      {/* ヘッダー: メッセージとステップ/パーセント */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isIndeterminate && (
            <Loader2 className={`${config.icon} ${colors.text} animate-spin`} />
          )}
          {message && (
            <span className={`${config.text} text-gray-300`}>
              {message}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* ステップ表示 */}
          {totalSteps && currentStepIndex !== undefined && (
            <span className={`${config.text} text-gray-400`}>
              Step {currentStepIndex + 1} of {totalSteps}
            </span>
          )}
          
          {/* パーセント表示 */}
          {showPercentage && !isIndeterminate && (
            <span className={`${config.text} ${colors.text} font-medium`}>
              {Math.round(normalizedProgress)}%
            </span>
          )}
          
          {/* キャンセルボタン */}
          {canCancel && onCancel && (
            <button
              onClick={onCancel}
              className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 
                rounded transition-colors"
              aria-label="Cancel"
            >
              <X className={config.icon} />
            </button>
          )}
        </div>
      </div>

      {/* プログレスバー */}
      <div className={`w-full ${config.bar} bg-gray-700 rounded-full overflow-hidden`}>
        {isIndeterminate ? (
          // 不定型アニメーション
          <div
            className={`h-full bg-gradient-to-r ${colors.gradient} animate-pulse`}
            style={{ width: '100%' }}
          />
        ) : (
          // 通常のプログレスバー
          <div
            className={`h-full bg-gradient-to-r ${colors.gradient} 
              transition-all duration-300 ease-out`}
            style={{ width: `${normalizedProgress}%` }}
          />
        )}
      </div>

      {/* フッター: 現在のステップと残り時間 */}
      {(currentStep || estimatedTimeRemaining !== undefined) && (
        <div className="flex items-center justify-between">
          {currentStep && (
            <span className={`${config.text} text-gray-500`}>
              {currentStep}
            </span>
          )}
          {estimatedTimeRemaining !== undefined && estimatedTimeRemaining > 0 && (
            <span className={`${config.text} text-gray-500`}>
              ~{formatTime(estimatedTimeRemaining)} remaining
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * シンプルなインラインローダー
 */
export function InlineLoader({
  message = 'Loading...',
  size = 'sm',
  className = '',
}: {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Loader2 className={`${iconSize[size]} text-gray-400 animate-spin`} />
      <span className={`${textSize[size]} text-gray-400`}>{message}</span>
    </div>
  );
}

export default ProgressIndicator;
