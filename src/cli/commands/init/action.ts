import chalk from "chalk";
import inquirer from "inquirer";
import { detectFramework } from "../../../analyzer/framework-detector";
import { detectDatabase } from "../../../analyzer/DatabaseDetector";
import { detectSecurity } from "../../../analyzer/SecurityDetector";
import { WorkspaceService } from "../../../scaffolder/WorkspaceService";
import { ConfigResolver } from "../../../config/ConfigResolver";
import { AiAgent } from "../../../domain/enums/AiAgent";
import { IdeEnvironment } from "../../../domain/enums/IdeEnvironment";
import { SupportedDatabase } from "../../../domain/enums/SupportedDatabase";
import { SupportedStack } from "../../../domain/enums/SupportedStack";

import { RegistryLoader } from "../../../resources/RegistryLoader";

export interface InitOptions {
  ide?: string;
  agents?: string;
  lint?: boolean;
}

/**
 * Action handler for the 'sdd init' command.
 * Orchestrates stack detection, config resolution, and workspace injection.
 */
export async function initAction(options: InitOptions): Promise<void> {
  console.log(chalk.blue.bold("\n🚀 Welcome to AI - SDD Engine for Workspaces!\n"));

  const targetDir = process.cwd();
  const resolver = new ConfigResolver();
  const orchestrator = new WorkspaceService();
  const registry = RegistryLoader.load();

  // 1. Parse CLI agent flags
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

  // 2. Initial Analyzers (Internal)
  const detectedStacks = detectFramework(targetDir);
  const detectedDbs = detectDatabase(targetDir, registry.databases);
  const detectedSecurity = detectSecurity(targetDir);

  // 3. Interactive prompt logic
  let interactiveIde: string | undefined = options.ide;
  let interactiveAgents: AiAgent[] = cliAgents;
  let interactiveDbs: SupportedDatabase[] = detectedDbs;
  let interactiveStacks: SupportedStack[] = detectedStacks;

  // Prompt for confirmInit and basic settings if not enough CLI flags
  if (!options.ide && cliAgents.length === 0) {
    const basicAnswers = await inquirer.prompt([
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
      }
    ]);

    if (!basicAnswers.confirmInit) {
      console.log(chalk.red("\nInitialization aborted."));
      process.exit(0);
    }
    interactiveIde = basicAnswers.ide === "none" ? undefined : basicAnswers.ide;
    interactiveAgents = basicAnswers.selectedAgents ?? [];
  }

  // 4. Handle Stacks (Fallback if none detected)
  if (interactiveStacks.length === 0) {
    console.log(chalk.yellow(`\n[Analyzer] No stacks detected in this directory.`));
    const stackAnswer = await inquirer.prompt([
      {
        type: "list",
        name: "stack",
        message: "How would you like to proceed with the stack configuration?",
        choices: [
          { name: "I will create it with AI, I don't know the stack", value: SupportedStack.AI_GENERIC },
          new inquirer.Separator(),
          ...Object.values(SupportedStack)
            .filter(s => s !== SupportedStack.AI_GENERIC)
            .map(s => ({ name: s, value: s }))
        ]
      }
    ]);
    interactiveStacks = [stackAnswer.stack as SupportedStack];
  } else {
    console.log(chalk.yellow(`\n[Analyzer] Detected Stacks: ${chalk.bold(interactiveStacks.join(", "))}`));
  }

  // 5. Handle Databases (Only prompt if none detected)
  if (interactiveDbs.length === 0) {
    const dbAnswer = await inquirer.prompt([
      {
        type: "checkbox",
        name: "selectedDbs",
        message: "No database detected. Select the databases you plan to use:",
        choices: [
          { name: "None", value: SupportedDatabase.NONE },
          ...Object.values(SupportedDatabase).filter(d => d !== SupportedDatabase.NONE)
        ],
        default: [SupportedDatabase.NONE]
      }
    ]);
    interactiveDbs = dbAnswer.selectedDbs.includes(SupportedDatabase.NONE) ? [] : dbAnswer.selectedDbs;
  }

  const resolved = resolver.resolve(
    { agents: interactiveAgents, ide: interactiveIde, lint: options.lint, stacks: interactiveStacks, database: interactiveDbs, security: detectedSecurity },
    targetDir,
  );

  // 4. Execute injection
  console.log(chalk.cyan(`[Injector] Sideloading AI engineering rules and SDD framework...\n`));
  await orchestrator.execute(targetDir, resolved);

  // 5. Persist resolved config to sdd.config.json
  const configContent = resolver.generateLocalConfigContent(resolved);
  orchestrator.writeLocalConfig(targetDir, configContent);

  console.log(chalk.green.bold("\n✨ Workspace successfully prepared for advanced Spec-Driven Development!"));
}
