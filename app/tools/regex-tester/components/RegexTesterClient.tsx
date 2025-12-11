'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { 
  Copy, Check, Code, AlertTriangle, Shield, ChevronDown, ChevronUp,
  Lightbulb, BookOpen, Play, Trash2, Download, RefreshCw, Info,
  Lock, Zap, Hash
} from 'lucide-react'

// ===== TYPES =====
interface MatchResult {
  index: number
  match: string
  groups: string[]
  start: number
  end: number
}

interface Flag {
  key: string
  label: string
  description: string
  enabled: boolean
}

interface CodeTemplate {
  lang: string
  label: string
  code: (pattern: string, flags: string) => string
}

// ===== CONSTANTS =====
const DEFAULT_FLAGS: Flag[] = [
  { key: 'g', label: 'Global', description: 'Find all matches', enabled: true },
  { key: 'i', label: 'Case Insensitive', description: 'Ignore case', enabled: false },
  { key: 'm', label: 'Multiline', description: '^ and $ match line breaks', enabled: false },
  { key: 's', label: 'Dotall', description: '. matches newlines', enabled: false },
  { key: 'u', label: 'Unicode', description: 'Enable unicode support', enabled: false },
  { key: 'y', label: 'Sticky', description: 'Match from lastIndex', enabled: false },
]

const CHEAT_SHEET = [
  { category: 'Characters', items: [
    { pattern: '.', desc: 'Any character except newline' },
    { pattern: '\\d', desc: 'Digit [0-9]' },
    { pattern: '\\D', desc: 'Non-digit' },
    { pattern: '\\w', desc: 'Word char [A-Za-z0-9_]' },
    { pattern: '\\W', desc: 'Non-word character' },
    { pattern: '\\s', desc: 'Whitespace' },
    { pattern: '\\S', desc: 'Non-whitespace' },
  ]},
  { category: 'Anchors', items: [
    { pattern: '^', desc: 'Start of string/line' },
    { pattern: '$', desc: 'End of string/line' },
    { pattern: '\\b', desc: 'Word boundary' },
    { pattern: '\\B', desc: 'Non-word boundary' },
  ]},
  { category: 'Quantifiers', items: [
    { pattern: '*', desc: '0 or more' },
    { pattern: '+', desc: '1 or more' },
    { pattern: '?', desc: '0 or 1' },
    { pattern: '{n}', desc: 'Exactly n times' },
    { pattern: '{n,}', desc: 'n or more times' },
    { pattern: '{n,m}', desc: 'Between n and m' },
  ]},
  { category: 'Groups', items: [
    { pattern: '(abc)', desc: 'Capture group' },
    { pattern: '(?:abc)', desc: 'Non-capture group' },
    { pattern: '(?<name>abc)', desc: 'Named group' },
    { pattern: '\\1', desc: 'Backreference' },
  ]},
  { category: 'Lookaround', items: [
    { pattern: '(?=abc)', desc: 'Positive lookahead' },
    { pattern: '(?!abc)', desc: 'Negative lookahead' },
    { pattern: '(?<=abc)', desc: 'Positive lookbehind' },
    { pattern: '(?<!abc)', desc: 'Negative lookbehind' },
  ]},
]

