export type SkillStrategyMode = "cli" | "remote" | "local";
export type ResourceType = "skill";

export interface SkillDefinition {
  resource: ResourceType;
  mode: SkillStrategyMode;
  roles: string[];
  command?: string; // Utilizado quando mode === 'cli'
  url?: string;     // Utilizado quando mode === 'remote'
  path?: string;    // Destino interno em ambos 'remote' e 'local', ou source no 'local'
}

export interface StackDefinition {
  defaultSkills: string[];
  ruleTemplateFile: string;
  linterDependencies: string[];
}

export interface SkillRegistryCatalog {
  skills: Record<string, SkillDefinition>;
  stacks: Record<string, StackDefinition>;
}
