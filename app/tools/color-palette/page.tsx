
import { Metadata } from 'next'
import ColorPaletteClient from './components/ColorPaletteClient'

export const metadata: Metadata = {
  title: 'Free Color Palette Generator - No Ads, No Sign Up | AI AutoSite',
  description: 'Generate beautiful color palettes instantly. 100% free, no ads, works offline in your browser.',
  keywords: 'free color palette, no ads, color generator, design colors, privacy, no tracking',
  openGraph: {
    title: 'Color Palette Generator - Truly Free, No Ads',
    description: 'Zero ads, zero tracking. Create beautiful color combinations instantly.',
    type: 'website',
    images: [{
      url: '/og-color-palette.png',
      width: 1200,
      height: 630,
      alt: 'Free Color Palette Generator - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Color Palette - Free Forever, No Tracking',
    description: 'Beautiful palettes without ads or sign-ups.'
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/color-palette'
  }
}

export default function ColorPalettePage() {
  return <ColorPaletteClient />
}