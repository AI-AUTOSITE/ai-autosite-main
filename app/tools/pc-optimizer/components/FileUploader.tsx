import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  onFileUpload: (content: string) => void;
  isAnalyzing: boolean;
}

export default function FileUploader({ onFileUpload, isAnalyzing }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const processFile = (file: File) => {
    setError('');
    
    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setError('Only CSV files are supported');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB');
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileUpload(content);
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
      <h3 className="text-xl font-bold text-white mb-6">
        Upload File
      </h3>

      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all
          ${isDragging 
            ? 'border-cyan-500 bg-cyan-500/10' 
            : 'border-gray-500 hover:border-gray-400 bg-white/5'
          }
          ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isAnalyzing}
        />

        <div className="space-y-4">
          {isAnalyzing ? (
            <>
              <div className="mx-auto w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-lg font-medium text-gray-300">
                Analyzing file...
              </p>
            </>
          ) : (
            <>
              <Upload className="mx-auto w-12 h-12 text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-300">
                  Drop CSV file here
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  or click to select file
                </p>
              </div>
            </>
          )}

          {fileName && !isAnalyzing && (
            <div className="flex items-center justify-center space-x-2 text-sm text-green-400">
              <FileText className="w-4 h-4" />
              <span>{fileName}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center space-x-2 text-sm text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        <p>Uploaded files are automatically deleted after analysis</p>
        <p>No personal information or file contents are saved</p>
      </div>
    </div>
  );
}