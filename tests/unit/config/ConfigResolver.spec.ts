import fs from "fs";
import path from "path";
import { ConfigResolver } from "../../../src/config/ConfigResolver";
import { AiAgent } from "../../../src/domain/enums/AiAgent";
import { SupportedStack } from "../../../src/domain/enums/SupportedStack";
import { RegistryLoader } from "../../../src/resources/RegistryLoader";

jest.mock("fs");
jest.mock("../../../src/resources/RegistryLoader");

describe("ConfigResolver - 4-Layer Merge Hierarchy", () => {
  let resolver: ConfigResolver;
  const mockRegistry = {
    skills: {},
    stacks: {
      [SupportedStack.NODEJS]: {
        defaultSkills: ["tlc-spec-driven", "nodejs-best-practices"],
        ruleTemplateFile: "node-rules.md",
        linterDependencies: ["eslint", "prettier"]
      }
    }
  };

  beforeEach(() => {
    resolver = new ConfigResolver();
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (RegistryLoader.load as jest.Mock).mockReturnValue(mockRegistry);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // ─── Layer 1: Built-in Registry Defaults ───────────────────────────────────

  it("should return built-in registry defaults when no global/local config exist", () => {
    const result = resolver.resolve({ stacks: [SupportedStack.NODEJS] }, "/fake/project");

    expect(result.skills?.include).toContain("tlc-spec-driven");
    expect(result.skills?.include).toContain("nodejs-best-practices");
    expect(result.linterDependencies).toContain("eslint");
    expect(result.ruleTemplates?.[SupportedStack.NODEJS]).toBe("node-rules.md");
  });

  // ─── Layer 2: Global Config with Incremental Stack Overrides ────────────────

  it("should apply global stack-specific overrides incrementally", () => {
    // Mock Global Config existence
    (fs.existsSync as jest.Mock).mockImplementation((p) => String(p).includes(".sddrc.json"));
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({
      stacks: {
        [SupportedStack.NODEJS]: {
          addSkills: ["global-skill"],
          addTools: ["husky"]
        }
      }
    }));

    const result = resolver.resolve({ stacks: [SupportedStack.NODEJS] }, "/fake/project");

    expect(result.skills?.include).toContain("global-skill");
    expect(result.skills?.include).toContain("tlc-spec-driven");
    expect(result.linterDependencies).toContain("husky");
    expect(result.linterDependencies).toContain("eslint");
  });

  // ─── Layer 3: Local Config ──────────────────────────────────────────────────

  it("should apply local config over global config", () => {
    (fs.existsSync as jest.Mock).mockImplementation((p) => String(p).includes("sdd.config.json"));
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({
      agents: [AiAgent.CURSOR],
      lint: false
    }));

    const result = resolver.resolve({ stacks: [SupportedStack.NODEJS] }, "/fake/project");

    expect(result.agents).toContain(AiAgent.CURSOR);
    expect(result.lint).toBe(false);
  });

  // ─── Layer 4: CLI Flags ─────────────────────────────────────────────────────

  it("should apply CLI flags as highest priority", () => {
    const result = resolver.resolve({ agents: [AiAgent.ANTIGRAVITY], lint: true }, "/fake/project");

    expect(result.agents).toContain(AiAgent.ANTIGRAVITY);
    expect(result.lint).toBe(true);
  });

  // ─── generateLocalConfigContent ────────────────────────────────────────────

  it("should generate a valid sdd.config.json content object", () => {
    const resolved = resolver.resolve({ stacks: [SupportedStack.NODEJS] }, "/fake/project");
    const content = resolver.generateLocalConfigContent(resolved, "2026-01-01T00:00:00.000Z");

    expect(content.version).toBe("0.0.2");
    expect(content.stacks).toContain(SupportedStack.NODEJS);
    expect(content.updatedAt).toBe("2026-01-01T00:00:00.000Z");
  });
});
