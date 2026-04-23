import fs from "fs";
import path from "path";
import chalk from "chalk";
import { execSync } from "child_process";
import { StackProvider } from "../../domain/contracts/StackProvider";
import { AgentProvider } from "../../domain/contracts/AgentProvider";
import { AiAgent } from "../../domain/enums/AiAgent";
import { RegistryLoader } from "../../resources/RegistryLoader";

// Agent Providers mapping
import { CursorAgentProvider } from "../providers/agents/CursorAgentProvider";
import { WindsurfAgentProvider } from "../providers/agents/WindsurfAgentProvider";
import { AntigravityAgentProvider } from "../providers/agents/AntigravityAgentProvider";
import { CopilotAgentProvider } from "../providers/agents/CopilotAgentProvider";
import { KiroAgentProvider } from "../providers/agents/KiroAgentProvider";

export class SDDEngine {
  private readonly availableAgents: AgentProvider[] = [
    new CursorAgentProvider(),
    new WindsurfAgentProvider(),
    new AntigravityAgentProvider(),
    new CopilotAgentProvider(),
    new KiroAgentProvider()
  ];

  public async inject(
    targetDir: string,
    stackProviders: StackProvider[],
    selectedAgents: AiAgent[],
    skillsToInject: string[],
    ruleTemplates?: Record<string, string>,
    database?: string[],
    security?: string[]
  ): Promise<void> {
    const basePath = __dirname.includes("dist")
      ? path.join(__dirname, "..", "..", "..", "src", "resources")
      : path.join(__dirname, "..", "..", "resources");

    // 1. Load Common Rules Content
    let mainRuleContent = "";
    const commonRulesPath = path.join(basePath, "common-rules.md");
    if (fs.existsSync(commonRulesPath)) {
      mainRuleContent = fs.readFileSync(commonRulesPath, "utf-8");
    } else {
      throw new Error("common-rules.md not found");
    }

    // 2. Combine Rules Content from Stacks
    let combinedStackRuleContent = "";
    if (ruleTemplates) {
      for (const [stackName, templateFile] of Object.entries(ruleTemplates)) {
        const stackRulesPath = path.join(basePath, templateFile);
        if (fs.existsSync(stackRulesPath)) {
          combinedStackRuleContent += fs.readFileSync(stackRulesPath, "utf-8") + "\n\n";
        } else {
          combinedStackRuleContent += `## 2. ${stackName.toUpperCase()} AI Environment Setup\nFollow standard SDD best practices.\n\n`;
        }
      }
    }

    // 3. Map Agent Providers and Inject Rules
    const targetProviders = this.availableAgents.filter(p => selectedAgents.includes(p.agent));

    if (targetProviders.length > 0) {
      for (const provider of targetProviders) {
        try {
          provider.injectRules(targetDir, mainRuleContent, combinedStackRuleContent.trim());
        } catch (err) {
           console.warn(chalk.yellow(`⚠️ Could not inject rules for ${provider.agent}`));
        }
      }
    } else {
      console.log(chalk.yellow("\n⚠️ No AI Agents selected or matched. Generated base skills but skipped specific rule bindings."));
    }

    // 4. Centralized Sideload using Registry
    console.log(chalk.blue(`\n📥 Provisioning SDD Hub Skills (${skillsToInject.join(", ")})...`));
    
    const registry = RegistryLoader.load();
    const agentsSkillsDestDir = path.join(targetDir, ".agents", "skills");
    
    if (!fs.existsSync(agentsSkillsDestDir)) {
      fs.mkdirSync(agentsSkillsDestDir, { recursive: true });
    }

    for (const skillName of skillsToInject) {
      const skillDef = registry.skills[skillName];
      console.log(chalk.cyan(`  ↳ Processing [${skillName}]...`));

      try {
        await this.provisionSkill(skillName, skillDef, targetDir, agentsSkillsDestDir, basePath);
      } catch (err) {
        console.error(chalk.red(`    ❌ Failed to provision skill ${skillName}:`), err);
      }
    }
    
    console.log(chalk.green(`✔️  Injected living SDD document schemas successfully.`));
    
    // 5. Generate AGENT.md from template
    await this.generateAgentMd(targetDir, basePath, {
      stacks: stackProviders.map(p => p.stack),
      databases: database || [],
      agents: selectedAgents,
      skills: skillsToInject
    });
  }

  private async generateAgentMd(targetDir: string, basePath: string, context: any) {
    const templatePath = path.join(basePath, "agent-template.md");
    if (!fs.existsSync(templatePath)) return;

    let content = fs.readFileSync(templatePath, "utf-8");

    // Replacements
    content = content.replace("{{STACKS}}", context.stacks.join(", ") || "Generic NodeJS");
    content = content.replace("{{DATABASES}}", context.databases.join(", ") || "Not specified");
    content = content.replace("{{AGENTS}}", context.agents.join(", ") || "Generic AI Agent");
    content = content.replace("{{SKILLS}}", context.skills.length + " managed skills");
    
    const skillsList = context.skills.map((s: string) => `- [${s}](file://./.agents/skills/${s}/SKILL.md)`).join("\n");
    content = content.replace("{{SKILLS_LIST}}", skillsList || "_No specialized skills installed._");
    
    const dbStrategy = context.databases.length > 0 
      ? `Follow best practices for ${context.databases.join(" and ")}.`
      : "Standard data persistence patterns.";
    content = content.replace("{{DB_STRATEGY}}", dbStrategy);

    // Determine target filename (safe-guarding)
    const targetPath = path.join(targetDir, "AGENT.md");
    const finalPath = fs.existsSync(targetPath) ? path.join(targetDir, "AGENT.md.example") : targetPath;

    fs.writeFileSync(finalPath, content, "utf-8");
    console.log(chalk.green(`✔️  Generated ${path.basename(finalPath)} for AI orchestration.`));
  }

