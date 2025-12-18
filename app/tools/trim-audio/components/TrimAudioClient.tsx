// app/tools/trim-audio/components/TrimAudioClient.tsx
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FileDropZone, ProgressIndicator, ErrorMessage } from '@/components/audio';
import { useAudioBuffer, useAudioExport } from '@/hooks/audio';
import { trimAudio } from '@/lib/audio-toolkit';
import { 
  Shield, Zap, Scissors, Play, Pause, RotateCcw, Download, Clock, HardDrive,
  ChevronDown, ChevronUp, HelpCircle, ArrowRight, SkipBack, SkipForward
} from 'lucide-react';

type OutputFormat = 'wav' | 'mp3';

export default function TrimAudioClient() {
  // State
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('wav');
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [showFaq, setShowFaq] = useState(false);

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);

  // Hooks
  const { buffer, bufferInfo, isLoading, progress: loadProgress, error: loadError, loadFromFile, reset: resetBuffer } = useAudioBuffer();
  const { isExporting, progress: exportProgress, exportToWav, exportToMp3, download, reset: resetExport } = useAudioExport();

  // ファイル読み込み後に終了時間を設定
  useEffect(() => {
    if (bufferInfo) {
      setEndTime(bufferInfo.duration);
    }
  }, [bufferInfo]);

  // ファイル選択
  const handleFileSelect = useCallback(async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    setProcessedBlob(null);
    setStartTime(0);

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
    setStartTime(0);
    setEndTime(0);
    setCurrentTime(0);
    resetBuffer();
    resetExport();
  }, [audioUrl, resetBuffer, resetExport]);

  // 再生/一時停止
  const togglePlayback = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // 選択範囲の開始位置から再生
      audioRef.current.currentTime = startTime;
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, startTime]);

  // 選択範囲のみ再生
  const playSelection = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = startTime;
    audioRef.current.play();
    setIsPlaying(true);
  }, [startTime]);

  // 時間更新
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      // 選択範囲の終了位置で停止
      if (audio.currentTime >= endTime) {
        audio.pause();
        setIsPlaying(false);
      }
    };

    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [endTime]);

  // トリム & ダウンロード
  const handleTrimAndDownload = useCallback(async () => {
    if (!buffer || !file) return;

    try {
      // トリム実行
      const trimmedBuffer = trimAudio(buffer, startTime, endTime);

      // エクスポート
      let blob: Blob;
      let extension: string;

      if (outputFormat === 'mp3') {
        blob = await exportToMp3(trimmedBuffer, { bitrate: 192 });
        extension = 'mp3';
      } else {
        blob = await exportToWav(trimmedBuffer, { bitDepth: 16 });
        extension = 'wav';
      }

      setProcessedBlob(blob);

      const baseName = file.name.replace(/\.[^.]+$/, '');
      download(blob, `${baseName}_trimmed.${extension}`);
    } catch (err) {
      console.error('Trim failed:', err);
    }
  }, [buffer, file, startTime, endTime, outputFormat, exportToWav, exportToMp3, download]);

  // ユーティリティ関数
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // トリム後の長さ
  const trimmedDuration = endTime - startTime;
  const isValidRange = trimmedDuration > 0.1;

  const isWorking = isLoading || isExporting;
  const error = loadError;

  // FAQ Data
  const faqs = [
    {
      q: 'How do I select the trim range?',
      a: 'Use the start and end time sliders to select the portion of audio you want to keep. Everything outside this range will be removed.',
    },
    {
      q: 'Can I preview before downloading?',
      a: 'Yes! Click the play button to preview the selected range before downloading.',
    },
    {
      q: 'What formats can I export to?',
      a: 'You can export as WAV (high quality, larger file) or MP3 (compressed, smaller file).',
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
            <Scissors className="w-4 h-4" />
            Audio Edit
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Trim Audio
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Cut and trim audio files. Remove unwanted parts from the beginning or end.
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

              {/* Timeline Bar */}
              <div className="space-y-2">
                <div className="relative h-12 bg-gray-900 rounded-lg overflow-hidden">
                  {/* Selected Range */}
                  <div
                    className="absolute top-0 bottom-0 bg-emerald-500/30 border-x-2 border-emerald-500"
                    style={{
                      left: `${(startTime / bufferInfo.duration) * 100}%`,
                      width: `${((endTime - startTime) / bufferInfo.duration) * 100}%`,
                    }}
                  />
                  {/* Current Time Indicator */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white"
                    style={{
                      left: `${(currentTime / bufferInfo.duration) * 100}%`,
                    }}
                  />
                </div>

                {/* Time Labels */}
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0:00</span>
                  <span>{formatTime(bufferInfo.duration)}</span>
                </div>
              </div>

              {/* Range Controls */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Start Time */}
                <div className="space-y-2">
                  <label className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Start Time</span>
                    <span className="text-emerald-400 font-mono">{formatTime(startTime)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={bufferInfo.duration}
                    step="0.1"
                    value={startTime}
                    onChange={(e) => {
                      const newStart = Number(e.target.value);
                      if (newStart < endTime - 0.1) {
                        setStartTime(newStart);
                      }
                    }}
                    className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-4
                      [&::-webkit-slider-thumb]:h-4
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-emerald-500
                      [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>

                {/* End Time */}
                <div className="space-y-2">
                  <label className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">End Time</span>
                    <span className="text-emerald-400 font-mono">{formatTime(endTime)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={bufferInfo.duration}
                    step="0.1"
                    value={endTime}
                    onChange={(e) => {
                      const newEnd = Number(e.target.value);
                      if (newEnd > startTime + 0.1) {
                        setEndTime(newEnd);
                      }
                    }}
                    className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-4
                      [&::-webkit-slider-thumb]:h-4
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-emerald-500
                      [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
              </div>

              {/* Selection Info */}
              <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <span className="text-gray-400 text-sm">Selected duration:</span>
                <span className="text-emerald-400 font-medium">{formatTime(trimmedDuration)}</span>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setStartTime(0)}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  title="Go to start"
                >
                  <SkipBack className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={playSelection}
                  className="p-4 bg-emerald-600 hover:bg-emerald-700 rounded-full transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  )}
                </button>
                <button
                  onClick={() => setEndTime(bufferInfo.duration)}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  title="Go to end"
                >
                  <SkipForward className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Output Format */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-400 font-medium">Output Format</label>
                <div className="flex gap-3">
                  {(['wav', 'mp3'] as OutputFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setOutputFormat(fmt)}
                      disabled={isExporting}
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
          {isExporting && (
            <ProgressIndicator
              progress={exportProgress}
              message="Trimming audio..."
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

          {/* Trim Button */}
          {buffer && !isWorking && isValidRange && (
            <button
              onClick={handleTrimAndDownload}
              className="w-full flex items-center justify-center gap-2 px-6 py-4
                bg-gradient-to-r from-emerald-500 to-green-500 
                hover:from-emerald-600 hover:to-green-600
                text-white font-semibold text-lg rounded-xl transition-all
                shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
            >
              <Scissors className="w-5 h-5" />
              Trim & Download {outputFormat.toUpperCase()}
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
              Trim Another File
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
                  { title: 'Set Range', desc: 'Use the sliders to select start and end times.' },
                  { title: 'Download', desc: 'Click Trim to download the selected portion.' },
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
              { name: 'Volume Booster', href: '/tools/volume-booster', desc: 'Make audio louder', status: 'live' },
              { name: 'MP3 to WAV', href: '/tools/mp3-to-wav', desc: 'Convert MP3 to WAV', status: 'live' },
              { name: 'Speed Changer', href: '/tools/speed-changer', desc: 'Adjust playback speed', status: 'coming' },
              { name: 'Merge Audio', href: '/tools/merge-audio', desc: 'Combine audio files', status: 'coming' },
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
