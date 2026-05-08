import fs from "fs";
import path from "path";
import chalk from "chalk";
import { StackProvider } from "../../domain/contracts/StackProvider";
import { AiAgent } from "../../domain/enums/AiAgent";
import { RegistryLoader } from "../../resources/RegistryLoader";
import { ResourcePathUtils } from "../../utils/ResourcePathUtils";
import { ResourceProvisioner } from "./ResourceProvisioner";
import { SkillService } from "../../resources/SkillService";

/**
 * SDDEngine — Orchestrates the injection of rules, skills, and agent configs.
 */
export class SDDEngine {
  private readonly provisioner = new ResourceProvisioner();

  public async inject(
    targetDir: string,
    stackProviders: StackProvider[],
    selectedAgents: AiAgent[],
    skillsToInject: string[],
    database?: string[],
    ruleTemplates?: Record<string, string>,
    gitStrategy?: string
  ): Promise<void> {
    const { basePath, registry, rulesDestDir, agentsSkillsDestDir } = this.initializeContext(targetDir);
    const skillService = new SkillService(registry);

    // 1. Resolve all Skills (Explicit + Stack Defaults + Database Defaults + Provider Discovery)
    const allSkills = this.resolveAllSkills(skillsToInject, stackProviders, database, registry, skillService);

    // 2. Provision and Combine Rules Content
    const fullRuleContent = await this.provisionAndComposeRules(
      targetDir,
      rulesDestDir,
      stackProviders,
      registry,
      basePath,
      database,
      ruleTemplates,
      gitStrategy
    );

    // 3. Configure AI Agents with Rules
    this.configureAgents(targetDir, selectedAgents, registry, fullRuleContent);

    // 4. Provision Specialized Skills
    await this.provisionSkills(targetDir, allSkills, registry, agentsSkillsDestDir, basePath);

    // 5. Generate Orchestration Documentation
    await this.generateAgentsMd(targetDir, basePath, {
      stacks: stackProviders.map(p => p.stack),
      databases: database || [],
      agents: selectedAgents,
      skills: allSkills
    });

    console.log(chalk.green(`✔️  Injected living SDD document schemas successfully.`));
  }

  private resolveAllSkills(
    explicit: string[],
    stacks: StackProvider[],
    databases: string[] | undefined,
    registry: any,
    skillService: SkillService
  ): string[] {
    const skillSet = new Set<string>(explicit);
    const providers = new Set<string>();

    // From Stacks
    for (const stack of stacks) {
      const stackDef = registry.stacks[stack.stack];
      if (stackDef) {
        (stackDef.defaultSkills || []).forEach((s: string) => skillSet.add(s));
        (stackDef.defaultSkillsProviders || []).forEach((p: string) => providers.add(p));
      }
    }

    // From Databases
    if (databases) {
      for (const db of databases) {
        const dbDef = registry.databases[db];
        if (dbDef) {
          (dbDef.defaultSkills || []).forEach((s: string) => skillSet.add(s));
          (dbDef.defaultSkillsProviders || []).forEach((p: string) => providers.add(p));
        }
      }
    }

    // Resolve from providers
    const providerSkills = skillService.resolveFromProviders(Array.from(providers));
    providerSkills.forEach((s: string) => skillSet.add(s));

    return Array.from(skillSet);
  }

  private initializeContext(targetDir: string) {
    const basePath = ResourcePathUtils.getResourcesPath();
    const registry = RegistryLoader.load();
    const rulesDestDir = path.join(targetDir, ".agents", "rules");
    const agentsSkillsDestDir = path.join(targetDir, ".agents", "skills");

    [rulesDestDir, agentsSkillsDestDir].forEach(dir => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });

