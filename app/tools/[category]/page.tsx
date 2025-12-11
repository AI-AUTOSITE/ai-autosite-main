// app/tools/[category]/page.tsx
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getCategoryById } from '@/lib/categories-config'
import { getToolsByCategory } from '@/lib/unified-data'
import CategoryDetailView from '@/components/CategoryDetailView'
import { mapCategoryId } from '@/lib/core/status-map'

// ========================================
// Category-specific SEO Metadata
// ========================================
const CATEGORY_SEO: Record<string, {
  title: string
  description: string
  keywords: string
  ogTitle: string
  ogDescription: string
  twitterTitle: string
  twitterDescription: string
}> = {
  'ai-tools': {
    title: 'Free AI Tools - Powered by Claude & GPT | AI AutoSite',
    description: 'AI-powered productivity tools. Resume builder, text summarizer, prompt generator, code review. Powered by Claude and OpenAI. No ads.',
    keywords: 'ai tools, chatgpt, claude, ai summarizer, ai resume, prompt generator, code review, free, no ads',
    ogTitle: 'AI Tools - Truly Free, No Ads Ever',
    ogDescription: 'Zero ads, zero tracking, zero BS. AI-powered productivity and creativity.',
    twitterTitle: 'Free AI Tools - No Ads, No Sign Up',
    twitterDescription: 'AI-powered tools without ads or tracking.',
  },
  'analyzers': {
    title: 'Free Analyzer Tools - Data & Performance Analysis | AI AutoSite',
    description: 'Analyze files, networks, tokens, and performance. PC optimization, network diagnostics, token compression. No ads, no tracking.',
    keywords: 'analyzer tools, data analysis, network checker, token analyzer, pc optimizer, performance, free, no ads',
    ogTitle: 'Analyzer Tools - Truly Free, No Ads Ever',
    ogDescription: 'Zero ads, zero tracking, zero BS. Analyze data and optimize performance.',
    twitterTitle: 'Free Analyzer Tools - No Ads, No Sign Up',
    twitterDescription: 'Analyze and optimize without ads or tracking.',
  },
  'converters': {
    title: 'Free Converter Tools - Format & Unit Conversion | AI AutoSite',
    description: 'Convert files, formats, and units instantly. Base64, text case, unit converter, and more. No ads, no tracking.',
    keywords: 'converter tools, format converter, unit converter, base64, text converter, free, no ads',
    ogTitle: 'Converter Tools - Truly Free, No Ads Ever',
    ogDescription: 'Zero ads, zero tracking, zero BS. Convert formats and calculate instantly.',
    twitterTitle: 'Free Converter Tools - No Ads, No Sign Up',
    twitterDescription: 'Convert formats without ads or tracking.',
  },
  'dev-tools': {
    title: 'Free Developer Tools - Code & API Utilities | AI AutoSite',
    description: 'Developer utilities for coding, testing, and debugging. JSON formatter, UUID generator, code visualization. No ads.',
    keywords: 'dev tools, developer tools, json formatter, uuid generator, code tools, api tools, free, no ads',
    ogTitle: 'Dev Tools - Truly Free, No Ads Ever',
    ogDescription: 'Zero ads, zero tracking, zero BS. Developer utilities that just work.',
    twitterTitle: 'Free Dev Tools - No Ads, No Sign Up',
    twitterDescription: 'Developer tools without ads or tracking.',
  },
  'editors': {
    title: 'Free Editor Tools - Image, PDF & Document Editing | AI AutoSite',
    description: 'Edit images, PDFs, and documents online. Compress, resize, convert, and more. No ads, no tracking, works offline.',
    keywords: 'editor tools, image editor, pdf editor, document editor, compress, resize, free, no ads',
    ogTitle: 'Editor Tools - Truly Free, No Ads Ever',
    ogDescription: 'Zero ads, zero tracking, zero BS. Edit files in your browser.',
    twitterTitle: 'Free Editor Tools - No Ads, No Sign Up',
    twitterDescription: 'Edit images and documents without ads or tracking.',
  },
  'generators': {
    title: 'Free Generator Tools - Create Content & Codes | AI AutoSite',
    description: 'Generate passwords, QR codes, gradients, favicons, and test data. Quick and secure generation. No ads.',
    keywords: 'generator tools, password generator, qr code generator, favicon generator, test data, free, no ads',
    ogTitle: 'Generator Tools - Truly Free, No Ads Ever',
    ogDescription: 'Zero ads, zero tracking, zero BS. Generate content and codes instantly.',
    twitterTitle: 'Free Generator Tools - No Ads, No Sign Up',
    twitterDescription: 'Generate content without ads or tracking.',
  },
  'learning': {
    title: 'Free Learning Tools - Study & Productivity | AI AutoSite',
    description: 'Study tools for students. Pomodoro timer, Cornell notes, flashcards, and more. Boost your learning. No ads.',
    keywords: 'learning tools, study tools, pomodoro timer, cornell notes, flashcards, productivity, free, no ads',
    ogTitle: 'Learning Tools - Truly Free, No Ads Ever',
    ogDescription: 'Zero ads, zero tracking, zero BS. Study smarter, not harder.',
    twitterTitle: 'Free Learning Tools - No Ads, No Sign Up',
    twitterDescription: 'Study tools without ads or tracking.',
  },
  'privacy': {
    title: 'Free Privacy Tools - Protect Your Data | AI AutoSite',
    description: 'Understand privacy policies, check data safety, and protect your information online. No ads, no tracking.',
    keywords: 'privacy tools, privacy policy analyzer, data protection, gdpr, security, free, no ads',
    ogTitle: 'Privacy Tools - Truly Free, No Ads Ever',
    ogDescription: 'Zero ads, zero tracking, zero BS. Protect your privacy online.',
    twitterTitle: 'Free Privacy Tools - No Ads, No Sign Up',
    twitterDescription: 'Privacy protection without ads or tracking.',
  },
}

