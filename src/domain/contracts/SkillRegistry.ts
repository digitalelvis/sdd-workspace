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

export type SkillRegistryCatalog = Record<string, SkillDefinition>;
