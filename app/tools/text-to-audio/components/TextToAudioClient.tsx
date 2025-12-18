// app/tools/text-to-audio/components/TextToAudioClient.tsx
'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ErrorMessage } from '@/components/audio';
import { 
  Shield, Play, Pause, Square, Volume2, MessageSquare,
  ChevronDown, ChevronUp, HelpCircle, ArrowRight, Settings, AlertCircle
} from 'lucide-react';

interface Voice {
  voice: SpeechSynthesisVoice;
  label: string;
  lang: string;
}

export default function TextToAudioClient() {
  // State
  const [text, setText] = useState<string>('');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showFaq, setShowFaq] = useState(false);

  // Refs
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // 音声合成のサポート確認と音声リスト取得
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const supported = 'speechSynthesis' in window;
    setIsSupported(supported);

    if (!supported) {
      setError(new Error('Text-to-speech is not supported in your browser. Please try Chrome, Edge, or Safari.'));
      return;
    }

    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      
      if (availableVoices.length > 0) {
        const voiceList: Voice[] = availableVoices.map(v => ({
          voice: v,
          label: `${v.name} (${v.lang})`,
          lang: v.lang,
        }));

        // 言語でソート（英語、日本語を優先）
        voiceList.sort((a, b) => {
          const priority = ['en', 'ja', 'zh', 'ko', 'es', 'fr', 'de'];
          const aLang = a.lang.split('-')[0];
          const bLang = b.lang.split('-')[0];
          const aIndex = priority.indexOf(aLang);
          const bIndex = priority.indexOf(bLang);
          
          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
          return a.label.localeCompare(b.label);
        });

        setVoices(voiceList);

        // デフォルト音声を設定
        if (!selectedVoice && voiceList.length > 0) {
          // 英語のデフォルト音声を探す
          const defaultVoice = voiceList.find(v => v.voice.default) 
            || voiceList.find(v => v.lang.startsWith('en'))
            || voiceList[0];
          setSelectedVoice(defaultVoice.voice.name);
        }
      }
    };

    // 音声リストの読み込み（非同期の場合がある）
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoice]);

  // 読み上げ開始
  const handleSpeak = useCallback(() => {
    if (!text.trim() || !isSupported) return;

    // 既存の読み上げを停止
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // 音声を設定
    const voice = voices.find(v => v.voice.name === selectedVoice);
    if (voice) {
      utterance.voice = voice.voice;
    }

    utterance.rate = rate;
    utterance.pitch = pitch;

    // イベントハンドラ
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled') {
        setError(new Error(`Speech error: ${e.error}`));
      }
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [text, voices, selectedVoice, rate, pitch, isSupported]);

  // 一時停止
  const handlePause = useCallback(() => {
    if (isSpeaking && !isPaused) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isSpeaking, isPaused]);

  // 再開
  const handleResume = useCallback(() => {
    if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isPaused]);

  // 停止
  const handleStop = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  // サンプルテキスト
  const sampleTexts = [
    'Hello! This is a text-to-speech demonstration.',
    'The quick brown fox jumps over the lazy dog.',
    'Welcome to our audio tools. We hope you find them useful!',
  ];

  const handleSampleText = (sample: string) => {
    setText(sample);
  };

  // 文字数カウント
  const charCount = text.length;
  const maxChars = 5000;

  // FAQ Data
  const faqs = [
    {
      q: 'What voices are available?',
      a: 'Available voices depend on your browser and operating system. Chrome typically has the most voices. The tool shows all voices your browser supports.',
    },
    {
      q: 'Can I download the audio?',
      a: 'Due to browser limitations, direct download is not available. To save the audio, you can use screen recording software or system audio recording tools.',
    },
    {
      q: 'Why does my voice sound different?',
      a: 'Voice quality varies by browser and OS. For best results, try Chrome on desktop. Mobile browsers may have fewer or different voices.',
    },
    {
      q: 'Is my text sent to a server?',
      a: 'No. Text-to-speech is processed entirely by your browser using Web Speech API. Your text never leaves your device.',
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm font-medium">
            <Volume2 className="w-4 h-4" />
            Audio Create
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Text to Audio
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Convert text to natural-sounding speech. Choose from multiple voices and languages.
            100% private, processed in your browser.
          </p>
        </div>

        {/* Main Tool Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 space-y-6">
          {/* Browser Support Warning */}
          {isSupported === false && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                <div>
                  <p className="font-medium text-red-400">Browser Not Supported</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Text-to-speech is not supported in your browser. Please try Chrome, Edge, or Safari.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Text Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm text-gray-400 font-medium">Enter Text</label>
              <span className={`text-xs ${charCount > maxChars ? 'text-red-400' : 'text-gray-500'}`}>
                {charCount} / {maxChars}
              </span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, maxChars))}
              placeholder="Type or paste your text here..."
              disabled={!isSupported}
              className="w-full h-40 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl
                text-white placeholder-gray-500 resize-none
                focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50
                disabled:opacity-50"
            />
          </div>

          {/* Sample Texts */}
          <div className="space-y-2">
            <label className="block text-sm text-gray-400 font-medium">Sample Texts</label>
            <div className="flex flex-wrap gap-2">
              {sampleTexts.map((sample, i) => (
                <button
                  key={i}
                  onClick={() => handleSampleText(sample)}
                  disabled={!isSupported || isSpeaking}
                  className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors disabled:opacity-50"
                >
                  Sample {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Settings Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4" />
            Voice Settings
            {showSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Voice Settings */}
          {showSettings && (
            <div className="space-y-4 p-4 bg-gray-900/50 rounded-xl">
              {/* Voice Selection */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-400 font-medium">Voice</label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  disabled={!isSupported || isSpeaking}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg
                    text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50
                    disabled:opacity-50"
                >
                  {voices.length === 0 ? (
                    <option>Loading voices...</option>
                  ) : (
                    voices.map((v) => (
                      <option key={v.voice.name} value={v.voice.name}>
                        {v.label}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Speed/Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-400 font-medium">Speed</label>
                  <span className="text-pink-400 font-mono">{rate.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  disabled={!isSupported || isSpeaking}
                  className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-pink-500
                    [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Slow (0.5x)</span>
                  <span>Fast (2x)</span>
                </div>
              </div>

              {/* Pitch */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-400 font-medium">Pitch</label>
                  <span className="text-pink-400 font-mono">{pitch.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(Number(e.target.value))}
                  disabled={!isSupported || isSpeaking}
                  className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-pink-500
                    [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Low (0.5)</span>
                  <span>High (2)</span>
                </div>
              </div>
            </div>
          )}

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-4">
            {!isSpeaking ? (
              <button
                onClick={handleSpeak}
                disabled={!isSupported || !text.trim()}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 
                  hover:from-pink-600 hover:to-rose-600
                  text-white font-semibold rounded-xl transition-all
                  shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-5 h-5" />
                Speak
              </button>
            ) : (
              <>
                {isPaused ? (
                  <button
                    onClick={handleResume}
                    className="p-4 bg-green-600 hover:bg-green-700 rounded-full transition-colors"
                  >
                    <Play className="w-6 h-6 text-white" />
                  </button>
                ) : (
                  <button
                    onClick={handlePause}
                    className="p-4 bg-yellow-600 hover:bg-yellow-700 rounded-full transition-colors"
                  >
                    <Pause className="w-6 h-6 text-white" />
                  </button>
                )}
                <button
                  onClick={handleStop}
                  className="p-4 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                >
                  <Square className="w-6 h-6 text-white" />
                </button>
              </>
            )}
          </div>

          {/* Speaking Indicator */}
          {isSpeaking && (
            <div className="flex items-center justify-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
              <span className="text-gray-400 text-sm">
                {isPaused ? 'Paused' : 'Speaking...'}
              </span>
            </div>
          )}

          {/* Download Note */}
          <div className="p-4 bg-gray-900/50 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium text-gray-300">Download Not Available</p>
                <p className="text-sm text-gray-400 mt-1">
                  Due to browser limitations, direct audio download is not supported. 
                  To save the speech, use screen recording software or system audio capture.
                </p>
              </div>
            </div>
          </div>

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
                Your text is processed entirely in your browser using Web Speech API. Nothing is sent to any server.
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
                  { title: 'Enter Text', desc: 'Type or paste the text you want to hear.' },
                  { title: 'Choose Voice', desc: 'Select a voice and adjust speed/pitch.' },
                  { title: 'Listen', desc: 'Click Speak to hear your text.' },
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
              { name: 'Voice Transcription', href: '/tools/voice-transcription', desc: 'Speech to text' },
              { name: 'Record Voice', href: '/tools/record-voice', desc: 'Record microphone' },
              { name: 'Audio Converter', href: '/tools/audio-converter', desc: 'Convert audio formats' },
              { name: 'Volume Booster', href: '/tools/volume-booster', desc: 'Make audio louder' },
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
