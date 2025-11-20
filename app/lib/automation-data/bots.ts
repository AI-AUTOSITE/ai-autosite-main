import { Bot } from '@/types/bot';

export const bots: Bot[] = [
  // 1. Rule-Based Bot (Budget - Entry Level)
  {
    id: 'rule-based-001',
    slug: 'rule-based',
    title: 'Rule-Based Chatbot',
    subtitle: 'Predictable, Fast, Affordable',
    description: 'Perfect for straightforward FAQ handling and appointment booking with pre-defined decision flows.',
    icon: '🥉',
    theme: 'rule',
    category: 'basic',
    
    priceRange: {
      min: 3000,
      max: 8000,
      currency: 'USD'
    },
    timeline: {
      min: 3,
      max: 5,
      unit: 'weeks'
    },
    monthlyCost: {
      hosting: 50,
      maintenance: 150,
      total: 200
    },
    
    features: [
      'Decision tree logic with button-based navigation',
      'Pre-defined responses for common questions',
      'Simple integrations (forms, calendar)',
      'Fast response time (<0.1 seconds)',
      'No AI costs - completely predictable pricing',
      'Easy to update and maintain'
    ],
    
    idealUseCases: [
      'FAQ answering (business hours, location, pricing)',
      'Appointment booking and scheduling',
      'Basic lead qualification',
      'Information lookup and directory',
      'Simple order status checking'
    ],
    
    limitations: [
      'Cannot understand natural language variations',
      'Users must follow exact button options',
      'Limited flexibility for complex queries',
      'No learning or improvement over time'
    ],
    
    complexity: 'simple',
    techStack: ['React', 'Next.js', 'TypeScript'],
    integrations: ['Google Calendar', 'Web Forms', 'Email'],
    
    hasLiveDemo: true,
    demoUrl: '/demo/rule-based', // ✅ 動的ルートで対応
    featured: true,
    status: 'available',
    order: 1,
    
    metaTitle: 'Rule-Based Chatbot Demo | Signal AI',
    metaDescription: 'Try our rule-based chatbot live. Perfect for FAQs and appointment booking. $3k-$8k, 3-5 weeks delivery.'
  },
  
  // 2. Hybrid Bot (Professional - Most Popular)
  {
    id: 'hybrid-001',
    slug: 'hybrid',
    title: 'Hybrid Chatbot',
    subtitle: 'Best of Both Worlds',
    description: 'Combines rule-based structure with AI intelligence. Predictable flows with flexible understanding.',
    icon: '🥈',
    theme: 'hybrid',
    category: 'premium',
    
    priceRange: {
      min: 15000,
      max: 35000,
      currency: 'USD'
    },
    timeline: {
      min: 6,
      max: 10,
      unit: 'weeks'
    },
    monthlyCost: {
      hosting: 150,
      api: 300,
      maintenance: 200,
      total: 650
    },
    
    features: [
      'Structured menu for common paths',
      'AI fallback for complex queries',
      'Intelligent routing (rule vs AI)',
      'Cost optimization (uses AI only when needed)',
      'Context memory across sessions',
      'Multiple channel support',
      'Advanced analytics dashboard'
    ],
    
    idealUseCases: [
      'Most SMB applications',
      'E-commerce support',
      'SaaS onboarding',
      'Healthcare appointment systems',
      'Real estate lead qualification'
    ],
    
    limitations: [
      'More complex setup and configuration',
      'Requires careful balance of rule vs AI',
      'Higher initial development cost'
    ],
    
    complexity: 'moderate',
    techStack: ['Next.js', 'Claude API', 'TypeScript', 'Redis', 'PostgreSQL'],
    integrations: ['Claude API', 'CRM', 'Payment', 'Calendar', 'Analytics'],
    
    hasLiveDemo: true,
    demoUrl: '/demo/hybrid', // ✅ 動的ルートで対応
    featured: true,
    status: 'available',
    order: 2,
    
    metaTitle: 'Hybrid Chatbot Demo | Signal AI',
    metaDescription: 'Try our hybrid chatbot combining rule-based and AI. Best value for most SMBs. $15k-$35k, 6-10 weeks.'
  },
  
  // 3. AI-Powered Bot (Premium - Advanced)
  {
    id: 'ai-powered-001',
    slug: 'ai-powered',
    title: 'AI-Powered Chatbot',
    subtitle: 'Intelligent, Flexible, Context-Aware',
    description: 'Natural language understanding powered by Claude AI. Handles complex queries and learns from interactions.',
    icon: '🥇',
    theme: 'ai',
    category: 'advanced',
    
    priceRange: {
      min: 40000,
      max: 70000,
      currency: 'USD'
    },
    timeline: {
      min: 8,
      max: 14,
      unit: 'weeks'
    },
    monthlyCost: {
      hosting: 200,
      api: 800,
      maintenance: 300,
      total: 1300
    },
    
    features: [
      'Natural language understanding (Claude API)',
      'Context-aware conversations',
      'Multi-turn dialogue support',
      'Learns from interactions',
      'Handles typos and variations',
      'Sentiment analysis',
      'Multi-language support'
    ],
    
    idealUseCases: [
      'Complex customer support',
      'Technical troubleshooting',
      'Personalized recommendations',
      'Multi-language customer service',
      'Detailed product inquiries'
    ],
    
    limitations: [
      'Higher monthly API costs (scales with usage)',
      'Occasionally unpredictable responses',
      'Requires training data and fine-tuning',
      'More complex to maintain'
    ],
    
    complexity: 'complex',
    techStack: ['Next.js', 'Claude API', 'TypeScript', 'Vector DB'],
    integrations: ['Claude API', 'CRM Systems', 'Analytics', 'Email'],
    
    hasLiveDemo: true,
    demoUrl: '/demo/ai-powered', // ✅ 動的ルートで対応
    featured: true,
    status: 'available',
    order: 3,
    
    metaTitle: 'AI-Powered Chatbot Demo | Signal AI',
    metaDescription: 'Try our AI-powered chatbot with natural language understanding. $40k-$70k, 8-14 weeks delivery.'
  },
  
  // 4. Rule Cafe (Live Demo with Interactive Chat)
  {
    id: 'rule-cafe-001',
    slug: 'rule-cafe',
    title: 'Rule Cafe Demo',
    subtitle: '実際に動くルールベースチャットボット',
    description: 'カフェの予約システムを実際に体験できるデモ。ルールベースチャットボットの完全な実装例です。',
    icon: '☕',
    theme: 'rule',
    category: 'demo',
    
    priceRange: {
      min: 3000,
      max: 8000,
      currency: 'USD'
    },
    timeline: {
      min: 3,
      max: 5,
      unit: 'weeks'
    },
    monthlyCost: {
      hosting: 50,
      maintenance: 150,
      total: 200
    },
    
    features: [
      '完全インタラクティブな予約フロー',
      'カレンダー選択機能',
      '人数・時間帯選択',
      'FAQボット機能',
      'メニュー表示',
      '店舗情報案内'
    ],
    
    idealUseCases: [
      '飲食店の予約システム',
      'カフェ・レストランの問い合わせ対応',
      '店舗情報の自動案内',
      'メニュー紹介'
    ],
    
    limitations: [
      'ルールベースのため柔軟性は限定的',
      '事前定義されたシナリオのみ対応'
    ],
    
    complexity: 'simple',
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    integrations: ['Google Calendar API (可能)'],
    
    hasLiveDemo: true,
    demoUrl: '/demo/rule-cafe', // ✅ 専用ページが存在
    featured: false,
    status: 'available',
    order: 4,
    
    metaTitle: 'Rule Cafe Demo - ルールベースチャットボット実装例 | Signal AI',
    metaDescription: 'カフェ予約システムの完全な実装例。ルールベースチャットボットを実際に体験できます。'
  }
];

// Helper functions
export function getBotBySlug(slug: string): Bot | undefined {
  return bots.find(bot => bot.slug === slug);
}

export function getAvailableBots(): Bot[] {
  return bots.filter(bot => bot.status === 'available').sort((a, b) => a.order - b.order);
}

export function getFeaturedBots(): Bot[] {
  return bots.filter(bot => bot.featured && bot.status === 'available').sort((a, b) => a.order - b.order);
}

export function getBotsByTheme(theme: string): Bot[] {
  return bots.filter(bot => bot.theme === theme);
}