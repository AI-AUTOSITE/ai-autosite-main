'use client'

import { useState, useRef } from 'react'
import {
  MAX_FILE_SIZE,
  ERROR_MESSAGES,
  ERROR_DISPLAY_DURATION,
  LONG_ERROR_DISPLAY_DURATION,
  ACCEPTED_FILE_TYPE,
  API_ENDPOINT,
} from '../constants'

interface UsePdfProcessorReturn {
  file: File | null
  csvUrl: string
  excelUrl: string
  csvPreview: string
  error: string
  isDragging: boolean
  isProcessing: boolean
  showPreview: boolean
  showCustomFields: boolean
  customFields: string
  fileInputRef: React.RefObject<HTMLInputElement>
  setIsDragging: (value: boolean) => void
  setShowPreview: (value: boolean) => void
  setShowCustomFields: (value: boolean) => void
  setCustomFields: (value: string) => void
  handleDrop: (e: React.DragEvent) => Promise<void>
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  handleReset: () => void
  triggerFileInput: () => void
  confirmDownload: () => void
}

export function usePdfProcessor(hasAgreed: boolean): UsePdfProcessorReturn {
  const [file, setFile] = useState<File | null>(null)
  const [csvUrl, setCsvUrl] = useState<string>('')
  const [excelUrl, setExcelUrl] = useState<string>('')
  const [csvPreview, setCsvPreview] = useState<string>('')
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showCustomFields, setShowCustomFields] = useState(false)
  const [customFields, setCustomFields] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = async (pdfFile: File) => {
    if (!hasAgreed) return

    if (pdfFile.size > MAX_FILE_SIZE) {
      setError(ERROR_MESSAGES.FILE_TOO_LARGE)
      setTimeout(() => setError(''), ERROR_DISPLAY_DURATION)
      return
    }

    setFile(pdfFile)
    setIsProcessing(true)
    setError('')

    // Reset previous URLs
    if (csvUrl) URL.revokeObjectURL(csvUrl)
    if (excelUrl) URL.revokeObjectURL(excelUrl)
    setCsvUrl('')
    setExcelUrl('')
    setCsvPreview('')

    try {
      const [csvBlob, excelBlob] = await Promise.all([
        extractData(pdfFile, 'csv'),
        extractData(pdfFile, 'excel'),
      ])

      if (csvBlob) {
        const url = URL.createObjectURL(csvBlob)
        setCsvUrl(url)

        // Generate preview from CSV
        const previewText = await csvBlob.text()
        setCsvPreview(previewText)
        setShowPreview(true) // Auto-show preview
      }

      if (excelBlob) {
        const url = URL.createObjectURL(excelBlob)
        setExcelUrl(url)
      }

      if (!csvBlob && !excelBlob) {
        setError(ERROR_MESSAGES.EXTRACTION_FAILED)
        setTimeout(() => setError(''), LONG_ERROR_DISPLAY_DURATION)
      }
    } catch (err) {
      setError(ERROR_MESSAGES.GENERAL_ERROR)
      setTimeout(() => setError(''), ERROR_DISPLAY_DURATION)
    } finally {
      setIsProcessing(false)
    }
  }

  const extractData = async (pdfFile: File, format: 'csv' | 'excel'): Promise<Blob | null> => {
    const formData = new FormData()
    formData.append('pdf', pdfFile)
    formData.append('format', format)

    // Add custom fields if specified
    if (customFields) {
      formData.append('customFields', customFields)
    }

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        return await response.blob()
      }

      // Handle API errors
      const errorData = await response.json().catch(() => ({}))

      if (errorData.error && ERROR_MESSAGES[errorData.error as keyof typeof ERROR_MESSAGES]) {
        setError(ERROR_MESSAGES[errorData.error as keyof typeof ERROR_MESSAGES])
        setTimeout(() => setError(''), LONG_ERROR_DISPLAY_DURATION)
      }

      return null
    } catch {
      return null
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (!hasAgreed) return

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type === ACCEPTED_FILE_TYPE) {
      await processFile(droppedFile)
    } else {
      setError(ERROR_MESSAGES.INVALID_FILE_TYPE)
      setTimeout(() => setError(''), ERROR_DISPLAY_DURATION)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!hasAgreed) return

    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      await processFile(selectedFile)
    }
  }

  const handleReset = () => {
    if (csvUrl) URL.revokeObjectURL(csvUrl)
    if (excelUrl) URL.revokeObjectURL(excelUrl)

    setFile(null)
    setCsvUrl('')
    setExcelUrl('')
    setCsvPreview('')
    setError('')
    setShowPreview(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerFileInput = () => {
    if (!file && !isProcessing && hasAgreed) {
      fileInputRef.current?.click()
    }
  }

  const confirmDownload = () => {
    setShowPreview(false)
  }

  return {
    file,
    csvUrl,
    excelUrl,
    csvPreview,
    error,
    isDragging,
    isProcessing,
    showPreview,
    showCustomFields,
    customFields,
    fileInputRef,
    setIsDragging,
    setShowPreview,
    setShowCustomFields,
    setCustomFields,
    handleDrop,
    handleFileSelect,
    handleReset,
    triggerFileInput,
    confirmDownload,
  }
}