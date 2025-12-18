// app/tools/voice-transcription/components/TranscriptDisplay.tsx
'use client'

import React, { useState, useMemo } from 'react'
import { Copy, Check, Download, Clock } from 'lucide-react'
import type { TranscriptResult } from '../lib/types'
import { formatTime, formatSRTTime } from '../lib/audio-utils'

interface TranscriptDisplayProps {
  transcript: TranscriptResult
  showTimestamps?: boolean
  onTimestampToggle?: (show: boolean) => void
}

export default function TranscriptDisplay({
  transcript,
  showTimestamps = true,
  onTimestampToggle,
}: TranscriptDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [localShowTimestamps, setLocalShowTimestamps] = useState(showTimestamps)

  // Generate plain text
  const plainText = useMemo(() => {
    if (!localShowTimestamps || !transcript.chunks?.length) {
      return transcript.text
    }
    return transcript.chunks
      .map(chunk => `[${formatTime(chunk.timestamp[0])}] ${chunk.text}`)
      .join('\n')
  }, [transcript, localShowTimestamps])

  // Generate SRT format
  const srtContent = useMemo(() => {
    if (!transcript.chunks?.length) return ''
    
    return transcript.chunks
      .map((chunk, index) => {
        const startTime = formatSRTTime(chunk.timestamp[0])
        const endTime = formatSRTTime(chunk.timestamp[1] || chunk.timestamp[0] + 5)
        return `${index + 1}\n${startTime} --> ${endTime}\n${chunk.text.trim()}\n`
      })
      .join('\n')
  }, [transcript.chunks])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(plainText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownloadTxt = () => {
    const blob = new Blob([plainText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transcript.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadSrt = () => {
    if (!srtContent) return
    const blob = new Blob([srtContent], { type: 'text/srt' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transcript.srt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleTimestampToggle = () => {
    const newValue = !localShowTimestamps
    setLocalShowTimestamps(newValue)
    onTimestampToggle?.(newValue)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">Transcript</h3>
        <div className="flex items-center gap-2">
          {/* Timestamp Toggle */}
          {transcript.chunks?.length > 0 && (
            <button
              onClick={handleTimestampToggle}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors
                ${localShowTimestamps 
                  ? 'bg-cyan-500/20 text-cyan-400' 
                  : 'bg-gray-700 text-gray-400 hover:text-white'
                }`}
            >
              <Clock className="w-4 h-4" />
              Timestamps
            </button>
          )}
          
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 
                     text-gray-300 rounded-lg text-sm transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Transcript Content */}
      <div className="bg-gray-900/50 rounded-xl p-4 max-h-[400px] overflow-y-auto">
        {localShowTimestamps && transcript.chunks?.length ? (
          <div className="space-y-3">
            {transcript.chunks.map((chunk, index) => (
              <div key={index} className="flex gap-3">
                <span className="text-cyan-400 font-mono text-sm whitespace-nowrap">
                  [{formatTime(chunk.timestamp[0])}]
                </span>
                <span className="text-gray-200">{chunk.text}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-200 whitespace-pre-wrap">{transcript.text}</p>
        )}
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
        <span>{transcript.text.split(/\s+/).length} words</span>
        <span>{transcript.text.length} characters</span>
        {transcript.chunks?.length && (
          <span>{transcript.chunks.length} segments</span>
        )}
        {transcript.language && (
          <span>Detected: {transcript.language}</span>
        )}
      </div>

      {/* Download Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleDownloadTxt}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 
                   text-white rounded-lg text-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          Download TXT
        </button>
        
        {srtContent && (
          <button
            onClick={handleDownloadSrt}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 
                     text-white rounded-lg text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            Download SRT
          </button>
        )}
      </div>
    </div>
  )
}
