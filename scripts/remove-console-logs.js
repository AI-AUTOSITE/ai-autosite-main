// scripts/remove-console-logs.js
const fs = require('fs')
const path = require('path')

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
}

// Directories to search
const searchDirs = ['app', 'components', 'lib', 'utils']

// File extensions to check
const extensions = ['.ts', '.tsx', '.js', '.jsx']

// Patterns to remove (excluding console.error and console.warn for production debugging)
const patterns = [
  /console\.log\([^)]*\);?\s*\n?/g,
  /console\.debug\([^)]*\);?\s*\n?/g,
  /console\.info\([^)]*\);?\s*\n?/g,
  /console\.table\([^)]*\);?\s*\n?/g,
]

let totalFiles = 0
let modifiedFiles = 0
let totalRemoved = 0

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

function removeConsoleFromFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8')
    let originalContent = content
    let removedCount = 0

    patterns.forEach((pattern) => {
      const matches = content.match(pattern) || []
      removedCount += matches.length
      content = content.replace(pattern, '')
    })

    // Remove excessive blank lines (more than 2 consecutive)
    content = content.replace(/\n\n\n+/g, '\n\n')

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8')
      modifiedFiles++
      totalRemoved += removedCount
      console.log(`${colors.green}✓${colors.reset} ${colors.gray}${filePath}${colors.reset} ${colors.yellow}(removed ${removedCount})${colors.reset}`)
    }

    totalFiles++
  } catch (error) {
    console.error(`${colors.red}Error processing file: ${filePath}${colors.reset}`)
  }
}

function processDirectory(dir) {
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
      processDirectory(fullPath)
    } else if (stat.isFile() && extensions.some((ext) => fullPath.endsWith(ext))) {
      removeConsoleFromFile(fullPath)
    }
  })
}

// Main execution
console.log(`\n${colors.cyan}🗑️  Removing console statements...${colors.reset}\n`)
console.log(`${colors.gray}Note: console.error and console.warn will be preserved${colors.reset}\n`)

searchDirs.forEach((dir) => {
  processDirectory(dir)
})

// Display results
console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`)
console.log(`${colors.green}✨ Cleanup complete!${colors.reset}`)
console.log(`  Files scanned: ${totalFiles}`)
console.log(`  Files modified: ${modifiedFiles}`)
console.log(`  Console statements removed: ${totalRemoved}`)
console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`)

if (modifiedFiles > 0) {
  console.log(`${colors.yellow}⚠️  Don't forget to test your app after removing console logs!${colors.reset}\n`)
}