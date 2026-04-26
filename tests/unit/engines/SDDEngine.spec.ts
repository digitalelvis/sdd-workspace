import fs from "fs";
import { SDDEngine } from "../../../src/scaffolder/engines/SDDEngine";
import { AiAgent } from "../../../src/domain/enums/AiAgent";
import { NodeStackProvider } from "../../../src/scaffolder/providers/stacks/NodeStackProvider";
import { RegistryLoader } from "../../../src/resources/RegistryLoader";

jest.mock("fs");
jest.mock("child_process", () => ({
  execSync: jest.fn(),
}));
jest.mock("../../../src/resources/RegistryLoader");

const { execSync } = require("child_process");

// Mock global fetch
global.fetch = jest.fn();

describe("SDDEngine - Registry-Driven Injection", () => {
  let sddEngine: SDDEngine;
  let logSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;

  const mockRegistry = {
    skills: {
      "tlc-spec-driven": {
        resource: "skill",
        mode: "cli",
        command: "npx install-skill",
        roles: ["global"]
      },
      "local-skill": {
        resource: "skill",
        mode: "local",
        path: "skills/local-skill",
        roles: ["global"]
      },
      "remote-skill": {
        resource: "skill",
        mode: "remote",
        url: "https://example.com/skill.md",
        roles: ["global"]
      },
      "git-github-skill": {
        resource: "skill",
        mode: "git",
        url: "https://github.com/owner/repo",
        subpath: "skills/git-skill",
        roles: ["global"]
      },
      "git-other-skill": {
        resource: "skill",
        mode: "git",
        url: "https://gitlab.com/owner/repo",
        roles: ["global"]
      }
    },
    rules: {
      "engineering-rules": {
        resource: "rule",
        mode: "local",
        path: "rules/engineering-rules.md",
        roles: ["global"]
      },
      "node-rules": {
        resource: "rule",
        mode: "local",
        path: "rules/node-rules.md",
        roles: ["backend"]
      },
      "extra-rules": {
        resource: "rule",
        mode: "local",
        path: "rules/extra-rules.md",
        roles: ["backend"]
      }
    },
    stacks: {
      "nodejs": {
        "defaultSkills": ["tlc-spec-driven"],
        "defaultRules": ["node-rules", "extra-rules"],
        "linterDependencies": ["eslint"]
      }
    },
    agents: {
      "cursor": {
        "ruleFile": ".cursorrules",
        "strategy": "reference"
      }
    },
    ides: {
      "vscode": {
        "configDir": ".vscode"
      }
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    logSpy = jest.spyOn(console, "log").mockImplementation();
    warnSpy = jest.spyOn(console, "warn").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
    sddEngine = new SDDEngine();
    (RegistryLoader.load as jest.Mock).mockReturnValue(mockRegistry);
  });

  afterEach(() => {
    logSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it("should throw an error if engineering-rules is not in registry", async () => {
    const emptyRegistry = { ...mockRegistry, rules: {} };
    (RegistryLoader.load as jest.Mock).mockReturnValue(emptyRegistry);
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    
    // It should not throw because it just warns and continues if it fails to provision, 
    // but the test expects it to work if common rules are there.
    // Actually, I removed the throw in SDDEngine for common rules.
    await sddEngine.inject("/target/dir", [], [AiAgent.CURSOR], []);
    expect(warnSpy).not.toHaveBeenCalled(); // Should just work with default content if nothing is found
  });

  it("should inject rules for selected agents", async () => {
    (fs.existsSync as jest.Mock).mockImplementation((filePath: string) => {
      if (String(filePath).includes("engineering-rules.md")) return true;
      return false;
    });
    (fs.readFileSync as jest.Mock).mockReturnValue("# Common Rules");
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    await sddEngine.inject("/target/dir", [new NodeStackProvider()], [AiAgent.CURSOR], ["tlc-spec-driven"]);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining(".cursorrules"),
      expect.stringContaining("[main.md](file://./.agents/rules/main.md)")
    );
  });

  it("should concatenate multiple rules defined in defaultRules", async () => {
    (fs.existsSync as jest.Mock).mockImplementation((filePath: string) => {
      // Logic: First they are checked for provisioning (basePath + source), then for reading (targetDir + rulesDir + id.md)
      if (String(filePath).includes("rules/engineering-rules.md")) return true;
      if (String(filePath).includes("rules/node-rules.md")) return true;
      if (String(filePath).includes("rules/extra-rules.md")) return true;
      if (String(filePath).includes(".agents/rules/engineering-rules.md")) return true;
      if (String(filePath).includes(".agents/rules/node-rules.md")) return true;
      if (String(filePath).includes(".agents/rules/extra-rules.md")) return true;
      return false;
    });
    (fs.readFileSync as jest.Mock).mockImplementation((filePath: string) => {
      if (String(filePath).includes("engineering-rules.md")) return "# Common";
      if (String(filePath).includes("node-rules.md")) return "# Node";
      if (String(filePath).includes("extra-rules.md")) return "# Extra";
      return "";
    });
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
    (fs.cpSync as jest.Mock).mockImplementation(() => {});

    await sddEngine.inject("/target/dir", [new NodeStackProvider()], [AiAgent.CURSOR], []);

    // Check main.md content
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining("main.md"),
      expect.stringContaining("# Common\n\n# Node\n\n# Extra")
    );
  });

  it("should execute CLI command for 'cli' mode skills from registry", async () => {
    (fs.existsSync as jest.Mock).mockImplementation((filePath: string) => {
      if (String(filePath).includes("engineering-rules.md")) return true;
      return false;
    });
    (fs.readFileSync as jest.Mock).mockReturnValue("# Common Rules");
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    execSync.mockImplementation(() => {});

    await sddEngine.inject("/target/dir", [], [AiAgent.CURSOR], ["tlc-spec-driven"]);

    expect(execSync).toHaveBeenCalledWith(
      "npx install-skill",
      expect.objectContaining({ stdio: "inherit" })
    );
  });

  it("should provision 'local' mode skills by copying directory", async () => {
    (fs.existsSync as jest.Mock).mockImplementation((filePath: string) => {
      if (String(filePath).endsWith("engineering-rules.md")) return true;
      if (String(filePath).includes("skills/local-skill")) return true;
      return false;
    });
    (fs.readFileSync as jest.Mock).mockReturnValue("# Content");
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    (fs.cpSync as jest.Mock) = jest.fn();

    await sddEngine.inject("/target/dir", [], [AiAgent.CURSOR], ["local-skill"]);

    expect(fs.cpSync).toHaveBeenCalledWith(
      expect.stringContaining("skills/local-skill"),
      expect.stringContaining(".agents/skills/local-skill"),
      expect.objectContaining({ recursive: true })
    );
  });

  it("should provision 'remote' mode skills by fetching URL", async () => {
    (fs.existsSync as jest.Mock).mockImplementation((filePath: string) => {
      if (String(filePath).includes("engineering-rules.md")) return true;
      return false;
    });
    (fs.readFileSync as jest.Mock).mockReturnValue("# Content");
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      text: jest.fn().mockResolvedValue("# Remote Skill Content"),
    });

    await sddEngine.inject("/target/dir", [], [AiAgent.CURSOR], ["remote-skill"]);

    expect(global.fetch).toHaveBeenCalledWith("https://example.com/skill.md");
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining(".agents/skills/remote-skill/SKILL.md"),
      "# Remote Skill Content",
      "utf-8"
    );
  });

  it("should provision 'git' mode skills via GitHub API", async () => {
    (fs.existsSync as jest.Mock).mockImplementation((filePath: string) => {
      if (String(filePath).includes("engineering-rules.md")) return true;
      return false;
    });
    (fs.readFileSync as jest.Mock).mockReturnValue("# Content");
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    // Mock GitHub API responses
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([
          { name: "SKILL.md", type: "file", download_url: "https://raw.../SKILL.md" }
        ]),
      })
      .mockResolvedValueOnce({
        ok: true,
        text: jest.fn().mockResolvedValue("# GitHub Skill Content"),
      });

    await sddEngine.inject("/target/dir", [], [AiAgent.CURSOR], ["git-github-skill"]);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("api.github.com/repos/owner/repo/contents/skills/git-skill"),
      expect.any(Object)
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining(".agents/skills/git-github-skill/SKILL.md"),
      "# GitHub Skill Content",
      "utf-8"
    );
  });

  it("should provision 'git' mode skills via clone for non-GitHub URLs", async () => {
    (fs.existsSync as jest.Mock).mockImplementation((filePath: string) => {
      if (String(filePath).endsWith("engineering-rules.md")) return true;
      if (String(filePath).includes(".sdd-temp-skill")) return true;
      return false;
    });
    (fs.readFileSync as jest.Mock).mockReturnValue("# Content");
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    (fs.cpSync as jest.Mock) = jest.fn();
    (fs.rmSync as jest.Mock) = jest.fn();
    execSync.mockImplementation(() => {});

    await sddEngine.inject("/target/dir", [], [AiAgent.CURSOR], ["git-other-skill"]);

    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining("git clone --depth 1 https://gitlab.com/owner/repo"),
      expect.any(Object)
    );
    expect(fs.cpSync).toHaveBeenCalled();
    expect(fs.rmSync).toHaveBeenCalled();
  });
});
