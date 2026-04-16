import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { specTemplates } from '../templates/spec-kit-wrapper';
import { SupportedFramework } from '../analyzer/framework-detector';

export function injectArchitecture(targetDir: string, framework: SupportedFramework) {
  try {
    // Determine which template file to load
    const templateFileName = framework === 'nextjs' ? 'next-rules.md' : (framework === 'react' ? 'react-rules.md' : 'node-rules.md');
    
    // Attempt resolving path based on current script execution (ts-node vs compiled output)
    const basePath = __dirname.includes('dist') 
        ? path.join(__dirname, '..', '..', 'src', 'templates') 
        : path.join(__dirname, '..', 'templates');
        
    let rulesContent = '';
    const templatePath = path.join(basePath, templateFileName);
    
    if (fs.existsSync(templatePath)) {
        rulesContent = fs.readFileSync(templatePath, 'utf-8');
    } else {
        console.warn(chalk.yellow(`⚠️ Could not strictly locate the rules template at ${templatePath}, falling back to barebones prompt.`));
        rulesContent = `# ${framework.toUpperCase()} AI Environment Setup\nFollow standard SDD best practices.`;
    }

    // 1. Write the .cursorrules file
    const cursorRulesPath = path.join(targetDir, '.cursorrules');
    fs.writeFileSync(cursorRulesPath, rulesContent);
    console.log(chalk.green(`✔️  Generated .cursorrules containing robust ${framework} boundaries.`));

    // 2. Generate Spec-Driven Directories and Initial Files
    const sddPaths = {
      spec: path.join(targetDir, 'specs'),
      plan: path.join(targetDir, 'plans'),
      task: path.join(targetDir, 'tasks'),
    };

    // Safely create directories if they don't exist
    for (const p of Object.values(sddPaths)) {
      if (!fs.existsSync(p)) fs.mkdirSync(p);
    }

    // Write default Markdown templates into the architecture
    const specFile = path.join(sddPaths.spec, 'spec.md');
    if (!fs.existsSync(specFile)) fs.writeFileSync(specFile, specTemplates.specInit);

    const planFile = path.join(sddPaths.plan, 'plan.md');
    if (!fs.existsSync(planFile)) fs.writeFileSync(planFile, specTemplates.planInit);

    const taskFile = path.join(sddPaths.task, 'tasks.md');
    if (!fs.existsSync(taskFile)) fs.writeFileSync(taskFile, specTemplates.taskInit);

    console.log(chalk.green(`✔️  Injected living SDD document schemas (specs/, plans/, tasks/).`));

  } catch (error) {
    console.error(chalk.red('\n❌ Critical Exception during Injection:'), error);
  }
}
