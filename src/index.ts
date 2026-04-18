#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import { detectFramework } from "./analyzer/framework-detector";
import { WorkspaceService } from "./scaffolder/WorkspaceService";
import { AiAgent } from "./domain/enums/AiAgent";
import { SupportedStack } from "./domain/enums/SupportedStack";
import { IdeEnvironment } from "./domain/enums/IdeEnvironment";

const program = new Command();

program
  .name("ai-sdd-workspace")
  .description("AI - SDD Engine for Workspaces: Scaffolds an AI-friendly SDD ecosystem")
  .version("0.0.1");

program
  .command("init")
  .description("Initialize the SDD workspace in the current directory")
  .option("-i, --ide <name>", "Setup specific IDE ecosystem (e.g. vscode, cursor, windsurf)")
  .option("-a, --agents <list>", "Comma-separated list of AI agents to inject SDD rules (e.g. antigravity,copilot,cursor)")
  .option("--no-lint", "Skip automated Linter and Prettier injection")
  .action(async (options) => {
    console.log(chalk.blue.bold("\n🚀 Welcome to AI - SDD Engine for Workspaces!\n"));
    console.log(chalk.cyan("Starting the initialization process..."));

    let targetIde = options.ide;
    let targetAgents: AiAgent[] = [];

    if (options.agents) {
       const agentsList = options.agents.split(",").map((s: string) => s.trim().toLowerCase());
       for (const a of agentsList) {
          if (Object.values(AiAgent).includes(a as AiAgent)) {
             targetAgents.push(a as AiAgent);
          } else {
             console.log(chalk.yellow(`⚠️ Warning: Agent '${a}' is not recognized. Ignoring.`));
          }
       }
    }

    if (!targetIde && targetAgents.length === 0) {
      const answers = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirmInit",
          message: "Do you want to initialize the SDD structure and AI capabilities in this directory?",
          default: true,
        },
        {
          type: "list",
          name: "ide",
          message: "Which IDE ecosystem do you want to configure?",
          choices: ["none", ...Object.values(IdeEnvironment)],
          when: (answers) => answers.confirmInit,
        },
        {
          type: "checkbox",
          name: "selectedAgents",
          message: "Which AI agents are you using? (They will receive SDD rules)",
          choices: Object.values(AiAgent),
          when: (answers) => answers.confirmInit,
        },
      ]);

      if (!answers.confirmInit) {
        console.log(chalk.red("\nInitialization aborted by the user."));
        process.exit(0);
      }
      targetIde = answers.ide === "none" ? undefined : answers.ide;
      targetAgents = answers.selectedAgents || [];
    }

    if (targetAgents.length === 0 && !targetIde) {
      console.log(chalk.yellow("\nNo IDEs or Agents selected. Only standard folders will be generated."));
    }

    console.log(chalk.green("\n✅ Proceeding with initialization..."));

    const targetDir = process.cwd();
    const stacks = detectFramework(targetDir);

    console.log(
      chalk.yellow(`\n[Analyzer] Detected Stacks: ${chalk.bold(stacks.join(', '))}`),
    );
    console.log(chalk.cyan(`[Injector] Sideloading AI engineering rules and SDD framework...\n`));

    const orchestrator = new WorkspaceService();
    await orchestrator.execute(targetDir, stacks, targetIde, targetAgents, {
      skipLint: !options.lint,
    });

    console.log(chalk.green.bold("\n✨ Workspace successfully prepared for advanced Spec-Driven Development!"));
  });

program.parse(process.argv);
