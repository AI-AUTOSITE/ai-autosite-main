// lib/privacy-analyzer.ts
// Privacy Policy TL;DR - Enhanced Analyzer with ToS;DR Data
// =========================================================

// JSONファイルを型安全にインポート
// tsconfig.jsonで "resolveJsonModule": true が必要
import patternsData from '../../app/lib/privacy-patterns.json'

// ========================================
// 型定義
// ========================================

/**
 * 単一のプライバシーパターン
 */
export interface PatternEntry {
  id: string
  title: string
  summary: string
  score: number
  categories: string[]
  services?: string[]
}

/**
 * カテゴリ情報
 */
export interface CategoryInfo {
  name: string
  name_ja: string
  description: string
  count: number
}

/**
 * パターンデータ全体の構造
 */
export interface PatternsData {
  metadata: {
    source: string
    source_url?: string
    license: string
    total_points: number
    total_services?: number
    extracted_at: string
  }
  categories: Record<string, CategoryInfo>
  patterns: {
    critical: PatternEntry[]
    bad: PatternEntry[]
    warning: PatternEntry[]
    neutral: PatternEntry[]
    good: PatternEntry[]
  }
  keywords: {
    negative: Array<{ word: string; score: number }>
    positive: Array<{ word: string; score: number }>
  }
  services_reference?: Record<string, {
    name: string
    rating: string
    url: string
  }>
}

export type Grade = 'A' | 'B' | 'C' | 'D' | 'E'
export type Severity = 'critical' | 'bad' | 'warning' | 'neutral' | 'good'

/**
 * 発見事項
 */
export interface Finding {
  id: string
  title: string
  summary: string
  severity: Severity
  score: number
  category: string
  matchedText?: string
}

/**
 * カテゴリ別の結果
 */
export interface CategoryResult {
  id: string
  name: string
  name_ja: string
  score: number
  grade: Grade
  findings: Finding[]
}

/**
 * 分析結果
 */
export interface AnalysisResult {
  overallScore: number
  grade: Grade
  summary: string
  summary_ja: string
  totalFindings: number
  findings: {
    critical: Finding[]
    bad: Finding[]
    warning: Finding[]
    good: Finding[]
  }
  categories: CategoryResult[]
  keywordsFound: {
    negative: string[]
    positive: string[]
  }
  attribution: string
}

// ========================================
// パターンデータの読み込み
// ========================================
const patterns: PatternsData = patternsData as PatternsData

// ========================================
// ユーティリティ関数
// ========================================

/**
 * テキストを正規化（小文字化、余分な空白を削除）
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * パターンがテキストにマッチするかチェック
 */
function matchPattern(text: string, pattern: PatternEntry): { matched: boolean; context?: string } {
  const normalizedText = normalizeText(text)
  
  // タイトルからキーワードを抽出
  const titleWords = pattern.title.toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 3)
    .filter(w => !['your', 'they', 'will', 'with', 'that', 'this', 'from', 'have'].includes(w))
  
  if (titleWords.length === 0) return { matched: false }
  
  // キーワードの何%がマッチするか
  const matchedWords = titleWords.filter(word => normalizedText.includes(word))
  const matchRatio = matchedWords.length / titleWords.length
  
  // 50%以上マッチでヒット
  if (matchRatio >= 0.5) {
    // マッチしたコンテキストを抽出
    const firstMatch = matchedWords[0]
    const index = normalizedText.indexOf(firstMatch)
    const start = Math.max(0, index - 50)
    const end = Math.min(normalizedText.length, index + 100)
    const context = '...' + text.slice(start, end).trim() + '...'
    
    return { matched: true, context }
  }
  
  return { matched: false }
}

/**
 * スコアからグレードに変換
 */
function scoreToGrade(score: number): Grade {
  if (score >= 80) return 'A'
  if (score >= 60) return 'B'
  if (score >= 40) return 'C'
  if (score >= 20) return 'D'
  return 'E'
}

/**
 * グレードの説明を取得
 */
function getGradeSummary(grade: Grade): { en: string; ja: string } {
  const summaries: Record<Grade, { en: string; ja: string }> = {
    'A': {
      en: 'Excellent privacy practices. This service respects user privacy.',
      ja: '優れたプライバシー保護。このサービスはユーザーのプライバシーを尊重しています。'
    },
    'B': {
      en: 'Good privacy practices with minor concerns.',
      ja: '良好なプライバシー保護。軽微な懸念事項があります。'
    },
    'C': {
      en: 'Average privacy practices. Some areas need improvement.',
      ja: '平均的なプライバシー保護。改善が必要な箇所があります。'
    },
    'D': {
      en: 'Poor privacy practices. Significant concerns identified.',
      ja: 'プライバシー保護が不十分。重大な懸念事項があります。'
    },
    'E': {
      en: 'Very poor privacy practices. Major issues found.',
      ja: 'プライバシー保護が非常に不十分。重大な問題があります。'
    }
  }
  return summaries[grade]
}

// ========================================
// メイン分析関数
// ========================================

/**
 * プライバシーポリシーを分析する
 */
