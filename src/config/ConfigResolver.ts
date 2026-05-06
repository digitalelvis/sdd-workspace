import fs from "fs";
import path from "path";
import { WorkspaceConfig, GlobalUserConfig, LocalWorkspaceConfig } from "./ConfigSchema";
import { BUILT_IN_DEFAULTS, LOCAL_CONFIG_FILENAME } from "./defaults";
import { AiAgent } from "../domain/enums/AiAgent";
import { SupportedStack } from "../domain/enums/SupportedStack";
import { SupportedDatabase } from "../domain/enums/SupportedDatabase";
import { GlobalConfigManager } from "./GlobalConfigManager";
import { RegistryLoader } from "../resources/RegistryLoader";
import pkg from "../../package.json";


export interface CliFlags {
  agents?: AiAgent[];
  ide?: string;
  lint?: boolean;
  stacks?: SupportedStack[];
  database?: SupportedDatabase[];
  security?: string[];
  gitStrategy?: string;
  generateCICD?: boolean;
}

/**
 * ConfigResolver — Merges 4 layers into a single WorkspaceConfig.
 * Priority: CLI Flags → Local sdd.config.json → Global ~/.sddrc.json → Built-in Registry
 */
export class ConfigResolver {
  public resolve(cliFlags: CliFlags, projectDir: string): WorkspaceConfig {
    const registry = RegistryLoader.load();
    const global = this.loadGlobalConfig();
    const local = this.loadLocalConfig(projectDir);

    // Initial state from built-in defaults (Agents/IDE/Lint)
    const base: WorkspaceConfig = {
      agents: [...BUILT_IN_DEFAULTS.agents],
      ide: BUILT_IN_DEFAULTS.ide,
      lint: BUILT_IN_DEFAULTS.lint,
      stacks: cliFlags.stacks && cliFlags.stacks.length > 0 ? cliFlags.stacks : (local?.stacks || []),
      database: cliFlags.database && cliFlags.database.length > 0 ? cliFlags.database : (local?.database || []),
      security: cliFlags.security && cliFlags.security.length > 0 ? cliFlags.security : (local?.security || []),
      gitStrategy: cliFlags.gitStrategy || local?.gitStrategy,
      generateCICD: cliFlags.generateCICD !== undefined ? cliFlags.generateCICD : local?.generateCICD,
      skills: { include: [], exclude: [], add: [] },
      linterDependencies: [],
      resolvedTools: {},
      ruleTemplates: {},
    };

    // 1. Resolve Stack Defaults (Registry + Global Overrides)
    const { skills: stackSkills, tools: stackTools, templates } = this.resolveStackBase(
      base.stacks || [],
      registry,
      global
    );
    
    base.linterDependencies = stackTools;
    base.ruleTemplates = templates;

    // Populate resolved tools metadata
    if (registry.tools) {
      for (const toolDep of stackTools) {
        const toolName = toolDep.startsWith('@') 
          ? toolDep.split('@').slice(0, 2).join('@') 
          : toolDep.split('@')[0];
          
        if (registry.tools[toolName]) {
          base.resolvedTools![toolName] = registry.tools[toolName];
        }
      }
    }

    // 2. Apply Global Config (General settings)
    if (global) {
      this.applyGlobalConfig(base, global);
    }

    // 3. Apply Local Config
    if (local) {
      this.applyLocalConfig(base, local);
    }

    // 4. Apply CLI Flags
    this.applyCliFlags(base, cliFlags);

    // 5. Final Skill Merge
    base.skills = this.mergeSkills(
      stackSkills,
      global?.skills?.add ?? [],
      local?.skills?.include ?? [],
      local?.skills?.add ?? [],
      local?.skills?.exclude ?? [],
    );

    return base;
  }

