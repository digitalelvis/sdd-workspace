#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const framework_detector_1 = require("./analyzer/framework-detector");
const injector_1 = require("./scaffolder/injector");
const program = new commander_1.Command();
program
    .name('ai-sdd-workspace')
    .description('AI - SDD Enginee for Workspaces: Scaffolds an AI-friendly SDD ecosystem')
    .version('0.0.1');
program
    .command('init')
    .description('Initialize the SDD workspace in the current directory')
    .action(async () => {
    console.log(chalk_1.default.blue.bold('\n🚀 Welcome to AI - SDD Enginee for Workspaces!\n'));
    console.log(chalk_1.default.cyan('Starting the initialization process...'));
    const answers = await inquirer_1.default.prompt([
        {
            type: 'confirm',
            name: 'confirmInit',
            message: 'Do you want to initialize the SDD structure and AI capabilities in this directory?',
            default: true
        }
    ]);
    if (answers.confirmInit) {
        console.log(chalk_1.default.green('\n✅ Proceeding with initialization...'));
        const targetDir = process.cwd();
        const framework = (0, framework_detector_1.detectFramework)(targetDir);
        console.log(chalk_1.default.yellow(`\n[Analyzer] Detected Target Framework: ${chalk_1.default.bold(framework)}`));
        console.log(chalk_1.default.cyan(`[Injector] Sideloading AI engineering rules and SDD framework...\n`));
        (0, injector_1.injectArchitecture)(targetDir, framework);
        console.log(chalk_1.default.green.bold('\n✨ Workspace successfully prepared for advanced Spec-Driven Development!'));
    }
    else {
        console.log(chalk_1.default.red('\nInitialization aborted by the user.'));
    }
});
program.parse(process.argv);
