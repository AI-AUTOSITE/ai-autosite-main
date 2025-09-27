import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Flame, BookOpen, Wrench, Shield, Sparkles, Code2, Target } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Code Roaster: The AI Code Review Tool That Actually Makes You Laugh | AI AutoSite Blog',
  description: 'Discover Code Roaster, the revolutionary AI-powered code review tool that combines humor with helpful feedback. Learn how it can level up your coding skills while keeping you entertained.',
  keywords: 'code roaster, ai code review, programming feedback, code analysis, developer tools, code improvement, debugging help, programming humor',
  openGraph: {
    title: 'Code Roaster: AI Code Review with a Twist',
    description: 'The code review tool that roasts your bugs and fixes your mistakes',
    type: 'article',
    images: ['/og-code-roaster-blog.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Code Roaster: Where AI Meets Code Comedy',
    description: 'Get your code roasted, explained, or fixed by AI',
  }
}

export default function CodeRoasterBlogPost() {
  const publishDate = '2025-01-24'
  const author = 'AI AutoSite Team'
  const readTime = '5 min read'

  const features = [
    {
      icon: Flame,
      title: 'Roast Mode',
      description: 'Get brutally honest feedback with a side of humor. Learn from your mistakes while laughing at them.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: BookOpen,
      title: 'Explain Mode',
      description: 'Receive clear, beginner-friendly explanations of your code and its potential issues.',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: Wrench,
      title: 'Fix Mode',
      description: 'Get instant bug fixes and code improvements with detailed explanations.',
      color: 'from-green-500 to-teal-500'
    }
  ]

  const useCases = [
    {
      title: 'Learning to Code',
      description: 'Perfect for beginners who want honest feedback without the intimidation factor.'
    },
    {
      title: 'Code Reviews',
      description: 'Get a quick second opinion before submitting your pull request.'
    },
    {
      title: 'Debugging Help',
      description: 'Stuck on a bug? Let AI spot what you might have missed.'
    },
    {
      title: 'Skill Improvement',
      description: 'Learn best practices and common pitfalls in a memorable way.'
    }
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
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">
            Developer Tools
          </span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Code Roaster: The AI Code Review Tool
          <span className="block text-3xl sm:text-4xl mt-2 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            That Actually Makes You Laugh
          </span>
        </h1>
        
        <p className="text-xl text-gray-300 leading-relaxed">
          Tired of boring code reviews? Meet Code Roaster – the AI-powered tool that turns 
          code feedback into an entertaining learning experience. Get roasted, learn, and improve 
          your coding skills, all while having a good laugh at your bugs.
        </p>
      </header>

      {/* Why Code Roaster */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <Target className="w-8 h-8 text-purple-400" />
          Why Every Developer Needs Code Roaster
        </h2>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <p className="text-gray-300 mb-4">
            Let's face it – traditional code reviews can be dry, intimidating, or worse, 
            non-existent when you're learning alone. Code Roaster changes the game by 
            making code feedback both educational and entertaining.
          </p>
          <p className="text-gray-300 mb-4">
            Whether you're a beginner afraid to ask "stupid questions" or an experienced 
            developer looking for a quick sanity check, Code Roaster provides instant, 
            judgment-free (well, humorously judgmental) feedback that sticks with you.
          </p>
          <p className="text-gray-300">
            The best part? You'll actually remember the lessons because they made you laugh. 
            Studies show that humor enhances memory retention – so getting roasted might 
            just be the best way to level up your coding skills.
          </p>
        </div>
      </section>

      {/* Key Features */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-yellow-400" />
          Three Modes, Endless Learning
        </h2>
        <div className="grid gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <Code2 className="w-8 h-8 text-cyan-400" />
          How Code Roaster Works
        </h2>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">1</span>
              <div>
                <h4 className="font-semibold text-white mb-1">Paste Your Code</h4>
                <p className="text-gray-300">Drop any code snippet into the input area – up to 10,000 characters.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">2</span>
              <div>
                <h4 className="font-semibold text-white mb-1">Choose Your Mode</h4>
                <p className="text-gray-300">Select Roast for humor, Explain for education, or Fix for solutions.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">3</span>
              <div>
                <h4 className="font-semibold text-white mb-1">Get Instant Feedback</h4>
                <p className="text-gray-300">Receive AI-powered analysis in seconds, tailored to your chosen mode.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">4</span>
              <div>
                <h4 className="font-semibold text-white mb-1">Learn and Improve</h4>
                <p className="text-gray-300">Apply the feedback to your code and watch your skills grow.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Perfect For Every Coding Scenario</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {useCases.map((useCase, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <h3 className="font-bold text-white mb-2">{useCase.title}</h3>
              <p className="text-gray-400 text-sm">{useCase.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy and Security */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <Shield className="w-8 h-8 text-green-400" />
          Your Code is Safe
        </h2>
        <div className="bg-green-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <span>No code storage – everything is processed temporarily and deleted immediately</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <span>No login required – completely anonymous usage</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <span>Client-side rate limiting – fair usage for everyone</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <span>Secure API communication – your code never leaves our secure servers</span>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Roast Your Code?</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of developers who are learning faster and having more fun with Code Roaster. 
          It's free, instant, and guaranteed to make you a better coder (or at least make you laugh trying).
        </p>
        <Link
          href="/tools/code-roaster"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Flame className="mr-2" size={20} />
          Start Roasting Now
        </Link>
      </section>
    </article>
  )
}