// ========================================
// Generate metadata for SEO
// ========================================
export async function generateMetadata({
  params,
}: {
  params: { category: string }
}): Promise<Metadata> {
  // Map old category names to new ones
  const mappedCategoryId = mapCategoryId(params.category)
  const category = getCategoryById(mappedCategoryId)

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  // Get category-specific SEO or use defaults
  const seo = CATEGORY_SEO[mappedCategoryId] || {
    title: `${category.name} - Free Tools | AI AutoSite`,
    description: category.description,
    keywords: `${category.name.toLowerCase()}, tools, free, no ads`,
    ogTitle: `${category.name} - Truly Free, No Ads Ever`,
    ogDescription: category.description,
    twitterTitle: `Free ${category.name} - No Ads, No Sign Up`,
    twitterDescription: category.description,
  }

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.twitterTitle,
      description: seo.twitterDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://ai-autosite.com/tools/${mappedCategoryId}`,
    },
  }
}

// Generate static params for all enabled categories
export async function generateStaticParams() {
  const { getEnabledCategories } = await import('@/lib/categories-config')
  const categories = getEnabledCategories()

  return categories.map((cat) => ({
    category: cat.id,
  }))
}

export default function CategoryPage({
  params,
}: {
  params: { category: string }
}) {
  // Handle old category names (redirect to new ones)
  const mappedCategoryId = mapCategoryId(params.category)
  if (mappedCategoryId !== params.category) {
    redirect(`/tools/${mappedCategoryId}`)
  }

  const category = getCategoryById(params.category)

  if (!category || category.enabled === false) {
    notFound()
  }

  // Get active tools for this category
  const tools = getToolsByCategory(params.category).filter(
    (tool) => tool.isActive || tool.status === 'live'
  )

  // Sort tools alphabetically by name (server-side default sort)
  const sortedTools = tools.sort((a, b) => {
    return (a.name || '').localeCompare(b.name || '')
  })

  // Remove icon (function) from category before passing to client component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { icon, ...categoryWithoutIcon } = category

  return (
    <div className="min-h-screen bg-gray-800">
      <CategoryDetailView category={categoryWithoutIcon as any} tools={sortedTools} />
    </div>
  )
}