const CODE_TEMPLATES: CodeTemplate[] = [
  {
    lang: 'javascript',
    label: 'JavaScript',
    code: (pattern, flags) => `const regex = /${pattern.replace(/\//g, '\\/')}/${flags};
const text = "your text here";

// Test if matches
const isMatch = regex.test(text);

// Find all matches
const matches = text.match(regex);

// Replace
const replaced = text.replace(regex, "replacement");`
  },
  {
    lang: 'python',
    label: 'Python',
    code: (pattern, flags) => {
      const pyFlags = []
      if (flags.includes('i')) pyFlags.push('re.IGNORECASE')
      if (flags.includes('m')) pyFlags.push('re.MULTILINE')
      if (flags.includes('s')) pyFlags.push('re.DOTALL')
      const flagStr = pyFlags.length ? `, ${pyFlags.join(' | ')}` : ''
      return `import re

pattern = r"${pattern.replace(/"/g, '\\"')}"
text = "your text here"

# Find all matches
matches = re.findall(pattern, text${flagStr})

# Search for first match
match = re.search(pattern, text${flagStr})

# Replace
replaced = re.sub(pattern, "replacement", text${flagStr})`
    }
  },
  {
    lang: 'php',
    label: 'PHP',
    code: (pattern, flags) => `<?php
$pattern = '/${pattern.replace(/'/g, "\\'")}/${flags}';
$text = "your text here";

// Test if matches
$isMatch = preg_match($pattern, $text);

// Find all matches
preg_match_all($pattern, $text, $matches);

// Replace
$replaced = preg_replace($pattern, "replacement", $text);`
  },
  {
    lang: 'java',
    label: 'Java',
    code: (pattern, flags) => {
      const javaFlags = []
      if (flags.includes('i')) javaFlags.push('Pattern.CASE_INSENSITIVE')
      if (flags.includes('m')) javaFlags.push('Pattern.MULTILINE')
      if (flags.includes('s')) javaFlags.push('Pattern.DOTALL')
      const flagStr = javaFlags.length ? `, ${javaFlags.join(' | ')}` : ''
      return `import java.util.regex.*;

String pattern = "${pattern.replace(/"/g, '\\"').replace(/\\/g, '\\\\')}";
String text = "your text here";

Pattern regex = Pattern.compile(pattern${flagStr});
Matcher matcher = regex.matcher(text);

// Find all matches
while (matcher.find()) {
    System.out.println(matcher.group());
}

// Replace
String replaced = text.replaceAll(pattern, "replacement");`
    }
  },
  {
    lang: 'csharp',
    label: 'C#',
    code: (pattern, flags) => {
      const csFlags = ['RegexOptions.None']
      if (flags.includes('i')) csFlags.push('RegexOptions.IgnoreCase')
      if (flags.includes('m')) csFlags.push('RegexOptions.Multiline')
      if (flags.includes('s')) csFlags.push('RegexOptions.Singleline')
      return `using System.Text.RegularExpressions;

string pattern = @"${pattern.replace(/"/g, '""')}";
string text = "your text here";
var options = ${csFlags.join(' | ')};

// Find all matches
var matches = Regex.Matches(text, pattern, options);

// Test if matches
bool isMatch = Regex.IsMatch(text, pattern, options);

// Replace
string replaced = Regex.Replace(text, pattern, "replacement", options);`
    }
  },
  {
    lang: 'go',
    label: 'Go',
    code: (pattern, flags) => {
      const goFlags = flags.includes('i') ? '(?i)' : ''
      return `package main

import (
    "fmt"
    "regexp"
)

func main() {
    pattern := \`${goFlags}${pattern.replace(/`/g, '` + "`" + `')}\`
    text := "your text here"

    re := regexp.MustCompile(pattern)

    // Find all matches
    matches := re.FindAllString(text, -1)
    fmt.Println(matches)

    // Replace
    replaced := re.ReplaceAllString(text, "replacement")
    fmt.Println(replaced)
}`
    }
  },
]

const SAMPLE_PATTERNS = [
  { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', text: 'Contact us at hello@example.com or support@test.org' },
  { name: 'URL', pattern: 'https?://[\\w.-]+(?:/[\\w./?%&=-]*)?', text: 'Visit https://example.com/page?id=123 or http://test.org' },
  { name: 'Phone (US)', pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}', text: 'Call (555) 123-4567 or 555.987.6543' },
  { name: 'IP Address', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', text: 'Server at 192.168.1.1 and 10.0.0.255' },
  { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}', text: 'Dates: 2024-01-15 and 2025-12-31' },
  { name: 'HTML Tag', pattern: '<([a-z]+)[^>]*>.*?</\\1>', text: '<div class="test">Content</div> and <span>Text</span>' },
]

// ===== ReDoS DETECTION =====
function detectReDoS(pattern: string): { safe: boolean; warning: string | null } {
  // Simple heuristic-based ReDoS detection
  // Detects patterns prone to catastrophic backtracking
  const dangerousPatterns = [
    /\([^)]*\+[^)]*\)\+/,  // (a+)+ nested quantifiers
    /\([^)]*\*[^)]*\)\*/,  // (a*)* nested quantifiers
    /\([^)]*\+[^)]*\)\*/,  // (a+)* nested quantifiers
    /\([^)]*\*[^)]*\)\+/,  // (a*)+ nested quantifiers
    /\.\*[^?].*\.\*/,      // .* without ? followed by .*
    /\([^)]+\|[^)]+\)\+/,  // (a|b)+ with alternatives
    /\([^)]+\|[^)]+\)\*/,  // (a|b)* with alternatives
    /\\d\+.*\\d\+/,        // \d+ ... \d+ overlapping
    /\[^[^\]]+\]\+.*\[^[^\]]+\]\+/, // [abc]+ ... [abc]+
  ]
  
  for (const dangerous of dangerousPatterns) {
    if (dangerous.test(pattern)) {
      return {
        safe: false,
        warning: 'This pattern may be vulnerable to ReDoS (Regular Expression Denial of Service). Nested quantifiers or overlapping alternatives can cause exponential backtracking.'
      }
    }
  }
  
  // Check for excessive quantifier nesting
  const quantifierCount = (pattern.match(/[+*]{2,}|[+*]\?[+*]|\{[^}]+\}[+*]/g) || []).length
  if (quantifierCount > 0) {
    return {
      safe: false,
      warning: 'Pattern contains stacked quantifiers which may cause performance issues with certain inputs.'
    }
  }
  
  return { safe: true, warning: null }
}

