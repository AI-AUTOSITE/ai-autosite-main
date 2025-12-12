// app/lib/categories/editors.ts
import type { Tool } from './types'

export const editors: Tool[] = [
  // PDF編集
  {
    id: 'pdf-tools',
    name: 'PDF Tools - Pick 3',
    description: 'Choose 3 essential PDF tools. Rotate, merge, split, compress.',
    category: 'editors',
    icon: '📄',
    color: 'from-red-500 to-orange-500',
    status: 'live',
    url: '/tools/pdf-tools',
    tags: ['PDF', 'Documents', 'Privacy', 'edit', 'merge', 'split', 'rotate', 'compress'],
    difficulty: 'Simple',
    timeToUse: '30 seconds',
    featured: true,
    new: true,
    pricing: 'freemium',
    dataProcessing: 'local',
    dependencies: ['pdf-lib', 'pdfjs-dist'],
  },

  // 将来追加予定（コメントアウト）
  /*
  // 動画編集
  {
    id: 'video-compress',
    name: 'Video Compressor',
    description: 'Compress videos while maintaining quality',
    category: 'editors',
    icon: '🎬',
    tags: ['video', 'compress', 'movie', 'mp4', 'webm'],
    status: 'coming',
  },
  {
    id: 'subtitle-editor',
    name: 'Subtitle Editor',
    description: 'Add and edit subtitles for videos',
    category: 'editors',
    icon: '💬',
    tags: ['video', 'subtitle', 'caption', 'text', 'movie'],
    status: 'coming',
  },

  // 音声編集
  {
    id: 'audio-compress',
    name: 'Audio Compressor',
    description: 'Compress audio files without quality loss',
    category: 'editors',
    icon: '🎵',
    tags: ['audio', 'compress', 'mp3', 'wav', 'music'],
    status: 'coming',
  },
  */
]