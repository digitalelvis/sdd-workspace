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
    ruleTemplates?: Record<string, string>
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

      if (!skillDef) {
        this.processLocalSkill(skillName, basePath, agentsSkillsDestDir);
        continue;
      }

      try {
        switch (skillDef.mode) {
          case "cli":
            if (skillDef.command) {
              console.log(chalk.gray(`    Executing external installer: ${skillDef.command}`));
              execSync(skillDef.command, { stdio: "inherit", cwd: targetDir });
            }
            break;

          case "remote":
            if (skillDef.url && skillDef.path) {
              console.log(chalk.gray(`    Fetching remote skill document...`));
              const response = await fetch(skillDef.url);
              if (!response.ok) throw new Error(`HTTP ${response.status}`);
              const content = await response.text();
              const targetPath = path.join(targetDir, skillDef.path);
              fs.mkdirSync(path.dirname(targetPath), { recursive: true });
              fs.writeFileSync(targetPath, content, "utf-8");
              console.log(chalk.green(`    ✔️ Downloaded to ${skillDef.path}`));
            }
            break;

          case "local": {
            const source = skillDef.path || `skills/${skillName}`;
            this.processLocalSkill(skillName, path.join(basePath, source), agentsSkillsDestDir, true);
            break;
          }
        }
      } catch (err) {
        console.error(chalk.red(`    ❌ Failed to provision skill ${skillName}`), err);
      }
    }
    
    console.log(chalk.green(`✔️  Injected living SDD document schemas successfully.`));
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
