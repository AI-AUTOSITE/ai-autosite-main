// app/lib/blog-posts/creative-tools.ts
import type { BlogPost } from './types'

import { instagramBioPost } from '@/tools/instagram-bio/blog-post'
import { youtubeThumbnailPost } from '@/tools/youtube-thumbnail/blog-post'
import { gradientGeneratorPost } from '@/tools/gradient-generator/blog-post'

export const creativeToolsPosts: BlogPost[] = [
  instagramBioPost,
  youtubeThumbnailPost,
  gradientGeneratorPost,
]