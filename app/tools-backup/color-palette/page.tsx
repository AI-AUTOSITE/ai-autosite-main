
import { Metadata } from 'next'
import ColorPaletteClient from './components/ColorPaletteClient'

export const metadata: Metadata = {
  title: 'Color Palette Generator - Beautiful Color Schemes | AI AutoSite',
  description: 'Generate beautiful color palettes instantly. Perfect for design, web development, and art. Free color scheme generator.',
  keywords: 'color palette, color generator, color scheme, hex colors, design colors, palette generator',
  openGraph: {
    title: 'Color Palette Generator - Free Design Tool',
    description: 'Create beautiful color combinations instantly',
    type: 'website',
  },
}

export default function ColorPalettePage() {
  return <ColorPaletteClient />
}