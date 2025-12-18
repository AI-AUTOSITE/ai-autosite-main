// app/tools/mp3-to-wav/components/Mp3ToWavClient.tsx
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FileDropZone, ProgressIndicator, ErrorMessage } from '../../../components/audio';
import { useAudioBuffer, useAudioExport } from '../../../hooks/audio';
import { 
  Shield, Zap, FileAudio, Play, Pause, RotateCcw, Download, Clock, HardDrive,
  ChevronDown, ChevronUp, Upload, Settings, Check, ArrowRight, HelpCircle
} from 'lucide-react';

type BitDepth = 16 | 24 | 32;

export default function Mp3ToWavClient() {
  // State
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [bitDepth, setBitDepth] = useState<BitDepth>(16);
  const [isPlaying, setIsPlaying] = useState(false);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [estimatedSize, setEstimatedSize] = useState<number>(0);
  const [showGuide, setShowGuide] = useState(false);
  const [showFaq, setShowFaq] = useState(false);

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);

  // Hooks
  const { buffer, bufferInfo, isLoading, progress: loadProgress, error: loadError, loadFromFile, reset: resetBuffer } = useAudioBuffer();
  const { isExporting, progress: exportProgress, error: exportError, exportToWav, download, reset: resetExport } = useAudioExport();

  // 推定ファイルサイズを計算
  useEffect(() => {
    if (bufferInfo) {
      const bytesPerSample = bitDepth / 8;
      const size = (bufferInfo.sampleRate * bufferInfo.numberOfChannels * bytesPerSample * bufferInfo.duration) + 44;
      setEstimatedSize(size);
    }
  }, [bufferInfo, bitDepth]);

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
      const wavBlob = await exportToWav(buffer, { bitDepth });
      setConvertedBlob(wavBlob);
      
      const baseName = file.name.replace(/\.[^.]+$/, '');
      download(wavBlob, `${baseName}.wav`);
    } catch (err) {
      console.error('Conversion failed:', err);
    }
  }, [buffer, file, bitDepth, exportToWav, download]);

  // ダウンロード（再度）
  const handleDownload = useCallback(() => {
    if (!convertedBlob || !file) return;
    const baseName = file.name.replace(/\.[^.]+$/, '');
    download(convertedBlob, `${baseName}.wav`);
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

  const isProcessing = isLoading || isExporting;
  const error = loadError || exportError;

  // FAQ Data
  const faqs = [
    {
      q: 'Will I lose quality when converting MP3 to WAV?',
      a: 'No additional quality is lost. However, the original quality lost during MP3 compression cannot be restored. WAV is uncompressed, so the file will be larger but won\'t degrade further.',
    },
    {
      q: 'Why would I convert MP3 to WAV?',
      a: 'WAV files are better for audio editing because they don\'t compress the sound. Some software and hardware also prefer WAV format.',
    },
    {
      q: 'Which bit depth should I choose?',
      a: '16-bit is CD quality (smallest). 24-bit is professional quality (recommended). 32-bit is maximum precision (largest).',
    },
    {
      q: 'Is my audio file uploaded to a server?',
      a: 'No. All processing happens in your browser using Web Audio API. Your files never leave your device.',
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
            MP3 to WAV Converter
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Convert MP3 files to high-quality WAV format instantly in your browser. 
            100% free, no upload required, completely private.
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
            accept={{ 'audio/mpeg': ['.mp3'] }}
            label="Drop MP3 file here or click to browse"
            description="MP3 files only (max 100MB)"
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

          {/* Bit Depth Selection */}
          {buffer && !isLoading && (
            <div className="space-y-3">
              <label className="block text-sm text-gray-400 font-medium">Output Bit Depth</label>
              <div className="grid grid-cols-3 gap-3">
                {([16, 24, 32] as BitDepth[]).map((depth) => (
                  <button
                    key={depth}
                    onClick={() => setBitDepth(depth)}
                    disabled={isProcessing}
                    className={`py-3 px-4 rounded-xl font-medium transition-all
                      ${bitDepth === depth
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-900'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {depth}-bit
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  {bitDepth === 16 && '📀 CD Quality - Smallest file'}
                  {bitDepth === 24 && '🎵 Professional - Recommended'}
                  {bitDepth === 32 && '🎚️ Maximum - Largest file'}
                </span>
                <span>Est. size: ~{formatFileSize(estimatedSize)}</span>
              </div>
            </div>
          )}

          {/* Progress */}
          {isExporting && (
            <ProgressIndicator
              progress={exportProgress}
              message="Converting to WAV..."
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
              Convert & Download WAV
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
                  { icon: Upload, title: 'Upload MP3', desc: 'Drag and drop your MP3 file or click to browse.' },
                  { icon: Settings, title: 'Choose Bit Depth', desc: 'Select 16-bit, 24-bit, or 32-bit output.' },
                  { icon: Download, title: 'Download WAV', desc: 'Click to convert and download your file.' },
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
              { name: 'WAV to MP3', href: '/tools/wav-to-mp3', desc: 'Convert WAV to compressed MP3', status: 'coming' },
              { name: 'Audio Converter', href: '/tools/audio-converter', desc: 'Convert between formats', status: 'coming' },
              { name: 'Trim Audio', href: '/tools/trim-audio', desc: 'Cut unwanted parts', status: 'coming' },
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
