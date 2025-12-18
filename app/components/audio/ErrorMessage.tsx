// app/components/audio/ErrorMessage.tsx
// エラー表示コンポーネント
'use client';

import React from 'react';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import type { AudioToolError, AudioErrorCode, AUDIO_ERRORS } from '../../lib/audio-toolkit/types';

type Severity = 'error' | 'warning' | 'info';

interface ErrorAction {
  label: string;
  onClick: () => void;
  isPrimary?: boolean;
}

interface ErrorMessageProps {
  error: AudioToolError | Error | string;
  severity?: Severity;
  dismissible?: boolean;
  onDismiss?: () => void;
  actions?: ErrorAction[];
  showIcon?: boolean;
  className?: string;
}

/**
 * エラー表示コンポーネント
 * 
 * @example
 * ```tsx
 * <ErrorMessage
 *   error={{ code: 'FILE_TOO_LARGE', title: 'File Too Large', message: '...' }}
 *   severity="error"
 *   dismissible
 *   onDismiss={() => setError(null)}
 *   actions={[
 *     { label: 'Try Again', onClick: handleRetry, isPrimary: true },
 *   ]}
 * />
 * ```
 */
export function ErrorMessage({
  error,
  severity = 'error',
  dismissible = false,
  onDismiss,
  actions = [],
  showIcon = true,
  className = '',
}: ErrorMessageProps) {
  // エラーを正規化
  const normalizedError = normalizeError(error);

  // スタイル設定
  const severityConfig = {
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      icon: AlertCircle,
      iconColor: 'text-red-400',
      titleColor: 'text-red-400',
      textColor: 'text-red-300',
      buttonPrimary: 'bg-red-600 hover:bg-red-700 text-white',
      buttonSecondary: 'text-red-400 hover:text-red-300 hover:bg-red-500/20',
    },
    warning: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
      titleColor: 'text-amber-400',
      textColor: 'text-amber-300',
      buttonPrimary: 'bg-amber-600 hover:bg-amber-700 text-white',
      buttonSecondary: 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/20',
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      icon: Info,
      iconColor: 'text-blue-400',
      titleColor: 'text-blue-400',
      textColor: 'text-blue-300',
      buttonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
      buttonSecondary: 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/20',
    },
  };

  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div
      className={`${config.bg} border ${config.border} rounded-xl p-4 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* アイコン */}
        {showIcon && (
          <div className="flex-shrink-0 pt-0.5">
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          </div>
        )}

        {/* コンテンツ */}
        <div className="flex-1 min-w-0">
          {/* タイトル */}
          {normalizedError.title && (
            <h4 className={`font-medium ${config.titleColor}`}>
              {normalizedError.title}
            </h4>
          )}

          {/* メッセージ */}
          <p className={`${config.textColor} ${normalizedError.title ? 'mt-1' : ''} text-sm`}>
            {normalizedError.message}
          </p>

          {/* 提案 */}
          {normalizedError.suggestion && (
            <p className="text-gray-400 text-sm mt-2">
              💡 {normalizedError.suggestion}
            </p>
          )}

          {/* アクションボタン */}
          {actions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
                    ${action.isPrimary ? config.buttonPrimary : config.buttonSecondary}`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 閉じるボタン */}
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className={`flex-shrink-0 p-1 ${config.iconColor} hover:bg-white/10 rounded transition-colors`}
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * エラーオブジェクトを正規化
 */
function normalizeError(error: AudioToolError | Error | string): AudioToolError {
  // 文字列の場合
  if (typeof error === 'string') {
    return {
      code: 'UNKNOWN_ERROR',
      title: '',
      message: error,
    };
  }

  // AudioToolErrorの場合
  if ('code' in error && 'message' in error) {
    return error as AudioToolError;
  }

  // 通常のErrorオブジェクトの場合
  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      title: error.name !== 'Error' ? error.name : '',
      message: error.message,
    };
  }

  // その他
  return {
    code: 'UNKNOWN_ERROR',
    title: '',
    message: 'An unknown error occurred',
  };
}

/**
 * シンプルなインラインエラー表示
 */
export function InlineError({
  message,
  className = '',
}: {
  message: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 text-red-400 text-sm ${className}`}>
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

/**
 * ブラウザ非対応メッセージ
 */
export function BrowserNotSupported({
  feature,
  supportedBrowsers = ['Chrome', 'Firefox', 'Edge'],
  className = '',
}: {
  feature: string;
  supportedBrowsers?: string[];
  className?: string;
}) {
  return (
    <ErrorMessage
      error={{
        code: 'BROWSER_NOT_SUPPORTED',
        title: 'Browser Not Supported',
        message: `${feature} is not supported in your browser.`,
        suggestion: `Try using ${supportedBrowsers.join(', ')}.`,
      }}
      severity="warning"
      className={className}
    />
  );
}

export default ErrorMessage;
