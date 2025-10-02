// app/tools/pc-optimizer/utils/index.ts

import { SIZE_UNITS, SIZE_DIVISOR, TIME_UNITS } from '../constants';
import { RawFileData, Priority, SoftwareCategory } from '../lib/types';

// Format bytes to human readable string
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const index = Math.floor(Math.log(bytes) / Math.log(SIZE_DIVISOR));
  const value = bytes / Math.pow(SIZE_DIVISOR, index);
  return `${parseFloat(value.toFixed(2))} ${SIZE_UNITS[index]}`;
}

// Format date difference to human readable string
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

// Parse date string to Date object safely
export function parseDate(dateString: string | undefined): Date | null {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

// Calculate total size from files array
export function calculateTotalSize(files: RawFileData[]): number {
  return files.reduce((sum, file) => {
    const size = parseInt(file.Length || '0', 10);
    return sum + (isNaN(size) ? 0 : size);
  }, 0);
}

// Find most recent access date from files
export function findMostRecentAccess(files: RawFileData[]): Date | null {
  let mostRecentAccess: Date | null = null;
  
  files.forEach(file => {
    const accessDate = parseDate(file.LastAccessTime);
    if (accessDate && (!mostRecentAccess || accessDate > mostRecentAccess)) {
      mostRecentAccess = accessDate;
    }
  });
  
  return mostRecentAccess;
}

// Determine priority based on last used date and category
export function determinePriority(lastUsed: Date | null, category: SoftwareCategory): Priority {
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

// Group files by directory
export function groupFilesByDirectory(files: RawFileData[]): Map<string, RawFileData[]> {
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

// Extract software name from path
export function extractSoftwareName(path: string): string {
  const parts = path.split('\\');
  const ignoredNames = /^(Program Files|bin|x86|x64|\d+\.\d+)$/i;
  
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i];
    if (part && !part.match(ignoredNames) && part.length > 2) {
      return part;
    }
  }
  
  return parts[parts.length - 1] || 'Unknown';
}

// Validate CSV data structure
export function validateCsvData(data: any[]): data is RawFileData[] {
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }
  
  const requiredFields = ['Name', 'DirectoryName', 'Length'];
  const firstItem = data[0];
  
  return requiredFields.every(field => field in firstItem);
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

// Debounce function for search/filter
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}