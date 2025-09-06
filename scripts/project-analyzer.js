#!/usr/bin/env node

/**
 * BOB Project Analyzer
 *
 * Analyzes the actual project and updates BOB's documentation with real project data:
 * - Updates docs/ARCHITECTURE.md with real components and structure
 * - Updates injection points with actual file paths
 * - Updates component maps with real components
 * - Creates project-specific injection points
 * - Updates file structure documentation
 *
 * Usage: node scripts/project-analyzer.js
 */

const fs = require('fs');
const path = require('path');

function scanDirectory(dir, extensions = ['.js', '.jsx', '.ts', '.tsx']) {
  const results = { files: [], dirs: [] };

  function scan(currentPath) {
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip common directories
        if (!['node_modules', '.git', '.next', 'dist', 'build', '.bob'].includes(item)) {
          results.dirs.push(fullPath);
          scan(fullPath);
        }
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (extensions.includes(ext)) {
          results.files.push(fullPath);
        }
      }
    }
  }

  scan(dir);
  return results;
}

function analyzeComponents(files) {
  const components = [];
  const imports = new Map();

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');

      // Look for React component patterns
      const componentPatterns = [
        /export\s+(?:default\s+)?(?:function|const|class)\s+(\w+)/g,
        /function\s+(\w+)\s*\(/g,
        /const\s+(\w+)\s*=\s*\(/g,
        /const\s+(\w+)\s*=\s*\(\)\s*=>\s*\{/g,
      ];

      const fileComponents = [];
      for (const pattern of componentPatterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const componentName = match[1];
          if (componentName && componentName[0] === componentName[0].toUpperCase()) {
            fileComponents.push(componentName);
          }
        }
      }

      if (fileComponents.length > 0) {
        components.push({
          file: path.relative(process.cwd(), file),
          components: [...new Set(fileComponents)],
          lines: lines.length,
          size: fs.statSync(file).size
        });

        // Analyze imports
        const importMatches = content.match(/import\s+.*from\s+['"]([^'"]+)['"]/g) || [];
        for (const importMatch of importMatches) {
          const importPath = importMatch.match(/from\s+['"]([^'"]+)['"]/)[1];
          if (!imports.has(importPath)) {
            imports.set(importPath, []);
          }
          imports.get(importPath).push(path.relative(process.cwd(), file));
        }
      }
    } catch (error) {
      // Skip files that can't be read
      continue;
    }
  }

  return { components, imports: Object.fromEntries(imports) };
}

function detectFramework(files) {
  let framework = 'Unknown';
  let version = 'Unknown';

  // Check for Next.js
  const hasNextConfig = files.some(file => file.includes('next.config.'));
  const hasAppDir = fs.existsSync('app') || fs.existsSync('src/app');
  if (hasNextConfig || hasAppDir) {
    framework = 'Next.js';
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      version = packageJson.dependencies?.['next'] || packageJson.devDependencies?.['next'] || 'Unknown';
    } catch (e) {}
  }

  // Check for Vite
  const hasViteConfig = files.some(file => file.includes('vite.config.'));
  if (hasViteConfig && framework === 'Unknown') {
    framework = 'Vite';
  }

  // Check for React
  const hasReact = files.some(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      return content.includes('import React') || content.includes('from "react"');
    } catch (e) {
      return false;
    }
  });

  if (hasReact && framework === 'Unknown') {
    framework = 'React';
  }

  return { framework, version };
}

function updateArchitectureDoc(analysis) {
  const architecturePath = 'docs/ARCHITECTURE.md';

  let content = `# Architecture Overview

## 🎯 Framework & Tech Stack
- **Framework:** ${analysis.framework}
- **Version:** ${analysis.version}
- **Database:** ${analysis.database || 'Not detected'}
- **Authentication:** ${analysis.auth || 'Not detected'}

## 🏗️ Component Architecture

### Components Found (${analysis.components.length})
`;

  for (const comp of analysis.components.slice(0, 20)) { // Limit to first 20
    content += `#### ${comp.file}
- **Components:** ${comp.components.join(', ')}
- **Lines:** ${comp.lines}
- **Size:** ${Math.round(comp.size / 1024)}KB

`;
  }

  if (analysis.components.length > 20) {
    content += `*... and ${analysis.components.length - 20} more components*\n\n`;
  }

  content += `## 📁 Project Structure
\`\`\`
${analysis.structure || 'Project structure analysis pending'}
\`\`\`

## 🔗 Component Relationships
- **Total Components:** ${analysis.components.length}
- **Import Relationships:** ${Object.keys(analysis.imports || {}).length} unique imports
- **Main Entry Points:** ${analysis.entryPoints || 'Analysis pending'}

## 📊 Code Metrics
- **Total Files:** ${analysis.totalFiles || 0}
- **Total Lines:** ${analysis.totalLines || 0}
- **Average File Size:** ${analysis.avgFileSize || 0}KB

---
*This architecture documentation is automatically generated by BOB's project analyzer.*
`;

  fs.writeFileSync(architecturePath, content);
  console.log(`✅ Updated ${architecturePath} with real project data`);
}

