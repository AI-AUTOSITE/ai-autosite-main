'use client'

import { useState } from 'react'
import { Hash, Copy, Check, Instagram, Twitter, Music2, Sparkles, TrendingUp } from 'lucide-react'

type Platform = 'instagram' | 'twitter' | 'tiktok'

interface HashtagSet {
  popular: string[]
  medium: string[]
  niche: string[]
}

const PLATFORM_LIMITS = {
  instagram: 30,
  twitter: 10,
  tiktok: 30,
}

// Hashtag templates based on common topics
const HASHTAG_TEMPLATES: Record<string, HashtagSet> = {
  fitness: {
    popular: [
      'fitness',
      'workout',
      'gym',
      'health',
      'fit',
      'motivation',
      'training',
      'exercise',
      'healthy',
      'lifestyle',
    ],
    medium: [
      'fitnessmotivation',
      'workouttime',
      'gymlife',
      'fitfam',
      'getfit',
      'cardio',
      'strength',
      'wellness',
      'fitgoals',
      'dailyworkout',
    ],
    niche: [
      'homeworkout',
      'noexcuses',
      'transformationtuesday',
      'sweatyselfie',
      'gymaddict',
      'trainhard',
      'fitjourney',
      'workoutoftheday',
      'fitnessfreak',
      'beastmode',
    ],
  },
  food: {
    popular: [
      'food',
      'foodie',
      'yummy',
      'delicious',
      'cooking',
      'recipe',
      'dinner',
      'lunch',
      'tasty',
      'eat',
    ],
    medium: [
      'foodporn',
      'instafood',
      'foodlover',
      'homemade',
      'foodblog',
      'foodgasm',
      'foodphotography',
      'healthyfood',
      'foodstagram',
      'cooking',
    ],
    niche: [
      'foodiesofinstagram',
      'homecooking',
      'recipeideas',
      'foodprep',
      'mealprep',
      'kitchenlife',
      'cookingtime',
      'foodshare',
      'yumyum',
      'fooddiary',
    ],
  },
  travel: {
    popular: [
      'travel',
      'vacation',
      'trip',
      'wanderlust',
      'adventure',
      'explore',
      'tourism',
      'traveling',
      'holiday',
      'world',
    ],
    medium: [
      'travelgram',
      'instatravel',
      'travelphotography',
      'traveladdict',
      'travelblogger',
      'traveller',
      'exploring',
      'travelgoals',
      'wanderer',
      'travellife',
    ],
    niche: [
      'passionpassport',
      'travelmore',
      'goexplore',
      'wonderfulplaces',
      'roamtheplanet',
      'travelawesome',
      'welltraveled',
      'travelcommunity',
      'backpacking',
      'solotraveler',
    ],
  },
  fashion: {
    popular: [
      'fashion',
      'style',
      'outfit',
      'ootd',
      'clothes',
      'shopping',
      'dress',
      'look',
      'fashionista',
      'trendy',
    ],
    medium: [
      'fashionblogger',
      'instafashion',
      'fashionstyle',
      'fashionlover',
      'styleinspo',
      'fashiondiaries',
      'fashiongram',
      'fashionpost',
      'styleblogger',
      'fashionaddict',
    ],
    niche: [
      'currentlywearing',
      'whatiwore',
      'fashionkilla',
      'styleoftheday',
      'fashionweek',
      'streetstyle',
      'fashiondaily',
      'styleguide',
      'fashiongoals',
      'outfitinspiration',
    ],
  },
  photography: {
    popular: [
      'photography',
      'photo',
      'photographer',
      'photos',
      'picture',
      'photooftheday',
      'art',
      'camera',
      'nature',
      'portrait',
    ],
    medium: [
      'photographylovers',
      'instaphoto',
      'photoshoot',
      'photographylife',
      'photogram',
      'photographers',
      'capture',
      'photographyislife',
      'photoaday',
      'visualart',
    ],
    niche: [
      'photographysouls',
      'photographyeveryday',
      'ig_photography',
      'photographylover',
      'lenslove',
      'shutterbug',
      'throughmylens',
      'capturetheshot',
      'photographyart',
      'cameralife',
    ],
  },
  business: {
    popular: [
      'business',
      'entrepreneur',
      'success',
      'marketing',
      'startup',
      'money',
      'work',
      'motivation',
      'goals',
      'leadership',
    ],
    medium: [
      'businessowner',
      'smallbusiness',
      'businesslife',
      'businesstips',
      'businessmindset',
      'businessgrowth',
      'businessstrategy',
      'onlinebusiness',
      'businesscoach',
      'businesssuccess',
    ],
    niche: [
      'entrepreneurmindset',
      'businessmentor',
      'startuplife',
      'businessbuilding',
      'solopreneur',
      'businessgoals',
      'entrepreneurjourney',
      'businessnetworking',
      'businessdevelopment',
      'businessinspiration',
    ],
  },
  tech: {
    popular: [
      'tech',
      'technology',
      'coding',
      'programming',
      'software',
      'developer',
      'computer',
      'digital',
      'innovation',
      'ai',
    ],
    medium: [
      'techlife',
      'techgeek',
      'technews',
      'techblogger',
      'techy',
      'techworld',
      'techtrends',
      'techcommunity',
      'techlovers',
      'techstartup',
    ],
    niche: [
      'coderlife',
      'devlife',
      'programminglife',
      'softwaredeveloper',
      'techsavvy',
      'techaddicted',
      'geeklife',
      'techentrepreneur',
      'digitalnomad',
      'futuretech',
    ],
  },
  art: {
    popular: [
      'art',
      'artist',
      'artwork',
      'drawing',
      'painting',
      'creative',
      'design',
      'illustration',
      'sketch',
      'artistsoninstagram',
    ],
    medium: [
      'artoftheday',
      'instaart',
      'artgallery',
      'artlovers',
      'artlife',
      'contemporaryart',
      'artcollector',
      'artistry',
      'artworld',
      'digitalart',
    ],
    niche: [
      'artistsupport',
      'artprocess',
      'artjournal',
      'artstudio',
      'artdaily',
      'creativeprocess',
      'artinprogress',
      'artistlife',
      'artcommunity',
      'arttherapy',
    ],
  },
}

