// app/tools/speed-changer/components/SpeedChangerClient.tsx
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FileDropZone, ProgressIndicator, ErrorMessage } from '@/components/audio';
import { useAudioBuffer, useAudioExport } from '@/hooks/audio';
import { changeSpeed } from '@/lib/audio-toolkit';
import { 
  Shield, Zap, Play, Pause, RotateCcw, Download, Clock, HardDrive,
  ChevronDown, ChevronUp, HelpCircle, ArrowRight, FastForward, Rewind
} from 'lucide-react';

type OutputFormat = 'wav' | 'mp3';

const SPEED_PRESETS = [
  { value: 0.5, label: '0.5x', desc: 'Half speed' },
  { value: 0.75, label: '0.75x', desc: 'Slower' },
  { value: 1.0, label: '1.0x', desc: 'Normal' },
  { value: 1.25, label: '1.25x', desc: 'Faster' },
  { value: 1.5, label: '1.5x', desc: 'Fast' },
  { value: 2.0, label: '2.0x', desc: 'Double speed' },
];

export default function SpeedChangerClient() {
  // State
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [speed, setSpeed] = useState<number>(1.0);
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

  // ファイル選択
  const handleFileSelect = useCallback(async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    setProcessedBlob(null);
    setSpeed(1.0);

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
    setSpeed(1.0);
    resetBuffer();
    resetExport();
  }, [audioUrl, resetBuffer, resetExport]);

  // 再生/一時停止（プレビュー用 - 速度変更して再生）
  const togglePlayback = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.playbackRate = speed;
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, speed]);

  // 速度変更時にplaybackRateを更新
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  // オーディオイベント
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, []);

  // 速度変更 & ダウンロード
  const handleProcessAndDownload = useCallback(async () => {
    if (!buffer || !file) return;

    setIsProcessing(true);

    try {
      // 速度変更実行
      const processedBuffer = changeSpeed(buffer, speed);

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
      const speedLabel = speed === 1 ? '' : `_${speed}x`;
      download(blob, `${baseName}${speedLabel}.${extension}`);
    } catch (err) {
      console.error('Speed change failed:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [buffer, file, speed, outputFormat, exportToWav, exportToMp3, download]);

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

  // 変更後の長さを計算
  const newDuration = bufferInfo ? bufferInfo.duration / speed : 0;

  const isWorking = isLoading || isExporting || isProcessing;
  const error = loadError;

  // FAQ Data
  const faqs = [
    {
      q: 'Will changing speed affect pitch?',
      a: 'Yes, this tool changes both speed and pitch together. Slowing down lowers the pitch, speeding up raises it. This is useful for creating effects or matching tempo.',
    },
    {
      q: 'Can I preview before downloading?',
      a: 'Yes! The play button previews the audio at the selected speed in real-time.',
    },
    {
      q: 'What speed range is supported?',
      a: 'You can adjust speed from 0.25x (quarter speed) to 4x (quadruple speed).',
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium">
            <FastForward className="w-4 h-4" />
            Audio Fix
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Speed Changer
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Speed up or slow down audio files. Adjust playback speed from 0.25x to 4x.
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
                  <span>Original: {formatTime(bufferInfo.duration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4" />
                  <span>{file && formatFileSize(file.size)}</span>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={togglePlayback}
                  className="p-4 bg-amber-600 hover:bg-amber-700 rounded-full transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  )}
                </button>
                <span className="text-gray-400 text-sm">Preview at {speed}x speed</span>
              </div>

              {/* Speed Control */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-400 font-medium">Speed</label>
                  <span className="text-2xl font-bold text-amber-400">{speed.toFixed(2)}x</span>
                </div>

                {/* Slider */}
                <div className="flex items-center gap-4">
                  <Rewind className="w-5 h-5 text-gray-500" />
                  <input
                    type="range"
                    min="0.25"
                    max="4"
                    step="0.05"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
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
                  <FastForward className="w-5 h-5 text-gray-500" />
                </div>

                <div className="flex justify-between text-xs text-gray-500">
                  <span>0.25x</span>
                  <span>4x</span>
                </div>

                {/* Presets */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {SPEED_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setSpeed(preset.value)}
                      disabled={isWorking}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all
                        ${speed === preset.value
                          ? 'bg-amber-600 text-white ring-2 ring-amber-400 ring-offset-1 ring-offset-gray-900'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }
                        disabled:opacity-50`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Info */}
              <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <span className="text-gray-400 text-sm">New duration:</span>
                <span className="text-amber-400 font-medium">{formatTime(newDuration)}</span>
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
            </>
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
              onDismiss={handleClear}
            />
          )}

          {/* Process Button */}
          {buffer && !isWorking && (
            <button
              onClick={handleProcessAndDownload}
              className="w-full flex items-center justify-center gap-2 px-6 py-4
                bg-gradient-to-r from-amber-500 to-orange-500 
                hover:from-amber-600 hover:to-orange-600
                text-white font-semibold text-lg rounded-xl transition-all
                shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
            >
              <Zap className="w-5 h-5" />
              Change Speed & Download {outputFormat.toUpperCase()}
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
              <HelpCircle className="w-5 h-5 text-amber-400" />
              How to Use
            </h2>
            {showGuide ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {showGuide && (
            <div className="p-4 border-t border-gray-700 space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { title: 'Upload Audio', desc: 'Drop your audio file or click to browse.' },
                  { title: 'Adjust Speed', desc: 'Use the slider or presets to set speed.' },
                  { title: 'Download', desc: 'Click to process and download.' },
                ].map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
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
              { name: 'Reverse Audio', href: '/tools/reverse-audio', desc: 'Play backwards', status: 'coming' },
              { name: 'Fade Audio', href: '/tools/fade-audio', desc: 'Add fade effects', status: 'coming' },
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
