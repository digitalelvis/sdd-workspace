import fs from "fs";
import { WorkspaceService } from "../../../src/scaffolder/WorkspaceService";
import { SupportedStack } from "../../../src/domain/enums/SupportedStack";
import { AiAgent } from "../../../src/domain/enums/AiAgent";
import { WorkspaceConfig } from "../../../src/config/ConfigSchema";

jest.mock("fs");

describe("Scaffolder - WorkspaceService", () => {
  let stdoutSpy: jest.SpyInstance;
  let stderrSpy: jest.SpyInstance;

  beforeEach(() => {
    stdoutSpy = jest.spyOn(console, "log").mockImplementation();
    stderrSpy = jest.spyOn(console, "error").mockImplementation();
    jest.clearAllMocks();
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
  });

  it("should orchestrate without crashing for a basic node stack using resolved WorkspaceConfig", () => {
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
    };

    expect(() => {
      orchestrator.execute("/fake/dir", resolvedConfig);
    }).not.toThrow();
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
