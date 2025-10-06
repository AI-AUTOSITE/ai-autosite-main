// utils/pdfHelpers.ts
// PDFファイル操作用の共通ヘルパー関数

/**
 * Converts Uint8Array to Blob safely, handling ArrayBuffer compatibility issues
 * @param uint8Array - The Uint8Array to convert
 * @param mimeType - The MIME type for the Blob (default: 'application/pdf')
 * @returns A Blob object
 */
export function uint8ArrayToBlob(
  uint8Array: Uint8Array,
  mimeType: string = 'application/pdf'
): Blob {
  // Create a new ArrayBuffer to avoid SharedArrayBuffer issues
  const newBuffer = new ArrayBuffer(uint8Array.length)
  const view = new Uint8Array(newBuffer)
  view.set(uint8Array)
  return new Blob([newBuffer], { type: mimeType })
}

// Future utility functions can be added here
// export function ...
