// scripts/import-tools.js
// Tool Import Utility - Import tools from other projects

const fs = require('fs')
const path = require('path')

// ========================================
// Configuration
// ========================================

// Define your external projects here
const EXTERNAL_PROJECTS = [
  {
    name: 'project-1',
    path: '../path-to-project-1', // Adjust path to your project
    tools: [
      {
        id: 'example-tool-1',
        sourcePath: 'src/tools/example',
        targetPath: 'app/tools/example-tool-1',
        category: 'quick-tools',
        config: {
          name: 'Example Tool 1',
          description: 'Description for example tool 1',
          icon: '🔧',
          color: 'from-blue-500 to-cyan-500',
          status: 'live',
          tags: ['example', 'import'],
          difficulty: 'Beginner',
          timeToUse: '1 minute',
          users: '0',
          pricing: 'free',
          dataProcessing: 'local'
        }
      }
    ]
  },
  // Add more projects here
]

// ========================================
// Import Functions
// ========================================

/**
 * Copy directory recursively
 */
function copyDirectory(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true })
  }

  const files = fs.readdirSync(source)
  
  files.forEach(file => {
    const sourcePath = path.join(source, file)
    const targetPath = path.join(target, file)
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, targetPath)
    } else {
      fs.copyFileSync(sourcePath, targetPath)
      console.log(`  ✓ Copied: ${file}`)
    }
  })
}

/**
 * Update imports in copied files
 */
