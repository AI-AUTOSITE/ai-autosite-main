import Link from 'next/link'
import { Calendar, Clock, ArrowLeft, Shield } from 'lucide-react'
import type { Metadata } from 'next'

// 記事データ（後でMDXやCMSから取得）
const articles: Record<string, any> = {
  'protect-screenshot-privacy-2024': {
    title: 'How to Protect Privacy in Screenshots: Complete Guide 2024',
    date: '2024-01-20',
    readTime: '5 min read',
    category: 'Privacy',
    content: `
      <h2>Why Screenshot Privacy Matters</h2>
      <p>In today's digital workplace, we share screenshots daily - in emails, documentation, presentations, and team communications. However, these images often contain sensitive information that shouldn't be exposed: personal emails, private messages, financial data, passwords, API keys, and customer information.</p>
      
      <p>A single unredacted screenshot can lead to data breaches, identity theft, compliance violations, or embarrassing information leaks. That's why masking sensitive data before sharing is crucial.</p>

      <h2>Common Sensitive Information to Mask</h2>
      <ul>
        <li><strong>Personal Identifiable Information (PII):</strong> Names, addresses, phone numbers, social security numbers</li>
        <li><strong>Financial Data:</strong> Credit card numbers, bank account details, salary information</li>
        <li><strong>Login Credentials:</strong> Usernames, passwords, API keys, tokens</li>
        <li><strong>Private Communications:</strong> Email addresses, chat messages, personal conversations</li>
        <li><strong>Business Confidential:</strong> Client lists, pricing, internal strategies</li>
      </ul>

      <h2>Best Practices for Screenshot Privacy</h2>
      
      <h3>1. Mask Before Sharing</h3>
      <p>Always review screenshots before sharing them. Look for any information that could be sensitive or personally identifiable. When in doubt, mask it out.</p>

      <h3>2. Use Proper Masking Tools</h3>
      <p>Don't rely on simple blur effects - they can sometimes be reversed. Use solid color blocks (like black rectangles) for complete privacy protection. Tools like <a href="/">BlurTap</a> make this process quick and secure.</p>

      <h3>3. Local Processing is Key</h3>
      <p>Choose tools that process images locally in your browser rather than uploading to servers. This ensures your sensitive data never leaves your device during the masking process.</p>

      <h3>4. Double-Check Your Work</h3>
      <p>Before sharing, zoom in and carefully review the masked image. Ensure all sensitive information is completely covered and the masking can't be easily removed.</p>

      <h2>Common Mistakes to Avoid</h2>
      <ul>
        <li>Using transparent or semi-transparent masks</li>
        <li>Forgetting to mask information in browser tabs or taskbars</li>
        <li>Missing sensitive data in unexpected places (reflections, backgrounds)</li>
        <li>Sharing the original file alongside the masked version</li>
        <li>Using reversible blur or pixelation effects</li>
      </ul>

      <h2>Tools for Screenshot Privacy</h2>
      <p>While many image editors can add masks, specialized privacy tools offer advantages:</p>
      <ul>
        <li><strong>Speed:</strong> Quick one-click or drag-to-mask interfaces</li>
        <li><strong>Security:</strong> Local processing without uploads</li>
        <li><strong>Simplicity:</strong> No complex software to learn</li>
        <li><strong>Accessibility:</strong> Works directly in your browser</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Protecting privacy in screenshots is a simple but critical practice. By taking a few seconds to mask sensitive information, you can prevent data leaks, maintain compliance, and protect both personal and business information.</p>
      
      <p>Start implementing these practices today with free tools like <a href="/">BlurTap</a>, which offers instant, local processing for maximum privacy protection.</p>
    `,
  },
  // 他の記事も同様に追加
}

type Props = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = articles[params.slug]

  if (!article) {
    return {
      title: 'Article Not Found | BlurTap Blog',
    }
  }

  return {
    title: `${article.title} | BlurTap Blog`,
    description: article.title,
  }
}

export default function BlogPostPage({ params }: Props) {
  const article = articles[params.slug]

  if (!article) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-white mb-4">Article Not Found</h1>
        <p className="text-gray-400 mb-8">The article you're looking for doesn't exist.</p>
        <Link
          href="/blog"
          className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blog</span>
        </Link>
      </div>
    )
  }

  return (
    <article className="max-w-3xl mx-auto">
      {/* 戻るリンク */}
      <Link
        href="/blog"
        className="inline-flex items-center space-x-2 text-gray-400 hover:text-cyan-400 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Blog</span>
      </Link>

      {/* 記事ヘッダー */}
      <header className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-gray-300">
            {article.category}
          </span>
          <span className="flex items-center space-x-1 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{article.date}</span>
          </span>
          <span className="flex items-center space-x-1 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{article.readTime}</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white">{article.title}</h1>
      </header>

      {/* 記事本文 */}
      <div
        className="prose prose-invert prose-lg max-w-none
          prose-headings:text-white prose-headings:font-bold
          prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
          prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
          prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:text-cyan-300
          prose-strong:text-white prose-strong:font-semibold
          prose-ul:text-gray-300 prose-ul:my-4
          prose-li:my-2
          prose-code:text-cyan-400 prose-code:bg-white/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* CTA */}
      <div className="mt-12 p-8 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl border border-cyan-500/20">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-8 h-8 text-cyan-400" />
          <h3 className="text-xl font-bold text-white">Try BlurTap Now</h3>
        </div>
        <p className="text-gray-300 mb-4">
          Protect your privacy with our free image masking tool. No signup required, 100% local
          processing.
        </p>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
        >
          <span>Start Masking Images</span>
        </Link>
      </div>

      {/* 関連記事（オプション） */}
      <div className="mt-12 pt-8 border-t border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">Related Articles</h3>
        <div className="space-y-3">
          <Link
            href="/blog/gdpr-compliance-image-masking"
            className="block p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
          >
            <h4 className="text-white font-semibold mb-1">
              GDPR Compliance: Why Image Masking Matters
            </h4>
            <p className="text-sm text-gray-400">
              Learn about compliance requirements for handling personal data in images.
            </p>
          </Link>
        </div>
      </div>
    </article>
  )
}
