import Link from 'next/link'
import { Metadata } from 'next'
import {
  ArrowLeft,
  Flame,
  BookOpen,
  Wrench,
  AlertCircle,
  Lightbulb,
  CheckCircle,
  Code2,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'How to Use Code Roaster: Complete Guide to AI Code Reviews | AI AutoSite',
  description:
    'Step-by-step guide to using Code Roaster for AI-powered code reviews. Learn how to get the most out of Roast, Explain, and Fix modes for better coding.',
  keywords:
    'code roaster tutorial, how to use code roaster, ai code review guide, code analysis tutorial, debugging with ai, code improvement tips',
  openGraph: {
    title: 'Master Code Roaster: Your Guide to AI Code Reviews',
    description: 'Learn how to use Code Roaster effectively for instant code feedback',
    type: 'article',
    images: ['/og-code-roaster-howto.png'],
  },
}

export default function HowToUseCodeRoaster() {
  const publishDate = '2025-01-24'
  const readTime = '7 min read'

  const bestPractices = [
    {
      title: 'Include Context',
      description: 'Add comments or a brief description if your code snippet needs context',
      icon: Lightbulb,
    },
    {
      title: 'Start with Explain Mode',
      description:
        "If you're learning, try Explain mode first to understand before getting roasted",
      icon: BookOpen,
    },
    {
      title: 'Use Fix Mode Wisely',
      description: "Don't just copy-paste fixes – understand what changed and why",
      icon: Wrench,
    },
    {
      title: 'Embrace the Roast',
      description: 'The harsh feedback is meant to be memorable – laugh and learn!',
      icon: Flame,
    },
  ]

  const commonMistakes = [
    {
      mistake: 'Pasting entire files',
      solution: 'Focus on specific problematic sections (under 10,000 characters)',
    },
    {
      mistake: 'Ignoring the feedback',
      solution: 'Read carefully and apply the suggestions to similar code elsewhere',
    },
    {
      mistake: 'Using non-English comments',
      solution: 'Keep everything in English for best results',
    },
    {
      mistake: 'Not trying all modes',
      solution: 'Each mode offers different insights – try them all!',
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
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">Tutorial</span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          How to Use Code Roaster
          <span className="block text-3xl sm:text-4xl mt-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Your Complete Guide to AI Code Reviews
          </span>
        </h1>

        <p className="text-xl text-gray-300 leading-relaxed">
          Master the art of getting AI-powered code feedback with this comprehensive guide. Learn
          when to roast, when to explain, and when to fix for maximum learning impact.
        </p>
      </header>

      {/* Getting Started */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Getting Started</h2>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <p className="text-gray-300 mb-4">
            Code Roaster is designed to be incredibly simple to use – no sign-ups, no installations,
            just instant feedback. Here's everything you need to know to get started:
          </p>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <span>
                Access the tool at{' '}
                <Link href="/tools/code-roaster" className="text-cyan-400 hover:text-cyan-300">
                  ai-autosite.com/tools/code-roaster
                </Link>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <span>No account or API key required</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <span>3 free reviews per day</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Supports all major programming languages</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Step by Step Guide */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Step-by-Step Instructions</h2>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-start gap-4 mb-4">
              <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </span>
              <h3 className="text-xl font-bold text-white">Prepare Your Code</h3>
            </div>
            <p className="text-gray-300 mb-3">
              Select the code snippet you want to review. This could be:
            </p>
            <ul className="space-y-2 text-gray-300 ml-14">
              <li>• A function that's not working correctly</li>
              <li>• A class you want to optimize</li>
              <li>• An algorithm you're unsure about</li>
              <li>• Any code you want feedback on</li>
            </ul>
            <div className="mt-4 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <p className="text-yellow-400 text-sm flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>Tip: Keep it under 10,000 characters and in English for best results</span>
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-start gap-4 mb-4">
              <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </span>
              <h3 className="text-xl font-bold text-white">Choose Your Mode</h3>
            </div>

            <div className="space-y-4 ml-14">
              <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
                <h4 className="font-semibold text-orange-400 mb-2 flex items-center gap-2">
                  <Flame className="w-5 h-5" />
                  Roast Mode
                </h4>
                <p className="text-gray-300 text-sm">
                  Best for: Memorable lessons, finding bad practices, getting motivated to improve
                </p>
              </div>

              <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Explain Mode
                </h4>
                <p className="text-gray-300 text-sm">
                  Best for: Learning concepts, understanding code flow, beginner-friendly feedback
                </p>
              </div>

              <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  Fix Mode
                </h4>
                <p className="text-gray-300 text-sm">
                  Best for: Quick solutions, bug fixes, performance improvements
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-start gap-4 mb-4">
              <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </span>
              <h3 className="text-xl font-bold text-white">Analyze the Feedback</h3>
            </div>
            <p className="text-gray-300 mb-3 ml-14">Once you receive the AI's response:</p>
            <ol className="space-y-2 text-gray-300 ml-14">
              <li>1. Read through the entire feedback carefully</li>
              <li>2. Identify the key issues or improvements mentioned</li>
              <li>3. Copy the feedback using the copy button if needed</li>
              <li>4. Apply the suggestions to your code</li>
              <li>5. Test your improved code thoroughly</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Best Practices</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {bestPractices.map((practice, index) => {
            const Icon = practice.icon
            return (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-start gap-3">
                  <Icon className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white mb-1">{practice.title}</h3>
                    <p className="text-gray-400 text-sm">{practice.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Common Mistakes to Avoid</h2>
        <div className="bg-red-500/10 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
          <div className="space-y-4">
            {commonMistakes.map((item, index) => (
              <div key={index} className="flex gap-4">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 font-semibold">{item.mistake}</p>
                  <p className="text-gray-300 text-sm mt-1">{item.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Example Use Cases</h2>
        <div className="space-y-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="font-bold text-white mb-3">Debugging a Function</h3>
            <div className="bg-black/40 rounded-lg p-4 mb-3">
              <code className="text-sm text-gray-300 font-mono">
                {`function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i <= items.length; i++) {
    total += items[i].price;
  }
  return total;
}`}
              </code>
            </div>
            <p className="text-gray-400 text-sm">
              <strong>Use Fix Mode</strong> to identify the off-by-one error and get the corrected
              version
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="font-bold text-white mb-3">Learning a New Concept</h3>
            <div className="bg-black/40 rounded-lg p-4 mb-3">
              <code className="text-sm text-gray-300 font-mono">
                {`const result = array.reduce((acc, val) => acc + val, 0);`}
              </code>
            </div>
            <p className="text-gray-400 text-sm">
              <strong>Use Explain Mode</strong> to understand how reduce works and when to use it
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="font-bold text-white mb-3">Code Quality Check</h3>
            <div className="bg-black/40 rounded-lg p-4 mb-3">
              <code className="text-sm text-gray-300 font-mono">
                {`var x = document.getElementById('myDiv');
x.innerHTML = userInput;
x.style.color = 'red';`}
              </code>
            </div>
            <p className="text-gray-400 text-sm">
              <strong>Use Roast Mode</strong> to get memorable feedback about security issues and
              bad practices
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 cursor-pointer">
            <summary className="font-bold text-white">How accurate is the AI feedback?</summary>
            <p className="text-gray-300 mt-3 text-sm">
              Code Roaster uses advanced AI models that are highly accurate for common programming
              patterns and best practices. However, always verify critical fixes and use your
              judgment.
            </p>
          </details>

          <details className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 cursor-pointer">
            <summary className="font-bold text-white">
              Can I use it for any programming language?
            </summary>
            <p className="text-gray-300 mt-3 text-sm">
              Yes! Code Roaster supports all major programming languages including Python,
              JavaScript, Java, C++, Ruby, Go, and many more.
            </p>
          </details>

          <details className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 cursor-pointer">
            <summary className="font-bold text-white">Why is there a daily limit?</summary>
            <p className="text-gray-300 mt-3 text-sm">
              The 3-per-day limit ensures fair usage for all users and helps us maintain the service
              for free. The limit resets every 24 hours.
            </p>
          </details>

          <details className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 cursor-pointer">
            <summary className="font-bold text-white">Is my code kept private?</summary>
            <p className="text-gray-300 mt-3 text-sm">
              Absolutely. We don't store, log, or share any code you submit. Everything is processed
              temporarily and immediately discarded after generating the response.
            </p>
          </details>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Improve Your Code?</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Now that you know how to use Code Roaster effectively, it's time to put it to the test.
          Start with your most problematic code and watch it transform!
        </p>
        <Link
          href="/tools/code-roaster"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Code2 className="mr-2" size={20} />
          Try Code Roaster Now
        </Link>
      </section>
    </article>
  )
}