function generateHashtags(topic: string, platform: Platform): HashtagSet {
  const normalizedTopic = topic.toLowerCase().trim()
  const words = normalizedTopic.split(/\s+/)

  // Find matching template
  let template: HashtagSet | null = null
  for (const [key, value] of Object.entries(HASHTAG_TEMPLATES)) {
    if (words.some((word) => key.includes(word) || word.includes(key))) {
      template = value
      break
    }
  }

  // If no template found, generate generic hashtags
  if (!template) {
    const baseTag = words[0] || 'trending'
    template = {
      popular: [
        baseTag,
        'love',
        'instagood',
        'photooftheday',
        'beautiful',
        'happy',
        'cute',
        'like4like',
        'followme',
        'picoftheday',
      ],
      medium: [
        `${baseTag}life`,
        `${baseTag}love`,
        `${baseTag}daily`,
        `insta${baseTag}`,
        `${baseTag}gram`,
        `${baseTag}time`,
        `${baseTag}vibes`,
        `${baseTag}mood`,
        `${baseTag}style`,
        `${baseTag}goals`,
      ],
      niche: words
        .map((word) => word.replace(/[^a-z0-9]/gi, ''))
        .filter((w) => w.length > 0)
        .slice(0, 10),
    }

    // Add more variations
    while (template.niche.length < 10) {
      template.niche.push(
        `${baseTag}${['lover', 'addict', 'obsessed', 'fan', 'freak', 'enthusiast', 'passion', 'community', 'world', 'nation'][template.niche.length]}`
      )
    }
  }

  // Add platform-specific tags
  if (platform === 'tiktok') {
    template.popular = ['fyp', 'foryou', 'viral', ...template.popular.slice(0, 7)]
    template.medium = ['foryoupage', 'trending', 'tiktok', ...template.medium.slice(0, 7)]
  } else if (platform === 'twitter') {
    // Twitter uses fewer, more focused tags
    template.popular = template.popular.slice(0, 3)
    template.medium = template.medium.slice(0, 3)
    template.niche = template.niche.slice(0, 4)
  }

  // Add hashtag symbol
  return {
    popular: template.popular.map((tag) => `#${tag}`),
    medium: template.medium.map((tag) => `#${tag}`),
    niche: template.niche.map((tag) => `#${tag}`),
  }
}

