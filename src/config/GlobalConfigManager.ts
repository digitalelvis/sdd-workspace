import fs from "fs";
import path from "path";
import os from "os";
import { GlobalUserConfig } from "./ConfigSchema";
import { GLOBAL_CONFIG_FILENAME } from "./defaults";

export class GlobalConfigManager {
  private configPath: string;

  constructor(customPath?: string) {
    this.configPath = customPath || path.join(os.homedir(), GLOBAL_CONFIG_FILENAME);
  }

  /**
   * Loads the global configuration from ~/.sddrc.json.
   * Returns empty defaults if the file doesn't exist.
   */
  public load(): GlobalUserConfig {
    if (!fs.existsSync(this.configPath)) {
      return {};
    }

    try {
      const content = fs.readFileSync(this.configPath, "utf-8");
      return JSON.parse(content) as GlobalUserConfig;
    } catch (error) {
      console.warn(`⚠️  Failed to parse global config at ${this.configPath}. Using defaults.`);
      return {};
    }
  }

  /**
   * Saves the provided config object to disk.
   */
  public save(config: GlobalUserConfig): void {
    const content = JSON.stringify(config, null, 2);
    const dir = path.dirname(this.configPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(this.configPath, content, "utf-8");
  }

  /**
   * Sets a specific value in the global config using a dot-notated path.
   * Example path: 'defaults.ide', 'skills.add'
   */
  public set(keyPath: string, value: any): void {
    const config = this.load();
    const keys = keyPath.split(".");
    let current: any = config;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key]) current[key] = {};
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
    this.save(config);
  }

  /**
   * Retrieves a value from the global config using a dot-notated path.
   */
  public get(keyPath: string): any {
    const config = this.load();
    const keys = keyPath.split(".");
    let current: any = config;

    for (const key of keys) {
      if (current === undefined || current === null) return undefined;
      current = current[key];
    }

    return current;
  }

  public getConfigPath(): string {
    return this.configPath;
  }
}
