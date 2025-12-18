// app/lib/audio-toolkit/constants.ts
// Audio Toolkit - 定数・設定

// ========================================
// Category Configuration
// ========================================

export type AudioCategory = 'convert' | 'transcribe' | 'edit' | 'fix' | 'create';

export interface CategoryConfig {
  id: AudioCategory;
  name: string;
  emoji: string;
  color: string;
  lightColor: string;
  darkColor: string;
  gradient: string;
  bgGradient: string;
  description: string;
  order: number;
}

export const AUDIO_CATEGORIES: Record<AudioCategory, CategoryConfig> = {
  convert: {
    id: 'convert',
    name: 'Convert',
    emoji: '🔄',
    color: '#3B82F6',      // blue-500
    lightColor: '#DBEAFE', // blue-100
    darkColor: '#1E40AF',  // blue-800
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-500/20 to-cyan-500/20',
    description: 'Convert between audio formats',
    order: 1,
  },
  transcribe: {
    id: 'transcribe',
    name: 'Transcribe',
    emoji: '📝',
    color: '#8B5CF6',      // violet-500
    lightColor: '#EDE9FE', // violet-100
    darkColor: '#5B21B6',  // violet-800
    gradient: 'from-violet-500 to-purple-500',
    bgGradient: 'from-violet-500/20 to-purple-500/20',
    description: 'Convert speech to text',
    order: 2,
  },
  edit: {
    id: 'edit',
    name: 'Edit',
    emoji: '✂️',
    color: '#10B981',      // emerald-500
    lightColor: '#D1FAE5', // emerald-100
    darkColor: '#047857',  // emerald-800
    gradient: 'from-emerald-500 to-green-500',
    bgGradient: 'from-emerald-500/20 to-green-500/20',
    description: 'Trim, cut, merge, and split audio',
    order: 3,
  },
  fix: {
    id: 'fix',
    name: 'Fix',
    emoji: '🔧',
    color: '#F59E0B',      // amber-500
    lightColor: '#FEF3C7', // amber-100
    darkColor: '#B45309',  // amber-800
    gradient: 'from-amber-500 to-orange-500',
    bgGradient: 'from-amber-500/20 to-orange-500/20',
    description: 'Adjust volume and speed',
    order: 4,
  },
  create: {
    id: 'create',
    name: 'Create',
    emoji: '🎵',
    color: '#EC4899',      // pink-500
    lightColor: '#FCE7F3', // pink-100
    darkColor: '#BE185D',  // pink-800
    gradient: 'from-pink-500 to-rose-500',
    bgGradient: 'from-pink-500/20 to-rose-500/20',
    description: 'Record and extract audio',
    order: 5,
  },
};

// ========================================
// Waveform Colors
// ========================================

export const WAVEFORM_COLORS = {
  wave: '#6366F1',           // indigo-500
  progress: '#4F46E5',       // indigo-600
  cursor: '#EC4899',         // pink-500
  region: 'rgba(99, 102, 241, 0.3)',
  regionBorder: '#6366F1',
  marker: '#EF4444',         // red-500
};

// ========================================
// Audio Processing Constants
// ========================================

