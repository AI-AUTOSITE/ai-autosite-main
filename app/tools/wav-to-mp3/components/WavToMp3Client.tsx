// app/tools/wav-to-mp3/components/WavToMp3Client.tsx
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FileDropZone, ProgressIndicator, ErrorMessage } from '../../../components/audio';
import { useAudioBuffer, useAudioExport } from '../../../hooks/audio';
import { 
  Shield, Zap, FileAudio, Play, Pause, RotateCcw, Download, Clock, HardDrive,
  ChevronDown, ChevronUp, Upload, Settings, ArrowRight, HelpCircle
} from 'lucide-react';

type Bitrate = 128 | 192 | 256 | 320;

const BITRATE_INFO: Record<Bitrate, { label: string; desc: string; emoji: string }> = {
  128: { label: '128 kbps', desc: 'Smallest file, good for speech', emoji: '📱' },
  192: { label: '192 kbps', desc: 'Balanced quality and size', emoji: '🎧' },
  256: { label: '256 kbps', desc: 'High quality', emoji: '🎵' },
  320: { label: '320 kbps', desc: 'Maximum quality', emoji: '🎚️' },
};

export default function WavToMp3Client() {
  // State
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [bitrate, setBitrate] = useState<Bitrate>(192);
  const [isPlaying, setIsPlaying] = useState(false);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [estimatedSize, setEstimatedSize] = useState<number>(0);
  const [showGuide, setShowGuide] = useState(false);
  const [showFaq, setShowFaq] = useState(false);

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);

  // Hooks
  const { buffer, bufferInfo, isLoading, progress: loadProgress, error: loadError, loadFromFile, reset: resetBuffer } = useAudioBuffer();
  const { isExporting, progress: exportProgress, error: exportError, exportToMp3, download, reset: resetExport } = useAudioExport();

  // 推定ファイルサイズを計算
  useEffect(() => {
    if (bufferInfo) {
      // MP3 size ≈ (bitrate * 1000 / 8) * duration
      const size = (bitrate * 1000 / 8) * bufferInfo.duration;
      setEstimatedSize(size);
    }
  }, [bufferInfo, bitrate]);

  // ファイル選択
  const handleFileSelect = useCallback(async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    setConvertedBlob(null);

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
    setConvertedBlob(null);
    setIsPlaying(false);
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

  // 変換 & ダウンロード
  const handleConvertAndDownload = useCallback(async () => {
    if (!buffer || !file) return;

    try {
      const mp3Blob = await exportToMp3(buffer, { bitrate });
      setConvertedBlob(mp3Blob);
      
      const baseName = file.name.replace(/\.[^.]+$/, '');
      download(mp3Blob, `${baseName}.mp3`);
    } catch (err) {
      console.error('Conversion failed:', err);
    }
  }, [buffer, file, bitrate, exportToMp3, download]);

  // ダウンロード（再度）
  const handleDownload = useCallback(() => {
    if (!convertedBlob || !file) return;
    const baseName = file.name.replace(/\.[^.]+$/, '');
    download(convertedBlob, `${baseName}.mp3`);
  }, [convertedBlob, file, download]);

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

  // 圧縮率を計算
  const compressionRatio = file && estimatedSize > 0 
    ? ((1 - estimatedSize / file.size) * 100).toFixed(0)
    : 0;

  const isProcessing = isLoading || isExporting;
  const error = loadError || exportError;

  // FAQ Data
  const faqs = [
    {
      q: 'Will I lose quality when converting WAV to MP3?',
      a: 'Yes, MP3 is a lossy format. Higher bitrate (256-320 kbps) preserves more quality. For archival purposes, consider keeping the original WAV.',
    },
    {
      q: 'Why would I convert WAV to MP3?',
      a: 'MP3 files are much smaller (often 90% smaller), making them easier to share, store, and stream. Most devices and platforms support MP3.',
    },
    {
      q: 'Which bitrate should I choose?',
      a: '128 kbps for speech/podcasts, 192 kbps for balanced quality, 256-320 kbps for music where quality matters.',
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
            <FileAudio className="w-4 h-4" />
            Audio Converter
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            WAV to MP3 Converter
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Compress WAV files to MP3 format instantly in your browser. 
            Reduce file size by up to 90% while maintaining quality.
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
            disabled={isProcessing}
            isLoading={isLoading}
            loadingProgress={loadProgress.progress}
            loadingMessage={loadProgress.message || 'Loading audio...'}
            accept={{ 
              'audio/wav': ['.wav'],
              'audio/wave': ['.wav'],
              'audio/x-wav': ['.wav'],
            }}
            label="Drop WAV file here or click to browse"
            description="WAV files only (max 100MB)"
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
                <div className="text-gray-400">
                  {bufferInfo.sampleRate} Hz • {bufferInfo.numberOfChannels}ch
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlayback}
                  className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  )}
                </button>
                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-blue-500 rounded-full" />
                </div>
              </div>
            </div>
          )}

          {/* Bitrate Selection */}
          {buffer && !isLoading && (
            <div className="space-y-3">
              <label className="block text-sm text-gray-400 font-medium">Output Bitrate</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {([128, 192, 256, 320] as Bitrate[]).map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setBitrate(rate)}
                    disabled={isProcessing}
                    className={`py-3 px-4 rounded-xl font-medium transition-all
                      ${bitrate === rate
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-900'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {BITRATE_INFO[rate].label}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{BITRATE_INFO[bitrate].emoji} {BITRATE_INFO[bitrate].desc}</span>
                <span>Est. size: ~{formatFileSize(estimatedSize)} ({compressionRatio}% smaller)</span>
              </div>
            </div>
          )}

          {/* Progress */}
          {isExporting && (
            <ProgressIndicator
              progress={exportProgress}
              message="Encoding to MP3..."
              color="blue"
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

          {/* Convert Button */}
          {buffer && !isProcessing && !error && (
            <button
              onClick={handleConvertAndDownload}
              className="w-full flex items-center justify-center gap-2 px-6 py-4
                bg-gradient-to-r from-blue-500 to-cyan-500 
                hover:from-blue-600 hover:to-cyan-600
                text-white font-semibold text-lg rounded-xl transition-all
                shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              <Zap className="w-5 h-5" />
              Convert & Download MP3
            </button>
          )}

          {/* Already converted */}
          {convertedBlob && !isProcessing && (
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
              <HelpCircle className="w-5 h-5 text-blue-400" />
              How to Use
            </h2>
            {showGuide ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {showGuide && (
            <div className="p-4 border-t border-gray-700 space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { icon: Upload, title: 'Upload WAV', desc: 'Drag and drop your WAV file or click to browse.' },
                  { icon: Settings, title: 'Choose Bitrate', desc: 'Select quality: 128-320 kbps.' },
                  { icon: Download, title: 'Download MP3', desc: 'Click to convert and download your compressed file.' },
                ].map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{i + 1}. {step.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bitrate Guide */}
              <div className="p-4 bg-gray-700/30 rounded-lg">
                <h3 className="font-medium text-white mb-3">Bitrate Guide</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400 font-medium">128 kbps:</span>
                    <span className="text-gray-400">Good for speech, podcasts, audiobooks. Smallest file size.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400 font-medium">192 kbps:</span>
                    <span className="text-gray-400">Balanced quality. Good for most music and general use.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400 font-medium">256-320 kbps:</span>
                    <span className="text-gray-400">High quality. Best for music where quality matters.</span>
                  </div>
                </div>
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
              { name: 'Audio Converter', href: '/tools/audio-converter', desc: 'Convert between formats', status: 'coming' },
              { name: 'Volume Booster', href: '/tools/volume-booster', desc: 'Make quiet audio louder', status: 'coming' },
              { name: 'Voice Transcription', href: '/tools/voice-transcription', desc: 'Convert speech to text', status: 'live' },
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
