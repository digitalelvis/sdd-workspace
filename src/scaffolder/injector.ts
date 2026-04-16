import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { SupportedFramework } from '../analyzer/framework-detector';

function getTargetPath(toolName: string, targetDir: string): string {
  switch(toolName) {
    case 'Cursor': return path.join(targetDir, '.cursor', 'rules', 'tlc-spec-driven');
    case 'Windsurf': return path.join(targetDir, '.windsurf', 'rules', 'tlc-spec-driven');
    case 'Claude Code': return path.join(targetDir, '.claude', 'skills', 'tlc-spec-driven');
    case 'Antigravity': return path.join(targetDir, '.gemini', 'antigravity', 'knowledge', 'tlc-spec-driven');
    case 'Generic VSCode (Copilot)': return path.join(targetDir, '.github', 'copilot-instructions', 'tlc-spec-driven');
    default: return path.join(targetDir, '.agents', 'skills', 'tlc-spec-driven');
  }
}

export function injectArchitecture(targetDir: string, framework: SupportedFramework, tools: string[]) {
  try {
    const basePath = __dirname.includes('dist') 
        ? path.join(__dirname, '..', '..', 'src', 'templates') 
        : path.join(__dirname, '..', 'templates');

    // 1. Framework AI Rules
    const templateFileName = framework === 'nextjs' ? 'next-rules.md' : (framework === 'react' ? 'react-rules.md' : 'node-rules.md');
    const templatePath = path.join(basePath, templateFileName);
    let rulesContent = '';
    
    if (fs.existsSync(templatePath)) {
        rulesContent = fs.readFileSync(templatePath, 'utf-8');
    } else {
        rulesContent = `# ${framework.toUpperCase()} AI Environment Setup\nFollow standard SDD best practices.`;
    }

    const cursorRulesPath = path.join(targetDir, '.cursorrules');
    fs.writeFileSync(cursorRulesPath, rulesContent);
    console.log(chalk.green(`✔️  Generated general AI guidelines (.cursorrules).`));

    // 2. Local Skill Injection
    const skillSourceDir = path.join(basePath, 'skills', 'tlc-spec-driven');
    if (fs.existsSync(skillSourceDir)) {
      console.log(chalk.blue(`\n📥 Sideloading localized TLC Agent Skills...`));
      
      for (const tool of tools) {
        const destPath = getTargetPath(tool, targetDir);
        fs.cpSync(skillSourceDir, destPath, { recursive: true, force: true });
        console.log(chalk.magenta(`  ↳ Installed skills for ${chalk.bold(tool)} at ${destPath.replace(targetDir, '')}`));
      }
      
      console.log(chalk.green(`✔️  Injected living SDD document schemas successfully.`));
    } else {
      console.warn(chalk.yellow(`⚠️ Sideloaded skill resources not found at ${skillSourceDir}`));
    }
    
    // 3. Guarantee .specs structure tracking while ignoring agent local configs
    const gitignorePath = path.join(targetDir, '.gitignore');
    const ignoreBlock = `
# AI WORKSPACES IGNORE
.agents/
.claude/
.windsurf/
.cursor/
.gemini/
`;
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
      if (!gitignoreContent.includes('# AI WORKSPACES IGNORE')) {
        fs.appendFileSync(gitignorePath, ignoreBlock);
        console.log(chalk.green(`✔️  Updated .gitignore to exclude agent runtime directories.`));
      }
    } else {
      fs.writeFileSync(gitignorePath, ignoreBlock.trimStart());
      console.log(chalk.green(`✔️  Created .gitignore to exclude agent runtime directories.`));
    }

    // Initialize root .specs folder
    const specsDir = path.join(targetDir, '.specs');
    if (!fs.existsSync(specsDir)) {
      fs.mkdirSync(specsDir, { recursive: true });
      fs.writeFileSync(path.join(specsDir, '.gitkeep'), '');
      console.log(chalk.green(`✔️  Scaffolded .specs workspace.`));
    }

  } catch (error) {
    console.error(chalk.red('\n❌ Critical Exception during Injection:'), error);
  }
}
