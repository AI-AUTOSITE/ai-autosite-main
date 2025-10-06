// scripts/find-console-logs.js
const fs = require('fs')
const path = require('path')

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
}

// Directories to search
const searchDirs = ['app', 'components', 'lib', 'utils']

// File extensions to check
const extensions = ['.ts', '.tsx', '.js', '.jsx']

// Patterns to find
const patterns = [
  /console\.log\(/g,
  /console\.warn\(/g,
  /console\.error\(/g,
  /console\.debug\(/g,
  /console\.info\(/g,
  /console\.table\(/g,
]

let totalFiles = 0
let filesWithConsole = 0
let totalConsoleCount = 0
const results = []
const typeCount = {
  log: 0,
  error: 0,
  warn: 0,
  debug: 0,
  info: 0,
  table: 0,
}

function shouldIgnore(filePath) {
  const ignorePaths = [
    'node_modules',
    '.next',
    'build',
    'dist',
    'out',
    '.git',
    'coverage',
  ]
  return ignorePaths.some((ignore) => filePath.includes(ignore))
}

function searchFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const lines = content.split('\n')
    const matches = []

    lines.forEach((line, index) => {
      patterns.forEach((pattern) => {
        if (pattern.test(line)) {
          // Extract console type from the actual matched line
          const matchType = line.match(/console\.(\w+)/)?.[1] || 'unknown'
          matches.push({
            line: index + 1,
            content: line.trim(),
            type: matchType,
          })
        }
      })
    })

    if (matches.length > 0) {
      filesWithConsole++
      totalConsoleCount += matches.length
      
      // Count by type
      matches.forEach(({ type }) => {
        if (typeCount.hasOwnProperty(type)) {
          typeCount[type]++
        }
      })
      
      results.push({
        file: filePath,
        matches: matches,
      })
    }

    totalFiles++
  } catch (error) {
    console.error(`${colors.red}Error reading file: ${filePath}${colors.reset}`)
  }
}

function searchDirectory(dir) {
  if (!fs.existsSync(dir)) {
    return
  }

  const items = fs.readdirSync(dir)

  items.forEach((item) => {
    const fullPath = path.join(dir, item)

    if (shouldIgnore(fullPath)) {
      return
    }

    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      searchDirectory(fullPath)
    } else if (stat.isFile() && extensions.some((ext) => fullPath.endsWith(ext))) {
      searchFile(fullPath)
    }
  })
}

// Main execution
console.log(`\n${colors.cyan}🔍 Searching for console statements...${colors.reset}\n`)

searchDirs.forEach((dir) => {
  searchDirectory(dir)
})

// Display results
if (results.length === 0) {
  console.log(`${colors.green}✨ No console statements found! Your code is clean!${colors.reset}\n`)
} else {
  console.log(`${colors.yellow}📊 Found ${totalConsoleCount} console statement(s) in ${filesWithConsole} file(s):${colors.reset}\n`)

  results.forEach(({ file, matches }) => {
    console.log(`${colors.blue}📄 ${file}${colors.reset} ${colors.gray}(${matches.length} occurrence${matches.length > 1 ? 's' : ''})${colors.reset}`)
    
    matches.forEach(({ line, content, type }) => {
      // Color code by type
      let typeColor
      if (type === 'error') {
        typeColor = colors.red
      } else if (type === 'warn') {
        typeColor = colors.yellow
      } else if (type === 'log') {
        typeColor = colors.cyan
      } else {
        typeColor = colors.magenta
      }
      
      // Add indicator for protected types
      const protectedIndicator = (type === 'error' || type === 'warn') ? ' 🛡️' : ''
      
      console.log(`   ${colors.gray}Line ${line}:${colors.reset} ${typeColor}console.${type}${protectedIndicator}${colors.reset} ${colors.gray}${content.substring(0, 80)}${content.length > 80 ? '...' : ''}${colors.reset}`)
    })
    console.log('')
  })

  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`)
  console.log(`${colors.yellow}Summary:${colors.reset}`)
  console.log(`  Total files scanned: ${totalFiles}`)
  console.log(`  Files with console: ${filesWithConsole}`)
  console.log(`  Total console statements: ${totalConsoleCount}`)
  console.log(`\n${colors.cyan}By Type:${colors.reset}`)
  console.log(`  ${colors.cyan}console.log${colors.reset}:   ${typeCount.log} ${colors.gray}(will be removed)${colors.reset}`)
  console.log(`  ${colors.red}console.error${colors.reset}: ${typeCount.error} ${colors.gray}(protected 🛡️)${colors.reset}`)
  console.log(`  ${colors.yellow}console.warn${colors.reset}:  ${typeCount.warn} ${colors.gray}(protected 🛡️)${colors.reset}`)
  console.log(`  ${colors.magenta}console.debug${colors.reset}: ${typeCount.debug} ${colors.gray}(will be removed)${colors.reset}`)
  console.log(`  ${colors.magenta}console.info${colors.reset}:  ${typeCount.info} ${colors.gray}(will be removed)${colors.reset}`)
  console.log(`  ${colors.magenta}console.table${colors.reset}: ${typeCount.table} ${colors.gray}(will be removed)${colors.reset}`)
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`)

  console.log(`${colors.gray}💡 Tip: Run 'npm run remove-console' to remove console.log/debug/info/table${colors.reset}`)
  console.log(`${colors.gray}   (console.error and console.warn will be protected)${colors.reset}\n`)
}

process.exit(filesWithConsole > 0 ? 1 : 0)