// app/tools/photocraft/lib/canvas/operations.ts

/**
 * Canvas operation utilities
 */

export interface CanvasOperation {
  type: 'draw' | 'transform' | 'filter' | 'clear';
  timestamp: number;
  data?: any;
}

/**
 * Apply brightness adjustment to image data
 */
export function applyBrightness(imageData: ImageData, value: number): ImageData {
  const data = imageData.data;
  const adjustment = Math.floor(value * 2.55); // Convert percentage to 0-255
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, data[i] + adjustment));     // R
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + adjustment)); // G
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + adjustment)); // B
  }
  
  return imageData;
}

/**
 * Apply contrast adjustment to image data
 */
export function applyContrast(imageData: ImageData, value: number): ImageData {
  const data = imageData.data;
  const factor = (259 * (value + 255)) / (255 * (259 - value));
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
    data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
    data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
  }
  
  return imageData;
}

/**
 * Apply saturation adjustment to image data
 */
export function applySaturation(imageData: ImageData, value: number): ImageData {
  const data = imageData.data;
  const saturation = value / 100;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Calculate grayscale
    const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
    
    // Apply saturation
    data[i] = Math.min(255, Math.max(0, gray + saturation * (r - gray)));
    data[i + 1] = Math.min(255, Math.max(0, gray + saturation * (g - gray)));
    data[i + 2] = Math.min(255, Math.max(0, gray + saturation * (b - gray)));
  }
  
  return imageData;
}

/**
 * Apply hue rotation to image data
 */
export function applyHueRotation(imageData: ImageData, degrees: number): ImageData {
  const data = imageData.data;
  const angle = (degrees * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Convert to HSL and back with rotated hue
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    
    if (diff === 0) continue; // Grayscale pixel
    
    let h = 0;
    if (max === r) {
      h = ((g - b) / diff) % 6;
    } else if (max === g) {
      h = (b - r) / diff + 2;
    } else {
      h = (r - g) / diff + 4;
    }
    
    h = (h * 60 + degrees) % 360;
    if (h < 0) h += 360;
    
    const l = (max + min) / 2 / 255;
    const s = diff / (255 - Math.abs(2 * l * 255 - 255));
    
    // Convert back to RGB
    const c = (1 - Math.abs(2 * l - 1)) * s * 255;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l * 255 - c / 2;
    
    let newR = 0, newG = 0, newB = 0;
    
    if (h < 60) {
      newR = c; newG = x; newB = 0;
    } else if (h < 120) {
      newR = x; newG = c; newB = 0;
    } else if (h < 180) {
      newR = 0; newG = c; newB = x;
    } else if (h < 240) {
      newR = 0; newG = x; newB = c;
    } else if (h < 300) {
      newR = x; newG = 0; newB = c;
    } else {
      newR = c; newG = 0; newB = x;
    }
    
    data[i] = Math.min(255, Math.max(0, newR + m));
    data[i + 1] = Math.min(255, Math.max(0, newG + m));
    data[i + 2] = Math.min(255, Math.max(0, newB + m));
  }
  
  return imageData;
}

/**
 * Apply grayscale filter to image data
 */
export function applyGrayscale(imageData: ImageData): ImageData {
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.2989 * data[i] + 0.5870 * data[i + 1] + 0.1140 * data[i + 2];
    data[i] = gray;     // R
    data[i + 1] = gray; // G
    data[i + 2] = gray; // B
  }
  
  return imageData;
}

/**
 * Apply sepia filter to image data
 */
export function applySepia(imageData: ImageData, intensity: number = 1): ImageData {
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    const tr = (0.393 * r + 0.769 * g + 0.189 * b);
    const tg = (0.349 * r + 0.686 * g + 0.168 * b);
    const tb = (0.272 * r + 0.534 * g + 0.131 * b);
    
    data[i] = Math.min(255, r + (tr - r) * intensity);
    data[i + 1] = Math.min(255, g + (tg - g) * intensity);
    data[i + 2] = Math.min(255, b + (tb - b) * intensity);
  }
  
  return imageData;
}

/**
 * Apply invert filter to image data
 */
export function applyInvert(imageData: ImageData): ImageData {
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];       // R
    data[i + 1] = 255 - data[i + 1]; // G
    data[i + 2] = 255 - data[i + 2]; // B
  }
  
  return imageData;
}

/**
 * Apply blur filter to image data (box blur)
 */
export function applyBlur(imageData: ImageData, radius: number = 1): ImageData {
  const { width, height, data } = imageData;
  const output = new Uint8ClampedArray(data);
  
  const kernelSize = radius * 2 + 1;
  const kernelSum = kernelSize * kernelSize;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      
      for (let ky = -radius; ky <= radius; ky++) {
        for (let kx = -radius; kx <= radius; kx++) {
          const px = Math.min(width - 1, Math.max(0, x + kx));
          const py = Math.min(height - 1, Math.max(0, y + ky));
          const idx = (py * width + px) * 4;
          
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
          a += data[idx + 3];
        }
      }
      
      const idx = (y * width + x) * 4;
      output[idx] = r / kernelSum;
      output[idx + 1] = g / kernelSum;
      output[idx + 2] = b / kernelSum;
      output[idx + 3] = a / kernelSum;
    }
  }
  
  imageData.data.set(output);
  return imageData;
}

/**
 * Apply sharpen filter to image data
 */
export function applySharpen(imageData: ImageData, amount: number = 1): ImageData {
  const { width, height, data } = imageData;
  const output = new Uint8ClampedArray(data);
  
  const kernel = [
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0
  ];
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let r = 0, g = 0, b = 0;
      
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          const kernelIdx = (ky + 1) * 3 + (kx + 1);
          
          r += data[idx] * kernel[kernelIdx];
          g += data[idx + 1] * kernel[kernelIdx];
          b += data[idx + 2] * kernel[kernelIdx];
        }
      }
      
      const idx = (y * width + x) * 4;
      output[idx] = Math.min(255, Math.max(0, data[idx] + (r - data[idx]) * amount));
      output[idx + 1] = Math.min(255, Math.max(0, data[idx + 1] + (g - data[idx + 1]) * amount));
      output[idx + 2] = Math.min(255, Math.max(0, data[idx + 2] + (b - data[idx + 2]) * amount));
    }
  }
  
  imageData.data.set(output);
  return imageData;
}

/**
 * Apply temperature adjustment to image data
 */
export function applyTemperature(imageData: ImageData, temperature: number): ImageData {
  const data = imageData.data;
  const temp = temperature / 100;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, data[i] + temp * 30));     // R (warm)
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] - temp * 30)); // B (cool)
  }
  
  return imageData;
}

/**
 * Apply vignette effect to image data
 */
export function applyVignette(imageData: ImageData, intensity: number = 0.5): ImageData {
  const { width, height, data } = imageData;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const factor = 1 - (dist / maxDist) * intensity;
      
      const idx = (y * width + x) * 4;
      data[idx] *= factor;
      data[idx + 1] *= factor;
      data[idx + 2] *= factor;
    }
  }
  
  return imageData;
}

/**
 * Compose multiple operations into one
 */
export function composeOperations(
  imageData: ImageData,
  operations: Array<(data: ImageData) => ImageData>
): ImageData {
  return operations.reduce((data, operation) => operation(data), imageData);
}