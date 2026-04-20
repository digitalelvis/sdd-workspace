import chalk from "chalk";
import inquirer from "inquirer";
import { detectFramework } from "../../../analyzer/framework-detector";
import { WorkspaceService } from "../../../scaffolder/WorkspaceService";
import { ConfigResolver } from "../../../config/ConfigResolver";
import { AiAgent } from "../../../domain/enums/AiAgent";
import { IdeEnvironment } from "../../../domain/enums/IdeEnvironment";

export interface InitOptions {
  ide?: string;
  agents?: string;
  lint: boolean;
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

  // 2. Interactive prompt only when no CLI flags provided
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

  // 3. Detect stacks and resolve config hierarchy
  const stacks = detectFramework(targetDir);
  console.log(chalk.yellow(`\n[Analyzer] Detected Stacks: ${chalk.bold(stacks.join(", "))}`));

  const stackProviders = orchestrator.resolveStackProviders(stacks);
  const stackSkills = [...new Set(stackProviders.flatMap(p => p.defaultSkills))];

  const resolved = resolver.resolve(
    { agents: interactiveAgents, ide: interactiveIde, lint: options.lint, stacks },
    stackSkills,
    targetDir,
  );
  resolved.stacks = stacks;

  // 4. Execute injection
  console.log(chalk.cyan(`[Injector] Sideloading AI engineering rules and SDD framework...\n`));
  await orchestrator.execute(targetDir, resolved);

  // 5. Persist resolved config to sdd.config.json
  const configContent = resolver.generateLocalConfigContent(resolved);
  orchestrator.writeLocalConfig(targetDir, configContent);

  console.log(chalk.green.bold("\n✨ Workspace successfully prepared for advanced Spec-Driven Development!"));
}
