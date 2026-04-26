export type SkillStrategyMode = "cli" | "remote" | "local" | "git";
export type ResourceType = "skill";

export interface SkillDefinition {
  resource: ResourceType;
  mode: SkillStrategyMode;
  roles: string[];
  command?: string;   // Used when mode === 'cli'
  url?: string;       // Used when mode === 'remote' or 'git'
  path?: string;      // Internal destination or source for 'local' mode
  subpath?: string;   // For 'git' mode, the directory within the repository
  branch?: string;    // For 'git' mode, the branch/tag/ref
}

export interface StackDefinition {
  defaultSkills: string[];
  ruleTemplateFile: string;
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

export interface SkillRegistryCatalog {
  skills: Record<string, SkillDefinition>;
  stacks: Record<string, StackDefinition>;
  agents: Record<string, AgentDefinition>;
  ides: Record<string, IdeDefinition>;
}
