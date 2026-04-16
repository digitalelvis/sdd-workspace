"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectArchitecture = injectArchitecture;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const spec_kit_wrapper_1 = require("../templates/spec-kit-wrapper");
function injectArchitecture(targetDir, framework) {
    try {
        // Determine which template file to load
        const templateFileName = framework === 'nextjs' ? 'next-rules.md' : (framework === 'react' ? 'react-rules.md' : 'node-rules.md');
        // Attempt resolving path based on current script execution (ts-node vs compiled output)
        const basePath = __dirname.includes('dist')
            ? path_1.default.join(__dirname, '..', '..', 'src', 'templates')
            : path_1.default.join(__dirname, '..', 'templates');
        let rulesContent = '';
        const templatePath = path_1.default.join(basePath, templateFileName);
        if (fs_1.default.existsSync(templatePath)) {
            rulesContent = fs_1.default.readFileSync(templatePath, 'utf-8');
        }
        else {
            console.warn(chalk_1.default.yellow(`⚠️ Could not strictly locate the rules template at ${templatePath}, falling back to barebones prompt.`));
            rulesContent = `# ${framework.toUpperCase()} AI Environment Setup\nFollow standard SDD best practices.`;
        }
        // 1. Write the .cursorrules file
        const cursorRulesPath = path_1.default.join(targetDir, '.cursorrules');
        fs_1.default.writeFileSync(cursorRulesPath, rulesContent);
        console.log(chalk_1.default.green(`✔️  Generated .cursorrules containing robust ${framework} boundaries.`));
        // 2. Generate Spec-Driven Directories and Initial Files
        const sddPaths = {
            spec: path_1.default.join(targetDir, 'specs'),
            plan: path_1.default.join(targetDir, 'plans'),
            task: path_1.default.join(targetDir, 'tasks'),
        };
        // Safely create directories if they don't exist
        for (const p of Object.values(sddPaths)) {
            if (!fs_1.default.existsSync(p))
                fs_1.default.mkdirSync(p);
        }
        // Write default Markdown templates into the architecture
        const specFile = path_1.default.join(sddPaths.spec, 'spec.md');
        if (!fs_1.default.existsSync(specFile))
            fs_1.default.writeFileSync(specFile, spec_kit_wrapper_1.specTemplates.specInit);
        const planFile = path_1.default.join(sddPaths.plan, 'plan.md');
        if (!fs_1.default.existsSync(planFile))
            fs_1.default.writeFileSync(planFile, spec_kit_wrapper_1.specTemplates.planInit);
        const taskFile = path_1.default.join(sddPaths.task, 'tasks.md');
        if (!fs_1.default.existsSync(taskFile))
            fs_1.default.writeFileSync(taskFile, spec_kit_wrapper_1.specTemplates.taskInit);
        console.log(chalk_1.default.green(`✔️  Injected living SDD document schemas (specs/, plans/, tasks/).`));
    }
    catch (error) {
        console.error(chalk_1.default.red('\n❌ Critical Exception during Injection:'), error);
    }
}
