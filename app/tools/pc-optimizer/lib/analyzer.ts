import Papa from 'papaparse';
import { AnalyzedSoftware, RawFileData, Priority } from './types';
import { identifySoftware, getCategoryFromPath } from './softwareDatabase';

// Format bytes to human readable
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format date difference
export function formatDateDifference(date: Date | null): string {
  if (!date) return '不明';
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return '今日';
  if (diffDays === 1) return '昨日';
  if (diffDays < 7) return `${diffDays}日前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}ヶ月前`;
  return `${Math.floor(diffDays / 365)}年前`;
}

// Determine priority based on usage
function determinePriority(lastUsed: Date | null, category: string): Priority {
  if (category === 'system') return 'critical';
  
  if (!lastUsed) return 'low';
  
  const now = new Date();
  const diffMs = now.getTime() - lastUsed.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7) return 'high';
  if (diffDays < 30) return 'medium';
  if (diffDays < 90) return 'low';
  return 'removable';
}

// Group files by directory
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

// Aggregate software information
function aggregateSoftware(files: RawFileData[]): AnalyzedSoftware {
  // Find main executable
  const mainExe = files.find(f => !f.Name.includes('uninstall') && !f.Name.includes('update')) || files[0];
  const identified = identifySoftware(mainExe.Name, mainExe.DirectoryName);
  
  // Calculate total size
  const totalSize = files.reduce((sum, file) => {
    const size = parseInt(file.Length || '0');
    return sum + (isNaN(size) ? 0 : size);
  }, 0);
  
  // Get most recent access time
  let mostRecentAccess: Date | null = null;
  files.forEach(file => {
    if (file.LastAccessTime) {
      const accessDate = new Date(file.LastAccessTime);
      if (!isNaN(accessDate.getTime())) {
        if (!mostRecentAccess || accessDate > mostRecentAccess) {
          mostRecentAccess = accessDate;
        }
      }
    }
  });
  
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
    cacheSizeFormatted: identified?.estimatedCacheSize ? formatBytes(identified.estimatedCacheSize) : undefined,
    description: identified?.description,
    tips: identified?.tips,
  };
}

// Extract software name from path
function extractSoftwareName(path: string): string {
  const parts = path.split('\\');
  
  // Try to find a meaningful name from the path
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i];
    if (part && 
        !part.match(/^(Program Files|bin|x86|x64|\d+\.\d+)$/i) &&
        part.length > 2) {
      return part;
    }
  }
  
  return parts[parts.length - 1] || 'Unknown';
}

// Main analysis function
export async function analyzeFiles(csvContent: string): Promise<AnalyzedSoftware[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        try {
          const files = result.data as RawFileData[];
          
          // Group files by directory
          const grouped = groupFilesByDirectory(files);
          
          // Aggregate each software
          const analyzed: AnalyzedSoftware[] = [];
          grouped.forEach((files, directory) => {
            const software = aggregateSoftware(files);
            analyzed.push(software);
          });
          
          // Sort by size (largest first)
          analyzed.sort((a, b) => b.size - a.size);
          
          resolve(analyzed);
        } catch (error) {
          console.error('Analysis error:', error);
          reject(error);
        }
      },
      error: (error) => {
        console.error('Parse error:', error);
        reject(error);
      },
    });
  });
}