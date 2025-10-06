const fs = require('fs')
const path = require('path')

// 44個のツールリスト（sitemap.tsより）
const tools = [
  'age-calculator',
  'ai-dev-dictionary',
  'ai-project-visualizer',
  'ai-prompt-generator',
  'ai-resume',
  'ai-summarizer',
  'base64',
  'blurtap',
  'bmi-calculator',
  'code-dependency-visualizer',
  'code-roaster',
  'color-palette',
  'competitive-analyzer',
  'countdown-timer',
  'debate-trainer',
  'favicon-generator',
  'gradient-generator',
  'hashtag-generator',
  'image-compress',
  'image-grid-maker',
  'image-splitter',
  'instagram-bio',
  'japanese-ocr',
  'json-csv',
  'json-format',
  'lorem-ipsum',
  'markdown-html',
  'password-generator',
  'pc-optimizer',
  'pdf-summarizer',
  'pdf-to-data',
  'pdf-tools',
  'percentage-calculator',
  'qr-code',
  'stack-recommender',
  'tech-stack-analyzer',
  'text-case',
  'text-counter',
  'token-compressor',
  'twitter-counter',
  'unit-converter',
  'uuid-generator',
  'whatsapp-link',
  'youtube-thumbnail',
]

const baseUrl = 'https://ai-autosite.com'
const toolsDir = path.join(process.cwd(), 'app', 'tools')

let successCount = 0
let skipCount = 0
let errorCount = 0

console.log('🚀 Starting SEO metadata addition...\n')

tools.forEach((toolId) => {
  const pagePath = path.join(toolsDir, toolId, 'page.tsx')

  // ファイル存在チェック
  if (!fs.existsSync(pagePath)) {
    console.log(`⚠️  SKIP: ${toolId} (file not found)`)
    skipCount++
    return
  }

  try {
    let content = fs.readFileSync(pagePath, 'utf-8')

    // 既にrobots/alternatesが存在するかチェック
    if (content.includes('robots:') && content.includes('alternates:')) {
      console.log(`✓ SKIP: ${toolId} (already has SEO metadata)`)
      skipCount++
      return
    }

    // metadataオブジェクトの終わり（最後の閉じ括弧）を見つける
    // export const metadata: Metadata = { ... } の構造を想定

    const metadataMatch = content.match(/export const metadata: Metadata = \{[\s\S]*?\n\}/)

    if (!metadataMatch) {
      console.log(`❌ ERROR: ${toolId} (metadata object not found)`)
      errorCount++
      return
    }

    const originalMetadata = metadataMatch[0]

    // 既存のメタデータに robots と alternates を追加
    const seoMetadata = `  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: '${baseUrl}/tools/${toolId}'
  }`

    // メタデータオブジェクトの最後の } の前に挿入
    const newMetadata = originalMetadata.replace(/(\n\})$/, `,\n${seoMetadata}\n}`)

    // コンテンツを置換
    const newContent = content.replace(originalMetadata, newMetadata)

    // ファイルに書き込み
    fs.writeFileSync(pagePath, newContent, 'utf-8')

    console.log(`✅ SUCCESS: ${toolId}`)
    successCount++
  } catch (error) {
    console.log(`❌ ERROR: ${toolId} - ${error.message}`)
    errorCount++
  }
})

console.log('\n' + '='.repeat(50))
console.log('📊 Summary:')
console.log(`  ✅ Success: ${successCount}`)
console.log(`  ⚠️  Skipped: ${skipCount}`)
console.log(`  ❌ Errors: ${errorCount}`)
console.log(`  📁 Total: ${tools.length}`)
console.log('='.repeat(50))

if (successCount > 0) {
  console.log('\n✨ Metadata addition complete!')
  console.log('💡 Please review the changes and test your build.')
}

if (errorCount > 0) {
  console.log('\n⚠️  Some files had errors. Please check them manually.')
}
