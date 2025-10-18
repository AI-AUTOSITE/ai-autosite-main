'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, AlertTriangle, CheckCircle, Mail, AlertCircle, Copy, Smartphone, Info, Sparkles } from 'lucide-react'

// AI Tool Warning
import { useAIToolWarning } from '@/hooks/useAIToolWarning'
import AIToolWarningModal from '@/components/AIToolWarningModal'

type RiskLevel = 'safe' | 'caution' | 'danger' | null
type CheckType = 'email-address' | 'not-checked'
type AnalysisMethod = 'rules' | 'ai' | null

interface RiskIssue {
  type: string
  severity: 'high' | 'medium' | 'low'
  message: string
  detail: string
}

interface CheckResult {
  riskLevel: RiskLevel
  issues: RiskIssue[]
  recommendation: string
  safetyScore: number
  method?: AnalysisMethod
  needsAI?: boolean
}

// Known legitimate domains
const LEGITIMATE_DOMAINS = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com',
  'amazon.com', 'paypal.com', 'apple.com', 'microsoft.com', 'google.com',
  'facebook.com', 'twitter.com', 'linkedin.com', 'netflix.com', 'spotify.com',
  'adobe.com', 'dropbox.com', 'zoom.us', 'slack.com', 'github.com'
]

// Common typosquatting patterns
const TYPOSQUAT_PATTERNS = [
  { legit: 'paypal', patterns: ['paypa1', 'paypai', 'paypa|', 'paypall', 'paypel'] },
  { legit: 'amazon', patterns: ['amazom', 'arnazon', 'amaz0n', 'amazonn', 'amozon'] },
  { legit: 'apple', patterns: ['app1e', 'appie', 'appl3', 'applle', 'apole'] },
  { legit: 'google', patterns: ['goog1e', 'googie', 'gooogle', 'googgle', 'gogle'] },
  { legit: 'microsoft', patterns: ['microsft', 'rnicrosoft', 'micros0ft', 'microsooft'] },
  { legit: 'netflix', patterns: ['netfl1x', 'netfiix', 'netfIix', 'netflixx'] },
  { legit: 'facebook', patterns: ['faceb00k', 'facebock', 'faceboook', 'facebok'] },
]

// Dangerous TLDs
const DANGEROUS_TLDS = ['.xyz', '.top', '.click', '.link', '.online', '.site', '.club', '.icu', '.rest']

// Free email providers
const FREE_EMAIL_PROVIDERS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'mail.com', 'protonmail.com']

