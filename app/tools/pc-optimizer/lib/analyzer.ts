import Papa from 'papaparse';
import { AnalyzedSoftware, RawFileData, Priority } from './types';
import { identifySoftware, getCategoryFromPath } from './softwareDatabase';

// Constants
const SIZE_UNITS = ['B', 'KB', 'MB', 'GB'] as const;
const SIZE_DIVISOR = 1024;
const TIME_UNITS = {
  DAY: 1000 * 60 * 60 * 24,
  WEEK: 7,
  MONTH: 30,
  YEAR: 365
} as const;

// Error messages
const ERROR_MESSAGES = {
  PARSE_ERROR: 'Failed to parse CSV file. Please check the file format.',
  ANALYSIS_ERROR: 'An error occurred during analysis. Please try again.',
  INVALID_DATA: 'Invalid data format detected in the CSV file.'
} as const;

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const index = Math.floor(Math.log(bytes) / Math.log(SIZE_DIVISOR));
  const value = bytes / Math.pow(SIZE_DIVISOR, index);
  
  return `${parseFloat(value.toFixed(2))} ${SIZE_UNITS[index]}`;
}

/**
 * Format date difference to relative time string
 */
export function formatDateDifference(date: Date | null): string {
  if (!date) return 'Unknown';
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / TIME_UNITS.DAY);
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < TIME_UNITS.WEEK) return `${diffDays} days ago`;
  if (diffDays < TIME_UNITS.MONTH) return `${Math.floor(diffDays / TIME_UNITS.WEEK)} weeks ago`;
  if (diffDays < TIME_UNITS.YEAR) return `${Math.floor(diffDays / TIME_UNITS.MONTH)} months ago`;
  return `${Math.floor(diffDays / TIME_UNITS.YEAR)} years ago`;
}

/**
 * Determine priority based on usage patterns
 */
function determinePriority(lastUsed: Date | null, category: string): Priority {
  if (category === 'system') return 'critical';
  
  if (!lastUsed) return 'low';
  
  const now = new Date();
  const diffMs = now.getTime() - lastUsed.getTime();
  const diffDays = Math.floor(diffMs / TIME_UNITS.DAY);
  
  if (diffDays < TIME_UNITS.WEEK) return 'high';
  if (diffDays < TIME_UNITS.MONTH) return 'medium';
  if (diffDays < TIME_UNITS.MONTH * 3) return 'low';
  return 'removable';
}

/**
 * Group files by directory for aggregation
 */
function groupFilesByDirectory(files: RawFileData[]): Map<string, RawFileData[]> {
  const grouped = new Map<string, RawFileData[]>();
  
  files.forEach(file => {
    const dir = file.DirectoryName;
    if (!grouped.has(dir)) {
      grouped.set(dir, []);
    }
    grouped.get(dir)!.push(file);
  });
  
  return grouped;
}

/**
 * Parse date string safely
 */
function parseDate(dateString: string | undefined): Date | null {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

/**
 * Calculate total size safely
 */
function calculateTotalSize(files: RawFileData[]): number {
  return files.reduce((sum, file) => {
    const size = parseInt(file.Length || '0', 10);
    return sum + (isNaN(size) ? 0 : size);
  }, 0);
}

/**
 * Find most recent access time from files
 */
function findMostRecentAccess(files: RawFileData[]): Date | null {
  let mostRecentAccess: Date | null = null;
  
  files.forEach(file => {
    const accessDate = parseDate(file.LastAccessTime);
    if (accessDate && (!mostRecentAccess || accessDate > mostRecentAccess)) {
      mostRecentAccess = accessDate;
    }
  });
  
  return mostRecentAccess;
}

/**
 * Aggregate software information from grouped files
 */
function aggregateSoftware(files: RawFileData[]): AnalyzedSoftware {
  // Find main executable (exclude uninstaller and updater)
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

/**
 * Extract software name from directory path
 */
function extractSoftwareName(path: string): string {
  const parts = path.split('\\');
  const ignoredNames = /^(Program Files|bin|x86|x64|\d+\.\d+)$/i;
  
  // Find meaningful name from path components
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i];
    if (part && !part.match(ignoredNames) && part.length > 2) {
      return part;
    }
  }
  
  return parts[parts.length - 1] || 'Unknown';
}

/**
 * Validate CSV data structure
 */
function validateCsvData(data: any[]): data is RawFileData[] {
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }
  
  const requiredFields = ['Name', 'DirectoryName', 'Length'];
  const firstItem = data[0];
  
  return requiredFields.every(field => field in firstItem);
}

/**
 * Main analysis function with improved error handling
 */
export async function analyzeFiles(csvContent: string): Promise<AnalyzedSoftware[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        try {
          // Validate CSV data
          if (!validateCsvData(result.data)) {
            throw new Error(ERROR_MESSAGES.INVALID_DATA);
          }
          
          const files = result.data as RawFileData[];
          
          // Group files by directory
          const grouped = groupFilesByDirectory(files);
          
          // Aggregate each software
          const analyzed: AnalyzedSoftware[] = [];
          grouped.forEach((files, directory) => {
            try {
              const software = aggregateSoftware(files);
              analyzed.push(software);
            } catch (error) {
              console.warn(`Failed to analyze directory: ${directory}`, error);
              // Continue processing other directories
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