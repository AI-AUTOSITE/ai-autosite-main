'use client'

import { useState, useCallback, useMemo } from 'react'
import { Fingerprint, Copy, Check, RefreshCw, Download, Plus, Trash2, Search, Lock, ChevronDown, ChevronUp } from 'lucide-react'

type IdType = 'uuid-v4' | 'uuid-v7' | 'ulid' | 'nanoid'
type FormatType = 'standard' | 'uppercase' | 'no-dashes' | 'compact'
type DownloadFormat = 'txt' | 'csv' | 'json'

interface GeneratedId {
  id: string
  value: string
  timestamp: number
  type: IdType
}

const ID_TYPES = [
  { value: 'uuid-v4', label: 'UUID v4', desc: 'Random (most common)' },
  { value: 'uuid-v7', label: 'UUID v7', desc: 'Time-sortable (RFC 9562)' },
  { value: 'ulid', label: 'ULID', desc: '26 chars, sortable' },
  { value: 'nanoid', label: 'NanoID', desc: '21 chars, URL-safe' },
] as const

const FORMAT_OPTIONS = [
  { value: 'standard', label: 'Standard', short: 'Std' },
  { value: 'uppercase', label: 'UPPERCASE', short: 'UPPER' },
  { value: 'no-dashes', label: 'No Dashes', short: 'NoDash' },
  { value: 'compact', label: 'COMPACT', short: 'COMP' },
] as const

const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
const NANOID_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'

const vibrate = (duration: number = 30) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(duration)
  }
}

