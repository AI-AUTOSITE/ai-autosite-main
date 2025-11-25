// Format conversion utilities for Lorem Ipsum Generator

export type OutputFormat = 'text' | 'html' | 'markdown' | 'json'

/**
 * Format paragraphs as plain text
 */
export function formatAsPlainText(paragraphs: string[]): string {
  return paragraphs.join('\n\n')
}

/**
 * Format paragraphs as HTML
 */
export function formatAsHTML(paragraphs: string[]): string {
  return paragraphs.map((p) => `<p>${p}</p>`).join('\n\n')
}

/**
 * Format paragraphs as Markdown
 */
export function formatAsMarkdown(paragraphs: string[]): string {
  if (paragraphs.length === 0) return ''
  
  // First paragraph gets a heading
  const [first, ...rest] = paragraphs
  return [`## Lorem Ipsum\n\n${first}`, ...rest].join('\n\n')
}

/**
 * Format paragraphs as JSON
 */
export function formatAsJSON(paragraphs: string[]): string {
  const allText = paragraphs.join(' ')
  const words = allText.split(/\s+/).filter((w) => w)
  
  return JSON.stringify(
    {
      generated: new Date().toISOString(),
      paragraphCount: paragraphs.length,
      wordCount: words.length,
      characterCount: allText.length,
      paragraphs,
    },
    null,
    2
  )
}

/**
 * Format content based on selected format
 */
export function formatOutput(paragraphs: string[], format: OutputFormat): string {
  switch (format) {
    case 'html':
      return formatAsHTML(paragraphs)
    case 'markdown':
      return formatAsMarkdown(paragraphs)
    case 'json':
      return formatAsJSON(paragraphs)
    case 'text':
    default:
      return formatAsPlainText(paragraphs)
  }
}

/**
 * Get format display name
 */
export function getFormatDisplayName(format: OutputFormat): string {
  const names: Record<OutputFormat, string> = {
    text: 'Plain Text',
    html: 'HTML',
    markdown: 'Markdown',
    json: 'JSON',
  }
  return names[format]
}

/**
 * Get format description
 */
export function getFormatDescription(format: OutputFormat): string {
  const descriptions: Record<OutputFormat, string> = {
    text: 'Simple paragraphs separated by line breaks',
    html: 'Wrapped in <p> tags for web use',
    markdown: 'Markdown format with headers',
    json: 'Structured JSON with metadata',
  }
  return descriptions[format]
}