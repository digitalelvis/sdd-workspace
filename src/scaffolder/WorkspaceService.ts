import fs from "fs";
import path from "path";
import chalk from "chalk";
import { SupportedStack } from "../domain/enums/SupportedStack";
import { AiAgent } from "../domain/enums/AiAgent";
import { StackProvider } from "../domain/contracts/StackProvider";
import { WorkspaceConfig } from "../config/ConfigSchema";
import { LOCAL_CONFIG_FILENAME } from "../config/defaults";

// Stacks
import { NodeStackProvider } from "./providers/stacks/NodeStackProvider";
import { ReactStackProvider } from "./providers/stacks/ReactStackProvider";
import { NextJsStackProvider } from "./providers/stacks/NextJsStackProvider";
import { AIStackProvider } from "./providers/stacks/AIStackProvider";

// Engines
import { SDDEngine } from "./engines/SDDEngine";
import { EcosystemEngine } from "./engines/EcosystemEngine";
import { CICDEngine } from "./engines/CICDEngine";

export class WorkspaceService {
  private readonly ecosystemEngine = new EcosystemEngine();
  private readonly sddEngine = new SDDEngine();
  private readonly cicdEngine = new CICDEngine();

  /**
   * Execute the full workspace provisioning pipeline.
   * Accepts a fully resolved WorkspaceConfig from the ConfigResolver.
   */
  public async execute(targetDir: string, resolved: WorkspaceConfig): Promise<void> {
    try {
      const stacks = resolved.stacks ?? [];
      const agents: AiAgent[] = resolved.agents ?? [];
      const ide = resolved.ide === "none" ? undefined : resolved.ide;
      const skipLint = !(resolved.lint ?? true);
      const linterDependencies = resolved.linterDependencies ?? [];

      // 1. Resolve Stack Providers
      const stackProviders = this.resolveStackProviders(stacks);

      // 2. Provision physical ecosystem (Lint, local config folders)
      this.ecosystemEngine.setup(targetDir, stackProviders, ide, { skipLint, linterDependencies });

      // 3. Inject SDD rules and skills (using merged skill list from config)
      const skillsToInject = resolved.skills?.include ?? [];
      await this.sddEngine.inject(
        targetDir,
        stackProviders,
        agents,
        skillsToInject,
        resolved.ruleTemplates,
        resolved.database,
        resolved.security
      );

      // 4. Ensure gitignore has correct AI workspace rules
      this.ensureGitignore(targetDir);

      // 5. Initialize root .specs folder
      const rootSpecsDir = path.join(targetDir, ".specs");
      if (!fs.existsSync(rootSpecsDir)) {
        fs.mkdirSync(rootSpecsDir, { recursive: true });
        console.log(chalk.green("✔️  Initialized workspace root specifications directory at .specs/"));
      }

      // 6. Provision CI/CD
      const basePath = __dirname.includes("dist")
        ? path.join(__dirname, "..", "..", "src", "resources")
        : path.join(__dirname, "..", "resources");
      this.cicdEngine.setup(targetDir, basePath, stacks);
    } catch (error) {
      console.error(chalk.red("\n❌ Critical Exception during Injection:"), error);
    }
  }

  /**
   * Check if a sdd.config.json already exists in the target directory.
   */
  public hasLocalConfig(targetDir: string): boolean {
    return fs.existsSync(path.join(targetDir, LOCAL_CONFIG_FILENAME));
  }

  /**
   * Write the resolved config to sdd.config.json in the target directory.
   */
  public writeLocalConfig(targetDir: string, config: object): void {
    const configPath = path.join(targetDir, LOCAL_CONFIG_FILENAME);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n", "utf-8");
    console.log(chalk.green(`✔️  Workspace configuration saved to ${LOCAL_CONFIG_FILENAME}`));
  }

  // ─── Private helpers ─────────────────────────────────────────────────────

  public resolveStackProviders(stacks: SupportedStack[]): StackProvider[] {
    const providers: StackProvider[] = [];
    for (const stack of stacks) {
      switch (stack) {
        case SupportedStack.NEXTJS:
          providers.push(new NextJsStackProvider());
          break;
        case SupportedStack.AI_GENERIC:
          providers.push(new AIStackProvider());
          break;
        case SupportedStack.REACT:
          providers.push(new ReactStackProvider());
          break;
        case SupportedStack.NODEJS:
        case SupportedStack.PYTHON:
        case SupportedStack.PHP:
        case SupportedStack.LARAVEL:
        case SupportedStack.VUE:
        default:
          providers.push(new NodeStackProvider());
          break;
      }
    }
    return providers;
  }

  private ensureGitignore(targetDir: string): void {
    const gitignorePath = path.join(targetDir, ".gitignore");
    const marker = "# SDD: AI & Environment Agent Configuration";
    const aiIgnoreBlock = `
# ==========================================
${marker}
# ==========================================
# Ignore agent cache/session state (ephemeral, may contain sensitive paths)
.cursor/
.windsurf/
.vscode/
.claude/
.antigravity/
.agent/
.agents/

# Keep these tracked (project DNA):
!/.agents/rules/
!/.agents/skills/
!/.specs/
`;

    if (fs.existsSync(gitignorePath)) {
      const content = fs.readFileSync(gitignorePath, "utf-8");
      if (!content.includes(marker)) {
        fs.appendFileSync(gitignorePath, aiIgnoreBlock);
        console.log(chalk.green("✔️  Appended AI workspace rules to .gitignore."));
      }
    } else {
      fs.writeFileSync(gitignorePath, aiIgnoreBlock.trim() + "\n");
      console.log(chalk.green("✔️  Created .gitignore with AI workspace rules."));
    }
  }
}
