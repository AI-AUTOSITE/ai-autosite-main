// scripts/migrate-dev-tools.js
const fs = require('fs');
const path = require('path');

const TOOL_MAPPINGS = {
  'text-case': 'text-case-converter',
  'test-file-generator': 'test-file-generator-guide',
  'test-image-generator': 'test-image-generator-guide',
  'network-checker': 'network-checker-guide',
  'pdf-test-generator': 'pdf-test-generator-guide',
  'test-text-generator': 'test-text-generator-guide',
  'base64': 'base64-guide',
  'ai-project-visualizer': 'ai-project-visualizer-guide',
  'markdown-html': 'markdown-guide',
  'code-roaster': ['code-roaster-guide', 'how-to-use-code-roaster'], // 2記事
  'json-format': 'json-beautify-guide',
  'json-csv': 'json-csv-converter-guide',
  'favicon-generator': 'favicon-generator-guide',
  'lorem-ipsum': 'lorem-ipsum-generator-guide',
  'uuid-generator': 'uuid-generator-guide',
  'code-dependency-visualizer': 'code-dependency-analysis',
  'stack-recommender': 'ai-stack-recommender-guide',
  'tech-stack-analyzer': 'choosing-the-right-tech-stack',
};

async function createBlogTemplates() {
  console.log('🚀 Creating blog-post.ts templates for dev-tools...\n');

  let created = 0;
  let skipped = 0;
  let notFound = 0;

  for (const [toolName, blogIds] of Object.entries(TOOL_MAPPINGS)) {
    const toolPath = path.join(process.cwd(), 'app/tools', toolName);
    
    // ツールフォルダが存在するか確認
    if (!fs.existsSync(toolPath)) {
      console.log(`⚠️  Tool folder not found: ${toolName}`);
      notFound++;
      continue;
    }

    // 既に blog-post.ts がある場合はスキップ
    const blogPostPath = path.join(toolPath, 'blog-post.ts');
    if (fs.existsSync(blogPostPath)) {
      console.log(`⏭️  Skipping ${toolName} (blog-post.ts already exists)`);
      skipped++;
      continue;
    }

    // 変数名を生成（キャメルケース）
    const varName = toolName
      .split('-')
      .map((word, index) => 
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join('') + 'Post';

    // テンプレート作成
    const template = `// app/tools/${toolName}/blog-post.ts
import { FileText } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const ${varName}: BlogPost = {
  // TODO: Copy from dev-tools.ts
}
`;

    fs.writeFileSync(blogPostPath, template);
    console.log(`✅ Created: ${toolName}/blog-post.ts`);
    created++;
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✨ Template creation complete!`);
  console.log(`📊 Summary:`);
  console.log(`   ✅ Created: ${created}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ⚠️  Not found: ${notFound}`);
  console.log('='.repeat(50));
  console.log('\n📝 Next step: Copy blog data from dev-tools.ts to each blog-post.ts');
}

createBlogTemplates().catch(console.error);