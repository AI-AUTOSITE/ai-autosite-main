// app/tools/reverse-audio/components/ReverseAudioClient.tsx
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FileDropZone, ProgressIndicator, ErrorMessage } from '@/components/audio';
import { useAudioBuffer, useAudioExport } from '@/hooks/audio';
import { reverseAudio } from '@/lib/audio-toolkit';
import { 
  Shield, Zap, Play, Pause, RotateCcw, Download, Clock, HardDrive,
  ChevronDown, ChevronUp, HelpCircle, ArrowRight, Undo2
} from 'lucide-react';

type OutputFormat = 'wav' | 'mp3';

export default function ReverseAudioClient() {
  // State
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [reversedUrl, setReversedUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingReversed, setPlayingReversed] = useState(false);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('wav');
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [reversedBuffer, setReversedBuffer] = useState<AudioBuffer | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showFaq, setShowFaq] = useState(false);

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const reversedAudioRef = useRef<HTMLAudioElement>(null);

  // Hooks
  const { buffer, bufferInfo, isLoading, progress: loadProgress, error: loadError, loadFromFile, reset: resetBuffer } = useAudioBuffer();
  const { isExporting, progress: exportProgress, exportToWav, exportToMp3, download, reset: resetExport } = useAudioExport();

  // バッファ読み込み後に逆再生バージョンを作成
  useEffect(() => {
    if (buffer && !reversedBuffer) {
      const reversed = reverseAudio(buffer);
      setReversedBuffer(reversed);
      
      // プレビュー用にWAVを作成
      exportToWav(reversed, { bitDepth: 16 }).then((blob) => {
        if (reversedUrl) {
          URL.revokeObjectURL(reversedUrl);
        }
        const url = URL.createObjectURL(blob);
        setReversedUrl(url);
      }).catch(console.error);
    }
  }, [buffer, reversedBuffer, exportToWav, reversedUrl]);

  // ファイル選択
  const handleFileSelect = useCallback(async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    setProcessedBlob(null);
    setReversedBuffer(null);

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    if (reversedUrl) {
      URL.revokeObjectURL(reversedUrl);
      setReversedUrl('');
    }

    const url = URL.createObjectURL(selectedFile);
    setAudioUrl(url);

    try {
      await loadFromFile(selectedFile);
    } catch (err) {
      console.error('Failed to load file:', err);
    }
  }, [audioUrl, reversedUrl, loadFromFile]);

  // クリア
  const handleClear = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    if (reversedUrl) {
      URL.revokeObjectURL(reversedUrl);
    }
    setFile(null);
    setAudioUrl('');
    setReversedUrl('');
    setProcessedBlob(null);
    setReversedBuffer(null);
    setIsPlaying(false);
    setPlayingReversed(false);
    resetBuffer();
    resetExport();
  }, [audioUrl, reversedUrl, resetBuffer, resetExport]);

  // オリジナル再生
  const toggleOriginal = useCallback(() => {
    if (!audioRef.current) return;

    // 逆再生を停止
    if (reversedAudioRef.current && playingReversed) {
      reversedAudioRef.current.pause();
      setPlayingReversed(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, playingReversed]);

  // 逆再生プレビュー
  const toggleReversed = useCallback(() => {
    if (!reversedAudioRef.current || !reversedUrl) return;

    // オリジナルを停止
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    if (playingReversed) {
      reversedAudioRef.current.pause();
    } else {
      reversedAudioRef.current.currentTime = 0;
      reversedAudioRef.current.play();
    }
    setPlayingReversed(!playingReversed);
  }, [playingReversed, isPlaying, reversedUrl]);

  // オーディオイベント
  useEffect(() => {
    const audio = audioRef.current;
    const reversed = reversedAudioRef.current;

    const handleOriginalEnded = () => setIsPlaying(false);
    const handleReversedEnded = () => setPlayingReversed(false);

    if (audio) {
      audio.addEventListener('ended', handleOriginalEnded);
    }
    if (reversed) {
      reversed.addEventListener('ended', handleReversedEnded);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('ended', handleOriginalEnded);
      }
      if (reversed) {
        reversed.removeEventListener('ended', handleReversedEnded);
      }
    };
  }, []);

  // ダウンロード
  const handleDownload = useCallback(async () => {
    if (!reversedBuffer || !file) return;

    setIsProcessing(true);

    try {
      let blob: Blob;
      let extension: string;

      if (outputFormat === 'mp3') {
        blob = await exportToMp3(reversedBuffer, { bitrate: 192 });
        extension = 'mp3';
      } else {
        blob = await exportToWav(reversedBuffer, { bitDepth: 16 });
        extension = 'wav';
      }

      setProcessedBlob(blob);

      const baseName = file.name.replace(/\.[^.]+$/, '');
      download(blob, `${baseName}_reversed.${extension}`);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [reversedBuffer, file, outputFormat, exportToWav, exportToMp3, download]);

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

  const isWorking = isLoading || isExporting || isProcessing;
  const error = loadError;

  // FAQ Data
  const faqs = [
    {
      q: 'What is reversed audio used for?',
      a: 'Reversed audio is used for creative sound effects, music production, DJ mixing, hidden messages, and artistic projects.',
    },
    {
      q: 'Can I preview the reversed audio?',
      a: 'Yes! After uploading, you can listen to both the original and reversed versions before downloading.',
    },
    {
      q: 'Is the quality affected?',
      a: 'No, reversing audio is a lossless operation. The quality remains the same as the original.',
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
            <Undo2 className="w-4 h-4" />
            Audio Edit
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Reverse Audio
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Play audio backwards. Create reverse sound effects instantly.
            100% private, processed in your browser.
          </p>
        </div>

        {/* Hidden audio elements */}
        {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}
        {reversedUrl && <audio ref={reversedAudioRef} src={reversedUrl} preload="metadata" />}

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

          {/* Audio Info & Preview */}
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

              {/* Comparison Player */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Original */}
                <div className="p-4 bg-gray-900/50 rounded-xl space-y-3">
                  <h3 className="text-sm font-medium text-gray-400">Original</h3>
                  <button
                    onClick={toggleOriginal}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white" />
                    )}
                    <span className="text-white">{isPlaying ? 'Pause' : 'Play'} Original</span>
                  </button>
                </div>

                {/* Reversed */}
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-3">
                  <h3 className="text-sm font-medium text-emerald-400">Reversed</h3>
                  <button
                    onClick={toggleReversed}
                    disabled={!reversedUrl}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {playingReversed ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white" />
                    )}
                    <span className="text-white">{playingReversed ? 'Pause' : 'Play'} Reversed</span>
                  </button>
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
              message="Processing audio..."
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

          {/* Download Button */}
          {reversedBuffer && !isWorking && (
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 px-6 py-4
                bg-gradient-to-r from-emerald-500 to-green-500 
                hover:from-emerald-600 hover:to-green-600
                text-white font-semibold text-lg rounded-xl transition-all
                shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
            >
              <Download className="w-5 h-5" />
              Download Reversed {outputFormat.toUpperCase()}
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
              Reverse Another File
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
                  { title: 'Preview', desc: 'Listen to original and reversed versions.' },
                  { title: 'Download', desc: 'Choose format and download reversed audio.' },
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
              { name: 'Speed Changer', href: '/tools/speed-changer', desc: 'Adjust playback speed', status: 'live' },
              { name: 'Trim Audio', href: '/tools/trim-audio', desc: 'Cut audio files', status: 'live' },
              { name: 'Fade Audio', href: '/tools/fade-audio', desc: 'Add fade effects', status: 'coming' },
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
