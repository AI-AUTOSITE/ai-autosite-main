// app/tools/ai-dev-dictionary/lib/demo-loader.ts
import { allDemos } from '../components/demos/index'

export interface DemoComponentProps {
  state: any
  setState: React.Dispatch<React.SetStateAction<any>>
}

// 既存のallDemosを使用
export async function loadDemo(
  demoType: string
): Promise<React.ComponentType<DemoComponentProps> | null> {
  // デバッグ用ログ
  console.log('Loading demo:', demoType)
  console.log('Available demos:', Object.keys(allDemos))

  const demoFunction = allDemos[demoType]

  if (!demoFunction) {
    console.warn(`Demo not found: ${demoType}`)
    return null
  }

  // ラップして返す
  return Promise.resolve(function DemoWrapper({ state, setState }: DemoComponentProps) {
    return demoFunction(state, setState)
  })
}
