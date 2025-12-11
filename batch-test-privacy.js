/**
 * Privacy Policy Batch Tester
 * 
 * 使い方:
 * 1. このファイルをプロジェクトルートに配置
 * 2. npm install node-fetch@2 を実行
 * 3. node batch-test-privacy.js を実行
 * 4. 結果が batch-test-results.csv に出力される
 */

const fs = require('fs');
const path = require('path');

// node-fetch v2 (CommonJS対応)
let fetch;
try {
  fetch = require('node-fetch');
} catch (e) {
  console.log('node-fetch not found. Please run: npm install node-fetch@2');
  process.exit(1);
}

// ═══════════════════════════════════════════════════════════════
// テスト対象サービス（ToS;DRグレード付き）
// ═══════════════════════════════════════════════════════════════

const TEST_SERVICES = [
  // Grade A (20)
  { name: 'VPN.AC', expected: 'A', url: 'https://vpn.ac/privacy-policy' },
  { name: 'NextDNS', expected: 'A', url: 'https://nextdns.io/privacy' },
  { name: 'Swisscows', expected: 'A', url: 'https://swisscows.com/en/privacy' },
  { name: 'Mailfence', expected: 'A', url: 'https://mailfence.com/en/privacy.jsp' },
  { name: 'Disroot', expected: 'A', url: 'https://disroot.org/en/privacy_policy' },
  { name: 'Standard Notes', expected: 'A', url: 'https://standardnotes.com/legal/privacy' },
  { name: 'Sync', expected: 'A', url: 'https://www.sync.com/privacy/' },
  { name: 'F-Droid', expected: 'A', url: 'https://f-droid.org/en/about/' },
  { name: 'NewPipe', expected: 'A', url: 'https://newpipe.net/legal/privacy/' },
  { name: 'Waterfox', expected: 'A', url: 'https://www.waterfox.net/docs/policies/privacy/' },
  
  // Grade B (20)
  { name: 'Vivaldi', expected: 'B', url: 'https://vivaldi.com/privacy/browser/' },
  { name: 'Brave', expected: 'B', url: 'https://brave.com/privacy/browser/' },
  { name: 'Qwant', expected: 'B', url: 'https://about.qwant.com/en/legal/confidentialite/' },
  { name: 'FastMail', expected: 'B', url: 'https://www.fastmail.com/policies/privacy/' },
  { name: 'Nextcloud', expected: 'B', url: 'https://nextcloud.com/privacy/' },
  { name: 'Wikipedia', expected: 'B', url: 'https://foundation.wikimedia.org/wiki/Policy:Privacy_policy' },
  { name: 'Element', expected: 'B', url: 'https://element.io/legal/privacy' },
  { name: 'Session', expected: 'B', url: 'https://getsession.org/privacy-policy' },
  { name: 'Liberapay', expected: 'B', url: 'https://liberapay.com/about/privacy' },
  { name: 'Tumblr', expected: 'B', url: 'https://www.tumblr.com/privacy/en' },
  
  // Grade C (20)
  { name: 'Bandcamp', expected: 'C', url: 'https://bandcamp.com/privacy' },
  { name: 'Mega', expected: 'C', url: 'https://mega.nz/privacy' },
  { name: 'DeepL', expected: 'C', url: 'https://www.deepl.com/en/privacy' },
  { name: 'Ecosia', expected: 'C', url: 'https://www.ecosia.org/privacy' },
  { name: 'Apple', expected: 'C', url: 'https://www.apple.com/legal/privacy/' },
  { name: 'Scratch', expected: 'C', url: 'https://scratch.mit.edu/privacy_policy' },
  { name: 'LibreOffice', expected: 'C', url: 'https://www.libreoffice.org/privacy' },
  { name: 'Letterboxd', expected: 'C', url: 'https://letterboxd.com/legal/privacy-notice/' },
  { name: 'Guilded', expected: 'C', url: 'https://www.guilded.gg/about/privacy' },
  { name: 'Kahoot', expected: 'C', url: 'https://trust.kahoot.com/privacy-policy/' },
  
  // Grade D (20)
  { name: 'MyAnimeList', expected: 'D', url: 'https://myanimelist.net/about/privacy_policy' },
  { name: 'Fandom', expected: 'D', url: 'https://www.fandom.com/privacy-policy' },
  { name: 'Pocket', expected: 'D', url: 'https://getpocket.com/privacy' },
  { name: 'Skillshare', expected: 'D', url: 'https://www.skillshare.com/privacy' },
  { name: 'Opera', expected: 'D', url: 'https://legal.opera.com/privacy/privacy.html' },
  { name: 'Google Chrome', expected: 'D', url: 'https://www.google.com/chrome/privacy/' },
  { name: 'Surfshark', expected: 'D', url: 'https://surfshark.com/privacy' },
  { name: 'Headspace', expected: 'D', url: 'https://www.headspace.com/privacy-policy' },
  { name: 'Replika', expected: 'D', url: 'https://replika.com/legal/privacy' },
  { name: 'Urban Dictionary', expected: 'D', url: 'https://about.urbandictionary.com/privacy' },
  
  // Grade E (20)
  { name: 'Facebook', expected: 'E', url: 'https://www.facebook.com/privacy/policy' },
  { name: 'Instagram', expected: 'E', url: 'https://privacycenter.instagram.com/policy' },
  { name: 'Twitter/X', expected: 'E', url: 'https://twitter.com/en/privacy' },
  { name: 'Reddit', expected: 'E', url: 'https://www.reddit.com/policies/privacy-policy' },
  { name: 'Google', expected: 'E', url: 'https://policies.google.com/privacy' },
  { name: 'Microsoft', expected: 'E', url: 'https://privacy.microsoft.com/en-us/privacystatement' },
  { name: 'YouTube', expected: 'E', url: 'https://policies.google.com/privacy' },
  { name: 'PayPal', expected: 'E', url: 'https://www.paypal.com/us/legalhub/paypal/privacy-full' },
  { name: 'eBay', expected: 'E', url: 'https://www.ebay.com/help/policies/member-behaviour-policies/user-privacy-notice-privacy-policy?id=4260' },
  { name: 'CNN', expected: 'E', url: 'https://www.cnn.com/privacy' },
];

