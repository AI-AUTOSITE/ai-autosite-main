'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import {
  Hash,
  FileText,
  Upload,
  Copy,
  Check,
  AlertTriangle,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Key,
  Search,
  Trash2,
  Download,
  Lock,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Info,
  Zap,
  HelpCircle
} from 'lucide-react'

// ============================================
// Types
// ============================================
type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'
type Mode = 'text' | 'file' | 'verify' | 'identify'

interface HashResult {
  algorithm: HashAlgorithm
  hash: string
  isSecure: boolean
  warning?: string
}

interface FileHashProgress {
  progress: number
  fileName: string
  fileSize: number
}

// ============================================
// Algorithm Metadata
// ============================================
const ALGORITHMS: { id: HashAlgorithm; name: string; bits: number; isSecure: boolean; warning?: string }[] = [
  { id: 'MD5', name: 'MD5', bits: 128, isSecure: false, warning: 'Cryptographically broken. Do NOT use for security.' },
  { id: 'SHA-1', name: 'SHA-1', bits: 160, isSecure: false, warning: 'Deprecated by NIST (2011). Use SHA-256+.' },
  { id: 'SHA-256', name: 'SHA-256', bits: 256, isSecure: true },
  { id: 'SHA-384', name: 'SHA-384', bits: 384, isSecure: true },
  { id: 'SHA-512', name: 'SHA-512', bits: 512, isSecure: true },
]

// Hash type identification patterns
const HASH_PATTERNS: { algorithm: string; length: number; pattern: RegExp; isSecure: boolean }[] = [
  { algorithm: 'MD5', length: 32, pattern: /^[a-f0-9]{32}$/i, isSecure: false },
  { algorithm: 'SHA-1', length: 40, pattern: /^[a-f0-9]{40}$/i, isSecure: false },
  { algorithm: 'SHA-256', length: 64, pattern: /^[a-f0-9]{64}$/i, isSecure: true },
  { algorithm: 'SHA-384', length: 96, pattern: /^[a-f0-9]{96}$/i, isSecure: true },
  { algorithm: 'SHA-512', length: 128, pattern: /^[a-f0-9]{128}$/i, isSecure: true },
  { algorithm: 'bcrypt', length: 60, pattern: /^\$2[aby]?\$\d{1,2}\$[./A-Za-z0-9]{53}$/, isSecure: true },
  { algorithm: 'Argon2', length: 0, pattern: /^\$argon2(id|i|d)\$/, isSecure: true },
]

