// app/components/audio/FileDropZone.tsx
// ファイルアップロードコンポーネント（ドラッグ&ドロップ対応）
'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Upload, FileAudio, X, AlertCircle } from 'lucide-react';
import { SUPPORTED_AUDIO_FORMATS, FILE_SIZE_LIMITS } from '../../lib/audio-toolkit/types';

// デフォルト対応フォーマット
const DEFAULT_ACCEPT = SUPPORTED_AUDIO_FORMATS;

interface FileDropZoneProps {
  onFilesAccepted: (files: File[]) => void;
  onFilesRejected?: (rejections: FileRejection[]) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  isLoading?: boolean;
  loadingProgress?: number;
  loadingMessage?: string;
  className?: string;
  selectedFile?: File | null;
  onClear?: () => void;
  label?: string;
  description?: string;
}

/**
 * ファイルアップロードコンポーネント
 * 
 * @example
 * ```tsx
 * <FileDropZone
 *   onFilesAccepted={(files) => handleFiles(files)}
 *   selectedFile={file}
 *   onClear={() => setFile(null)}
 *   maxSize={100 * 1024 * 1024}
 * />
 * ```
 */
export function FileDropZone({
  onFilesAccepted,
  onFilesRejected,
  accept = DEFAULT_ACCEPT,
  maxSize = FILE_SIZE_LIMITS.audio.desktop,
  maxFiles = 1,
  disabled = false,
  isLoading = false,
  loadingProgress = 0,
  loadingMessage = 'Loading...',
  className = '',
  selectedFile,
  onClear,
  label = 'Drop audio file here or click to browse',
  description,
}: FileDropZoneProps) {
  const [rejectionError, setRejectionError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejections: FileRejection[]) => {
      setRejectionError(null);
      
      if (acceptedFiles.length > 0) {
        onFilesAccepted(acceptedFiles);
      }
      
      if (rejections.length > 0) {
        // エラーメッセージを生成
        const rejection = rejections[0];
        const errorCode = rejection.errors[0]?.code;
        
        let errorMessage = 'File could not be uploaded.';
        if (errorCode === 'file-too-large') {
          errorMessage = `File is too large. Maximum size is ${formatFileSize(maxSize)}.`;
        } else if (errorCode === 'file-invalid-type') {
          errorMessage = 'Unsupported file format. Try MP3, WAV, OGG, FLAC, or M4A.';
        }
        
        setRejectionError(errorMessage);
        onFilesRejected?.(rejections);
      }
    },
    [onFilesAccepted, onFilesRejected, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    disabled: disabled || isLoading,
    multiple: maxFiles > 1,
  });

  // ファイルサイズをフォーマット
  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // 対応フォーマットの説明文を生成
  const formatDescription = description || `MP3, WAV, OGG, FLAC, M4A (max ${formatFileSize(maxSize)})`;

  // ローディング中の表示
  if (isLoading) {
    return (
      <div
        className={`flex flex-col items-center justify-center w-full p-8 md:p-12
          border-2 border-dashed border-blue-500 bg-blue-500/10 rounded-xl
          ${className}`}
      >
        <div className="w-full max-w-xs space-y-4">
          {/* プログレスバー */}
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          
          {/* メッセージ */}
          <p className="text-center text-gray-300 text-sm">
            {loadingMessage}
          </p>
          
          {/* パーセント */}
          <p className="text-center text-blue-400 text-lg font-medium">
            {loadingProgress}%
          </p>
        </div>
      </div>
    );
  }

  // ファイルが選択されている場合
  if (selectedFile) {
    return (
      <div
        className={`flex items-center justify-between p-4 
          bg-gray-800/50 border border-gray-700 rounded-xl
          ${className}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 p-2 bg-blue-500/20 rounded-lg">
            <FileAudio className="w-6 h-6 text-blue-400" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-medium truncate">
              {selectedFile.name}
            </p>
            <p className="text-gray-400 text-sm">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
        </div>
        
        {onClear && (
          <button
            onClick={onClear}
            disabled={disabled}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-white 
              hover:bg-gray-700 rounded-lg transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Clear file"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }

  // ドロップゾーン
  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full p-8 md:p-12
          border-2 border-dashed rounded-xl transition-all cursor-pointer
          ${isDragReject || rejectionError
            ? 'border-red-500 bg-red-500/10'
            : isDragActive
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-gray-600 bg-gray-800/30 hover:border-gray-500 hover:bg-gray-800/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}`}
      >
        <input {...getInputProps()} />

        {/* アイコン */}
        <div
          className={`p-4 rounded-full mb-4 transition-colors
            ${isDragReject || rejectionError
              ? 'bg-red-500/20'
              : isDragActive
              ? 'bg-blue-500/20'
              : 'bg-gray-700/50'
            }`}
        >
          {isDragReject || rejectionError ? (
            <AlertCircle className="w-8 h-8 text-red-400" />
          ) : (
            <Upload
              className={`w-8 h-8 ${isDragActive ? 'text-blue-400' : 'text-gray-400'}`}
            />
          )}
        </div>

        {/* メインテキスト */}
        <p className="text-white font-medium text-center">
          {isDragReject
            ? 'Unsupported file format'
            : isDragActive
            ? 'Drop your file here'
            : label}
        </p>

        {/* サブテキスト */}
        <p className="text-gray-400 text-sm mt-2 text-center">
          {formatDescription}
        </p>
      </div>

      {/* エラーメッセージ */}
      {rejectionError && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{rejectionError}</p>
        </div>
      )}
    </div>
  );
}

export default FileDropZone;
