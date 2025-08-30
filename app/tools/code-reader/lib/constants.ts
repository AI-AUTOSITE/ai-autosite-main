import { SecurityCheck } from './types'

export const IGNORED_FOLDERS = [
  'node_modules', '.git', '.next', 'dist', 'build', 'coverage',
  '.cache', 'vendor', 'packages', '.vercel', '.turbo', 'out',
  '.nuxt', '.output', '.svelte-kit', '__pycache__', '.pytest_cache',
  '.venv', 'env', 'venv'
]

export const ALLOWED_EXTENSIONS = [
  '.tsx', '.ts', '.jsx', '.js',
  '.css', '.scss', '.sass', '.less',
  '.json', '.yml', '.yaml',
  '.md', '.mdx',
  '.html', '.vue', '.svelte',
  '.py', '.rb', '.go', '.rs',
  '.config.js', '.config.ts'
]

export const DANGEROUS_PATTERNS = [
  /api[_-]?key/i, /secret[_-]?key/i, /private[_-]?key/i,
  /access[_-]?token/i, /auth[_-]?token/i, /password/i,
  /passwd/i, /pwd/i, /credential/i, /jwt[_-]?token/i,
  /bearer[_-]?token/i, /oauth/i, /session[_-]?id/i,
  /cookie[_-]?secret/i, /encryption[_-]?key/i,
  /database[_-]?url/i, /db[_-]?connection/i,
  /mongodb[_-]?uri/i, /postgres[_-]?url/i, /redis[_-]?url/i,
  /smtp[_-]?password/i, /email[_-]?password/i,
  /aws[_-]?secret/i, /azure[_-]?key/i, /google[_-]?api/i,
  /firebase[_-]?key/i, /stripe[_-]?key/i, /paypal[_-]?secret/i,
  /twilio[_-]?token/i, /github[_-]?token/i, /slack[_-]?token/i,
  /discord[_-]?token/i, /webhook[_-]?secret/i, /signing[_-]?secret/i,
  /master[_-]?key/i, /root[_-]?password/i, /admin[_-]?password/i,
  /super[_-]?user/i, /\.pem$/i, /\.p12$/i, /\.pfx$/i,
  /\.key$/i, /\.crt$/i, /\.cert$/i, /id_rsa/i, /id_dsa/i,
  /id_ecdsa/i, /id_ed25519/i
]

export const SUSPICIOUS_CONTENT_PATTERNS = [
  /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/,
  /-----BEGIN CERTIFICATE-----/,
  /[A-Za-z0-9+/]{64,}={0,2}/,
  /[0-9a-f]{32,}/,
  /sk-[a-zA-Z0-9]{48}/,
  /ghp_[a-zA-Z0-9]{36}/,
  /ghs_[a-zA-Z0-9]{36}/,
  /gho_[a-zA-Z0-9]{36}/,
  /xoxb-[0-9]+-[0-9]+-[a-zA-Z0-9]+/,
  /xoxp-[0-9]+-[0-9]+-[a-zA-Z0-9]+/,
  /AKIA[0-9A-Z]{16}/,
  /ya29\.[0-9A-Za-z\-_]+/,
  /AIza[0-9A-Za-z\-_]{35}/
]

export function performSecurityCheck(fileName: string, content: string): SecurityCheck {
  const warnings: string[] = []
  const errors: string[] = []
  
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(fileName)) {
      errors.push(`Sensitive filename pattern: ${fileName}`)
    }
  }
  
  for (const pattern of SUSPICIOUS_CONTENT_PATTERNS) {
    if (pattern.test(content)) {
      errors.push(`Sensitive content detected: ${fileName}`)
      break
    }
  }
  
  if (fileName.includes('.env') && !fileName.includes('.example')) {
    const lines = content.split('\n')
    for (const line of lines) {
      if (line.includes('=') && line.trim() && !line.trim().startsWith('#')) {
        const [key] = line.split('=', 2)
        for (const pattern of DANGEROUS_PATTERNS) {
          if (pattern.test(key)) {
            errors.push(`Sensitive environment variable: ${key} in ${fileName}`)
            break
          }
        }
      }
    }
  }
  
  return { warnings, errors }
}