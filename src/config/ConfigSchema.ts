import { AiAgent } from "../domain/enums/AiAgent";
import { SupportedStack } from "../domain/enums/SupportedStack";
import { SupportedDatabase } from "../domain/enums/SupportedDatabase";
import { ToolDefinition } from "../domain/contracts/SkillRegistry";

export interface SkillsConfig {
  include?: string[];
  exclude?: string[];
  add?: string[];
}

export interface StackOverride {
  addSkills?: string[];
  addTools?: string[];
}

/**
 * The canonical WorkspaceConfig contract.
 */
export interface WorkspaceConfig {
  version?: string;
  stacks?: SupportedStack[];
  agents?: AiAgent[];
  ide?: string;
  lint?: boolean;
  database?: SupportedDatabase[];
  security?: string[];
  skills?: SkillsConfig;
  
  /** 
   * Internal resolved field for ecosystem tools.
   * Not typically persisted in sdd.config.json, but used during runtime.
   */
  linterDependencies?: string[];
  
  /** Metadata of the resolved tools mapped by their registry key */
  resolvedTools?: Record<string, ToolDefinition>;
  
  /** Mapping of rule templates for detected stacks */
  ruleTemplates?: Record<string, string>;
}

export interface LocalWorkspaceConfig extends WorkspaceConfig {
  updatedAt?: string;
}

export interface GlobalUserConfig {
  defaults?: Pick<WorkspaceConfig, "agents" | "ide" | "lint">;
  skills?: Pick<SkillsConfig, "add">;
  
  /** Stack-specific global overrides */
  stacks?: Record<string, StackOverride>;
}
