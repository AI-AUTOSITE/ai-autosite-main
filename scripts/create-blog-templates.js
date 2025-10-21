// scripts/create-blog-templates.js
const fs = require('fs');
const path = require('path');

const TOOLS = [
  'pdf-tools',
  'spam-email-checker', 
  'bmi-calculator',
  'percentage-calculator',
  'twitter-counter',
  'countdown-timer',
  'unit-converter',
  'color-palette',
  'password-generator',
  'image-compress',
  'text-counter',
  'image-grid-maker',
  'image-splitter',
  'pc-optimizer',
  'token-compressor',
  'qr-code',
  'blurtap',
  'pdf-to-data',
];

TOOLS.forEach(toolName => {
  const toolPath = path.join(process.cwd(), 'app/tools', toolName);
  const blogPostPath = path.join(toolPath, 'blog-post.ts');
  
  if (fs.existsSync(toolPath)) {
    // 空のテンプレートを作成
    const template = `// app/tools/${toolName}/blog-post.ts
import { FileText } from 'lucide-react'
import type { BlogPost } from '@/app/lib/blog-posts/types'

export const ${toolName.replace(/-./g, x => x[1].toUpperCase())}Post: BlogPost = {
  // TODO: Copy from quick-tools.ts
}
`;
    
    fs.writeFileSync(blogPostPath, template);
    console.log(`✅ Created template for ${toolName}`);
  } else {
    console.log(`⚠️  Skipped ${toolName} (folder not found)`);
  }
});

console.log('\n✨ All templates created!');