// ===== PATTERN EXPLANATION =====
function explainPattern(pattern: string): string[] {
  const explanations: string[] = []
  let i = 0
  
  while (i < pattern.length) {
    const remaining = pattern.slice(i)
    
    // Character classes
    if (remaining.startsWith('\\d')) {
      explanations.push('\\d → Matches any digit (0-9)')
      i += 2; continue
    }
    if (remaining.startsWith('\\D')) {
      explanations.push('\\D → Matches any non-digit')
      i += 2; continue
    }
    if (remaining.startsWith('\\w')) {
      explanations.push('\\w → Matches word character (a-z, A-Z, 0-9, _)')
      i += 2; continue
    }
    if (remaining.startsWith('\\W')) {
      explanations.push('\\W → Matches non-word character')
      i += 2; continue
    }
    if (remaining.startsWith('\\s')) {
      explanations.push('\\s → Matches whitespace')
      i += 2; continue
    }
    if (remaining.startsWith('\\S')) {
      explanations.push('\\S → Matches non-whitespace')
      i += 2; continue
    }
    if (remaining.startsWith('\\b')) {
      explanations.push('\\b → Word boundary')
      i += 2; continue
    }
    if (remaining.startsWith('\\B')) {
      explanations.push('\\B → Non-word boundary')
      i += 2; continue
    }
    if (remaining.startsWith('\\.')) {
      explanations.push('\\. → Literal dot character')
      i += 2; continue
    }
    if (remaining.startsWith('\\n')) {
      explanations.push('\\n → Newline character')
      i += 2; continue
    }
    if (remaining.startsWith('\\t')) {
      explanations.push('\\t → Tab character')
      i += 2; continue
    }
    
    // Anchors
    if (remaining[0] === '^') {
      explanations.push('^ → Start of string/line')
      i++; continue
    }
    if (remaining[0] === '$') {
      explanations.push('$ → End of string/line')
      i++; continue
    }
    
    // Quantifiers
    if (remaining[0] === '*') {
      explanations.push('* → 0 or more of previous')
      i++; continue
    }
    if (remaining[0] === '+') {
      explanations.push('+ → 1 or more of previous')
      i++; continue
    }
    if (remaining[0] === '?') {
      explanations.push('? → 0 or 1 of previous (optional)')
      i++; continue
    }
    
    // Groups
    if (remaining.startsWith('(?:')) {
      explanations.push('(?:...) → Non-capturing group')
      i += 3; continue
    }
    if (remaining.startsWith('(?=')) {
      explanations.push('(?=...) → Positive lookahead')
      i += 3; continue
    }
    if (remaining.startsWith('(?!')) {
      explanations.push('(?!...) → Negative lookahead')
      i += 3; continue
    }
    if (remaining.startsWith('(?<=')) {
      explanations.push('(?<=...) → Positive lookbehind')
      i += 4; continue
    }
    if (remaining.startsWith('(?<!')) {
      explanations.push('(?<!...) → Negative lookbehind')
      i += 4; continue
    }
    if (remaining.startsWith('(?<')) {
      const match = remaining.match(/^\(\?<([^>]+)>/)
      if (match) {
        explanations.push(`(?<${match[1]}>) → Named capture group "${match[1]}"`)
        i += match[0].length; continue
      }
    }
    if (remaining[0] === '(') {
      explanations.push('(...) → Capture group')
      i++; continue
    }
    if (remaining[0] === ')') {
      explanations.push(') → End of group')
      i++; continue
    }
    
    // Character set
    if (remaining[0] === '[') {
      const match = remaining.match(/^\[(\^?[^\]]+)\]/)
      if (match) {
        const isNegated = match[1].startsWith('^')
        explanations.push(`[${match[1]}] → Character set${isNegated ? ' (negated)' : ''}`)
        i += match[0].length; continue
      }
    }
    
    // Alternation
    if (remaining[0] === '|') {
      explanations.push('| → OR (alternation)')
      i++; continue
    }
    
    // Dot
    if (remaining[0] === '.') {
      explanations.push('. → Any character except newline')
      i++; continue
    }
    
    // Curly braces quantifier
    if (remaining[0] === '{') {
      const match = remaining.match(/^\{(\d+)(,)?(\d*)?\}/)
      if (match) {
        if (match[2] && match[3]) {
          explanations.push(`{${match[1]},${match[3]}} → Between ${match[1]} and ${match[3]} times`)
        } else if (match[2]) {
          explanations.push(`{${match[1]},} → ${match[1]} or more times`)
        } else {
          explanations.push(`{${match[1]}} → Exactly ${match[1]} times`)
        }
        i += match[0].length; continue
      }
    }
    
    // Escaped character
    if (remaining[0] === '\\' && remaining[1]) {
      explanations.push(`\\${remaining[1]} → Literal "${remaining[1]}"`)
      i += 2; continue
    }
    
    // Literal character
    if (/[a-zA-Z0-9]/.test(remaining[0])) {
      // Group consecutive literals
      const literalMatch = remaining.match(/^[a-zA-Z0-9]+/)
      if (literalMatch && literalMatch[0].length > 1) {
        explanations.push(`"${literalMatch[0]}" → Literal text`)
        i += literalMatch[0].length; continue
      }
    }
    
    i++
  }
  
  return explanations
}

