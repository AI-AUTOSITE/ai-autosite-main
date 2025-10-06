// app/tools/token-compressor/lib/tokenCounter.ts

// Note: tiktoken library would be used in production
// This is a simplified version for demonstration

let encoder: any = null

async function getEncoder() {
  // In production, use tiktoken library:
  // import { encoding_for_model } from 'tiktoken'
  // encoder = encoding_for_model('gpt-4')

  // For now, we'll use a simple approximation
  return null
}

export async function countTokens(text: string): Promise<number> {
  try {
    // In production with tiktoken:
    // const enc = await getEncoder()
    // const tokens = enc.encode(text)
    // return tokens.length

    // Simple approximation for demonstration
    // GPT models typically use about 1 token per 4 characters for English text
    // This is a rough estimate and varies by content

    // More accurate estimation based on common patterns
    let tokenCount = 0

    // Count words (roughly 1 token per word)
    const words = text.split(/\s+/)
    tokenCount = words.length

    // Add extra tokens for punctuation and special characters
    const punctuation = text.match(/[.,;:!?'"()\[\]{}<>@#$%^&*+=|\\\/~`]/g)
    if (punctuation) {
      tokenCount += punctuation.length * 0.3
    }

    // Code tends to have more tokens due to syntax
    const codeIndicators = text.match(/[{}()\[\];=<>]/g)
    if (codeIndicators && codeIndicators.length > text.length * 0.05) {
      tokenCount *= 1.2 // Code multiplier
    }

    // Multi-byte characters (non-ASCII) typically use more tokens
    const nonAscii = text.match(/[^\x00-\x7F]/g)
    if (nonAscii) {
      tokenCount += nonAscii.length * 0.5
    }

    return Math.ceil(tokenCount)
  } catch (error) {
    console.error('Token counting error:', error)
    // Fallback: very rough estimation (1 token ≈ 4 characters)
    return Math.ceil(text.length / 4)
  }
}

// Clean up encoder when done (for tiktoken)
export function freeEncoder() {
  if (encoder) {
    // encoder.free()
    encoder = null
  }
}

// Token limit information for different models
export const TOKEN_LIMITS = {
  'gpt-3.5-turbo': 16385,
  'gpt-4': 8192,
  'gpt-4-32k': 32768,
  'gpt-4-turbo': 128000,
  'claude-2': 100000,
  'claude-3': 200000,
  'claude-3.5': 200000,
}

// Cost estimation (approximate, in USD per 1000 tokens)
export const TOKEN_COSTS = {
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
  'gpt-4': { input: 0.03, output: 0.06 },
  'gpt-4-turbo': { input: 0.01, output: 0.03 },
  'claude-2': { input: 0.008, output: 0.024 },
  'claude-3': { input: 0.015, output: 0.075 },
}

export function estimateCost(tokens: number, model: string = 'gpt-4-turbo'): number {
  const costs = TOKEN_COSTS[model as keyof typeof TOKEN_COSTS] || TOKEN_COSTS['gpt-4-turbo']
  // Average of input and output costs
  const avgCost = (costs.input + costs.output) / 2
  return (tokens / 1000) * avgCost
}
