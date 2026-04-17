import fs from "fs";
import path from "path";
import chalk from "chalk";
import { StackProvider } from "../../domain/contracts/StackProvider";
import { AgentProvider } from "../../domain/contracts/AgentProvider";
import { AiAgent } from "../../domain/enums/AiAgent";

// Agent Providers mapping (Factory-like internally or passed via constructor/method)
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

  public inject(targetDir: string, stackProviders: StackProvider[], selectedAgents: AiAgent[]): void {
    const basePath = __dirname.includes("dist")
      ? path.join(__dirname, "..", "..", "..", "src", "templates")
      : path.join(__dirname, "..", "..", "templates");

    // 1. Load Common Rules Content
    let mainRuleContent = "";
    const commonRulesPath = path.join(basePath, "common-rules.md");
    if (fs.existsSync(commonRulesPath)) {
      mainRuleContent = fs.readFileSync(commonRulesPath, "utf-8");
    } else {
      throw new Error("common-rules.md not found");
    }

    // Combine rules content from all detected stacks and gather total skills
    let combinedStackRuleContent = "";
    const allSkillsToInject = new Set<string>();

    for (const provider of stackProviders) {
      const stackRulesPath = path.join(basePath, provider.ruleTemplateFile);

      if (fs.existsSync(stackRulesPath)) {
        combinedStackRuleContent += fs.readFileSync(stackRulesPath, "utf-8") + "\n\n";
      } else {
        combinedStackRuleContent += `## 2. ${provider.stack.toUpperCase()} AI Environment Setup\nFollow standard SDD best practices.\n\n`;
      }

      provider.defaultSkills.forEach(skill => allSkillsToInject.add(skill));
    }

    // 2. Map Agent Providers and Inject Rules
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

    // 3. Centralized Sideload for Framework Specific Skills into .agents/skills/
    console.log(chalk.blue(`\n📥 Sideloading localized SDD Agent Skills (${Array.from(allSkillsToInject).join(", ")})...`));

    const agentsSkillsDestDir = path.join(targetDir, ".agents", "skills");
    if (!fs.existsSync(agentsSkillsDestDir)) {
      fs.mkdirSync(agentsSkillsDestDir, { recursive: true });
    }

    for (const skillName of allSkillsToInject) {
      const skillSourceDir = path.join(basePath, "skills", skillName);
      const skillDestDir = path.join(agentsSkillsDestDir, skillName);

      if (fs.existsSync(skillSourceDir)) {
        try {
           fs.cpSync(skillSourceDir, skillDestDir, { recursive: true, force: true });
        } catch (copyErr) {
           console.error(chalk.red(`  ↳ Failed to copy skill ${skillName}`), copyErr);
        }
      } else {
        console.warn(chalk.yellow(`⚠️ Sideloaded skill resources not found at ${skillSourceDir}`));
      }
    }
    
    console.log(chalk.green(`✔️  Injected living SDD document schemas successfully.`));
  }
}
