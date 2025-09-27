// app/tools/photocraft/hooks/useCanvas.ts
import { useRef, useEffect, useCallback, useState } from 'react';

interface Point {
  x: number;
  y: number;
}

interface CanvasState {
  scale: number;
  offset: Point;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
}

interface UseCanvasOptions {
  width?: number;
  height?: number;
  minScale?: number;
  maxScale?: number;
  enableZoom?: boolean;
  enablePan?: boolean;
  enableRotation?: boolean;
}

export function useCanvas(options: UseCanvasOptions = {}) {
  const {
    width = 800,
    height = 600,
    minScale = 0.1,
    maxScale = 10,
    enableZoom = true,
    enablePan = true,
    enableRotation = true
  } = options;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  
  const [canvasState, setCanvasState] = useState<CanvasState>({
    scale: 1,
    offset: { x: 0, y: 0 },
    rotation: 0,
    flipH: false,
    flipV: false
  });

  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<Point>({ x: 0, y: 0 });

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    contextRef.current = context;
  }, [width, height]);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    if (!context || !canvas) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Draw image on canvas
  const drawImage = useCallback((image: HTMLImageElement | HTMLCanvasElement) => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    if (!context || !canvas) return;

    context.save();
    
    // Apply transformations
    context.translate(canvas.width / 2, canvas.height / 2);
    context.scale(canvasState.scale * (canvasState.flipH ? -1 : 1), 
                   canvasState.scale * (canvasState.flipV ? -1 : 1));
    context.rotate((canvasState.rotation * Math.PI) / 180);
    context.translate(canvasState.offset.x, canvasState.offset.y);

    // Draw the image centered
    context.drawImage(
      image,
      -image.width / 2,
      -image.height / 2,
      image.width,
      image.height
    );

    context.restore();
  }, [canvasState]);

  // Zoom functionality
  const zoom = useCallback((delta: number, center?: Point) => {
    if (!enableZoom) return;

    setCanvasState(prev => {
      const newScale = Math.max(minScale, Math.min(maxScale, prev.scale + delta));
      
      if (center) {
        // Zoom towards a specific point
        const scaleRatio = newScale / prev.scale;
        const newOffset = {
          x: center.x - (center.x - prev.offset.x) * scaleRatio,
          y: center.y - (center.y - prev.offset.y) * scaleRatio
        };
        return { ...prev, scale: newScale, offset: newOffset };
      }
      
      return { ...prev, scale: newScale };
    });
  }, [enableZoom, minScale, maxScale]);

  // Pan functionality
  const pan = useCallback((deltaX: number, deltaY: number) => {
    if (!enablePan) return;

    setCanvasState(prev => ({
      ...prev,
      offset: {
        x: prev.offset.x + deltaX,
        y: prev.offset.y + deltaY
      }
    }));
  }, [enablePan]);

  // Rotate functionality
  const rotate = useCallback((degrees: number) => {
    if (!enableRotation) return;

    setCanvasState(prev => ({
      ...prev,
      rotation: (prev.rotation + degrees) % 360
    }));
  }, [enableRotation]);

  // Flip functionality
  const flip = useCallback((horizontal: boolean) => {
    setCanvasState(prev => ({
      ...prev,
      flipH: horizontal ? !prev.flipH : prev.flipH,
      flipV: !horizontal ? !prev.flipV : prev.flipV
    }));
  }, []);

  // Reset transformations
  const resetTransform = useCallback(() => {
    setCanvasState({
      scale: 1,
      offset: { x: 0, y: 0 },
      rotation: 0,
      flipH: false,
      flipV: false
    });
  }, []);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const deltaX = e.clientX - lastPos.x;
    const deltaY = e.clientY - lastPos.y;

    if (e.shiftKey) {
      // Hold shift to pan
      pan(deltaX / canvasState.scale, deltaY / canvasState.scale);
    }

    setLastPos({ x: e.clientX, y: e.clientY });
  }, [isDrawing, lastPos, pan, canvasState.scale]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    if (e.ctrlKey || e.metaKey) {
      // Ctrl/Cmd + wheel for zoom
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const center = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      zoom(e.deltaY > 0 ? -0.1 : 0.1, center);
    } else {
      // Normal wheel for pan
      pan(-e.deltaX, -e.deltaY);
    }
  }, [zoom, pan]);

  // Get canvas as blob
  const getCanvasBlob = useCallback(async (
    type: string = 'image/png',
    quality: number = 0.95
  ): Promise<Blob | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        type,
        quality
      );
    });
  }, []);

  // Get canvas as data URL
  const getCanvasDataURL = useCallback((
    type: string = 'image/png',
    quality: number = 0.95
  ): string | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    return canvas.toDataURL(type, quality);
  }, []);

  return {
    canvasRef,
    contextRef,
    canvasState,
    clearCanvas,
    drawImage,
    zoom,
    pan,
    rotate,
    flip,
    resetTransform,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    getCanvasBlob,
    getCanvasDataURL,
    isDrawing
  };
}