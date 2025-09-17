// app/tools/japanese-ocr/page.tsx
import { Metadata } from 'next'
import JapaneseOCR from './components/JapaneseOCR'

export const metadata: Metadata = {
  title: 'Japanese OCR & Translation - Extract Text from Images | AI AutoSite',
  description: 'Free online Japanese OCR tool. Extract Japanese text from images and translate to English. Supports vertical and horizontal text with 99% accuracy.',
  keywords: 'japanese ocr, image to text, japanese translation, tesseract, text extraction, 日本語OCR',
  openGraph: {
    title: 'Japanese OCR & Translation Tool',
    description: 'Extract and translate Japanese text from images instantly',
    type: 'website',
  }
}

export default function JapaneseOCRPage() {
  return <JapaneseOCR />
}