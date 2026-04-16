#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import { detectFramework } from "./analyzer/framework-detector";
import { WorkspaceService } from "./scaffolder/WorkspaceService";
import { AiTool } from "./domain/enums/AiTool";

const program = new Command();

program
  .name("ai-sdd-workspace")
  .description(
    "AI - SDD Enginee for Workspaces: Scaffolds an AI-friendly SDD ecosystem",
  )
  .version("0.0.1");

program
  .command("init")
  .description("Initialize the SDD workspace in the current directory")
  .option("--cursor", "Setup for Cursor IDE")
  .option("--windsurf", "Setup for Windsurf IDE")
  .option("--antigravity", "Setup for Antigravity")
  .option("--vscode", "Setup for Generic VSCode (Copilot)")
  .option("--no-lint", "Skip automated Linter and Prettier injection")
  .action(async (options) => {
    console.log(
      chalk.blue.bold("\n🚀 Welcome to AI - SDD Enginee for Workspaces!\n"),
    );
    console.log(chalk.cyan("Starting the initialization process..."));

    const providedTools: AiTool[] = [];
    if (options.cursor) providedTools.push(AiTool.CURSOR);
    if (options.windsurf) providedTools.push(AiTool.WINDSURF);
    if (options.antigravity) providedTools.push(AiTool.ANTIGRAVITY);
    if (options.vscode) providedTools.push(AiTool.VSCODE);

    let tools = providedTools;

    if (tools.length === 0) {
      const answers = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirmInit",
          message:
            "Do you want to initialize the SDD structure and AI capabilities in this directory?",
          default: true,
        },
        {
          type: "checkbox",
          name: "selectedTools",
          message: "Which assistants/IDEs are you using in this workspace?",
          choices: [
            AiTool.CURSOR,
            AiTool.WINDSURF,
            AiTool.ANTIGRAVITY,
            AiTool.VSCODE,
          ],
          when: (answers) => answers.confirmInit,
        },
      ]);

      if (!answers.confirmInit) {
        console.log(chalk.red("\nInitialization aborted by the user."));
        process.exit(0);
      }
      tools = answers.selectedTools;
    }

    if (tools.length === 0) {
      console.log(
        chalk.yellow(
          "\nNo IDEs/assistants selected. Only standard folders will be generated.",
        ),
      );
    }

    console.log(chalk.green("\n✅ Proceeding with initialization..."));

    const targetDir = process.cwd();
    const framework = detectFramework(targetDir);

    console.log(
      chalk.yellow(
        `\n[Analyzer] Detected Target Framework: ${chalk.bold(framework)}`,
      ),
    );
    console.log(
      chalk.cyan(
        `[Injector] Sideloading AI engineering rules and SDD framework...\n`,
      ),
    );

    const orchestrator = new WorkspaceService();
    orchestrator.execute(targetDir, framework, tools, {
      skipLint: !options.lint,
    });

    console.log(
      chalk.green.bold(
        "\n✨ Workspace successfully prepared for advanced Spec-Driven Development!",
      ),
    );
  });

program.parse(process.argv);
