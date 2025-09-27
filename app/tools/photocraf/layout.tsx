import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PhotoCraft - Free Online Photo Editor with Custom Filters',
  description: 'Professional photo editing in your browser. Create custom filters, apply advanced effects, and transform your images with our powerful online editor.',
  keywords: 'photo editor, image editing, online editor, custom filters, photo effects, free photo editor, browser editor',
  openGraph: {
    title: 'PhotoCraft - Professional Photo Editor',
    description: 'Create stunning images with custom filters and professional editing tools.',
    type: 'website',
  },
}

export default function PhotoCraftLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-950">
      {children}
    </div>
  )
}