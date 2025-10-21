// scripts/migrate-remaining-blogs.js
const fs = require('fs');
const path = require('path');

// 全カテゴリーのマッピング
const ALL_MAPPINGS = {
  // Business Tools
  'competitive-analyzer': { blog: 'competitive-analyzer-guide', category: 'business' },
  'whatsapp-link': { blog: 'whatsapp-link-generator-guide', category: 'business' },
  'hashtag-generator': { blog: 'hashtag-generator-guide', category: 'business' },
  'ai-prompt-generator': { blog: 'ai-prompt-generator-guide', category: 'business' },
  'ai-resume': { blog: 'ai-resume-guide', category: 'business' },
  
  // Creative Tools
  'instagram-bio': { blog: 'instagram-bio-guide', category: 'creative' },
  'youtube-thumbnail': { blog: 'youtube-thumbnail-guide', category: 'creative' },
  'gradient-generator': { blog: 'gradient-generator-guide', category: 'creative' },
  
  // Study Tools
  'debate-trainer': { blog: 'debate-trainer-guide', category: 'study' },
  'ai-summarizer': { blog: 'ai-summarizer-guide', category: 'study' },
  'pdf-summarizer': { blog: 'pdf-summarizer-guide', category: 'study' },
  'haiku-generator': { blog: 'haiku-generator-guide', category: 'study' },
  'japanese-ocr': { blog: 'japanese-ocr-guide', category: 'study' },
  'cornell-note': { blog: 'cornell-note-guide', category: 'study' },
  
  // Learning Hub
  'ai-dev-dictionary': { blog: 'ai-dev-dictionary', category: 'learning' },
};

async function createAllBlogTemplates() {
  console.log('🚀 Creating blog-post.ts templates for all remaining tools...\n');

  let created = 0;
  let skipped = 0;
  let notFound = 0;
  const results = {
    business: [],
    creative: [],
    study: [],
    learning: []
  };

  for (const [toolName, config] of Object.entries(ALL_MAPPINGS)) {
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
  // TODO: Copy from ${config.category}-tools.ts
}
`;

    fs.writeFileSync(blogPostPath, template);
    console.log(`✅ Created: ${toolName}/blog-post.ts (${config.category})`);
    created++;
    results[config.category].push({ toolName, varName, blogId: config.blog });
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✨ Template creation complete!`);
  console.log(`📊 Summary:`);
  console.log(`   ✅ Created: ${created}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ⚠️  Not found: ${notFound}`);
  console.log('='.repeat(60));
  
  // カテゴリー別サマリー
  console.log('\n📋 Category Summary:');
  for (const [category, items] of Object.entries(results)) {
    if (items.length > 0) {
      console.log(`\n  ${category.toUpperCase()}:`);
      items.forEach(item => {
        console.log(`    - ${item.toolName} → ${item.varName}`);
      });
    }
  }
  
  console.log('\n📝 Next step: Copy blog data from category files to each blog-post.ts');
  console.log('   business-tools.ts → 5 tools');
  console.log('   creative-tools.ts → 3 tools');
  console.log('   study-tools.ts → 6 tools');
  console.log('   learning.ts → 1 tool');
}

createAllBlogTemplates().catch(console.error);
