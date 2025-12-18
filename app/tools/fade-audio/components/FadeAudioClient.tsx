// app/tools/fade-audio/components/FadeAudioClient.tsx
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FileDropZone, ProgressIndicator, ErrorMessage } from '@/components/audio';
import { useAudioBuffer, useAudioExport } from '@/hooks/audio';
import { fadeIn, fadeOut } from '@/lib/audio-toolkit';
import { 
  Shield, Zap, Play, Pause, RotateCcw, Download, Clock, HardDrive,
  ChevronDown, ChevronUp, HelpCircle, ArrowRight, TrendingUp, TrendingDown
} from 'lucide-react';

type OutputFormat = 'wav' | 'mp3';

export default function FadeAudioClient() {
  // State
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [fadeInDuration, setFadeInDuration] = useState<number>(0);
  const [fadeOutDuration, setFadeOutDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('wav');
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showFaq, setShowFaq] = useState(false);

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);

  // Hooks
  const { buffer, bufferInfo, isLoading, progress: loadProgress, error: loadError, loadFromFile, reset: resetBuffer } = useAudioBuffer();
  const { isExporting, progress: exportProgress, exportToWav, exportToMp3, download, reset: resetExport } = useAudioExport();

  // ファイル読み込み後にデフォルト値を設定
  useEffect(() => {
    if (bufferInfo) {
      // デフォルト: 全体の10%または2秒のうち小さい方
      const defaultFade = Math.min(bufferInfo.duration * 0.1, 2);
      setFadeInDuration(Math.round(defaultFade * 10) / 10);
      setFadeOutDuration(Math.round(defaultFade * 10) / 10);
    }
  }, [bufferInfo]);

  // ファイル選択
  const handleFileSelect = useCallback(async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
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
    setProcessedBlob(null);
    setIsPlaying(false);
    setFadeInDuration(0);
    setFadeOutDuration(0);
    resetBuffer();
    resetExport();
  }, [audioUrl, resetBuffer, resetExport]);

  // 再生/一時停止
  const togglePlayback = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // オーディオイベント
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, []);

  // フェード適用 & ダウンロード
  const handleProcessAndDownload = useCallback(async () => {
    if (!buffer || !file) return;

    setIsProcessing(true);

    try {
      // フェード適用
      let processedBuffer = buffer;
      
      if (fadeInDuration > 0) {
        processedBuffer = fadeIn(processedBuffer, fadeInDuration);
      }
      
      if (fadeOutDuration > 0) {
        processedBuffer = fadeOut(processedBuffer, fadeOutDuration);
      }

      // エクスポート
      let blob: Blob;
      let extension: string;

      if (outputFormat === 'mp3') {
        blob = await exportToMp3(processedBuffer, { bitrate: 192 });
        extension = 'mp3';
      } else {
        blob = await exportToWav(processedBuffer, { bitDepth: 16 });
        extension = 'wav';
      }

      setProcessedBlob(blob);

      const baseName = file.name.replace(/\.[^.]+$/, '');
      download(blob, `${baseName}_faded.${extension}`);
    } catch (err) {
      console.error('Fade processing failed:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [buffer, file, fadeInDuration, fadeOutDuration, outputFormat, exportToWav, exportToMp3, download]);

  // ユーティリティ関数
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // 最大フェード時間（音声の半分まで）
  const maxFadeDuration = bufferInfo ? bufferInfo.duration / 2 : 10;

  const isWorking = isLoading || isExporting || isProcessing;
  const error = loadError;
  const hasChanges = fadeInDuration > 0 || fadeOutDuration > 0;

  // FAQ Data
  const faqs = [
    {
      q: 'What is a fade effect?',
      a: 'Fade in gradually increases volume from silence at the start. Fade out gradually decreases volume to silence at the end. These create smooth transitions.',
    },
    {
      q: 'How long should my fade be?',
      a: 'For music, 2-5 seconds is typical. For podcasts or voice, 0.5-2 seconds works well. The tool suggests defaults based on your audio length.',
    },
    {
      q: 'Can I apply both fade in and fade out?',
      a: 'Yes! You can set both independently. Set either to 0 to skip that effect.',
    },
    {
      q: 'Is my audio uploaded to a server?',
      a: 'No. All processing happens in your browser. Your files never leave your device.',
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            Audio Edit
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Fade Audio
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Add smooth fade in and fade out effects to your audio files.
            100% private, processed in your browser.
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

          {/* Audio Info & Controls */}
          {buffer && bufferInfo && !isLoading && (
            <>
              {/* Audio Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Duration: {formatTime(bufferInfo.duration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4" />
                  <span>{file && formatFileSize(file.size)}</span>
                </div>
              </div>

              {/* Playback */}
              <div className="flex items-center justify-center">
                <button
                  onClick={togglePlayback}
                  className="p-4 bg-emerald-600 hover:bg-emerald-700 rounded-full transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  )}
                </button>
              </div>

              {/* Fade Controls */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Fade In */}
                <div className="p-4 bg-gray-900/50 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      <span className="font-medium text-white">Fade In</span>
                    </div>
                    <span className="text-emerald-400 font-mono">{fadeInDuration.toFixed(1)}s</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxFadeDuration}
                    step="0.1"
                    value={fadeInDuration}
                    onChange={(e) => setFadeInDuration(Number(e.target.value))}
                    disabled={isWorking}
                    className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-4
                      [&::-webkit-slider-thumb]:h-4
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-emerald-500
                      [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0s (off)</span>
                    <span>{maxFadeDuration.toFixed(1)}s</span>
                  </div>
                </div>

                {/* Fade Out */}
                <div className="p-4 bg-gray-900/50 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-orange-400" />
                      <span className="font-medium text-white">Fade Out</span>
                    </div>
                    <span className="text-orange-400 font-mono">{fadeOutDuration.toFixed(1)}s</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxFadeDuration}
                    step="0.1"
                    value={fadeOutDuration}
                    onChange={(e) => setFadeOutDuration(Number(e.target.value))}
                    disabled={isWorking}
                    className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-4
                      [&::-webkit-slider-thumb]:h-4
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-orange-500
                      [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0s (off)</span>
                    <span>{maxFadeDuration.toFixed(1)}s</span>
                  </div>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-400 font-medium">Quick Presets</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'None', fadeIn: 0, fadeOut: 0 },
                    { label: 'Quick (0.5s)', fadeIn: 0.5, fadeOut: 0.5 },
                    { label: 'Normal (1s)', fadeIn: 1, fadeOut: 1 },
                    { label: 'Smooth (2s)', fadeIn: 2, fadeOut: 2 },
                    { label: 'Long (5s)', fadeIn: 5, fadeOut: 5 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setFadeInDuration(Math.min(preset.fadeIn, maxFadeDuration));
                        setFadeOutDuration(Math.min(preset.fadeOut, maxFadeDuration));
                      }}
                      disabled={isWorking}
                      className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors disabled:opacity-50"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Output Format */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-400 font-medium">Output Format</label>
                <div className="flex gap-3">
                  {(['wav', 'mp3'] as OutputFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setOutputFormat(fmt)}
                      disabled={isWorking}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors
                        ${outputFormat === fmt
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }
                        disabled:opacity-50`}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Progress */}
          {(isExporting || isProcessing) && (
            <ProgressIndicator
              progress={exportProgress}
              message="Applying fade effects..."
              color="green"
            />
          )}

          {/* Error */}
          {error && (
            <ErrorMessage
              error={error}
              severity="error"
              dismissible
              onDismiss={handleClear}
            />
          )}

          {/* Process Button */}
          {buffer && !isWorking && (
            <button
              onClick={handleProcessAndDownload}
              disabled={!hasChanges}
              className="w-full flex items-center justify-center gap-2 px-6 py-4
                bg-gradient-to-r from-emerald-500 to-green-500 
                hover:from-emerald-600 hover:to-green-600
                text-white font-semibold text-lg rounded-xl transition-all
                shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-5 h-5" />
              {hasChanges ? `Apply Fade & Download ${outputFormat.toUpperCase()}` : 'Set fade duration to continue'}
            </button>
          )}

          {/* Already processed */}
          {processedBlob && !isWorking && (
            <button
              onClick={handleClear}
              className="w-full flex items-center justify-center gap-2 px-4 py-3
                bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Process Another File
            </button>
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
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              How to Use
            </h2>
            {showGuide ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {showGuide && (
            <div className="p-4 border-t border-gray-700 space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { title: 'Upload Audio', desc: 'Drop your audio file or click to browse.' },
                  { title: 'Set Fade Duration', desc: 'Adjust fade in and fade out sliders.' },
                  { title: 'Download', desc: 'Click to apply effects and download.' },
                ].map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{step.title}</h3>
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
              { name: 'Trim Audio', href: '/tools/trim-audio', desc: 'Cut audio files', status: 'live' },
              { name: 'Volume Booster', href: '/tools/volume-booster', desc: 'Make audio louder', status: 'live' },
              { name: 'Reverse Audio', href: '/tools/reverse-audio', desc: 'Play backwards', status: 'live' },
              { name: 'Loop Audio', href: '/tools/loop-audio', desc: 'Create audio loops', status: 'coming' },
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
