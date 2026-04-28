import { SkillService } from "../../../src/resources/SkillService";
import { SkillRegistryCatalog } from "../../../src/domain/contracts/SkillRegistry";

describe("SkillService", () => {
  const mockRegistry: Partial<SkillRegistryCatalog> = {
    skills: {
      "mongodb-connection": {
        resource: "skill",
        mode: "git",
        provider: "mongodb",
        categories: ["database"],
        roles: ["backend"]
      } as any,
      "supabase-postgres": {
        resource: "skill",
        mode: "git",
        provider: "supabase",
        categories: ["database"],
        roles: ["backend"]
      } as any,
      "security-scan": {
        resource: "skill",
        mode: "local",
        categories: ["security"],
        roles: ["global"]
      } as any
    }
  };

  const service = new SkillService(mockRegistry as SkillRegistryCatalog);

  it("should find skills by provider", () => {
    const results = service.findSkills({ provider: "mongodb" });
    expect(results).toEqual(["mongodb-connection"]);
  });

  it("should find skills by category", () => {
    const results = service.findSkills({ category: "database" });
    expect(results).toContain("mongodb-connection");
    expect(results).toContain("supabase-postgres");
    expect(results.length).toBe(2);
  });

  it("should find skills by name (partial match)", () => {
    const results = service.findSkills({ name: "postgres" });
    expect(results).toEqual(["supabase-postgres"]);
  });

  it("should resolve from multiple providers", () => {
    const results = service.resolveFromProviders(["mongodb", "supabase"]);
    expect(results).toContain("mongodb-connection");
    expect(results).toContain("supabase-postgres");
    expect(results.length).toBe(2);
  });

  it("should handle no results gracefully", () => {
    const results = service.findSkills({ provider: "non-existent" });
    expect(results).toEqual([]);
  });
});
