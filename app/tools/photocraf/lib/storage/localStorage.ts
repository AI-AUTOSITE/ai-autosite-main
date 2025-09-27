// app/tools/photocraft/lib/storage/localStorage.ts

/**
 * LocalStorage utilities for PhotoCraft
 */

const STORAGE_PREFIX = 'photocraft_';

export interface StorageItem<T = any> {
  data: T;
  timestamp: number;
  expires?: number;
}

/**
 * Set item in localStorage with optional expiration
 */
export function setItem<T>(
  key: string,
  data: T,
  expiresInMs?: number
): boolean {
  try {
    const storageKey = STORAGE_PREFIX + key;
    const item: StorageItem<T> = {
      data,
      timestamp: Date.now(),
      expires: expiresInMs ? Date.now() + expiresInMs : undefined
    };
    
    localStorage.setItem(storageKey, JSON.stringify(item));
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
}

/**
 * Get item from localStorage
 */
export function getItem<T>(key: string): T | null {
  try {
    const storageKey = STORAGE_PREFIX + key;
    const itemStr = localStorage.getItem(storageKey);
    
    if (!itemStr) return null;
    
    const item: StorageItem<T> = JSON.parse(itemStr);
    
    // Check if expired
    if (item.expires && item.expires < Date.now()) {
      removeItem(key);
      return null;
    }
    
    return item.data;
  } catch (error) {
    console.error('Failed to get from localStorage:', error);
    return null;
  }
}

/**
 * Remove item from localStorage
 */
export function removeItem(key: string): void {
  try {
    const storageKey = STORAGE_PREFIX + key;
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
}

/**
 * Clear all PhotoCraft items from localStorage
 */
export function clearAll(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}

/**
 * Get all PhotoCraft keys from localStorage
 */
export function getAllKeys(): string[] {
  try {
    const keys = Object.keys(localStorage);
    return keys
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .map(key => key.replace(STORAGE_PREFIX, ''));
  } catch (error) {
    console.error('Failed to get keys from localStorage:', error);
    return [];
  }
}

/**
 * Get storage size used by PhotoCraft
 */
export function getStorageSize(): number {
  try {
    let size = 0;
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        const item = localStorage.getItem(key);
        if (item) {
          size += item.length * 2; // UTF-16 characters
        }
      }
    });
    
    return size;
  } catch (error) {
    console.error('Failed to calculate storage size:', error);
    return 0;
  }
}

/**
 * Check if localStorage is available
 */
export function isAvailable(): boolean {
  try {
    const testKey = STORAGE_PREFIX + 'test';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

// User Preferences Storage
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  defaultExportFormat: 'png' | 'jpeg' | 'webp';
  defaultQuality: number;
  autoSave: boolean;
  autoSaveInterval: number;
  keyboardShortcuts: Record<string, string>;
  recentColors: string[];
  favoriteFilters: string[];
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  defaultExportFormat: 'png',
  defaultQuality: 95,
  autoSave: false,
  autoSaveInterval: 60000, // 1 minute
  keyboardShortcuts: {},
  recentColors: [],
  favoriteFilters: []
};

export function savePreferences(preferences: Partial<UserPreferences>): void {
  const current = getPreferences();
  setItem('user_preferences', { ...current, ...preferences });
}

export function getPreferences(): UserPreferences {
  return getItem<UserPreferences>('user_preferences') || DEFAULT_PREFERENCES;
}

// Project Storage
export interface ProjectData {
  id: string;
  name: string;
  createdAt: number;
  modifiedAt: number;
  thumbnail?: string;
  layers: any[];
  filters: any[];
  settings: any;
}

export function saveProject(project: ProjectData): boolean {
  return setItem(`project_${project.id}`, project);
}

export function loadProject(projectId: string): ProjectData | null {
  return getItem<ProjectData>(`project_${projectId}`);
}

export function deleteProject(projectId: string): void {
  removeItem(`project_${projectId}`);
}

export function listProjects(): ProjectData[] {
  const keys = getAllKeys();
  const projects: ProjectData[] = [];
  
  keys.forEach(key => {
    if (key.startsWith('project_')) {
      const project = getItem<ProjectData>(key);
      if (project) {
        projects.push(project);
      }
    }
  });
  
  return projects.sort((a, b) => b.modifiedAt - a.modifiedAt);
}

// Recent Files Storage
export interface RecentFile {
  name: string;
  size: number;
  type: string;
  thumbnail?: string;
  lastAccessed: number;
}

const MAX_RECENT_FILES = 10;

export function addRecentFile(file: RecentFile): void {
  const recent = getRecentFiles();
  
  // Remove if already exists
  const filtered = recent.filter(f => f.name !== file.name);
  
  // Add to beginning
  filtered.unshift(file);
  
  // Keep only max items
  const trimmed = filtered.slice(0, MAX_RECENT_FILES);
  
  setItem('recent_files', trimmed);
}

export function getRecentFiles(): RecentFile[] {
  return getItem<RecentFile[]>('recent_files') || [];
}

export function clearRecentFiles(): void {
  removeItem('recent_files');
}

// Custom Filter Storage
export interface CustomFilterData {
  id: string;
  name: string;
  code: string;
  description?: string;
  parameters: any[];
  createdAt: number;
  modifiedAt: number;
  slot?: number;
}

export function saveCustomFilter(filter: CustomFilterData): boolean {
  return setItem(`custom_filter_${filter.id}`, filter);
}

export function loadCustomFilter(filterId: string): CustomFilterData | null {
  return getItem<CustomFilterData>(`custom_filter_${filterId}`);
}

export function deleteCustomFilter(filterId: string): void {
  removeItem(`custom_filter_${filterId}`);
}

export function listCustomFilters(): CustomFilterData[] {
  const keys = getAllKeys();
  const filters: CustomFilterData[] = [];
  
  keys.forEach(key => {
    if (key.startsWith('custom_filter_')) {
      const filter = getItem<CustomFilterData>(key);
      if (filter) {
        filters.push(filter);
      }
    }
  });
  
  return filters.sort((a, b) => b.modifiedAt - a.modifiedAt);
}