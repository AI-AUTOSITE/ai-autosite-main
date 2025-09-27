// app/tools/photocraft/lib/utils/image.ts

/**
 * Image processing utility functions
 */

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageMetadata extends ImageDimensions {
  format: string;
  size: number;
  lastModified: number;
}

/**
 * Load image from File object
 */
export async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };

    img.src = url;
  });
}

/**
 * Load image from URL
 */
export async function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image from URL: ${url}`));

    img.src = url;
  });
}

/**
 * Convert canvas to blob with format and quality options
 */
export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpeg' | 'webp' = 'png',
  quality: number = 0.95
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      },
      `image/${format}`,
      quality
    );
  });
}

/**
 * Resize image maintaining aspect ratio
 */
export function resizeImage(
  img: HTMLImageElement,
  maxWidth: number,
  maxHeight: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  let { width, height } = img;

  // Calculate new dimensions maintaining aspect ratio
  if (width > maxWidth || height > maxHeight) {
    const aspectRatio = width / height;
    
    if (width / maxWidth > height / maxHeight) {
      width = maxWidth;
      height = width / aspectRatio;
    } else {
      height = maxHeight;
      width = height * aspectRatio;
    }
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  return canvas;
}

/**
 * Create thumbnail from image
 */
export async function createThumbnail(
  file: File,
  size: number = 200
): Promise<string> {
  const img = await loadImageFromFile(file);
  const canvas = resizeImage(img, size, size);
  const blob = await canvasToBlob(canvas, 'jpeg', 0.8);
  return URL.createObjectURL(blob);
}

/**
 * Get image metadata
 */
export async function getImageMetadata(file: File): Promise<ImageMetadata> {
  const img = await loadImageFromFile(file);
  
  return {
    width: img.width,
    height: img.height,
    format: file.type.replace('image/', ''),
    size: file.size,
    lastModified: file.lastModified
  };
}

/**
 * Crop image with given rectangle
 */
export function cropImage(
  img: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  canvas.width = width;
  canvas.height = height;
  
  ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
  
  return canvas;
}

/**
 * Rotate image by degrees
 */
export function rotateImage(img: HTMLImageElement, degrees: number): HTMLCanvasElement {
  const radians = (degrees * Math.PI) / 180;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));

  // Calculate new canvas size
  canvas.width = Math.floor(img.width * cos + img.height * sin);
  canvas.height = Math.floor(img.width * sin + img.height * cos);

  // Move to center, rotate, and draw
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(radians);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);

  return canvas;
}

/**
 * Flip image horizontally or vertically
 */
export function flipImage(
  img: HTMLImageElement,
  horizontal: boolean = true
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  canvas.width = img.width;
  canvas.height = img.height;

  if (horizontal) {
    ctx.scale(-1, 1);
    ctx.drawImage(img, -img.width, 0);
  } else {
    ctx.scale(1, -1);
    ctx.drawImage(img, 0, -img.height);
  }

  return canvas;
}

/**
 * Convert image to base64 data URL
 */
export async function imageToBase64(
  img: HTMLImageElement,
  format: 'png' | 'jpeg' | 'webp' = 'png',
  quality: number = 0.95
): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  return canvas.toDataURL(`image/${format}`, quality);
}

/**
 * Download image from canvas
 */
export async function downloadImage(
  canvas: HTMLCanvasElement,
  filename: string = 'image.png',
  format: 'png' | 'jpeg' | 'webp' = 'png',
  quality: number = 0.95
): Promise<void> {
  const blob = await canvasToBlob(canvas, format, quality);
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Check if file is a valid image
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
  return validTypes.includes(file.type);
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}