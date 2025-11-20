export interface Bot {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  icon: string
  theme: string
  category: string
  priceRange: {
    min: number
    max: number
    currency: string
  }
  timeline: {
    min: number
    max: number
    unit: string
  }
  monthlyCost: {
    hosting: number
    maintenance: number
    total: number
    api?: number
  }
  features: string[]
  idealUseCases: string[]
  limitations: string[]
  complexity: string
  techStack: string[]
  integrations: string[]
  hasLiveDemo: boolean
  demoUrl?: string
  featured?: boolean
  status: string
  order: number
  metaTitle: string
  metaDescription: string
}