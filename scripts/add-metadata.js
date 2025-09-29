// scripts/add-metadata.js
const fs = require('fs');
const path = require('path');

const tools = [
  { id: 'age-calculator', name: 'Age Calculator', description: 'Calculate exact age' },
  // ... 45個のツール
];

tools.forEach(tool => {
  const pagePath = path.join('app/tools', tool.id, 'page.tsx');
  // メタデータを含むpage.tsxを生成
});