import { SkillRegistryCatalog } from "../domain/contracts/SkillRegistry";

export interface SkillSearchQuery {
  provider?: string;
  category?: string;
  name?: string;
  searchTerm?: string;
}

/**
 * SkillService — Handles discovery and filtering of skills from the registry.
 */
export class SkillService {
  constructor(private readonly registry: SkillRegistryCatalog) {}

  /**
   * Find skills based on search criteria.
   */
  public findSkills(query: SkillSearchQuery): string[] {
    return Object.entries(this.registry.skills)
      .filter(([id, def]) => {
        // Filter by Provider
        if (query.provider && def.provider !== query.provider) {
          return false;
        }

        // Filter by Category
        if (query.category && !def.categories?.includes(query.category)) {
          return false;
        }

        // Filter by Name/ID (partial match)
        if (query.name && !id.toLowerCase().includes(query.name.toLowerCase())) {
          return false;
        }

        // Broad Search Term (matches ID or Provider)
        if (query.searchTerm) {
          const term = query.searchTerm.toLowerCase();
          const matchesId = id.toLowerCase().includes(term);
          const matchesProvider = def.provider?.toLowerCase().includes(term);
          if (!matchesId && !matchesProvider) {
            return false;
          }
        }

        return true;
      })
      .map(([id]) => id);
  }

  /**
   * Resolve all skill IDs from a list of providers.
   */
  public resolveFromProviders(providers: string[]): string[] {
    const discovered: string[] = [];
    for (const provider of providers) {
      discovered.push(...this.findSkills({ provider }));
    }
    return Array.from(new Set(discovered));
  }
}
