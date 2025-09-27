// app/tools/photocraft/hooks/useSmartCrop.ts
import { useState, useCallback, useRef } from 'react';
import { FaceDetector } from '../lib/utils/faceDetection';
import { 
  SmartCropOptions, 
  SmartCropResult, 
  DetectedFace 
} from '../types/smartcrop';

interface UseSmartCropReturn {
  detectFaces: (image: HTMLImageElement | HTMLCanvasElement) => Promise<DetectedFace[]>;
  calculateCrop: (
    image: HTMLImageElement | HTMLCanvasElement,
    options?: SmartCropOptions
  ) => Promise<SmartCropResult>;
  applyCrop: (
    image: HTMLImageElement | HTMLCanvasElement,
    crop: SmartCropResult
  ) => HTMLCanvasElement;
  isProcessing: boolean;
  error: string | null;
  detectedFaces: DetectedFace[];
  cropResult: SmartCropResult | null;
}

export function useSmartCrop(): UseSmartCropReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedFaces, setDetectedFaces] = useState<DetectedFace[]>([]);
  const [cropResult, setCropResult] = useState<SmartCropResult | null>(null);
  
  const detectorRef = useRef<FaceDetector | null>(null);

  // Initialize detector
  if (!detectorRef.current) {
    detectorRef.current = new FaceDetector();
  }

  const detectFaces = useCallback(async (
    image: HTMLImageElement | HTMLCanvasElement
  ): Promise<DetectedFace[]> => {
    if (!detectorRef.current) {
      throw new Error('Face detector not initialized');
    }

    setIsProcessing(true);
    setError(null);

    try {
      const faces = await detectorRef.current.detectFaces(image);
      setDetectedFaces(faces);
      return faces;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Face detection failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const calculateCrop = useCallback(async (
    image: HTMLImageElement | HTMLCanvasElement,
    options: SmartCropOptions = {}
  ): Promise<SmartCropResult> => {
    if (!detectorRef.current) {
      throw new Error('Face detector not initialized');
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Detect faces first
      const faces = await detectorRef.current.detectFaces(image, options);
      setDetectedFaces(faces);

      // Calculate smart crop
      const crop = detectorRef.current.calculateSmartCrop(
        image.width,
        image.height,
        faces,
        options
      );
      
      setCropResult(crop);
      return crop;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Crop calculation failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const applyCrop = useCallback((
    image: HTMLImageElement | HTMLCanvasElement,
    crop: SmartCropResult
  ): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );

    return canvas;
  }, []);

  return {
    detectFaces,
    calculateCrop,
    applyCrop,
    isProcessing,
    error,
    detectedFaces,
    cropResult
  };
}