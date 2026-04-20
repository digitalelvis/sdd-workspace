#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import { detectFramework } from "./analyzer/framework-detector";
import { WorkspaceService } from "./scaffolder/WorkspaceService";
import { ConfigResolver } from "./config/ConfigResolver";
import { AiAgent } from "./domain/enums/AiAgent";
import { IdeEnvironment } from "./domain/enums/IdeEnvironment";
import { LOCAL_CONFIG_FILENAME } from "./config/defaults";

const program = new Command();

program
  .name("sdd")
  .description("AI-SDD Workspace: Scaffolds an AI-friendly Spec-Driven Development ecosystem")
  .version("0.0.2");

// ─── init ────────────────────────────────────────────────────────────────────

program
  .command("init")
  .description("Initialize the SDD workspace in the current directory")
  .option("-i, --ide <name>", "Setup specific IDE ecosystem (e.g. vscode, cursor, windsurf)")
  .option("-a, --agents <list>", "Comma-separated list of AI agents (e.g. antigravity,cursor)")
  .option("--no-lint", "Skip automated Linter and Prettier injection")
  .action(async (options) => {
    console.log(chalk.blue.bold("\n🚀 Welcome to AI - SDD Engine for Workspaces!\n"));

    const targetDir = process.cwd();
    const resolver = new ConfigResolver();
    const orchestrator = new WorkspaceService();

    // Parse CLI agent flags
    let cliAgents: AiAgent[] = [];
    if (options.agents) {
      cliAgents = options.agents
        .split(",")
        .map((s: string) => s.trim().toLowerCase())
        .filter((a: string) => {
          const valid = Object.values(AiAgent).includes(a as AiAgent);
          if (!valid) console.log(chalk.yellow(`⚠️  Agent '${a}' not recognized. Ignoring.`));
          return valid;
        }) as AiAgent[];
    }

    // Interactive prompt only when no CLI flags provided
    let interactiveIde: string | undefined = options.ide;
    let interactiveAgents: AiAgent[] = cliAgents;

    if (!options.ide && cliAgents.length === 0) {
      const answers = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirmInit",
          message: "Initialize the SDD structure and AI capabilities in this directory?",
          default: true,
        },
        {
          type: "list",
          name: "ide",
          message: "Which IDE ecosystem do you want to configure?",
          choices: ["none", ...Object.values(IdeEnvironment)],
          when: (ans) => ans.confirmInit,
        },
        {
          type: "checkbox",
          name: "selectedAgents",
          message: "Which AI agents are you using? (They will receive SDD rules)",
          choices: Object.values(AiAgent),
          when: (ans) => ans.confirmInit,
        },
      ]);

      if (!answers.confirmInit) {
        console.log(chalk.red("\nInitialization aborted."));
        process.exit(0);
      }
      interactiveIde = answers.ide === "none" ? undefined : answers.ide;
      interactiveAgents = answers.selectedAgents ?? [];
    }

    // Detect stacks from project
    const stacks = detectFramework(targetDir);
    console.log(chalk.yellow(`\n[Analyzer] Detected Stacks: ${chalk.bold(stacks.join(", "))}`));

    // Collect built-in stack skills for the resolver
    const stackProviders = orchestrator.resolveStackProviders(stacks);
    const stackSkills = [...new Set(stackProviders.flatMap(p => p.defaultSkills))];

    // Resolve config through 4-layer hierarchy
    const resolved = resolver.resolve(
      { agents: interactiveAgents, ide: interactiveIde, lint: options.lint, stacks },
      stackSkills,
      targetDir,
    );
    resolved.stacks = stacks;

    console.log(chalk.cyan(`[Injector] Sideloading AI engineering rules and SDD framework...\n`));
    await orchestrator.execute(targetDir, resolved);

    // Persist resolved config to sdd.config.json
    const configContent = resolver.generateLocalConfigContent(resolved);
    orchestrator.writeLocalConfig(targetDir, configContent);

    console.log(chalk.green.bold("\n✨ Workspace successfully prepared for advanced Spec-Driven Development!"));
  });

// ─── apply ───────────────────────────────────────────────────────────────────

program
  .command("apply")
  .description(`Re-apply the workspace configuration from ${LOCAL_CONFIG_FILENAME}`)
  .action(async () => {
    console.log(chalk.blue.bold("\n🔄 Applying SDD Workspace Configuration...\n"));

    const targetDir = process.cwd();
    const resolver = new ConfigResolver();
    const orchestrator = new WorkspaceService();

    const localConfig = resolver.loadLocalConfig(targetDir);
    if (!localConfig) {
      console.error(chalk.red(`\n❌ No ${LOCAL_CONFIG_FILENAME} found in the current directory.`));
      console.log(chalk.yellow(`   Run ${chalk.bold("sdd init")} first to initialize your workspace.`));
      process.exit(1);
    }

    console.log(chalk.cyan(`  Found ${LOCAL_CONFIG_FILENAME} — resolving configuration...`));

    // Resolve with local config as the primary source
    const stackSkills = localConfig.skills?.include ?? [];
    const resolved = resolver.resolve(
      { agents: localConfig.agents, ide: localConfig.ide, lint: localConfig.lint, stacks: localConfig.stacks },
      stackSkills,
      targetDir,
    );
    resolved.stacks = localConfig.stacks ?? [];

    console.log(chalk.cyan(`[Injector] Re-injecting AI engineering rules and SDD framework...\n`));
    await orchestrator.execute(targetDir, resolved);

    // Update timestamp in sdd.config.json
    const updated = resolver.generateLocalConfigContent(resolved);
    orchestrator.writeLocalConfig(targetDir, updated);

    console.log(chalk.green.bold("\n✨ Workspace successfully re-applied!"));
  });

program.parse(process.argv);