// ===== MAIN COMPONENT =====
export default function RegexTesterClient() {
  const [pattern, setPattern] = useState('')
  const [testText, setTestText] = useState('')
  const [flags, setFlags] = useState<Flag[]>(DEFAULT_FLAGS)
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  
  // UI State
  const [showCheatSheet, setShowCheatSheet] = useState(false)
  const [showCodeGen, setShowCodeGen] = useState(false)
  const [showExplanation, setShowExplanation] = useState(true)
  const [selectedLang, setSelectedLang] = useState('javascript')
  
  // Get active flags string
  const activeFlags = useMemo(() => {
    return flags.filter(f => f.enabled).map(f => f.key).join('')
  }, [flags])
  
  // ReDoS detection
  const redosResult = useMemo(() => {
    if (!pattern) return { safe: true, warning: null }
    return detectReDoS(pattern)
  }, [pattern])
  
  // Pattern explanation
  const explanation = useMemo(() => {
    if (!pattern) return []
    return explainPattern(pattern)
  }, [pattern])
  
  // Execute regex
  useEffect(() => {
    if (!pattern || !testText) {
      setMatches([])
      setError(null)
      return
    }
    
    try {
      const regex = new RegExp(pattern, activeFlags)
      const results: MatchResult[] = []
      
      if (activeFlags.includes('g')) {
        let match: RegExpExecArray | null
        let count = 0
        const maxMatches = 1000 // Prevent infinite loops
        
        while ((match = regex.exec(testText)) !== null && count < maxMatches) {
          results.push({
            index: count,
            match: match[0],
            groups: match.slice(1),
            start: match.index,
            end: match.index + match[0].length
          })
          count++
          
          // Prevent infinite loop for zero-length matches
          if (match[0].length === 0) {
            regex.lastIndex++
          }
        }
      } else {
        const match = regex.exec(testText)
        if (match) {
          results.push({
            index: 0,
            match: match[0],
            groups: match.slice(1),
            start: match.index,
            end: match.index + match[0].length
          })
        }
      }
      
      setMatches(results)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid regex pattern')
      setMatches([])
    }
  }, [pattern, testText, activeFlags])
  
  // Toggle flag
  const toggleFlag = useCallback((key: string) => {
    setFlags(prev => prev.map(f => 
      f.key === key ? { ...f, enabled: !f.enabled } : f
    ))
  }, [])
  
  // Copy to clipboard
  const copyToClipboard = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      if (navigator.vibrate) navigator.vibrate(30)
      setTimeout(() => setCopied(null), 2000)
    } catch (e) {
      console.error('Copy failed:', e)
    }
  }, [])
  
  // Load sample
  const loadSample = useCallback((sample: typeof SAMPLE_PATTERNS[0]) => {
    setPattern(sample.pattern)
    setTestText(sample.text)
    if (navigator.vibrate) navigator.vibrate(30)
  }, [])
  
  // Clear all
  const clearAll = useCallback(() => {
    setPattern('')
    setTestText('')
    setMatches([])
    setError(null)
    if (navigator.vibrate) navigator.vibrate(30)
  }, [])
  
  // Highlight matches in text
  const highlightedText = useMemo(() => {
    if (!testText || matches.length === 0) return testText
    
    const colors = [
      'bg-yellow-500/40',
      'bg-green-500/40', 
      'bg-blue-500/40',
      'bg-purple-500/40',
      'bg-pink-500/40',
      'bg-orange-500/40',
    ]
    
    const parts: { text: string; isMatch: boolean; matchIndex: number }[] = []
    let lastEnd = 0
    
    // Sort matches by start position
    const sortedMatches = [...matches].sort((a, b) => a.start - b.start)
    
    for (const match of sortedMatches) {
      if (match.start > lastEnd) {
        parts.push({ text: testText.slice(lastEnd, match.start), isMatch: false, matchIndex: -1 })
      }
      parts.push({ text: match.match, isMatch: true, matchIndex: match.index })
      lastEnd = match.end
    }
    
    if (lastEnd < testText.length) {
      parts.push({ text: testText.slice(lastEnd), isMatch: false, matchIndex: -1 })
    }
    
    return parts.map((part, i) => (
      part.isMatch ? (
        <mark 
          key={i} 
          className={`${colors[part.matchIndex % colors.length]} rounded px-0.5`}
          title={`Match ${part.matchIndex + 1}`}
        >
          {part.text}
        </mark>
      ) : (
        <span key={i}>{part.text}</span>
      )
    ))
  }, [testText, matches])
  
  // Get generated code
  const generatedCode = useMemo(() => {
    const template = CODE_TEMPLATES.find(t => t.lang === selectedLang)
    if (!template) return ''
    return template.code(pattern, activeFlags)
  }, [pattern, activeFlags, selectedLang])

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Privacy Badge */}
      <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
        <Lock className="w-4 h-4 text-green-400 flex-shrink-0" />
        <p className="text-green-400 text-xs">
          <span className="font-medium">100% Private</span> — All processing done locally in your browser
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Input */}
        <div className="lg:col-span-2 space-y-4">
          {/* Pattern Input */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-300">Regular Expression</label>
              <div className="flex items-center gap-2">
                {!redosResult.safe && (
                  <div className="flex items-center gap-1 text-yellow-400 text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>ReDoS Risk</span>
                  </div>
                )}
                <button
                  onClick={() => copyToClipboard(`/${pattern}/${activeFlags}`, 'pattern')}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  title="Copy pattern"
                >
                  {copied === 'pattern' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-800/50 rounded-xl border border-white/10 px-4 py-3">
              <span className="text-gray-500 text-lg">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter regex pattern..."
                className="flex-1 bg-transparent outline-none font-mono text-lg text-orange-300"
                  spellCheck={false}
                />
                <span className="text-gray-500 text-lg">/</span>
                <span className="text-purple-400 font-mono">{activeFlags}</span>
              </div>
              
              {error && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-red-400">{error}</span>
                </div>
              )}
              
              {redosResult.warning && (
                <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2">
                  <Shield className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-yellow-400">{redosResult.warning}</span>
                </div>
              )}
              
              {/* Flags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {flags.map(flag => (
                  <button
                    key={flag.key}
                    onClick={() => toggleFlag(flag.key)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-mono transition-all ${
                      flag.enabled
                        ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
                        : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                    title={flag.description}
                  >
                    {flag.key} <span className="text-xs opacity-60">({flag.label})</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Test Text Input */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-300">Test String</label>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{matches.length} match{matches.length !== 1 ? 'es' : ''}</span>
                </div>
              </div>
              
              <textarea
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder="Enter text to test against..."
                className="w-full h-40 bg-gray-800/50 rounded-xl border border-white/10 px-4 py-3 outline-none resize-none font-mono text-sm"
                spellCheck={false}
              />
              
              {/* Highlighted Result */}
              {testText && matches.length > 0 && (
                <div className="mt-3">
                  <label className="text-xs font-medium text-gray-400 mb-2 block">Highlighted Matches</label>
                  <div className="p-3 bg-gray-800/50 rounded-lg font-mono text-sm whitespace-pre-wrap break-all">
                    {highlightedText}
                  </div>
                </div>
              )}
            </div>
            
            {/* Match Results */}
            {matches.length > 0 && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Match Details</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {matches.slice(0, 100).map((match, i) => (
                    <div 
                      key={i}
                      className="p-3 bg-gray-800/50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Match {i + 1} (index {match.start}-{match.end})</span>
                        <button
                          onClick={() => copyToClipboard(match.match, `match-${i}`)}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                          {copied === `match-${i}` ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <code className="text-green-400 font-mono text-sm break-all">{match.match}</code>
                      
                      {match.groups.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-white/10">
                          <span className="text-xs text-gray-500">Groups:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {match.groups.map((group, gi) => (
                              <span key={gi} className="px-2 py-0.5 bg-blue-500/20 rounded text-xs text-blue-300 font-mono">
                                ${gi + 1}: {group || '(empty)'}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {matches.length > 100 && (
                    <p className="text-center text-sm text-gray-400 py-2">
                      Showing first 100 of {matches.length} matches
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* Code Generator */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
              <button
                onClick={() => setShowCodeGen(!showCodeGen)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-cyan-400" />
                  <span className="font-medium">Code Generator</span>
                </div>
                {showCodeGen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              
              {showCodeGen && (
                <div className="p-4 pt-0">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {CODE_TEMPLATES.map(template => (
                      <button
                        key={template.lang}
                        onClick={() => setSelectedLang(template.lang)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          selectedLang === template.lang
                            ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                            : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {template.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="relative">
                    <pre className="p-4 bg-gray-800/50 rounded-lg overflow-x-auto text-sm">
                      <code className="text-gray-300">{generatedCode}</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(generatedCode, 'code')}
                      className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      {copied === 'code' ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Tools */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={clearAll}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
                <button
                  onClick={() => copyToClipboard(`/${pattern}/${activeFlags}`, 'full')}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-sm"
                >
                  {copied === 'full' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  Copy
                </button>
              </div>
            </div>
            
            {/* Sample Patterns */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Sample Patterns</h3>
              <div className="space-y-2">
                {SAMPLE_PATTERNS.map((sample, i) => (
                  <button
                    key={i}
                    onClick={() => loadSample(sample)}
                    className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-colors"
                  >
                    <div className="font-medium text-sm">{sample.name}</div>
                    <code className="text-xs text-orange-300/70 font-mono break-all">{sample.pattern}</code>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Pattern Explanation */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium">Pattern Explanation</span>
                </div>
                {showExplanation ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              
              {showExplanation && (
                <div className="p-4 pt-0">
                  {explanation.length > 0 ? (
                    <div className="space-y-1.5 max-h-60 overflow-y-auto">
                      {explanation.map((exp, i) => (
                        <div key={i} className="text-sm text-gray-300 font-mono">
                          {exp}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Enter a pattern to see explanation</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Cheat Sheet */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
              <button
                onClick={() => setShowCheatSheet(!showCheatSheet)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  <span className="font-medium">Cheat Sheet</span>
                </div>
                {showCheatSheet ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              
              {showCheatSheet && (
                <div className="p-4 pt-0 space-y-4 max-h-96 overflow-y-auto">
                  {CHEAT_SHEET.map((section, i) => (
                    <div key={i}>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">{section.category}</h4>
                      <div className="space-y-1">
                        {section.items.map((item, j) => (
                          <div 
                            key={j}
                            className="flex items-center justify-between text-sm cursor-pointer hover:bg-white/5 rounded px-2 py-1 -mx-2"
                            onClick={() => {
                              setPattern(prev => prev + item.pattern)
                              if (navigator.vibrate) navigator.vibrate(30)
                            }}
                          >
                            <code className="text-orange-300 font-mono">{item.pattern}</code>
                            <span className="text-gray-400 text-xs">{item.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Stats */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Statistics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/5 rounded-lg text-center">
                  <div className="text-2xl font-bold text-cyan-400">{matches.length}</div>
                  <div className="text-xs text-gray-400">Matches</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-400">{pattern.length}</div>
                  <div className="text-xs text-gray-400">Pattern Length</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {matches.reduce((sum, m) => sum + m.groups.length, 0)}
                  </div>
                  <div className="text-xs text-gray-400">Groups Found</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-400">{activeFlags.length}</div>
                  <div className="text-xs text-gray-400">Active Flags</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
