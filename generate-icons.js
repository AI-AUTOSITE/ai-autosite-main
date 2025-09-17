// generate-icons.js
// 簡易的なPWAアイコン生成スクリプト
// Node.jsで実行: node generate-icons.js

const fs = require('fs');
const path = require('path');

// アイコン用のSVGテンプレート
const createSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#111827"/>
  <rect x="${size * 0.1}" y="${size * 0.1}" width="${size * 0.8}" height="${size * 0.8}" rx="${size * 0.05}" fill="#06b6d4"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".35em" fill="white" font-family="Arial, sans-serif" font-size="${size * 0.25}" font-weight="bold">
    PDF
  </text>
</svg>
`;

// アイコンサイズの定義
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// publicフォルダにiconsディレクトリを作成
const iconsDir = path.join('public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 各サイズのSVGファイルを生成
sizes.forEach(size => {
  const svg = createSVG(size);
  const filename = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(filename, svg);
  console.log(`Created: ${filename}`);
});

// 簡易HTMLファイルでPNGに変換する手順を表示
console.log('\n===== PNG変換手順 =====');
console.log('1. 生成されたSVGファイルをブラウザで開く');
console.log('2. 右クリック → 画像として保存');
console.log('3. PNG形式で保存');
console.log('\nまたは、オンラインツールを使用:');
console.log('https://cloudconvert.com/svg-to-png');
console.log('https://svgtopng.com/');
console.log('========================\n');