// ═══════════════════════════════════════════════════════════════
// ユーティリティ関数
// ═══════════════════════════════════════════════════════════════

async function fetchPrivacyPolicy(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 15000,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const html = await response.text();
    
    // HTMLからテキストを抽出（簡易版）
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
    
    return { success: true, text, wordCount: text.split(/\s+/).length };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════
// 簡易分析エンジン（スタンドアロン版）
// ═══════════════════════════════════════════════════════════════

// 強いポジティブパターン
const STRONG_POSITIVE_PATTERNS = [
  { pattern: /end-to-end\s+encrypt/gi, label: 'End-to-end encryption', score: 15 },
  { pattern: /(?:do|does)\s+not\s+sell\s+(?:your\s+)?(?:personal\s+)?(?:data|information)/gi, label: 'Does not sell data', score: 20 },
  { pattern: /(?:we\s+)?(?:will\s+)?never\s+sell/gi, label: 'Never sells', score: 20 },
  { pattern: /cannot\s+(?:decrypt|access|read|view)/gi, label: 'Cannot access your data', score: 18 },
  { pattern: /zero[\s-]?knowledge/gi, label: 'Zero knowledge', score: 15 },
  { pattern: /open[\s-]?source/gi, label: 'Open source', score: 8 },
  { pattern: /privacy\s+by\s+design/gi, label: 'Privacy by design', score: 12 },
  { pattern: /minimum\s+(?:data\s+)?(?:required|necessary)/gi, label: 'Minimum data', score: 10 },
  { pattern: /stored\s+(?:only\s+)?on\s+your\s+(?:own\s+)?device/gi, label: 'Stored on device', score: 12 },
  { pattern: /(?:do|does)\s+not\s+(?:track|monitor)/gi, label: 'No tracking', score: 12 },
  { pattern: /(?:do|does)\s+not\s+share/gi, label: 'Does not share', score: 10 },
  { pattern: /right\s+to\s+(?:be\s+)?(?:forgotten|erased|deleted)/gi, label: 'Right to be forgotten', score: 8 },
];

// ネガティブパターン
const NEGATIVE_PATTERNS = [
  { pattern: /sell\s+(?:your\s+)?(?:personal\s+)?(?:data|information)/gi, label: 'Sells data', score: -20 },
  { pattern: /share\s+(?:your\s+)?(?:personal\s+)?(?:data|information)\s+with\s+(?:third[\s-]?part|advertis)/gi, label: 'Shares with third parties', score: -15 },
  { pattern: /biometric/gi, label: 'Biometric data', score: -10 },
  { pattern: /facial\s+recognition/gi, label: 'Facial recognition', score: -12 },
  { pattern: /track(?:ing)?\s+(?:your\s+)?(?:location|activity|behavior)/gi, label: 'Tracking', score: -10 },
  { pattern: /retain\s+(?:your\s+)?(?:data|information)\s+(?:indefinitely|forever)/gi, label: 'Indefinite retention', score: -15 },
  { pattern: /(?:as\s+long\s+as\s+)?(?:necessary|needed)/gi, label: 'Vague retention', score: -5 },
  { pattern: /advertising\s+(?:partners?|networks?)/gi, label: 'Ad partners', score: -10 },
  { pattern: /behavioral\s+advertising/gi, label: 'Behavioral ads', score: -12 },
  { pattern: /cross[\s-]?(?:site|device)\s+tracking/gi, label: 'Cross-site tracking', score: -12 },
  { pattern: /(?:may|might|can)\s+(?:share|disclose|transfer)/gi, label: 'May share data', score: -8 },
  { pattern: /without\s+(?:prior\s+)?notice/gi, label: 'Changes without notice', score: -10 },
];

// 否定語チェック
const NEGATION_WORDS = ['do not', 'does not', 'will not', 'cannot', "don't", "doesn't", "won't", "can't", 'never', 'no ', 'not '];

function isNegated(text, matchIndex) {
  const before = text.slice(Math.max(0, matchIndex - 50), matchIndex).toLowerCase();
  return NEGATION_WORDS.some(neg => before.includes(neg));
}

function analyzePolicy(text) {
  const normalizedText = text.toLowerCase();
  let score = 50;
  const positives = [];
  const negatives = [];
  
  // ポジティブパターンチェック
  for (const { pattern, label, score: bonus } of STRONG_POSITIVE_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) {
      positives.push(label);
      score += bonus;
    }
  }
  
  // ネガティブパターンチェック（否定文を考慮）
  for (const { pattern, label, score: penalty } of NEGATIVE_PATTERNS) {
    pattern.lastIndex = 0;
    const match = pattern.exec(text);
    if (match) {
      // 否定文脈にあるかチェック
      if (!isNegated(text, match.index)) {
        negatives.push(label);
        score += penalty;
      }
    }
  }
  
  // ポジティブが多い場合のボーナス
  if (positives.length >= 5) score += 10;
  if (positives.length >= 8) score += 10;
  
  // スコアを0-100に制限
  score = Math.max(0, Math.min(100, score));
  
  // グレード計算
  let grade;
  if (score >= 80) grade = 'A';
  else if (score >= 60) grade = 'B';
  else if (score >= 40) grade = 'C';
  else if (score >= 20) grade = 'D';
  else grade = 'E';
  
  return { score, grade, positives, negatives };
}

