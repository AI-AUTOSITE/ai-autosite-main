// app/tools/merge-audio/components/MergeAudioClient.tsx
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ProgressIndicator, ErrorMessage } from '@/components/audio';
import { useAudioExport } from '@/hooks/audio';
import { mergeAudio } from '@/lib/audio-toolkit';
import { 
  Shield, Zap, Play, Pause, RotateCcw, Download, Clock, HardDrive, Link2,
  ChevronDown, ChevronUp, HelpCircle, ArrowRight, Plus, Trash2, GripVertical,
  Upload, X, Music
} from 'lucide-react';

type OutputFormat = 'wav' | 'mp3';

interface AudioFile {
  id: string;
  file: File;
  url: string;
  buffer: AudioBuffer | null;
  duration: number;
  isLoading: boolean;
  error: string | null;
}

export default function MergeAudioClient() {
  // State
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [crossfade, setCrossfade] = useState<number>(0);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('wav');
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  // Hooks
  const { isExporting, progress: exportProgress, exportToWav, exportToMp3, download, reset: resetExport } = useAudioExport();

  // ファイル追加
  const handleAddFiles = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: AudioFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const id = `${Date.now()}-${i}`;
      const url = URL.createObjectURL(file);

      newFiles.push({
        id,
        file,
        url,
        buffer: null,
        duration: 0,
        isLoading: true,
        error: null,
      });
    }

    setAudioFiles(prev => [...prev, ...newFiles]);
    setProcessedBlob(null);

    // 各ファイルをデコード
    for (const audioFile of newFiles) {
      try {
        const arrayBuffer = await audioFile.file.arrayBuffer();
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const buffer = await audioContext.decodeAudioData(arrayBuffer);
        audioContext.close();

        setAudioFiles(prev => prev.map(f => 
          f.id === audioFile.id 
            ? { ...f, buffer, duration: buffer.duration, isLoading: false }
            : f
        ));
      } catch (err) {
        setAudioFiles(prev => prev.map(f => 
          f.id === audioFile.id 
            ? { ...f, isLoading: false, error: 'Failed to decode audio' }
            : f
        ));
      }
    }

    // inputをリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // ファイル削除
  const handleRemoveFile = useCallback((id: string) => {
    setAudioFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.url);
      }
      return prev.filter(f => f.id !== id);
    });
    setProcessedBlob(null);
  }, []);

  // 順序変更（上へ）
  const handleMoveUp = useCallback((index: number) => {
    if (index <= 0) return;
    setAudioFiles(prev => {
      const newFiles = [...prev];
      [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
      return newFiles;
    });
    setProcessedBlob(null);
  }, []);

  // 順序変更（下へ）
  const handleMoveDown = useCallback((index: number) => {
    setAudioFiles(prev => {
      if (index >= prev.length - 1) return prev;
      const newFiles = [...prev];
      [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
      return newFiles;
    });
    setProcessedBlob(null);
  }, []);

  // クリア
  const handleClear = useCallback(() => {
    audioFiles.forEach(f => URL.revokeObjectURL(f.url));
    setAudioFiles([]);
    setProcessedBlob(null);
    setCrossfade(0);
    setError(null);
    resetExport();
  }, [audioFiles, resetExport]);

  // 再生
  const handlePlay = useCallback((id: string) => {
    // 他の再生を停止
    Object.values(audioRefs.current).forEach(audio => audio.pause());
    
    const audio = audioRefs.current[id];
    if (audio) {
      if (playingId === id) {
        audio.pause();
        setPlayingId(null);
      } else {
        audio.currentTime = 0;
        audio.play();
        setPlayingId(id);
      }
    }
  }, [playingId]);

  // オーディオ終了イベント
  useEffect(() => {
    const handleEnded = () => setPlayingId(null);
    
    Object.values(audioRefs.current).forEach(audio => {
      audio.addEventListener('ended', handleEnded);
    });

    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.removeEventListener('ended', handleEnded);
      });
    };
  }, [audioFiles]);

  // マージ & ダウンロード
  const handleMergeAndDownload = useCallback(async () => {
    const validFiles = audioFiles.filter(f => f.buffer);
    if (validFiles.length < 2) {
      setError(new Error('Please add at least 2 audio files to merge.'));
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // バッファを結合
      const buffers = validFiles.map(f => f.buffer!);
      const mergedBuffer = mergeAudio(buffers, crossfade);

      // エクスポート
      let blob: Blob;
      let extension: string;

      if (outputFormat === 'mp3') {
        blob = await exportToMp3(mergedBuffer, { bitrate: 192 });
        extension = 'mp3';
      } else {
        blob = await exportToWav(mergedBuffer, { bitDepth: 16 });
        extension = 'wav';
      }

      setProcessedBlob(blob);

      const timestamp = new Date().toISOString().slice(0, 10);
      download(blob, `merged_audio_${timestamp}.${extension}`);
    } catch (err) {
      console.error('Merge failed:', err);
      setError(new Error('Failed to merge audio files.'));
    } finally {
      setIsProcessing(false);
    }
  }, [audioFiles, crossfade, outputFormat, exportToWav, exportToMp3, download]);

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

  // 合計時間
  const totalDuration = audioFiles.reduce((sum, f) => sum + f.duration, 0);
  const estimatedDuration = totalDuration - (crossfade * Math.max(0, audioFiles.length - 1));

  // 最大クロスフェード
  const minDuration = Math.min(...audioFiles.filter(f => f.duration > 0).map(f => f.duration), 10);
  const maxCrossfade = minDuration / 2;

  const validFileCount = audioFiles.filter(f => f.buffer).length;
  const isWorking = isProcessing || isExporting || audioFiles.some(f => f.isLoading);
  const canMerge = validFileCount >= 2 && !isWorking;

  // FAQ Data
  const faqs = [
    {
      q: 'How many files can I merge?',
      a: 'You can merge 2 or more audio files. For best performance, we recommend merging up to 10 files at a time.',
    },
    {
      q: 'Can I change the order of files?',
      a: 'Yes! Use the up and down arrows next to each file to rearrange the order.',
    },
    {
      q: 'What is crossfade?',
      a: 'Crossfade creates smooth transitions between tracks by gradually fading out one track while fading in the next.',
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
            <Link2 className="w-4 h-4" />
            Audio Edit
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Merge Audio
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Combine multiple audio files into one. Add crossfade between tracks.
            100% private, processed in your browser.
          </p>
        </div>

        {/* Hidden audio elements */}
        {audioFiles.map(f => (
          <audio
            key={f.id}
            ref={el => { if (el) audioRefs.current[f.id] = el; }}
            src={f.url}
            preload="metadata"
          />
        ))}

        {/* Main Tool Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 space-y-6">
          {/* Add Files */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center cursor-pointer
              hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              multiple
              onChange={handleAddFiles}
              className="hidden"
            />
            <Plus className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-lg font-medium text-white mb-1">
              Add Audio Files
            </p>
            <p className="text-sm text-gray-400">
              MP3, WAV, OGG, FLAC (select multiple files)
            </p>
          </div>

          {/* File List */}
          {audioFiles.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-400">Files ({audioFiles.length})</h3>
                <button
                  onClick={handleClear}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-2">
                {audioFiles.map((file, index) => (
                  <div
                    key={file.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors
                      ${file.error ? 'bg-red-500/10 border border-red-500/30' : 'bg-gray-900/50'}`}
                  >
                    {/* Order Controls */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === audioFiles.length - 1}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{file.file.name}</p>
                      <p className="text-sm text-gray-400">
                        {file.isLoading ? 'Loading...' : 
                         file.error ? file.error :
                         `${formatTime(file.duration)} • ${formatFileSize(file.file.size)}`}
                      </p>
                    </div>

                    {/* Play Button */}
                    {!file.isLoading && !file.error && (
                      <button
                        onClick={() => handlePlay(file.id)}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        {playingId === file.id ? (
                          <Pause className="w-4 h-4 text-white" />
                        ) : (
                          <Play className="w-4 h-4 text-white" />
                        )}
                      </button>
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveFile(file.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Crossfade (if 2+ files) */}
          {validFileCount >= 2 && (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-400 font-medium">Crossfade</label>
                  <span className="text-emerald-400 font-mono">{crossfade.toFixed(1)}s</span>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max={maxCrossfade}
                  step="0.1"
                  value={crossfade}
                  onChange={(e) => setCrossfade(Number(e.target.value))}
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
                  <span>0s (no crossfade)</span>
                  <span>{maxCrossfade.toFixed(1)}s</span>
                </div>
              </div>

              {/* Estimated Duration */}
              <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <span className="text-gray-400 text-sm">Total duration:</span>
                <span className="text-emerald-400 font-medium">{formatTime(estimatedDuration)}</span>
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
              message="Merging audio files..."
              color="green"
            />
          )}

          {/* Error */}
          {error && (
            <ErrorMessage
              error={error}
              severity="error"
              dismissible
              onDismiss={() => setError(null)}
            />
          )}

          {/* Merge Button */}
          {canMerge && (
            <button
              onClick={handleMergeAndDownload}
              className="w-full flex items-center justify-center gap-2 px-6 py-4
                bg-gradient-to-r from-emerald-500 to-green-500 
                hover:from-emerald-600 hover:to-green-600
                text-white font-semibold text-lg rounded-xl transition-all
                shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
            >
              <Link2 className="w-5 h-5" />
              Merge & Download {outputFormat.toUpperCase()}
            </button>
          )}

          {/* Not enough files */}
          {audioFiles.length > 0 && validFileCount < 2 && !isWorking && (
            <p className="text-center text-gray-400">
              Add at least 2 audio files to merge
            </p>
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
                  { title: 'Add Files', desc: 'Click to add multiple audio files.' },
                  { title: 'Arrange Order', desc: 'Use arrows to reorder tracks.' },
                  { title: 'Merge', desc: 'Click to combine and download.' },
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
              { name: 'Loop Audio', href: '/tools/loop-audio', desc: 'Create audio loops', status: 'live' },
              { name: 'Fade Audio', href: '/tools/fade-audio', desc: 'Add fade effects', status: 'live' },
              { name: 'Extract Audio', href: '/tools/extract-audio', desc: 'Extract from video', status: 'live' },
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
