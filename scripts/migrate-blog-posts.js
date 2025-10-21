// scripts/migrate-blog-posts.js
const fs = require('fs');
const path = require('path');

// ツール名とブログIDのマッピング
const TOOL_MAPPINGS = {
  'pdf-tools': 'pdf-tools-guide',
  'spam-email-checker': 'spam-email-checker-guide',
  'bmi-calculator': 'bmi-calculator-guide',
  'percentage-calculator': 'percentage-calculator-guide',
  'twitter-counter': 'twitter-counter-guide',
  'countdown-timer': 'countdown-timer-guide',
  'unit-converter': 'unit-converter-guide',
  'color-palette': 'color-palette-guide',
  'password-generator': 'password-generator-guide',
  'image-compress': 'image-compress-guide',
  'text-counter': 'text-counter-guide',
  'image-grid-maker': 'image-grid-maker-guide',
  'image-splitter': 'image-splitter-guide',
  'pc-optimizer': 'pc-optimizer-guide',
  'token-compressor': 'token-compressor-guide',
  'qr-code': 'qr-code-guide',
  'blurtap': 'blurtap-guide',
  'pdf-to-data': 'pdf-to-data-guide',
  'privacy-in-development': null, // ツールなし（記事のみ）
};

// age-calculator は既に完了しているのでスキップ
const SKIP_TOOLS = ['age-calculator'];

async function migrateBlogPosts() {
  console.log('🚀 Starting blog post migration...\n');

  const quickToolsPath = path.join(process.cwd(), 'app/lib/blog-posts/quick-tools.ts');
  const quickToolsContent = fs.readFileSync(quickToolsPath, 'utf-8');

  let importStatements = [];
  let exportNames = [];
  let updatedContent = quickToolsContent;

  for (const [toolName, blogId] of Object.entries(TOOL_MAPPINGS)) {
    if (!blogId || SKIP_TOOLS.includes(toolName)) {
      console.log(`⏭️  Skipping ${toolName}`);
      continue;
    }

    const toolPath = path.join(process.cwd(), 'app/tools', toolName);
    
    // ツールフォルダが存在するか確認
    if (!fs.existsSync(toolPath)) {
      console.log(`⚠️  Tool folder not found: ${toolName}`);
      continue;
    }

    console.log(`📝 Processing ${toolName}...`);

    // 記事データを抽出
    const blogPostRegex = new RegExp(
      `{[\\s\\S]*?id:\\s*'${blogId}'[\\s\\S]*?},(?=\\s*(?:{|\\]))`
    );
    const match = quickToolsContent.match(blogPostRegex);

    if (!match) {
      console.log(`   ❌ Blog post not found for ${blogId}`);
      continue;
    }

    const blogPostData = match[0].slice(0, -1); // 最後のカンマを削除

    // icon を抽出
    const iconMatch = blogPostData.match(/icon:\s*(\w+),/);
    const iconName = iconMatch ? iconMatch[1] : 'FileText';

    // 変数名を生成（キャメルケース）
    const varName = toolName
      .split('-')
      .map((word, index) => 
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join('') + 'Post';

    // blog-post.ts ファイルを作成
    const blogPostPath = path.join(toolPath, 'blog-post.ts');
    const blogPostContent = `// app/tools/${toolName}/blog-post.ts
import { ${iconName} } from 'lucide-react'
import type { BlogPost } from '@/app/lib/blog-posts/types'

export const ${varName}: BlogPost = ${blogPostData}
`;

    fs.writeFileSync(blogPostPath, blogPostContent);
    console.log(`   ✅ Created blog-post.ts`);

    // インポート文を生成
    importStatements.push(`import { ${varName} } from '@/app/tools/${toolName}/blog-post'`);
    exportNames.push(varName);
  }

  console.log('\n📝 Updating quick-tools.ts...');

  // quick-tools.ts を更新
  // 既存の age-calculator のインポートを見つける
  const ageCalcImportIndex = updatedContent.indexOf("import { ageCalculatorPost }");
  
  if (ageCalcImportIndex !== -1) {
    // age-calculator のインポートの後に新しいインポートを追加
    const insertPosition = updatedContent.indexOf('\n', ageCalcImportIndex) + 1;
    const newImports = importStatements.join('\n') + '\n';
    updatedContent = 
      updatedContent.slice(0, insertPosition) +
      newImports +
      updatedContent.slice(insertPosition);
  }

  // 各記事データを変数名に置き換え
  for (const [toolName, blogId] of Object.entries(TOOL_MAPPINGS)) {
    if (!blogId || SKIP_TOOLS.includes(toolName)) continue;

    const varName = toolName
      .split('-')
      .map((word, index) => 
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join('') + 'Post';

    const blogPostRegex = new RegExp(
      `{[\\s\\S]*?id:\\s*'${blogId}'[\\s\\S]*?},`
    );
    
    updatedContent = updatedContent.replace(blogPostRegex, `${varName},`);
  }

  // 保存
  fs.writeFileSync(quickToolsPath, updatedContent);
  console.log('   ✅ Updated quick-tools.ts with imports\n');

  console.log('✨ Migration complete!');
  console.log(`📊 Created ${importStatements.length} blog post files`);
}

migrateBlogPosts().catch(console.error);