function updateImports(filePath, projectName) {
  const content = fs.readFileSync(filePath, 'utf8')
  
  // Common import replacements
  const replacements = [
    // Update relative imports to use @ alias
    { from: /from ['"]\.\.\/\.\.\/components/g, to: "from '@/components" },
    { from: /from ['"]\.\.\/\.\.\/lib/g, to: "from '@/lib" },
    { from: /from ['"]\.\.\/\.\.\/utils/g, to: "from '@/utils" },
    
    // Update project-specific imports
    { from: new RegExp(`from ['"]${projectName}/components`, 'g'), to: "from '@/components" },
    { from: new RegExp(`from ['"]${projectName}/lib`, 'g'), to: "from '@/lib" },
  ]
  
  let updatedContent = content
  replacements.forEach(({ from, to }) => {
    updatedContent = updatedContent.replace(from, to)
  })
  
  fs.writeFileSync(filePath, updatedContent)
}

/**
 * Create wrapper page for imported tool
 */
function createWrapperPage(tool, projectName) {
  const wrapperContent = `// Auto-generated wrapper for imported tool
// Source: ${projectName}/${tool.sourcePath}

'use client'

import UnifiedToolLayout from '@/components/common/UnifiedToolLayout'
import ToolComponent from './components/ToolComponent'

const TOOL_CONFIG = ${JSON.stringify(tool.config, null, 2)}

export default function ${tool.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Page() {
  return (
    <UnifiedToolLayout
      toolId="${tool.id}"
      title={TOOL_CONFIG.name}
      description={TOOL_CONFIG.description}
    >
      <ToolComponent />
    </UnifiedToolLayout>
  )
}
`

  const pagePath = path.join(tool.targetPath, 'page.tsx')
  fs.writeFileSync(pagePath, wrapperContent)
  console.log(`  ✓ Created wrapper page`)
}

/**
 * Add tool to categories config
 */
function addToConfig(tool, projectName) {
  const configPath = path.join(__dirname, '../app/lib/categories.config.ts')
  const config = fs.readFileSync(configPath, 'utf8')
  
  // Find TOOLS array
  const toolsMatch = config.match(/export const TOOLS: Tool\[\] = \[([\s\S]*?)\]/)
  if (!toolsMatch) {
    console.error('  ✗ Could not find TOOLS array in config')
    return
  }
  
  // Create tool entry
  const toolEntry = `
  {
    id: '${tool.id}',
    name: '${tool.config.name}',
    description: '${tool.config.description}',
    category: '${tool.category}',
    icon: '${tool.config.icon}',
    color: '${tool.config.color}',
    status: '${tool.config.status}',
    url: '/tools/${tool.id}',
    tags: ${JSON.stringify(tool.config.tags)},
    difficulty: '${tool.config.difficulty}',
    timeToUse: '${tool.config.timeToUse}',
    users: '${tool.config.users}',
    pricing: '${tool.config.pricing}',
    dataProcessing: '${tool.config.dataProcessing}',
    projectSource: '${projectName}',
    featured: false,
    new: true
  },`

  // Insert before last closing bracket
  const insertPosition = config.lastIndexOf(']')
  const updatedConfig = 
    config.slice(0, insertPosition - 1) + 
    ',' + toolEntry + 
    config.slice(insertPosition)
  
  fs.writeFileSync(configPath, updatedConfig)
  console.log(`  ✓ Added to categories.config.ts`)
}

/**
 * Import a single tool
 */
function importTool(tool, project) {
  console.log(`\nImporting: ${tool.id}`)
  
  try {
    // 1. Copy tool files
    const sourcePath = path.join(project.path, tool.sourcePath)
    const targetPath = path.join(__dirname, '..', tool.targetPath)
    
    if (!fs.existsSync(sourcePath)) {
      console.error(`  ✗ Source not found: ${sourcePath}`)
      return false
    }
    
    console.log(`  Copying from: ${sourcePath}`)
    console.log(`  Copying to: ${targetPath}`)
    copyDirectory(sourcePath, targetPath)
    
    // 2. Update imports in all copied files
    const updateFiles = (dir) => {
      const files = fs.readdirSync(dir)
      files.forEach(file => {
        const filePath = path.join(dir, file)
        if (fs.statSync(filePath).isDirectory()) {
          updateFiles(filePath)
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          updateImports(filePath, project.name)
          console.log(`  ✓ Updated imports in: ${file}`)
        }
      })
    }
    updateFiles(targetPath)
    
    // 3. Create wrapper page if needed
    const pagePath = path.join(targetPath, 'page.tsx')
    if (!fs.existsSync(pagePath)) {
      createWrapperPage(tool, project.name)
    }
    
    // 4. Add to config
    addToConfig(tool, project.name)
    
    console.log(`✅ Successfully imported: ${tool.id}`)
    return true
  } catch (error) {
    console.error(`❌ Failed to import ${tool.id}:`, error.message)
    return false
  }
}

/**
 * Main import process
 */
function main() {
  console.log('🚀 Starting tool import process...\n')
  
  let successCount = 0
  let failCount = 0
  
  EXTERNAL_PROJECTS.forEach(project => {
    console.log(`\n📦 Processing project: ${project.name}`)
    console.log(`   Path: ${project.path}`)
    
    project.tools.forEach(tool => {
      if (importTool(tool, project)) {
        successCount++
      } else {
        failCount++
      }
    })
  })
  
  console.log('\n' + '='.repeat(50))
  console.log('📊 Import Summary:')
  console.log(`   ✅ Success: ${successCount} tools`)
  console.log(`   ❌ Failed: ${failCount} tools`)
  console.log('='.repeat(50))
  
  if (successCount > 0) {
    console.log('\n⚠️  Next steps:')
    console.log('1. Run: npm install (if new dependencies were added)')
    console.log('2. Test each imported tool')
    console.log('3. Update tool icons and descriptions as needed')
    console.log('4. Commit changes to git')
  }
}

// ========================================
// Validation Functions
// ========================================

/**
 * Validate project configuration
 */
function validateConfig() {
  const errors = []
  
  EXTERNAL_PROJECTS.forEach(project => {
    if (!project.name) errors.push('Project missing name')
    if (!project.path) errors.push(`Project ${project.name} missing path`)
    if (!project.tools || project.tools.length === 0) {
      errors.push(`Project ${project.name} has no tools defined`)
    }
    
    project.tools.forEach(tool => {
      if (!tool.id) errors.push(`Tool missing id in ${project.name}`)
      if (!tool.sourcePath) errors.push(`Tool ${tool.id} missing sourcePath`)
      if (!tool.targetPath) errors.push(`Tool ${tool.id} missing targetPath`)
      if (!tool.category) errors.push(`Tool ${tool.id} missing category`)
      if (!tool.config) errors.push(`Tool ${tool.id} missing config`)
    })
  })
  
  if (errors.length > 0) {
    console.error('❌ Configuration errors:')
    errors.forEach(error => console.error(`   - ${error}`))
    process.exit(1)
  }
}

/**
 * Check for conflicts
 */
function checkConflicts() {
  const configPath = path.join(__dirname, '../app/lib/categories.config.ts')
  if (!fs.existsSync(configPath)) {
    console.error('❌ categories.config.ts not found')
    process.exit(1)
  }
  
  const config = fs.readFileSync(configPath, 'utf8')
  const conflicts = []
  
  EXTERNAL_PROJECTS.forEach(project => {
    project.tools.forEach(tool => {
      if (config.includes(`id: '${tool.id}'`)) {
        conflicts.push(tool.id)
      }
    })
  })
  
  if (conflicts.length > 0) {
    console.error('⚠️  Tool ID conflicts detected:')
    conflicts.forEach(id => console.error(`   - ${id} already exists`))
    console.log('\nWould you like to continue anyway? (y/n)')
    
    // In production, you might want to handle this interactively
    // For now, we'll just warn
  }
}

// ========================================
// Run the import
// ========================================

if (require.main === module) {
  validateConfig()
  checkConflicts()
  main()
}

module.exports = {
  importTool,
  EXTERNAL_PROJECTS
}