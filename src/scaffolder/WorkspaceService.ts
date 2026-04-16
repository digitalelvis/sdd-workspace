import fs from "fs";
import path from "path";
import chalk from "chalk";
import { SupportedFramework } from "../domain/enums/SupportedFramework";
import { AiTool } from "../domain/enums/AiTool";

// IDE Providers
import { CursorProvider } from "./providers/ide/CursorProvider";
import { WindsurfProvider } from "./providers/ide/WindsurfProvider";
import { AntigravityProvider } from "./providers/ide/AntigravityProvider";
import { VSCodeProvider } from "./providers/ide/VSCodeProvider";

// Framework Providers
import { NodeProvider } from "./providers/frameworks/NodeProvider";
import { ReactProvider } from "./providers/frameworks/ReactProvider";
import { NextJsProvider } from "./providers/frameworks/NextJsProvider";
import { SetupOptions } from "../domain/contracts/FrameworkProvider";

export class WorkspaceService {
  constructor() {}

  public execute(
    targetDir: string,
    framework: SupportedFramework,
    tools: AiTool[],
    options: SetupOptions,
  ) {
    try {
      this.setupFrameworkEcosystem(targetDir, framework, options);
      this.injectAiStructure(targetDir, framework, tools);
    } catch (error) {
      console.error(
        chalk.red("\n❌ Critical Exception during Injection:"),
        error,
      );
    }
  }

  private setupFrameworkEcosystem(
    targetDir: string,
    framework: SupportedFramework,
    options: SetupOptions,
  ) {
    let frameworkProvider;
    switch (framework) {
      case SupportedFramework.NEXTJS:
        frameworkProvider = new NextJsProvider();
        break;
      case SupportedFramework.REACT:
        frameworkProvider = new ReactProvider();
        break;
      case SupportedFramework.NODEJS:
      default:
        frameworkProvider = new NodeProvider();
        break;
    }
    frameworkProvider.setupEcosystem(targetDir, options);
  }

  private injectAiStructure(
    targetDir: string,
    framework: SupportedFramework,
    tools: AiTool[],
  ) {
    const basePath = __dirname.includes("dist")
      ? path.join(__dirname, "..", "..", "src", "templates")
      : path.join(__dirname, "..", "templates");

    // 1. Framework AI Rules
    const templateFileName =
      framework === SupportedFramework.NEXTJS
        ? "next-rules.md"
        : framework === SupportedFramework.REACT
          ? "react-rules.md"
          : "node-rules.md";
    const templatePath = path.join(basePath, templateFileName);
    let rulesContent = "";

    if (fs.existsSync(templatePath)) {
      rulesContent = fs.readFileSync(templatePath, "utf-8");
    } else {
      rulesContent = `# ${framework.toUpperCase()} AI Environment Setup\nFollow standard SDD best practices.`;
    }

    const cursorRulesPath = path.join(targetDir, ".cursorrules");
    fs.writeFileSync(cursorRulesPath, rulesContent);
    console.log(
      chalk.green(`✔️  Generated general AI guidelines (.cursorrules).`),
    );

    // 2. Local Skill Injection
    const skillSourceDir = path.join(basePath, "skills", "tlc-spec-driven");
    if (fs.existsSync(skillSourceDir)) {
      console.log(chalk.blue(`\n📥 Sideloading localized TLC Agent Skills...`));

      const ideProviders = [
        new CursorProvider(),
        new WindsurfProvider(),
        new AntigravityProvider(),
        new VSCodeProvider(),
      ];

      for (const tool of tools) {
        const provider = ideProviders.find((p) => p.tool === tool);
        if (provider) {
          provider.injectSkill(targetDir, skillSourceDir);
        }
      }

      console.log(
        chalk.green(`✔️  Injected living SDD document schemas successfully.`),
      );
    } else {
      console.warn(
        chalk.yellow(
          `⚠️ Sideloaded skill resources not found at ${skillSourceDir}`,
        ),
      );
    }

    // 3. Guarantee .specs structure tracking while ignoring agent local configs
    this.ensureGitignore(targetDir);

    // Initialize root .specs folder
    const specsDir = path.join(targetDir, ".specs");
    if (!fs.existsSync(specsDir)) {
      fs.mkdirSync(specsDir, { recursive: true });
      fs.writeFileSync(path.join(specsDir, ".gitkeep"), "");
      console.log(chalk.green(`✔️  Scaffolded .specs workspace.`));
    }
  }

  private ensureGitignore(targetDir: string) {
    const gitignorePath = path.join(targetDir, ".gitignore");
    const ignoreBlock = `
# AI WORKSPACES IGNORE
.agents/
.agent/
.claude/
.windsurf/
.cursor/
.gemini/
`;
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
      if (!gitignoreContent.includes("# AI WORKSPACES IGNORE")) {
        fs.appendFileSync(gitignorePath, ignoreBlock);
        console.log(
          chalk.green(
            `✔️  Updated .gitignore to exclude agent runtime directories.`,
          ),
        );
      }
    } else {
      fs.writeFileSync(gitignorePath, ignoreBlock.trimStart());
      console.log(
        chalk.green(
          `✔️  Created .gitignore to exclude agent runtime directories.`,
        ),
      );
    }
  }
}
