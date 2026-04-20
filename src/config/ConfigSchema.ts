import { AiAgent } from "../domain/enums/AiAgent";
import { SupportedStack } from "../domain/enums/SupportedStack";

/**
 * Skills configuration section.
 * - include: explicit list of skills to install (overrides stack defaults when set)
 * - exclude: skills to remove from the merged final list
 * - add:     extra skills to merge on top of the defaults (additive, no override)
 */
export interface SkillsConfig {
  include?: string[];
  exclude?: string[];
  add?: string[];
}

/**
 * The canonical WorkspaceConfig contract.
 * This is the resolved, merged view of all 4 config layers.
 * Both sdd.config.json (local) and ~/.sddrc.json (global) conform to this shape.
 */
export interface WorkspaceConfig {
  /** Config schema version for future migrations */
  version?: string;

  /** Detected or declared stacks (populated by framework-detector on init) */
  stacks?: SupportedStack[];

  /** AI Agents that will receive SDD rules */
  agents?: AiAgent[];

  /** IDE to configure ecosystem for */
  ide?: string;

  /** Whether to inject linting tools (eslint, prettier) */
  lint?: boolean;

  /** Skill management */
  skills?: SkillsConfig;
}

/**
 * The shape of the local sdd.config.json file persisted in the project root.
 * Extends WorkspaceConfig with a generated timestamp.
 */
export interface LocalWorkspaceConfig extends WorkspaceConfig {
  /** ISO timestamp of last update */
  updatedAt?: string;
}

/**
 * The shape of the global ~/.sddrc.json file with personal defaults.
 */
export interface GlobalUserConfig {
  defaults?: Pick<WorkspaceConfig, "agents" | "ide" | "lint">;
  skills?: Pick<SkillsConfig, "add">;
}
