// app/tools/photocraft/types/batch.ts
export interface BatchJob {
  id: string;
  files: File[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  totalFiles: number;
  processedFiles: number;
  filters: FilterConfig[];
  outputFormat: 'png' | 'jpeg' | 'webp';
  outputQuality: number;
  createdAt: Date;
  completedAt?: Date;
  results: ProcessedFile[];
  errors: BatchError[];
}

export interface ProcessedFile {
  originalName: string;
  processedUrl: string;
  blob: Blob;
  size: number;
  processingTime: number;
}

export interface BatchError {
  fileName: string;
  error: string;
  timestamp: Date;
}

export interface FilterConfig {
  type: string;
  params: Record<string, any>;
}

export interface BatchQueueState {
  jobs: BatchJob[];
  activeJobId: string | null;
  isProcessing: boolean;
  maxConcurrent: number; // 並列処理数
}