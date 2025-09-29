import { RotateCw } from 'lucide-react';

interface RotateUIProps {
  onRotate: (angle: number) => void;
  selectedCount: number;
}

export function RotateUI({ onRotate, selectedCount }: RotateUIProps) {
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <div className="flex items-center mb-4">
        <RotateCw className="w-5 h-5 text-cyan-400 mr-2" />
        <h3 className="font-semibold">Rotate Pages</h3>
      </div>
      
      <p className="text-sm text-gray-400 mb-4">
        {selectedCount > 0 
          ? `Rotating ${selectedCount} page(s)`
          : 'Select pages to rotate'}
      </p>
      
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => onRotate(90)}
          className="px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
        >
          90° →
        </button>
        <button
          onClick={() => onRotate(-90)}
          className="px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
        >
          90° ←
        </button>
        <button
          onClick={() => onRotate(180)}
          className="px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
        >
          180°
        </button>
      </div>
    </div>
  );
}