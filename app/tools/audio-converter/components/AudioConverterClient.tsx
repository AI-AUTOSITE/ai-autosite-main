// app/tools/audio-converter/components/AudioConverterClient.tsx
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FileDropZone, ProgressIndicator, ErrorMessage } from '@/components/audio';
import { useAudioBuffer, useAudioExport } from '@/hooks/audio';
import { 
  Shield, Zap, Play, Pause, RotateCcw, Download, Clock, HardDrive, RefreshCw,
  ChevronDown, ChevronUp, HelpCircle, ArrowRight, ArrowRightLeft
} from 'lucide-react';

type OutputFormat = 'wav' | 'mp3';
type BitDepth = 16 | 24 | 32;
type Bitrate = 128 | 192 | 256 | 320;

const FORMAT_INFO = {
  wav: {
    name: 'WAV',
    description: 'Uncompressed, highest quality',
    icon: '🎵',
  },
  mp3: {
    name: 'MP3',
    description: 'Compressed, smaller file size',
    icon: '🎧',
  },
};

const BIT_DEPTHS: { value: BitDepth; label: string }[] = [
  { value: 16, label: '16-bit (CD Quality)' },
  { value: 24, label: '24-bit (Studio Quality)' },
  { value: 32, label: '32-bit (Maximum)' },
];

const BITRATES: { value: Bitrate; label: string; desc: string }[] = [
  { value: 128, label: '128 kbps', desc: 'Good quality, small size' },
  { value: 192, label: '192 kbps', desc: 'Better quality' },
  { value: 256, label: '256 kbps', desc: 'High quality' },
  { value: 320, label: '320 kbps', desc: 'Best quality' },
];