  /**
   * Resolves the base skills, tools, and templates for the detected stacks.
   * Merges Built-in Registry defaults with Global ~/.sddrc.json stack overrides.
   */
  private resolveStackBase(
    stacks: SupportedStack[],
    registry: any,
    global: GlobalUserConfig | null
  ) {
    const skills = new Set<string>();
    const tools = new Set<string>();
    const templates: Record<string, string> = {};

    for (const stackName of stacks) {
      const def = registry.stacks[stackName];
      if (def) {
        def.defaultSkills.forEach((s: string) => skills.add(s));
        def.linterDependencies.forEach((t: string) => tools.add(t));
        templates[stackName] = def.ruleTemplateFile;
      }

      // Apply incremental global stack overrides
      const override = global?.stacks?.[stackName];
      if (override) {
        override.addSkills?.forEach(s => skills.add(s));
        override.addTools?.forEach(t => tools.add(t));
      }
    }

    return { 
      skills: Array.from(skills), 
      tools: Array.from(tools), 
      templates 
    };
  }

  public generateLocalConfigContent(
    resolved: WorkspaceConfig,
    updatedAt: string = new Date().toISOString(),
  ): LocalWorkspaceConfig {
    return {
      version: pkg.version,
      stacks: resolved.stacks || [],
      agents: resolved.agents || [],
      ide: resolved.ide,
      lint: resolved.lint ?? true,
      database: resolved.database || [],
      security: resolved.security || [],
      gitStrategy: resolved.gitStrategy,
      skills: {
        include: resolved.skills?.include || [],
        exclude: resolved.skills?.exclude || [],
      },
      updatedAt,
    };
  }

  public loadGlobalConfig(): GlobalUserConfig | null {
    try {
      const manager = new GlobalConfigManager();
      return manager.load();
    } catch {
      return null;
    }
  }

  public loadLocalConfig(projectDir: string): LocalWorkspaceConfig | null {
    try {
      const configPath = path.join(projectDir, LOCAL_CONFIG_FILENAME);
      if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, "utf-8")) as LocalWorkspaceConfig;
      }
    } catch {
      return null;
    }
    return null;
  }

  private applyGlobalConfig(base: WorkspaceConfig, global: GlobalUserConfig): void {
    if (global.defaults?.agents?.length) base.agents = global.defaults.agents;
    if (global.defaults?.ide) base.ide = global.defaults.ide;
    if (global.defaults?.lint !== undefined) base.lint = global.defaults.lint;
  }

  private applyLocalConfig(base: WorkspaceConfig, local: LocalWorkspaceConfig): void {
    if (local.agents?.length) base.agents = local.agents;
    if (local.ide) base.ide = local.ide;
    if (local.lint !== undefined) base.lint = local.lint;
    if (local.stacks?.length) base.stacks = local.stacks;
    if (local.database?.length) base.database = local.database;
    if (local.security?.length) base.security = local.security;
    if (local.gitStrategy) base.gitStrategy = local.gitStrategy;
    if (local.generateCICD !== undefined) base.generateCICD = local.generateCICD;
  }

  private applyCliFlags(base: WorkspaceConfig, flags: CliFlags): void {
    if (flags.agents?.length) base.agents = flags.agents;
    if (flags.ide) base.ide = flags.ide;
    if (flags.lint !== undefined) base.lint = flags.lint;
    if (flags.stacks?.length) base.stacks = flags.stacks;
    if (flags.database?.length) base.database = flags.database;
    if (flags.security?.length) base.security = flags.security;
    if (flags.gitStrategy) base.gitStrategy = flags.gitStrategy;
    if (flags.generateCICD !== undefined) base.generateCICD = flags.generateCICD;
  }

  private mergeSkills(
    stackDefaults: string[],
    globalAdd: string[],
    localInclude: string[],
    localAdd: string[],
    localExclude: string[],
  ): { include: string[]; exclude: string[] } {
    const base = localInclude.length > 0 ? localInclude : stackDefaults;
    const merged = new Set([...base, ...globalAdd, ...localAdd]);
    localExclude.forEach(s => merged.delete(s));

    return {
      include: Array.from(merged),
      exclude: localExclude,
    };
  }
}