export default function SpamEmailCheckerClient() {
  const router = useRouter()
  
  // AI Tool Warning
  const { showWarning, hasAgreed, isChecking: isCheckingAgreement, handleAgree, handleDisagree } = useAIToolWarning()
  
  const handleCustomDisagree = () => {
    handleDisagree()
    router.push('/')
  }

  const [emailAddress, setEmailAddress] = useState('')
  const [result, setResult] = useState<CheckResult | null>(null)
  const [checkType, setCheckType] = useState<CheckType>('not-checked')
  const [isMobile, setIsMobile] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Device detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      const smallScreen = window.innerWidth < 768
      setIsMobile(mobile || smallScreen)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Rule-based check
  const checkEmailSafety = (email: string): CheckResult => {
    const issues: RiskIssue[] = []
    let safetyScore = 100

    const domain = email.toLowerCase().split('@')[1] || ''
    const domainName = domain.split('.')[0]
    const tld = '.' + domain.split('.').slice(1).join('.')

    // Check 1: Typosquatting
    TYPOSQUAT_PATTERNS.forEach(pattern => {
      if (pattern.patterns.some(p => domainName.includes(p))) {
        issues.push({
          type: 'typosquatting',
          severity: 'high',
          message: 'Domain looks like a well-known brand',
          detail: `Resembles "${pattern.legit}" but uses character substitution (common phishing tactic)`
        })
        safetyScore -= 40
      }
    })

    // Check 2: Dangerous TLD
    if (DANGEROUS_TLDS.some(d => tld === d || tld.endsWith(d))) {
      issues.push({
        type: 'dangerous-tld',
        severity: 'high',
        message: 'High-risk domain extension',
        detail: `${tld} domains are frequently used in phishing campaigns`
      })
      safetyScore -= 30
    }

    // Check 3: Suspicious patterns
    if (domainName.includes('secure') || domainName.includes('verify') || domainName.includes('account')) {
      issues.push({
        type: 'suspicious-keywords',
        severity: 'medium',
        message: 'Suspicious keywords in domain',
        detail: 'Words like "secure", "verify", "account" are red flags when not from official sources'
      })
      safetyScore -= 20
    }

    // Check 4: Multiple hyphens or numbers
    const hyphenCount = (domainName.match(/-/g) || []).length
    const numberCount = (domainName.match(/[0-9]/g) || []).length
    if (hyphenCount > 1 || numberCount > 2) {
      issues.push({
        type: 'unusual-characters',
        severity: 'medium',
        message: 'Unusual domain structure',
        detail: 'Excessive hyphens or numbers often indicate suspicious domains'
      })
      safetyScore -= 15
    }

    // Check 5: Free email from business
    if (FREE_EMAIL_PROVIDERS.includes(domain)) {
      const localPart = email.split('@')[0].toLowerCase()
      if (localPart.includes('support') || localPart.includes('admin') || localPart.includes('service')) {
        issues.push({
          type: 'free-email-business',
          severity: 'medium',
          message: 'Business claims to use free email',
          detail: 'Legitimate companies rarely use free email services for official communication'
        })
        safetyScore -= 25
      }
    }

    // Check 6: Known legitimate domain
    const isLegitimate = LEGITIMATE_DOMAINS.includes(domain)
    if (isLegitimate && issues.length === 0) {
      issues.push({
        type: 'verified-safe',
        severity: 'low',
        message: 'Recognized legitimate domain',
        detail: 'This domain belongs to a well-known, trusted service'
      })
    }

    // Determine risk level and if AI is needed
    let riskLevel: RiskLevel = 'safe'
    let recommendation = ''
    let needsAI = false

    if (safetyScore >= 80) {
      riskLevel = 'safe'
      recommendation = 'This email address appears safe. However, always verify the content before clicking links.'
    } else if (safetyScore >= 50) {
      riskLevel = 'caution'
      recommendation = 'Exercise caution. Verify the sender through another channel before responding or clicking links.'
      needsAI = true // Grey zone - needs AI analysis
    } else {
      riskLevel = 'danger'
      recommendation = 'High risk detected! Do NOT click any links or provide information. Delete this email immediately.'
    }

    return {
      riskLevel,
      issues,
      recommendation,
      safetyScore: Math.max(0, safetyScore),
      method: 'rules',
      needsAI
    }
  }

  // AI-powered deep analysis
  const performAIAnalysis = async (email: string): Promise<CheckResult> => {
    try {
      const response = await fetch('/api/spam-email-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailAddress: email })
      })

      if (!response.ok) {
        throw new Error('AI analysis failed')
      }

      const data = await response.json()
      return {
        ...data,
        method: 'ai'
      }
    } catch (error) {
      console.error('AI analysis error:', error)
      // Fallback to rules-based result
      return {
        ...checkEmailSafety(email),
        method: 'rules'
      }
    }
  }

  const handleCheck = async () => {
    if (!emailAddress.trim()) return
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailAddress)) {
      setResult({
        riskLevel: 'danger',
        issues: [{
          type: 'invalid-format',
          severity: 'high',
          message: 'Invalid email format',
          detail: 'Please enter a valid email address (e.g., sender@example.com)'
        }],
        recommendation: 'Check the email address format and try again.',
        safetyScore: 0,
        method: 'rules'
      })
      setCheckType('email-address')
      return
    }

    setIsAnalyzing(true)

    // Step 1: Rules-based check
    const rulesResult = checkEmailSafety(emailAddress)

    // Step 2: If grey zone and AI agreed, perform AI analysis
    if (rulesResult.needsAI && hasAgreed) {
      const aiResult = await performAIAnalysis(emailAddress)
      setResult(aiResult)
    } else {
      setResult(rulesResult)
    }

    setIsAnalyzing(false)
    setCheckType('email-address')
  }

  const handleClear = () => {
    setEmailAddress('')
    setResult(null)
    setCheckType('not-checked')
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setEmailAddress(text)
    } catch (err) {
      console.error('Failed to read clipboard')
    }
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy')
    }
  }

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'safe': return 'text-green-400'
      case 'caution': return 'text-yellow-400'
      case 'danger': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getRiskBgColor = (level: RiskLevel) => {
    switch (level) {
      case 'safe': return 'bg-green-500/10 border-green-500/20'
      case 'caution': return 'bg-yellow-500/10 border-yellow-500/20'
      case 'danger': return 'bg-red-500/10 border-red-500/20'
      default: return 'bg-white/5 border-white/10'
    }
  }

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case 'safe': return <CheckCircle className="w-6 h-6" />
      case 'caution': return <AlertTriangle className="w-6 h-6" />
      case 'danger': return <AlertCircle className="w-6 h-6" />
      default: return <Shield className="w-6 h-6" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  // ✅ AI Tool Warning - Loading state
  if (isCheckingAgreement) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="mt-6 text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* AI Tool Warning Modal */}
      <AIToolWarningModal
        isOpen={showWarning}
        onAgree={handleAgree}
        onDisagree={handleCustomDisagree}
      />

      {/* Agreement Required Screen */}
      {!hasAgreed ? (
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <AlertTriangle className="w-16 h-16 text-yellow-400 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Agreement Required</h2>
            <p className="text-gray-400 mb-8 max-w-md">
              You must agree to the terms to use AI-powered deep analysis.
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all font-semibold shadow-lg"
            >
              Return to Home
            </button>
          </div>
        </div>
      ) : (
        /* Main Content */
        <div className="container mx-auto px-4 py-6 max-w-2xl">

          {/* AI Badge */}
          <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-start gap-2">
            <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-purple-300 font-medium">AI-Powered Deep Analysis Available</p>
              <p className="text-purple-400/70 text-xs mt-1">
                Grey-zone emails get extra AI scrutiny for maximum safety
              </p>
            </div>
          </div>

          <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-start gap-2">
  <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
  <div className="text-sm">
    <p className="text-orange-300 font-medium">⚠️ Privacy Notice</p>
    <p className="text-orange-400/70 text-xs mt-1">
      This tool checks <strong>suspicious sender addresses</strong>. If checking a real person's email, ensure you have their consent. Addresses may be sent to AI for analysis.
    </p>
  </div>
</div>

          {/* Input Section */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-cyan-400" />
              <h2 className="text-white font-medium">Check Email Address</h2>
            </div>

            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
                placeholder="sender@example.com"
                className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white 
                         placeholder-gray-500 focus:outline-none focus:border-cyan-400 
                         transition-colors font-mono text-sm"
                spellCheck={false}
                disabled={isAnalyzing}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                onClick={handlePaste}
                disabled={isAnalyzing}
                className="flex-1 px-4 py-3 bg-white/5 text-gray-300 rounded-lg text-sm
                         hover:bg-white/10 transition-all font-medium flex items-center justify-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Copy className="w-4 h-4" />
                Paste
              </button>
              <button
                onClick={handleClear}
                disabled={isAnalyzing}
                className="flex-1 px-4 py-3 bg-white/5 text-gray-300 rounded-lg text-sm
                         hover:bg-white/10 transition-all font-medium
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear
              </button>
              <button
                onClick={handleCheck}
                disabled={!emailAddress.trim() || isAnalyzing}
                className="flex-1 sm:flex-[2] px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white 
                         rounded-xl font-medium hover:opacity-90 transition-all 
                         flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-sm">Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span className="text-base">Check Now</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result Section */}
          {result && (
            <div className={`rounded-2xl border p-4 sm:p-6 mb-6 ${getRiskBgColor(result.riskLevel)}`}>
              {/* Risk Level Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={getRiskColor(result.riskLevel)}>
                  {getRiskIcon(result.riskLevel)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-lg font-bold ${getRiskColor(result.riskLevel)} uppercase`}>
                      {result.riskLevel === 'safe' && '✓ SAFE'}
                      {result.riskLevel === 'caution' && '⚠ CAUTION'}
                      {result.riskLevel === 'danger' && '⛔ DANGER'}
                    </h3>
                    {result.method === 'ai' && (
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    Safety Score: {result.safetyScore}/100
                    {result.method === 'ai' && ' • Enhanced by AI'}
                  </p>
                </div>
              </div>

              {/* Issues Found */}
              {result.issues.length > 0 && (
                <div className="space-y-3 mb-4">
                  <p className="text-sm text-gray-300 font-medium">
                    {result.issues.length} issue{result.issues.length > 1 ? 's' : ''} detected:
                  </p>
                  {result.issues.map((issue, index) => (
                    <div key={index} className="bg-black/20 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <span className={`text-lg ${getSeverityColor(issue.severity)}`}>
                          {issue.severity === 'high' && '❌'}
                          {issue.severity === 'medium' && '⚠️'}
                          {issue.severity === 'low' && '✅'}
                        </span>
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm">{issue.message}</p>
                          <p className="text-gray-400 text-xs mt-1">{issue.detail}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recommendation */}
              <div className="bg-black/20 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-cyan-400 font-medium text-sm mb-1">Recommendation:</p>
                    <p className="text-gray-300 text-sm">{result.recommendation}</p>
                  </div>
                </div>
              </div>

              {/* Additional warning for caution/safe */}
              {(result.riskLevel === 'caution' || result.riskLevel === 'safe') && (
                <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-yellow-400 font-medium mb-2">⚠️ Before Opening This Email:</p>
                      <ul className="text-gray-300 space-y-1 text-xs">
                        <li>• Check the email content carefully</li>
                        <li>• Don't click any links immediately</li>
                        <li>• Verify sender through another channel if asking for action</li>
                        <li>• When in doubt, contact the company directly</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Copy Email Button */}
              {emailAddress && (
                <button
                  onClick={handleCopyEmail}
                  className="w-full mt-4 px-4 py-2 bg-white/5 text-gray-300 rounded-lg text-sm
                           hover:bg-white/10 transition-all font-medium flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy Email Address'}
                </button>
              )}
            </div>
          )}

          {/* Empty State */}
          {!result && (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
              <Shield className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Enter an email address to check</p>
              <p className="text-gray-500 text-sm mt-1">We'll analyze it for safety</p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-6 p-3 bg-gray-500/10 border border-gray-500/20 rounded-lg">
            <p className="text-gray-400 text-xs text-center">
              ⚠️ <strong>Disclaimer:</strong> This analysis does not guarantee 100% safety. Always exercise caution with suspicious emails.
            </p>
          </div>
        </div>
      )}
    </>
  )
}