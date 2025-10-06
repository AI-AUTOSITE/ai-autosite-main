'use client'

import { useState, useEffect, useCallback } from 'react'
import { FileText, Copy, Eye, Code, RefreshCw, Check, Hash } from 'lucide-react'
import { marked } from 'marked'

type ViewMode = 'preview' | 'code'

const SAMPLE_MARKDOWN = `# Welcome to Markdown

This is **bold** text and this is *italic*.

## Features

- Easy to write
- Clean syntax  
- Converts to HTML

### Code Example

\`\`\`javascript
function hello() {
  console.log("Hello World!");
}
\`\`\`

> This is a quote block

Here's a [link](https://example.com)

---

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |`

export default function MarkdownHtmlClient() {
  const [markdown, setMarkdown] = useState('')
  const [html, setHtml] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('preview')
  const [copied, setCopied] = useState(false)

  // Configure marked options
  useEffect(() => {
    marked.setOptions({
      gfm: true, // GitHub Flavored Markdown
      breaks: true, // Convert line breaks to <br>
      // headerIds and mangle were removed in newer versions of marked
    })
  }, [])

  // Convert markdown to HTML
  const convertMarkdown = useCallback(async (text: string) => {
    try {
      const converted = await marked.parse(text)
      setHtml(converted)
    } catch (err) {
      setHtml('<p>Error parsing markdown</p>')
    }
  }, [])

  // Update HTML when markdown changes
  useEffect(() => {
    convertMarkdown(markdown)
  }, [markdown, convertMarkdown])

  // Copy HTML to clipboard
  const copyHtml = async () => {
    if (!html) return

    try {
      await navigator.clipboard.writeText(html)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy')
    }
  }

  // Clear all
  const handleClear = () => {
    setMarkdown('')
    setHtml('')
  }

  // Load sample
  const loadSample = () => {
    setMarkdown(SAMPLE_MARKDOWN)
  }

  // Get stats
  const getStats = () => {
    const lines = markdown.split('\n').length
    const words = markdown.trim() === '' ? 0 : markdown.trim().split(/\s+/).length
    const chars = html.replace(/<[^>]*>/g, '').length
    return { lines, words, chars }
  }

  const stats = getStats()

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Editor Grid - Tool First Design */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Markdown Input */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-medium">Markdown Input</h3>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>{stats.lines} lines</span>
              <span>{stats.words} words</span>
            </div>
          </div>

          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Type or paste markdown here..."
            className="w-full h-[450px] p-4 bg-white/5 border border-white/10 rounded-xl 
                     text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 
                     transition-colors resize-none font-mono text-sm"
            spellCheck={false}
          />

          {/* Input Actions */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={loadSample}
              className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg 
                       hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Load Sample
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg 
                       hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>

        {/* HTML Output */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex justify-between items-center mb-4">
            {/* View Mode Toggle */}
            <div className="flex bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                  viewMode === 'preview'
                    ? 'bg-cyan-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </button>
              <button
                onClick={() => setViewMode('code')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                  viewMode === 'code' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                HTML
              </button>
            </div>

            {/* Copy Button */}
            <button
              onClick={copyHtml}
              disabled={!html}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all 
                        flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                          copied
                            ? 'bg-green-500 text-white'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Output Display */}
          {viewMode === 'preview' ? (
            <div
              className="w-full h-[450px] p-4 bg-black/20 border border-white/10 rounded-xl 
                       overflow-auto prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: html || '<p class="text-gray-400">Preview will appear here...</p>',
              }}
            />
          ) : (
            <div className="relative">
              <textarea
                value={html}
                readOnly
                placeholder="HTML code will appear here..."
                className="w-full h-[450px] p-4 bg-black/20 border border-white/10 rounded-xl 
                         text-gray-300 placeholder-gray-500 resize-none font-mono text-sm"
                spellCheck={false}
              />
              {html && (
                <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                  {stats.chars} characters
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Reference - Compact Version */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
        <h3 className="text-white font-medium mb-4">Quick Reference</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <h4 className="text-gray-400 mb-2 text-xs uppercase">Headings</h4>
            <div className="space-y-1 font-mono text-gray-300">
              <div># H1</div>
              <div>## H2</div>
              <div>### H3</div>
            </div>
          </div>
          <div>
            <h4 className="text-gray-400 mb-2 text-xs uppercase">Emphasis</h4>
            <div className="space-y-1 font-mono text-gray-300">
              <div>**bold**</div>
              <div>*italic*</div>
              <div>`code`</div>
            </div>
          </div>
          <div>
            <h4 className="text-gray-400 mb-2 text-xs uppercase">Lists</h4>
            <div className="space-y-1 font-mono text-gray-300">
              <div>- Item</div>
              <div>1. Item</div>
              <div>- [ ] Task</div>
            </div>
          </div>
          <div>
            <h4 className="text-gray-400 mb-2 text-xs uppercase">Links</h4>
            <div className="space-y-1 font-mono text-gray-300">
              <div>[text](url)</div>
              <div>![alt](img)</div>
              <div>&gt; Quote</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
