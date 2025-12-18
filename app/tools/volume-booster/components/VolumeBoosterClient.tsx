// app/tools/volume-booster/components/VolumeBoosterClient.tsx
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FileDropZone, ProgressIndicator, ErrorMessage } from '../../../components/audio';
import { useAudioBuffer, useAudioExport } from '../../../hooks/audio';
import { adjustVolume, getPeakLevel, getMaxGainWithoutClipping, normalize } from '../../../lib/audio-toolkit';
import { 
  Shield, Zap, Volume2, Play, Pause, RotateCcw, Download, Clock, HardDrive,
  ChevronDown, ChevronUp, Upload, Settings, ArrowRight, HelpCircle,
  VolumeX, Volume1, Gauge, AlertTriangle
} from 'lucide-react';

export default function VolumeBoosterClient() {
  // State
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [gainDb, setGainDb] = useState<number>(6);
  const [isPlaying, setIsPlaying] = useState(false);
  const [processedBuffer, setProcessedBuffer] = useState<AudioBuffer | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [peakLevel, setPeakLevel] = useState<number>(-Infinity);
  const [maxGain, setMaxGain] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const [outputFormat, setOutputFormat] = useState<'wav' | 'mp3'>('wav');

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);

  // Hooks
  const { buffer, bufferInfo, isLoading, progress: loadProgress, error: loadError, loadFromFile, reset: resetBuffer } = useAudioBuffer();
  const { isExporting, progress: exportProgress, error: exportError, exportToWav, exportToMp3, download, reset: resetExport } = useAudioExport();

  // ファイル読み込み後、ピークレベルを計算
  useEffect(() => {
    if (buffer) {
      const peak = getPeakLevel(buffer);
      setPeakLevel(peak);
      const maxGainValue = getMaxGainWithoutClipping(buffer);
      setMaxGain(maxGainValue);
    }
  }, [buffer]);

  // ファイル選択
  const handleFileSelect = useCallback(async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    setProcessedBuffer(null);
    setProcessedBlob(null);

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    const url = URL.createObjectURL(selectedFile);
    setAudioUrl(url);

    try {
      await loadFromFile(selectedFile);
    } catch (err) {
      console.error('Failed to load file:', err);
    }
  }, [audioUrl, loadFromFile]);

  // クリア
  const handleClear = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setFile(null);
    setAudioUrl('');
    setProcessedBuffer(null);
    setProcessedBlob(null);
    setIsPlaying(false);
    setPeakLevel(-Infinity);
    setMaxGain(0);
    setGainDb(6);
    resetBuffer();
    resetExport();
  }, [audioUrl, resetBuffer, resetExport]);

  // 再生/一時停止
  const togglePlayback = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // ノーマライズ
  const handleNormalize = useCallback(() => {
    if (maxGain > 0) {
      setGainDb(Math.floor(maxGain));
    }
  }, [maxGain]);

  // 処理 & ダウンロード
  const handleProcessAndDownload = useCallback(async () => {
    if (!buffer || !file) return;

    setIsProcessing(true);

    try {
      // 音量調整
      const adjusted = adjustVolume(buffer, gainDb);
      setProcessedBuffer(adjusted);

      // エクスポート
      let blob: Blob;
      let extension: string;
      
      if (outputFormat === 'mp3') {
        blob = await exportToMp3(adjusted, { bitrate: 192 });
        extension = 'mp3';
      } else {
        blob = await exportToWav(adjusted, { bitDepth: 16 });
        extension = 'wav';
      }
      
      setProcessedBlob(blob);
      
      const baseName = file.name.replace(/\.[^.]+$/, '');
      const gainLabel = gainDb >= 0 ? `+${gainDb}dB` : `${gainDb}dB`;
      download(blob, `${baseName}_${gainLabel}.${extension}`);
    } catch (err) {
      console.error('Processing failed:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [buffer, file, gainDb, outputFormat, exportToWav, exportToMp3, download]);

  // ダウンロード（再度）
  const handleDownload = useCallback(() => {
    if (!processedBlob || !file) return;
    const baseName = file.name.replace(/\.[^.]+$/, '');
    const gainLabel = gainDb >= 0 ? `+${gainDb}dB` : `${gainDb}dB`;
    const extension = outputFormat === 'mp3' ? 'mp3' : 'wav';
    download(processedBlob, `${baseName}_${gainLabel}.${extension}`);
  }, [processedBlob, file, gainDb, outputFormat, download]);

  // オーディオイベント
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, []);

  // ユーティリティ関数
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // クリッピング警告
  const willClip = peakLevel + gainDb > 0;
  const newPeakLevel = peakLevel + gainDb;

  const error = loadError || exportError;
  const isWorking = isLoading || isExporting || isProcessing;

  // FAQ Data
  const faqs = [
    {
      q: 'What does "dB" mean?',
      a: 'dB (decibel) is a unit for measuring sound intensity. +6dB roughly doubles the perceived loudness, while -6dB halves it.',
    },
    {
      q: 'What is clipping?',
      a: 'Clipping occurs when the audio signal exceeds the maximum level, causing distortion. The tool warns you if your gain setting would cause clipping.',
    },
    {
      q: 'What does "Normalize" do?',
      a: 'Normalize automatically finds the maximum gain you can apply without causing clipping. It maximizes volume while preserving quality.',
    },
    {
      q: 'Is my audio file uploaded to a server?',
      a: 'No. All processing happens in your browser. Your files never leave your device.',
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium">
            <Volume2 className="w-4 h-4" />
            Audio Fix
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Volume Booster
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Make quiet audio louder or reduce volume instantly in your browser.
            Perfect for fixing audio that's too quiet or too loud.
          </p>
        </div>

        {/* Hidden audio element */}
        {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}

        {/* Main Tool Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 space-y-6">
          {/* File Upload */}
          <FileDropZone
            onFilesAccepted={handleFileSelect}
            selectedFile={file}
            onClear={handleClear}
            disabled={isWorking}
            isLoading={isLoading}
            loadingProgress={loadProgress.progress}
            loadingMessage={loadProgress.message || 'Loading audio...'}
            label="Drop audio file here or click to browse"
            description="MP3, WAV, OGG, FLAC, M4A (max 100MB)"
          />

          {/* Audio Info & Player */}
          {buffer && bufferInfo && !isLoading && (
            <div className="p-4 bg-gray-900/50 rounded-xl space-y-4">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(bufferInfo.duration)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <HardDrive className="w-4 h-4" />
                  <span>{file && formatFileSize(file.size)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Gauge className="w-4 h-4" />
                  <span>Peak: {peakLevel > -Infinity ? `${peakLevel.toFixed(1)} dB` : 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlayback}
                  className="p-3 bg-amber-600 hover:bg-amber-700 rounded-full transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  )}
                </button>
                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-amber-500 rounded-full" />
                </div>
              </div>
            </div>
          )}

          {/* Volume Control */}
          {buffer && !isLoading && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm text-gray-400 font-medium">Volume Adjustment</label>
                <button
                  onClick={handleNormalize}
                  disabled={isWorking}
                  className="text-sm text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50"
                >
                  Auto Normalize (+{Math.floor(maxGain)} dB max)
                </button>
              </div>

              {/* Slider */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <VolumeX className="w-5 h-5 text-gray-500" />
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    step="1"
                    value={gainDb}
                    onChange={(e) => setGainDb(Number(e.target.value))}
                    disabled={isWorking}
                    className="flex-1 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-5
                      [&::-webkit-slider-thumb]:h-5
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-amber-500
                      [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-webkit-slider-thumb]:shadow-lg"
                  />
                  <Volume2 className="w-5 h-5 text-gray-500" />
                </div>

                <div className="flex justify-between text-xs text-gray-500">
                  <span>-20 dB</span>
                  <span className={`text-lg font-bold ${gainDb >= 0 ? 'text-amber-400' : 'text-blue-400'}`}>
                    {gainDb >= 0 ? `+${gainDb}` : gainDb} dB
                  </span>
                  <span>+20 dB</span>
                </div>
              </div>

              {/* Clipping Warning */}
              {willClip && (
                <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-medium text-sm">Clipping Warning</p>
                    <p className="text-gray-400 text-xs mt-1">
                      New peak will be {newPeakLevel.toFixed(1)} dB. Audio above 0 dB will be distorted.
                      Consider reducing gain to +{Math.floor(maxGain)} dB or less.
                    </p>
                  </div>
                </div>
              )}

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '-6 dB', value: -6 },
                  { label: '-3 dB', value: -3 },
                  { label: '0 dB', value: 0 },
                  { label: '+3 dB', value: 3 },
                  { label: '+6 dB', value: 6 },
                  { label: '+12 dB', value: 12 },
                ].map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setGainDb(preset.value)}
                    disabled={isWorking}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors
                      ${gainDb === preset.value
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }
                      disabled:opacity-50`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Output Format */}
          {buffer && !isLoading && (
            <div className="space-y-2">
              <label className="block text-sm text-gray-400 font-medium">Output Format</label>
              <div className="flex gap-3">
                {(['wav', 'mp3'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setOutputFormat(fmt)}
                    disabled={isWorking}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors
                      ${outputFormat === fmt
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }
                      disabled:opacity-50`}
                  >
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Progress */}
          {(isExporting || isProcessing) && (
            <ProgressIndicator
              progress={exportProgress}
              message="Processing audio..."
              color="orange"
            />
          )}

          {/* Error */}
          {error && (
            <ErrorMessage
              error={error}
              severity="error"
              dismissible
              onDismiss={() => { resetBuffer(); resetExport(); }}
              actions={[{ label: 'Try Again', onClick: handleClear, isPrimary: true }]}
            />
          )}

          {/* Process Button */}
          {buffer && !isWorking && !error && (
            <button
              onClick={handleProcessAndDownload}
              className="w-full flex items-center justify-center gap-2 px-6 py-4
                bg-gradient-to-r from-amber-500 to-orange-500 
                hover:from-amber-600 hover:to-orange-600
                text-white font-semibold text-lg rounded-xl transition-all
                shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
            >
              <Zap className="w-5 h-5" />
              Boost & Download {outputFormat.toUpperCase()}
            </button>
          )}

          {/* Already processed */}
          {processedBlob && !isWorking && (
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3
                  bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Again
              </button>
              <button
                onClick={handleClear}
                className="flex items-center justify-center gap-2 px-4 py-3
                  bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                New File
              </button>
            </div>
          )}
        </div>

        {/* Privacy Badge */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20 p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-green-400" />
            <div>
              <p className="font-semibold text-green-400">100% Private</p>
              <p className="text-sm text-gray-400">
                Your files are processed entirely in your browser. Nothing is uploaded to any server.
              </p>
            </div>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-800/70 transition-colors"
          >
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              How to Use
            </h2>
            {showGuide ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {showGuide && (
            <div className="p-4 border-t border-gray-700 space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { icon: Upload, title: 'Upload Audio', desc: 'Drag and drop your audio file or click to browse.' },
                  { icon: Settings, title: 'Adjust Volume', desc: 'Use the slider or presets to set gain. Use "Auto Normalize" for best results.' },
                  { icon: Download, title: 'Download', desc: 'Choose format and download your boosted audio.' },
                ].map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{i + 1}. {step.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <button
            onClick={() => setShowFaq(!showFaq)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-800/70 transition-colors"
          >
            <h2 className="text-lg font-semibold text-white">Frequently Asked Questions</h2>
            {showFaq ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {showFaq && (
            <div className="p-4 border-t border-gray-700 space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="space-y-1">
                  <h3 className="font-medium text-white">{faq.q}</h3>
                  <p className="text-sm text-gray-400">{faq.a}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Tools */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Related Tools</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { name: 'MP3 to WAV', href: '/tools/mp3-to-wav', desc: 'Convert MP3 to uncompressed WAV', status: 'live' },
              { name: 'WAV to MP3', href: '/tools/wav-to-mp3', desc: 'Compress WAV to MP3', status: 'live' },
              { name: 'Speed Changer', href: '/tools/speed-changer', desc: 'Adjust audio playback speed', status: 'coming' },
              { name: 'Trim Audio', href: '/tools/trim-audio', desc: 'Cut unwanted parts', status: 'coming' },
            ].map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className={`flex items-center justify-between p-4 rounded-xl border transition-colors
                  ${tool.status === 'live' 
                    ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600' 
                    : 'bg-gray-800/30 border-gray-700/50 opacity-60 cursor-not-allowed pointer-events-none'
                  }`}
              >
                <div>
                  <h3 className="font-medium text-white">{tool.name}</h3>
                  <p className="text-sm text-gray-400">{tool.desc}</p>
                </div>
                {tool.status === 'live' ? (
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                ) : (
                  <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">Soon</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
