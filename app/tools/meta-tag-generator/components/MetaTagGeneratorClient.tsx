'use client'

import { useState, useCallback, useMemo } from 'react'
import { Copy, Check, Lock, Code, Eye, Globe, Twitter, Facebook, Image } from 'lucide-react'

// ===== MAIN COMPONENT =====
export default function MetaTagGeneratorClient() {
  // Basic Meta
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [keywords, setKeywords] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  
  // Open Graph
  const [ogType, setOgType] = useState('website')
  const [ogImage, setOgImage] = useState('')
  const [ogSiteName, setOgSiteName] = useState('')
  
  // Twitter
  const [twitterCard, setTwitterCard] = useState('summary_large_image')
  const [twitterSite, setTwitterSite] = useState('')
  
  // UI State
  const [activeTab, setActiveTab] = useState<'basic' | 'og' | 'twitter'>('basic')
  const [copied, setCopied] = useState(false)
  
  // Generate meta tags
  const generatedTags = useMemo(() => {
    const tags: string[] = []
    
    // Basic Meta Tags
    if (title) {
      tags.push(`<title>${title}</title>`)
      tags.push(`<meta name="title" content="${title}">`)
    }
    if (description) {
      tags.push(`<meta name="description" content="${description}">`)
    }
    if (keywords) {
      tags.push(`<meta name="keywords" content="${keywords}">`)
    }
    if (author) {
      tags.push(`<meta name="author" content="${author}">`)
    }
    
    // Robots
    tags.push(`<meta name="robots" content="index, follow">`)
    
    // Canonical
    if (url) {
      tags.push(`<link rel="canonical" href="${url}">`)
    }
    
    // Open Graph
    if (title) {
      tags.push(``)
      tags.push(`<!-- Open Graph / Facebook -->`)
      tags.push(`<meta property="og:type" content="${ogType}">`)
      tags.push(`<meta property="og:title" content="${title}">`)
    }
    if (description) {
      tags.push(`<meta property="og:description" content="${description}">`)
    }
    if (url) {
      tags.push(`<meta property="og:url" content="${url}">`)
    }
    if (ogImage) {
      tags.push(`<meta property="og:image" content="${ogImage}">`)
    }
    if (ogSiteName) {
      tags.push(`<meta property="og:site_name" content="${ogSiteName}">`)
    }
    
    // Twitter
    if (title) {
      tags.push(``)
      tags.push(`<!-- Twitter -->`)
      tags.push(`<meta name="twitter:card" content="${twitterCard}">`)
      tags.push(`<meta name="twitter:title" content="${title}">`)
    }
    if (description) {
      tags.push(`<meta name="twitter:description" content="${description}">`)
    }
    if (ogImage) {
      tags.push(`<meta name="twitter:image" content="${ogImage}">`)
    }
    if (twitterSite) {
      tags.push(`<meta name="twitter:site" content="${twitterSite}">`)
    }
    
    return tags.join('\n')
  }, [title, description, keywords, author, url, ogType, ogImage, ogSiteName, twitterCard, twitterSite])
  
  // Copy to clipboard
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedTags)
      setCopied(true)
      if (navigator.vibrate) navigator.vibrate(30)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error('Copy failed:', e)
    }
  }, [generatedTags])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Privacy Badge */}
      <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
        <Lock className="w-4 h-4 text-green-400 flex-shrink-0" />
        <p className="text-green-400 text-xs">
          <span className="font-medium">100% Private</span> — All generation done locally in your browser
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
            {(['basic', 'og', 'twitter'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeTab === tab ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'basic' && <Globe className="w-4 h-4" />}
                {tab === 'og' && <Facebook className="w-4 h-4" />}
                {tab === 'twitter' && <Twitter className="w-4 h-4" />}
                {tab === 'basic' ? 'Basic' : tab === 'og' ? 'Open Graph' : 'Twitter'}
              </button>
            ))}
          </div>
          
          {/* Basic Tab */}
          {activeTab === 'basic' && (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Page Title <span className="text-indigo-400">*</span></label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Your page title (50-60 chars)"
                  maxLength={70}
                  className="w-full bg-gray-800/50 rounded-lg border border-white/10 px-4 py-3 outline-none focus:border-indigo-500/50"
                />
                <div className="text-xs text-gray-500 mt-1 text-right">{title.length}/70</div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Description <span className="text-indigo-400">*</span></label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Page description (150-160 chars)"
                    maxLength={170}
                    rows={3}
                    className="w-full bg-gray-800/50 rounded-lg border border-white/10 px-4 py-3 outline-none resize-none focus:border-indigo-500/50"
                  />
                  <div className="text-xs text-gray-500 mt-1 text-right">{description.length}/170</div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Keywords</label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                    className="w-full bg-gray-800/50 rounded-lg border border-white/10 px-4 py-3 outline-none focus:border-indigo-500/50"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Author</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Author name"
                    className="w-full bg-gray-800/50 rounded-lg border border-white/10 px-4 py-3 outline-none focus:border-indigo-500/50"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Canonical URL</label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/page"
                    className="w-full bg-gray-800/50 rounded-lg border border-white/10 px-4 py-3 outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>
            )}
            
            {/* Open Graph Tab */}
            {activeTab === 'og' && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">OG Type</label>
                  <select
                    value={ogType}
                    onChange={(e) => setOgType(e.target.value)}
                    className="w-full bg-gray-800/50 rounded-lg border border-white/10 px-4 py-3 outline-none focus:border-indigo-500/50"
                  >
                    <option value="website">website</option>
                    <option value="article">article</option>
                    <option value="product">product</option>
                    <option value="profile">profile</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">OG Image URL</label>
                  <input
                    type="url"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    placeholder="https://example.com/image.jpg (1200x630 recommended)"
                    className="w-full bg-gray-800/50 rounded-lg border border-white/10 px-4 py-3 outline-none focus:border-indigo-500/50"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Site Name</label>
                  <input
                    type="text"
                    value={ogSiteName}
                    onChange={(e) => setOgSiteName(e.target.value)}
                    placeholder="Your Site Name"
                    className="w-full bg-gray-800/50 rounded-lg border border-white/10 px-4 py-3 outline-none focus:border-indigo-500/50"
                  />
                </div>
                
                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-xs text-blue-400">
                    💡 OG Image should be 1200×630 pixels for best display on Facebook and LinkedIn.
                  </p>
                </div>
              </div>
            )}
            
            {/* Twitter Tab */}
            {activeTab === 'twitter' && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Card Type</label>
                  <select
                    value={twitterCard}
                    onChange={(e) => setTwitterCard(e.target.value)}
                    className="w-full bg-gray-800/50 rounded-lg border border-white/10 px-4 py-3 outline-none focus:border-indigo-500/50"
                  >
                    <option value="summary">summary (small image)</option>
                    <option value="summary_large_image">summary_large_image (large image)</option>
                    <option value="app">app</option>
                    <option value="player">player</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Twitter @username</label>
                  <input
                    type="text"
                    value={twitterSite}
                    onChange={(e) => setTwitterSite(e.target.value)}
                    placeholder="@yourusername"
                    className="w-full bg-gray-800/50 rounded-lg border border-white/10 px-4 py-3 outline-none focus:border-indigo-500/50"
                  />
                </div>
                
                <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <p className="text-xs text-cyan-400">
                    💡 Twitter uses the OG Image if no twitter:image is specified.
                  </p>
                </div>
              </div>
            )}
            
            {/* Preview */}
            {(title || description) && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-medium text-gray-300">Google Preview</h3>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <div className="text-blue-700 text-lg font-medium truncate">{title || 'Page Title'}</div>
                  <div className="text-green-700 text-sm truncate">{url || 'https://example.com'}</div>
                  <div className="text-gray-600 text-sm line-clamp-2 mt-1">{description || 'Page description will appear here...'}</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Output Section */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-300">Generated Meta Tags</h3>
              <button
                onClick={copyToClipboard}
                disabled={!generatedTags}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                {copied ? <><Check className="w-4 h-4 text-green-400" /> Copied</> : <><Copy className="w-4 h-4" /> Copy All</>}
              </button>
            </div>
            
            <pre className="p-4 bg-gray-800/50 rounded-lg overflow-x-auto text-sm font-mono text-gray-300 whitespace-pre-wrap max-h-[600px] overflow-y-auto">
              {generatedTags || '<!-- Enter title and description to generate meta tags -->'}
            </pre>
            
            {/* Tips */}
            <div className="mt-4 space-y-2">
              <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                <p className="text-xs text-indigo-400">
                  📋 Paste these tags inside the <code>&lt;head&gt;</code> section of your HTML.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
