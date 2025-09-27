// app/tools/photocraft/contexts/BatchContext.tsx
'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { BatchJob, BatchQueueState } from '../types/batch';

type BatchAction =
  | { type: 'ADD_JOB'; payload: BatchJob }
  | { type: 'UPDATE_JOB'; payload: { id: string; updates: Partial<BatchJob> } }
  | { type: 'REMOVE_JOB'; payload: string }
  | { type: 'SET_ACTIVE_JOB'; payload: string | null }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'UPDATE_PROGRESS'; payload: { id: string; progress: number; processedFiles: number } }
  | { type: 'CLEAR_COMPLETED' };

const initialState: BatchQueueState = {
  jobs: [],
  activeJobId: null,
  isProcessing: false,
  maxConcurrent: 3
};

function batchReducer(state: BatchQueueState, action: BatchAction): BatchQueueState {
  switch (action.type) {
    case 'ADD_JOB':
      return {
        ...state,
        jobs: [...state.jobs, action.payload]
      };
    
    case 'UPDATE_JOB':
      return {
        ...state,
        jobs: state.jobs.map(job =>
          job.id === action.payload.id
            ? { ...job, ...action.payload.updates }
            : job
        )
      };
    
    case 'REMOVE_JOB':
      return {
        ...state,
        jobs: state.jobs.filter(job => job.id !== action.payload),
        activeJobId: state.activeJobId === action.payload ? null : state.activeJobId
      };
    
    case 'SET_ACTIVE_JOB':
      return {
        ...state,
        activeJobId: action.payload
      };
    
    case 'SET_PROCESSING':
      return {
        ...state,
        isProcessing: action.payload
      };
    
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        jobs: state.jobs.map(job =>
          job.id === action.payload.id
            ? {
                ...job,
                progress: action.payload.progress,
                processedFiles: action.payload.processedFiles
              }
            : job
        )
      };
    
    case 'CLEAR_COMPLETED':
      return {
        ...state,
        jobs: state.jobs.filter(job => job.status !== 'completed')
      };
    
    default:
      return state;
  }
}

interface BatchContextValue {
  state: BatchQueueState;
  dispatch: React.Dispatch<BatchAction>;
  addBatchJob: (files: File[], filters: any[], outputFormat: string, outputQuality: number) => void;
  startProcessing: () => void;
  pauseProcessing: () => void;
  cancelJob: (jobId: string) => void;
  downloadResults: (jobId: string) => void;
}

const BatchContext = createContext<BatchContextValue | undefined>(undefined);

export function BatchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(batchReducer, initialState);

  const addBatchJob = (
    files: File[],
    filters: any[],
    outputFormat: string,
    outputQuality: number
  ) => {
    const newJob: BatchJob = {
      id: `batch-${Date.now()}`,
      files,
      status: 'pending',
      progress: 0,
      totalFiles: files.length,
      processedFiles: 0,
      filters,
      outputFormat: outputFormat as 'png' | 'jpeg' | 'webp',
      outputQuality,
      createdAt: new Date(),
      results: [],
      errors: []
    };

    dispatch({ type: 'ADD_JOB', payload: newJob });
  };

  const startProcessing = () => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    // Processing logic will be implemented
  };

  const pauseProcessing = () => {
    dispatch({ type: 'SET_PROCESSING', payload: false });
  };

  const cancelJob = (jobId: string) => {
    dispatch({ type: 'REMOVE_JOB', payload: jobId });
  };

  const downloadResults = (jobId: string) => {
    // Download implementation
  };

  return (
    <BatchContext.Provider
      value={{
        state,
        dispatch,
        addBatchJob,
        startProcessing,
        pauseProcessing,
        cancelJob,
        downloadResults
      }}
    >
      {children}
    </BatchContext.Provider>
  );
}

export const useBatch = () => {
  const context = useContext(BatchContext);
  if (!context) {
    throw new Error('useBatch must be used within BatchProvider');
  }
  return context;
};