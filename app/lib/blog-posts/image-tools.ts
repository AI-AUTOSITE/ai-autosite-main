// app/lib/blog-posts/image-tools.ts
import type { BlogPost } from './types'

// Import individual tool posts
import { bgEraserPost } from '../../tools/bg-eraser/blog-post'
import { imageCompressPost } from '../../tools/image-compress/blog-post'
import { imageGridMakerPost } from '../../tools/image-grid-maker/blog-post'
import { imageSplitterPost } from '../../tools/image-splitter/blog-post'
import { blurtapPost } from '../../tools/blurtap/blog-post'
import { colorPalettePost } from '../../tools/color-palette/blog-post'

export const imageToolsPosts: BlogPost[] = [
  bgEraserPost,
  imageCompressPost,
  imageGridMakerPost,
  imageSplitterPost,
  blurtapPost,
  colorPalettePost,
]
