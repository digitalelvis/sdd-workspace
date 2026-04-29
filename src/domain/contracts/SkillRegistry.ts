export type SkillStrategyMode = "cli" | "remote" | "local" | "git";
export type ResourceType = "skill" | "rule";

export interface ResourceDefinition {
  resource: ResourceType;
  mode: SkillStrategyMode;
  provider?: string;
  categories?: string[];
  roles: string[];
  command?: string;   // Used when mode === 'cli'
  url?: string;       // Used when mode === 'remote' or 'git'
  path?: string;      // Internal destination or source for 'local' mode
  subpath?: string;   // For 'git' mode, the directory within the repository
  branch?: string;    // For 'git' mode, the branch/tag/ref
}

export interface StackDefinition {
  defaultSkills: string[];
  ruleTemplateFile?: string;
  defaultRules?: string[];
  linterDependencies: string[];
}

export interface AgentDefinition {
  ruleFile: string;
  strategy: "reference" | "symlink" | "file";
}

export interface IdeDefinition {
  configDir: string;
  files?: Array<{ template: string; target: string }>;
}

export interface DatabaseDefinition {
  displayName: string;
  defaultRules?: string[];
  defaultSkills?: string[];
  detectionFiles?: string[];
  detectionDeps?: string[];
}

export interface ToolDefinition {
  type: string;
  displayName: string;
  defaultSkills?: string[];
  defaultSkillsProviders?: string[];
  defaultRules?: string[];
  configFiles: string[];
  dependencies: string[];
  recommendedStacks?: string[];
}

export interface SkillRegistryCatalog {
  skills: Record<string, ResourceDefinition>;
  rules: Record<string, ResourceDefinition>;
  stacks: Record<string, StackDefinition>;
  agents: Record<string, AgentDefinition>;
  ides: Record<string, IdeDefinition>;
  databases: Record<string, DatabaseDefinition>;
  tools?: Record<string, ToolDefinition>;
}