export function analyzePrivacyPolicy(policyText: string): AnalysisResult {
  const normalizedText = normalizeText(policyText)
  
  // 発見事項を収集
  const findings: AnalysisResult['findings'] = {
    critical: [],
    bad: [],
    warning: [],
    good: []
  }
  
  // 各パターンをチェック
  const severityKeys: Array<keyof typeof patterns.patterns> = ['critical', 'bad', 'warning', 'good']
  
  for (const severityKey of severityKeys) {
    if (severityKey === 'neutral') continue // 中立はスキップ
    
    const patternList = patterns.patterns[severityKey] || []
    
    for (const pattern of patternList) {
      const match = matchPattern(policyText, pattern)
      if (match.matched) {
        const finding: Finding = {
          id: pattern.id,
          title: pattern.title,
          summary: pattern.summary,
          severity: severityKey as Severity,
          score: pattern.score,
          category: pattern.categories[0] || 'other',
          matchedText: match.context
        }
        
        if (severityKey in findings) {
          findings[severityKey as keyof typeof findings].push(finding)
        }
      }
    }
  }
  
  // キーワード検索
  const keywordsFound = {
    negative: [] as string[],
    positive: [] as string[]
  }
  
  const negativeKeywords = patterns.keywords?.negative || []
  const positiveKeywords = patterns.keywords?.positive || []
  
  for (const kw of negativeKeywords.slice(0, 30)) {
    if (normalizedText.includes(kw.word)) {
      keywordsFound.negative.push(kw.word)
    }
  }
  
  for (const kw of positiveKeywords.slice(0, 30)) {
    if (normalizedText.includes(kw.word)) {
      keywordsFound.positive.push(kw.word)
    }
  }
  
  // スコア計算
  let score = 70 // ベーススコア
  
  score -= findings.critical.length * 15
  score -= findings.bad.length * 8
  score -= findings.warning.length * 3
  score += findings.good.length * 5
  
  // キーワードによる調整
  score -= keywordsFound.negative.length * 2
  score += keywordsFound.positive.length * 2
  
  // 範囲を0-100に制限
  score = Math.max(0, Math.min(100, score))
  
  const grade = scoreToGrade(score)
  const gradeSummary = getGradeSummary(grade)
  
  // カテゴリ別の結果
  const categoryResults: CategoryResult[] = []
  
  for (const [catId, catInfo] of Object.entries(patterns.categories)) {
    const catFindings = [
      ...findings.critical,
      ...findings.bad,
      ...findings.warning,
      ...findings.good
    ].filter(f => f.category === catId)
    
    if (catFindings.length > 0) {
      let catScore = 70
      catFindings.forEach(f => {
        if (f.severity === 'critical') catScore -= 20
        if (f.severity === 'bad') catScore -= 10
        if (f.severity === 'warning') catScore -= 5
        if (f.severity === 'good') catScore += 10
      })
      catScore = Math.max(0, Math.min(100, catScore))
      
      categoryResults.push({
        id: catId,
        name: catInfo.name,
        name_ja: catInfo.name_ja,
        score: catScore,
        grade: scoreToGrade(catScore),
        findings: catFindings
      })
    }
  }
  
  // カテゴリをスコア順にソート（低い順）
  categoryResults.sort((a, b) => a.score - b.score)
  
  return {
    overallScore: score,
    grade,
    summary: gradeSummary.en,
    summary_ja: gradeSummary.ja,
    totalFindings: findings.critical.length + findings.bad.length + findings.warning.length + findings.good.length,
    findings,
    categories: categoryResults,
    keywordsFound,
    attribution: `Data provided by ${patterns.metadata?.source || 'ToS;DR'} under ${patterns.metadata?.license || 'CC BY-SA 3.0'}`
  }
}

// ========================================
// ヘルパー関数のエクスポート
// ========================================

/**
 * カテゴリ情報を取得
 */
export function getCategories(): Record<string, CategoryInfo> {
  return patterns.categories
}

/**
 * グレードの色を取得
 */
export function getGradeColor(grade: Grade): string {
  const colors: Record<Grade, string> = {
    'A': '#22c55e', // green
    'B': '#84cc16', // lime
    'C': '#eab308', // yellow
    'D': '#f97316', // orange
    'E': '#ef4444'  // red
  }
  return colors[grade]
}

/**
 * グレードのTailwindクラスを取得
 */
export function getGradeTailwindClasses(grade: Grade): string {
  const classes: Record<Grade, string> = {
    'A': 'bg-green-500/20 text-green-400 border-green-500/30',
    'B': 'bg-lime-500/20 text-lime-400 border-lime-500/30',
    'C': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'D': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'E': 'bg-red-500/20 text-red-400 border-red-500/30'
  }
  return classes[grade]
}

/**
 * 深刻度のTailwindクラスを取得
 */
export function getSeverityTailwindClasses(severity: Severity): string {
  const classes: Record<Severity, string> = {
    'critical': 'bg-red-500/20 text-red-400 border-red-500/30',
    'bad': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'warning': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'neutral': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    'good': 'bg-green-500/20 text-green-400 border-green-500/30'
  }
  return classes[severity]
}

/**
 * メタデータを取得
 */
export function getMetadata() {
  return patterns.metadata
}

/**
 * サービス参照データを取得
 */
export function getServicesReference() {
  return patterns.services_reference || {}
}