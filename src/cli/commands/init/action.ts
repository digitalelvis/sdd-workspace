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
import { ExistenceChecker } from "../../../utils/ExistenceChecker";

import { RegistryLoader } from "../../../resources/RegistryLoader";
import { TerminalUi } from "../../../ui";
import pkg from "../../../../package.json";

export interface InitOptions {
  ide?: string;
  agents?: string;
  lint?: boolean;
  gitStrategy?: string;
}

/**
 * Action handler for the 'sdd init' command.
 * Orchestrates stack detection, config resolution, and workspace injection.
 */
export async function initAction(options: InitOptions): Promise<void> {
  TerminalUi.printBanner({
    headline: "AI SDD ENGINE",
    version: pkg.version,
    tagline: "Curated workflows to power your coding agents",
  });
  TerminalUi.footerHints([
    { key: "space", text: "toggle choices", variant: "default" },
    { key: "enter", text: "confirm", variant: "success" },
    { key: "esc", text: "back", variant: "warn" },
  ]);

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
        if (!valid)
          TerminalUi.warnLine(`Agent '${a}' not recognized. Ignoring.`);
        return valid;
      }) as AiAgent[];
  }

  // Step 1: Detection Summary
  const detectedStacks = detectFramework(targetDir);
  const detectedDbs = detectDatabase(targetDir, registry.databases);
  const detectedSecurity = detectSecurity(targetDir);

  TerminalUi.section("Detected project DNA");
  TerminalUi.kv(
    "Stacks",
    detectedStacks.length > 0 ? detectedStacks.join(", ") : "(none detected)",
  );
  TerminalUi.kv(
    "Databases",
    detectedDbs.length > 0 ? detectedDbs.join(", ") : "(none detected)",
  );
  TerminalUi.kv(
    "Security",
    detectedSecurity.length > 0
      ? detectedSecurity.join(", ")
      : "(none detected)",
  );

  // 3. Interactive prompt logic
  let interactiveIde: string | undefined = options.ide;
  let interactiveAgents: AiAgent[] = cliAgents;
  let interactiveDbs: SupportedDatabase[] = detectedDbs;
  let interactiveStacks: SupportedStack[] = detectedStacks;

  // Fallback if no stack is detected
  if (interactiveStacks.length === 0) {
    const stackAnswer = await inquirer.prompt([
      {
        type: "list",
        name: "stack",
        message: "How would you like to proceed with the stack configuration?",
        choices: [
          {
            name: "I will create it with AI, I don't know the stack",
            value: SupportedStack.AI_GENERIC,
          },
          new inquirer.Separator(),
          ...Object.values(SupportedStack)
            .filter((s) => s !== SupportedStack.AI_GENERIC)
            .map((s) => ({ name: s, value: s })),
        ],
      },
    ]);
    interactiveStacks = [stackAnswer.stack as SupportedStack];
  }

  // Fallback if no database is detected
  if (interactiveDbs.length === 0) {
    const dbAnswer = await inquirer.prompt([
      {
        type: "checkbox",
        name: "selectedDbs",
        message: "Select the databases you plan to use:",
        choices: [
          { name: "None", value: SupportedDatabase.NONE },
          ...Object.values(SupportedDatabase).filter(
            (d) => d !== SupportedDatabase.NONE,
          ),
        ],
        default: [SupportedDatabase.NONE],
      },
    ]);
    interactiveDbs = dbAnswer.selectedDbs.includes(SupportedDatabase.NONE)
      ? []
      : dbAnswer.selectedDbs;
  }

  // Prompt for IDE and AI Agents if not specified
  if (!options.ide && cliAgents.length === 0) {
    const basicAnswers = await inquirer.prompt([
      {
        type: "list",
        name: "ide",
        message: "Which IDE ecosystem do you want to configure?",
        choices: ["none", ...Object.values(IdeEnvironment)],
        default: "none",
      },
      {
        type: "checkbox",
        name: "selectedAgents",
        message: "Which AI agents are you using?",
        choices: Object.values(AiAgent),
      },
    ]);

    interactiveIde = basicAnswers.ide === "none" ? undefined : basicAnswers.ide;
    interactiveAgents = basicAnswers.selectedAgents ?? [];
  }

  // Step 2: Tooling & Concerns selection
  const allToolIds = Object.keys(registry.tools || {});
  const installedToolIds = allToolIds.filter((toolId) =>
    ExistenceChecker.isAlreadyInstalled(toolId, targetDir),
  );

  if (installedToolIds.length > 0) {
    TerminalUi.section("Detected tools already installed");
    for (const toolId of installedToolIds) {
      const display = registry.tools?.[toolId]?.displayName ?? toolId;
      TerminalUi.successLine(`${display} (${toolId})`);
    }
  }

  const selectableToolChoices = allToolIds
    .filter((toolId) => !installedToolIds.includes(toolId))
    .map((toolId) => {
      const tool = registry.tools![toolId];
      const isRecommended =
        tool.recommendedStacks &&
        (tool.recommendedStacks.includes("all") ||
          tool.recommendedStacks.some((s) =>
            interactiveStacks.includes(s as any),
          ));

      return {
        name: tool.displayName,
        value: toolId,
        checked: Boolean(isRecommended),
      };
    });

  let manualSelectedTools: string[] = [];
  if (selectableToolChoices.length > 0) {
    TerminalUi.section("Select recommended tools");
    const toolAnswers = await inquirer.prompt([
      {
        type: "checkbox",
        name: "selectedTools",
        message: "Choose additional tools to configure:",
        choices: selectableToolChoices,
      },
    ]);
    manualSelectedTools = toolAnswers.selectedTools || [];
  } else {
    TerminalUi.section("Select recommended tools");
    TerminalUi.infoLine(
      "No additional selectable tools. All detected tools are already installed.",
    );
  }

  const allSelectedTools = [...manualSelectedTools];
  for (const toolId of installedToolIds) {
    if (!allSelectedTools.includes(toolId)) {
      allSelectedTools.push(toolId);
    }
  }

  // Step 3: Git Strategy selection
  let interactiveGitStrategy = options.gitStrategy;
  if (!interactiveGitStrategy && registry.gitStrategies) {
    const gitOptions = Object.keys(registry.gitStrategies).map((key) => {
      const def = registry.gitStrategies![key];
      return { name: def.displayName, value: key };
    });

    if (gitOptions.length > 0) {
      const gitAnswer = await inquirer.prompt([
        {
          type: "list",
          name: "gitStrategy",
          message: "Which Git strategy does your team use?",
          choices: [
            { name: "None (Skip Git rules)", value: "none" },
            new inquirer.Separator(),
            ...gitOptions,
          ],
        },
      ]);
      interactiveGitStrategy =
        gitAnswer.gitStrategy === "none" ? undefined : gitAnswer.gitStrategy;
    }
  }

  // Step 3.5: CI/CD Selection
  const cicdAnswer = await inquirer.prompt([
    {
      type: "confirm",
      name: "generateCICD",
      message: "Do you want to generate a GitHub Actions CI/CD workflow?",
      default: true,
    },
  ]);

  // Step 4: Final Injection Summary and Confirmation
  TerminalUi.section("Injection summary");
  TerminalUi.kv("IDE", interactiveIde || "none");
  TerminalUi.kv(
    "AI Agents",
    interactiveAgents.length > 0 ? interactiveAgents.join(", ") : "none",
  );
  TerminalUi.kv("Stacks", interactiveStacks.join(", "));
  TerminalUi.kv(
    "Databases",
    interactiveDbs.length > 0 ? interactiveDbs.join(", ") : "none",
  );
  TerminalUi.kv(
    "Security",
    detectedSecurity.length > 0 ? detectedSecurity.join(", ") : "none",
  );
  TerminalUi.kv(
    "Tools",
    allSelectedTools.length > 0 ? allSelectedTools.join(", ") : "none",
  );
  TerminalUi.kv("Git Strategy", interactiveGitStrategy || "none");
  TerminalUi.kv("CI/CD Generation", cicdAnswer.generateCICD ? "yes" : "no");

  const finalConfirm = await inquirer.prompt([
    {
      type: "confirm",
      name: "proceed",
      message: "Do you want to confirm and proceed with the injection?",
      default: true,
    },
  ]);

  if (!finalConfirm.proceed) {
    TerminalUi.doneError("Initialization aborted.");
    process.exit(0);
  }

  const resolved = resolver.resolve(
    {
      agents: interactiveAgents,
      ide: interactiveIde,
      lint: options.lint,
      stacks: interactiveStacks,
      database: interactiveDbs,
      security: detectedSecurity,
      gitStrategy: interactiveGitStrategy,
      generateCICD: cicdAnswer.generateCICD,
    },
    targetDir,
  );

  // Merge manually selected tools' dependencies into linterDependencies
  resolved.linterDependencies = resolved.linterDependencies || [];
  for (const toolId of allSelectedTools) {
    const toolDef = registry.tools?.[toolId];
    if (toolDef && toolDef.dependencies) {
      for (const dep of toolDef.dependencies) {
        if (!resolved.linterDependencies.includes(dep)) {
          resolved.linterDependencies.push(dep);
        }
      }
    }
  }

  // Merge manually selected tools metadata into resolvedTools
  resolved.resolvedTools = resolved.resolvedTools || {};
  for (const toolId of allSelectedTools) {
    const toolDef = registry.tools?.[toolId];
    if (toolDef) {
      resolved.resolvedTools[toolId] = toolDef;
    }
  }

  // 4. Execute injection
  TerminalUi.section("Provisioning workspace");
  TerminalUi.tip(
    "[Injector] Sideloading AI engineering rules and SDD framework...",
  );
  await orchestrator.execute(targetDir, resolved);

  // 5. Persist resolved config to sdd.config.json
  const configContent = resolver.generateLocalConfigContent(resolved);
  orchestrator.writeLocalConfig(targetDir, configContent);

  TerminalUi.doneOk(
    "Workspace successfully prepared for advanced Spec-Driven Development!",
  );
}
