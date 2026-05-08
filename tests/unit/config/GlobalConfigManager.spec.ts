import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { GlobalConfigManager } from "../../../src/config/GlobalConfigManager";

jest.mock("fs");
jest.mock("js-yaml");

describe("Config - GlobalConfigManager", () => {
  const mockPath = "/fake/home/.sddrc.yml";
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

  it("should load config successfully from YAML file", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue("defaults:\n  ide: vscode\n");
    (yaml.load as jest.Mock).mockReturnValue({ defaults: { ide: "vscode" } });

    const config = manager.load();
    expect(config.defaults?.ide).toBe("vscode");
  });

  it("should save config to disk creating directory if needed", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (yaml.dump as jest.Mock).mockReturnValue("defaults:\n  ide: cursor\n");

    manager.save({ defaults: { ide: "cursor" } });

    expect(fs.mkdirSync).toHaveBeenCalledWith(path.dirname(mockPath), { recursive: true });
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      mockPath,
      expect.any(String),
      "utf-8",
    );
  });

  it("should dot-set a value into a deep object", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (yaml.load as jest.Mock).mockReturnValue({});
    (yaml.dump as jest.Mock).mockReturnValue("defaults:\n  agents:\n    - antigravity\n");

    manager.set("defaults.agents", ["antigravity"]);

    expect(fs.writeFileSync).toHaveBeenCalledWith(mockPath, expect.any(String), "utf-8");
  });

  it("should dot-get a deep value", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue("defaults:\n  ide: cursor\n");
    (yaml.load as jest.Mock).mockReturnValue({
      defaults: { ide: "cursor" },
      skills: { add: ["test-skill"] },
    });

    expect(manager.get("defaults.ide")).toBe("cursor");
    expect(manager.get("skills.add")).toEqual(["test-skill"]);
    expect(manager.get("non.existent")).toBeUndefined();
  });
});
