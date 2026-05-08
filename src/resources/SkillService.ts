import { SkillRegistryCatalog } from "../domain/contracts/SkillRegistry";
import { ResourceType } from "../domain/enums/ResourceType";
import { ResourceSearchService, ResourceSearchQuery } from "./ResourceSearchService";

export type { ResourceSearchQuery as SkillSearchQuery };

/**
 * SkillService — skill-scoped façade over ResourceSearchService.
 * Kept for backward compatibility with registry provisioning code.
 */
export class SkillService {
  private readonly searchService: ResourceSearchService;

  constructor(private readonly registry: SkillRegistryCatalog) {
    this.searchService = new ResourceSearchService(registry);
  }

  /**
   * Find skills matching the given query.
   * Delegates to ResourceSearchService with type fixed to SKILL.
   */
  public findSkills(query: Omit<ResourceSearchQuery, "type">): string[] {
    return this.searchService
      .find({ ...query, type: ResourceType.SKILL })
      .map((r) => r.id);
  }

  /**
   * Resolve all skill IDs for a list of providers.
   */
  public resolveFromProviders(providers: string[]): string[] {
    const discovered = providers.flatMap((provider) =>
      this.findSkills({ provider })
    );
    return Array.from(new Set(discovered));
  }
}