// ═══════════════════════════════════════════════════════════════
// メイン処理
// ═══════════════════════════════════════════════════════════════

async function runBatchTest() {
  console.log('🔍 Privacy Policy Batch Tester');
  console.log('=' .repeat(50));
  console.log(`Testing ${TEST_SERVICES.length} services...\n`);
  
  const results = [];
  let successCount = 0;
  let matchCount = 0;
  
  for (let i = 0; i < TEST_SERVICES.length; i++) {
    const service = TEST_SERVICES[i];
    process.stdout.write(`[${i + 1}/${TEST_SERVICES.length}] ${service.name}... `);
    
    const fetchResult = await fetchPrivacyPolicy(service.url);
    
    if (!fetchResult.success) {
      console.log(`❌ Failed (${fetchResult.error})`);
      results.push({
        name: service.name,
        expected: service.expected,
        actual: 'ERROR',
        score: 0,
        match: false,
        wordCount: 0,
        positives: '',
        negatives: '',
        error: fetchResult.error,
      });
      continue;
    }
    
    const analysis = analyzePolicy(fetchResult.text);
    const match = analysis.grade === service.expected;
    
    if (match) {
      matchCount++;
      console.log(`✅ ${analysis.grade} (${analysis.score}) - Match!`);
    } else {
      console.log(`⚠️ ${analysis.grade} (${analysis.score}) - Expected: ${service.expected}`);
    }
    
    successCount++;
    results.push({
      name: service.name,
      expected: service.expected,
      actual: analysis.grade,
      score: analysis.score,
      match: match ? 'YES' : 'NO',
      wordCount: fetchResult.wordCount,
      positives: analysis.positives.join('; '),
      negatives: analysis.negatives.join('; '),
      error: '',
    });
    
    // レート制限対策
    await new Promise(r => setTimeout(r, 500));
  }
  
  // CSV出力
  const csvHeader = 'name,expected,actual,score,match,word_count,positives,negatives,error\n';
  const csvRows = results.map(r => 
    `"${r.name}","${r.expected}","${r.actual}",${r.score},"${r.match}",${r.wordCount},"${r.positives}","${r.negatives}","${r.error}"`
  ).join('\n');
  
  const outputPath = path.join(__dirname, 'batch-test-results.csv');
  fs.writeFileSync(outputPath, csvHeader + csvRows);
  
  // サマリー
  console.log('\n' + '=' .repeat(50));
  console.log('📊 Summary');
  console.log('=' .repeat(50));
  console.log(`Total: ${TEST_SERVICES.length}`);
  console.log(`Success: ${successCount}`);
  console.log(`Matches: ${matchCount}/${successCount} (${(matchCount/successCount*100).toFixed(1)}%)`);
  console.log(`\nResults saved to: ${outputPath}`);
  
  // グレード別精度
  console.log('\n📈 Accuracy by Grade:');
  for (const grade of ['A', 'B', 'C', 'D', 'E']) {
    const gradeResults = results.filter(r => r.expected === grade && r.actual !== 'ERROR');
    const gradeMatches = gradeResults.filter(r => r.match === 'YES').length;
    console.log(`  Grade ${grade}: ${gradeMatches}/${gradeResults.length} (${gradeResults.length > 0 ? (gradeMatches/gradeResults.length*100).toFixed(0) : 0}%)`);
  }
}

// 実行
runBatchTest().catch(console.error);