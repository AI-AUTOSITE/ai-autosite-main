// app/lib/blog-posts/editors.ts
import type { BlogPost } from './types'

// Import from tool folders
import { imageCompressPost } from '@/tools/image-compress/blog-post'
import { imageGridMakerPost } from '@/tools/image-grid-maker/blog-post'
import { imageSplitterPost } from '@/tools/image-splitter/blog-post'
import { blurtapPost } from '@/tools/blurtap/blog-post'
import { colorPalettePost } from '@/tools/color-palette/blog-post'
import { pdfToolsPost } from '@/tools/pdf-tools/blog-post'

export const editorsPosts: BlogPost[] = [
  imageCompressPost,
  imageGridMakerPost,
  imageSplitterPost,
  blurtapPost,
  colorPalettePost,
  pdfToolsPost,
]