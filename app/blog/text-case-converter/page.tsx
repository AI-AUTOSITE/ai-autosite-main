import Link from 'next/link'
import { Metadata } from 'next'
import {
  ArrowLeft,
  Type,
  Code,
  Zap,
  Download,
  Copy,
  FileText,
  Globe,
  CheckCircle,
  Braces,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Master Text Case Conversion: 10 Essential Formats for Developers | AI AutoSite',
  description:
    'Learn how to use our Text Case Converter tool. Convert between UPPERCASE, camelCase, snake_case, and more. Essential guide for developers and content creators.',
  keywords:
    'text case converter, camelCase, snake_case, PascalCase, kebab-case, uppercase, lowercase, programming naming conventions, text formatting',
  openGraph: {
    title: 'Text Case Converter: Complete Guide to Text Formatting',
    description:
      'Master all text case formats with our free converter tool. From camelCase to snake_case - learn when and how to use each format.',
    type: 'article',
    images: ['/og-text-case.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Text Case Converter Guide - 10 Essential Formats',
    description: 'Free tool & complete guide for text case conversion',
  },
}

export default function TextCaseConverterBlogPost() {
  const publishDate = '2025-01-20'
  const author = 'AI AutoSite Team'
  const readTime = '8 min read'

  const caseTypes = [
    {
      name: 'UPPERCASE',
      example: 'HELLO_WORLD',
      usage: 'Constants in programming, emphasis in text',
      languages: ['Python', 'JavaScript', 'Java'],
      description: 'All letters capitalized. Common for constants and environment variables.',
    },
    {
      name: 'lowercase',
      example: 'hello_world',
      usage: 'Variable names, file names, URLs',
      languages: ['Python', 'Ruby', 'Go'],
      description: 'All letters in lower case. Standard for most programming contexts.',
    },
    {
      name: 'Title Case',
      example: 'Hello World',
      usage: 'Headlines, titles, proper nouns',
      languages: ['Markdown', 'Documentation'],
      description: 'First letter of each word capitalized. Perfect for headings and titles.',
    },
    {
      name: 'camelCase',
      example: 'helloWorld',
      usage: 'JavaScript variables, method names',
      languages: ['JavaScript', 'TypeScript', 'Java'],
      description: 'First word lowercase, subsequent words capitalized. No spaces.',
    },
    {
      name: 'PascalCase',
      example: 'HelloWorld',
      usage: 'Class names, components, types',
      languages: ['C#', 'React', 'TypeScript'],
      description: 'Every word starts with capital letter. Used for classes and components.',
    },
    {
      name: 'snake_case',
      example: 'hello_world',
      usage: 'Python variables, database fields',
      languages: ['Python', 'Ruby', 'PostgreSQL'],
      description: "Words separated by underscores. Python's preferred naming convention.",
    },
    {
      name: 'kebab-case',
      example: 'hello-world',
      usage: 'URLs, CSS classes, file names',
      languages: ['CSS', 'HTML', 'URLs'],
      description: 'Words separated by hyphens. SEO-friendly for URLs.',
    },
    // 既存の記事の後に追加
    {
      id: 'text-case-converter-guide',
      title: 'Master Text Case Conversion: 10 Essential Formats',
      description:
        'Complete guide to text case conversion. Learn when to use camelCase, snake_case, PascalCase and more in your development workflow.',
      category: 'Developer Tools',
      readTime: '8 min read',
      publishDate: 'January 2025',
      featured: false,
      status: 'published',
      url: '/blog/text-case-converter',
      icon: Type, // lucide-reactからインポート必要
      color: 'from-cyan-500 to-purple-500',
      relatedTool: {
        name: 'Text Case Converter',
        url: '/tools/text-case',
        description: 'Convert between 10 text formats',
      },
    },
    {
      id: 'json-beautify-guide',
      title: 'JSON Beautify: Format & Debug Like a Pro',
      description:
        'Learn how to format, validate, and debug JSON effectively. Essential guide for API development and configuration management.',
      category: 'Developer Tools',
      readTime: '10 min read',
      publishDate: 'January 2025',
      featured: false,
      status: 'published',
      url: '/blog/json-beautify-guide',
      icon: Braces, // lucide-reactからインポート必要
      color: 'from-green-500 to-emerald-500',
      relatedTool: {
        name: 'JSON Beautify',
        url: '/tools/json-format',
        description: 'Format and validate JSON',
      },
    },
  ]

  const useCases = [
    {
      scenario: 'API Development',
      problem:
        'Converting between database field names (snake_case) and JSON responses (camelCase)',
      solution: 'Use our converter to quickly transform field names when building APIs',
      icon: Code,
    },
    {
      scenario: 'Content Migration',
      problem: 'Moving content between different CMS systems with different naming conventions',
      solution: 'Batch convert all titles and slugs to match the new system requirements',
      icon: FileText,
    },
    {
      scenario: 'Code Refactoring',
      problem: 'Changing variable naming conventions across a large codebase',
      solution: 'Convert variable names to match team coding standards',
      icon: Zap,
    },
  ]

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back to Blog */}
      <Link
        href="/blog"
        className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-8 group"
      >
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
        Back to Blog
      </Link>

      {/* Article Header */}
      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30">
            Developer Tools
          </span>
          <span>•</span>
          <time dateTime={publishDate}>
            {new Date(publishDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </time>
          <span>•</span>
          <span>{readTime}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Master Text Case Conversion:
          <span className="block text-3xl sm:text-4xl mt-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            10 Essential Formats Every Developer Should Know
          </span>
        </h1>

        <p className="text-xl text-gray-300 leading-relaxed">
          Whether you're naming variables, creating URLs, or formatting content, using the right
          text case is crucial. Our Text Case Converter tool makes it instant and effortless.
        </p>
      </header>

      {/* Tool Demo CTA */}
      <div className="mb-12 p-8 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl border border-white/10">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <Type className="w-24 h-24 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Text Case Converter</h2>
            <p className="text-gray-400 mb-6">
              Convert between 10 different text formats instantly
            </p>
            <Link
              href="/tools/text-case"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <Zap className="mr-2" size={20} />
              Try the Converter Now - It's Free!
            </Link>
          </div>
        </div>
      </div>

      {/* Why Text Case Matters */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Why Text Case Matters</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 mb-4">
            Text case isn't just about aesthetics—it's about communication, standards, and
            functionality. Using the wrong case can break your code, hurt SEO, or make your content
            harder to read.
          </p>
          <div className="grid md:grid-cols-3 gap-4 my-6">
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <Code className="w-8 h-8 text-cyan-400 mb-2" />
              <h3 className="text-white font-semibold mb-1">Code Consistency</h3>
              <p className="text-gray-400 text-sm">
                Follow language conventions for better readability
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <Globe className="w-8 h-8 text-purple-400 mb-2" />
              <h3 className="text-white font-semibold mb-1">SEO Optimization</h3>
              <p className="text-gray-400 text-sm">kebab-case URLs rank better in search engines</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <CheckCircle className="w-8 h-8 text-green-400 mb-2" />
              <h3 className="text-white font-semibold mb-1">Team Standards</h3>
              <p className="text-gray-400 text-sm">Maintain consistency across your codebase</p>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Guide to Case Types */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-8">Complete Guide to All Case Types</h2>
        <div className="space-y-6">
          {caseTypes.map((caseType, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{caseType.name}</h3>
                  <code className="text-cyan-400 bg-black/30 px-3 py-1 rounded text-sm">
                    {caseType.example}
                  </code>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  {caseType.languages?.map((lang) => (
                    <span
                      key={lang}
                      className="text-xs px-2 py-1 bg-white/10 text-gray-300 rounded"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-400 mb-2">{caseType.description}</p>
              <p className="text-sm text-gray-500">
                <strong className="text-gray-400">Common uses:</strong> {caseType.usage}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Real-World Use Cases */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-8">Real-World Use Cases</h2>
        <div className="grid md:grid-cols-1 gap-6">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon
            return (
              <div
                key={index}
                className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-6 border border-white/10"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-cyan-500/20">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{useCase.scenario}</h3>
                    <div className="space-y-2">
                      <p className="text-gray-400">
                        <strong className="text-gray-300">Problem:</strong> {useCase.problem}
                      </p>
                      <p className="text-gray-400">
                        <strong className="text-gray-300">Solution:</strong> {useCase.solution}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Code Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Code Examples</h2>
        <div className="space-y-6">
          <div className="bg-black/50 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">
              JavaScript: Converting Object Keys
            </h3>
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>{`// Database returns snake_case
const dbUser = {
  user_name: "john_doe",
  created_at: "2024-01-01",
  is_active: true
}

// Convert to camelCase for frontend
const user = {
  userName: "john_doe",    // camelCase
  createdAt: "2024-01-01", // camelCase
  isActive: true           // camelCase
}`}</code>
            </pre>
          </div>

          <div className="bg-black/50 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">
              Python: Following PEP 8 Standards
            </h3>
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>{`# Constants use UPPERCASE
MAX_RETRIES = 3
API_BASE_URL = "https://api.example.com"

# Variables and functions use snake_case
def get_user_data(user_id):
    response_data = fetch_from_api(user_id)
    return response_data

# Classes use PascalCase
class UserAuthentication:
    pass`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Pro Tips */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Pro Tips for Text Case Conversion</h2>
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl p-6 border border-white/10">
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
              <span>
                <strong className="text-white">Consistency is key:</strong> Pick a convention and
                stick to it throughout your project
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
              <span>
                <strong className="text-white">Follow language conventions:</strong> Use camelCase
                for JavaScript, snake_case for Python
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
              <span>
                <strong className="text-white">URL optimization:</strong> Always use kebab-case for
                SEO-friendly URLs
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
              <span>
                <strong className="text-white">Database fields:</strong> Most SQL databases prefer
                snake_case for column names
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
              <span>
                <strong className="text-white">Component naming:</strong> React components should
                always use PascalCase
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Tool Features */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Why Use Our Text Case Converter?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">Instant Conversion</h3>
            <p className="text-gray-400 mb-4">
              Real-time conversion as you type. No waiting, no page reloads.
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• 10 different case formats</li>
              <li>• Character, word, and line counting</li>
              <li>• File upload support</li>
            </ul>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">Developer-Friendly</h3>
            <p className="text-gray-400 mb-4">
              Built by developers, for developers. All the features you need.
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Copy to clipboard with one click</li>
              <li>• Download as text file</li>
              <li>• 100% offline - works without internet</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-4">Start Converting Text Now</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          No signup required. No data stored. Just instant text case conversion whenever you need
          it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/tools/text-case"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <Type className="mr-2" size={20} />
            Open Text Case Converter
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
          >
            Explore All Tools
          </Link>
        </div>
      </section>

      {/* Related Tools */}
      <section className="mt-12">
        <h3 className="text-2xl font-bold text-white mb-6">Related Tools You Might Like</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/tools/json-format" className="group">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-cyan-400/30 transition-all">
              <h4 className="text-white font-semibold mb-2 group-hover:text-cyan-400">
                JSON Beautify
              </h4>
              <p className="text-gray-400 text-sm">Format and validate JSON data</p>
            </div>
          </Link>
          <Link href="/tools/code-reader" className="group">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-cyan-400/30 transition-all">
              <h4 className="text-white font-semibold mb-2 group-hover:text-cyan-400">
                Code Reader
              </h4>
              <p className="text-gray-400 text-sm">Analyze code dependencies</p>
            </div>
          </Link>
          <Link href="/tools/blurtap" className="group">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-cyan-400/30 transition-all">
              <h4 className="text-white font-semibold mb-2 group-hover:text-cyan-400">BlurTap</h4>
              <p className="text-gray-400 text-sm">Mask sensitive information</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Author Info */}
      <footer className="mt-12 pt-8 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            By {author} • {publishDate}
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-white/10 text-gray-300 rounded-md text-xs">
              Development
            </span>
            <span className="px-3 py-1 bg-white/10 text-gray-300 rounded-md text-xs">Tools</span>
            <span className="px-3 py-1 bg-white/10 text-gray-300 rounded-md text-xs">Tutorial</span>
          </div>
        </div>
      </footer>
    </article>
  )
}