// ============================================
// MD5 Implementation (Pure JS - for legacy support only)
// ============================================
function md5(str: string): string {
  function rotateLeft(x: number, n: number): number {
    return (x << n) | (x >>> (32 - n))
  }

  function addUnsigned(x: number, y: number): number {
    const lsw = (x & 0xffff) + (y & 0xffff)
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xffff)
  }

  function F(x: number, y: number, z: number): number { return (x & y) | (~x & z) }
  function G(x: number, y: number, z: number): number { return (x & z) | (y & ~z) }
  function H(x: number, y: number, z: number): number { return x ^ y ^ z }
  function I(x: number, y: number, z: number): number { return y ^ (x | ~z) }

  function FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }
  function GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }
  function HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }
  function II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }

  function convertToWordArray(str: string): number[] {
    const lWordCount: number[] = []
    const lMessageLength = str.length
    const lNumberOfWordsTemp1 = lMessageLength + 8
    const lNumberOfWordsTemp2 = (lNumberOfWordsTemp1 - (lNumberOfWordsTemp1 % 64)) / 64
    const lNumberOfWords = (lNumberOfWordsTemp2 + 1) * 16
    
    for (let i = 0; i < lNumberOfWords; i++) {
      lWordCount[i] = 0
    }
    
    let lBytePosition = 0
    let lByteCount = 0
    while (lByteCount < lMessageLength) {
      const lWordIndex = (lByteCount - (lByteCount % 4)) / 4
      lBytePosition = (lByteCount % 4) * 8
      lWordCount[lWordIndex] = lWordCount[lWordIndex] | (str.charCodeAt(lByteCount) << lBytePosition)
      lByteCount++
    }
    const lWordIndex = (lByteCount - (lByteCount % 4)) / 4
    lBytePosition = (lByteCount % 4) * 8
    lWordCount[lWordIndex] = lWordCount[lWordIndex] | (0x80 << lBytePosition)
    lWordCount[lNumberOfWords - 2] = lMessageLength << 3
    lWordCount[lNumberOfWords - 1] = lMessageLength >>> 29
    return lWordCount
  }

  function wordToHex(value: number): string {
    let result = ''
    for (let i = 0; i <= 3; i++) {
      const byte = (value >>> (i * 8)) & 255
      result += ('0' + byte.toString(16)).slice(-2)
    }
    return result
  }

  const x = convertToWordArray(str)
  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476

  const S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21]
  const T = [
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
  ]

  for (let k = 0; k < x.length; k += 16) {
    const AA = a, BB = b, CC = c, DD = d

    a = FF(a, b, c, d, x[k + 0], S[0], T[0])
    d = FF(d, a, b, c, x[k + 1], S[1], T[1])
    c = FF(c, d, a, b, x[k + 2], S[2], T[2])
    b = FF(b, c, d, a, x[k + 3], S[3], T[3])
    a = FF(a, b, c, d, x[k + 4], S[0], T[4])
    d = FF(d, a, b, c, x[k + 5], S[1], T[5])
    c = FF(c, d, a, b, x[k + 6], S[2], T[6])
    b = FF(b, c, d, a, x[k + 7], S[3], T[7])
    a = FF(a, b, c, d, x[k + 8], S[0], T[8])
    d = FF(d, a, b, c, x[k + 9], S[1], T[9])
    c = FF(c, d, a, b, x[k + 10], S[2], T[10])
    b = FF(b, c, d, a, x[k + 11], S[3], T[11])
    a = FF(a, b, c, d, x[k + 12], S[0], T[12])
    d = FF(d, a, b, c, x[k + 13], S[1], T[13])
    c = FF(c, d, a, b, x[k + 14], S[2], T[14])
    b = FF(b, c, d, a, x[k + 15], S[3], T[15])

    a = GG(a, b, c, d, x[k + 1], S[4], T[16])
    d = GG(d, a, b, c, x[k + 6], S[5], T[17])
    c = GG(c, d, a, b, x[k + 11], S[6], T[18])
    b = GG(b, c, d, a, x[k + 0], S[7], T[19])
    a = GG(a, b, c, d, x[k + 5], S[4], T[20])
    d = GG(d, a, b, c, x[k + 10], S[5], T[21])
    c = GG(c, d, a, b, x[k + 15], S[6], T[22])
    b = GG(b, c, d, a, x[k + 4], S[7], T[23])
    a = GG(a, b, c, d, x[k + 9], S[4], T[24])
    d = GG(d, a, b, c, x[k + 14], S[5], T[25])
    c = GG(c, d, a, b, x[k + 3], S[6], T[26])
    b = GG(b, c, d, a, x[k + 8], S[7], T[27])
    a = GG(a, b, c, d, x[k + 13], S[4], T[28])
    d = GG(d, a, b, c, x[k + 2], S[5], T[29])
    c = GG(c, d, a, b, x[k + 7], S[6], T[30])
    b = GG(b, c, d, a, x[k + 12], S[7], T[31])

    a = HH(a, b, c, d, x[k + 5], S[8], T[32])
    d = HH(d, a, b, c, x[k + 8], S[9], T[33])
    c = HH(c, d, a, b, x[k + 11], S[10], T[34])
    b = HH(b, c, d, a, x[k + 14], S[11], T[35])
    a = HH(a, b, c, d, x[k + 1], S[8], T[36])
    d = HH(d, a, b, c, x[k + 4], S[9], T[37])
    c = HH(c, d, a, b, x[k + 7], S[10], T[38])
    b = HH(b, c, d, a, x[k + 10], S[11], T[39])
    a = HH(a, b, c, d, x[k + 13], S[8], T[40])
    d = HH(d, a, b, c, x[k + 0], S[9], T[41])
    c = HH(c, d, a, b, x[k + 3], S[10], T[42])
    b = HH(b, c, d, a, x[k + 6], S[11], T[43])
    a = HH(a, b, c, d, x[k + 9], S[8], T[44])
    d = HH(d, a, b, c, x[k + 12], S[9], T[45])
    c = HH(c, d, a, b, x[k + 15], S[10], T[46])
    b = HH(b, c, d, a, x[k + 2], S[11], T[47])

    a = II(a, b, c, d, x[k + 0], S[12], T[48])
    d = II(d, a, b, c, x[k + 7], S[13], T[49])
    c = II(c, d, a, b, x[k + 14], S[14], T[50])
    b = II(b, c, d, a, x[k + 5], S[15], T[51])
    a = II(a, b, c, d, x[k + 12], S[12], T[52])
    d = II(d, a, b, c, x[k + 3], S[13], T[53])
    c = II(c, d, a, b, x[k + 10], S[14], T[54])
    b = II(b, c, d, a, x[k + 1], S[15], T[55])
    a = II(a, b, c, d, x[k + 8], S[12], T[56])
    d = II(d, a, b, c, x[k + 15], S[13], T[57])
    c = II(c, d, a, b, x[k + 6], S[14], T[58])
    b = II(b, c, d, a, x[k + 13], S[15], T[59])
    a = II(a, b, c, d, x[k + 4], S[12], T[60])
    d = II(d, a, b, c, x[k + 11], S[13], T[61])
    c = II(c, d, a, b, x[k + 2], S[14], T[62])
    b = II(b, c, d, a, x[k + 9], S[15], T[63])

    a = addUnsigned(a, AA)
    b = addUnsigned(b, BB)
    c = addUnsigned(c, CC)
    d = addUnsigned(d, DD)
  }

  return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)
}

