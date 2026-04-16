"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectArchitecture = injectArchitecture;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
function getTargetPath(toolName, targetDir) {
    switch (toolName) {
        case 'Cursor': return path_1.default.join(targetDir, '.cursor', 'rules', 'tlc-spec-driven');
        case 'Windsurf': return path_1.default.join(targetDir, '.windsurf', 'rules', 'tlc-spec-driven');
        case 'Claude Code': return path_1.default.join(targetDir, '.claude', 'skills', 'tlc-spec-driven');
        case 'Antigravity': return path_1.default.join(targetDir, '.gemini', 'antigravity', 'knowledge', 'tlc-spec-driven');
        case 'Generic VSCode (Copilot)': return path_1.default.join(targetDir, '.github', 'copilot-instructions', 'tlc-spec-driven');
        default: return path_1.default.join(targetDir, '.agents', 'skills', 'tlc-spec-driven');
    }
}
function injectArchitecture(targetDir, framework, tools) {
    try {
        const basePath = __dirname.includes('dist')
            ? path_1.default.join(__dirname, '..', '..', 'src', 'templates')
            : path_1.default.join(__dirname, '..', 'templates');
        // 1. Framework AI Rules
        const templateFileName = framework === 'nextjs' ? 'next-rules.md' : (framework === 'react' ? 'react-rules.md' : 'node-rules.md');
        const templatePath = path_1.default.join(basePath, templateFileName);
        let rulesContent = '';
        if (fs_1.default.existsSync(templatePath)) {
            rulesContent = fs_1.default.readFileSync(templatePath, 'utf-8');
        }
        else {
            rulesContent = `# ${framework.toUpperCase()} AI Environment Setup\nFollow standard SDD best practices.`;
        }
        const cursorRulesPath = path_1.default.join(targetDir, '.cursorrules');
        fs_1.default.writeFileSync(cursorRulesPath, rulesContent);
        console.log(chalk_1.default.green(`✔️  Generated general AI guidelines (.cursorrules).`));
        // 2. Local Skill Injection
        const skillSourceDir = path_1.default.join(basePath, 'skills', 'tlc-spec-driven');
        if (fs_1.default.existsSync(skillSourceDir)) {
            console.log(chalk_1.default.blue(`\n📥 Sideloading localized TLC Agent Skills...`));
            for (const tool of tools) {
                const destPath = getTargetPath(tool, targetDir);
                fs_1.default.cpSync(skillSourceDir, destPath, { recursive: true, force: true });
                console.log(chalk_1.default.magenta(`  ↳ Installed skills for ${chalk_1.default.bold(tool)} at ${destPath.replace(targetDir, '')}`));
            }
            console.log(chalk_1.default.green(`✔️  Injected living SDD document schemas successfully.`));
        }
        else {
            console.warn(chalk_1.default.yellow(`⚠️ Sideloaded skill resources not found at ${skillSourceDir}`));
        }
        // 3. Guarantee .specs structure tracking while ignoring agent local configs
        const gitignorePath = path_1.default.join(targetDir, '.gitignore');
        const ignoreBlock = `
# AI WORKSPACES IGNORE
.agents/
.claude/
.windsurf/
.cursor/
.gemini/
`;
        if (fs_1.default.existsSync(gitignorePath)) {
            const gitignoreContent = fs_1.default.readFileSync(gitignorePath, 'utf-8');
            if (!gitignoreContent.includes('# AI WORKSPACES IGNORE')) {
                fs_1.default.appendFileSync(gitignorePath, ignoreBlock);
                console.log(chalk_1.default.green(`✔️  Updated .gitignore to exclude agent runtime directories.`));
            }
        }
        else {
            fs_1.default.writeFileSync(gitignorePath, ignoreBlock.trimStart());
            console.log(chalk_1.default.green(`✔️  Created .gitignore to exclude agent runtime directories.`));
        }
        // Initialize root .specs folder
        const specsDir = path_1.default.join(targetDir, '.specs');
        if (!fs_1.default.existsSync(specsDir)) {
            fs_1.default.mkdirSync(specsDir, { recursive: true });
            fs_1.default.writeFileSync(path_1.default.join(specsDir, '.gitkeep'), '');
            console.log(chalk_1.default.green(`✔️  Scaffolded .specs workspace.`));
        }
    }
    catch (error) {
        console.error(chalk_1.default.red('\n❌ Critical Exception during Injection:'), error);
    }
}
