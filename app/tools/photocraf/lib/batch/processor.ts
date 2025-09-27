// app/tools/photocraft/lib/batch/processor.ts
import { BatchJob, ProcessedFile, FilterConfig } from '../../types/batch';
import * as operations from '../canvas/operations';

export class BatchProcessor {
  private workers: Worker[] = [];
  private maxWorkers = 3;
  private queue: Array<{
    file: File;
    filters: FilterConfig[];
    resolve: (result: ProcessedFile) => void;
    reject: (error: Error) => void;
  }> = [];
  
  constructor() {
    // Worker initialization will be added
  }

  async processJob(
    job: BatchJob,
    onProgress: (progress: number, processedFiles: number) => void,
    onFileComplete: (result: ProcessedFile) => void,
    onError: (fileName: string, error: string) => void
  ): Promise<ProcessedFile[]> {
    const results: ProcessedFile[] = [];
    const batchSize = Math.min(this.maxWorkers, job.files.length);
    
    for (let i = 0; i < job.files.length; i += batchSize) {
      const batch = job.files.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(file => this.processFile(file, job.filters, job.outputFormat, job.outputQuality))
      );
      
      for (const result of batchResults) {
        if (result) {
          results.push(result);
          onFileComplete(result);
        }
      }
      
      const processed = Math.min(i + batchSize, job.files.length);
      const progress = Math.round((processed / job.files.length) * 100);
      onProgress(progress, processed);
    }
    
    return results;
  }

  private async processFile(
    file: File,
    filters: FilterConfig[],
    outputFormat: string,
    outputQuality: number
  ): Promise<ProcessedFile> {
    const startTime = performance.now();
    
    try {
      // Create image from file
      const img = await this.createImage(file);
      
      // Apply filters
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Apply each filter
      for (const filter of filters) {
        await this.applyFilter(ctx, canvas, filter);
      }
      
      // Convert to blob
      const blob = await this.canvasToBlob(canvas, outputFormat, outputQuality);
      const processedUrl = URL.createObjectURL(blob);
      
      const processingTime = performance.now() - startTime;
      
      return {
        originalName: file.name,
        processedUrl,
        blob,
        size: blob.size,
        processingTime
      };
    } catch (error) {
      throw new Error(`Failed to process ${file.name}: ${error}`);
    }
  }

  private async createImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };
      
      img.src = url;
    });
  }

  private async applyFilter(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    filter: FilterConfig
  ): Promise<void> {
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let modifiedData = imageData;
    
    // Apply filter based on type using the operations module
    switch (filter.type) {
      case 'brightness':
        modifiedData = operations.applyBrightness(imageData, filter.params.value || 0);
        break;
      case 'contrast':
        modifiedData = operations.applyContrast(imageData, filter.params.value || 0);
        break;
      case 'saturation':
        modifiedData = operations.applySaturation(imageData, filter.params.value || 100);
        break;
      case 'hue':
        modifiedData = operations.applyHueRotation(imageData, filter.params.value || 0);
        break;
      case 'grayscale':
        modifiedData = operations.applyGrayscale(imageData);
        break;
      case 'sepia':
        modifiedData = operations.applySepia(imageData, filter.params.intensity || 1);
        break;
      case 'invert':
        modifiedData = operations.applyInvert(imageData);
        break;
      case 'blur':
        modifiedData = operations.applyBlur(imageData, filter.params.radius || 1);
        break;
      case 'sharpen':
        modifiedData = operations.applySharpen(imageData, filter.params.amount || 1);
        break;
      case 'temperature':
        modifiedData = operations.applyTemperature(imageData, filter.params.value || 0);
        break;
      case 'vignette':
        modifiedData = operations.applyVignette(imageData, filter.params.intensity || 0.5);
        break;
      default:
        console.warn(`Unknown filter type: ${filter.type}`);
    }
    
    ctx.putImageData(modifiedData, 0, 0);
  }

  private async canvasToBlob(
    canvas: HTMLCanvasElement,
    format: string,
    quality: number
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        `image/${format}`,
        quality / 100
      );
    });
  }
}