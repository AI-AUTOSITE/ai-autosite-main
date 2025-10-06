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

// Helper function to safely remove console statements
function removeConsoleStatements(content, type) {
  const lines = content.split('\n')
  const result = []
  let skip = false
  let bracketCount = 0
  let inConsole = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    
    // Check if line starts a console statement we want to remove
    const startsConsole = new RegExp(`console\\.(${type})\\(`).test(trimmed)
    
    if (startsConsole && !inConsole) {
      inConsole = true
      skip = true
      bracketCount = 0
      
      // Count brackets in current line
      for (const char of line) {
        if (char === '(') bracketCount++
        if (char === ')') bracketCount--
      }
      
      // If brackets are balanced in same line, reset
      if (bracketCount === 0) {
        inConsole = false
        skip = false
      }
      continue
    }
    
    // If we're inside a console statement, track brackets
    if (inConsole) {
      for (const char of line) {
        if (char === '(') bracketCount++
        if (char === ')') bracketCount--
      }
      
      // When brackets are balanced, console statement is complete
      if (bracketCount === 0) {
        inConsole = false
        skip = false
      }
      continue
    }
    
    // Keep line if not skipping
    if (!skip) {
      result.push(line)
    }
  }
  
  return result.join('\n')
}

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
    
    // Remove console.log, debug, info, table (preserve error and warn)
    content = removeConsoleStatements(content, 'log')
    content = removeConsoleStatements(content, 'debug')
    content = removeConsoleStatements(content, 'info')
    content = removeConsoleStatements(content, 'table')
    
    // Count how many were removed
    const originalLines = originalContent.split('\n').length
    const newLines = content.split('\n').length
    const removedCount = originalLines - newLines

    // Remove excessive blank lines (more than 2 consecutive)
    content = content.replace(/\n\n\n+/g, '\n\n')

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8')
      modifiedFiles++
      totalRemoved += removedCount
      console.log(`${colors.green}✓${colors.reset} ${colors.gray}${filePath}${colors.reset} ${colors.yellow}(removed ${removedCount} lines)${colors.reset}`)
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