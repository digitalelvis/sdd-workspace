import fs from "fs";
import path from "path";
import { WorkspaceConfig, GlobalUserConfig, LocalWorkspaceConfig } from "./ConfigSchema";
import { BUILT_IN_DEFAULTS, GLOBAL_CONFIG_PATH, LOCAL_CONFIG_FILENAME } from "./defaults";
import { AiAgent } from "../domain/enums/AiAgent";
import { SupportedStack } from "../domain/enums/SupportedStack";

/**
 * Input from the CLI layer (flags passed by the user at runtime).
 * This is the highest-priority config layer.
 */
export interface CliFlags {
  agents?: AiAgent[];
  ide?: string;
  lint?: boolean;
  stacks?: SupportedStack[];
}

/**
 * ConfigResolver — Merges 4 layers into a single WorkspaceConfig.
 *
 * Priority (highest to lowest):
 *   CLI Flags → Local sdd.config.json → Global ~/.sddrc.json → Built-in Defaults
 *
 * Skills are merged additively:
 *   final = (stackDefaults ∪ global.skills.add ∪ local.skills.include) - local.skills.exclude
 */
export class ConfigResolver {
  /**
   * Resolve the final merged WorkspaceConfig.
   *
   * @param cliFlags     - Flags passed directly via Commander (highest priority)
   * @param stackSkills  - Default skills from detected StackProviders (built-in layer)
   * @param projectDir   - The target directory to search for sdd.config.json
   */
  public resolve(cliFlags: CliFlags, stackSkills: string[], projectDir: string): WorkspaceConfig {
    // Layer 1: Built-in defaults
    const base: WorkspaceConfig = {
      agents: [...BUILT_IN_DEFAULTS.agents],
      ide: BUILT_IN_DEFAULTS.ide,
      lint: BUILT_IN_DEFAULTS.lint,
      skills: { include: [...stackSkills], exclude: [], add: [] },
    };

    // Layer 2: Global config (~/.sddrc.json)
    const global = this.loadGlobalConfig();
    if (global) {
      this.applyGlobalConfig(base, global);
    }

    // Layer 3: Local config (./sdd.config.json)
    const local = this.loadLocalConfig(projectDir);
    if (local) {
      this.applyLocalConfig(base, local);
    }

    // Layer 4: CLI flags (highest priority — always wins)
    this.applyCliFlags(base, cliFlags);

    // Final skill merge: exclude takes precedence over everything
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
   * Generate a sdd.config.json content object from a resolved config.
   * This is written to disk after a successful `sdd init`.
   */
  public generateLocalConfigContent(
    resolved: WorkspaceConfig,
    updatedAt: string = new Date().toISOString(),
  ): LocalWorkspaceConfig {
    return {
      version: "0.0.2",
      stacks: resolved.stacks ?? [],
      agents: resolved.agents ?? [],
      ide: resolved.ide,
      lint: resolved.lint ?? true,
      skills: {
        include: resolved.skills?.include ?? [],
        exclude: resolved.skills?.exclude ?? [],
      },
      updatedAt,
    };
  }

  // ─── Loaders ──────────────────────────────────────────────────────────────

  public loadGlobalConfig(): GlobalUserConfig | null {
    try {
      if (fs.existsSync(GLOBAL_CONFIG_PATH)) {
        return JSON.parse(fs.readFileSync(GLOBAL_CONFIG_PATH, "utf-8")) as GlobalUserConfig;
      }
    } catch {
      // Non-fatal — global config is optional
    }
    return null;
  }

  public loadLocalConfig(projectDir: string): LocalWorkspaceConfig | null {
    try {
      const configPath = path.join(projectDir, LOCAL_CONFIG_FILENAME);
      if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, "utf-8")) as LocalWorkspaceConfig;
      }
    } catch {
      // Non-fatal — local config is optional on first init
    }
    return null;
  }

  // ─── Layer applicators ────────────────────────────────────────────────────

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
  }

  private applyCliFlags(base: WorkspaceConfig, flags: CliFlags): void {
    if (flags.agents?.length) base.agents = flags.agents;
    if (flags.ide) base.ide = flags.ide;
    if (flags.lint !== undefined) base.lint = flags.lint;
    if (flags.stacks?.length) base.stacks = flags.stacks;
  }

  // ─── Skill merge ──────────────────────────────────────────────────────────

  /**
   * Merge skills from all layers with additive logic and exclude support.
   *
   * stackDefaults  — from StackProvider.defaultSkills (built-in)
   * globalAdd      — from ~/.sddrc.json skills.add
   * localInclude   — from sdd.config.json skills.include (full override of defaults)
   * localAdd       — from sdd.config.json skills.add (additive on top of defaults)
   * localExclude   — from sdd.config.json skills.exclude (removed from final set)
   */
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
