// app/tools/ai-dev-dictionary/components/demos/index.ts

import { uiDemos } from './ui-demos'
import { dataDemos } from './data-demos'
import { formDemos } from './form-demos'
import { layoutDemos } from './layout-demos'
import { navigationDemos } from './navigation-demos'
import { feedbackDemos } from './feedback-demos'
import { advancedDemos } from './advanced-demos'
import { additionalDemos } from './additional-demos'

// すべてのデモを結合
export const allDemos = {
  ...uiDemos,
  ...dataDemos,
  ...formDemos,
  ...layoutDemos,
  ...navigationDemos,
  ...feedbackDemos,
  ...advancedDemos,
  ...additionalDemos, // 新しく追加
}

// デモタイプの型定義
export type DemoFunction = (demoState: any, setDemoState: any) => JSX.Element