export default function HashtagGeneratorClient() {
  const [platform, setPlatform] = useState<Platform>('instagram')
  const [topic, setTopic] = useState('')
  const [hashtags, setHashtags] = useState<HashtagSet | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = () => {
    if (!topic.trim()) return

    const tags = generateHashtags(topic, platform)
    setHashtags(tags)
  }

  const handleCopy = () => {
    if (!hashtags) return

    const allTags = [...hashtags.popular, ...hashtags.medium, ...hashtags.niche]
      .slice(0, PLATFORM_LIMITS[platform])
      .join(' ')

    navigator.clipboard.writeText(allTags)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerate()
    }
  }

  const getPlatformIcon = () => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-5 h-5" />
      case 'twitter':
        return <Twitter className="w-5 h-5" />
      case 'tiktok':
        return <Music2 className="w-5 h-5" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Platform Selection */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-2 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setPlatform('instagram')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              platform === 'instagram'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Instagram className="w-5 h-5" />
            Instagram
          </button>
          <button
            onClick={() => setPlatform('twitter')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              platform === 'twitter'
                ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Twitter className="w-5 h-5" />
            Twitter
          </button>
          <button
            onClick={() => setPlatform('tiktok')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              platform === 'tiktok'
                ? 'bg-gradient-to-r from-black to-gray-800 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Music2 className="w-5 h-5" />
            TikTok
          </button>
        </div>
      </div>

      {/* Topic Input */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
        <label className="block text-white font-medium mb-3">Enter Your Topic</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. fitness, food, travel, fashion..."
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
          />
          <button
            onClick={handleGenerate}
            disabled={!topic.trim()}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Generate
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          <p className="text-gray-400 text-sm">
            Max tags: {PLATFORM_LIMITS[platform]} for {platform}
          </p>
        </div>
      </div>

      {/* Generated Hashtags */}
      {hashtags && (
        <>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
            {/* Popular Tags */}
            <div className="mb-6">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
                Popular Tags ({hashtags.popular.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {hashtags.popular.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Medium Tags */}
            <div className="mb-6">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <Hash className="w-5 h-5 text-blue-400" />
                Medium Tags ({hashtags.medium.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {hashtags.medium.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Niche Tags */}
            <div className="mb-6">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Niche Tags ({hashtags.niche.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {hashtags.niche.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={`w-full px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy All Tags
                </>
              )}
            </button>
          </div>

          {/* Tips */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
            <h3 className="text-white font-medium mb-3">Pro Tips</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p className="flex items-start gap-2">
                <span className="text-yellow-400">💡</span>
                Mix popular and niche tags for best reach
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-400">📊</span>
                {platform === 'instagram' && 'Instagram allows up to 30 hashtags per post'}
                {platform === 'twitter' && 'Twitter works best with 1-3 focused hashtags'}
                {platform === 'tiktok' && 'TikTok recommends 3-5 hashtags including #fyp'}
              </p>
              <p className="flex items-start gap-2">
                <span className="text-purple-400">🎯</span>
                Use niche tags to reach your target audience
              </p>
            </div>
          </div>
        </>
      )}

      {/* Quick Examples */}
      {!hashtags && (
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
          <h3 className="text-white font-medium mb-4">Try These Topics</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            {['fitness', 'food', 'travel', 'fashion', 'photography', 'business'].map((example) => (
              <button
                key={example}
                onClick={() => {
                  setTopic(example)
                  setHashtags(generateHashtags(example, platform))
                }}
                className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all capitalize"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
