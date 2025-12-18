// app/tools/record-voice/components/RecordVoiceClient.tsx
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ProgressIndicator, ErrorMessage } from '@/components/audio';
import { useMediaRecorder, useAudioBuffer, useAudioExport } from '@/hooks/audio';
import { 
  Shield, Zap, Mic, MicOff, Play, Pause, Square, RotateCcw, Download,
  ChevronDown, ChevronUp, HelpCircle, ArrowRight, AlertCircle, Clock
} from 'lucide-react';

type OutputFormat = 'wav' | 'mp3';

export default function RecordVoiceClient() {
  // State
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('wav');
  const [isPlaying, setIsPlaying] = useState(false);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [showFaq, setShowFaq] = useState(false);

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);

  // Hooks
  const {
    state: recordingState,
    isRecording,
    isPaused,
    duration,
    audioBlob,
    audioUrl,
    error: recordError,
    start,
    stop,
    pause,
    resume,
    reset: resetRecording,
    hasPermission,
    requestPermission,
  } = useMediaRecorder();

  const { buffer, isLoading: isDecoding, loadFromBlob, reset: resetBuffer } = useAudioBuffer();
  const { isExporting, progress: exportProgress, exportToWav, exportToMp3, download, reset: resetExport } = useAudioExport();

  // 録音完了時にデコード
  useEffect(() => {
    if (audioBlob && !isRecording) {
      loadFromBlob(audioBlob).catch(console.error);
    }
  }, [audioBlob, isRecording, loadFromBlob]);

  // 再生/一時停止
  const togglePlayback = useCallback(() => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, audioUrl]);

  // ダウンロード
  const handleDownload = useCallback(async () => {
    if (!buffer) return;

    try {
      let blob: Blob;
      let extension: string;

      if (outputFormat === 'mp3') {
        blob = await exportToMp3(buffer, { bitrate: 192 });
        extension = 'mp3';
      } else {
        blob = await exportToWav(buffer, { bitDepth: 16 });
        extension = 'wav';
      }

      setProcessedBlob(blob);
      
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
      download(blob, `recording_${timestamp}.${extension}`);
    } catch (err) {
      console.error('Export failed:', err);
    }
  }, [buffer, outputFormat, exportToWav, exportToMp3, download]);

  // 新規録音
  const handleNewRecording = useCallback(() => {
    resetRecording();
    resetBuffer();
    resetExport();
    setProcessedBlob(null);
    setIsPlaying(false);
  }, [resetRecording, resetBuffer, resetExport]);

  // オーディオイベント
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, []);

  // 時間フォーマット
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isWorking = isRecording || isPaused || isDecoding || isExporting;
  const hasRecording = audioBlob && !isRecording && !isPaused;

  // FAQ Data
  const faqs = [
    {
      q: 'What audio formats can I export?',
      a: 'You can export as WAV (uncompressed, highest quality) or MP3 (compressed, smaller file size).',
    },
    {
      q: 'Is there a recording time limit?',
      a: 'For best performance, we recommend recordings under 10 minutes. Longer recordings may use more memory.',
    },
    {
      q: 'Why is my microphone not working?',
      a: 'Make sure you\'ve granted microphone permission in your browser. Click the microphone icon in your address bar to check permissions.',
    },
    {
      q: 'Is my recording uploaded to a server?',
      a: 'No. All recording and processing happens in your browser. Your audio never leaves your device.',
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm font-medium">
            <Mic className="w-4 h-4" />
            Audio Create
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Record Voice
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Record audio from your microphone and download as WAV or MP3.
            100% private, processed entirely in your browser.
          </p>
        </div>

        {/* Hidden audio element */}
        {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}

        {/* Main Tool Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 space-y-6">
          
          {/* Permission Request */}
          {hasPermission === false && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
                <MicOff className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Microphone Access Required</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Please allow microphone access to record audio.
                </p>
              </div>
              <button
                onClick={requestPermission}
                className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-xl transition-colors"
              >
                Allow Microphone Access
              </button>
            </div>
          )}

          {/* Recording Interface */}
          {hasPermission !== false && !hasRecording && (
            <div className="text-center py-8 space-y-6">
              {/* Timer */}
              <div className="text-5xl font-mono font-bold text-white">
                {formatDuration(duration)}
              </div>

              {/* Recording Indicator */}
              {isRecording && (
                <div className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-400 font-medium">Recording...</span>
                </div>
              )}
              {isPaused && (
                <div className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span className="text-yellow-400 font-medium">Paused</span>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                {!isRecording && !isPaused && (
                  <button
                    onClick={start}
                    className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 
                      hover:from-pink-600 hover:to-rose-600 flex items-center justify-center
                      shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all"
                  >
                    <Mic className="w-8 h-8 text-white" />
                  </button>
                )}

                {isRecording && (
                  <>
                    <button
                      onClick={pause}
                      className="w-14 h-14 rounded-full bg-yellow-600 hover:bg-yellow-700 
                        flex items-center justify-center transition-colors"
                    >
                      <Pause className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={stop}
                      className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 
                        flex items-center justify-center shadow-lg transition-all"
                    >
                      <Square className="w-8 h-8 text-white" />
                    </button>
                  </>
                )}

                {isPaused && (
                  <>
                    <button
                      onClick={resume}
                      className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 
                        flex items-center justify-center transition-colors"
                    >
                      <Play className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={stop}
                      className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 
                        flex items-center justify-center shadow-lg transition-all"
                    >
                      <Square className="w-8 h-8 text-white" />
                    </button>
                  </>
                )}
              </div>

              {/* Instructions */}
              {!isRecording && !isPaused && (
                <p className="text-gray-500 text-sm">
                  Click the microphone button to start recording
                </p>
              )}
            </div>
          )}

          {/* Playback & Export */}
          {hasRecording && (
            <div className="space-y-6">
              {/* Playback */}
              <div className="p-4 bg-gray-900/50 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Duration: {formatDuration(duration)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlayback}
                    disabled={isDecoding}
                    className="p-3 bg-pink-600 hover:bg-pink-700 rounded-full transition-colors disabled:opacity-50"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    )}
                  </button>
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full w-0 bg-pink-500 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Format Selection */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-400 font-medium">Output Format</label>
                <div className="flex gap-3">
                  {(['wav', 'mp3'] as OutputFormat[]).map((fmt) => (
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
                        {fmt === 'wav' ? 'High quality' : 'Smaller file'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress */}
              {isExporting && (
                <ProgressIndicator
                  progress={exportProgress}
                  message="Exporting audio..."
                  color="pink"
                />
              )}

              {/* Download Button */}
              {!isExporting && buffer && (
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

              {/* New Recording Button */}
              <button
                onClick={handleNewRecording}
                disabled={isExporting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3
                  bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors
                  disabled:opacity-50"
              >
                <RotateCcw className="w-5 h-5" />
                New Recording
              </button>
            </div>
          )}

          {/* Error */}
          {recordError && (
            <ErrorMessage
              error={recordError}
              severity="error"
              dismissible
              onDismiss={handleNewRecording}
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
                Your recordings are processed entirely in your browser. Nothing is uploaded to any server.
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
                  { icon: Mic, title: 'Start Recording', desc: 'Click the microphone button to begin recording.' },
                  { icon: Square, title: 'Stop Recording', desc: 'Click the stop button when finished.' },
                  { icon: Download, title: 'Download', desc: 'Choose format and download your recording.' },
                ].map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-pink-400" />
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
              { name: 'Voice Transcription', href: '/tools/voice-transcription', desc: 'Convert speech to text', status: 'live' },
              { name: 'Volume Booster', href: '/tools/volume-booster', desc: 'Make audio louder', status: 'live' },
              { name: 'MP3 to WAV', href: '/tools/mp3-to-wav', desc: 'Convert MP3 to WAV', status: 'live' },
              { name: 'WAV to MP3', href: '/tools/wav-to-mp3', desc: 'Convert WAV to MP3', status: 'live' },
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
