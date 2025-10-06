🔧 Chrome拡張機能設計書
機能概要
ChatGPT/Claudeのテキスト入力欄で、曖昧な用語を正しいUI用語に自動サジェスト
技術構成
json// manifest.json
{
"manifest_version": 3,
"name": "AI Prompt Helper",
"version": "1.0",
"permissions": ["activeTab", "storage"],
"content_scripts": [{
"matches": [
"https://chat.openai.com/*",
"https://claude.ai/*"
],
"js": ["content.js"],
"css": ["styles.css"]
}]
}
動作フロー
javascript// content.js
class PromptHelper {
constructor() {
this.terms = {
"ポップアップ": ["modal", "dialog", "popover"],
"メニュー": ["dropdown", "navigation", "sidebar"],
"ローディング": ["spinner", "skeleton", "progress"]
}
}

detectTerms(text) {
// テキスト入力を監視
const matches = []
for (const [key, suggestions] of Object.entries(this.terms)) {
if (text.includes(key)) {
matches.push({ original: key, suggestions })
}
}
return matches
}

showSuggestion(element, suggestions) {
// サジェストUIを表示
const popup = document.createElement('div')
popup.className = 'prompt-helper-popup'
popup.innerHTML = suggestions.map(s =>
`<button class="suggestion">${s}</button>`
).join('')
element.appendChild(popup)
}
}
これらの機能により、プログラミング知識なしでAIを活用できる強力なツールになります！😊
