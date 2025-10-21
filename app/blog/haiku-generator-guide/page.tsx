// app/blog/haiku-generator-guide/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles, BookOpen, Zap, Globe, Users, TrendingUp, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Haiku Generator - Learn Poetry Writing with 5-7-5 Structure | Free Tool',
  description: 'Create beautiful haikus with AI guidance. Learn 5-7-5 syllable structure, season words (kigo), and poetry writing. Free AI-powered coaching included. Perfect for students and writers.',
  keywords: 'haiku generator, ai poetry, learn haiku, 5-7-5 poetry, season words, kigo, creative writing tool, poetry learning, haiku structure, ai writing coach, free haiku maker, english haiku, syllable counter, poetry education, haiku examples',
  
  openGraph: {
    title: 'AI Haiku Generator Guide - Master Poetry Writing',
    description: 'Learn to write beautiful haikus with AI coaching. Free 5-7-5 structure tool with season words.',
    type: 'article',
    publishedTime: '2025-10-19',
    authors: ['AI AutoSite Team'],
    tags: ['haiku', 'poetry', 'creative writing', 'ai', 'learning', 'education'],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'AI Haiku Generator - Learn Poetry Writing',
    description: 'Master 5-7-5 haiku structure with AI coaching. Free tool for students and writers.',
  },
  
  alternates: {
    canonical: 'https://ai-autosite.com/blog/haiku-generator-guide'
  }
}