// ============================================
// Hash Functions
// ============================================
async function computeHash(algorithm: HashAlgorithm, data: string | ArrayBuffer): Promise<string> {
  if (algorithm === 'MD5') {
    if (typeof data === 'string') {
      return md5(data)
    } else {
      // For ArrayBuffer, convert to string (simplified - works for small files)
      const decoder = new TextDecoder()
      return md5(decoder.decode(data))
    }
  }

  // Map algorithm names to Web Crypto API names
  const algoMap: Record<string, string> = {
    'SHA-1': 'SHA-1',
    'SHA-256': 'SHA-256',
    'SHA-384': 'SHA-384',
    'SHA-512': 'SHA-512',
  }

  const buffer = typeof data === 'string' ? new TextEncoder().encode(data) : data
  const hashBuffer = await crypto.subtle.digest(algoMap[algorithm], buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function computeHMAC(algorithm: HashAlgorithm, data: string, key: string): Promise<string> {
  if (algorithm === 'MD5') {
    // Simplified HMAC-MD5
    const ipad = key.padEnd(64, '\0').split('').map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ 0x36)).join('')
    const opad = key.padEnd(64, '\0').split('').map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ 0x5c)).join('')
    const inner = md5(ipad + data)
    // Convert hex to binary string
    const innerBinary = inner.match(/.{2}/g)?.map(h => String.fromCharCode(parseInt(h, 16))).join('') || ''
    return md5(opad + innerBinary)
  }

  const algoMap: Record<string, string> = {
    'SHA-1': 'SHA-1',
    'SHA-256': 'SHA-256',
    'SHA-384': 'SHA-384',
    'SHA-512': 'SHA-512',
  }

  const encoder = new TextEncoder()
  const keyData = encoder.encode(key)
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: algoMap[algorithm] },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(data))
  const hashArray = Array.from(new Uint8Array(signature))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// ============================================
