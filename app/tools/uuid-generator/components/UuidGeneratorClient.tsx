'use client'

import { useState } from 'react'
import { Fingerprint, Copy, Check, RefreshCw, Download, Plus, Trash2 } from 'lucide-react'

type FormatType = 'standard' | 'uppercase' | 'no-dashes' | 'compact'

interface UUID {
  id: string
  value: string
  timestamp: number
}

const formatOptions = [
  { value: 'standard', label: 'Standard', short: 'Std' },
  { value: 'uppercase', label: 'UPPERCASE', short: 'UPPER' },
  { value: 'no-dashes', label: 'No Dashes', short: 'NoDash' },
  { value: 'compact', label: 'COMPACT', short: 'COMP' },
] as const

export default function UuidGeneratorClient() {
  const [uuids, setUuids] = useState<UUID[]>([])
  const [format, setFormat] = useState<FormatType>('standard')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)
  const [bulkCount, setBulkCount] = useState(5)

  // Vibration helper
  const vibrate = (duration: number = 30) => {
    if (navigator.vibrate) {
      navigator.vibrate(duration)
    }
  }

  // Generate UUID v4
  const generateUUID = (): string => {
    if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
      return window.crypto.randomUUID()
    }

    // Fallback
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  // Format UUID
  const formatUUID = (uuid: string, formatType: FormatType): string => {
    switch (formatType) {
      case 'uppercase':
        return uuid.toUpperCase()
      case 'no-dashes':
        return uuid.replace(/-/g, '')
      case 'compact':
        return uuid.replace(/-/g, '').toUpperCase()
      default:
        return uuid
    }
  }

  // Generate single UUID
  const generateSingle = () => {
    const rawUuid = generateUUID()
    const newUuid: UUID = {
      id: rawUuid,
      value: formatUUID(rawUuid, format),
      timestamp: Date.now(),
    }

    setUuids([newUuid, ...uuids].slice(0, 50))
    vibrate(30) // Generate feedback
  }

  // Generate bulk
  const generateBulk = () => {
    const newUuids: UUID[] = []
    for (let i = 0; i < bulkCount; i++) {
      const rawUuid = generateUUID()
      newUuids.push({
        id: rawUuid,
        value: formatUUID(rawUuid, format),
        timestamp: Date.now() + i,
      })
    }
    setUuids([...newUuids, ...uuids].slice(0, 50))
    vibrate(30) // Bulk generate feedback
  }

  // Clear all
  const clearAll = () => {
    setUuids([])
    setCopiedIndex(null)
    setCopiedAll(false)
    vibrate(30) // Clear feedback
  }

  // Regenerate one
  const regenerateOne = (index: number) => {
    const newUuids = [...uuids]
    const rawUuid = generateUUID()
    newUuids[index] = {
      id: rawUuid,
      value: formatUUID(rawUuid, format),
      timestamp: Date.now(),
    }
    setUuids(newUuids)
    vibrate(30) // Regenerate feedback
  }

  // Copy single UUID
  const copyUUID = async (index: number) => {
    await navigator.clipboard.writeText(uuids[index].value)
    vibrate(30) // Copy feedback
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  // Copy all
  const copyAll = async () => {
    const allUuids = uuids.map((u) => u.value).join('\n')
    await navigator.clipboard.writeText(allUuids)
    vibrate(30) // Copy all feedback
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }

  // Download
  const downloadUUIDs = () => {
    const content = uuids.map((u) => u.value).join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `uuids-${format}-${Date.now()}.txt`
    link.click()
    URL.revokeObjectURL(url)
    vibrate(30) // Download feedback
  }

  // Update format for existing UUIDs
  const updateFormat = (newFormat: FormatType) => {
    setFormat(newFormat)
    if (uuids.length > 0) {
      const updatedUuids = uuids.map((uuid) => ({
        ...uuid,
        value: formatUUID(uuid.id, newFormat),
      }))
      setUuids(updatedUuids)
    }
    vibrate(30) // Format change feedback
  }

  // Latest UUID for big display
  const latestUuid = uuids[0]

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Big Display */}
      {latestUuid && (
        <div className="text-center mb-8">
          <div className="text-xs text-gray-500 mb-2">Latest UUID</div>
          <div className="relative group">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-mono font-bold text-cyan-400 break-all px-4">
              {latestUuid.value}
            </div>
            <button
              onClick={() => copyUUID(0)}
              className={`min-h-[44px] min-w-[44px] absolute -right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                copiedIndex === 0
                  ? 'bg-green-500 text-white'
                  : 'bg-white/10 text-gray-400 opacity-0 group-hover:opacity-100'
              }`}
            >
              {copiedIndex === 0 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {uuids.length} UUID{uuids.length !== 1 ? 's' : ''} generated
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={generateSingle}
          className="min-h-[44px] py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl 
                   font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Fingerprint className="w-5 h-5" />
          Generate UUID
        </button>

        <button
          onClick={generateBulk}
          className="min-h-[44px] py-4 bg-white/5 text-gray-300 rounded-xl font-medium 
                   hover:bg-white/10 transition-all flex items-center justify-center gap-2 border border-white/10"
        >
          <Plus className="w-5 h-5" />
          Generate {bulkCount}
        </button>
      </div>

      {/* Settings */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Format Selector */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Format</label>
            <div className="grid grid-cols-4 gap-2">
              {formatOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormat(option.value as FormatType)}
                  className={`min-h-[44px] px-2 py-2.5 rounded-lg text-[11px] sm:text-xs font-medium transition-all ${
                    format === option.value
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                  title={option.label}
                >
                  {option.short}
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Count */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Bulk Count</label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 20, 50].map((count) => (
                <button
                  key={count}
                  onClick={() => {
                    setBulkCount(count)
                    vibrate(30)
                  }}
                  className={`min-h-[44px] py-2 rounded-lg text-sm font-medium transition-all ${
                    bulkCount === count
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* UUID List */}
      {uuids.length > 0 && (
        <>
          {/* Actions Bar */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={copyAll}
              className={`min-h-[44px] flex-1 px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                copiedAll ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedAll ? 'Copied!' : 'Copy All'}
            </button>

            <button
              onClick={downloadUUIDs}
              className="min-h-[44px] min-w-[44px] px-4 py-2.5 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={clearAll}
              className="min-h-[44px] min-w-[44px] px-4 py-2.5 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 max-h-96 overflow-y-auto">
            <div className="space-y-1">
              {uuids.map((uuid, index) => (
                <div
                  key={uuid.timestamp}
                  className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all"
                >
                  <span className="text-gray-600 text-xs w-6">{index + 1}</span>
                  <code className="flex-1 text-cyan-400 font-mono text-xs sm:text-sm break-all">
                    {uuid.value}
                  </code>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => regenerateOne(index)}
                      className="min-h-[44px] min-w-[44px] p-1.5 text-gray-400 hover:text-white rounded hover:bg-white/10"
                      title="Regenerate"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => copyUUID(index)}
                      className={`min-h-[44px] min-w-[44px] p-1.5 rounded transition-all ${
                        copiedIndex === index
                          ? 'bg-green-500 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                      title="Copy"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Quick Facts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">🎲</div>
          <div className="text-xs text-gray-400">122-bit random</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">🔒</div>
          <div className="text-xs text-gray-400">Crypto secure</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">♾️</div>
          <div className="text-xs text-gray-400">3.4×10³⁸ IDs</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">⚡</div>
          <div className="text-xs text-gray-400">Version 4</div>
        </div>
      </div>
    </div>
  )
}