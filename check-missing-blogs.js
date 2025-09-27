const fs = require('fs');
const path = require('path');

// パスの設定（プロジェクトに合わせて調整してください）
const TOOLS_DIR = './app/tools';
const BLOGS_DIR = './app/blog';

// フォルダー一覧を取得
function getFolders(dirPath) {
  try {
    return fs.readdirSync(dirPath)
      .filter(item => {
        const itemPath = path.join(dirPath, item);
        return fs.statSync(itemPath).isDirectory();
      })
      .filter(name => !name.startsWith('[') && !name.startsWith('.')); // [slug]や.DS_Storeを除外
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error.message);
    return [];
  }
}

// ツール名からブログ名の可能性を生成
function getPossibleBlogNames(toolName) {
  const possibilities = [
    toolName,                          // そのまま
    `${toolName}-guide`,               // 最も一般的なパターン
    `${toolName}-generator`,           // generatorパターン
    `${toolName}-generator-guide`,     // generator-guideパターン
    `${toolName}-complete-guide`,      // complete-guideパターン
    `how-to-use-${toolName}`,         // how-to-useパターン
    toolName.replace('-tool', ''),     // -toolを除去
    toolName.replace('ai-', ''),       // ai-を除去してみる
  ];
  
  // ai-resumeの特殊ケース
  if (toolName === 'ai-resume') {
    possibilities.push('ai-resume-generator');
  }
  
  return possibilities;
}

// メイン処理
function findMissingBlogs() {
  const toolFolders = getFolders(TOOLS_DIR);
  const blogFolders = getFolders(BLOGS_DIR);
  
  console.log('📊 統計情報');
  console.log('='.repeat(50));
  console.log(`ツール数: ${toolFolders.length}`);
  console.log(`ブログ数: ${blogFolders.length}\n`);
  
  // ブログがないツールを探す
  const missingBlogs = [];
  const matchedPairs = [];
  
  toolFolders.forEach(tool => {
    const possibleNames = getPossibleBlogNames(tool);
    let foundMatch = null;
    
    // 可能な名前でマッチを探す
    for (const possibleName of possibleNames) {
      const match = blogFolders.find(blog => 
        blog === possibleName || 
        blog.includes(tool) ||
        (tool !== 'ai-dev-dictionary' && blog.includes(tool.replace('ai-', '')))
      );
      
      if (match) {
        foundMatch = match;
        break;
      }
    }
    
    if (foundMatch) {
      matchedPairs.push({ tool, blog: foundMatch });
    } else {
      missingBlogs.push(tool);
    }
  });
  
  // 結果を表示
  console.log('❌ ブログ記事がないツール');
  console.log('='.repeat(50));
  if (missingBlogs.length > 0) {
    missingBlogs.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool}`);
    });
    console.log(`\n合計: ${missingBlogs.length}個のツールにブログがありません`);
  } else {
    console.log('✅ すべてのツールにブログ記事があります！');
  }
  
  // マッチしたペアも表示（確認用）
  console.log('\n✅ マッチングできたペア');
  console.log('='.repeat(50));
  matchedPairs.forEach(({ tool, blog }) => {
    console.log(`${tool} → ${blog}`);
  });
  
  // 使われていないブログも検出
  const usedBlogs = new Set(matchedPairs.map(p => p.blog));
  const unusedBlogs = blogFolders.filter(blog => !usedBlogs.has(blog));
  
  if (unusedBlogs.length > 0) {
    console.log('\n📝 ツールと紐付いていないブログ');
    console.log('='.repeat(50));
    unusedBlogs.forEach(blog => {
      console.log(`- ${blog}`);
    });
  }
  
  // CSVファイルとして出力（Excel等で確認したい場合）
  const csvContent = [
    'Tool,Blog,Status',
    ...matchedPairs.map(({ tool, blog }) => `${tool},${blog},OK`),
    ...missingBlogs.map(tool => `${tool},,MISSING`)
  ].join('\n');
  
  fs.writeFileSync('tools-blogs-mapping.csv', csvContent, 'utf-8');
  console.log('\n📄 結果を tools-blogs-mapping.csv に保存しました');
}

// 実行
findMissingBlogs();