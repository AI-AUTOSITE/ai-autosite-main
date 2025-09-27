// app/tools/photocraft/components/Tools/SmartCrop.tsx
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FaceDetector } from '../../lib/utils/faceDetection';
import { 
  SmartCropOptions, 
  SmartCropResult, 
  CROP_PRESETS,
  DetectedFace
} from '../../types/smartcrop';
import { loadImageFromFile } from '../../lib/utils/image';

interface SmartCropToolProps {
  image?: HTMLImageElement | HTMLCanvasElement;
  onCrop?: (result: SmartCropResult) => void;
  onClose?: () => void;
}

export default function SmartCropTool({ image, onCrop, onClose }: SmartCropToolProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedFaces, setDetectedFaces] = useState<DetectedFace[]>([]);
  const [cropResult, setCropResult] = useState<SmartCropResult | null>(null);
  const [selectedPreset, setSelectedPreset] = useState(CROP_PRESETS[0]);
  const [options, setOptions] = useState<SmartCropOptions>({
    aspectRatio: 1,
    padding: 20,
    includeAllFaces: true,
    centerFaces: true,
    qualityMode: 'balanced'
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const detectorRef = useRef<FaceDetector | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize face detector
  useEffect(() => {
    if (!detectorRef.current) {
      detectorRef.current = new FaceDetector();
    }
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    const img = await loadImageFromFile(file);
    setPreviewImage(img.src);
    
    // Auto-detect faces when image is uploaded
    await detectFaces(img);
  }, []);

  // Detect faces in the image
  const detectFaces = useCallback(async (img?: HTMLImageElement | HTMLCanvasElement) => {
    const targetImage = img || image;
    if (!targetImage || !detectorRef.current) return;

    setIsDetecting(true);
    try {
      const faces = await detectorRef.current.detectFaces(targetImage, options);
      setDetectedFaces(faces);
      
      // Calculate smart crop
      const crop = detectorRef.current.calculateSmartCrop(
        targetImage.width,
        targetImage.height,
        faces,
        options
      );
      setCropResult(crop);
      
      // Draw preview
      drawPreview(targetImage, crop, faces);
    } catch (error) {
      console.error('Face detection error:', error);
    } finally {
      setIsDetecting(false);
    }
  }, [image, options]);

  // Draw preview with detected faces and crop area
  const drawPreview = useCallback((
    img: HTMLImageElement | HTMLCanvasElement,
    crop: SmartCropResult,
    faces: DetectedFace[]
  ) => {
    const canvas = canvasRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!canvas || !previewCanvas) return;

    const ctx = canvas.getContext('2d');
    const previewCtx = previewCanvas.getContext('2d');
    if (!ctx || !previewCtx) return;

    // Set canvas size
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Draw face rectangles
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    faces.forEach(face => {
      ctx.strokeRect(face.x, face.y, face.width, face.height);
      
      // Draw confidence
      ctx.fillStyle = '#00ff00';
      ctx.font = '12px Arial';
      ctx.fillText(
        `${Math.round(face.confidence * 100)}%`,
        face.x,
        face.y - 5
      );
    });

    // Draw crop area
    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);
    ctx.setLineDash([]);

    // Darken area outside crop
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, crop.y);
    ctx.fillRect(0, crop.y, crop.x, crop.height);
    ctx.fillRect(crop.x + crop.width, crop.y, canvas.width - crop.x - crop.width, crop.height);
    ctx.fillRect(0, crop.y + crop.height, canvas.width, canvas.height - crop.y - crop.height);

    // Draw cropped preview
    previewCanvas.width = crop.width;
    previewCanvas.height = crop.height;
    previewCtx.drawImage(
      img,
      crop.x, crop.y, crop.width, crop.height,
      0, 0, crop.width, crop.height
    );
  }, []);

  // Handle preset selection
  const handlePresetSelect = useCallback((preset: typeof CROP_PRESETS[0]) => {
    setSelectedPreset(preset);
    setOptions(prev => ({ ...prev, aspectRatio: preset.aspectRatio }));
    
    // Re-detect with new aspect ratio
    if (image || previewImage) {
      detectFaces();
    }
  }, [image, previewImage, detectFaces]);

  // Apply crop
  const handleApplyCrop = useCallback(() => {
    if (cropResult && onCrop) {
      onCrop(cropResult);
    }
  }, [cropResult, onCrop]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Smart Crop (Face Detection)
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Left Panel - Options */}
          <div className="w-80 bg-gray-800 p-6 overflow-y-auto">
            {/* File Upload */}
            {!image && (
              <div className="mb-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-600 rounded-lg hover:border-purple-500 transition-colors text-gray-400 hover:text-white"
                >
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Upload Image
                </button>
              </div>
            )}

            {/* Aspect Ratio Presets */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CROP_PRESETS.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => handlePresetSelect(preset)}
                    className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                      selectedPreset.name === preset.name
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <span className="mr-1">{preset.icon}</span>
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Padding: {options.padding}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={options.padding}
                  onChange={(e) => setOptions(prev => ({ ...prev, padding: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quality Mode
                </label>
                <select
                  value={options.qualityMode}
                  onChange={(e) => setOptions(prev => ({ 
                    ...prev, 
                    qualityMode: e.target.value as 'fast' | 'balanced' | 'quality' 
                  }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                >
                  <option value="fast">Fast</option>
                  <option value="balanced">Balanced</option>
                  <option value="quality">Quality</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeAll"
                  checked={options.includeAllFaces}
                  onChange={(e) => setOptions(prev => ({ ...prev, includeAllFaces: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="includeAll" className="text-sm text-gray-300">
                  Include all detected faces
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="centerFaces"
                  checked={options.centerFaces}
                  onChange={(e) => setOptions(prev => ({ ...prev, centerFaces: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="centerFaces" className="text-sm text-gray-300">
                  Center crop around faces
                </label>
              </div>
            </div>

            {/* Detection Info */}
            {detectedFaces.length > 0 && (
              <div className="mt-6 p-4 bg-gray-700 rounded">
                <p className="text-sm text-green-400 mb-2">
                  ✅ {detectedFaces.length} face{detectedFaces.length > 1 ? 's' : ''} detected
                </p>
                {cropResult && (
                  <p className="text-xs text-gray-400">
                    {cropResult.suggestion}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 space-y-2">
              <button
                onClick={() => detectFaces()}
                disabled={!image && !previewImage || isDetecting}
                className={`w-full py-2 rounded font-medium transition-all ${
                  !image && !previewImage || isDetecting
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isDetecting ? 'Detecting...' : 'Detect Faces'}
              </button>
              
              <button
                onClick={handleApplyCrop}
                disabled={!cropResult}
                className={`w-full py-2 rounded font-medium transition-all ${
                  !cropResult
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                }`}
              >
                Apply Crop
              </button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="flex-1 bg-gray-950 p-6 overflow-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              {/* Original with detection overlay */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">Original + Detection</h3>
                <div className="bg-gray-900 rounded-lg p-4 h-[calc(100%-32px)] flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full max-h-full object-contain"
                  />
                  {(!image && !previewImage) && (
                    <p className="text-gray-500">Upload an image to begin</p>
                  )}
                </div>
              </div>

              {/* Cropped preview */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">Cropped Preview</h3>
                <div className="bg-gray-900 rounded-lg p-4 h-[calc(100%-32px)] flex items-center justify-center">
                  <canvas
                    ref={previewCanvasRef}
                    className="max-w-full max-h-full object-contain"
                  />
                  {!cropResult && (
                    <p className="text-gray-500">Detect faces to see preview</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}