export const AUDIO_CONSTANTS = {
  // Sample rates
  SAMPLE_RATE_LOW: 22050,
  SAMPLE_RATE_STANDARD: 44100,
  SAMPLE_RATE_HIGH: 48000,
  SAMPLE_RATE_WHISPER: 16000,
  
  // Bit depths
  BIT_DEPTH_16: 16,
  BIT_DEPTH_24: 24,
  BIT_DEPTH_32: 32,
  
  // MP3 bitrates (kbps)
  BITRATE_LOW: 128,
  BITRATE_MEDIUM: 192,
  BITRATE_HIGH: 256,
  BITRATE_MAX: 320,
  
  // Chunk sizes for processing
  CHUNK_SIZE: 4096,
  ENCODER_CHUNK_SIZE: 1152,
  
  // Fade defaults (seconds)
  DEFAULT_FADE_DURATION: 2,
  MIN_FADE_DURATION: 0.1,
  MAX_FADE_DURATION: 30,
  
  // Crossfade defaults (seconds)
  DEFAULT_CROSSFADE_DURATION: 0.5,
  
  // Speed change limits
  MIN_SPEED: 0.25,
  MAX_SPEED: 4.0,
  DEFAULT_SPEED: 1.0,
  
  // Volume limits (dB)
  MIN_VOLUME_DB: -60,
  MAX_VOLUME_DB: 20,
  DEFAULT_VOLUME_DB: 0,
  
  // Recording
  MAX_RECORDING_DURATION_MOBILE: 120,   // 2 minutes
  MAX_RECORDING_DURATION_TABLET: 300,   // 5 minutes
  MAX_RECORDING_DURATION_DESKTOP: 600,  // 10 minutes
};

// ========================================
// Whisper Model Configuration
// ========================================

export const WHISPER_MODELS = {
  'tiny': {
    id: 'Xenova/whisper-tiny',
    name: 'Tiny',
    size: '~40MB',
    speed: 'Fastest',
    accuracy: 'Good',
    recommended: 'mobile',
  },
  'base': {
    id: 'Xenova/whisper-base',
    name: 'Base',
    size: '~75MB',
    speed: 'Fast',
    accuracy: 'Better',
    recommended: 'tablet',
  },
  'small': {
    id: 'Xenova/whisper-small',
    name: 'Small',
    size: '~150MB',
    speed: 'Medium',
    accuracy: 'Best',
    recommended: 'desktop',
  },
} as const;

export const WHISPER_LANGUAGES = [
  { code: 'auto', name: 'Auto-detect' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ko', name: 'Korean' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'it', name: 'Italian' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'tr', name: 'Turkish' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'th', name: 'Thai' },
  { code: 'id', name: 'Indonesian' },
  { code: 'hi', name: 'Hindi' },
] as const;

// ========================================
// Keyboard Shortcuts
// ========================================

export const KEYBOARD_SHORTCUTS = {
  PLAY_PAUSE: ' ',           // Space
  SEEK_BACKWARD: 'ArrowLeft',
  SEEK_FORWARD: 'ArrowRight',
  VOLUME_UP: 'ArrowUp',
  VOLUME_DOWN: 'ArrowDown',
  MUTE: 'm',
  FULLSCREEN: 'f',
} as const;

// ========================================
// Animation Durations (ms)
// ========================================

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 200,
  slow: 300,
  verySlow: 500,
};

// ========================================
// Z-Index Layers
// ========================================

export const Z_INDEX = {
  waveform: 10,
  regions: 20,
  cursor: 30,
  controls: 40,
  modal: 50,
  tooltip: 60,
};

// ========================================
// Helper Functions
// ========================================

/**
 * Get category config by ID
 */
export function getCategoryConfig(category: AudioCategory): CategoryConfig {
  return AUDIO_CATEGORIES[category];
}

/**
 * Get all categories sorted by order
 */
export function getAllCategories(): CategoryConfig[] {
  return Object.values(AUDIO_CATEGORIES).sort((a, b) => a.order - b.order);
}

/**
 * Get gradient class for category
 */
export function getCategoryGradient(category: AudioCategory): string {
  return AUDIO_CATEGORIES[category].gradient;
}

/**
 * Get Tailwind color class for category
 */
export function getCategoryColorClass(category: AudioCategory, variant: 'bg' | 'text' | 'border' = 'bg'): string {
  const colorMap: Record<AudioCategory, string> = {
    convert: 'blue-500',
    transcribe: 'violet-500',
    edit: 'emerald-500',
    fix: 'amber-500',
    create: 'pink-500',
  };
  
  return `${variant}-${colorMap[category]}`;
}
