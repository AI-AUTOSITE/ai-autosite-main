// app/components/audio/ExportPanel.tsx
// 音声エクスポート設定・ダウンロードコンポーネント
'use client';

import React, { useState, useCallback } from 'react';
import { Download, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import type { AudioFormat, AudioQuality, ExportOptions } from '../../lib/audio-toolkit/types';

interface ExportPanelProps {
  onExport: (options: ExportOptions) => void;
  isExporting?: boolean;
  exportProgress?: number;
  availableFormats?: AudioFormat[];
  defaultFormat?: AudioFormat;
  defaultQuality?: AudioQuality;
  showQualityOptions?: boolean;
  showAdvancedOptions?: boolean;
  disabled?: boolean;
  buttonLabel?: string;
  className?: string;
}

// フォーマット情報
const FORMAT_INFO: Record<AudioFormat, { name: string; description: string; extension: string }> = {
  mp3: { name: 'MP3', description: 'Compressed, widely compatible', extension: '.mp3' },
  wav: { name: 'WAV', description: 'Uncompressed, highest quality', extension: '.wav' },
  ogg: { name: 'OGG', description: 'Compressed, open format', extension: '.ogg' },
  flac: { name: 'FLAC', description: 'Lossless compression', extension: '.flac' },
  m4a: { name: 'M4A', description: 'AAC audio, Apple compatible', extension: '.m4a' },
  webm: { name: 'WebM', description: 'Web optimized', extension: '.webm' },
};

// クオリティ設定
const QUALITY_OPTIONS: { value: AudioQuality; label: string; description: string }[] = [
  { value: 'low', label: 'Economy', description: 'Smaller file, lower quality' },
  { value: 'medium', label: 'Standard', description: 'Balanced quality and size' },
  { value: 'high', label: 'High', description: 'Better quality, larger file' },
  { value: 'maximum', label: 'Maximum', description: 'Best quality, largest file' },
];

// ビットレート（MP3用）
const BITRATE_OPTIONS = [
  { value: 128, label: '128 kbps', description: 'Economy' },
  { value: 192, label: '192 kbps', description: 'Standard' },
  { value: 256, label: '256 kbps', description: 'High' },
  { value: 320, label: '320 kbps', description: 'Maximum' },
];

// ビット深度（WAV用）
const BIT_DEPTH_OPTIONS = [
  { value: 16, label: '16-bit', description: 'CD Quality' },
  { value: 24, label: '24-bit', description: 'Professional' },
  { value: 32, label: '32-bit', description: 'Maximum precision' },
];

// サンプルレート
const SAMPLE_RATE_OPTIONS = [
  { value: 22050, label: '22.05 kHz', description: 'Voice' },
  { value: 44100, label: '44.1 kHz', description: 'CD Quality' },
  { value: 48000, label: '48 kHz', description: 'Professional' },
];

/**
 * 音声エクスポート設定コンポーネント
 * 
 * @example
 * ```tsx
 * <ExportPanel
 *   onExport={(options) => handleExport(options)}
 *   availableFormats={['mp3', 'wav']}
 *   defaultFormat="wav"
 *   showQualityOptions
 * />
 * ```
 */
export function ExportPanel({
  onExport,
  isExporting = false,
  exportProgress = 0,
  availableFormats = ['wav', 'mp3'],
  defaultFormat = 'wav',
  defaultQuality = 'high',
  showQualityOptions = true,
  showAdvancedOptions = false,
  disabled = false,
  buttonLabel = 'Download',
  className = '',
}: ExportPanelProps) {
  const [format, setFormat] = useState<AudioFormat>(defaultFormat);
  const [quality, setQuality] = useState<AudioQuality>(defaultQuality);
  const [bitrate, setBitrate] = useState<128 | 192 | 256 | 320>(192);
  const [bitDepth, setBitDepth] = useState<16 | 24 | 32>(24);
  const [sampleRate, setSampleRate] = useState<22050 | 44100 | 48000>(44100);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // エクスポート実行
  const handleExport = useCallback(() => {
    const options: ExportOptions = {
      format,
      quality,
      sampleRate,
      bitrate: format === 'mp3' ? bitrate : undefined,
      bitDepth: format === 'wav' ? bitDepth : undefined,
      channels: 2,
    };
    onExport(options);
  }, [format, quality, sampleRate, bitrate, bitDepth, onExport]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* フォーマット選択 */}
      <div className="space-y-2">
        <label className="block text-sm text-gray-400">Output Format</label>
        <div className="flex flex-wrap gap-2">
          {availableFormats.map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFormat(fmt)}
              disabled={disabled || isExporting}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${format === fmt
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {FORMAT_INFO[fmt].name}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          {FORMAT_INFO[format].description}
        </p>
      </div>

      {/* クオリティ選択（シンプル） */}
      {showQualityOptions && (
        <div className="space-y-2">
          <label className="block text-sm text-gray-400">Quality</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {QUALITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setQuality(opt.value)}
                disabled={disabled || isExporting}
                className={`px-3 py-2 rounded-lg text-sm transition-colors
                  ${quality === opt.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 詳細設定 */}
      {showAdvancedOptions && (
        <div className="border-t border-gray-700 pt-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4" />
            Advanced Settings
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-4 pl-6">
              {/* MP3: ビットレート */}
              {format === 'mp3' && (
                <div className="space-y-2">
                  <label className="block text-sm text-gray-400">Bitrate</label>
                  <select
                    value={bitrate}
                    onChange={(e) => setBitrate(Number(e.target.value) as any)}
                    disabled={disabled || isExporting}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 
                      rounded-lg text-white text-sm
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      disabled:opacity-50"
                  >
                    {BITRATE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} - {opt.description}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* WAV: ビット深度 */}
              {format === 'wav' && (
                <div className="space-y-2">
                  <label className="block text-sm text-gray-400">Bit Depth</label>
                  <select
                    value={bitDepth}
                    onChange={(e) => setBitDepth(Number(e.target.value) as any)}
                    disabled={disabled || isExporting}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 
                      rounded-lg text-white text-sm
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      disabled:opacity-50"
                  >
                    {BIT_DEPTH_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} - {opt.description}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* サンプルレート */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Sample Rate</label>
                <select
                  value={sampleRate}
                  onChange={(e) => setSampleRate(Number(e.target.value) as any)}
                  disabled={disabled || isExporting}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 
                    rounded-lg text-white text-sm
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    disabled:opacity-50"
                >
                  {SAMPLE_RATE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} - {opt.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* エクスポートボタン */}
      <button
        onClick={handleExport}
        disabled={disabled || isExporting}
        className="w-full flex items-center justify-center gap-2 px-6 py-3
          bg-gradient-to-r from-blue-500 to-cyan-500 
          hover:from-blue-600 hover:to-cyan-600
          text-white font-semibold rounded-xl transition-all
          disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-500 disabled:to-gray-600"
      >
        {isExporting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Exporting... {exportProgress > 0 && `${Math.round(exportProgress)}%`}
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            {buttonLabel} {FORMAT_INFO[format].extension.toUpperCase()}
          </>
        )}
      </button>
    </div>
  );
}

/**
 * シンプルなダウンロードボタン
 */
export function DownloadButton({
  onClick,
  isLoading = false,
  disabled = false,
  label = 'Download',
  format,
  className = '',
}: {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  label?: string;
  format?: AudioFormat;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`flex items-center justify-center gap-2 px-6 py-3
        bg-gradient-to-r from-blue-500 to-cyan-500 
        hover:from-blue-600 hover:to-cyan-600
        text-white font-semibold rounded-xl transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}`}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <Download className="w-5 h-5" />
      )}
      {label}
      {format && ` .${format.toUpperCase()}`}
    </button>
  );
}

export default ExportPanel;
