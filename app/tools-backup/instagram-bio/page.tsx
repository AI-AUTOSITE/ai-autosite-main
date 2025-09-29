import { Metadata } from 'next'
import InstagramBioClient from './components/InstagramBioClient'

export const metadata: Metadata = {
  title: 'Instagram Bio Generator - Create Perfect Bio | AI AutoSite',
  description: 'Generate creative Instagram bios instantly. Professional, fun, or creative styles with emojis. Free bio generator tool.',
  keywords: 'instagram bio, bio generator, instagram profile, social media bio, creative bio',
  openGraph: {
    title: 'Instagram Bio Generator - Free Online Tool',
    description: 'Create the perfect Instagram bio in seconds',
    type: 'website',
  },
}

export default function InstagramBioPage() {
  return <InstagramBioClient />
}