function updateInjectionPoints(analysis) {
  const injectionPath = 'docs/injection-points/task-specific.md';

  try {
    let content = fs.readFileSync(injectionPath, 'utf8');

    // Update component creation injection
    if (analysis.components.length > 0) {
      const firstComponent = analysis.components[0];
      content = content.replace(
        /Files to Read:[\s\S]*?components\.tsx \(lines 1-20\) - shadcn\/ui example/,
        `Files to Read:
- ${firstComponent.file} (lines 1-20) - Project component example
- /docs/ARCHITECTURE.md (lines 15-40) - Component architecture
- /docs/FILE_STRUCTURE.md (lines 25-75) - Component patterns`
      );
    }

    // Update file paths based on actual project
    content = content.replace(/\/src\/components\/ui\/button\.tsx/g, analysis.components[0]?.file || '/src/components/Example.tsx');
    content = content.replace(/\/src\/services\/db\.ts/g, '/src/services/database.ts'); // Generic adjustment

    fs.writeFileSync(injectionPath, content);
    console.log(`✅ Updated ${injectionPath} with real file paths`);
  } catch (error) {
    console.log(`⚠️ Could not update injection points: ${error.message}`);
  }
}

function generateComponentMap(analysis) {
  const mapPath = 'docs/COMPONENT_MAP.md';

  let content = `# Component Map - Auto-Generated

## 🗺️ Component Relationships

### Components by File
`;

  for (const comp of analysis.components) {
    content += `#### ${path.basename(comp.file)}
**File:** \`${comp.file}\`
**Components:** ${comp.components.join(', ')}
**Relationships:**
- Imports: ${Object.keys(analysis.imports || {}).filter(imp =>
  (analysis.imports[imp] || []).includes(comp.file)
).length} files
- Exports: ${comp.components.length} components

`;
  }

  content += `## 📊 Component Statistics
- **Total Components:** ${analysis.components.length}
- **Files with Components:** ${new Set(analysis.components.map(c => c.file)).size}
- **Average Components per File:** ${(analysis.components.length / analysis.components.length).toFixed(1)}

## 🔄 Data Flow
*Component relationship analysis pending - BOB will enhance this with usage data*

---
*This component map is automatically generated by BOB's project analyzer.*
`;

  fs.writeFileSync(mapPath, content);
  console.log(`✅ Generated ${mapPath} with real component relationships`);
}

// Main analysis function
function analyzeProject() {
  console.log('🔍 BOB Project Analyzer starting...');

  const scanResults = scanDirectory('.');
  console.log(`📁 Found ${scanResults.files.length} source files`);

  const { framework, version } = detectFramework(scanResults.files);
  console.log(`🎯 Detected Framework: ${framework} ${version}`);

  const { components, imports } = analyzeComponents(scanResults.files);
  console.log(`🧩 Found ${components.length} components across ${new Set(components.map(c => c.file)).size} files`);

  const analysis = {
    framework,
    version,
    components,
    imports,
    totalFiles: scanResults.files.length,
    structure: generateStructureOutput(scanResults),
    database: detectDatabase(scanResults.files),
    auth: detectAuth(scanResults.files)
  };

  // Update BOB's documentation with real project data
  updateArchitectureDoc(analysis);
  updateInjectionPoints(analysis);
  generateComponentMap(analysis);

  // Update config with project info
  updateBobConfig(analysis);

  console.log('🎉 BOB analysis complete! Documentation updated with real project data.');
  console.log('📝 Check docs/ARCHITECTURE.md and docs/COMPONENT_MAP.md for your actual project structure.');
}

function generateStructureOutput(scanResults) {
  // Simple structure representation
  const dirs = scanResults.dirs.slice(0, 10).map(dir => `├── ${path.basename(dir)}/`).join('\n');
  return `project-root/
${dirs}
└── ... (${scanResults.dirs.length - 10} more directories)`;
}

function detectDatabase(files) {
  const hasSupabase = files.some(file => {
    try {
      return fs.readFileSync(file, 'utf8').includes('supabase');
    } catch (e) {
      return false;
    }
  });
  return hasSupabase ? 'Supabase' : 'Not detected';
}

function detectAuth(files) {
  const hasAuth = files.some(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      return content.includes('auth') || content.includes('Auth');
    } catch (e) {
      return false;
    }
  });
  return hasAuth ? 'Authentication system detected' : 'Not detected';
}

function updateBobConfig(analysis) {
  const configPath = 'bob-config.json';
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    config.project.framework = analysis.framework;
    config.project.name = path.basename(process.cwd());
    config.project.type = `${analysis.framework} Application`;

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`✅ Updated ${configPath} with project information`);
  } catch (error) {
    console.log(`⚠️ Could not update config: ${error.message}`);
  }
}

// Run analysis if called directly
if (require.main === module) {
  analyzeProject();
}

module.exports = { analyzeProject, scanDirectory, analyzeComponents };
