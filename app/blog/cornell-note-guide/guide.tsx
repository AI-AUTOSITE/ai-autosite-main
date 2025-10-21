import { Metadata } from 'next'
import Link from 'next/link'
import { 
  BookOpen, 
  Brain, 
  Clock, 
  CheckCircle, 
  Lightbulb, 
  FileText,
  TrendingUp,
  Sparkles,
  ArrowRight
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cornell Notes: The Science-Backed Method That Boosts Retention by 58% | Free Template',
  description:
    'Discover why Cornell Notes work better than regular note-taking. Proven by 70+ years of research. Get free printable templates and learn the exact method used at top universities.',
  keywords: 'cornell notes, note-taking method, study techniques, memory retention, student productivity, cornell note template, effective learning, academic success, study skills',
  openGraph: {
    title: 'Cornell Notes: 58% Better Memory Retention - Science Explains Why',
    description: 'Free templates + research-backed guide. Learn the note-taking method that actually works.',
    type: 'article',
    images: [
      {
        url: '/og-cornell-note-guide.png',
        width: 1200,
        height: 630,
        alt: 'Cornell Notes Method Explained',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Note-Taking Method That Actually Works',
    description: '70+ years of research. Used at Cornell since 1950s. Free templates.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/blog/cornell-note-guide',
  },
}

export default function CornellNoteGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 
                        rounded-full px-4 py-2 mb-4">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm font-medium">
              Proven Since 1950s at Cornell University
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Cornell Notes: Why Students Score{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              9.5% Higher
            </span>
          </h1>

          <p className="text-xl text-gray-300 leading-relaxed">
            Discover the science-backed note-taking method that boosts memory retention by 58%. 
            Learn why handwriting beats typing, and get free printable templates.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              href="/tools/cornell-note"
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white 
                       rounded-lg font-semibold hover:opacity-90 transition-all 
                       flex items-center gap-2 shadow-lg shadow-cyan-600/30"
            >
              <Sparkles className="w-5 h-5" />
              Get Free Templates
            </Link>
            <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg 
                          flex items-center gap-2 text-gray-300">
              <Clock className="w-5 h-5 text-cyan-400" />
              <span>8 min read</span>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-12">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            What You'll Learn
          </h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">→</span>
              <span>Why Cornell Notes work better than regular note-taking (backed by brain science)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">→</span>
              <span>The exact 4-step method used at top universities</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">→</span>
              <span>Research proving 58% better memory retention</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">→</span>
              <span>Common mistakes students make (and how to avoid them)</span>
            </li>
          </ul>
        </div>

        {/* Article Content */}
        <article className="prose prose-invert prose-lg max-w-none">
          {/* Section 1: The Problem */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <span className="text-2xl">❌</span>
              </div>
              The Problem with "Normal" Note-Taking
            </h2>

            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-6">
              <p className="text-gray-200 leading-relaxed mb-4">
                <strong className="text-red-300">Most students take notes the wrong way.</strong> They copy word-for-word from the teacher or textbook, thinking they're "capturing everything important."
              </p>
              <p className="text-gray-300 leading-relaxed">
                But here's the harsh truth: <strong>copying ≠ learning.</strong> Your brain isn't processing the information—you're just acting as a human photocopier.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-2xl mb-2">⌨️</div>
                <h4 className="text-white font-semibold mb-2">Typing Everything</h4>
                <p className="text-gray-400 text-sm">
                  Students type 78% more words than handwriting, but retain 66% more verbatim text. 
                  More typing = <strong className="text-red-300">less thinking</strong>.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-2xl mb-2">🎨</div>
                <h4 className="text-white font-semibold mb-2">Highlighting Only</h4>
                <p className="text-gray-400 text-sm">
                  Colorful highlights feel productive, but create the <strong className="text-yellow-300">"illusion of learning"</strong>. 
                  You're not actively processing.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-6">
              <p className="text-cyan-200 leading-relaxed">
                <strong>The result?</strong> Students spend hours taking notes, only to realize they don't remember anything when the test arrives. Sound familiar?
              </p>
            </div>
          </section>

          {/* Section 2: What Cornell Notes Are */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-cyan-400" />
              </div>
              What Are Cornell Notes?
            </h2>

            <p className="text-gray-200 leading-relaxed mb-6">
              Cornell Notes is a <strong className="text-white">systematic note-taking method</strong> developed by Professor Walter Pauk at Cornell University in the <strong>1950s</strong>. 
              Unlike regular notes, Cornell Notes force you to <strong className="text-cyan-300">think actively</strong> about what you're learning.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">The Layout (3 Sections)</h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">1️⃣</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Cue Column (Left, ~30%)</h4>
                    <p className="text-gray-400 text-sm">
                      Write <strong>questions</strong> or <strong>keywords</strong> that summarize each section. 
                      This becomes your built-in test.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">2️⃣</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Note-Taking Area (Right, ~70%)</h4>
                    <p className="text-gray-400 text-sm">
                      Capture the <strong>main ideas</strong> during class. Use your <strong>own words</strong>, not word-for-word copying.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">3️⃣</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Summary Section (Bottom)</h4>
                    <p className="text-gray-400 text-sm">
                      Write a <strong>3-5 sentence summary</strong> in your own words. 
                      This forces deep processing.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-cyan-200 font-semibold mb-2">Key Insight:</p>
                  <p className="text-gray-300 leading-relaxed">
                    The layout <strong>isn't just aesthetic</strong>—it's designed to make you <strong>engage actively</strong> with the material. 
                    The cue column forces you to think about "why" and "how," not just "what."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: The Science */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              The Brain Science: Why It Works
            </h2>

            <p className="text-gray-200 leading-relaxed mb-6">
              Cornell Notes aren't based on opinion—they're backed by <strong className="text-white">70+ years of research</strong>. 
              Here's what happens in your brain when you use this method:
            </p>

            <div className="space-y-6">
              {/* Research Point 1 */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Handwriting Activates 32 Brain Regions
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-3">
                      A 2024 study from <strong className="text-cyan-300">Norwegian University of Science & Technology</strong> used 256-electrode EEG to measure brain activity. 
                      The result? Handwriting activates <strong>32 significant brain regions</strong>, while typing activates almost none.
                    </p>
                    <div className="bg-cyan-500/10 border-l-4 border-cyan-500 pl-4 py-2">
                      <p className="text-cyan-200 text-sm font-medium">
                        Translation: Your brain creates way more "memory hooks" when you write by hand.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Research Point 2 */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📈</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      9.5% Higher Test Scores
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-3">
                      A 2024 meta-analysis of <strong className="text-green-300">24 studies with 3,005 students</strong> found that 
                      handwritten notes led to <strong>Hedges' g = 0.248</strong> effect size—roughly <strong>9.5% more students getting A's</strong>.
                    </p>
                    <div className="bg-green-500/10 border-l-4 border-green-500 pl-4 py-2">
                      <p className="text-green-200 text-sm font-medium">
                        That's the difference between a B+ and an A for many students.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Research Point 3 */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🧠</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Active Recall Beats Re-Reading by 2x
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-3">
                      The cue column creates a <strong className="text-purple-300">"built-in flashcard system"</strong>. 
                      Research consistently shows that <strong>testing yourself</strong> (active recall) is 2x more effective than passively re-reading notes.
                    </p>
                    <div className="bg-purple-500/10 border-l-4 border-purple-500 pl-4 py-2">
                      <p className="text-purple-200 text-sm font-medium">
                        You're practicing retrieval every time you review—the same skill needed for exams.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Research Point 4 */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">✍️</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Own Words = Proof of Understanding
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-3">
                      The famous <strong className="text-yellow-300">"Pen is Mightier Than the Keyboard"</strong> study (Princeton, 2014) 
                      found that laptop users had <strong>66% more verbatim overlap</strong> with lectures—meaning they copied mindlessly.
                    </p>
                    <div className="bg-yellow-500/10 border-l-4 border-yellow-500 pl-4 py-2">
                      <p className="text-yellow-200 text-sm font-medium">
                        Cornell Notes force you to summarize, which means you can't fake understanding.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: The 4-Step Method */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              How to Use Cornell Notes: The 4-Step Method
            </h2>

            <p className="text-gray-200 leading-relaxed mb-6">
              Here's the exact process that students at Cornell and other top universities use:
            </p>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-3">During Class/Study</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong className="text-white">Write in the RIGHT section</strong> (Notes & Details)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>Capture <strong>main ideas, examples, diagrams</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong className="text-red-300">NOT word-for-word</strong> — use your own words</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>Leave space between topics for clarity</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-3">After Class (within 24 hours)</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>Review your notes on the right</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span><strong className="text-white">Write questions/keywords in the LEFT section</strong> (Cue Area)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>Think: <strong className="text-purple-300">"What question does this answer?"</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>Create memory cues for each main point</span>
                      </li>
                    </ul>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mt-4">
                      <p className="text-yellow-200 text-sm">
                        <strong>⚡ Pro Tip:</strong> This is the most important step! The cue column transforms passive notes into active study material.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-3">At the End</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span><strong className="text-white">Write a 3-5 sentence summary</strong> at the BOTTOM</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span><strong className="text-green-300">Must use your own words</strong> — no copying</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>Explain as if teaching someone who wasn't there</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>This forces <strong>deep processing</strong> of information</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">4</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-3">When Reviewing</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-400 mt-1">•</span>
                        <span><strong className="text-white">Cover the notes area</strong> (right side)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-400 mt-1">•</span>
                        <span>Try to answer questions from cue area (left)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-400 mt-1">•</span>
                        <span>Check your answers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-400 mt-1">•</span>
                        <span><strong className="text-cyan-300">Focus on questions you got wrong</strong></span>
                      </li>
                    </ul>
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 mt-4">
                      <p className="text-cyan-200 text-sm">
                        <strong>🎯 Result:</strong> You're practicing retrieval—the exact skill needed for exams—instead of passively re-reading.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Common Mistakes */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">
              5 Common Mistakes (And How to Fix Them)
            </h2>

            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
                <div className="flex gap-3">
                  <span className="text-2xl">❌</span>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Mistake #1: Writing Word-for-Word</h4>
                    <p className="text-gray-300 text-sm mb-2">
                      Copying exact sentences = shallow processing. Your brain doesn't engage.
                    </p>
                    <p className="text-green-300 text-sm">
                      <strong>Fix:</strong> Force yourself to paraphrase. If you can't, you don't understand it yet.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
                <div className="flex gap-3">
                  <span className="text-2xl">❌</span>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Mistake #2: Filling Out Cue Column During Class</h4>
                    <p className="text-gray-300 text-sm mb-2">
                      You can't create good questions while simultaneously listening to new material.
                    </p>
                    <p className="text-green-300 text-sm">
                      <strong>Fix:</strong> Notes during class → Cue column within 24 hours → Summary at the end.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
                <div className="flex gap-3">
                  <span className="text-2xl">❌</span>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Mistake #3: Vague Cue Questions</h4>
                    <p className="text-gray-300 text-sm mb-2">
                      "What is photosynthesis?" is too broad. You need specific, testable questions.
                    </p>
                    <p className="text-green-300 text-sm">
                      <strong>Fix:</strong> "What are the 3 stages of photosynthesis?" or "Why does photosynthesis require light?"
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
                <div className="flex gap-3">
                  <span className="text-2xl">❌</span>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Mistake #4: Skipping the Summary</h4>
                    <p className="text-gray-300 text-sm mb-2">
                      The summary forces synthesis. Without it, Cornell Notes is just a fancy layout.
                    </p>
                    <p className="text-green-300 text-sm">
                      <strong>Fix:</strong> Set a timer for 5 minutes. Write the summary immediately after finishing notes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
                <div className="flex gap-3">
                  <span className="text-2xl">❌</span>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Mistake #5: Never Reviewing</h4>
                    <p className="text-gray-300 text-sm mb-2">
                      Taking perfect notes but never reviewing them = wasted effort.
                    </p>
                    <p className="text-green-300 text-sm">
                      <strong>Fix:</strong> Review within 24 hours, then 1 week later, then before the exam. The cue column makes review 2x faster.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl p-8 text-center">
              <Sparkles className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-3">
                Ready to Boost Your Grades by 9.5%?
              </h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Get free Cornell Note templates with built-in research evidence and how-to guides. 
                Print and start using in 30 seconds.
              </p>
              <Link
                href="/tools/cornell-note"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 
                         text-white rounded-xl font-semibold hover:opacity-90 transition-all 
                         shadow-lg shadow-cyan-600/30"
              >
                Generate Free Template
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <details className="bg-white/5 border border-white/10 rounded-xl p-5 group">
                <summary className="text-white font-semibold cursor-pointer flex items-center gap-2">
                  <span className="text-cyan-400 group-open:rotate-90 transition-transform">▶</span>
                  Can I use Cornell Notes for math or science?
                </summary>
                <p className="text-gray-300 mt-3 pl-6">
                  Yes! The cue column is perfect for formulas, key concepts, and "why does this work?" questions. 
                  The notes area can include diagrams and worked examples.
                </p>
              </details>

              <details className="bg-white/5 border border-white/10 rounded-xl p-5 group">
                <summary className="text-white font-semibold cursor-pointer flex items-center gap-2">
                  <span className="text-cyan-400 group-open:rotate-90 transition-transform">▶</span>
                  What if I prefer typing?
                </summary>
                <p className="text-gray-300 mt-3 pl-6">
                  Research shows handwriting is 58% better for retention. But if you must type, use a digital Cornell template 
                  and force yourself to paraphrase (not copy-paste). Consider using a tablet with a stylus for the best of both worlds.
                </p>
              </details>

              <details className="bg-white/5 border border-white/10 rounded-xl p-5 group">
                <summary className="text-white font-semibold cursor-pointer flex items-center gap-2">
                  <span className="text-cyan-400 group-open:rotate-90 transition-transform">▶</span>
                  How long should my summary be?
                </summary>
                <p className="text-gray-300 mt-3 pl-6">
                  3-5 sentences that capture the main point. If you're writing more, you're not summarizing—you're re-writing. 
                  The goal is synthesis, not completeness.
                </p>
              </details>

              <details className="bg-white/5 border border-white/10 rounded-xl p-5 group">
                <summary className="text-white font-semibold cursor-pointer flex items-center gap-2">
                  <span className="text-cyan-400 group-open:rotate-90 transition-transform">▶</span>
                  Do I need to use it for every class?
                </summary>
                <p className="text-gray-300 mt-3 pl-6">
                  It works best for lecture-based classes with lots of conceptual content (history, biology, psychology). 
                  For math-heavy classes, you might adapt it (fewer words, more worked problems in the notes area).
                </p>
              </details>
            </div>
          </section>
        </article>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/tools/cornell-note"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 
                     text-white rounded-xl font-semibold hover:opacity-90 transition-all 
                     shadow-lg shadow-cyan-600/30"
          >
            <Sparkles className="w-5 h-5" />
            Get Your Free Templates Now
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-gray-400 text-sm mt-4">
            No signup required • Printable PDF • Includes research guide
          </p>
        </div>
      </div>
    </div>
  )
}