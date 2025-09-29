
import { Metadata } from 'next'
import Base64Client from './components/Base64Client'

export const metadata: Metadata = {
  title: 'Base64 Encoder Decoder - Convert Text & Files | AI AutoSite',
  description: 'Encode and decode Base64 online. Convert text, images, and files. Free Base64 converter for developers.',
  keywords: 'base64 encoder, base64 decoder, base64 converter, encode base64, decode base64',
  openGraph: {
    title: 'Base64 Encoder/Decoder - Free Tool',
    description: 'Convert text and files to/from Base64',
    type: 'website',
  },
}

export default function Base64Page() {
  return <Base64Client />
}