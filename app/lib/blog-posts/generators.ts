// app/lib/blog-posts/generators.ts
import type { BlogPost } from './types'

// Import from tool folders
import { passwordGeneratorPost } from '@/tools/password-generator/blog-post'
import { qrCodePost } from '@/tools/qr-code/blog-post'
import { uuidGeneratorPost } from '@/tools/uuid-generator/blog-post'
import { loremIpsumPost } from '@/tools/lorem-ipsum/blog-post'
import { faviconGeneratorPost } from '@/tools/favicon-generator/blog-post'
import { gradientGeneratorPost } from '@/tools/gradient-generator/blog-post'
import { instagramBioPost } from '@/tools/instagram-bio/blog-post'
import { hashtagGeneratorPost } from '@/tools/hashtag-generator/blog-post'
import { whatsappLinkPost } from '@/tools/whatsapp-link/blog-post'
import { countdownTimerPost } from '@/tools/countdown-timer/blog-post'
import { cornellNotePost } from '@/tools/cornell-note/blog-post'

export const generatorsPosts: BlogPost[] = [
  passwordGeneratorPost,
  qrCodePost,
  uuidGeneratorPost,
  loremIpsumPost,
  faviconGeneratorPost,
  gradientGeneratorPost,
  instagramBioPost,
  hashtagGeneratorPost,
  whatsappLinkPost,
  countdownTimerPost,
  cornellNotePost,
]