// app/tools/photocraft/components/Batch/BatchProcessor.tsx
'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useBatch } from '../../contexts/BatchContext';
import { BatchProcessor as ProcessorClass } from '../../lib/batch/processor';
import { FilterConfig } from '../../types/batch';
import { downloadImage } from '../../lib/utils/image';
import { useFilterContext } from '../../contexts/FilterContext';

export default function BatchProcessor() {
  const { state, addBatchJob, dispatch } = useBatch();
  const { activeFilters } = useFilterContext();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpeg' | 'webp'>('jpeg');
  const [outputQuality, setOutputQuality] = useState(85);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const processorRef = useRef<ProcessorClass | null>(null);

  // Initialize processor
  if (!processorRef.current) {
    processorRef.current = new ProcessorClass();
  }

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleStartBatch = useCallback(async () => {
    if (selectedFiles.length === 0 || activeFilters.length === 0) return;

    setIsProcessing(true);

    // Create filter config from active filters
    const filterConfigs: FilterConfig[] = activeFilters.map(filter => ({
      type: filter.type,
      params: filter.params
    }));

    // Add job to queue
    addBatchJob(selectedFiles, filterConfigs, outputFormat, outputQuality);

    // Get the latest job
    const jobId = `batch-${Date.now()}`;
    
    // Process the job
    if (processorRef.current) {
      const job = state.jobs.find(j => j.id === jobId);
      
      if (job) {
        try {
          const results = await processorRef.current.processJob(
            job,
            (progress, processedFiles) => {
              dispatch({
                type: 'UPDATE_PROGRESS',
                payload: { id: jobId, progress, processedFiles }
              });
            },
            (result) => {
              // Handle each completed file
              console.log('File processed:', result.originalName);
            },
            (fileName, error) => {
              console.error(`Error processing ${fileName}:`, error);
            }
          );

          // Update job status
          dispatch({
            type: 'UPDATE_JOB',
            payload: {
              id: jobId,
              updates: {
                status: 'completed',
                completedAt: new Date(),
                results
              }
            }
          });

          // Clear selected files
          setSelectedFiles([]);
        } catch (error) {
          console.error('Batch processing error:', error);
          dispatch({
            type: 'UPDATE_JOB',
            payload: {
              id: jobId,
              updates: {
                status: 'failed'
              }
            }
          });
        }
      }
    }

    setIsProcessing(false);
  }, [selectedFiles, activeFilters, outputFormat, outputQuality, addBatchJob, dispatch, state.jobs]);

  const downloadAllResults = useCallback(async (jobId: string) => {
    const job = state.jobs.find(j => j.id === jobId);
    if (!job || job.status !== 'completed') return;

    for (const result of job.results) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      const img = new Image();
      img.src = result.processedUrl;
      
      await new Promise(resolve => {
        img.onload = resolve;
      });

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const filename = result.originalName.replace(/\.[^/.]+$/, '') + 
                      `_processed.${outputFormat}`;
      
      await downloadImage(canvas, filename, outputFormat, outputQuality / 100);
    }
  }, [state.jobs, outputFormat, outputQuality]);

  return (
    <div className="relative">
      {/* Batch Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Batch Process ({state.jobs.filter(j => j.status === 'pending').length})
      </button>

      {/* Batch Panel */}
      {isOpen && (
        <div className="absolute top-12 right-0 w-96 bg-gray-900 rounded-lg shadow-2xl p-6 z-50 border border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-white">Batch Processing</h3>

          {/* File Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Images
            </label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-3 border-2 border-dashed border-gray-600 rounded-lg hover:border-purple-500 transition-colors text-gray-400 hover:text-white"
            >
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Click to add images ({selectedFiles.length} selected)
            </button>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="mb-6 max-h-40 overflow-y-auto">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Selected Files
              </label>
              <div className="space-y-1">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded">
                    <span className="text-sm text-gray-300 truncate">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Output Settings */}
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Output Format
              </label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as 'png' | 'jpeg' | 'webp')}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              >
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
                <option value="webp">WebP</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quality: {outputQuality}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={outputQuality}
                onChange={(e) => setOutputQuality(Number(e.target.value))}
                className="w-full"
                disabled={outputFormat === 'png'}
              />
            </div>
          </div>

          {/* Active Filters Info */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Active Filters ({activeFilters.length})
            </label>
            <div className="text-sm text-gray-400">
              {activeFilters.length === 0 
                ? 'No filters selected. Add filters in the main editor.'
                : activeFilters.map(f => f.type).join(', ')}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartBatch}
            disabled={selectedFiles.length === 0 || activeFilters.length === 0 || isProcessing}
            className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
              selectedFiles.length > 0 && activeFilters.length > 0 && !isProcessing
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isProcessing ? 'Processing...' : `Process ${selectedFiles.length} Images`}
          </button>

          {/* Job Queue */}
          {state.jobs.length > 0 && (
            <div className="mt-6 border-t border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Processing Queue</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {state.jobs.map(job => (
                  <div key={job.id} className="bg-gray-800 p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-white">
                        {job.totalFiles} files
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        job.status === 'completed' ? 'bg-green-600' :
                        job.status === 'processing' ? 'bg-blue-600' :
                        job.status === 'failed' ? 'bg-red-600' : 'bg-gray-600'
                      } text-white`}>
                        {job.status}
                      </span>
                    </div>
                    
                    {job.status === 'processing' && (
                      <div className="mb-2">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 mt-1">
                          {job.processedFiles} / {job.totalFiles} processed
                        </span>
                      </div>
                    )}
                    
                    {job.status === 'completed' && (
                      <button
                        onClick={() => downloadAllResults(job.id)}
                        className="text-xs text-purple-400 hover:text-purple-300"
                      >
                        Download All
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}