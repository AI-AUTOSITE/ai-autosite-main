// app/tools/pc-optimizer/lib/analyzer.ts

import Papa from 'papaparse';
import { AnalyzedSoftware, RawFileData } from './types';
import { identifySoftware, getCategoryFromPath } from './softwareDatabase';
import {
  formatBytes,
  formatDateDifference,
  parseDate,
  calculateTotalSize,
  findMostRecentAccess,
  determinePriority,
  groupFilesByDirectory,
  extractSoftwareName,
  validateCsvData,
} from '../utils';
import { ERROR_MESSAGES } from '../constants';

// Aggregate software information from multiple files
function aggregateSoftware(files: RawFileData[]): AnalyzedSoftware {
  // Find main executable (exclude uninstall and update files)
  const mainExe = files.find(f => 
    !f.Name.toLowerCase().includes('uninstall') &&
    !f.Name.toLowerCase().includes('update')
  ) || files[0];
  
  const identified = identifySoftware(mainExe.Name, mainExe.DirectoryName);
  const totalSize = calculateTotalSize(files);
  const mostRecentAccess = findMostRecentAccess(files);
  const category = identified?.category || getCategoryFromPath(mainExe.DirectoryName);
  
  return {
    id: `${mainExe.DirectoryName}-${mainExe.Name}`,
    name: mainExe.Name,
    displayName: identified?.displayName || extractSoftwareName(mainExe.DirectoryName),
    path: mainExe.DirectoryName,
    size: totalSize,
    sizeFormatted: formatBytes(totalSize),
    lastUsed: mostRecentAccess,
    lastUsedFormatted: formatDateDifference(mostRecentAccess),
    category: category,
    priority: determinePriority(mostRecentAccess, category),
    isStartup: identified?.isStartup || false,
    cacheSize: identified?.estimatedCacheSize,
    cacheSizeFormatted: identified?.estimatedCacheSize 
      ? formatBytes(identified.estimatedCacheSize) 
      : undefined,
    description: identified?.description,
    tips: identified?.tips,
  };
}

// Main analysis function
export async function analyzeFiles(csvContent: string): Promise<AnalyzedSoftware[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // Keep all as strings for consistent parsing
      
      complete: (result) => {
        try {
          // Validate CSV data structure
          if (!validateCsvData(result.data)) {
            throw new Error(ERROR_MESSAGES.INVALID_DATA);
          }
          
          const files = result.data as RawFileData[];
          
          // Group files by directory
          const grouped = groupFilesByDirectory(files);
          const analyzed: AnalyzedSoftware[] = [];
          
          // Process each directory group
          grouped.forEach((files, directory) => {
            try {
              const software = aggregateSoftware(files);
              analyzed.push(software);
            } catch (error) {
              // Log warning but continue processing other directories
              console.warn(`Failed to analyze directory: ${directory}`, error);
            }
          });
          
          // Sort by size (largest first)
          analyzed.sort((a, b) => b.size - a.size);
          
          resolve(analyzed);
        } catch (error) {
          console.error('Analysis error:', error);
          reject(new Error(
            error instanceof Error 
              ? error.message 
              : ERROR_MESSAGES.ANALYSIS_ERROR
          ));
        }
      },
      
      error: (error) => {
        console.error('Parse error:', error);
        reject(new Error(ERROR_MESSAGES.PARSE_ERROR));
      },
    });
  });
}

// Export utility functions for use in components
export { formatBytes, formatDateDifference } from '../utils';