// Component
// ============================================
export default function HashGeneratorClient() {
  // State
  const [mode, setMode] = useState<Mode>('text')
  const [input, setInput] = useState('')
  const [hmacKey, setHmacKey] = useState('')
  const [useHmac, setUseHmac] = useState(false)
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<HashAlgorithm[]>(['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'])
  const [results, setResults] = useState<HashResult[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // File hashing state
  const [fileProgress, setFileProgress] = useState<FileHashProgress | null>(null)
  const [fileResults, setFileResults] = useState<HashResult[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Verify mode state
  const [verifyHash, setVerifyHash] = useState('')
  const [verifyInput, setVerifyInput] = useState('')
  const [verifyResult, setVerifyResult] = useState<{ match: boolean; algorithm?: string } | null>(null)
  
  // Identify mode state
  const [identifyInput, setIdentifyInput] = useState('')
  const [identifyResults, setIdentifyResults] = useState<{ algorithm: string; isSecure: boolean }[]>([])

  // Vibration feedback
  const vibrate = useCallback((duration: number = 30) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(duration)
    }
  }, [])

  // Generate hashes for text input
  const generateHashes = useCallback(async () => {
    if (!input.trim()) {
      setResults([])
      return
    }

    setIsProcessing(true)
    vibrate()

    try {
      const newResults: HashResult[] = []
      
      for (const algo of selectedAlgorithms) {
        const algoInfo = ALGORITHMS.find(a => a.id === algo)
        let hash: string
        
        if (useHmac && hmacKey) {
          hash = await computeHMAC(algo, input, hmacKey)
        } else {
          hash = await computeHash(algo, input)
        }
        
        newResults.push({
          algorithm: algo,
          hash,
          isSecure: algoInfo?.isSecure ?? false,
          warning: algoInfo?.warning,
        })
      }
      
      setResults(newResults)
    } catch (error) {
      console.error('Hash generation error:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [input, selectedAlgorithms, useHmac, hmacKey, vibrate])

  // Auto-generate on input change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mode === 'text') {
        generateHashes()
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [input, selectedAlgorithms, useHmac, hmacKey, mode, generateHashes])

  // Handle file selection
  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    setFileProgress({ progress: 0, fileName: file.name, fileSize: file.size })
    setFileResults([])
    vibrate()

    try {
      const buffer = await file.arrayBuffer()
      const newResults: HashResult[] = []

      for (let i = 0; i < selectedAlgorithms.length; i++) {
        const algo = selectedAlgorithms[i]
        const algoInfo = ALGORITHMS.find(a => a.id === algo)
        
        setFileProgress(prev => prev ? {
          ...prev,
          progress: Math.round(((i + 0.5) / selectedAlgorithms.length) * 100)
        } : null)
        
        const hash = await computeHash(algo, buffer)
        
        newResults.push({
          algorithm: algo,
          hash,
          isSecure: algoInfo?.isSecure ?? false,
          warning: algoInfo?.warning,
        })
        
        setFileProgress(prev => prev ? {
          ...prev,
          progress: Math.round(((i + 1) / selectedAlgorithms.length) * 100)
        } : null)
      }

      setFileResults(newResults)
    } catch (error) {
      console.error('File hashing error:', error)
    } finally {
      setIsProcessing(false)
      setFileProgress(null)
    }
  }, [selectedAlgorithms, vibrate])

  // Verify hash
  const handleVerify = useCallback(async () => {
    if (!verifyHash.trim() || !verifyInput.trim()) {
      setVerifyResult(null)
      return
    }

    setIsProcessing(true)
    vibrate()

    try {
      const normalizedHash = verifyHash.trim().toLowerCase()
      
      // Detect algorithm by length
      let detectedAlgo: HashAlgorithm | null = null
      for (const pattern of HASH_PATTERNS) {
        if (pattern.pattern.test(normalizedHash) && ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'].includes(pattern.algorithm)) {
          detectedAlgo = pattern.algorithm as HashAlgorithm
          break
        }
      }

      if (!detectedAlgo) {
        setVerifyResult({ match: false })
        return
      }

      const computedHash = await computeHash(detectedAlgo, verifyInput)
      const match = computedHash.toLowerCase() === normalizedHash

      setVerifyResult({ match, algorithm: detectedAlgo })
    } catch (error) {
      console.error('Verification error:', error)
      setVerifyResult({ match: false })
    } finally {
      setIsProcessing(false)
    }
  }, [verifyHash, verifyInput, vibrate])

  // Identify hash type
  const handleIdentify = useCallback(() => {
    if (!identifyInput.trim()) {
      setIdentifyResults([])
      return
    }

    vibrate()
    const normalized = identifyInput.trim()
    const matches: { algorithm: string; isSecure: boolean }[] = []

    for (const pattern of HASH_PATTERNS) {
      if (pattern.pattern.test(normalized)) {
        matches.push({ algorithm: pattern.algorithm, isSecure: pattern.isSecure })
      }
    }

    setIdentifyResults(matches)
  }, [identifyInput, vibrate])

  // Copy functions
  const copyToClipboard = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      vibrate()
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }, [vibrate])

  const copyAllResults = useCallback(async (resultsToCopy: HashResult[]) => {
    const text = resultsToCopy.map(r => `${r.algorithm}: ${r.hash}`).join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopiedAll(true)
      vibrate()
      setTimeout(() => setCopiedAll(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }, [vibrate])

  // Toggle algorithm selection
  const toggleAlgorithm = useCallback((algo: HashAlgorithm) => {
    vibrate()
    setSelectedAlgorithms(prev => {
      if (prev.includes(algo)) {
        return prev.filter(a => a !== algo)
      } else {
        return [...prev, algo]
      }
    })
  }, [vibrate])

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Render hash results
  const renderResults = (resultsList: HashResult[], prefix: string = '') => (
    <div className="space-y-3">
      {resultsList.map((result, index) => {
        const algoInfo = ALGORITHMS.find(a => a.id === result.algorithm)
        return (
          <div
            key={`${prefix}${result.algorithm}`}
            className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {result.isSecure ? (
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-yellow-400" />
                )}
                <span className="font-semibold text-white">{result.algorithm}</span>
                <span className="text-xs text-gray-400">({algoInfo?.bits} bits)</span>
              </div>
              <button
                onClick={() => copyToClipboard(result.hash, index)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {copiedIndex === index ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
            
            <div className="font-mono text-sm text-cyan-400 break-all bg-black/30 rounded-lg p-3">
              {result.hash}
            </div>
            
            {result.warning && (
              <div className="flex items-start gap-2 mt-2 p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-yellow-400">{result.warning}</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Privacy Badge */}
      <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
        <Lock className="w-4 h-4 text-green-400 flex-shrink-0" />
        <p className="text-green-400 text-xs">
          <span className="font-medium">100% Private</span> — All hashing done locally in your browser
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-2 border border-white/10 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { id: 'text' as Mode, icon: FileText, label: 'Text Hash' },
            { id: 'file' as Mode, icon: Upload, label: 'File Hash' },
            { id: 'verify' as Mode, icon: Search, label: 'Verify' },
            { id: 'identify' as Mode, icon: HelpCircle, label: 'Identify' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => { setMode(id); vibrate() }}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                mode === id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Algorithm Selection */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Select Algorithms</h3>
        <div className="flex flex-wrap gap-2">
          {ALGORITHMS.map(algo => (
            <button
              key={algo.id}
              onClick={() => toggleAlgorithm(algo.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                selectedAlgorithms.includes(algo.id)
                  ? algo.isSecure
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                {algo.isSecure ? (
                  <ShieldCheck className="w-4 h-4" />
                ) : (
                  <ShieldAlert className="w-4 h-4" />
                )}
                {algo.name}
              </button>
            ))}
          </div>
        </div>

        {/* Text Hash Mode */}
        {mode === 'text' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Input Text
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter text to hash..."
                    rows={4}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none"
                  />
                </div>

                {/* HMAC Option */}
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useHmac}
                      onChange={(e) => setUseHmac(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-300">Use HMAC</span>
                  </label>
                  
                  {useHmac && (
                    <input
                      type="text"
                      value={hmacKey}
                      onChange={(e) => setHmacKey(e.target.value)}
                      placeholder="Enter secret key..."
                      className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {useHmac ? 'HMAC Results' : 'Hash Results'}
                  </h3>
                  <button
                    onClick={() => copyAllResults(results)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                      copiedAll
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    Copy All
                  </button>
                </div>
                {renderResults(results)}
              </div>
            )}
          </div>
        )}

        {/* File Hash Mode */}
        {mode === 'file' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="w-full flex flex-col items-center justify-center gap-4 py-12 border-2 border-dashed border-white/20 rounded-xl hover:border-purple-500/50 transition-colors"
              >
                <Upload className="w-12 h-12 text-gray-400" />
                <div className="text-center">
                  <p className="text-white font-medium">Click to select a file</p>
                  <p className="text-sm text-gray-400 mt-1">or drag and drop</p>
                </div>
              </button>

              {/* Progress */}
              {fileProgress && (
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300 truncate">{fileProgress.fileName}</span>
                    <span className="text-gray-400">{formatFileSize(fileProgress.fileSize)}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                      style={{ width: `${fileProgress.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400 text-center">{fileProgress.progress}% complete</p>
                </div>
              )}
            </div>

            {/* File Results */}
            {fileResults.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">File Hash Results</h3>
                  <button
                    onClick={() => copyAllResults(fileResults)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                      copiedAll
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    Copy All
                  </button>
                </div>
                {renderResults(fileResults, 'file-')}
              </div>
            )}
          </div>
        )}

        {/* Verify Mode */}
        {mode === 'verify' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Expected Hash
                </label>
                <input
                  type="text"
                  value={verifyHash}
                  onChange={(e) => setVerifyHash(e.target.value)}
                  placeholder="Paste the hash to verify..."
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Original Text
                </label>
                <textarea
                  value={verifyInput}
                  onChange={(e) => setVerifyInput(e.target.value)}
                  placeholder="Enter the original text..."
                  rows={4}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none"
                />
              </div>

              <button
                onClick={handleVerify}
                disabled={isProcessing || !verifyHash || !verifyInput}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isProcessing ? 'Verifying...' : 'Verify Hash'}
              </button>
            </div>

            {/* Verify Result */}
            {verifyResult && (
              <div className={`p-6 rounded-2xl border ${
                verifyResult.match
                  ? 'bg-green-500/10 border-green-500/20'
                  : 'bg-red-500/10 border-red-500/20'
              }`}>
                <div className="flex items-center gap-3">
                  {verifyResult.match ? (
                    <>
                      <Check className="w-8 h-8 text-green-400" />
                      <div>
                        <p className="text-lg font-semibold text-green-400">Hash Matches!</p>
                        {verifyResult.algorithm && (
                          <p className="text-sm text-green-400/70">Detected algorithm: {verifyResult.algorithm}</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-8 h-8 text-red-400" />
                      <div>
                        <p className="text-lg font-semibold text-red-400">Hash Does Not Match</p>
                        <p className="text-sm text-red-400/70">The computed hash differs from the expected hash</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Identify Mode */}
        {mode === 'identify' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Unknown Hash
                </label>
                <input
                  type="text"
                  value={identifyInput}
                  onChange={(e) => setIdentifyInput(e.target.value)}
                  placeholder="Paste a hash to identify its type..."
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 font-mono"
                />
              </div>

              <button
                onClick={handleIdentify}
                disabled={!identifyInput}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Identify Hash Type
              </button>
            </div>

            {/* Identify Results */}
            {identifyResults.length > 0 && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Possible Hash Types</h3>
                <div className="space-y-2">
                  {identifyResults.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        {result.isSecure ? (
                          <ShieldCheck className="w-5 h-5 text-green-400" />
                        ) : (
                          <ShieldAlert className="w-5 h-5 text-yellow-400" />
                        )}
                        <span className="font-medium text-white">{result.algorithm}</span>
                      </div>
                      <span className={`text-sm ${result.isSecure ? 'text-green-400' : 'text-yellow-400'}`}>
                        {result.isSecure ? 'Secure' : 'Deprecated'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {identifyInput && identifyResults.length === 0 && (
              <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  <p className="text-yellow-400">Could not identify the hash type. Please check the input.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-400 space-y-2">
              <p><strong className="text-white">Security Note:</strong> MD5 and SHA-1 are cryptographically broken and should NOT be used for security purposes. Use SHA-256 or stronger for any security-sensitive applications.</p>
              <p>For password storage, use dedicated password hashing algorithms like Argon2, bcrypt, or scrypt instead of general-purpose hash functions.</p>
            </div>
          </div>
        </div>
      </div>
  )
}