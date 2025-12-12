import type { Metadata } from 'next'
import BgEraserClient from './BgEraserClient'

// 🔥 このページを完全に静的化（サーバーレス関数を生成しない）
export const dynamic = 'force-static'
export const dynamicParams = false
export const revalidate = false

export const metadata: Metadata = {
  title: 'AI Background Eraser - Remove Image Backgrounds Instantly | Free Online Tool',
  description: 'Remove backgrounds from images instantly with AI. Free, no signup required. Works with photos of people, products, animals and more. 100% private - processed in your browser.',
  keywords: [
    'background remover',
    'remove background',
    'AI background eraser',
    'transparent background',
    'photo background remover',
    'free background remover',
    'image background removal',
    'remove bg',
    'cutout tool',
    'product photo background'
  ],
  openGraph: {
    title: 'AI Background Eraser - Remove Backgrounds Instantly',
    description: 'Free AI-powered background removal. No signup, 100% private, works in your browser.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Background Eraser',
    description: 'Remove backgrounds from any image with AI - free and private.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/tools/bg-eraser',
  },
}

export default function BgEraserPage() {
  return (
    <main className="min-h-screen bg-gray-900">
      <BgEraserClient />
    </main>
  )
}