// app/tools/pdf-tools/features/signature/SignatureCapture.ts
/**
 * Signature Capture Utility
 * Provides camera capture, image processing, and background removal for signatures
 * All processing happens client-side in the browser
 */

export interface CaptureOptions {
  width?: number
  height?: number
  facingMode?: 'user' | 'environment'  // Front or back camera
}

export interface ProcessOptions {
  removeBackground?: boolean
  threshold?: number          // Background removal threshold (0-255)
  crop?: boolean              // Auto-crop to signature bounds
  invert?: boolean            // Invert colors (for signatures on dark background)
  smoothing?: number          // Edge smoothing level (0-5)
}

const DEFAULT_CAPTURE_OPTIONS: CaptureOptions = {
  width: 640,
  height: 480,
  facingMode: 'environment',  // Back camera is better for capturing paper signatures
}

const DEFAULT_PROCESS_OPTIONS: ProcessOptions = {
  removeBackground: true,
  threshold: 230,
  crop: true,
  invert: false,
  smoothing: 1,
}

/**
 * Check if camera is available
 */
export function isCameraAvailable(): boolean {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

/**
 * Request camera permission
 */
export async function requestCameraPermission(): Promise<boolean> {
  if (!isCameraAvailable()) return false
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    stream.getTracks().forEach(track => track.stop())
    return true
  } catch (error) {
    console.error('Camera permission denied:', error)
    return false
  }
}

/**
 * Start camera stream
 */
export async function startCamera(
  videoElement: HTMLVideoElement,
  options: CaptureOptions = {}
): Promise<MediaStream | null> {
  const opts = { ...DEFAULT_CAPTURE_OPTIONS, ...options }
  
  if (!isCameraAvailable()) {
    throw new Error('Camera not available on this device')
  }
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: opts.width },
        height: { ideal: opts.height },
        facingMode: opts.facingMode,
      },
    })
    
    videoElement.srcObject = stream
    await videoElement.play()
    return stream
  } catch (error) {
    console.error('Failed to start camera:', error)
    throw new Error('Failed to access camera. Please check permissions.')
  }
}

/**
 * Stop camera stream
 */
export function stopCamera(stream: MediaStream | null): void {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
  }
}

/**
 * Capture frame from video
 */
export function captureFrame(
  videoElement: HTMLVideoElement,
  canvas?: HTMLCanvasElement
): HTMLCanvasElement {
  const targetCanvas = canvas || document.createElement('canvas')
  const ctx = targetCanvas.getContext('2d')
  
  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }
  
  targetCanvas.width = videoElement.videoWidth
  targetCanvas.height = videoElement.videoHeight
  ctx.drawImage(videoElement, 0, 0)
  
  return targetCanvas
}

/**
 * Process signature image - remove background and crop
 */
export function processSignatureImage(
  canvas: HTMLCanvasElement,
  options: ProcessOptions = {}
): HTMLCanvasElement {
  const opts = { ...DEFAULT_PROCESS_OPTIONS, ...options }
  const ctx = canvas.getContext('2d')
  
  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  
  // Invert colors if needed (for signatures on dark background)
  if (opts.invert) {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i]         // R
      data[i + 1] = 255 - data[i + 1] // G
      data[i + 2] = 255 - data[i + 2] // B
    }
  }
  
  // Remove white/light background (make transparent)
  if (opts.removeBackground) {
    const threshold = opts.threshold || 230
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      // Calculate brightness
      const brightness = (r + g + b) / 3
      
      if (brightness > threshold) {
        // Make pixel transparent
        data[i + 3] = 0
      } else {
        // Enhance dark pixels (signature ink)
        // Make them more opaque and darker
        const darkness = 1 - (brightness / 255)
        data[i] = Math.round(data[i] * darkness)
        data[i + 1] = Math.round(data[i + 1] * darkness)
        data[i + 2] = Math.round(data[i + 2] * darkness)
        data[i + 3] = Math.min(255, Math.round(255 * (1 - brightness / threshold)))
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0)
  
  // Auto-crop to signature bounds
  if (opts.crop) {
    return cropToContent(canvas, opts.smoothing || 1)
  }
  
  return canvas
}

/**
 * Crop canvas to non-transparent content
 */
function cropToContent(canvas: HTMLCanvasElement, padding: number = 10): HTMLCanvasElement {
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  
  let minX = canvas.width
  let minY = canvas.height
  let maxX = 0
  let maxY = 0
  
  // Find bounds of non-transparent pixels
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const alpha = data[(y * canvas.width + x) * 4 + 3]
      if (alpha > 10) { // Non-transparent
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        maxX = Math.max(maxX, x)
        maxY = Math.max(maxY, y)
      }
    }
  }
  
  // Add padding
  minX = Math.max(0, minX - padding)
  minY = Math.max(0, minY - padding)
  maxX = Math.min(canvas.width, maxX + padding)
  maxY = Math.min(canvas.height, maxY + padding)
  
  // Check if we found any content
  if (maxX <= minX || maxY <= minY) {
    return canvas // Return original if no content found
  }
  
  // Create cropped canvas
  const croppedWidth = maxX - minX
  const croppedHeight = maxY - minY
  const croppedCanvas = document.createElement('canvas')
  croppedCanvas.width = croppedWidth
  croppedCanvas.height = croppedHeight
  
  const croppedCtx = croppedCanvas.getContext('2d')
  if (!croppedCtx) return canvas
  
  croppedCtx.drawImage(
    canvas,
    minX, minY, croppedWidth, croppedHeight,
    0, 0, croppedWidth, croppedHeight
  )
  
  return croppedCanvas
}

/**
 * Convert canvas to PNG data URL
 */
export function canvasToDataURL(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png')
}

/**
 * Convert canvas to Uint8Array (PNG)
 */
export async function canvasToUint8Array(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to create blob'))
        return
      }
      
      const reader = new FileReader()
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(new Uint8Array(reader.result))
        } else {
          reject(new Error('Invalid result type'))
        }
      }
      reader.onerror = () => reject(new Error('Failed to read blob'))
      reader.readAsArrayBuffer(blob)
    }, 'image/png')
  })
}

/**
 * Load image from file and convert to canvas
 */
export async function imageFileToCanvas(file: File): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }
      ctx.drawImage(img, 0, 0)
      resolve(canvas)
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Full capture and process flow
 * Captures from camera, processes, and returns ready-to-use signature data
 */
export async function captureAndProcessSignature(
  videoElement: HTMLVideoElement,
  processOptions?: ProcessOptions
): Promise<{ dataUrl: string; uint8Array: Uint8Array }> {
  // Capture frame
  const capturedCanvas = captureFrame(videoElement)
  
  // Process (remove background, crop)
  const processedCanvas = processSignatureImage(capturedCanvas, processOptions)
  
  // Convert to usable formats
  const dataUrl = canvasToDataURL(processedCanvas)
  const uint8Array = await canvasToUint8Array(processedCanvas)
  
  return { dataUrl, uint8Array }
}

/**
 * Process uploaded image file
 */
export async function processSignatureFile(
  file: File,
  processOptions?: ProcessOptions
): Promise<{ dataUrl: string; uint8Array: Uint8Array }> {
  // Load image to canvas
  const canvas = await imageFileToCanvas(file)
  
  // Process
  const processedCanvas = processSignatureImage(canvas, processOptions)
  
  // Convert
  const dataUrl = canvasToDataURL(processedCanvas)
  const uint8Array = await canvasToUint8Array(processedCanvas)
  
  return { dataUrl, uint8Array }
}
