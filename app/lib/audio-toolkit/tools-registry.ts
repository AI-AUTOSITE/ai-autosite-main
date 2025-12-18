// app/lib/audio-toolkit/tools-registry.ts
// Audio Toolkit - 19ツール定義ファイル

import type { LucideIcon } from 'lucide-react';
import {
  FileAudio,
  FileMusic,
  AudioLines,
  RefreshCw,
  FileText,
  Mic,
  MonitorPlay,
  Radio,
  Scissors,
  ScissorsLineDashed,  // Changed from ScissorsSquare
  GitMerge,
  Split,               // Changed from SplitSquare
  Volume2,
  Gauge,
  Circle,
  Download,
  Repeat,
  Undo2,
  SunDim,
} from 'lucide-react';

// ========================================
// Types
// ========================================

export type AudioCategory = 'convert' | 'transcribe' | 'edit' | 'fix' | 'create';

export type ToolPriority = 'P1' | 'P2' | 'P3';

export interface AudioTool {
  // Core
  slug: string;
  name: string;
  description: string;
  shortDescription: string; // For cards (max 60 chars)
  category: AudioCategory;
  
  // Visual
  icon: LucideIcon;
  emoji: string;
  
  // Status
  status: 'live' | 'coming' | 'maintenance';
  priority: ToolPriority;
  
  // Features
  inputFormats: string[];
  outputFormats: string[];
  maxFileSize: number; // bytes
  maxFileSizeMobile: number; // bytes
  
  // SEO
  keywords: string[];
  features: string[];
  
  // Related tools (for suggestions)
  relatedTools: string[];
}

export interface CategoryConfig {
  id: AudioCategory;
  name: string;
  emoji: string;
  color: string;
  lightColor: string;
  darkColor: string;
  gradient: string;
  description: string;
  order: number;
}

// ========================================
// Category Configuration
// ========================================

export const AUDIO_CATEGORIES: Record<AudioCategory, CategoryConfig> = {
  convert: {
    id: 'convert',
    name: 'Convert',
    emoji: '🔄',
    color: '#3B82F6',
    lightColor: '#DBEAFE',
    darkColor: '#1E40AF',
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Convert between audio formats',
    order: 1,
  },
  transcribe: {
    id: 'transcribe',
    name: 'Transcribe',
    emoji: '📝',
    color: '#8B5CF6',
    lightColor: '#EDE9FE',
    darkColor: '#5B21B6',
    gradient: 'from-violet-500 to-purple-500',
    description: 'Convert speech to text',
    order: 2,
  },
  edit: {
    id: 'edit',
    name: 'Edit',
    emoji: '✂️',
    color: '#10B981',
    lightColor: '#D1FAE5',
    darkColor: '#047857',
    gradient: 'from-emerald-500 to-green-500',
    description: 'Trim, cut, merge, and split audio',
    order: 3,
  },
  fix: {
    id: 'fix',
    name: 'Fix',
    emoji: '🔧',
    color: '#F59E0B',
    lightColor: '#FEF3C7',
    darkColor: '#B45309',
    gradient: 'from-amber-500 to-orange-500',
    description: 'Adjust volume and speed',
    order: 4,
  },
  create: {
    id: 'create',
    name: 'Create',
    emoji: '🎵',
    color: '#EC4899',
    lightColor: '#FCE7F3',
    darkColor: '#BE185D',
    gradient: 'from-pink-500 to-rose-500',
    description: 'Record and extract audio',
    order: 5,
  },
};

// ========================================
// Tool Registry - All 19 Tools
// ========================================

