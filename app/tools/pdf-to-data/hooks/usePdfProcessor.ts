'use client'

import { useState, useRef } from 'react'
import { 
  MAX_FILE_SIZE, 
  ERROR_MESSAGES, 
  ERROR_DISPLAY_DURATION, 
  LONG_ERROR_DISPLAY_DURATION,
  ACCEPTED_FILE_TYPE,
  API_ENDPOINT
} from '../constants'
interface UsePdfProcessorReturn {
  file: File | null
  csvUrl: string
  excelUrl: string
  error: string
  isDragging: boolean
  isProcessing: boolean
  fileInputRef: React.RefObject<HTMLInputElement>
  setIsDragging: (value: boolean) => void
  handleDrop: (e: React.DragEvent) => Promise<void>
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  handleReset: () => void
  triggerFileInput: () => void
}

export function usePdfProcessor(): UsePdfProcessorReturn {
  const [file, setFile] = useState<File | null>(null)
  const [csvUrl, setCsvUrl] = useState<string>('')
  const [excelUrl, setExcelUrl] = useState<string>('')
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

const processFile = async (pdfFile: File) => {
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
    
    try {
      const [csvBlob, excelBlob] = await Promise.all([
        extractData(pdfFile, 'csv'),
        extractData(pdfFile, 'excel')
      ])
      
      if (csvBlob) {
        const url = URL.createObjectURL(csvBlob)
        setCsvUrl(url)
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

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: formData,
    })

    if (response.ok) {
      return await response.blob()
    }
    return null
  } catch {
    return null
  }
}

const handleDrop = async (e: React.DragEvent) => {
  e.preventDefault()
  setIsDragging(false)
  
  const droppedFile = e.dataTransfer.files[0]
  if (droppedFile?.type === ACCEPTED_FILE_TYPE) {
    await processFile(droppedFile)
  } else {
    setError(ERROR_MESSAGES.INVALID_FILE_TYPE)
    setTimeout(() => setError(''), ERROR_DISPLAY_DURATION)
  }
}

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setError('')
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerFileInput = () => {
    if (!file && !isProcessing) {
      fileInputRef.current?.click()
    }
  }

  return {
    file,
    csvUrl,
    excelUrl,
    error,
    isDragging,
    isProcessing,
    fileInputRef,
    setIsDragging,
    handleDrop,
    handleFileSelect,
    handleReset,
    triggerFileInput
  }
}