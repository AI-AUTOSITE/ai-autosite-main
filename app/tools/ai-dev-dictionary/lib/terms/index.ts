// app/tools/ai-dev-dictionary/lib/terms/index.ts

// 型定義とカテゴリーのエクスポート
export { type TechTerm } from './types';
export { categories, type Category } from './categories';

// 各カテゴリーのtermsをインポート
import { uiComponentTerms } from './ui-components';
import { dataDisplayTerms } from './data-display';
import { formsInputTerms } from './forms-input';
import { layoutTerms } from './layout';
import { navigationTerms } from './navigation';
import { feedbackTerms } from './feedback';
import { advancedTerms } from './advanced';

// 個別のカテゴリーをエクスポート（必要に応じて）
export {
  uiComponentTerms,
  dataDisplayTerms,
  formsInputTerms,
  layoutTerms,
  navigationTerms,
  feedbackTerms,
  advancedTerms
};

// すべての用語を結合した配列をエクスポート
export const techTerms: TechTerm[] = [
  ...uiComponentTerms,
  ...dataDisplayTerms,
  ...formsInputTerms,
  ...layoutTerms,
  ...navigationTerms,
  ...feedbackTerms,
  ...advancedTerms
];

// カテゴリー別に用語を取得する関数
export function getTermsByCategory(categoryId: string): TechTerm[] {
  if (categoryId === 'all') {
    return techTerms;
  }
  return techTerms.filter(term => term.category === categoryId);
}

// 検索関数
export function searchTerms(query: string): TechTerm[] {
  const lowerQuery = query.toLowerCase();
  return techTerms.filter(term => 
    term.term.toLowerCase().includes(lowerQuery) ||
    term.aiSynonyms.some(syn => syn.toLowerCase().includes(lowerQuery)) ||
    term.aiPhrases.some(phrase => phrase.toLowerCase().includes(lowerQuery)) ||
    term.description.toLowerCase().includes(lowerQuery) ||
    term.beginnerTip.toLowerCase().includes(lowerQuery)
  );
}

// ID で用語を取得
export function getTermById(id: string): TechTerm | undefined {
  return techTerms.find(term => term.id === id);
}

// 関連用語を取得
export function getRelatedTerms(termId: string): TechTerm[] {
  const term = getTermById(termId);
  if (!term || !term.relatedTerms) {
    return [];
  }
  
  return term.relatedTerms
    .map(relatedTermName => techTerms.find(t => t.term === relatedTermName))
    .filter((t): t is TechTerm => t !== undefined);
}