// UUID v4 Generator
const generateUUIDv4 = (): string => {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID()
  }
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0'))
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10).join('')}`
}

// UUID v7 Generator (RFC 9562)
const generateUUIDv7 = (): string => {
  const timestamp = BigInt(Date.now())
  const bytes = new Uint8Array(16)

  // 48-bit timestamp
  for (let i = 0; i < 6; i++) {
    bytes[i] = Number((timestamp >> BigInt((5 - i) * 8)) & BigInt(0xff))
  }

  // Version 7 + random
  const randomBytes = crypto.getRandomValues(new Uint8Array(10))
  bytes[6] = 0x70 | (randomBytes[0] & 0x0f)
  bytes[7] = randomBytes[1]
  bytes[8] = 0x80 | (randomBytes[2] & 0x3f)
  for (let i = 9; i < 16; i++) {
    bytes[i] = randomBytes[i - 6]
  }

  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

// ULID Generator
const generateULID = (): string => {
  const timestamp = Date.now()
  const random = crypto.getRandomValues(new Uint8Array(10))

  let ulid = ''
  let t = timestamp
  for (let i = 0; i < 10; i++) {
    ulid = CROCKFORD[t % 32] + ulid
    t = Math.floor(t / 32)
  }

  for (let i = 0; i < 10; i++) {
    ulid += CROCKFORD[random[i] & 31]
    if (i < 6) ulid += CROCKFORD[(random[i] >> 3) & 31]
  }

  return ulid.slice(0, 26)
}

// NanoID Generator
const generateNanoID = (size: number = 21): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(size))
  let id = ''
  for (let i = 0; i < size; i++) {
    id += NANOID_ALPHABET[bytes[i] & 63]
  }
  return id
}

// Format ID
const formatId = (id: string, format: FormatType, type: IdType): string => {
  if (type === 'ulid' || type === 'nanoid') {
    return format === 'uppercase' || format === 'compact' ? id.toUpperCase() : id
  }
  switch (format) {
    case 'uppercase':
      return id.toUpperCase()
    case 'no-dashes':
      return id.replace(/-/g, '')
    case 'compact':
      return id.replace(/-/g, '').toUpperCase()
    default:
      return id
  }
}

// Validate and detect UUID
const validateUUID = (input: string): { valid: boolean; version?: string; variant?: string; timestamp?: Date } => {
  const cleaned = input.trim().toLowerCase()
  const uuidRegex = /^[0-9a-f]{8}-?[0-9a-f]{4}-?([1-7])[0-9a-f]{3}-?([89ab])[0-9a-f]{3}-?[0-9a-f]{12}$/i
  const match = cleaned.replace(/-/g, '').match(/^([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12})$/i)

  if (!match) {
    // Check ULID
    if (/^[0-9A-HJKMNP-TV-Z]{26}$/i.test(cleaned)) {
      return { valid: true, version: 'ULID' }
    }
    // Check NanoID (rough)
    if (/^[A-Za-z0-9_-]{21}$/.test(cleaned)) {
      return { valid: true, version: 'NanoID' }
    }
    return { valid: false }
  }

  const formatted = `${match[1]}-${match[2]}-${match[3]}-${match[4]}-${match[5]}`
  const versionChar = match[3][0]
  const variantChar = match[4][0]

  const version = `v${versionChar}`
  const variant = ['8', '9', 'a', 'b'].includes(variantChar) ? 'RFC 4122' : 'Other'

  let timestamp: Date | undefined

  // Extract timestamp from v7
  if (versionChar === '7') {
    const timestampHex = formatted.replace(/-/g, '').slice(0, 12)
    const ms = parseInt(timestampHex, 16)
    timestamp = new Date(ms)
  }

  // Extract timestamp from v1
  if (versionChar === '1') {
    const timeLow = formatted.slice(0, 8)
    const timeMid = formatted.slice(9, 13)
    const timeHigh = formatted.slice(15, 18)
    const timestamp100ns = BigInt(`0x${timeHigh}${timeMid}${timeLow}`)
    const unixMs = Number((timestamp100ns - BigInt('122192928000000000')) / BigInt(10000))
    if (unixMs > 0 && unixMs < Date.now() + 86400000 * 365 * 100) {
      timestamp = new Date(unixMs)
    }
  }

  return { valid: true, version, variant, timestamp }
}

export default function UuidGeneratorClient() {
  const [ids, setIds] = useState<GeneratedId[]>([])
  const [idType, setIdType] = useState<IdType>('uuid-v4')
  const [format, setFormat] = useState<FormatType>('standard')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)
  const [bulkCount, setBulkCount] = useState(10)
  const [nanoIdSize, setNanoIdSize] = useState(21)
  
  // Validator
  const [showValidator, setShowValidator] = useState(false)
  const [validateInput, setValidateInput] = useState('')
  const [validationResult, setValidationResult] = useState<ReturnType<typeof validateUUID> | null>(null)

  const generateId = useCallback((): string => {
    switch (idType) {
      case 'uuid-v7':
        return generateUUIDv7()
      case 'ulid':
        return generateULID()
      case 'nanoid':
        return generateNanoID(nanoIdSize)
      default:
        return generateUUIDv4()
    }
  }, [idType, nanoIdSize])

  const generateSingle = () => {
    const rawId = generateId()
    const newId: GeneratedId = {
      id: rawId,
      value: formatId(rawId, format, idType),
      timestamp: Date.now(),
      type: idType,
    }
    setIds([newId, ...ids].slice(0, 100))
    vibrate(30)
  }

  const generateBulk = () => {
    const newIds: GeneratedId[] = []
    for (let i = 0; i < bulkCount; i++) {
      const rawId = generateId()
      newIds.push({
        id: rawId,
        value: formatId(rawId, format, idType),
        timestamp: Date.now() + i,
        type: idType,
      })
    }
    setIds([...newIds, ...ids].slice(0, 100))
    vibrate(30)
  }

  const clearAll = () => {
    setIds([])
    setCopiedIndex(null)
    setCopiedAll(false)
    vibrate(30)
  }

  const regenerateOne = (index: number) => {
    const newIds = [...ids]
    const rawId = generateId()
    newIds[index] = {
      id: rawId,
      value: formatId(rawId, format, idType),
      timestamp: Date.now(),
      type: idType,
    }
    setIds(newIds)
    vibrate(30)
  }

  const copyId = async (index: number) => {
    await navigator.clipboard.writeText(ids[index].value)
    vibrate(30)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const copyAll = async () => {
    const allIds = ids.map((u) => u.value).join('\n')
    await navigator.clipboard.writeText(allIds)
    vibrate(30)
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }

  const downloadIds = (downloadFormat: DownloadFormat) => {
    let content: string
    let mimeType: string
    let extension: string

    switch (downloadFormat) {
      case 'csv':
        content = 'Type,ID\n' + ids.map((u) => `${u.type},${u.value}`).join('\n')
        mimeType = 'text/csv'
        extension = 'csv'
        break
      case 'json':
        content = JSON.stringify(ids.map((u) => ({ type: u.type, id: u.value })), null, 2)
        mimeType = 'application/json'
        extension = 'json'
        break
      default:
        content = ids.map((u) => u.value).join('\n')
        mimeType = 'text/plain'
        extension = 'txt'
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ids-${idType}-${Date.now()}.${extension}`
    link.click()
    URL.revokeObjectURL(url)
    vibrate(30)
  }

  const updateFormat = (newFormat: FormatType) => {
    setFormat(newFormat)
    if (ids.length > 0) {
      const updatedIds = ids.map((item) => ({
        ...item,
        value: formatId(item.id, newFormat, item.type),
      }))
      setIds(updatedIds)
    }
    vibrate(30)
  }

  const handleValidate = () => {
    const result = validateUUID(validateInput)
    setValidationResult(result)
  }

  const latestId = ids[0]

  const idTypeInfo = useMemo(() => {
    switch (idType) {
      case 'uuid-v7':
        return { emoji: '⏱️', bits: '48-bit time + 74-bit random', chars: 36 }
      case 'ulid':
        return { emoji: '📊', bits: '48-bit time + 80-bit random', chars: 26 }
      case 'nanoid':
        return { emoji: '🔗', bits: `${nanoIdSize * 6}-bit random`, chars: nanoIdSize }
      default:
        return { emoji: '🎲', bits: '122-bit random', chars: 36 }
    }
  }, [idType, nanoIdSize])

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Privacy Badge */}
      <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
        <Lock className="w-4 h-4 text-green-400 flex-shrink-0" />
        <p className="text-green-400 text-xs">
          <span className="font-medium">100% Private</span> — All IDs generated locally in your browser
        </p>
      </div>

      {/* Big Display */}
      {latestId && (
        <div className="text-center mb-6">
          <div className="text-xs text-gray-500 mb-2">Latest {ID_TYPES.find((t) => t.value === latestId.type)?.label}</div>
          <div className="relative group">
            <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold text-cyan-400 break-all px-4">
              {latestId.value}
            </div>
            <button
              onClick={() => copyId(0)}
              className={`min-h-[44px] min-w-[44px] absolute -right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                copiedIndex === 0 ? 'bg-green-500 text-white' : 'bg-white/10 text-gray-400 opacity-0 group-hover:opacity-100'
              }`}
            >
              {copiedIndex === 0 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {ids.length} ID{ids.length !== 1 ? 's' : ''} generated
          </div>
        </div>
      )}

      {/* ID Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {ID_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => {
              setIdType(type.value as IdType)
              vibrate(30)
            }}
            className={`p-3 rounded-xl text-left transition-all ${
              idType === type.value
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <div className="font-medium text-sm">{type.label}</div>
            <div className={`text-xs mt-0.5 ${idType === type.value ? 'text-white/70' : 'text-gray-500'}`}>
              {type.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={generateSingle}
          className="min-h-[48px] py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl 
                   font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Fingerprint className="w-5 h-5" />
          Generate
        </button>

        <button
          onClick={generateBulk}
          className="min-h-[48px] py-4 bg-white/5 text-gray-300 rounded-xl font-medium 
                   hover:bg-white/10 transition-all flex items-center justify-center gap-2 border border-white/10"
        >
          <Plus className="w-5 h-5" />
          Generate {bulkCount}
        </button>
      </div>

      {/* Settings */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-4">
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Format Selector */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Format</label>
            <div className="grid grid-cols-4 gap-2">
              {FORMAT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormat(option.value as FormatType)}
                  className={`min-h-[44px] px-2 py-2.5 rounded-lg text-[11px] font-medium transition-all ${
                    format === option.value
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {option.short}
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Count / NanoID Size */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              {idType === 'nanoid' ? 'NanoID Length' : 'Bulk Count'}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {idType === 'nanoid' ? (
                [12, 16, 21, 32].map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setNanoIdSize(size)
                      vibrate(30)
                    }}
                    className={`min-h-[44px] py-2 rounded-lg text-sm font-medium transition-all ${
                      nanoIdSize === size
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {size}
                  </button>
                ))
              ) : (
                [10, 25, 50, 100].map((count) => (
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
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Validator Section */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 mb-4">
        <button
          onClick={() => setShowValidator(!showValidator)}
          className="w-full p-4 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <span className="text-white font-medium">Validate & Decode</span>
          </div>
          {showValidator ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        
        {showValidator && (
          <div className="px-4 pb-4 border-t border-white/10 pt-4">
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={validateInput}
                onChange={(e) => setValidateInput(e.target.value)}
                placeholder="Paste UUID, ULID, or NanoID..."
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-mono text-sm
                         focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={handleValidate}
                className="px-4 py-3 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-all"
              >
                Check
              </button>
            </div>
            
            {validationResult && (
              <div className={`p-3 rounded-lg ${validationResult.valid ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                {validationResult.valid ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium">Valid {validationResult.version}</span>
                    </div>
                    {validationResult.variant && (
                      <div className="text-xs text-gray-400">Variant: {validationResult.variant}</div>
                    )}
                    {validationResult.timestamp && (
                      <div className="text-xs text-cyan-400">
                        Timestamp: {validationResult.timestamp.toISOString()}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-400">
                    <span>❌</span>
                    <span>Invalid format</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ID List */}
      {ids.length > 0 && (
        <>
          {/* Actions Bar */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={copyAll}
              className={`min-h-[44px] flex-1 px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                copiedAll ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedAll ? 'Copied!' : 'Copy All'}
            </button>

            <div className="flex gap-1">
              {(['txt', 'csv', 'json'] as DownloadFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => downloadIds(fmt)}
                  className="min-h-[44px] px-3 py-2.5 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all text-xs uppercase"
                >
                  {fmt}
                </button>
              ))}
            </div>

            <button
              onClick={clearAll}
              className="min-h-[44px] min-w-[44px] px-3 py-2.5 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 max-h-80 overflow-y-auto">
            <div className="space-y-1">
              {ids.map((item, index) => (
                <div
                  key={item.timestamp}
                  className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all"
                >
                  <span className="text-gray-600 text-xs w-6">{index + 1}</span>
                  <span className="text-xs text-gray-500 w-16">{ID_TYPES.find((t) => t.value === item.type)?.label}</span>
                  <code className="flex-1 text-cyan-400 font-mono text-xs sm:text-sm break-all">
                    {item.value}
                  </code>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => regenerateOne(index)}
                      className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-white/10"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => copyId(index)}
                      className={`p-1.5 rounded transition-all ${
                        copiedIndex === index ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {copiedIndex === index ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
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
          <div className="text-lg mb-1">{idTypeInfo.emoji}</div>
          <div className="text-xs text-gray-400">{idTypeInfo.bits}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">🔒</div>
          <div className="text-xs text-gray-400">Crypto secure</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">📏</div>
          <div className="text-xs text-gray-400">{idTypeInfo.chars} chars</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">⚡</div>
          <div className="text-xs text-gray-400">{idType === 'uuid-v7' ? 'Time-sortable' : idType === 'ulid' ? 'Sortable' : 'Random'}</div>
        </div>
      </div>
    </div>
  )
}