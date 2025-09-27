// app/tools/photocraft/lib/utils/faceDetection.ts
import { DetectedFace, SmartCropOptions, SmartCropResult } from '../../types/smartcrop';

/**
 * Simple face detection using skin tone detection and pattern recognition
 * This is a lightweight alternative to ML models for basic face detection
 */
export class FaceDetector {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })!;
  }

  /**
   * Detect faces in an image
   */
  async detectFaces(
    image: HTMLImageElement | HTMLCanvasElement,
    options: SmartCropOptions = {}
  ): Promise<DetectedFace[]> {
    const {
      minFaceSize = 30,
      maxFaces = 10,
      qualityMode = 'balanced'
    } = options;

    // Set canvas size based on quality mode
    const scale = this.getScaleForQualityMode(qualityMode);
    this.canvas.width = image.width * scale;
    this.canvas.height = image.height * scale;
    
    // Draw scaled image
    this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
    
    // Get image data
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    
    // Detect skin regions
    const skinMask = this.detectSkinRegions(imageData);
    
    // Find face candidates from skin regions
    const faceCandidates = this.findFaceCandidates(skinMask, this.canvas.width, this.canvas.height);
    
    // Filter and rank candidates
    const faces = this.filterAndRankFaces(faceCandidates, minFaceSize / scale, maxFaces);
    
    // Scale results back to original size
    return faces.map(face => ({
      x: face.x / scale,
      y: face.y / scale,
      width: face.width / scale,
      height: face.height / scale,
      confidence: face.confidence
    }));
  }

  /**
   * Calculate smart crop based on detected faces
   */
  calculateSmartCrop(
    imageWidth: number,
    imageHeight: number,
    faces: DetectedFace[],
    options: SmartCropOptions = {}
  ): SmartCropResult {
    const {
      aspectRatio = 0,
      padding = 20,
      includeAllFaces = true,
      centerFaces = true
    } = options;

    if (faces.length === 0) {
      // No faces detected, return center crop
      return this.getCenterCrop(imageWidth, imageHeight, aspectRatio);
    }

    // Calculate bounding box for all faces
    const faceBounds = this.calculateFacesBoundingBox(faces, includeAllFaces);
    
    // Add padding
    const paddingPixels = Math.min(faceBounds.width, faceBounds.height) * (padding / 100);
    faceBounds.x = Math.max(0, faceBounds.x - paddingPixels);
    faceBounds.y = Math.max(0, faceBounds.y - paddingPixels);
    faceBounds.width = Math.min(imageWidth - faceBounds.x, faceBounds.width + paddingPixels * 2);
    faceBounds.height = Math.min(imageHeight - faceBounds.y, faceBounds.height + paddingPixels * 2);

    // Apply aspect ratio if specified
    if (aspectRatio > 0) {
      const currentRatio = faceBounds.width / faceBounds.height;
      
      if (currentRatio > aspectRatio) {
        // Too wide, adjust height
        const newHeight = faceBounds.width / aspectRatio;
        if (centerFaces) {
          faceBounds.y = Math.max(0, faceBounds.y - (newHeight - faceBounds.height) / 2);
        }
        faceBounds.height = Math.min(imageHeight - faceBounds.y, newHeight);
        faceBounds.width = faceBounds.height * aspectRatio;
      } else {
        // Too tall, adjust width
        const newWidth = faceBounds.height * aspectRatio;
        if (centerFaces) {
          faceBounds.x = Math.max(0, faceBounds.x - (newWidth - faceBounds.width) / 2);
        }
        faceBounds.width = Math.min(imageWidth - faceBounds.x, newWidth);
        faceBounds.height = faceBounds.width / aspectRatio;
      }
    }

    // Ensure crop is within image bounds
    faceBounds.x = Math.max(0, Math.min(imageWidth - faceBounds.width, faceBounds.x));
    faceBounds.y = Math.max(0, Math.min(imageHeight - faceBounds.height, faceBounds.y));

    return {
      x: Math.round(faceBounds.x),
      y: Math.round(faceBounds.y),
      width: Math.round(faceBounds.width),
      height: Math.round(faceBounds.height),
      faces,
      confidence: this.calculateCropConfidence(faces, faceBounds),
      suggestion: this.getCropSuggestion(faces, faceBounds, imageWidth, imageHeight)
    };
  }

  /**
   * Detect skin regions using color-based detection
   */
  private detectSkinRegions(imageData: ImageData): Uint8Array {
    const { data, width, height } = imageData;
    const mask = new Uint8Array(width * height);
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      if (this.isSkinColor(r, g, b)) {
        mask[i / 4] = 255;
      }
    }
    
    // Apply morphological operations to clean up the mask
    return this.cleanupMask(mask, width, height);
  }

  /**
   * Check if RGB values match skin color
   */
  private isSkinColor(r: number, g: number, b: number): boolean {
    // YCrCb color space skin detection
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    const cr = (r - y) * 0.713 + 128;
    const cb = (b - y) * 0.564 + 128;
    
    // Skin color range in YCrCb
    return (
      cr >= 133 && cr <= 173 &&
      cb >= 77 && cb <= 127 &&
      r > 95 && g > 40 && b > 20 &&
      r > g && r > b &&
      Math.abs(r - g) > 15
    );
  }

  /**
   * Find face candidates from skin mask
   */
  private findFaceCandidates(
    mask: Uint8Array,
    width: number,
    height: number
  ): DetectedFace[] {
    const candidates: DetectedFace[] = [];
    const visited = new Uint8Array(width * height);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        
        if (mask[idx] && !visited[idx]) {
          // Found a new region, flood fill to find its bounds
          const region = this.floodFill(mask, visited, x, y, width, height);
          
          if (region.width > 10 && region.height > 10) {
            // Check if region has face-like proportions
            const aspectRatio = region.width / region.height;
            if (aspectRatio >= 0.5 && aspectRatio <= 2) {
              candidates.push({
                ...region,
                confidence: this.calculateRegionConfidence(region, mask, width)
              });
            }
          }
        }
      }
    }
    
    return candidates;
  }

  /**
   * Flood fill to find connected region
   */
  private floodFill(
    mask: Uint8Array,
    visited: Uint8Array,
    startX: number,
    startY: number,
    width: number,
    height: number
  ): DetectedFace {
    const queue: Point[] = [{ x: startX, y: startY }];
    let minX = startX, maxX = startX;
    let minY = startY, maxY = startY;
    let pixelCount = 0;
    
    while (queue.length > 0) {
      const { x, y } = queue.shift()!;
      const idx = y * width + x;
      
      if (visited[idx]) continue;
      visited[idx] = 1;
      pixelCount++;
      
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
      
      // Check neighbors
      const neighbors = [
        { x: x - 1, y }, { x: x + 1, y },
        { x, y: y - 1 }, { x, y: y + 1 }
      ];
      
      for (const neighbor of neighbors) {
        if (
          neighbor.x >= 0 && neighbor.x < width &&
          neighbor.y >= 0 && neighbor.y < height
        ) {
          const nIdx = neighbor.y * width + neighbor.x;
          if (mask[nIdx] && !visited[nIdx]) {
            queue.push(neighbor);
          }
        }
      }
    }
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1,
      confidence: 0
    };
  }

  /**
   * Clean up mask using morphological operations
   */
  private cleanupMask(mask: Uint8Array, width: number, height: number): Uint8Array {
    // Simple erosion followed by dilation
    const eroded = new Uint8Array(mask.length);
    const dilated = new Uint8Array(mask.length);
    
    // Erosion
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        if (
          mask[idx] &&
          mask[idx - 1] && mask[idx + 1] &&
          mask[idx - width] && mask[idx + width]
        ) {
          eroded[idx] = 255;
        }
      }
    }
    
    // Dilation
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        if (
          eroded[idx] ||
          eroded[idx - 1] || eroded[idx + 1] ||
          eroded[idx - width] || eroded[idx + width]
        ) {
          dilated[idx] = 255;
        }
      }
    }
    
    return dilated;
  }

  /**
   * Calculate confidence score for a region
   */
  private calculateRegionConfidence(
    region: DetectedFace,
    mask: Uint8Array,
    width: number
  ): number {
    // Simple heuristic based on region properties
    const aspectRatio = region.width / region.height;
    const idealAspectRatio = 0.75; // Typical face aspect ratio
    const aspectScore = 1 - Math.abs(aspectRatio - idealAspectRatio) / idealAspectRatio;
    
    // Check fill ratio (how much of the bounding box is filled)
    let filledPixels = 0;
    for (let y = region.y; y < region.y + region.height; y++) {
      for (let x = region.x; x < region.x + region.width; x++) {
        if (mask[y * width + x]) {
          filledPixels++;
        }
      }
    }
    const fillRatio = filledPixels / (region.width * region.height);
    const fillScore = Math.min(1, fillRatio / 0.6); // Expect at least 60% fill
    
    return (aspectScore + fillScore) / 2;
  }

  /**
   * Filter and rank face candidates
   */
  private filterAndRankFaces(
    candidates: DetectedFace[],
    minSize: number,
    maxFaces: number
  ): DetectedFace[] {
    return candidates
      .filter(face => face.width >= minSize && face.height >= minSize)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, maxFaces);
  }

  /**
   * Calculate bounding box for faces
   */
  private calculateFacesBoundingBox(
    faces: DetectedFace[],
    includeAll: boolean
  ): { x: number; y: number; width: number; height: number } {
    const facesToInclude = includeAll ? faces : faces.slice(0, 1);
    
    if (facesToInclude.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }
    
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;
    
    for (const face of facesToInclude) {
      minX = Math.min(minX, face.x);
      minY = Math.min(minY, face.y);
      maxX = Math.max(maxX, face.x + face.width);
      maxY = Math.max(maxY, face.y + face.height);
    }
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  /**
   * Get center crop when no faces are detected
   */
  private getCenterCrop(
    width: number,
    height: number,
    aspectRatio: number
  ): SmartCropResult {
    let cropWidth = width;
    let cropHeight = height;
    let x = 0;
    let y = 0;
    
    if (aspectRatio > 0) {
      const currentRatio = width / height;
      
      if (currentRatio > aspectRatio) {
        cropWidth = height * aspectRatio;
        x = (width - cropWidth) / 2;
      } else {
        cropHeight = width / aspectRatio;
        y = (height - cropHeight) / 2;
      }
    }
    
    return {
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(cropWidth),
      height: Math.round(cropHeight),
      faces: [],
      confidence: 0.5,
      suggestion: 'No faces detected. Using center crop.'
    };
  }

  /**
   * Calculate crop confidence
   */
  private calculateCropConfidence(
    faces: DetectedFace[],
    crop: { x: number; y: number; width: number; height: number }
  ): number {
    if (faces.length === 0) return 0.5;
    
    // Check how well faces fit in the crop
    let totalConfidence = 0;
    for (const face of faces) {
      const faceInCrop = 
        face.x >= crop.x &&
        face.y >= crop.y &&
        face.x + face.width <= crop.x + crop.width &&
        face.y + face.height <= crop.y + crop.height;
      
      totalConfidence += faceInCrop ? face.confidence : face.confidence * 0.5;
    }
    
    return Math.min(1, totalConfidence / faces.length);
  }

  /**
   * Get crop suggestion
   */
  private getCropSuggestion(
    faces: DetectedFace[],
    crop: { x: number; y: number; width: number; height: number },
    imageWidth: number,
    imageHeight: number
  ): string {
    if (faces.length === 0) {
      return 'No faces detected. Consider manual cropping.';
    }
    
    if (faces.length > 1) {
      return `${faces.length} faces detected. Crop includes all faces.`;
    }
    
    if (crop.width < imageWidth * 0.3 || crop.height < imageHeight * 0.3) {
      return 'Crop is very tight. Consider adding more padding.';
    }
    
    return 'Good composition with detected face.';
  }

  /**
   * Get scale factor based on quality mode
   */
  private getScaleForQualityMode(mode: 'fast' | 'balanced' | 'quality'): number {
    switch (mode) {
      case 'fast': return 0.25;
      case 'balanced': return 0.5;
      case 'quality': return 1;
      default: return 0.5;
    }
  }
}

interface Point {
  x: number;
  y: number;
}