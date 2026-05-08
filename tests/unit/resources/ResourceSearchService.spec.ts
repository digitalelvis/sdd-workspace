import { ResourceSearchService } from "../../../src/resources/ResourceSearchService";
import { ResourceType } from "../../../src/domain/enums/ResourceType";
import { SkillRegistryCatalog } from "../../../src/domain/contracts/SkillRegistry";

describe("ResourceSearchService", () => {
  const mockRegistry: Partial<SkillRegistryCatalog> = {
    skills: {
      "mongodb-connection": {
        resource: "skill",
        mode: "git",
        provider: "mongodb",
        categories: ["database"],
        roles: ["backend"],
      } as any,
      "supabase-postgres": {
        resource: "skill",
        mode: "git",
        provider: "supabase",
        categories: ["database"],
        roles: ["backend"],
      } as any,
      "security-scan": {
        resource: "skill",
        mode: "local",
        categories: ["security"],
        roles: ["global"],
      } as any,
    },
    rules: {
      "git-governance": {
        resource: "rule",
        mode: "local",
        provider: "sdd",
        categories: ["architecture"],
        roles: ["all"],
      } as any,
      "clean-code": {
        resource: "rule",
        mode: "local",
        provider: "community",
        categories: ["architecture", "quality"],
        roles: ["all"],
      } as any,
    },
  };

  const service = new ResourceSearchService(mockRegistry as SkillRegistryCatalog);

  // ─── Skills ────────────────────────────────────────────────────────────────

  it("should find skills by provider", () => {
    const results = service.find({ type: ResourceType.SKILL, provider: "mongodb" });
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("mongodb-connection");
  });

  it("should find skills by category", () => {
    const results = service.find({ type: ResourceType.SKILL, category: "database" });
    const ids = results.map((r) => r.id);
    expect(ids).toContain("mongodb-connection");
    expect(ids).toContain("supabase-postgres");
    expect(results).toHaveLength(2);
  });

  it("should find skills by name (partial match)", () => {
    const results = service.find({ type: ResourceType.SKILL, name: "postgres" });
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("supabase-postgres");
  });

  it("should find skills by searchTerm (id or provider)", () => {
    const results = service.find({ type: ResourceType.SKILL, searchTerm: "mongo" });
    const ids = results.map((r) => r.id);
    expect(ids).toContain("mongodb-connection");
  });

  it("should return empty array when no skills match", () => {
    const results = service.find({ type: ResourceType.SKILL, provider: "non-existent" });
    expect(results).toEqual([]);
  });

  // ─── Rules ─────────────────────────────────────────────────────────────────

  it("should find rules by provider", () => {
    const results = service.find({ type: ResourceType.RULE, provider: "sdd" });
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("git-governance");
  });

  it("should find rules by category", () => {
    const results = service.find({ type: ResourceType.RULE, category: "architecture" });
    const ids = results.map((r) => r.id);
    expect(ids).toContain("git-governance");
    expect(ids).toContain("clean-code");
    expect(results).toHaveLength(2);
  });

  it("should find rules by name (partial match)", () => {
    const results = service.find({ type: ResourceType.RULE, name: "clean" });
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("clean-code");
  });

  it("should return empty array when no rules match", () => {
    const results = service.find({ type: ResourceType.RULE, provider: "non-existent" });
    expect(results).toEqual([]);
  });

  // ─── Combined filters ──────────────────────────────────────────────────────

  it("should combine provider and category filters (AND logic)", () => {
    const results = service.find({
      type: ResourceType.RULE,
      provider: "community",
      category: "quality",
    });
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("clean-code");
  });

  it("should return definition with each result", () => {
    const results = service.find({ type: ResourceType.SKILL, provider: "supabase" });
    expect(results[0].definition.provider).toBe("supabase");
    expect(results[0].definition.categories).toContain("database");
  });
});