export const AUDIO_TOOLS: AudioTool[] = [
  // ========================================
  // Convert (4 tools)
  // ========================================
  {
    slug: 'mp3-to-wav',
    name: 'MP3 to WAV Converter',
    description: 'Convert MP3 files to WAV format instantly in your browser. High-quality conversion with adjustable bit depth (16, 24, or 32-bit).',
    shortDescription: 'Convert MP3 to WAV format',
    category: 'convert',
    icon: FileAudio,
    emoji: '🔄',
    status: 'coming',
    priority: 'P1',
    inputFormats: ['mp3'],
    outputFormats: ['wav'],
    maxFileSize: 100 * 1024 * 1024,
    maxFileSizeMobile: 50 * 1024 * 1024,
    keywords: ['mp3 to wav', 'convert mp3', 'audio converter', 'wav converter'],
    features: ['16/24/32-bit output', 'Instant conversion', 'Preview before download'],
    relatedTools: ['wav-to-mp3', 'audio-converter', 'trim-audio'],
  },
  {
    slug: 'wav-to-mp3',
    name: 'WAV to MP3 Converter',
    description: 'Convert WAV files to MP3 to reduce file size by up to 90%. Choose quality from 128 to 320 kbps.',
    shortDescription: 'Convert WAV to MP3 format',
    category: 'convert',
    icon: FileMusic,
    emoji: '🎵',
    status: 'coming',
    priority: 'P1',
    inputFormats: ['wav'],
    outputFormats: ['mp3'],
    maxFileSize: 100 * 1024 * 1024,
    maxFileSizeMobile: 50 * 1024 * 1024,
    keywords: ['wav to mp3', 'compress audio', 'reduce file size', 'mp3 encoder'],
    features: ['128-320 kbps quality', '90% size reduction', 'Batch conversion'],
    relatedTools: ['mp3-to-wav', 'audio-converter', 'volume-booster'],
  },
  {
    slug: 'text-to-audio',
    name: 'Text to Audio',
    description: 'Convert text to natural-sounding speech using AI. Multiple voices and languages available.',
    shortDescription: 'Convert text to speech',
    category: 'convert',
    icon: AudioLines,
    emoji: '🗣️',
    status: 'coming',
    priority: 'P2',
    inputFormats: ['text'],
    outputFormats: ['wav', 'mp3'],
    maxFileSize: 0,
    maxFileSizeMobile: 0,
    keywords: ['text to speech', 'tts', 'voice generator', 'audio from text'],
    features: ['Multiple voices', 'Speed control', 'Download as WAV/MP3'],
    relatedTools: ['transcribe-file', 'record-voice'],
  },
  {
    slug: 'audio-converter',
    name: 'Audio Converter',
    description: 'Universal audio converter. Convert between MP3, WAV, OGG, FLAC, and more.',
    shortDescription: 'Convert between audio formats',
    category: 'convert',
    icon: RefreshCw,
    emoji: '🔁',
    status: 'coming',
    priority: 'P2',
    inputFormats: ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'webm'],
    outputFormats: ['mp3', 'wav', 'ogg'],
    maxFileSize: 100 * 1024 * 1024,
    maxFileSizeMobile: 50 * 1024 * 1024,
    keywords: ['audio converter', 'format converter', 'ogg to mp3', 'flac to wav'],
    features: ['Multiple formats', 'Batch conversion', 'Quality options'],
    relatedTools: ['mp3-to-wav', 'wav-to-mp3'],
  },

  // ========================================
  // Transcribe (4 tools)
  // ========================================
  {
    slug: 'transcribe-file',
    name: 'Transcribe Audio File',
    description: 'Upload audio files and convert speech to text using AI Whisper. Supports timestamps and multiple export formats.',
    shortDescription: 'Convert audio files to text',
    category: 'transcribe',
    icon: FileText,
    emoji: '📄',
    status: 'coming',
    priority: 'P1',
    inputFormats: ['mp3', 'wav', 'm4a', 'webm', 'ogg'],
    outputFormats: ['txt', 'srt', 'vtt', 'docx'],
    maxFileSize: 100 * 1024 * 1024,
    maxFileSizeMobile: 25 * 1024 * 1024,
    keywords: ['transcribe audio', 'speech to text', 'audio to text', 'whisper ai'],
    features: ['AI-powered', 'Timestamps', 'Multiple languages', 'Export SRT/VTT'],
    relatedTools: ['transcribe-recording', 'live-transcribe'],
  },
  {
    slug: 'transcribe-recording',
    name: 'Transcribe Recording',
    description: 'Record from your microphone and transcribe instantly. Perfect for meetings and interviews.',
    shortDescription: 'Record and transcribe voice',
    category: 'transcribe',
    icon: Mic,
    emoji: '🎙️',
    status: 'coming',
    priority: 'P1',
    inputFormats: ['microphone'],
    outputFormats: ['txt', 'srt', 'vtt', 'docx'],
    maxFileSize: 0,
    maxFileSizeMobile: 0,
    keywords: ['record transcribe', 'voice to text', 'meeting transcription', 'dictation'],
    features: ['Real-time recording', 'Volume meter', 'Pause/resume'],
    relatedTools: ['transcribe-file', 'record-voice', 'live-transcribe'],
  },
  {
    slug: 'transcribe-screen',
    name: 'Transcribe Screen Audio',
    description: 'Capture audio from your screen (meetings, videos, streams) and transcribe. Chrome only.',
    shortDescription: 'Transcribe screen audio',
    category: 'transcribe',
    icon: MonitorPlay,
    emoji: '🖥️',
    status: 'coming',
    priority: 'P2',
    inputFormats: ['screen-audio'],
    outputFormats: ['txt', 'srt', 'vtt'],
    maxFileSize: 0,
    maxFileSizeMobile: 0,
    keywords: ['screen transcription', 'meeting transcription', 'capture audio', 'video transcription'],
    features: ['Screen capture', 'System audio', 'Chrome support'],
    relatedTools: ['transcribe-file', 'live-transcribe'],
  },
  {
    slug: 'live-transcribe',
    name: 'Live Transcription',
    description: 'Real-time speech to text as you speak. Uses Web Speech API for instant results.',
    shortDescription: 'Real-time speech to text',
    category: 'transcribe',
    icon: Radio,
    emoji: '📡',
    status: 'coming',
    priority: 'P2',
    inputFormats: ['microphone'],
    outputFormats: ['txt'],
    maxFileSize: 0,
    maxFileSizeMobile: 0,
    keywords: ['live transcription', 'real-time', 'speech recognition', 'voice typing'],
    features: ['Instant results', 'Continuous listening', 'Multiple languages'],
    relatedTools: ['transcribe-recording', 'transcribe-file'],
  },

  // ========================================
  // Edit (4 tools)
  // ========================================
  {
    slug: 'trim-audio',
    name: 'Trim Audio',
    description: 'Cut the beginning or end off your audio file. Visual waveform editor with precise control.',
    shortDescription: 'Trim start and end of audio',
    category: 'edit',
    icon: Scissors,
    emoji: '✂️',
    status: 'coming',
    priority: 'P1',
    inputFormats: ['mp3', 'wav', 'ogg', 'flac', 'm4a'],
    outputFormats: ['mp3', 'wav'],
    maxFileSize: 100 * 1024 * 1024,
    maxFileSizeMobile: 25 * 1024 * 1024,
    keywords: ['trim audio', 'cut audio', 'audio trimmer', 'shorten audio'],
    features: ['Visual waveform', 'Precise selection', 'Preview', 'Fade options'],
    relatedTools: ['cut-audio', 'merge-audio', 'fade-audio'],
  },
  {
    slug: 'cut-audio',
    name: 'Cut Audio',
    description: 'Remove a section from the middle of your audio and join the remaining parts.',
    shortDescription: 'Remove middle section',
    category: 'edit',
    icon: ScissorsLineDashed,
    emoji: '🔲',
    status: 'coming',
    priority: 'P2',
    inputFormats: ['mp3', 'wav', 'ogg', 'flac', 'm4a'],
    outputFormats: ['mp3', 'wav'],
    maxFileSize: 100 * 1024 * 1024,
    maxFileSizeMobile: 25 * 1024 * 1024,
    keywords: ['cut audio', 'remove section', 'delete part', 'audio cutter'],
    features: ['Remove middle', 'Crossfade option', 'Visual editor'],
    relatedTools: ['trim-audio', 'merge-audio', 'split-audio'],
  },
  {
    slug: 'merge-audio',
    name: 'Merge Audio',
    description: 'Combine multiple audio files into one. Drag to reorder, optional crossfade between files.',
    shortDescription: 'Combine multiple audio files',
    category: 'edit',
    icon: GitMerge,
    emoji: '🔗',
    status: 'coming',
    priority: 'P2',
    inputFormats: ['mp3', 'wav', 'ogg', 'flac', 'm4a'],
    outputFormats: ['mp3', 'wav'],
    maxFileSize: 100 * 1024 * 1024,
    maxFileSizeMobile: 25 * 1024 * 1024,
    keywords: ['merge audio', 'combine audio', 'join audio files', 'audio joiner'],
    features: ['Multiple files', 'Drag reorder', 'Crossfade', 'Preview'],
    relatedTools: ['split-audio', 'trim-audio'],
  },
  {
    slug: 'split-audio',
    name: 'Split Audio',
    description: 'Divide audio into multiple parts at marked points. Download as separate files or ZIP.',
    shortDescription: 'Split into multiple parts',
    category: 'edit',
    icon: Split,
    emoji: '📊',
    status: 'coming',
    priority: 'P3',
    inputFormats: ['mp3', 'wav', 'ogg', 'flac', 'm4a'],
    outputFormats: ['mp3', 'wav'],
    maxFileSize: 100 * 1024 * 1024,
    maxFileSizeMobile: 25 * 1024 * 1024,
    keywords: ['split audio', 'divide audio', 'audio splitter', 'cut into parts'],
    features: ['Click to add markers', 'Multiple splits', 'ZIP download'],
    relatedTools: ['merge-audio', 'trim-audio'],
  },

  // ========================================
  // Fix (2 tools)
  // ========================================
  {
    slug: 'volume-booster',
    name: 'Volume Booster',
    description: 'Make quiet audio louder with automatic clipping prevention. Boost up to +20dB.',
    shortDescription: 'Make audio louder',
    category: 'fix',
    icon: Volume2,
    emoji: '🔊',
    status: 'coming',
    priority: 'P1',
    inputFormats: ['mp3', 'wav', 'ogg', 'flac', 'm4a'],
    outputFormats: ['mp3', 'wav'],
    maxFileSize: 100 * 1024 * 1024,
    maxFileSizeMobile: 25 * 1024 * 1024,
    keywords: ['volume booster', 'make louder', 'increase volume', 'audio amplifier'],
    features: ['Up to +20dB', 'Clipping prevention', 'A/B compare', 'Normalize option'],
    relatedTools: ['speed-changer', 'trim-audio'],
  },
  {
    slug: 'speed-changer',
    name: 'Speed Changer',
    description: 'Speed up or slow down audio while keeping the original pitch. 0.5x to 3x speed.',
    shortDescription: 'Change audio speed',
    category: 'fix',
    icon: Gauge,
    emoji: '⏩',
    status: 'coming',
    priority: 'P2',
    inputFormats: ['mp3', 'wav', 'ogg', 'flac', 'm4a'],
    outputFormats: ['mp3', 'wav'],
    maxFileSize: 100 * 1024 * 1024,
    maxFileSizeMobile: 25 * 1024 * 1024,
    keywords: ['speed changer', 'slow down', 'speed up', 'tempo changer', 'pitch preserve'],
    features: ['0.5x to 3x', 'Pitch preservation', 'Fine control', 'Preview'],
    relatedTools: ['volume-booster', 'trim-audio'],
  },

  // ========================================
  // Create (5 tools)
  // ========================================
  {
    slug: 'record-voice',
    name: 'Voice Recorder',
    description: 'Record audio from your microphone. Choose output format and quality.',
    shortDescription: 'Record from microphone',
    category: 'create',
    icon: Circle,
    emoji: '⏺️',
    status: 'coming',
    priority: 'P1',
    inputFormats: ['microphone'],
    outputFormats: ['webm', 'wav', 'mp3'],
    maxFileSize: 0,
    maxFileSizeMobile: 0,
    keywords: ['voice recorder', 'record audio', 'microphone recorder', 'audio recorder'],
    features: ['High quality', 'Pause/resume', 'Volume meter', 'Multiple formats'],
    relatedTools: ['transcribe-recording', 'extract-audio'],
  },
  {
    slug: 'extract-audio',
    name: 'Extract Audio from Video',
    description: 'Extract the audio track from video files. Supports MP4, WebM, MOV.',
    shortDescription: 'Get audio from video',
    category: 'create',
    icon: Download,
    emoji: '🎬',
    status: 'coming',
    priority: 'P1',
    inputFormats: ['mp4', 'webm', 'mov', 'avi'],
    outputFormats: ['mp3', 'wav'],
    maxFileSize: 500 * 1024 * 1024,
    maxFileSizeMobile: 100 * 1024 * 1024,
    keywords: ['extract audio', 'video to audio', 'mp4 to mp3', 'rip audio'],
    features: ['Fast extraction', 'Quality options', 'Large file support'],
    relatedTools: ['audio-converter', 'trim-audio'],
  },
  {
    slug: 'loop-audio',
    name: 'Loop Audio',
    description: 'Repeat audio multiple times to create a longer file. Optional crossfade between loops.',
    shortDescription: 'Repeat audio multiple times',
    category: 'create',
    icon: Repeat,
    emoji: '🔁',
    status: 'coming',
    priority: 'P3',
    inputFormats: ['mp3', 'wav', 'ogg', 'flac', 'm4a'],
    outputFormats: ['mp3', 'wav'],
    maxFileSize: 50 * 1024 * 1024,
    maxFileSizeMobile: 25 * 1024 * 1024,
    keywords: ['loop audio', 'repeat audio', 'audio looper', 'extend audio'],
    features: ['Custom loop count', 'Crossfade option', 'Preview'],
    relatedTools: ['merge-audio', 'fade-audio'],
  },
  {
    slug: 'reverse-audio',
    name: 'Reverse Audio',
    description: 'Play audio backwards. Create interesting effects or decode reverse speech.',
    shortDescription: 'Play audio backwards',
    category: 'create',
    icon: Undo2,
    emoji: '⏪',
    status: 'coming',
    priority: 'P3',
    inputFormats: ['mp3', 'wav', 'ogg', 'flac', 'm4a'],
    outputFormats: ['mp3', 'wav'],
    maxFileSize: 100 * 1024 * 1024,
    maxFileSizeMobile: 25 * 1024 * 1024,
    keywords: ['reverse audio', 'backwards audio', 'reverse sound', 'audio reverser'],
    features: ['Instant reverse', 'A/B compare', 'Preview'],
    relatedTools: ['speed-changer', 'fade-audio'],
  },
  {
    slug: 'fade-audio',
    name: 'Fade Audio',
    description: 'Add smooth fade in and fade out effects. Multiple curve types available.',
    shortDescription: 'Add fade in/out effects',
    category: 'create',
    icon: SunDim,
    emoji: '🌅',
    status: 'coming',
    priority: 'P3',
    inputFormats: ['mp3', 'wav', 'ogg', 'flac', 'm4a'],
    outputFormats: ['mp3', 'wav'],
    maxFileSize: 100 * 1024 * 1024,
    maxFileSizeMobile: 25 * 1024 * 1024,
    keywords: ['fade audio', 'fade in', 'fade out', 'audio transitions'],
    features: ['Adjustable duration', 'Multiple curves', 'Visual preview'],
    relatedTools: ['trim-audio', 'loop-audio'],
  },
];

