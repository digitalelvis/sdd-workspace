#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { detectFramework } from './analyzer/framework-detector';
import { injectArchitecture } from './scaffolder/injector';

const program = new Command();

program
  .name('ai-sdd-workspace')
  .description('AI - SDD Enginee for Workspaces: Scaffolds an AI-friendly SDD ecosystem')
  .version('0.0.1');

program
  .command('init')
  .description('Initialize the SDD workspace in the current directory')
  .action(async () => {
    console.log(chalk.blue.bold('\n🚀 Welcome to AI - SDD Enginee for Workspaces!\n'));
    console.log(chalk.cyan('Starting the initialization process...'));

    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmInit',
        message: 'Do you want to initialize the SDD structure and AI capabilities in this directory?',
        default: true
      }
    ]);

    if (answers.confirmInit) {
      console.log(chalk.green('\n✅ Proceeding with initialization...'));
      
      const targetDir = process.cwd();
      const framework = detectFramework(targetDir);
      
      console.log(chalk.yellow(`\n[Analyzer] Detected Target Framework: ${chalk.bold(framework)}`));
      console.log(chalk.cyan(`[Injector] Sideloading AI engineering rules and SDD framework...\n`));
      
      injectArchitecture(targetDir, framework);
      
      console.log(chalk.green.bold('\n✨ Workspace successfully prepared for advanced Spec-Driven Development!'));
    } else {
      console.log(chalk.red('\nInitialization aborted by the user.'));
    }
  });

program.parse(process.argv);
