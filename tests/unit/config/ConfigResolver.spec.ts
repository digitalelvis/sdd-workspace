import fs from "fs";
import os from "os";
import path from "path";
import { ConfigResolver } from "../../../src/config/ConfigResolver";
import { AiAgent } from "../../../src/domain/enums/AiAgent";
import { SupportedStack } from "../../../src/domain/enums/SupportedStack";

jest.mock("fs");

const STACK_SKILLS = ["tlc-spec-driven", "nodejs-best-practices"];

describe("ConfigResolver - 4-Layer Merge Hierarchy", () => {
  let resolver: ConfigResolver;

  beforeEach(() => {
    resolver = new ConfigResolver();
    (fs.existsSync as jest.Mock).mockReturnValue(false);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // ─── Layer 1: Built-in Defaults ────────────────────────────────────────────

  it("should return built-in defaults when no configs exist", () => {
    const result = resolver.resolve({}, STACK_SKILLS, "/fake/project");

    expect(result.skills?.include).toEqual(expect.arrayContaining(STACK_SKILLS));
    expect(result.lint).toBe(true);
  });

  // ─── Layer 2: Global Config ─────────────────────────────────────────────────

  it("should apply global config agents over built-in defaults", () => {
    (fs.existsSync as jest.Mock).mockImplementation((p) =>
      String(p).includes(".sddrc.json")
    );
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify({ defaults: { agents: [AiAgent.WINDSURF], lint: false } })
    );

    const result = resolver.resolve({}, STACK_SKILLS, "/fake/project");

    expect(result.agents).toEqual([AiAgent.WINDSURF]);
    expect(result.lint).toBe(false);
  });

  it("should merge global skill additions on top of stack defaults", () => {
    (fs.existsSync as jest.Mock).mockImplementation((p) =>
      String(p).includes(".sddrc.json")
    );
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify({ skills: { add: ["shadcn-ui"] } })
    );

    const result = resolver.resolve({}, STACK_SKILLS, "/fake/project");

    expect(result.skills?.include).toContain("shadcn-ui");
    expect(result.skills?.include).toContain("tlc-spec-driven");
  });

  // ─── Layer 3: Local Config ──────────────────────────────────────────────────

  it("should apply local config over global config", () => {
    (fs.existsSync as jest.Mock).mockImplementation((p) =>
      String(p).includes("sdd.config.json")
    );
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify({ agents: [AiAgent.KIRO], ide: "cursor", lint: false })
    );

    const result = resolver.resolve({}, STACK_SKILLS, "/fake/project");

    expect(result.agents).toEqual([AiAgent.KIRO]);
    expect(result.ide).toBe("cursor");
    expect(result.lint).toBe(false);
  });

  it("should use local skills.include as full override of stack defaults", () => {
    (fs.existsSync as jest.Mock).mockImplementation((p) =>
      String(p).includes("sdd.config.json")
    );
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify({ skills: { include: ["only-this-skill"] } })
    );

    const result = resolver.resolve({}, STACK_SKILLS, "/fake/project");

    expect(result.skills?.include).toEqual(["only-this-skill"]);
    expect(result.skills?.include).not.toContain("tlc-spec-driven");
  });

  // ─── Layer 4: CLI Flags ─────────────────────────────────────────────────────

  it("should apply CLI flags over all other layers", () => {
    (fs.existsSync as jest.Mock).mockImplementation((p) =>
      String(p).includes("sdd.config.json")
    );
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify({ agents: [AiAgent.KIRO], lint: false })
    );

    const result = resolver.resolve(
      { agents: [AiAgent.ANTIGRAVITY], lint: true },
      STACK_SKILLS,
      "/fake/project"
    );

    expect(result.agents).toEqual([AiAgent.ANTIGRAVITY]);
    expect(result.lint).toBe(true);
  });

  // ─── Skill exclusion ───────────────────────────────────────────────────────

  it("should remove skills listed in local skills.exclude", () => {
    (fs.existsSync as jest.Mock).mockImplementation((p) =>
      String(p).includes("sdd.config.json")
    );
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify({ skills: { exclude: ["tlc-spec-driven"] } })
    );

    const result = resolver.resolve({}, STACK_SKILLS, "/fake/project");

    expect(result.skills?.include).not.toContain("tlc-spec-driven");
    expect(result.skills?.include).toContain("nodejs-best-practices");
  });

  // ─── generateLocalConfigContent ────────────────────────────────────────────

  it("should generate a valid sdd.config.json content object", () => {
    const resolved = resolver.resolve(
      { agents: [AiAgent.CURSOR], stacks: [SupportedStack.NODEJS] },
      STACK_SKILLS,
      "/fake/project"
    );
    resolved.stacks = [SupportedStack.NODEJS];

    const content = resolver.generateLocalConfigContent(resolved, "2026-01-01T00:00:00.000Z");

    expect(content.version).toBe("0.0.2");
    expect(content.stacks).toContain(SupportedStack.NODEJS);
    expect(content.updatedAt).toBe("2026-01-01T00:00:00.000Z");
    expect(content.skills?.include).toBeDefined();
  });
});