  private async provisionSkill(
    skillName: string,
    skillDef: any,
    targetDir: string,
    agentsSkillsDestDir: string,
    basePath: string
  ): Promise<void> {
    const skillDestDir = path.join(agentsSkillsDestDir, skillName);
    
    if (!fs.existsSync(skillDestDir)) {
      fs.mkdirSync(skillDestDir, { recursive: true });
    }

    if (!skillDef) {
      this.processLocalSkill(skillName, basePath, agentsSkillsDestDir);
      return;
    }

    switch (skillDef.mode) {
      case "cli":
        if (skillDef.command) {
          console.log(chalk.gray(`    Executing external installer: ${skillDef.command}`));
          execSync(skillDef.command, { stdio: "inherit", cwd: targetDir });
        }
        break;

      case "remote":
        if (skillDef.url) {
          console.log(chalk.gray(`    Fetching remote skill document...`));
          const response = await fetch(skillDef.url);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const content = await response.text();
          // For remote mode, we assume the URL is the SKILL.md content unless path is specified
          const targetFile = skillDef.path ? path.join(targetDir, skillDef.path) : path.join(skillDestDir, "SKILL.md");
          fs.mkdirSync(path.dirname(targetFile), { recursive: true });
          fs.writeFileSync(targetFile, content, "utf-8");
          console.log(chalk.green(`    ✔️ Downloaded to ${path.relative(targetDir, targetFile)}`));
        }
        break;

      case "local": {
        const source = skillDef.path || `skills/${skillName}`;
        this.processLocalSkill(skillName, path.join(basePath, source), agentsSkillsDestDir, true);
        break;
      }

      case "git": {
        if (!skillDef.url) throw new Error("Git URL is required for git mode");
        console.log(chalk.gray(`    Provisioning via Git (${skillDef.url}${skillDef.subpath ? ` / ${skillDef.subpath}` : ""})...`));
        
        const isGitHub = skillDef.url.includes("github.com");
        if (isGitHub) {
          await this.provisionFromGitHub(skillDef, skillDestDir);
        } else {
          // Fallback to shallow clone for other git providers
          this.provisionViaClone(skillDef, skillDestDir, targetDir);
        }
        break;
      }
    }
  }

  private async provisionFromGitHub(skillDef: any, destDir: string): Promise<void> {
    const urlParts = skillDef.url.replace("https://github.com/", "").split("/");
    const owner = urlParts[0];
    const repo = urlParts[1].replace(".git", "");
    const branch = skillDef.branch || "main";
    const subpath = skillDef.subpath || "";

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${subpath}?ref=${branch}`;
    
    await this.fetchGitHubDirectory(apiUrl, destDir);
    console.log(chalk.green(`    ✔️ Git structure provisioned successfully`));
  }

  private async fetchGitHubDirectory(apiUrl: string, destDir: string): Promise<void> {
    const response = await fetch(apiUrl, {
      headers: {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "antigravity-cli"
      }
    });

    if (!response.ok) {
      if (response.status === 403) throw new Error("GitHub API rate limit exceeded. Please try again later or provide a token.");
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const items = (await response.json()) as any[];

    for (const item of items) {
      const itemDest = path.join(destDir, item.name);
      if (item.type === "file") {
        const fileRes = await fetch(item.download_url);
        const content = await fileRes.text();
        fs.writeFileSync(itemDest, content, "utf-8");
      } else if (item.type === "dir") {
        if (!fs.existsSync(itemDest)) fs.mkdirSync(itemDest, { recursive: true });
        await this.fetchGitHubDirectory(item.url, itemDest);
      }
    }
  }

  private provisionViaClone(skillDef: any, destDir: string, targetDir: string): void {
    const tempDir = path.join(targetDir, ".sdd-temp-skill");
    if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    
    try {
      const branchFlag = skillDef.branch ? `-b ${skillDef.branch}` : "";
      const cloneCmd = ["git clone --depth 1", branchFlag, skillDef.url, tempDir].filter(Boolean).join(" ");
      execSync(cloneCmd, { stdio: "ignore" });
      
      const sourceDir = skillDef.subpath ? path.join(tempDir, skillDef.subpath) : tempDir;
      if (fs.existsSync(sourceDir)) {
        fs.cpSync(sourceDir, destDir, { recursive: true, force: true });
        console.log(chalk.green(`    ✔️ Git structure provisioned via clone`));
      } else {
        throw new Error(`Subpath ${skillDef.subpath} not found in repository`);
      }
    } finally {
      if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }

  private processLocalSkill(skillName: string, sourceBasePath: string, destDir: string, isAbsolutePath = false) {
    const skillSourceDir = isAbsolutePath ? sourceBasePath : path.join(sourceBasePath, "skills", skillName);
    const skillDestDir = path.join(destDir, skillName);

    if (fs.existsSync(skillSourceDir)) {
      try {
         fs.cpSync(skillSourceDir, skillDestDir, { recursive: true, force: true });
         console.log(chalk.green(`    ✔️ Local structure injected`));
      } catch (copyErr) {
         console.error(chalk.red(`    ❌ Failed to copy local skill ${skillName}`), copyErr);
      }
    } else {
      console.warn(chalk.yellow(`    ⚠️ Sideloaded skill resources not found locally at ${skillSourceDir}`));
    }
  }
}
