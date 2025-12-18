// app/tools/extract-audio/components/ExtractAudioClient.tsx
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ProgressIndicator, ErrorMessage } from '@/components/audio';
import { useAudioExport } from '@/hooks/audio';
import { 
  Shield, Zap, Play, Pause, RotateCcw, Download, Clock, HardDrive, Film,
  ChevronDown, ChevronUp, HelpCircle, ArrowRight, Music, Upload, X
} from 'lucide-react';

type OutputFormat = 'wav' | 'mp3';

export default function ExtractAudioClient() {
  // State
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('mp3');
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractProgress, setExtractProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [showFaq, setShowFaq] = useState(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const { isExporting, progress: exportProgress, exportToWav, exportToMp3, download, reset: resetExport } = useAudioExport();

  // ファイル選択
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setProcessedBlob(null);
    setAudioBuffer(null);
    setError(null);

    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }

    const url = URL.createObjectURL(selectedFile);
    setVideoUrl(url);
  }, [videoUrl]);

  // ビデオメタデータ読み込み
  const handleVideoLoaded = useCallback(() => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  }, []);

  // クリア
  const handleClear = useCallback(() => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setFile(null);
    setVideoUrl('');
    setProcessedBlob(null);
    setAudioBuffer(null);
    setIsPlaying(false);
    setVideoDuration(0);
    setError(null);
    resetExport();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [videoUrl, resetExport]);

  // 再生/一時停止
  const togglePlayback = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // オーディオ抽出
  const extractAudio = useCallback(async () => {
    if (!file) return;

    setIsExtracting(true);
    setExtractProgress(0);
    setError(null);

    try {
      setExtractProgress(10);

      // ファイルをArrayBufferとして読み込む
      const arrayBuffer = await file.arrayBuffer();
      
      setExtractProgress(30);

      // AudioContextでデコード
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      setExtractProgress(50);

      const buffer = await audioContext.decodeAudioData(arrayBuffer);
      
      setExtractProgress(80);

      setAudioBuffer(buffer);
      audioContext.close();

      setExtractProgress(100);
    } catch (err) {
      console.error('Audio extraction failed:', err);
      setError(new Error('Failed to extract audio. This video format may not be supported by your browser.'));
    } finally {
      setIsExtracting(false);
    }
  }, [file]);

  // ダウンロード
  const handleDownload = useCallback(async () => {
    if (!audioBuffer || !file) return;

    try {
      let blob: Blob;
      let extension: string;

      if (outputFormat === 'mp3') {
        blob = await exportToMp3(audioBuffer, { bitrate: 192 });
        extension = 'mp3';
      } else {
        blob = await exportToWav(audioBuffer, { bitDepth: 16 });
        extension = 'wav';
      }

      setProcessedBlob(blob);

      const baseName = file.name.replace(/\.[^.]+$/, '');
      download(blob, `${baseName}_audio.${extension}`);
    } catch (err) {
      console.error('Export failed:', err);
      setError(new Error('Failed to export audio.'));
    }
  }, [audioBuffer, file, outputFormat, exportToWav, exportToMp3, download]);

  // ビデオイベント
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleEnded = () => setIsPlaying(false);
    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, []);

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

  const isWorking = isExtracting || isExporting;

  // FAQ Data
  const faqs = [
    {
      q: 'What video formats are supported?',
      a: 'MP4, WebM, and OGG video files are well supported. MOV files may work depending on your browser. For best results, use MP4 or WebM.',
    },
    {
      q: 'Will the audio quality be preserved?',
      a: 'Yes, the audio is extracted at its original quality. Choosing WAV output preserves full quality, while MP3 applies compression.',
    },
    {
      q: 'Is there a file size limit?',
      a: 'For best performance, we recommend videos under 500MB. Larger files may take longer to process and use more memory.',
    },
    {
      q: 'Is my video uploaded to a server?',
      a: 'No. All processing happens in your browser. Your files never leave your device.',
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm font-medium">
            <Film className="w-4 h-4" />
            Audio Create
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Extract Audio
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Extract audio track from video files. Convert MP4, WebM to MP3 or WAV.
            100% private, processed in your browser.
          </p>
        </div>

        {/* Main Tool Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 space-y-6">
          {/* File Upload */}
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer
                hover:border-pink-500/50 hover:bg-pink-500/5 transition-all"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Film className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-white mb-2">
                Drop video file here or click to browse
              </p>
              <p className="text-sm text-gray-400">
                MP4, WebM, OGG (max 500MB recommended)
              </p>
            </div>
          ) : (
            <>
              {/* File Info */}
              <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Film className="w-8 h-8 text-pink-400" />
                  <div>
                    <p className="font-medium text-white truncate max-w-[200px] sm:max-w-none">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formatFileSize(file.size)}
                      {videoDuration > 0 && ` • ${formatTime(videoDuration)}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClear}
                  disabled={isWorking}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Preview */}
              {videoUrl && (
                <div className="relative rounded-xl overflow-hidden bg-black">
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    onLoadedMetadata={handleVideoLoaded}
                    className="w-full max-h-64 object-contain"
                    playsInline
                  />
                  <button
                    onClick={togglePlayback}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity"
                  >
                    {isPlaying ? (
                      <Pause className="w-16 h-16 text-white" />
                    ) : (
                      <Play className="w-16 h-16 text-white" />
                    )}
                  </button>
                </div>
              )}

              {/* Extract Button (if not yet extracted) */}
              {!audioBuffer && !isExtracting && (
                <button
                  onClick={extractAudio}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4
                    bg-gradient-to-r from-pink-500 to-rose-500 
                    hover:from-pink-600 hover:to-rose-600
                    text-white font-semibold text-lg rounded-xl transition-all
                    shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40"
                >
                  <Music className="w-5 h-5" />
                  Extract Audio
                </button>
              )}

              {/* Extracting Progress */}
              {isExtracting && (
                <ProgressIndicator
                  progress={extractProgress}
                  message="Extracting audio from video..."
                  color="pink"
                />
              )}

              {/* Audio Extracted - Format Selection */}
              {audioBuffer && !isExtracting && (
                <>
                  <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <Music className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Audio extracted successfully!</span>
                  </div>

                  {/* Output Format */}
                  <div className="space-y-2">
                    <label className="block text-sm text-gray-400 font-medium">Output Format</label>
                    <div className="flex gap-3">
                      {(['mp3', 'wav'] as OutputFormat[]).map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => setOutputFormat(fmt)}
                          disabled={isExporting}
                          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all
                            ${outputFormat === fmt
                              ? 'bg-pink-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }
                            disabled:opacity-50`}
                        >
                          {fmt.toUpperCase()}
                          <span className="block text-xs mt-1 opacity-70">
                            {fmt === 'mp3' ? 'Smaller file' : 'High quality'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Export Progress */}
                  {isExporting && (
                    <ProgressIndicator
                      progress={exportProgress}
                      message={`Converting to ${outputFormat.toUpperCase()}...`}
                      color="pink"
                    />
                  )}

                  {/* Download Button */}
                  {!isExporting && (
                    <button
                      onClick={handleDownload}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4
                        bg-gradient-to-r from-pink-500 to-rose-500 
                        hover:from-pink-600 hover:to-rose-600
                        text-white font-semibold text-lg rounded-xl transition-all
                        shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40"
                    >
                      <Download className="w-5 h-5" />
                      Download {outputFormat.toUpperCase()}
                    </button>
                  )}
                </>
              )}

              {/* Already downloaded */}
              {processedBlob && !isWorking && (
                <button
                  onClick={handleClear}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3
                    bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  Extract From Another Video
                </button>
              )}
            </>
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
              <HelpCircle className="w-5 h-5 text-pink-400" />
              How to Use
            </h2>
            {showGuide ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {showGuide && (
            <div className="p-4 border-t border-gray-700 space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { title: 'Upload Video', desc: 'Drop your video file or click to browse.' },
                  { title: 'Extract Audio', desc: 'Click to extract the audio track.' },
                  { title: 'Download', desc: 'Choose format and download audio.' },
                ].map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold">
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
              { name: 'MP3 to WAV', href: '/tools/mp3-to-wav', desc: 'Convert MP3 to WAV', status: 'live' },
              { name: 'WAV to MP3', href: '/tools/wav-to-mp3', desc: 'Convert WAV to MP3', status: 'live' },
              { name: 'Trim Audio', href: '/tools/trim-audio', desc: 'Cut audio files', status: 'live' },
              { name: 'Volume Booster', href: '/tools/volume-booster', desc: 'Make audio louder', status: 'live' },
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
