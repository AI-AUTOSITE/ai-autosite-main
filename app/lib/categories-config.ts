import {
Zap,
Code,
BookOpen,
Briefcase,
Palette,
GraduationCap,
type LucideIcon
} from 'lucide-react'
// カテゴリーの型定義
export interface Category {
id: string
name: string
emoji: string
icon: LucideIcon
color: string
bgGradient: string
description: string
enabled?: boolean
}
// カテゴリー定義
export const CATEGORIES: Category[] = [
{
id: 'quick-tools',
name: 'Quick Tools',
emoji: '⚡',
icon: Zap,
color: 'from-cyan-500 to-blue-500',
bgGradient: 'from-cyan-500/20 to-blue-500/20',
description: 'Instant tools for everyday tasks',
enabled: true
},
{
id: 'dev-tools',
name: 'Dev Tools',
emoji: '💻',
icon: Code,
color: 'from-purple-500 to-indigo-500',
bgGradient: 'from-purple-500/20 to-indigo-500/20',
description: 'Tools for developers and coders',
enabled: true
},
{
id: 'study-tools',
name: 'Study Tools',
emoji: '📚',
icon: BookOpen,
color: 'from-green-500 to-teal-500',
bgGradient: 'from-green-500/20 to-teal-500/20',
description: 'AI-powered learning assistance',
enabled: true
},
{
id: 'business-tools',
name: 'Business',
emoji: '💼',
icon: Briefcase,
color: 'from-blue-500 to-purple-600',
bgGradient: 'from-blue-500/20 to-purple-600/20',
description: 'Professional productivity tools',
enabled: true
},
{
id: 'creative-tools',
name: 'Creative',
emoji: '🎨',
icon: Palette,
color: 'from-pink-500 to-rose-500',
bgGradient: 'from-pink-500/20 to-rose-500/20',
description: 'Design and creative tools',
enabled: true
},
{
id: 'learning-hub',
name: 'Learning',
emoji: '🎓',
icon: GraduationCap,
color: 'from-amber-500 to-orange-500',
bgGradient: 'from-amber-500/20 to-orange-500/20',
description: 'Interactive learning resources',
enabled: false  // 現在無効
}
]
// 有効なカテゴリーのみを取得
export function getEnabledCategories(): Category[] {
return CATEGORIES.filter(cat => cat.enabled !== false)
}
// カテゴリーIDから情報を取得
export function getCategoryById(id: string): Category | undefined {
return CATEGORIES.find(cat => cat.id === id)
}
// カテゴリー名から情報を取得
export function getCategoryByName(name: string): Category | undefined {
return CATEGORIES.find(cat => cat.name === name)
}
// デフォルトエクスポート
export default CATEGORIES