export default function AudioConverterClient() {
  // State
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('mp3');
  const [bitDepth, setBitDepth] = useState<BitDepth>(16);
  const [bitrate, setBitrate] = useState<Bitrate>(192);
  const [isPlaying, setIsPlaying] = useState(false);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
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

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    const url = URL.createObjectURL(selectedFile);
    setAudioUrl(url);

    // 入力形式から出力形式を推測
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (ext === 'wav') {
      setOutputFormat('mp3');
    } else {
      setOutputFormat('wav');
    }

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

  // 変換 & ダウンロード
  const handleConvertAndDownload = useCallback(async () => {
    if (!buffer || !file) return;

    try {
      let blob: Blob;
      let extension: string;

      if (outputFormat === 'mp3') {
        blob = await exportToMp3(buffer, { bitrate });
        extension = 'mp3';
      } else {
        blob = await exportToWav(buffer, { bitDepth });
        extension = 'wav';
      }

      setProcessedBlob(blob);

      const baseName = file.name.replace(/\.[^.]+$/, '');
      download(blob, `${baseName}.${extension}`);
    } catch (err) {
      console.error('Conversion failed:', err);
    }
  }, [buffer, file, outputFormat, bitDepth, bitrate, exportToWav, exportToMp3, download]);

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

  const getInputFormat = (): string => {
    if (!file) return '';
    return file.name.split('.').pop()?.toUpperCase() || 'Unknown';
  };

  // 推定出力サイズ
  const estimateOutputSize = (): string => {
    if (!bufferInfo) return '';
    
    if (outputFormat === 'wav') {
      // WAV: サンプルレート × チャンネル数 × ビット深度 / 8 × 秒数
      const bytesPerSample = bitDepth / 8;
      const size = bufferInfo.sampleRate * bufferInfo.channels * bytesPerSample * bufferInfo.duration;
      return formatFileSize(size);
    } else {
      // MP3: ビットレート × 秒数 / 8
      const size = (bitrate * 1000 / 8) * bufferInfo.duration;
      return formatFileSize(size);
    }
  };

  const isWorking = isLoading || isExporting;
  const error = loadError;

  // FAQ Data
  const faqs = [
    {
      q: 'What formats can I convert from?',
      a: 'You can convert from MP3, WAV, OGG, FLAC, M4A, and WebM audio files.',
    },
    {
      q: 'What formats can I convert to?',
      a: 'You can convert to WAV (uncompressed) or MP3 (compressed). WAV is best for editing, MP3 is best for sharing.',
    },
    {
      q: 'What bit depth should I choose for WAV?',
      a: '16-bit is CD quality and suitable for most uses. 24-bit is for professional studio work. 32-bit is maximum quality but creates larger files.',
    },
    {
      q: 'Is my audio uploaded to a server?',
      a: 'No. All conversion happens in your browser. Your files never leave your device.',
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
            <ArrowRightLeft className="w-4 h-4" />
            Audio Convert
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Audio Converter
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Convert between audio formats. Support for MP3, WAV, OGG, FLAC, and more.
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
            description="MP3, WAV, OGG, FLAC, M4A, WebM (max 100MB)"
          />

          {/* Audio Info & Controls */}
          {buffer && bufferInfo && !isLoading && (
            <>
              {/* Conversion Preview */}
              <div className="flex items-center justify-center gap-4 p-4 bg-gray-900/50 rounded-xl">
                <div className="text-center">
                  <div className="text-2xl mb-1">📁</div>
                  <div className="text-white font-medium">{getInputFormat()}</div>
                  <div className="text-xs text-gray-400">{file && formatFileSize(file.size)}</div>
                </div>
                <ArrowRight className="w-6 h-6 text-blue-400" />
                <div className="text-center">
                  <div className="text-2xl mb-1">{FORMAT_INFO[outputFormat].icon}</div>
                  <div className="text-white font-medium">{FORMAT_INFO[outputFormat].name}</div>
                  <div className="text-xs text-gray-400">~{estimateOutputSize()}</div>
                </div>
              </div>

              {/* Audio Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Duration: {formatTime(bufferInfo.duration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4" />
                  <span>{bufferInfo.sampleRate} Hz • {bufferInfo.channels}ch</span>
                </div>
              </div>

              {/* Playback */}
              <div className="flex items-center justify-center">
                <button
                  onClick={togglePlayback}
                  className="p-4 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  )}
                </button>
              </div>

              {/* Output Format */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-400 font-medium">Output Format</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['wav', 'mp3'] as OutputFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setOutputFormat(fmt)}
                      disabled={isWorking}
                      className={`p-4 rounded-xl text-left transition-all border-2
                        ${outputFormat === fmt
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                        }
                        disabled:opacity-50`}
                    >
                      <div className="text-2xl mb-1">{FORMAT_INFO[fmt].icon}</div>
                      <div className="font-medium">{FORMAT_INFO[fmt].name}</div>
                      <div className="text-xs text-gray-400 mt-1">{FORMAT_INFO[fmt].description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Format-specific options */}
              {outputFormat === 'wav' && (
                <div className="space-y-2">
                  <label className="block text-sm text-gray-400 font-medium">Bit Depth</label>
                  <div className="grid grid-cols-3 gap-2">
                    {BIT_DEPTHS.map((bd) => (
                      <button
                        key={bd.value}
                        onClick={() => setBitDepth(bd.value)}
                        disabled={isWorking}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors
                          ${bitDepth === bd.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }
                          disabled:opacity-50`}
                      >
                        {bd.value}-bit
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {outputFormat === 'mp3' && (
                <div className="space-y-2">
                  <label className="block text-sm text-gray-400 font-medium">Bitrate</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {BITRATES.map((br) => (
                      <button
                        key={br.value}
                        onClick={() => setBitrate(br.value)}
                        disabled={isWorking}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors
                          ${bitrate === br.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }
                          disabled:opacity-50`}
                      >
                        {br.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Progress */}
          {isExporting && (
            <ProgressIndicator
              progress={exportProgress}
              message={`Converting to ${outputFormat.toUpperCase()}...`}
              color="blue"
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

          {/* Convert Button */}
          {buffer && !isWorking && (
            <button
              onClick={handleConvertAndDownload}
              className="w-full flex items-center justify-center gap-2 px-6 py-4
                bg-gradient-to-r from-blue-500 to-cyan-500 
                hover:from-blue-600 hover:to-cyan-600
                text-white font-semibold text-lg rounded-xl transition-all
                shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              <RefreshCw className="w-5 h-5" />
              Convert to {outputFormat.toUpperCase()}
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
              Convert Another File
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
              <HelpCircle className="w-5 h-5 text-blue-400" />
              How to Use
            </h2>
            {showGuide ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {showGuide && (
            <div className="p-4 border-t border-gray-700 space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { title: 'Upload Audio', desc: 'Drop your audio file or click to browse.' },
                  { title: 'Choose Format', desc: 'Select WAV or MP3 output format.' },
                  { title: 'Convert', desc: 'Click to convert and download.' },
                ].map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
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
              { name: 'MP3 to WAV', href: '/tools/mp3-to-wav', desc: 'Convert MP3 to WAV' },
              { name: 'WAV to MP3', href: '/tools/wav-to-mp3', desc: 'Convert WAV to MP3' },
              { name: 'Volume Booster', href: '/tools/volume-booster', desc: 'Make audio louder' },
              { name: 'Trim Audio', href: '/tools/trim-audio', desc: 'Cut audio files' },
            ].map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className="flex items-center justify-between p-4 rounded-xl border 
                  bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-white">{tool.name}</h3>
                  <p className="text-sm text-gray-400">{tool.desc}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
