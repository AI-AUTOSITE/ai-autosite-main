// hooks/useFileHandler.ts

import { useState, useCallback, useRef } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { ImageSize } from '../types'
import { MAX_FILE_SIZE, SUPPORTED_IMAGE_TYPES } from '../constants'
import { calculateDisplayScale } from '../utils/canvas'

interface UseFileHandlerReturn {
  file: File | null
  imageUrl: string
  imageSize: ImageSize
  displayScale: number
  setDisplayScale: Dispatch<SetStateAction<number>>
  originalImage: HTMLImageElement | null
  isDraggingFile: boolean
  fileInputRef: React.RefObject<HTMLInputElement>
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleDragOver: (e: React.DragEvent) => void
  handleDragLeave: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent) => void
  processFile: (file: File) => void
  resetFile: () => void
  error: string
  setError: (error: string) => void
}

export const useFileHandler = (): UseFileHandlerReturn => {
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [imageSize, setImageSize] = useState<ImageSize>({ width: 0, height: 0 })
  const [displayScale, setDisplayScale] = useState(1)
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null)
  const [isDraggingFile, setIsDraggingFile] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback((selectedFile: File) => {
    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('File must be under 10MB')
      return
    }

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    setFile(selectedFile)
    setError('')

    // Generate image preview
    const url = URL.createObjectURL(selectedFile)
    setImageUrl(url)

    // Load image and calculate scale
    const img = new Image()
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height })
      setOriginalImage(img)

      // Calculate auto scale
      const scale = calculateDisplayScale(img.width, img.height)
      setDisplayScale(scale)
    }
    img.src = url
  }, [])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) {
        processFile(selectedFile)
      }
    },
    [processFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingFile(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingFile(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDraggingFile(false)

      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile && droppedFile.type.startsWith('image/')) {
        processFile(droppedFile)
      }
    },
    [processFile]
  )

  const resetFile = useCallback(() => {
    setFile(null)
    setImageUrl('')
    setImageSize({ width: 0, height: 0 })
    setDisplayScale(1)
    setOriginalImage(null)
    setError('')
  }, [])

  return {
    file,
    imageUrl,
    imageSize,
    displayScale,
    setDisplayScale, // Add setter
    originalImage,
    isDraggingFile,
    fileInputRef,
    handleFileSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    processFile,
    resetFile,
    error,
    setError,
  }
}