export default function HaikuGeneratorGuide() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      
      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-purple-400 mb-4">
          <BookOpen className="w-4 h-4" />
          <span>Study Tools</span>
          <span>•</span>
          <span>7 min read</span>
          <span>•</span>
          <span>October 19, 2025</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          AI Haiku Generator: Master Poetry Writing with 5-7-5 Structure
        </h1>
        
        <p className="text-xl text-gray-300 leading-relaxed">
          Learn to create beautiful haikus with AI guidance. Master the traditional 5-7-5 syllable structure, 
          discover season words, and get instant feedback on your poetry.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm">Haiku</span>
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">Poetry</span>
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">Creative Writing</span>
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">AI Coaching</span>
        </div>
      </header>

      {/* CTA Button */}
      <div className="mb-12 p-6 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Try the AI Haiku Generator</h3>
            <p className="text-gray-300">Create beautiful poetry in seconds with AI assistance</p>
          </div>
          <Link 
            href="/tools/haiku-generator"
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg 
                     font-semibold hover:opacity-90 transition-all flex items-center gap-2"
          >
            Start Creating <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Table of Contents */}
      <nav className="mb-12 p-6 bg-white/5 border border-white/10 rounded-xl">
        <h2 className="text-lg font-semibold text-white mb-4">Table of Contents</h2>
        <ol className="space-y-2 text-gray-300">
          <li><a href="#what-is-haiku" className="hover:text-pink-400 transition-colors">1. What is Haiku?</a></li>
          <li><a href="#how-to-use" className="hover:text-pink-400 transition-colors">2. How to Use the Generator</a></li>
          <li><a href="#modes" className="hover:text-pink-400 transition-colors">3. Three Generation Modes</a></li>
          <li><a href="#season-words" className="hover:text-pink-400 transition-colors">4. Understanding Season Words (Kigo)</a></li>
          <li><a href="#examples" className="hover:text-pink-400 transition-colors">5. Haiku Examples by Season</a></li>
          <li><a href="#tips" className="hover:text-pink-400 transition-colors">6. Tips for Writing Great Haikus</a></li>
          <li><a href="#education" className="hover:text-pink-400 transition-colors">7. Using in Education</a></li>
          <li><a href="#faq" className="hover:text-pink-400 transition-colors">8. Frequently Asked Questions</a></li>
        </ol>
      </nav>

      {/* Main Content */}
      <div className="prose prose-invert prose-lg max-w-none">
        
        {/* Section 1: What is Haiku */}
        <section id="what-is-haiku" className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-pink-400">🌸</span>
            What is Haiku?
          </h2>
          
          <p className="text-gray-300 leading-relaxed mb-6">
            Haiku is a traditional form of Japanese poetry that captures a moment in time with just 17 syllables. 
            It's like taking a photograph with words—brief, beautiful, and meaningful.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
              <h3 className="text-cyan-400 font-semibold mb-2">5-7-5 Structure</h3>
              <p className="text-sm text-gray-300">
                Three lines with 5, 7, and 5 syllables. This rhythm creates natural flow.
              </p>
            </div>
            
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
              <h3 className="text-purple-400 font-semibold mb-2">Season Word (Kigo)</h3>
              <p className="text-sm text-gray-300">
                A word that references nature or time of year, grounding the poem.
              </p>
            </div>
            
            <div className="p-4 bg-pink-500/10 border border-pink-500/20 rounded-xl">
              <h3 className="text-pink-400 font-semibold mb-2">Present Moment</h3>
              <p className="text-sm text-gray-300">
                Captures a single moment with vivid sensory details and imagery.
              </p>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-xl">
            <h4 className="text-white font-semibold mb-3">Classic Haiku Example:</h4>
            <div className="font-serif text-xl text-white space-y-1 mb-3">
              <p>Cherry blossoms fall</p>
              <p>Soft petals dance in spring breeze</p>
              <p>Fleeting beauty fades</p>
            </div>
            <p className="text-sm text-gray-300">
              This haiku follows 5-7-5 structure, uses "cherry blossoms" as a spring season word, 
              and captures the ephemeral beauty of nature.
            </p>
          </div>
        </section>

        {/* Section 2: How to Use */}
        <section id="how-to-use" className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Zap className="w-8 h-8 text-cyan-400" />
            How to Use the AI Haiku Generator
          </h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-pink-400 font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Choose Your Mode</h3>
                <p className="text-gray-300">
                  Select between Quick (instant), AI Enhanced (high quality), or Coaching (learning) mode 
                  based on your needs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Enter a Theme</h3>
                <p className="text-gray-300">
                  Type any theme related to nature, emotions, or seasons. Examples: "ocean", "morning dew", 
                  "loneliness", "friendship".
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-400 font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Select a Season</h3>
                <p className="text-gray-300">
                  Choose Spring, Summer, Autumn, or Winter. This helps the AI select appropriate season words 
                  for your haiku.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-green-400 font-bold">4</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Generate or Write</h3>
                <p className="text-gray-300">
                  Click "Generate" to create a haiku instantly, or use "Write Your Own" section to craft 
                  your own and get real-time syllable counting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Modes */}
        <section id="modes" className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-400" />
            Three Generation Modes Explained
          </h2>

          <div className="space-y-4">
            <div className="p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-6 h-6 text-cyan-400" />
                <h3 className="text-xl font-semibold text-white">Quick Mode</h3>
              </div>
              <p className="text-gray-300 mb-3">
                <strong>Best for:</strong> Practice, learning structure, offline use
              </p>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• Instant generation (less than 1 second)</li>
                <li>• Works completely offline</li>
                <li>• Template-based generation</li>
                <li>• No AI API calls = completely free</li>
                <li>• Perfect for beginners learning 5-7-5 structure</li>
              </ul>
            </div>

            <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-semibold text-white">AI Enhanced Mode</h3>
              </div>
              <p className="text-gray-300 mb-3">
                <strong>Best for:</strong> High-quality poetry, creative projects
              </p>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• Powered by Claude 3.5 Haiku model</li>
                <li>• Natural, evocative language</li>
                <li>• More creative and varied outputs</li>
                <li>• Generates in 2-5 seconds</li>
                <li>• Ideal for serious poetry writing</li>
              </ul>
            </div>

            <div className="p-6 bg-pink-500/10 border border-pink-500/20 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="w-6 h-6 text-pink-400" />
                <h3 className="text-xl font-semibold text-white">Coaching Mode</h3>
              </div>
              <p className="text-gray-300 mb-3">
                <strong>Best for:</strong> Learning, improvement, classroom use
              </p>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• Write your own haiku and get feedback</li>
                <li>• Real-time syllable counting</li>
                <li>• AI-powered detailed coaching</li>
                <li>• Suggestions for improvement</li>
                <li>• Perfect for students and educators</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4: Season Words */}
        <section id="season-words" className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">
            Understanding Season Words (Kigo)
          </h2>

          <p className="text-gray-300 mb-6">
            Season words (kigo in Japanese) are essential to traditional haiku. They connect your poem 
            to nature and the cycle of seasons, adding depth and cultural context.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <h3 className="text-pink-400 font-semibold mb-3">🌸 Spring Words</h3>
              <div className="text-sm text-gray-300 space-y-1">
                <p>• cherry blossoms, spring rain</p>
                <p>• butterfly, new leaves</p>
                <p>• morning dew, plum blossoms</p>
                <p>• robins, spring breeze</p>
              </div>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <h3 className="text-yellow-400 font-semibold mb-3">☀️ Summer Words</h3>
              <div className="text-sm text-gray-300 space-y-1">
                <p>• cicadas, summer heat</p>
                <p>• fireflies, sunflowers</p>
                <p>• ocean waves, thunderstorm</p>
                <p>• dragonflies, long days</p>
              </div>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <h3 className="text-orange-400 font-semibold mb-3">🍂 Autumn Words</h3>
              <div className="text-sm text-gray-300 space-y-1">
                <p>• autumn leaves, harvest moon</p>
                <p>• crisp air, migrating geese</p>
                <p>• persimmons, autumn wind</p>
                <p>• rice harvest, chrysanthemums</p>
              </div>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <h3 className="text-cyan-400 font-semibold mb-3">❄️ Winter Words</h3>
              <div className="text-sm text-gray-300 space-y-1">
                <p>• snow, cold wind</p>
                <p>• frozen pond, icicles</p>
                <p>• bare trees, snowflakes</p>
                <p>• winter moon, silence</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Examples */}
        <section id="examples" className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">
            Haiku Examples by Season
          </h2>

          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-xl">
              <h3 className="text-pink-400 font-semibold mb-4">Spring Haikus 🌸</h3>
              <div className="space-y-4">
                <div className="font-serif text-white">
                  <p>Cherry blossoms fall</p>
                  <p>Soft petals dance in spring breeze</p>
                  <p>Fleeting beauty fades</p>
                </div>
                <div className="font-serif text-white">
                  <p>Morning dew glistens</p>
                  <p>New leaves unfold in sunlight</p>
                  <p>Spring awakens slow</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl">
              <h3 className="text-yellow-400 font-semibold mb-4">Summer Haikus ☀️</h3>
              <div className="space-y-4">
                <div className="font-serif text-white">
                  <p>Cicadas crying</p>
                  <p>Summer heat waves shimmer bright</p>
                  <p>Time stands still at noon</p>
                </div>
                <div className="font-serif text-white">
                  <p>Fireflies glowing</p>
                  <p>Night garden fills with wonder</p>
                  <p>Magic in darkness</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl">
              <h3 className="text-orange-400 font-semibold mb-4">Autumn Haikus 🍂</h3>
              <div className="space-y-4">
                <div className="font-serif text-white">
                  <p>Autumn leaves falling</p>
                  <p>Crimson carpet on the ground</p>
                  <p>Seasons turning slow</p>
                </div>
                <div className="font-serif text-white">
                  <p>Harvest moon rises</p>
                  <p>Cool nights whisper change ahead</p>
                  <p>Summer fades from sight</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl">
              <h3 className="text-cyan-400 font-semibold mb-4">Winter Haikus ❄️</h3>
              <div className="space-y-4">
                <div className="font-serif text-white">
                  <p>Snow falls silently</p>
                  <p>Bare trees stand like monuments</p>
                  <p>World holds its cold breath</p>
                </div>
                <div className="font-serif text-white">
                  <p>Frozen pond mirrors</p>
                  <p>Winter moon in crystal light</p>
                  <p>Stillness speaks of peace</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Tips */}
        <section id="tips" className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">
            Tips for Writing Great Haikus
          </h2>

          <div className="space-y-6">
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-3">1. Show, Don't Tell</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-red-400 text-sm mb-2">❌ Telling (Vague):</p>
                  <p className="font-serif text-gray-300">
                    Love is so special<br/>
                    People care about each other<br/>
                    Feelings are important
                  </p>
                </div>
                <div>
                  <p className="text-green-400 text-sm mb-2">✓ Showing (Vivid):</p>
                  <p className="font-serif text-white">
                    Two hands intertwined<br/>
                    Sunset paints the sky orange<br/>
                    Hearts beat as one now
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-3">2. Use Concrete Images</h3>
              <p className="text-gray-300 mb-3">
                Replace abstract concepts with specific, sensory details that readers can see, hear, 
                smell, taste, or touch.
              </p>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• Instead of "sad" → "tears fall on autumn leaves"</li>
                <li>• Instead of "hot" → "sweat drips down my face"</li>
                <li>• Instead of "beautiful" → "moonlight on still water"</li>
              </ul>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-3">3. Adjust Syllable Count</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-cyan-400 text-sm mb-1">If too short, add descriptive words:</p>
                  <p className="text-gray-300 text-sm">
                    "Sun shines" (2) → "Bright sun shines today" (5)
                  </p>
                </div>
                <div>
                  <p className="text-pink-400 text-sm mb-1">If too long, simplify:</p>
                  <p className="text-gray-300 text-sm">
                    "Beautiful flowers blooming" (8) → "Beautiful blooms sway" (5)
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-3">4. Capture a Single Moment</h3>
              <p className="text-gray-300 mb-3">
                Haiku freezes time. Focus on one specific moment, not a story or sequence of events.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-red-400 text-sm mb-2">❌ Multiple moments:</p>
                  <p className="font-serif text-gray-300 text-sm">
                    I wake up early<br/>
                    Then I go outside to walk<br/>
                    Finally I sleep
                  </p>
                </div>
                <div>
                  <p className="text-green-400 text-sm mb-2">✓ Single moment:</p>
                  <p className="font-serif text-white text-sm">
                    Dawn breaks silently<br/>
                    Mist rises from the cool lake<br/>
                    World still fast asleep
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Education */}
        <section id="education" className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-400" />
            Using in Education
          </h2>

          <div className="space-y-6">
            <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-3">For Teachers</h3>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span><strong>Lesson Plans:</strong> Use Quick Mode to demonstrate 5-7-5 structure to entire class</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span><strong>Assignments:</strong> Students write haikus, then use Coaching Mode for feedback</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span><strong>Group Activities:</strong> Each student generates one line, collaborate to create haiku chains</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span><strong>Assessment:</strong> No grading needed - AI provides constructive feedback automatically</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-3">For Students</h3>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span><strong>Learning:</strong> See AI examples before writing your own</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span><strong>Practice:</strong> Real-time syllable counter helps you adjust as you write</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span><strong>Homework Help:</strong> Generate reference examples for inspiration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span><strong>Improvement:</strong> Get specific suggestions on how to enhance your haiku</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-3">Sample Lesson Plan (30 minutes)</h3>
              <ol className="text-gray-300 space-y-3">
                <li className="flex gap-3">
                  <span className="text-purple-400 font-semibold">1.</span>
                  <div>
                    <strong>Introduction (5 min):</strong> Explain haiku basics using Quick Mode examples
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-400 font-semibold">2.</span>
                  <div>
                    <strong>Demonstration (10 min):</strong> Show AI Mode to generate high-quality examples
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-400 font-semibold">3.</span>
                  <div>
                    <strong>Practice (10 min):</strong> Students write their own haikus, check syllable counts
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-400 font-semibold">4.</span>
                  <div>
                    <strong>Feedback (5 min):</strong> Use Coaching Mode for instant AI feedback on structure and imagery
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Section 8: FAQ */}
        <section id="faq" className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <details className="p-6 bg-white/5 border border-white/10 rounded-xl group">
              <summary className="text-lg font-semibold text-white cursor-pointer">
                Is the syllable counter accurate?
              </summary>
              <p className="text-gray-300 mt-3">
                The syllable counter is approximately 80-90% accurate for English words. English syllable 
                counting can be tricky due to pronunciation variations. If you notice an incorrect count, 
                trust your own judgment and adjust accordingly.
              </p>
            </details>

            <details className="p-6 bg-white/5 border border-white/10 rounded-xl group">
              <summary className="text-lg font-semibold text-white cursor-pointer">
                Do I need to include a season word?
              </summary>
              <p className="text-gray-300 mt-3">
                Traditional Japanese haiku always include a kigo (season word), but modern English haiku 
                is more flexible. We recommend including one for authenticity and depth, but it's not 
                strictly required. The tool encourages season words but doesn't enforce them.
              </p>
            </details>

            <details className="p-6 bg-white/5 border border-white/10 rounded-xl group">
              <summary className="text-lg font-semibold text-white cursor-pointer">
                Can I use this offline?
              </summary>
              <p className="text-gray-300 mt-3">
                Yes! Quick Mode works completely offline since it uses local template generation. 
                AI Mode and Coaching Mode require an internet connection to access Claude's AI capabilities.
              </p>
            </details>

            <details className="p-6 bg-white/5 border border-white/10 rounded-xl group">
              <summary className="text-lg font-semibold text-white cursor-pointer">
                Is this tool free to use?
              </summary>
              <p className="text-gray-300 mt-3">
                100% free, forever. No hidden costs, no ads, no sign-up required. We believe poetry 
                education should be accessible to everyone.
              </p>
            </details>

            <details className="p-6 bg-white/5 border border-white/10 rounded-xl group">
              <summary className="text-lg font-semibold text-white cursor-pointer">
                Can I save my haikus?
              </summary>
              <p className="text-gray-300 mt-3">
                Currently, haikus are not saved automatically. Use the copy button to save your haiku 
                to your clipboard, then paste it into a document, note app, or share it directly.
              </p>
            </details>

            <details className="p-6 bg-white/5 border border-white/10 rounded-xl group">
              <summary className="text-lg font-semibold text-white cursor-pointer">
                What's the difference between AI Mode and Quick Mode?
              </summary>
              <p className="text-gray-300 mt-3">
                Quick Mode uses pre-written templates and generates instantly. It's great for learning 
                structure but may feel formulaic. AI Mode uses Claude 3.5 Haiku to create unique, 
                natural-sounding poetry tailored to your theme. It takes 2-5 seconds but produces 
                much higher quality results.
              </p>
            </details>

            <details className="p-6 bg-white/5 border border-white/10 rounded-xl group">
              <summary className="text-lg font-semibold text-white cursor-pointer">
                Can I write haiku in other languages?
              </summary>
              <p className="text-gray-300 mt-3">
                Currently, the tool is optimized for English haiku only. The syllable counter is 
                specifically designed for English pronunciation patterns.
              </p>
            </details>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="p-8 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-2xl text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Ready to Create Beautiful Haikus?
          </h2>
          <p className="text-gray-300 mb-6">
            Start writing poetry in seconds with AI assistance
          </p>
          <Link 
            href="/tools/haiku-generator"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 
                     text-white rounded-xl font-semibold hover:opacity-90 transition-all"
          >
            <Sparkles className="w-5 h-5" />
            Try AI Haiku Generator
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Related Tools */}
        <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Related Tools</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/tools/text-counter" className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
              <h4 className="text-white font-medium mb-1">Text Counter</h4>
              <p className="text-sm text-gray-400">Count words and characters</p>
            </Link>
            <Link href="/tools/ai-summarizer" className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
              <h4 className="text-white font-medium mb-1">AI Summarizer</h4>
              <p className="text-sm text-gray-400">Summarize long texts</p>
            </Link>
            <Link href="/tools/lorem-ipsum" className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
              <h4 className="text-white font-medium mb-1">Lorem Ipsum</h4>
              <p className="text-sm text-gray-400">Generate placeholder text</p>
            </Link>
          </div>
        </div>

      </div>

      {/* Article Footer */}
      <footer className="mt-16 pt-8 border-t border-white/10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-gray-400">Published: October 19, 2025</p>
            <p className="text-sm text-gray-400">Last updated: October 19, 2025</p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm">Haiku</span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">Poetry</span>
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">AI</span>
          </div>
        </div>
      </footer>

    </article>
  )
}