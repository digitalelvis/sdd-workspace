import fs from "fs";
import { WorkspaceService } from "../../../src/scaffolder/WorkspaceService";
import { SupportedStack } from "../../../src/domain/enums/SupportedStack";
import { AiAgent } from "../../../src/domain/enums/AiAgent";
import { WorkspaceConfig } from "../../../src/config/ConfigSchema";

jest.mock("fs");
jest.mock("../../../src/resources/RegistryLoader");
import { RegistryLoader } from "../../../src/resources/RegistryLoader";

describe("Scaffolder - WorkspaceService", () => {
  let stdoutSpy: jest.SpyInstance;
  let stderrSpy: jest.SpyInstance;

  beforeEach(() => {
    stdoutSpy = jest.spyOn(console, "log").mockImplementation();
    stderrSpy = jest.spyOn(console, "error").mockImplementation();
    jest.clearAllMocks();
    (RegistryLoader.load as jest.Mock).mockReturnValue({
      stacks: {
        "nodejs": {
          "defaultSkills": ["tlc-spec-driven"],
          "ruleTemplateFile": "rules/node-rules.md",
          "linterDependencies": ["eslint"]
        }
      },
      skills: {},
      agents: {
        "cursor": {
          "ruleFile": ".cursorrules",
          "strategy": "reference"
        }
      },
      ides: {}
    });
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
  });

  it("should orchestrate without crashing for a basic node stack using resolved WorkspaceConfig", async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue("mocked-content");
    (fs.cpSync as jest.Mock).mockImplementation(() => {});
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});

    const orchestrator = new WorkspaceService();

    const resolvedConfig: WorkspaceConfig = {
      stacks: [SupportedStack.NODEJS],
      agents: [AiAgent.CURSOR],
      ide: "none",
      lint: false,
      skills: { include: ["tlc-spec-driven"], exclude: [] },
      linterDependencies: ["eslint"],
      ruleTemplates: { [SupportedStack.NODEJS]: "node-rules.md" }
    };

    await expect(orchestrator.execute("/fake/dir", resolvedConfig)).resolves.not.toThrow();
  });

  it("should expose hasLocalConfig returning false when file does not exist", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    const orchestrator = new WorkspaceService();
    expect(orchestrator.hasLocalConfig("/fake/dir")).toBe(false);
  });

  it("should expose hasLocalConfig returning true when sdd.config.json exists", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    const orchestrator = new WorkspaceService();
    expect(orchestrator.hasLocalConfig("/fake/dir")).toBe(true);
  });
});
