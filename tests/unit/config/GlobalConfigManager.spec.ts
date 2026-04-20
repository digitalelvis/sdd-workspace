import fs from "fs";
import path from "path";
import os from "os";
import { GlobalConfigManager } from "../../../src/config/GlobalConfigManager";

jest.mock("fs");

describe("Config - GlobalConfigManager", () => {
  const mockPath = "/fake/home/.sddrc.json";
  let manager: GlobalConfigManager;

  beforeEach(() => {
    manager = new GlobalConfigManager(mockPath);
    jest.clearAllMocks();
  });

  it("should load empty config if file does not exist", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    const config = manager.load();
    expect(config).toEqual({});
  });

  it("should load config successfully from file", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({ defaults: { ide: "vscode" } }));
    
    const config = manager.load();
    expect(config.defaults?.ide).toBe("vscode");
  });

  it("should save config to disk creating directory if needed", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false); // dir doesn't exist
    
    manager.save({ defaults: { ide: "cursor" } });

    expect(fs.mkdirSync).toHaveBeenCalledWith(path.dirname(mockPath), { recursive: true });
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      mockPath,
      expect.stringContaining('"ide": "cursor"'),
      "utf-8"
    );
  });

  it("should dot-set a value into a deep object", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    
    manager.set("defaults.agents", ["antigravity"]);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      mockPath,
      expect.stringContaining('"agents": [\n      "antigravity"\n    ]'),
      "utf-8"
    );
  });

  it("should dot-get a deep value", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({ 
      defaults: { ide: "cursor" },
      skills: { add: ["test-skill"] }
    }));

    expect(manager.get("defaults.ide")).toBe("cursor");
    expect(manager.get("skills.add")).toEqual(["test-skill"]);
    expect(manager.get("non.existent")).toBeUndefined();
  });
});
