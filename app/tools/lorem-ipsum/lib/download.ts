// Download utility functions for Lorem Ipsum Generator

export type DownloadFormat = 'txt' | 'html' | 'md' | 'json'

const MIME_TYPES: Record<DownloadFormat, string> = {
  txt: 'text/plain;charset=utf-8',
  html: 'text/html;charset=utf-8',
  md: 'text/markdown;charset=utf-8',
  json: 'application/json;charset=utf-8',
}

/**
 * Format content based on the selected format
 */
export function formatContent(content: string, format: DownloadFormat): string {
  const paragraphs = content.split('\n\n')

  switch (format) {
    case 'html':
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lorem Ipsum</title>
</head>
<body>
${paragraphs.map((p) => `  <p>${p}</p>`).join('\n')}
</body>
</html>`

    case 'md':
      return `# Lorem Ipsum

${paragraphs.join('\n\n')}`

    case 'json':
      return JSON.stringify(
        {
          generated: new Date().toISOString(),
          paragraphCount: paragraphs.length,
          wordCount: content.split(/\s+/).filter((w) => w).length,
          characterCount: content.length,
          paragraphs: paragraphs,
        },
        null,
        2
      )

    case 'txt':
    default:
      return content
  }
}

/**
 * Download file with the specified content and format
 */
export function downloadFile(
  content: string,
  format: DownloadFormat,
  filename: string = 'lorem-ipsum'
): void {
  const formatted = formatContent(content, format)
  const blob = new Blob([formatted], { type: MIME_TYPES[format] })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.${format}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up the URL object
  URL.revokeObjectURL(url)
}

/**
 * Get file extension display name
 */
export function getFormatDisplayName(format: DownloadFormat): string {
  const names: Record<DownloadFormat, string> = {
    txt: 'Plain Text (.txt)',
    html: 'HTML (.html)',
    md: 'Markdown (.md)',
    json: 'JSON (.json)',
  }
  return names[format]
}