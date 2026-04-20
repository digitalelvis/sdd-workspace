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
      }
    },
    stacks: {}
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

  it("should throw an error if common-rules.md is missing", async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    await expect(
      sddEngine.inject("/target/dir", [], [AiAgent.CURSOR], [])
    ).rejects.toThrow("common-rules.md not found");
  });

  it("should inject rules for selected agents", async () => {
    (fs.existsSync as jest.Mock).mockImplementation((filePath: string) => {
      return String(filePath).endsWith("common-rules.md");
    });
    (fs.readFileSync as jest.Mock).mockReturnValue("# Common Rules");
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    await sddEngine.inject("/target/dir", [new NodeStackProvider()], [AiAgent.CURSOR], ["tlc-spec-driven"]);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining(".cursorrules"),
      expect.stringContaining("# Common Rules")
    );
  });

  it("should execute CLI command for 'cli' mode skills from registry", async () => {
    (fs.existsSync as jest.Mock).mockImplementation((filePath: string) => {
      return String(filePath).endsWith("common-rules.md");
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
});
