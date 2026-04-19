import fs from "fs";
import path from "path";
import { SDDEngine } from "../../../src/scaffolder/engines/SDDEngine";
import { AiAgent } from "../../../src/domain/enums/AiAgent";
import { NodeStackProvider } from "../../../src/scaffolder/providers/stacks/NodeStackProvider";

// We mock 'fs' and 'child_process' to isolate the engine from the file system and external CLI calls
jest.mock("fs");
jest.mock("child_process", () => ({
  execSync: jest.fn(),
}));

const { execSync } = require("child_process");

describe("SDDEngine - Hybrid Skill Hub Injection", () => {
  let sddEngine: SDDEngine;
  let logSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    logSpy = jest.spyOn(console, "log").mockImplementation();
    warnSpy = jest.spyOn(console, "warn").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
    sddEngine = new SDDEngine();
  });

  afterEach(() => {
    logSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it("should throw an error (via rejected promise) if common-rules.md is missing", async () => {
    // All fs.existsSync calls return false → common-rules.md won't be found
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    await expect(
      sddEngine.inject("/target/dir", [new NodeStackProvider()], [AiAgent.CURSOR])
    ).rejects.toThrow("common-rules.md not found");
  });

  it("should inject rules for selected agents when common-rules.md exists", async () => {
    // common-rules.md exists, all other paths return false (no stack rules, no registry, no skills)
    (fs.existsSync as jest.Mock).mockImplementation((filePath: string) => {
      if (String(filePath).endsWith("common-rules.md")) return true;
      return false;
    });
    (fs.readFileSync as jest.Mock).mockImplementation((filePath: string) => {
      if (String(filePath).endsWith("common-rules.md")) return "# Common Rules";
      return "{}";
    });
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    await sddEngine.inject("/target/dir", [new NodeStackProvider()], [AiAgent.CURSOR]);

    // Cursor's injectRules writes a .cursorrules file
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining(".cursorrules"),
      expect.any(String)
    );
  });

  it("should emit a warning when no agents are selected", async () => {
    (fs.existsSync as jest.Mock).mockImplementation((filePath: string) => {
      return String(filePath).endsWith("common-rules.md");
    });
    (fs.readFileSync as jest.Mock).mockReturnValue("# Common Rules");
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});

    await sddEngine.inject("/target/dir", [new NodeStackProvider()], []);

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("No AI Agents selected")
    );
  });

  it("should execute CLI command for skills mapped as 'cli' mode in the registry", async () => {
    // common-rules.md + skills-registry.json both resolve
    (fs.existsSync as jest.Mock).mockImplementation((filePath: string) => {
      const p = String(filePath);
      return p.endsWith("common-rules.md") || p.endsWith("registry.json");
    });
    (fs.readFileSync as jest.Mock).mockImplementation((filePath: string) => {
      if (String(filePath).endsWith("common-rules.md")) return "# Common Rules";
      if (String(filePath).endsWith("registry.json")) {
        return JSON.stringify({
          "tlc-spec-driven": {
            resource: "skill",
            mode: "cli",
            command: "npx -y @tech-leads-club/agent-skills install -s tlc-spec-driven",
            roles: ["global"],
          },
        });
      }
      return "";
    });
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
    execSync.mockImplementation(() => {});

    const provider = new NodeStackProvider();
    // NodeStackProvider includes 'tlc-spec-driven' in defaultSkills
    await sddEngine.inject("/target/dir", [provider], [AiAgent.CURSOR]);

    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining("@tech-leads-club/agent-skills install -s tlc-spec-driven"),
      expect.objectContaining({ stdio: "inherit" })
    );
  });

  it("should fallback to local copy when skill is not in the registry", async () => {
    (fs.existsSync as jest.Mock).mockImplementation((filePath: string) => {
      return String(filePath).endsWith("common-rules.md");
      // skills-registry.json NOT found → registry stays empty
    });
    (fs.readFileSync as jest.Mock).mockImplementation((filePath: string) => {
      if (String(filePath).endsWith("common-rules.md")) return "# Common Rules";
      return "";
    });
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
    (fs.cpSync as jest.Mock).mockImplementation(() => {});

    await sddEngine.inject("/target/dir", [new NodeStackProvider()], [AiAgent.CURSOR]);

    // Should attempt local fallback copy for all 3 skills from NodeStackProvider
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("skills-registry.json not found")
    );
  });
});
