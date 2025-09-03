// app/tools/text-case/page.tsx
import { Metadata } from 'next'
import TextCaseConverter from './components/TextCaseConverter'

export const metadata: Metadata = {
  title: 'Text Case Converter - Instant Case Conversion | AI AutoSite',
  description: 'Convert text between UPPERCASE, lowercase, camelCase, snake_case and more. Free online text case converter with 10+ formats. No signup required.',
  keywords: 'text case converter, uppercase, lowercase, camelCase, snake_case, title case, text formatter',
  openGraph: {
    title: 'Text Case Converter - Free Online Tool',
    description: 'Instantly convert text between different cases',
    type: 'website',
  }
}

export default function Page() {
  return <TextCaseConverter />
}