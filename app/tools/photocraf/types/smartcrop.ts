// app/tools/photocraft/types/smartcrop.ts

export interface DetectedFace {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  landmarks?: FaceLandmarks;
}

export interface FaceLandmarks {
  leftEye?: Point;
  rightEye?: Point;
  nose?: Point;
  mouth?: Point;
  leftEar?: Point;
  rightEar?: Point;
}

export interface Point {
  x: number;
  y: number;
}

export interface SmartCropOptions {
  aspectRatio?: number; // 16:9 = 1.77, 4:3 = 1.33, 1:1 = 1
  padding?: number; // Percentage of padding around detected faces
  minFaceSize?: number; // Minimum face size in pixels
  maxFaces?: number; // Maximum number of faces to detect
  includeAllFaces?: boolean; // Include all detected faces in crop
  centerFaces?: boolean; // Center the crop around faces
  qualityMode?: 'fast' | 'balanced' | 'quality';
}

export interface SmartCropResult {
  x: number;
  y: number;
  width: number;
  height: number;
  faces: DetectedFace[];
  confidence: number;
  suggestion?: string; // Suggestion for better crop
}

export interface CropPreset {
  name: string;
  aspectRatio: number;
  icon?: string;
}

export const CROP_PRESETS: CropPreset[] = [
  { name: 'Square', aspectRatio: 1, icon: '◻' },
  { name: '16:9', aspectRatio: 16/9, icon: '📺' },
  { name: '4:3', aspectRatio: 4/3, icon: '📷' },
  { name: '3:2', aspectRatio: 3/2, icon: '📸' },
  { name: '9:16', aspectRatio: 9/16, icon: '📱' },
  { name: 'Free', aspectRatio: 0, icon: '✂️' }
];