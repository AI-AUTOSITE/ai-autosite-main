// app/tools/mp3-to-wav/components/Mp3ToWavConverter.tsx
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FileDropZone, ProgressIndicator, ErrorMessage } from '../../../components/audio';
import { useAudioBuffer, useAudioExport } from '../../../hooks/audio';
import { Shield, Zap, FileAudio, Play, Pause, RotateCcw, Download, Clock, HardDrive } from 'lucide-react';

type BitDepth = 16 | 24 | 32;

export default function Mp3ToWavConverter() {
  // State
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [bitDepth, setBitDepth] = useState<BitDepth>(16);
  const [isPlaying, setIsPlaying] = useState(false);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [estimatedSize, setEstimatedSize] = useState<number>(0);

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);

  // Hooks
  const { buffer, bufferInfo, isLoading, progress: loadProgress, error: loadError, loadFromFile, reset: resetBuffer } = useAudioBuffer();
  const { isExporting, progress: exportProgress, error: exportError, exportToWav, download, reset: resetExport } = useAudioExport();

  // 推定ファイルサイズを計算
  useEffect(() => {
    if (bufferInfo) {
      // WAV size = (sampleRate * channels * bitDepth/8 * duration) + 44 bytes header
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

    // 既存のURLをクリーンアップ
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    // プレビュー用URL作成
    const url = URL.createObjectURL(selectedFile);
    setAudioUrl(url);

    // AudioBufferにデコード
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

  // 変換
  const handleConvert = useCallback(async () => {
    if (!buffer) return;

    try {
      const wavBlob = await exportToWav(buffer, { bitDepth });
      setConvertedBlob(wavBlob);
    } catch (err) {
      console.error('Conversion failed:', err);
    }
  }, [buffer, bitDepth, exportToWav]);

  // ダウンロード
  const handleDownload = useCallback(() => {
    if (!convertedBlob || !file) return;

    const baseName = file.name.replace(/\.[^.]+$/, '');
    download(convertedBlob, `${baseName}.wav`);
  }, [convertedBlob, file, download]);

  // 変換 & ダウンロード（ワンクリック）
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

  // オーディオイベント
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // ファイルサイズをフォーマット
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // 時間をフォーマット
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isProcessing = isLoading || isExporting;
  const error = loadError || exportError;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Hidden audio element for playback */}
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
      )}

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
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl space-y-4">
          {/* Audio Info */}
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

          {/* Simple Player */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayback}
              className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
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
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl space-y-3">
          <label className="block text-sm text-gray-400 font-medium">Output Bit Depth</label>
          <div className="grid grid-cols-3 gap-3">
            {([16, 24, 32] as BitDepth[]).map((depth) => (
              <button
                key={depth}
                onClick={() => setBitDepth(depth)}
                disabled={isProcessing}
                className={`py-3 px-4 rounded-lg font-medium transition-all
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
          onDismiss={() => {
            resetBuffer();
            resetExport();
          }}
          actions={[
            { label: 'Try Again', onClick: handleClear, isPrimary: true },
          ]}
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

      {/* Already converted - Download again */}
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

      {/* Privacy Notice */}
      <div className="text-center text-gray-500 text-xs flex items-center justify-center gap-1.5">
        <Shield className="w-3.5 h-3.5" />
        <span>100% browser-based. Your files never leave your device.</span>
      </div>
    </div>
  );
}
