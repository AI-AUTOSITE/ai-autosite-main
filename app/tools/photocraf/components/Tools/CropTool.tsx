// app/tools/photocraft/components/Tools/CropTool.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CROP_PRESETS } from '../../types/smartcrop';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CropToolProps {
  image?: HTMLImageElement | HTMLCanvasElement;
  onCrop?: (cropArea: CropArea) => void;
  onCancel?: () => void;
}

export default function CropTool({ image, onCrop, onCancel }: CropToolProps) {
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedPreset, setSelectedPreset] = useState(CROP_PRESETS[0]);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize crop area when image loads
  useEffect(() => {
    if (image) {
      const width = image.width;
      const height = image.height;
      setImageSize({ width, height });
      
      // Set initial crop to center of image
      setCropArea({
        x: width * 0.1,
        y: height * 0.1,
        width: width * 0.8,
        height: height * 0.8
      });
    }
  }, [image]);

  // Draw image and crop overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw image
    ctx.drawImage(image, 0, 0);

    // Draw darkened overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clear crop area (show original image)
    ctx.clearRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
    ctx.drawImage(
      image,
      cropArea.x, cropArea.y, cropArea.width, cropArea.height,
      cropArea.x, cropArea.y, cropArea.width, cropArea.height
    );

    // Draw crop border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
    ctx.setLineDash([]);

    // Draw resize handles
    const handleSize = 8;
    ctx.fillStyle = '#fff';
    
    // Corners
    ctx.fillRect(cropArea.x - handleSize/2, cropArea.y - handleSize/2, handleSize, handleSize);
    ctx.fillRect(cropArea.x + cropArea.width - handleSize/2, cropArea.y - handleSize/2, handleSize, handleSize);
    ctx.fillRect(cropArea.x - handleSize/2, cropArea.y + cropArea.height - handleSize/2, handleSize, handleSize);
    ctx.fillRect(cropArea.x + cropArea.width - handleSize/2, cropArea.y + cropArea.height - handleSize/2, handleSize, handleSize);
    
    // Middle edges
    ctx.fillRect(cropArea.x + cropArea.width/2 - handleSize/2, cropArea.y - handleSize/2, handleSize, handleSize);
    ctx.fillRect(cropArea.x + cropArea.width/2 - handleSize/2, cropArea.y + cropArea.height - handleSize/2, handleSize, handleSize);
    ctx.fillRect(cropArea.x - handleSize/2, cropArea.y + cropArea.height/2 - handleSize/2, handleSize, handleSize);
    ctx.fillRect(cropArea.x + cropArea.width - handleSize/2, cropArea.y + cropArea.height/2 - handleSize/2, handleSize, handleSize);

    // Draw rule of thirds grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    
    // Vertical lines
    ctx.beginPath();
    ctx.moveTo(cropArea.x + cropArea.width/3, cropArea.y);
    ctx.lineTo(cropArea.x + cropArea.width/3, cropArea.y + cropArea.height);
    ctx.moveTo(cropArea.x + cropArea.width*2/3, cropArea.y);
    ctx.lineTo(cropArea.x + cropArea.width*2/3, cropArea.y + cropArea.height);
    ctx.stroke();
    
    // Horizontal lines
    ctx.beginPath();
    ctx.moveTo(cropArea.x, cropArea.y + cropArea.height/3);
    ctx.lineTo(cropArea.x + cropArea.width, cropArea.y + cropArea.height/3);
    ctx.moveTo(cropArea.x, cropArea.y + cropArea.height*2/3);
    ctx.lineTo(cropArea.x + cropArea.width, cropArea.y + cropArea.height*2/3);
    ctx.stroke();

  }, [image, cropArea]);

  // Get resize handle at position
  const getResizeHandle = useCallback((x: number, y: number): string | null => {
    const threshold = 10;
    const { x: cx, y: cy, width, height } = cropArea;

    // Corners
    if (Math.abs(x - cx) < threshold && Math.abs(y - cy) < threshold) return 'nw';
    if (Math.abs(x - (cx + width)) < threshold && Math.abs(y - cy) < threshold) return 'ne';
    if (Math.abs(x - cx) < threshold && Math.abs(y - (cy + height)) < threshold) return 'sw';
    if (Math.abs(x - (cx + width)) < threshold && Math.abs(y - (cy + height)) < threshold) return 'se';
    
    // Edges
    if (Math.abs(x - (cx + width/2)) < threshold && Math.abs(y - cy) < threshold) return 'n';
    if (Math.abs(x - (cx + width/2)) < threshold && Math.abs(y - (cy + height)) < threshold) return 's';
    if (Math.abs(x - cx) < threshold && Math.abs(y - (cy + height/2)) < threshold) return 'w';
    if (Math.abs(x - (cx + width)) < threshold && Math.abs(y - (cy + height/2)) < threshold) return 'e';

    // Inside crop area
    if (x > cx && x < cx + width && y > cy && y < cy + height) return 'move';

    return null;
  }, [cropArea]);

  // Handle mouse down
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) * (imageSize.width / rect.width);
    const y = (e.clientY - rect.top) * (imageSize.height / rect.height);

    const handle = getResizeHandle(x, y);
    
    if (handle === 'move') {
      setIsDragging(true);
      setDragStart({ x: x - cropArea.x, y: y - cropArea.y });
    } else if (handle) {
      setIsResizing(handle);
      setDragStart({ x, y });
    }
  }, [cropArea, imageSize, getResizeHandle]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) * (imageSize.width / rect.width);
    const y = (e.clientY - rect.top) * (imageSize.height / rect.height);

    // Update cursor
    const handle = getResizeHandle(x, y);
    if (handle === 'move') {
      e.currentTarget.style.cursor = 'move';
    } else if (handle) {
      const cursors: Record<string, string> = {
        n: 'ns-resize', s: 'ns-resize',
        e: 'ew-resize', w: 'ew-resize',
        ne: 'nesw-resize', sw: 'nesw-resize',
        nw: 'nwse-resize', se: 'nwse-resize'
      };
      e.currentTarget.style.cursor = cursors[handle];
    } else {
      e.currentTarget.style.cursor = 'default';
    }

    // Handle dragging
    if (isDragging) {
      const newX = Math.max(0, Math.min(imageSize.width - cropArea.width, x - dragStart.x));
      const newY = Math.max(0, Math.min(imageSize.height - cropArea.height, y - dragStart.y));
      setCropArea(prev => ({ ...prev, x: newX, y: newY }));
    }

    // Handle resizing
    if (isResizing) {
      const dx = x - dragStart.x;
      const dy = y - dragStart.y;
      let newCrop = { ...cropArea };

      // Apply aspect ratio constraint if preset selected
      const aspectRatio = selectedPreset.aspectRatio;

      switch (isResizing) {
        case 'nw':
          newCrop.x = Math.min(cropArea.x + cropArea.width - 20, cropArea.x + dx);
          newCrop.y = Math.min(cropArea.y + cropArea.height - 20, cropArea.y + dy);
          newCrop.width = cropArea.width - (newCrop.x - cropArea.x);
          newCrop.height = cropArea.height - (newCrop.y - cropArea.y);
          break;
        case 'ne':
          newCrop.y = Math.min(cropArea.y + cropArea.height - 20, cropArea.y + dy);
          newCrop.width = Math.max(20, cropArea.width + dx);
          newCrop.height = cropArea.height - (newCrop.y - cropArea.y);
          break;
        case 'sw':
          newCrop.x = Math.min(cropArea.x + cropArea.width - 20, cropArea.x + dx);
          newCrop.width = cropArea.width - (newCrop.x - cropArea.x);
          newCrop.height = Math.max(20, cropArea.height + dy);
          break;
        case 'se':
          newCrop.width = Math.max(20, cropArea.width + dx);
          newCrop.height = Math.max(20, cropArea.height + dy);
          break;
        case 'n':
          newCrop.y = Math.min(cropArea.y + cropArea.height - 20, cropArea.y + dy);
          newCrop.height = cropArea.height - (newCrop.y - cropArea.y);
          break;
        case 's':
          newCrop.height = Math.max(20, cropArea.height + dy);
          break;
        case 'w':
          newCrop.x = Math.min(cropArea.x + cropArea.width - 20, cropArea.x + dx);
          newCrop.width = cropArea.width - (newCrop.x - cropArea.x);
          break;
        case 'e':
          newCrop.width = Math.max(20, cropArea.width + dx);
          break;
      }

      // Apply aspect ratio if set
      if (aspectRatio > 0 && ['nw', 'ne', 'sw', 'se'].includes(isResizing)) {
        const currentRatio = newCrop.width / newCrop.height;
        if (currentRatio > aspectRatio) {
          newCrop.width = newCrop.height * aspectRatio;
        } else {
          newCrop.height = newCrop.width / aspectRatio;
        }
      }

      // Ensure within bounds
      newCrop.x = Math.max(0, newCrop.x);
      newCrop.y = Math.max(0, newCrop.y);
      newCrop.width = Math.min(imageSize.width - newCrop.x, newCrop.width);
      newCrop.height = Math.min(imageSize.height - newCrop.y, newCrop.height);

      setCropArea(newCrop);
      setDragStart({ x, y });
    }
  }, [isDragging, isResizing, dragStart, cropArea, imageSize, selectedPreset, getResizeHandle]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(null);
  }, []);

  // Handle preset selection
  const handlePresetSelect = useCallback((preset: typeof CROP_PRESETS[0]) => {
    setSelectedPreset(preset);
    
    if (preset.aspectRatio > 0) {
      // Apply aspect ratio to current crop
      const currentRatio = cropArea.width / cropArea.height;
      let newCrop = { ...cropArea };
      
      if (currentRatio > preset.aspectRatio) {
        newCrop.width = cropArea.height * preset.aspectRatio;
      } else {
        newCrop.height = cropArea.width / preset.aspectRatio;
      }
      
      setCropArea(newCrop);
    }
  }, [cropArea]);

  // Apply crop
  const handleApply = useCallback(() => {
    if (onCrop) {
      onCrop(cropArea);
    }
  }, [cropArea, onCrop]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg shadow-2xl max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 px-6 py-3 flex items-center justify-between border-b border-gray-700">
          <h3 className="text-lg font-medium text-white">Crop Tool</h3>
          <div className="flex gap-2">
            {CROP_PRESETS.map(preset => (
              <button
                key={preset.name}
                onClick={() => handlePresetSelect(preset)}
                className={`px-3 py-1 rounded text-sm ${
                  selectedPreset.name === preset.name
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {preset.icon} {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div ref={containerRef} className="p-4 bg-gray-950">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="max-w-full max-h-[70vh] cursor-move"
          />
        </div>

        {/* Footer */}
        <div className="bg-gray-800 px-6 py-3 flex items-center justify-between border-t border-gray-700">
          <div className="text-sm text-gray-400">
            {Math.round(cropArea.width)} × {Math.round(cropArea.height)}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}