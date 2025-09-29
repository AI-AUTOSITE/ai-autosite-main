import { useState, useCallback } from 'react';
import { AnalyzedSoftware } from '../lib/types';
import { analyzeFiles } from '../lib/analyzer';

interface UseFileAnalysisReturn {
  analyzedData: AnalyzedSoftware[];
  isAnalyzing: boolean;
  error: string | null;
  handleFileUpload: (fileContent: string) => Promise<void>;
  clearData: () => void;
  clearError: () => void;
}

/**
 * Custom hook for file analysis management
 * Handles state, error handling, and analysis process
 */
export function useFileAnalysis(): UseFileAnalysisReturn {
  const [analyzedData, setAnalyzedData] = useState<AnalyzedSoftware[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (fileContent: string) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const results = await analyzeFiles(fileContent);
      
      if (results.length === 0) {
        throw new Error('No software data found in the uploaded file');
      }
      
      setAnalyzedData(results);
    } catch (err) {
      console.error('Analysis error:', err);
      
      // Set user-friendly error message
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while analyzing the file');
      }
      
      // Clear any partial data
      setAnalyzedData([]);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setAnalyzedData([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    analyzedData,
    isAnalyzing,
    error,
    handleFileUpload,
    clearData,
    clearError,
  };
}