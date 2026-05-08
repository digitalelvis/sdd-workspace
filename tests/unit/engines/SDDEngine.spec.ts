import fs from "fs";
import { SDDEngine } from "../../../src/scaffolder/engines/SDDEngine";
import { AiAgent } from "../../../src/domain/enums/AiAgent";
import { NodeStackProvider } from "../../../src/scaffolder/providers/stacks/NodeStackProvider";
import { RegistryLoader } from "../../../src/resources/RegistryLoader";

jest.mock("fs");
jest.mock("child_process", () => ({ execSync: jest.fn() }));
jest.mock("../../../src/resources/RegistryLoader");

const { execSync } = require("child_process");

global.fetch = jest.fn();

describe("SDDEngine - Registry-Driven Injection", () => {
  let sddEngine: SDDEngine;
  let logSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  const mockRegistry = {
    skills: {
      "tlc-spec-driven": {
        resource: "skill",
        mode: "cli",
        command: "npx install-skill",
        roles: ["global"],
      },
      "local-skill": {
        resource: "skill",
        mode: "local",
        path: "skills/local-skill",
        roles: ["global"],
      },
      "remote-skill": {
        resource: "skill",
        mode: "remote",
        url: "https://example.com/skill.md",
        roles: ["global"],
      },
      "git-github-skill": {
        resource: "skill",
        mode: "git",
        url: "https://github.com/owner/repo",
        subpath: "skills/git-skill",
        roles: ["global"],
      },
      "git-other-skill": {
        resource: "skill",
        mode: "git",
        url: "https://gitlab.com/owner/repo",
        roles: ["global"],
      },
    },
    rules: {
      "engineering-rules": {
        resource: "rule",
        mode: "local",
        path: "rules/engineering-rules.md",
        roles: ["global"],
      },
      "node-rules": {
        resource: "rule",
        mode: "local",
        path: "rules/node-rules.md",
        roles: ["backend"],
      },
      "extra-rules": {
        resource: "rule",
        mode: "local",
        path: "rules/extra-rules.md",
        roles: ["backend"],
      },
    },
    stacks: {
      nodejs: {
        defaultSkills: ["tlc-spec-driven"],
        defaultRules: ["node-rules", "extra-rules"],
        linterDependencies: ["eslint"],
      },
    },
    agents: {
      cursor: {
        ruleFile: ".cursorrules",
        strategy: "reference",
      },
    },
    ides: {
      vscode: { configDir: ".vscode" },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    logSpy = jest.spyOn(console, "log").mockImplementation();
    warnSpy = jest.spyOn(console, "warn").mockImplementation();
    errorSpy = jest.spyOn(console, "error").mockImplementation();
    sddEngine = new SDDEngine();
    (RegistryLoader.load as jest.Mock).mockReturnValue(mockRegistry);
  });

  afterEach(() => {
    logSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  // ─── Rules provisioning ────────────────────────────────────────────────────

  it("should complete without warnings when the rules registry is empty", async () => {
    const emptyRegistry = { ...mockRegistry, rules: {} };
    (RegistryLoader.load as jest.Mock).mockReturnValue(emptyRegistry);
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    await sddEngine.inject("/target/dir", [], [AiAgent.CURSOR], []);

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("should write agent rule file using the reference strategy", async () => {
    (fs.existsSync as jest.Mock).mockImplementation((p: string) =>
      String(p).includes("engineering-rules.md"),
    );
    (fs.readFileSync as jest.Mock).mockReturnValue("# Common Rules");
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    await sddEngine.inject("/target/dir", [new NodeStackProvider()], [AiAgent.CURSOR], ["tlc-spec-driven"]);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining(".cursorrules"),
      expect.stringContaining("[main.md](file://./.agents/rules/main.md)"),
    );
  });

  it("should concatenate multiple rules defined in defaultRules into main.md", async () => {
    (fs.existsSync as jest.Mock).mockImplementation((p: string) => {
      return (
        String(p).includes("rules/engineering-rules.md") ||
        String(p).includes("rules/node-rules.md") ||
        String(p).includes("rules/extra-rules.md") ||
        String(p).includes(".agents/rules/engineering-rules.md") ||
        String(p).includes(".agents/rules/node-rules.md") ||
        String(p).includes(".agents/rules/extra-rules.md")
      );
    });
    (fs.readFileSync as jest.Mock).mockImplementation((p: string) => {
      if (String(p).includes("engineering-rules.md")) return "# Common";
      if (String(p).includes("node-rules.md")) return "# Node";
      if (String(p).includes("extra-rules.md")) return "# Extra";
      return "";
    });
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
    (fs.cpSync as jest.Mock).mockImplementation(() => {});

    await sddEngine.inject("/target/dir", [new NodeStackProvider()], [AiAgent.CURSOR], []);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining("main.md"),
      expect.stringContaining("# Common\n\n# Node\n\n# Extra"),
    );
  });

  // ─── Skill provisioning modes ──────────────────────────────────────────────

  it("should execute CLI command for 'cli' mode skills", async () => {
    (fs.existsSync as jest.Mock).mockImplementation((p: string) =>
      String(p).includes("engineering-rules.md"),
    );
    (fs.readFileSync as jest.Mock).mockReturnValue("# Common Rules");
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    execSync.mockImplementation(() => {});

    await sddEngine.inject("/target/dir", [], [AiAgent.CURSOR], ["tlc-spec-driven"]);

    expect(execSync).toHaveBeenCalledWith(
      "npx install-skill",
      expect.objectContaining({ stdio: "inherit" }),
    );
  });

  it("should copy directory for 'local' mode skills", async () => {
    (fs.existsSync as jest.Mock).mockImplementation((p: string) =>
      String(p).endsWith("engineering-rules.md") || String(p).includes("skills/local-skill"),
    );
    (fs.readFileSync as jest.Mock).mockReturnValue("# Content");
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    (fs.cpSync as jest.Mock) = jest.fn();

    await sddEngine.inject("/target/dir", [], [AiAgent.CURSOR], ["local-skill"]);

    expect(fs.cpSync).toHaveBeenCalledWith(
      expect.stringContaining("skills/local-skill"),
      expect.stringContaining(".agents/skills/local-skill"),
      expect.objectContaining({ recursive: true }),
    );
  });

  it("should fetch and write SKILL.md for 'remote' mode skills", async () => {
    (fs.existsSync as jest.Mock).mockImplementation((p: string) =>
      String(p).includes("engineering-rules.md"),
    );
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
      "utf-8",
    );
  });

  it("should use the GitHub API for 'git' mode skills on github.com", async () => {
    (fs.existsSync as jest.Mock).mockImplementation((p: string) =>
      String(p).includes("engineering-rules.md"),
    );
    (fs.readFileSync as jest.Mock).mockReturnValue("# Content");
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([
          { name: "SKILL.md", type: "file", download_url: "https://raw.../SKILL.md" },
        ]),
      })
      .mockResolvedValueOnce({
        ok: true,
        text: jest.fn().mockResolvedValue("# GitHub Skill Content"),
      });

    await sddEngine.inject("/target/dir", [], [AiAgent.CURSOR], ["git-github-skill"]);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("api.github.com/repos/owner/repo/contents/skills/git-skill"),
      expect.any(Object),
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining(".agents/skills/git-github-skill/SKILL.md"),
      "# GitHub Skill Content",
      "utf-8",
    );
  });

  it("should git-clone for 'git' mode skills on non-GitHub hosts", async () => {
    (fs.existsSync as jest.Mock).mockImplementation((p: string) =>
      String(p).endsWith("engineering-rules.md") || String(p).includes(".sdd-temp-skill"),
    );
    (fs.readFileSync as jest.Mock).mockReturnValue("# Content");
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    (fs.cpSync as jest.Mock) = jest.fn();
    (fs.rmSync as jest.Mock) = jest.fn();
    execSync.mockImplementation(() => {});

    await sddEngine.inject("/target/dir", [], [AiAgent.CURSOR], ["git-other-skill"]);

    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining("git clone --depth 1 https://gitlab.com/owner/repo"),
      expect.any(Object),
    );
    expect(fs.cpSync).toHaveBeenCalled();
    expect(fs.rmSync).toHaveBeenCalled();
  });

  // ─── AGENTS.md generation ──────────────────────────────────────────────────

  it("should generate AGENTS.md with substitutions applied when the file does not exist", async () => {
    const template = "# AGENTS.md\n{{STACKS}}\n{{DATABASES}}\n{{AGENTS}}\n{{SKILLS}}\n{{SKILLS_LIST}}\n{{DB_STRATEGY}}";

    (fs.existsSync as jest.Mock).mockImplementation((p: string) => {
      if (String(p).includes("agent-template.md")) return true;
      if (String(p).includes("engineering-rules.md")) return true;
      return false;
    });
    (fs.readFileSync as jest.Mock).mockReturnValue(template);
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    await sddEngine.inject("/target/dir", [], [AiAgent.CURSOR], []);

    const call = (fs.writeFileSync as jest.Mock).mock.calls.find((c) =>
      String(c[0]).endsWith("AGENTS.md"),
    );
    expect(call).toBeDefined();
    expect(String(call![1])).not.toContain("{{STACKS}}");
    expect(String(call![1])).not.toContain("{{DATABASES}}");
  });

  it("should inject orchestration block into an existing AGENTS.md", async () => {
    const existingContent = "# My Project\n\nSome existing guidance.";

    (fs.existsSync as jest.Mock).mockImplementation((p: string) => {
      if (String(p).includes("AGENTS.md")) return true;
      if (String(p).includes("engineering-rules.md")) return true;
      return false;
    });
    (fs.readFileSync as jest.Mock).mockImplementation((p: string) =>
      String(p).includes("AGENTS.md") ? existingContent : "# Content",
    );
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    await sddEngine.inject("/target/dir", [], [AiAgent.CURSOR], []);

    const call = (fs.writeFileSync as jest.Mock).mock.calls.find((c) =>
      String(c[0]).endsWith("AGENTS.md"),
    );
    expect(call).toBeDefined();
    expect(String(call![1])).toContain("## 1. Orchestration & Planning");
    expect(String(call![1])).toContain("spec-driven");
    expect(String(call![1])).toContain("# My Project");
    expect(String(call![1])).toContain("Some existing guidance.");
  });

  it("should not re-inject the orchestration block when already present in AGENTS.md (idempotent)", async () => {
    const alreadyInjected =
      "# My Agents\n\n## 1. Orchestration & Planning (Orchestrator)\n\nAlready here.\n";

    (fs.existsSync as jest.Mock).mockImplementation((p: string) => {
      if (String(p).includes("AGENTS.md")) return true;
      if (String(p).includes("engineering-rules.md")) return true;
      return false;
    });
    (fs.readFileSync as jest.Mock).mockImplementation((p: string) =>
      String(p).includes("AGENTS.md") ? alreadyInjected : "# Content",
    );
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    await sddEngine.inject("/target/dir", [], [AiAgent.CURSOR], []);

    const call = (fs.writeFileSync as jest.Mock).mock.calls.find((c) =>
      String(c[0]).endsWith("AGENTS.md"),
    );
    expect(call).toBeUndefined();
  });
});
