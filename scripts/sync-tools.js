// scripts/sync-tools.js
//node scripts/sync-tools.js
const fs = require('fs')
const path = require('path')

// フォルダ一覧を取得
const toolsDir = path.join(process.cwd(), 'app/tools')
const folders = fs
  .readdirSync(toolsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .filter((d) => !d.name.startsWith('[')) // d.name でアクセス
  .map((d) => d.name)

// layout.tsx用のエントリーを生成
const entries = folders.map((folder) => {
  const title = folder
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return `    '/tools/${folder}': '${title}',`
})

console.log('Add these to layout.tsx:')
console.log(entries.join('\n'))

// 追加情報も表示
console.log('\n-------------------')
console.log(`Total tools found: ${folders.length}`)
console.log('\nFolders list:')
console.log(folders.join(', '))
