import { Metadata } from 'next'
import EditorsClient from './components/EditorsClient'

export const metadata: Metadata = {
  title: 'Free Editor Tools - Image & PDF Editing | AI AutoSite',
  description:
    'Edit images and PDFs in your browser. Compress, split, blur, create grids. All processing happens locally. No ads, no tracking.',
  keywords:
    'image editor, pdf editor, image compress, blur tool, photo editor, pdf split, free, no ads, privacy',
  openGraph: {
    title: 'Editor Tools - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking, zero BS. Edit images and PDFs privately in your browser.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Editor Tools - No Ads, No Sign Up',
    description: 'Edit images and PDFs without ads or tracking.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/editors',
  },
}

export default function EditorsPage() {
  return <EditorsClient />
}