    return { basePath, registry, rulesDestDir, agentsSkillsDestDir };
  }

  private async provisionAndComposeRules(
    targetDir: string,
    rulesDestDir: string,
    stackProviders: StackProvider[],
    registry: any,
    basePath: string,
    databases?: string[],
    ruleTemplates?: Record<string, string>,
    gitStrategy?: string
  ): Promise<string> {
    let combinedContent = "";
    
    // Provision Base Rules
    const baseRuleId = "engineering-rules";
    const baseRuleDef = registry.rules[baseRuleId];
    if (baseRuleDef) {
      console.log(chalk.blue(`\n📥 Provisioning Base Rules [${baseRuleId}]...`));
      await this.provisioner.provision(baseRuleId, baseRuleDef, targetDir, rulesDestDir, basePath);
      combinedContent += this.readProvisionedRule(rulesDestDir, baseRuleId);
    }

    // Provision Stack Specific Rules
    const activeStacks = stackProviders.map(p => p.stack as string);
    for (const stack of activeStacks) {
      const stackDef = registry.stacks[stack];
      if (!stackDef) continue;

      console.log(chalk.blue(`\n📥 Provisioning Rules for stack [${stack}]...`));

      if (stackDef.defaultRules) {
        for (const ruleId of stackDef.defaultRules) {
          if (ruleId === baseRuleId) continue;
          await this.provisioner.provision(ruleId, registry.rules[ruleId], targetDir, rulesDestDir, basePath);
          combinedContent += this.readProvisionedRule(rulesDestDir, ruleId);
        }
      }

      // Handle overrides
      if (ruleTemplates?.[stack]) {
        const overridePath = path.join(basePath, ruleTemplates[stack]);
        if (fs.existsSync(overridePath)) {
          combinedContent += fs.readFileSync(overridePath, "utf-8") + "\n\n";
        }
      }
    }

    // Provision Database Specific Rules
    const activeDbs = databases || [];
    for (const db of activeDbs) {
      const dbDef = registry.databases[db];
      if (!dbDef) continue;

      console.log(chalk.blue(`\n📥 Provisioning Rules for database [${db}]...`));

      if (dbDef.defaultRules) {
        for (const ruleId of dbDef.defaultRules) {
          if (ruleId === baseRuleId) continue;
          const ruleDef = registry.rules[ruleId];
          if (ruleDef) {
            await this.provisioner.provision(ruleId, ruleDef, targetDir, rulesDestDir, basePath);
            combinedContent += this.readProvisionedRule(rulesDestDir, ruleId);
          }
        }
      }
    }

    // Append Git Strategy
    if (gitStrategy && registry.gitStrategies?.[gitStrategy]) {
      const gitDef = registry.gitStrategies[gitStrategy];
      console.log(chalk.blue(`\n📥 Provisioning Git Strategy [${gitDef.displayName}]...`));

      if (gitDef.defaultRules) {
        for (const ruleId of gitDef.defaultRules) {
          if (ruleId === baseRuleId) continue;
          const ruleDef = registry.rules[ruleId];
          if (ruleDef) {
            await this.provisioner.provision(ruleId, ruleDef, targetDir, rulesDestDir, basePath);
            combinedContent += this.readProvisionedRule(rulesDestDir, ruleId);
          }
        }
      }
    }

    const finalContent = combinedContent.trim() || "## AI Environment Setup\nFollow standard SDD best practices.\n\n";
    fs.writeFileSync(path.join(rulesDestDir, "main.md"), finalContent);
    console.log(chalk.green(`✔️  Centralized AI rules at .agents/rules/main.md`));

    return finalContent;
  }

  private readProvisionedRule(destDir: string, ruleId: string): string {
    const rulePath = path.join(destDir, `${ruleId}.md`);
    return fs.existsSync(rulePath) ? fs.readFileSync(rulePath, "utf-8") + "\n\n" : "";
  }

  private configureAgents(targetDir: string, agents: AiAgent[], registry: any, fullRuleContent: string) {
    if (agents.length === 0) {
      console.log(chalk.yellow("\n⚠️ No AI Agents selected. Skipping specific rule bindings."));
      return;
    }

    for (const agent of agents) {
      const agentDef = registry.agents[agent];
      if (!agentDef) continue;

      const agentConfigPath = path.join(targetDir, agentDef.ruleFile);
      try {
        this.applyAgentStrategy(agentConfigPath, agentDef, fullRuleContent);
        console.log(chalk.green(`  ↳ Configured ${agent} via ${agentDef.strategy} strategy.`));
      } catch (err: any) {
        console.warn(chalk.yellow(`⚠️ Could not configure ${agent}: ${err.message}`));
      }
    }
  }

  private applyAgentStrategy(configPath: string, agentDef: any, content: string) {
    if (agentDef.strategy === "reference") {
      const ref = `# Spec-Driven Development Rules\n\nCentralized rules defined in:\n\n- [main.md](file://./.agents/rules/main.md)\n`;
      fs.writeFileSync(configPath, ref);
    } else if (agentDef.strategy === "symlink") {
      if (fs.existsSync(configPath)) fs.unlinkSync(configPath);
      fs.symlinkSync(".agents/rules/main.md", configPath);
    } else {
      fs.writeFileSync(configPath, content);
    }
  }

  private async provisionSkills(targetDir: string, skills: string[], registry: any, destDir: string, basePath: string) {
    if (skills.length === 0) return;
    
    console.log(chalk.blue(`\n📥 Provisioning SDD Hub Skills (${skills.join(", ")})...`));
    for (const skillName of skills) {
      console.log(chalk.cyan(`  ↳ Processing skill [${skillName}]...`));
      try {
        await this.provisioner.provision(skillName, registry.skills[skillName], targetDir, destDir, basePath);
      } catch (err) {
        console.error(chalk.red(`    ❌ Failed to provision skill ${skillName}:`), err);
      }
    }
  }

  private async generateAgentsMd(targetDir: string, basePath: string, context: any) {
    const targetPath = path.join(targetDir, "AGENTS.md");
    const orchestrationBlock = this.buildOrchestrationBlock();

    if (fs.existsSync(targetPath)) {
      this.injectOrchestrationBlock(targetPath, orchestrationBlock);
      return;
    }

    const templatePath = path.join(basePath, "agent-template.md");
    if (!fs.existsSync(templatePath)) return;

    let content = fs.readFileSync(templatePath, "utf-8");

    content = content.replace("{{STACKS}}", context.stacks.join(", ") || "Generic NodeJS");
    content = content.replace("{{DATABASES}}", context.databases.join(", ") || "Not specified");
    content = content.replace("{{AGENTS}}", context.agents.join(", ") || "Generic AI Agent");
    content = content.replace("{{SKILLS}}", context.skills.length + " managed skills");

    const skillsList = context.skills
      .map((s: string) => `- [${s}](file://./.agents/skills/${s}/SKILL.md)`)
      .join("\n");
    content = content.replace("{{SKILLS_LIST}}", skillsList || "_No specialized skills installed._");

    const dbStrategy =
      context.databases.length > 0
        ? `Follow best practices for ${context.databases.join(" and ")}.`
        : "Standard data persistence patterns.";
    content = content.replace("{{DB_STRATEGY}}", dbStrategy);

    fs.writeFileSync(targetPath, content, "utf-8");
    console.log(chalk.green(`✔️  Generated AGENTS.md for AI orchestration.`));
  }

  /**
   * Injects the SDD orchestration block into an existing AGENTS.md.
   * Inserts right after the YAML frontmatter (if present) or the first heading.
   * Idempotent — skips if the block is already present.
   */
  private injectOrchestrationBlock(filePath: string, block: string): void {
    const content = fs.readFileSync(filePath, "utf-8");

    if (content.includes("## 1. Orchestration & Planning")) {
      return;
    }

    let insertionIndex = 0;

    if (content.startsWith("---")) {
      const closingFence = content.indexOf("\n---", 3);
      if (closingFence !== -1) {
        insertionIndex = closingFence + 4;
      }
    } else {
      const firstNewline = content.indexOf("\n");
      if (firstNewline !== -1) {
        insertionIndex = firstNewline + 1;
      }
    }

    const updated =
      content.slice(0, insertionIndex) +
      "\n" + block + "\n\n" +
      content.slice(insertionIndex);

    fs.writeFileSync(filePath, updated, "utf-8");
    console.log(chalk.green(`✔️  Injected SDD orchestration block into existing AGENTS.md.`));
  }

  private buildOrchestrationBlock(): string {
    return `## 1. Orchestration & Planning (Orchestrator)

Before making any complex changes, you **MUST** follow the \`.agents/skills/spec-driven\` workflow.

- **Primary Source of Truth**: \`.specs/\` (Codebase, Requirements, Roadmap, State).
- **Core Workflow**:
  1. **Specify**: Define what we are doing in \`.specs/features/\`.
  1. **Always document**: Always keep your documentation, status, roadmap, and features up to date.`;
  }
}