// ========================================
// Helper Functions
// ========================================

/**
 * Get tool by slug
 */
export function getToolBySlug(slug: string): AudioTool | undefined {
  return AUDIO_TOOLS.find((tool) => tool.slug === slug);
}

/**
 * Get all tools in a category
 */
export function getToolsByCategory(category: AudioCategory): AudioTool[] {
  return AUDIO_TOOLS.filter((tool) => tool.category === category);
}

/**
 * Get all live tools
 */
export function getLiveTools(): AudioTool[] {
  return AUDIO_TOOLS.filter((tool) => tool.status === 'live');
}

/**
 * Get tools by priority
 */
export function getToolsByPriority(priority: ToolPriority): AudioTool[] {
  return AUDIO_TOOLS.filter((tool) => tool.priority === priority);
}

/**
 * Get related tools for a given tool
 */
export function getRelatedTools(slug: string): AudioTool[] {
  const tool = getToolBySlug(slug);
  if (!tool) return [];
  
  return tool.relatedTools
    .map((relatedSlug) => getToolBySlug(relatedSlug))
    .filter((t): t is AudioTool => t !== undefined);
}

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
 * Get tool count by category
 */
export function getToolCountByCategory(): Record<AudioCategory, number> {
  const counts = {} as Record<AudioCategory, number>;
  
  for (const category of Object.keys(AUDIO_CATEGORIES) as AudioCategory[]) {
    counts[category] = getToolsByCategory(category).length;
  }
  
  return counts;
}

// ========================================
// Exports
// ========================================

export default AUDIO_TOOLS;
