import fs from "fs";
import path from "path";
import chalk from "chalk";
import { SupportedStack } from "../domain/enums/SupportedStack";
import { AiAgent } from "../domain/enums/AiAgent";
import { SetupOptions, StackProvider } from "../domain/contracts/StackProvider";

// Stacks
import { NodeStackProvider } from "./providers/stacks/NodeStackProvider";
import { ReactStackProvider } from "./providers/stacks/ReactStackProvider";
import { NextJsStackProvider } from "./providers/stacks/NextJsStackProvider";

// Engines
import { SDDEngine } from "./engines/SDDEngine";
import { EcosystemEngine } from "./engines/EcosystemEngine";

export class WorkspaceService {
  private readonly ecosystemEngine = new EcosystemEngine();
  private readonly sddEngine = new SDDEngine();

  public async execute(
    targetDir: string,
    stacks: SupportedStack[],
    ide: string | undefined,
    agents: AiAgent[],
    options: SetupOptions,
  ) {
    try {
      // 1. Resolve Providers Factory
      const stackProviders = this.resolveStackProviders(stacks);

      // 2. Provision physical ecosystem (Lint, local config folders)
      this.ecosystemEngine.setup(targetDir, stackProviders, ide, options);

      // 3. Inject SDD specific routines
      await this.sddEngine.inject(targetDir, stackProviders, agents);
      
      // 4. Guarantee tracking while ignoring agent local configs
      this.ensureGitignore(targetDir);

      // Initialize root .specs folder
      const rootSpecsDir = path.join(targetDir, ".specs");
      if (!fs.existsSync(rootSpecsDir)) {
        fs.mkdirSync(rootSpecsDir, { recursive: true });
        console.log(chalk.green("✔️  Initialized workspace root specifications directory at .specs/"));
      }
    } catch (error) {
      console.error(
        chalk.red("\n❌ Critical Exception during Injection:"),
        error,
      );
    }
  }

  private resolveStackProviders(stacks: SupportedStack[]): StackProvider[] {
    const providers: StackProvider[] = [];
    for (const stack of stacks) {
      switch (stack) {
        case SupportedStack.NEXTJS:
          providers.push(new NextJsStackProvider());
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
          // Fallback basic stack config when unknown
          providers.push(new NodeStackProvider());
          break;
      }
    }
    return providers;
  }

  private ensureGitignore(targetDir: string): void {
    const gitignorePath = path.join(targetDir, ".gitignore");
    const aiIgnoreBlock = `
# ==========================================
# SDD: AI & Environment Agent Configuration
# ==========================================
.cursor/
.cursorrules
.windsurf/
.windsurfrules
.antigravity/
.agent/
.agents/rules/
.vscode/

# Keep specs tracked, but rules logic completely separate
!/.specs
!/.agents/skills
`;

    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
      if (!gitignoreContent.includes("SDD: AI & Environment Agent Configuration")) {
        fs.appendFileSync(gitignorePath, `\n${aiIgnoreBlock}`);
        console.log(chalk.green("✔️  Appended AI workspace ignoring rules to .gitignore."));
      }
    } else {
      fs.writeFileSync(gitignorePath, aiIgnoreBlock.trim() + "\n");
      console.log(chalk.green("✔️  Created .gitignore with AI rules."));
    }
  }
}
