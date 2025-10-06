//npm run check-tools
// scripts/check-tools-diff.js
const fs = require('fs')
const path = require('path')

// フォルダー一覧を取得
const toolsDir = path.join(process.cwd(), 'app/tools')
const folders = fs
  .readdirSync(toolsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)

// layout.tsxを読み込んで解析（簡易版）
const layoutPath = path.join(toolsDir, 'layout.tsx')
const layoutContent = fs.readFileSync(layoutPath, 'utf8')

// '/tools/xxx' のパターンを抽出
const layoutTools = [...layoutContent.matchAll(/\/tools\/([a-z-]+)/g)]
  .map((match) => match[1])
  .filter(Boolean)
  .filter((v, i, a) => a.indexOf(v) === i) // 重複削除

// 差分を計算
const notInLayout = folders.filter((f) => !layoutTools.includes(f))
const notInFolder = layoutTools.filter((l) => !folders.includes(l))

console.log('📊 Tools Diff Report\n' + '='.repeat(50))
console.log(`Total folders: ${folders.length}`)
console.log(`Total in layout: ${layoutTools.length}`)
console.log('')

if (notInLayout.length > 0) {
  console.log('❌ Folders NOT in layout.tsx:')
  notInLayout.forEach((f) => console.log(`  - ${f}`))
} else {
  console.log('✅ All folders are in layout.tsx')
}

console.log('')

if (notInFolder.length > 0) {
  console.log('⚠️ In layout.tsx but NOT in folders:')
  notInFolder.forEach((f) => console.log(`  - ${f}`))
} else {
  console.log('✅ All layout entries have folders')
}
