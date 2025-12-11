import { Metadata } from 'next'
import AspectRatioCalculatorClient from './components/AspectRatioCalculatorClient'

export const metadata: Metadata = {
  title: 'Aspect Ratio Calculator - Image & Video Dimensions | AI AutoSite',
  description: 'Calculate aspect ratios for images and videos. SNS presets for Instagram, YouTube, TikTok. Visual preview and dimension lock. 100% private.',
  keywords: 'aspect ratio calculator, image ratio, video dimensions, instagram size, youtube dimensions, 16:9 calculator',
  openGraph: { title: 'Aspect Ratio Calculator - Free Online Tool', description: 'Calculate dimensions with SNS presets and visual preview.' },
  twitter: { card: 'summary_large_image', title: 'Aspect Ratio Calculator' },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://ai-autosite.com/tools/aspect-ratio-calculator' },
}

export default function AspectRatioCalculatorPage() {
  return <AspectRatioCalculatorClient />
}
