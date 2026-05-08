import { SkillRegistryCatalog, ResourceDefinition } from "../domain/contracts/SkillRegistry";
import { ResourceType } from "../domain/enums/ResourceType";

export interface ResourceSearchQuery {
  type: ResourceType;
  provider?: string;
  category?: string;
  name?: string;
  searchTerm?: string;
}

export interface ResourceSearchResult {
  id: string;
  definition: ResourceDefinition;
}

/**
 * ResourceSearchService — unified discovery engine for skills and rules.
 *
 * Replaces the skill-only SkillService.findSkills concern while keeping
 * SkillService.resolveFromProviders intact as a delegation layer (OCP).
 * Commands depend on this contract, not on registry internals (DIP).
 */
export class ResourceSearchService {
  constructor(private readonly registry: SkillRegistryCatalog) {}

  /**
   * Returns all resources of the given type that match the query filters.
   * Filters are combined with AND logic; omitted filters are ignored.
   */
  public find(query: ResourceSearchQuery): ResourceSearchResult[] {
    const catalog = query.type === ResourceType.SKILL
      ? this.registry.skills
      : this.registry.rules;

    return Object.entries(catalog)
      .filter(([id, def]) => this.matches(id, def, query))
      .map(([id, def]) => ({ id, definition: def }));
  }

  // ─── Private ───────────────────────────────────────────────────────────────

  private matches(id: string, def: ResourceDefinition, query: ResourceSearchQuery): boolean {
    if (query.provider && def.provider !== query.provider) {
      return false;
    }

    if (query.category && !def.categories?.includes(query.category)) {
      return false;
    }

    if (query.name && !id.toLowerCase().includes(query.name.toLowerCase())) {
      return false;
    }

    if (query.searchTerm) {
      const term = query.searchTerm.toLowerCase();
      const matchesId = id.toLowerCase().includes(term);
      const matchesProvider = def.provider?.toLowerCase().includes(term) ?? false;
      if (!matchesId && !matchesProvider) {
        return false;
      }
    }

    return true;
  }
}
