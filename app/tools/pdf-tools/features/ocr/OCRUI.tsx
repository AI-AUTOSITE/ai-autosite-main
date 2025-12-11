'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  ScanLine,
  X,
  Download,
  Copy,
  FileText,
  Camera,
  Image,
  Languages,
  Settings,
  Loader2,
  CheckCircle,
  AlertCircle,
  Shield,
  Eye,
  EyeOff,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Upload
} from 'lucide-react'
import { 
  EnhancedOCRHandler as OCRHandler, 
  OCRResult, 
  OCRProgress, 
  SUPPORTED_LANGUAGES,
  ImagePreprocessOptions 
} from './EnhancedOCRHandler'

interface OCRUIProps {
  file: File | null
  totalPages: number
  onClose: () => void
}

type OCRSource = 'pdf' | 'image' | 'camera'
type OCROutputFormat = 'text' | 'searchable-pdf' | 'copy'

export function OCRUI({
  file,
  totalPages,
  onClose
}: OCRUIProps) {
  // Source state
  const [source, setSource] = useState<OCRSource>('pdf')
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  
  // Settings state
  const [language, setLanguage] = useState('eng')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [preprocess, setPreprocess] = useState<ImagePreprocessOptions>({
    grayscale: true,
    contrast: 1.2,
    brightness: 1.0,
    sharpen: false,
    denoise: false,
    deskew: false
  })
  
  // Progress state
  const [progress, setProgress] = useState<OCRProgress | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Result state
  const [results, setResults] = useState<OCRResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [copied, setCopied] = useState(false)
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
      }
      OCRHandler.terminateWorkers()
    }
  }, [cameraStream])

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      })
      setCameraStream(stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Failed to access camera:', error)
      alert('Could not access camera. Please check permissions.')
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    setCapturedImage(null)
  }

  const captureFromCamera = () => {
    if (!videoRef.current || !canvasRef.current) return
    
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(video, 0, 0)
    
    setCapturedImage(canvas.toDataURL('image/jpeg', 0.9))
    stopCamera()
  }

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file)
      setSource('image')
    }
  }

  // OCR execution
  const handleOCR = async () => {
    setIsProcessing(true)
    setResults([])
    setProgress(null)

    try {
      let ocrResults: OCRResult[] = []

      if (source === 'pdf' && file) {
        ocrResults = await OCRHandler.recognizePDF(
          file,
          language,
          preprocess,
          setProgress
        )
      } else if (source === 'image' && uploadedImage) {
        const result = await OCRHandler.recognizeImage(
          uploadedImage,
          language,
          preprocess,
          setProgress
        )
        ocrResults = [result]
      } else if (source === 'camera' && capturedImage) {
        // Convert data URL to blob
        const response = await fetch(capturedImage)
        const blob = await response.blob()
        const result = await OCRHandler.recognizeImage(
          blob,
          language,
          preprocess,
          setProgress
        )
        ocrResults = [result]
      }

      setResults(ocrResults)
      setShowResults(true)
    } catch (error) {
      console.error('OCR error:', error)
      setProgress({
        status: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'OCR failed'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Copy to clipboard
  const handleCopy = async () => {
    const text = OCRHandler.combineResults(results)
    const success = await OCRHandler.copyToClipboard(text)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Download as text
  const handleDownload = () => {
    const text = OCRHandler.combineResults(results)
    const filename = file ? file.name.replace(/\.pdf$/i, '_ocr.txt') : 'ocr_result.txt'
    OCRHandler.downloadAsText(text, filename)
  }

  // Get combined text
  const combinedText = OCRHandler.combineResults(results)
  const avgConfidence = OCRHandler.calculateAverageConfidence(results)

  // Can execute OCR?
  const canExecute = (source === 'pdf' && file) || 
                     (source === 'image' && uploadedImage) || 
                     (source === 'camera' && capturedImage)

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <ScanLine className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">OCR - Text Recognition</h2>
              <p className="text-sm text-gray-400">Extract text from images and scans</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
              <Shield className="w-3 h-3" />
              100% Local
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Source Selection */}
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-2">Source</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => { setSource('pdf'); stopCamera() }}
                className={`p-4 rounded-lg border transition flex flex-col items-center gap-2 ${
                  source === 'pdf'
                    ? 'bg-purple-500/20 border-purple-400 text-purple-400'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                <FileText className="w-6 h-6" />
                <span className="text-sm font-medium">Current PDF</span>
                {file && <span className="text-xs opacity-70">{totalPages} pages</span>}
              </button>
              
              <button
                onClick={() => { setSource('image'); stopCamera() }}
                className={`p-4 rounded-lg border transition flex flex-col items-center gap-2 ${
                  source === 'image'
                    ? 'bg-blue-500/20 border-blue-400 text-blue-400'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                <Image className="w-6 h-6" />
                <span className="text-sm font-medium">Upload Image</span>
                {uploadedImage && <span className="text-xs opacity-70 truncate max-w-full">{uploadedImage.name}</span>}
              </button>
              
              <button
                onClick={() => { setSource('camera'); startCamera() }}
                className={`p-4 rounded-lg border transition flex flex-col items-center gap-2 ${
                  source === 'camera'
                    ? 'bg-green-500/20 border-green-400 text-green-400'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                <Camera className="w-6 h-6" />
                <span className="text-sm font-medium">Camera</span>
                <span className="text-xs opacity-70">Scan document</span>
              </button>
            </div>
          </div>

          {/* Image Upload Area */}
          {source === 'image' && (
            <div className="mb-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-6 border-2 border-dashed border-gray-600 rounded-lg hover:border-blue-400 transition flex flex-col items-center gap-2"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-gray-400">Click to upload image</span>
                <span className="text-xs text-gray-500">PNG, JPG, or WebP</span>
              </button>
              
              {uploadedImage && (
                <div className="mt-3 p-3 bg-gray-800 rounded-lg flex items-center gap-3">
                  <Image className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-gray-300 flex-1 truncate">{uploadedImage.name}</span>
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="text-gray-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Camera Area */}
          {source === 'camera' && (
            <div className="mb-6">
              {!capturedImage ? (
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {cameraStream && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      <button
                        onClick={captureFromCamera}
                        className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition flex items-center gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        Capture
                      </button>
                      <button
                        onClick={stopCamera}
                        className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {!cameraStream && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-full rounded-lg"
                  />
                  <button
                    onClick={() => { setCapturedImage(null); startCamera() }}
                    className="absolute top-2 right-2 p-2 bg-gray-800/80 rounded-full hover:bg-gray-700 transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}

          {/* Language Selection */}
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
              <Languages className="w-4 h-4" />
              Language
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-400 focus:outline-none"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name}) - {lang.dataSize}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Language data will be downloaded on first use
            </p>
          </div>

          {/* Advanced Settings */}
          <div className="mb-6">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
            >
              <Settings className="w-4 h-4" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
            </button>
            
            {showAdvanced && (
              <div className="mt-3 p-4 bg-gray-800 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-300">Grayscale conversion</label>
                  <input
                    type="checkbox"
                    checked={preprocess.grayscale}
                    onChange={(e) => setPreprocess(p => ({ ...p, grayscale: e.target.checked }))}
                    className="w-4 h-4"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">
                    Contrast: {preprocess.contrast.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={preprocess.contrast}
                    onChange={(e) => setPreprocess(p => ({ ...p, contrast: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">
                    Brightness: {preprocess.brightness.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={preprocess.brightness}
                    onChange={(e) => setPreprocess(p => ({ ...p, brightness: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Progress */}
          {progress && (
            <div className="mb-6 p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">{progress.message}</span>
                {progress.status === 'recognizing' && (
                  <span className="text-sm text-purple-400">{progress.progress}%</span>
                )}
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    progress.status === 'error' ? 'bg-red-500' :
                    progress.status === 'complete' ? 'bg-green-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
              {progress.currentPage && progress.totalPages && (
                <p className="text-xs text-gray-500 mt-1">
                  Page {progress.currentPage} of {progress.totalPages}
                </p>
              )}
            </div>
          )}

          {/* Results */}
          {results.length > 0 && showResults && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">
                  Results ({results.length} pages, {Math.round(avgConfidence)}% confidence)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition"
                    title="Copy to clipboard"
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition"
                    title="Download as text"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <textarea
                value={combinedText}
                readOnly
                className="w-full h-48 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm resize-none"
              />
            </div>
          )}

          {/* Privacy Notice */}
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm flex items-center gap-2">
              <Shield className="w-4 h-4" />
              100% browser-based OCR. Your files never leave your device.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Language data is cached locally after first download.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-700 bg-gray-800/50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
          >
            Close
          </button>
          <button
            onClick={handleOCR}
            disabled={!canExecute || isProcessing}
            className={`px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
              canExecute && !isProcessing
                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Start OCR
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default OCRUI
