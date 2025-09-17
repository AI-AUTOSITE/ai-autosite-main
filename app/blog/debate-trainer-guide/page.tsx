import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, MessageSquare, Brain, Target, Shield, Trophy, Zap, Users, Star, ChevronRight, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Master Debate Skills with AI: 3 Coaching Styles for Every Level | AI AutoSite',
  description: 'Learn how to improve your argumentation skills with our AI Debate Trainer. From supportive coaching to devil\'s advocate challenges. Get scored feedback instantly.',
  keywords: 'debate training, argumentation skills, critical thinking, AI debate coach, persuasive writing, logic training, debate practice, study tools',
  openGraph: {
    title: 'AI Debate Trainer: Master the Art of Argumentation',
    description: 'Practice debates with AI opponents and get real-time scoring on logic, persuasiveness, and structure.',
    type: 'article',
    images: ['/og-debate-trainer.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Master Debate Skills with AI Coaching',
    description: 'Free AI-powered debate training with instant feedback',
  }
}

export default function DebateTrainerBlogPost() {
  const publishDate = '2025-01-24'
  const author = 'AI AutoSite Team'
  const readTime = '6 min read'

  const coachingStyles = [
    {
      name: 'Supportive Coach',
      icon: '🤝',
      level: 'Beginner',
      color: 'from-blue-400 to-purple-500',
      description: 'Perfect for building confidence. Gentle feedback that encourages improvement.',
      benefits: [
        'Constructive criticism only',
        'Emphasis on strengths',
        'Encouraging tone throughout'
      ]
    },
    {
      name: 'Professor',
      icon: '🎓',
      level: 'Intermediate',
      color: 'from-emerald-500 to-teal-600',
      description: 'Academic rigor with educational focus. Balanced critique with learning opportunities.',
      benefits: [
        'Detailed logical analysis',
        'Real-world examples',
        'Structured feedback'
      ]
    },
    {
      name: "Devil's Advocate",
      icon: '⚔️',
      level: 'Advanced',
      color: 'from-red-500 to-orange-600',
      description: 'No-holds-barred critique. Challenges every assumption to forge stronger arguments.',
      benefits: [
        'Ruthless logic testing',
        'Exposes all weaknesses',
        'Prepares for tough debates'
      ]
    }
  ]

  const scoreCategories = [
    {
      name: 'Logical Consistency',
      description: 'How well your arguments flow and connect',
      icon: Brain
    },
    {
      name: 'Persuasiveness',
      description: 'The emotional and rational appeal of your points',
      icon: MessageSquare
    },
    {
      name: 'Factual Accuracy',
      description: 'Correctness and reliability of your claims',
      icon: Shield
    },
    {
      name: 'Structural Coherence',
      description: 'Organization and clarity of your argument',
      icon: Target
    },
    {
      name: 'Rebuttal Resilience',
      description: 'How well you anticipate counterarguments',
      icon: Trophy
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
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
            Study Tools
          </span>
          <span>•</span>
          <time dateTime={publishDate}>{new Date(publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Master Debate Skills with AI:
          <span className="block text-3xl sm:text-4xl mt-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            3 Coaching Styles for Every Level
          </span>
        </h1>
        
        <p className="text-xl text-gray-300 leading-relaxed">
          Whether you're preparing for a debate competition, improving your professional communication, 
          or just want to think more critically, our AI Debate Trainer adapts to your skill level with 
          three distinct coaching personalities.
        </p>
      </header>

      {/* Tool CTA */}
      <div className="mb-12 p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-white/10">
        <div className="text-center">
          <MessageSquare className="w-20 h-20 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">AI Debate Trainer</h2>
          <p className="text-gray-400 mb-6">Practice argumentation with AI opponents</p>
          <Link
            href="/tools/debate-trainer"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <Zap className="mr-2" size={20} />
            Start Your First Debate - Free!
          </Link>
        </div>
      </div>

      {/* Why Debate Skills Matter */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Why Debate Skills Matter in 2025</h2>
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <p className="text-gray-300 mb-4">
            In an era of information overload and AI-generated content, the ability to construct 
            logical arguments and think critically has never been more valuable. Whether you're:
          </p>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
              <span><strong className="text-white">A student</strong> preparing for debates or essays</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
              <span><strong className="text-white">A professional</strong> making business cases or proposals</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
              <span><strong className="text-white">A content creator</strong> defending your positions online</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
              <span><strong className="text-white">A critical thinker</strong> who wants to challenge ideas</span>
            </li>
          </ul>
          <p className="text-gray-300 mt-4">
            ...mastering debate skills will give you a competitive edge in communication and decision-making.
          </p>
        </div>
      </section>

      {/* Three Coaching Styles */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-8">Choose Your AI Coach</h2>
        <div className="space-y-6">
          {coachingStyles.map((style, index) => (
            <div key={index} className={`bg-gradient-to-r ${style.color} p-[2px] rounded-xl`}>
              <div className="bg-gray-900 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{style.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-white">{style.name}</h3>
                      <span className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-sm">
                        {style.level}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4">{style.description}</p>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {style.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                          <ChevronRight className="w-4 h-4 text-cyan-400" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-8">How Debate Training Works</h2>
        <div className="space-y-4">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold">1</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Choose Your Topic</h3>
                <p className="text-gray-400">
                  Pick any debate topic - from "Should AI replace human workers?" to 
                  "Is space exploration worth the cost?" The more specific, the better.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold">2</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Select Your Coach</h3>
                <p className="text-gray-400">
                  Choose between Supportive Coach (beginner), Professor (intermediate), 
                  or Devil's Advocate (advanced) based on your comfort level.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold">3</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Exchange Arguments</h3>
                <p className="text-gray-400">
                  You have 5 rounds to make your case. The AI will counter your arguments 
                  with appropriate intensity based on your chosen coach style.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold">4</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Get Scored Feedback</h3>
                <p className="text-gray-400">
                  After 5 rounds, receive detailed scores across 5 categories plus 
                  actionable feedback to improve your argumentation skills.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scoring System */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-8">Understanding Your Scores</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {scoreCategories.map((category, index) => {
            const Icon = category.icon
            return (
              <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-purple-500/30 transition-all">
                <div className="flex items-start gap-3">
                  <Icon className="w-6 h-6 text-purple-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-400">{category.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <p className="text-sm text-gray-300 text-center">
            <strong className="text-white">Scoring Scale:</strong> 1 (Needs Work) → 3 (Good) → 5 (Excellent)
          </p>
        </div>
      </section>

      {/* Pro Tips */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Tips for Better Debates</h2>
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-white/10">
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <Star className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
              <span><strong className="text-white">Start with Supportive Coach:</strong> Build confidence before tackling tougher opponents</span>
            </li>
            <li className="flex items-start">
              <Star className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
              <span><strong className="text-white">Use specific examples:</strong> Concrete evidence beats abstract claims every time</span>
            </li>
            <li className="flex items-start">
              <Star className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
              <span><strong className="text-white">Address counterarguments:</strong> Show you understand the other side's perspective</span>
            </li>
            <li className="flex items-start">
              <Star className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
              <span><strong className="text-white">Structure matters:</strong> Present your strongest point first, support it, then build</span>
            </li>
            <li className="flex items-start">
              <Star className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
              <span><strong className="text-white">Practice daily:</strong> Even one 5-round debate per day will improve your skills</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Privacy & Technical */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Privacy-First Design</h2>
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Your Privacy Protected</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• No account required</li>
                <li>• Anonymous processing</li>
                <li>• No data storage</li>
                <li>• Rate limiting for fairness</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Powered by Claude AI</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Fast Haiku model</li>
                <li>• Intelligent responses</li>
                <li>• Consistent scoring</li>
                <li>• Natural conversations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Sharpen Your Mind?</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of students, professionals, and critical thinkers who are 
          improving their argumentation skills with AI coaching.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/tools/debate-trainer"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <MessageSquare className="mr-2" size={20} />
            Start Debate Training Now
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
          >
            Explore All Study Tools
          </Link>
        </div>
      </section>

      {/* Related Tools */}
      <section className="mt-12">
        <h3 className="text-2xl font-bold text-white mb-6">Other Study Tools You'll Love</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/tools/ai-summarizer" className="group">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-purple-400/30 transition-all">
              <h4 className="text-white font-semibold mb-2 group-hover:text-purple-400">AI Text Summarizer</h4>
              <p className="text-gray-400 text-sm">Condense long texts instantly</p>
            </div>
          </Link>
          <Link href="/tools/pdf-summarizer" className="group">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-purple-400/30 transition-all">
              <h4 className="text-white font-semibold mb-2 group-hover:text-purple-400">PDF Summarizer</h4>
              <p className="text-gray-400 text-sm">Extract key points from PDFs</p>
            </div>
          </Link>
          <Link href="/tools/ai-dev-dictionary" className="group">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-purple-400/30 transition-all">
              <h4 className="text-white font-semibold mb-2 group-hover:text-purple-400">AI Dev Dictionary</h4>
              <p className="text-gray-400 text-sm">Learn technical terms interactively</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            By {author} • {publishDate}
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-white/10 text-gray-300 rounded-md text-xs">
              Study Tools
            </span>
            <span className="px-3 py-1 bg-white/10 text-gray-300 rounded-md text-xs">
              AI
            </span>
            <span className="px-3 py-1 bg-white/10 text-gray-300 rounded-md text-xs">
              Education
            </span>
          </div>
        </div>
      </footer>
    </article>
  )
}