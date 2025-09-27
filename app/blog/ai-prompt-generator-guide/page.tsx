import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Sparkles, Brain, Zap, MessageSquare } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Prompt Generator - Create Better ChatGPT Prompts | AI AutoSite',
  description: 'Generate effective AI prompts for ChatGPT, Claude, and other AI tools. Learn prompt engineering techniques for better results.',
  keywords: 'ai prompt generator, chatgpt prompts, prompt engineering, ai prompts, claude prompts, prompt templates',
  openGraph: {
    title: 'AI Prompt Generator - Master Prompt Engineering',
    description: 'Create powerful AI prompts that get better results',
    type: 'article',
  },
}

export default function AiPromptGeneratorGuidePage() {
  const publishDate = '2025-01-20'
  const author = 'AI AutoSite Team'
  const readTime = '5 min read'

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        href="/blog" 
        className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-8 group"
      >
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
        Back to Blog
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">
            AI Tools
          </span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          AI Prompt Generator Guide
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Master the art of prompt engineering. Create prompts that unlock 
          the full potential of AI language models.
        </p>
      </header>

      <section className="space-y-12">
        {/* Prompt Components */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Anatomy of a Perfect Prompt</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-4">
              <li className="border-b border-white/10 pb-3">
                <h3 className="text-white font-semibold mb-1">🎭 Role/Context</h3>
                <p className="text-gray-400 text-sm">Define who the AI should be</p>
                <code className="text-purple-400 text-xs">"Act as a marketing expert..."</code>
              </li>
              <li className="border-b border-white/10 pb-3">
                <h3 className="text-white font-semibold mb-1">📋 Task</h3>
                <p className="text-gray-400 text-sm">Clear instruction of what to do</p>
                <code className="text-purple-400 text-xs">"Create a social media strategy..."</code>
              </li>
              <li className="border-b border-white/10 pb-3">
                <h3 className="text-white font-semibold mb-1">🎯 Specifics</h3>
                <p className="text-gray-400 text-sm">Details and constraints</p>
                <code className="text-purple-400 text-xs">"...for a tech startup, budget $5000..."</code>
              </li>
              <li>
                <h3 className="text-white font-semibold mb-1">📝 Format</h3>
                <p className="text-gray-400 text-sm">How to structure the output</p>
                <code className="text-purple-400 text-xs">"Present as a bullet list with examples"</code>
              </li>
            </ul>
          </div>
        </div>

        {/* Prompt Templates */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Proven Prompt Templates</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">Content Creation</h3>
              <p className="text-gray-400 text-sm mb-2">
                "Write a [type] about [topic] for [audience]. 
                Include [specifics]. Tone should be [style]. 
                Length: [words]"
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">Problem Solving</h3>
              <p className="text-gray-400 text-sm mb-2">
                "I have [problem]. My constraints are [list]. 
                Provide 3 solutions with pros/cons for each. 
                Consider [factors]"
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">Code Generation</h3>
              <p className="text-gray-400 text-sm mb-2">
                "Write [language] code to [function]. 
                Input: [format]. Output: [format]. 
                Include error handling and comments"
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">Analysis</h3>
              <p className="text-gray-400 text-sm mb-2">
                "Analyze [data/text] and identify [what]. 
                Focus on [aspects]. Present findings as 
                [format]. Include examples"
              </p>
            </div>
          </div>
        </div>

        {/* Prompt Techniques */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Advanced Techniques</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="text-white pb-3">Technique</th>
                  <th className="text-white pb-3">Example</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/5">
                  <td className="py-3 text-purple-400">Chain of Thought</td>
                  <td className="py-3 text-sm">"Let's think step by step..."</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-purple-400">Few-Shot Learning</td>
                  <td className="py-3 text-sm">"Example 1: X→Y, Example 2: A→B, Now: C→?"</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-purple-400">Role Playing</td>
                  <td className="py-3 text-sm">"You are an expert [role] with 20 years experience..."</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-purple-400">Constraints</td>
                  <td className="py-3 text-sm">"Limit response to 100 words, use simple language"</td>
                </tr>
                <tr>
                  <td className="py-3 text-purple-400">Output Format</td>
                  <td className="py-3 text-sm">"Format as: Title: / Summary: / Details: / Action:"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Common Mistakes */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Common Prompt Mistakes</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-red-400">❌</span>
                <p className="text-gray-300">
                  <strong className="text-white">Too vague:</strong> "Write something about marketing"
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✅</span>
                <p className="text-gray-300">
                  <strong className="text-white">Specific:</strong> "Write 5 Instagram marketing tips for small bakeries"
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">❌</span>
                <p className="text-gray-300">
                  <strong className="text-white">No context:</strong> "Fix this code"
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✅</span>
                <p className="text-gray-300">
                  <strong className="text-white">With context:</strong> "Fix this Python function that should sort a list but returns None"
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Use Cases */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Prompt Generator Use Cases</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Content Writing:</strong> Blog posts, social media, emails
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Coding:</strong> Debug, refactor, generate functions
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Learning:</strong> Explanations, summaries, study guides
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Business:</strong> Reports, analysis, strategies
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Generate Perfect AI Prompts
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Free AI prompt generator with templates for ChatGPT, Claude, and more.
        </p>
        <Link 
          href="/tools/ai-prompt-generator" 
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Sparkles className="mr-2" size={20} />
          Try Prompt Generator
        </Link>
      </section>
    </article>
  )
}