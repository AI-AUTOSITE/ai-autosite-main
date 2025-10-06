'use client'

import { useState, useEffect, useCallback } from 'react'
import { Type, Copy, Check, Trash2, Clock, Hash, AlignLeft, BookOpen } from 'lucide-react'

interface TextStats {
  characters: number
  charactersNoSpace: number
  words: number
  lines: number
  paragraphs: number
  sentences: number
  readingTime: number
}

export default function TextCounterClient() {
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)

  // Calculate all statistics
  const calculateStats = useCallback((input: string): TextStats => {
    // Characters
    const characters = input.length
    const charactersNoSpace = input.replace(/\s/g, '').length

    // Words
    const words = input.trim() === '' ? 0 : input.trim().split(/\s+/).length

    // Lines
    const lines = input === '' ? 0 : input.split('\n').length

    // Paragraphs (separated by double line breaks)
    const paragraphs =
      input.trim() === ''
        ? 0
        : input
            .trim()
            .split(/\n\s*\n/)
            .filter((p) => p.trim()).length || 1

    // Sentences
    const sentences = input.trim() === '' ? 0 : input.split(/[.!?]+/).filter((s) => s.trim()).length

    // Reading time (average 200 words per minute)
    const readingTime = Math.ceil(words / 200)

    return {
      characters,
      charactersNoSpace,
      words,
      lines,
      paragraphs,
      sentences,
      readingTime,
    }
  }, [])

  const stats = calculateStats(text)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text')
    }
  }

  const handleClear = () => {
    setText('')
  }

  // Format numbers with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString()
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Main Stats Cards - Tool First */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
          <BookOpen className="w-5 h-5 text-cyan-400 mb-2" />
          <p className="text-2xl font-bold text-white">{formatNumber(stats.words)}</p>
          <p className="text-xs text-gray-400">Words</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
          <Hash className="w-5 h-5 text-cyan-400 mb-2" />
          <p className="text-2xl font-bold text-white">{formatNumber(stats.characters)}</p>
          <p className="text-xs text-gray-400">Characters</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
          <AlignLeft className="w-5 h-5 text-cyan-400 mb-2" />
          <p className="text-2xl font-bold text-white">{formatNumber(stats.lines)}</p>
          <p className="text-xs text-gray-400">Lines</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
          <Clock className="w-5 h-5 text-cyan-400 mb-2" />
          <p className="text-2xl font-bold text-white">{stats.readingTime}</p>
          <p className="text-xs text-gray-400">Min read</p>
        </div>
      </div>

      {/* Text Area */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-medium">Enter Text</h3>
          <span className="text-sm text-gray-400">
            {formatNumber(stats.charactersNoSpace)} without spaces
          </span>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste text..."
          className="w-full h-80 p-4 bg-white/5 border border-white/10 rounded-xl 
                   text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 
                   transition-colors resize-none"
          spellCheck={false}
        />

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg 
                     hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
          <button
            onClick={handleCopy}
            disabled={!text}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 
                      disabled:opacity-50 disabled:cursor-not-allowed ${
                        copied
                          ? 'bg-green-500 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 mb-6">
        <h3 className="text-white font-medium mb-3">Detailed Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Sentences</span>
            <span className="text-white font-medium">{formatNumber(stats.sentences)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Paragraphs</span>
            <span className="text-white font-medium">{formatNumber(stats.paragraphs)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Characters (no spaces)</span>
            <span className="text-white font-medium">{formatNumber(stats.charactersNoSpace)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Average word length</span>
            <span className="text-white font-medium">
              {stats.words > 0 ? (stats.charactersNoSpace / stats.words).toFixed(1) : '0'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Words per sentence</span>
            <span className="text-white font-medium">
              {stats.sentences > 0 ? (stats.words / stats.sentences).toFixed(1) : '0'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Reading level</span>
            <span className="text-white font-medium">
              {stats.words / stats.sentences > 20
                ? 'Advanced'
                : stats.words / stats.sentences > 15
                  ? 'Intermediate'
                  : 'Basic'}
            </span>
          </div>
        </div>
      </div>

      {/* Common Limits Reference */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
        <h3 className="text-white font-medium mb-3">Platform Limits</h3>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-300">Twitter/X</span>
              <span className="text-xs text-gray-400">
                {stats.characters}/280{' '}
                {stats.characters <= 280 ? '✓' : `(${stats.characters - 280} over)`}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  stats.characters <= 280 ? 'bg-green-400' : 'bg-red-400'
                }`}
                style={{ width: `${Math.min(100, (stats.characters / 280) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-300">SMS</span>
              <span className="text-xs text-gray-400">
                {stats.characters}/160{' '}
                {stats.characters <= 160 ? '✓' : `(${Math.ceil(stats.characters / 160)} messages)`}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  stats.characters <= 160 ? 'bg-green-400' : 'bg-yellow-400'
                }`}
                style={{ width: `${Math.min(100, (stats.characters / 160) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-300">Meta Description</span>
              <span className="text-xs text-gray-400">
                {stats.characters}/155{' '}
                {stats.characters <= 155 ? '✓' : `(${stats.characters - 155} over)`}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  stats.characters <= 155 ? 'bg-green-400' : 'bg-red-400'
                }`}
                style={{ width: `${Math.min(100, (stats.characters / 155) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-300">LinkedIn Post</span>
              <span className="text-xs text-gray-400">
                {stats.characters}/3000{' '}
                {stats.characters <= 3000 ? '✓' : `(${stats.characters - 3000} over)`}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-green-400 transition-all"
                style={{ width: `${Math.min(100, (stats.characters / 3000) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
