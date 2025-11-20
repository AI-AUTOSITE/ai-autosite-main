// app/automation/layout.tsx
import type { Metadata } from 'next'
import AutomationHeader from '@/components/automation/AutomationHeader'
import AutomationFooter from '@/components/automation/AutomationFooter'

export const metadata: Metadata = {
  title: {
    default: 'Automation Consulting | AI AutoSite',
    template: '%s | Automation - AI AutoSite'
  },
  description: 'Business automation consulting and custom chatbot development. Transform your business with AI-powered solutions.',
  keywords: 'automation, chatbot, business automation, AI consulting, cafe chatbot, restaurant automation',
  openGraph: {
    title: 'Business Automation Consulting',
    description: 'Transform your business with custom chatbots and automation solutions',
    type: 'website',
    images: [
      {
        url: '/images/automation-og.png',
        width: 1200,
        height: 630,
        alt: 'AI AutoSite Automation Consulting'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Automation Consulting',
    description: 'Custom chatbots and automation solutions for your business',
    images: ['/images/automation-twitter.png']
  }
}

export default function AutomationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="automation-section min-h-screen flex flex-col">
      {/* Automation専用のヘッダー - 有効化しました */}
      <AutomationHeader />
      
      {/* メインコンテンツ */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Automation専用のフッター - 有効化しました */}
      <AutomationFooter />
    </div>
  )
}