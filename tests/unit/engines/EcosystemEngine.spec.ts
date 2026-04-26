import fs from "fs";
import { EcosystemEngine } from "../../../src/scaffolder/engines/EcosystemEngine";
import { RegistryLoader } from "../../../src/resources/RegistryLoader";

jest.mock("fs");
jest.mock("../../../src/resources/RegistryLoader");

describe("EcosystemEngine - Registry-Driven IDE Setup", () => {
  let ecosystemEngine: EcosystemEngine;
  let logSpy: jest.SpyInstance;

  const mockRegistry = {
    ides: {
      "vscode": {
        "configDir": ".vscode",
        "files": [
          { "template": "lint/vscode-settings.json", "target": "settings.json" }
        ]
      },
      "custom-ide": {
        "configDir": ".custom"
      }
    },
    skills: {},
    stacks: {},
    agents: {}
  };

  beforeEach(() => {
    jest.clearAllMocks();
    logSpy = jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "warn").mockImplementation();
    ecosystemEngine = new EcosystemEngine();
    (RegistryLoader.load as jest.Mock).mockReturnValue(mockRegistry);
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it("should create config directory for the selected IDE", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    
    ecosystemEngine.setup("/target/dir", [], "vscode", { skipLint: false });

    expect(fs.mkdirSync).toHaveBeenCalledWith(
      expect.stringContaining(".vscode"),
      expect.objectContaining({ recursive: true })
    );
  });

  it("should provision files if defined in the registry", () => {
    (fs.existsSync as jest.Mock).mockImplementation((p: string) => {
      if (p.includes("lint/vscode-settings.json")) return true;
      return false;
    });
    
    ecosystemEngine.setup("/target/dir", [], "vscode", { skipLint: false });

    expect(fs.copyFileSync).toHaveBeenCalledWith(
      expect.stringContaining("lint/vscode-settings.json"),
      expect.stringContaining(".vscode/settings.json")
    );
  });

  it("should skip provisioning if IDE is not in registry", () => {
    ecosystemEngine.setup("/target/dir", [], "unknown-ide", { skipLint: false });
    expect(fs.mkdirSync).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("No registry definition found for IDE"));
  });
});
