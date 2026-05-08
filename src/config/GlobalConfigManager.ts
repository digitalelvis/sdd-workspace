import os from "os";
import path from "path";
import { GlobalUserConfig } from "./ConfigSchema";
import { GLOBAL_CONFIG_FILENAME } from "./defaults";
import { YamlParser } from "../utils/YamlParser";

export class GlobalConfigManager {
  private readonly configPath: string;

  constructor(customPath?: string) {
    this.configPath = customPath ?? path.join(os.homedir(), GLOBAL_CONFIG_FILENAME);
  }

  /**
   * Loads the global configuration from ~/.sddrc.yml.
   * Returns empty defaults if the file doesn't exist.
   */
  public load(): GlobalUserConfig {
    try {
      return YamlParser.read<GlobalUserConfig>(this.configPath) ?? {};
    } catch {
      console.warn(`⚠️  Failed to parse global config at ${this.configPath}. Using defaults.`);
      return {};
    }
  }

  /**
   * Saves the provided config object to disk as YAML.
   */
  public save(config: GlobalUserConfig): void {
    YamlParser.write(this.configPath, config);
  }

  /**
   * Sets a value in the global config using a dot-notated key path.
   * Example: 'defaults.ide', 'skills.add'
   */
  public set(keyPath: string, value: unknown): void {
    const config = this.load();
    const keys = keyPath.split(".");
    let cursor: Record<string, unknown> = config as Record<string, unknown>;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!cursor[key] || typeof cursor[key] !== "object") {
        cursor[key] = {};
      }
      cursor = cursor[key] as Record<string, unknown>;
    }

    cursor[keys[keys.length - 1]] = value;
    this.save(config);
  }

  /**
   * Retrieves a value from the global config using a dot-notated key path.
   */
  public get(keyPath: string): unknown {
    const config = this.load();
    const keys = keyPath.split(".");
    let cursor: unknown = config;

    for (const key of keys) {
      if (cursor === null || cursor === undefined || typeof cursor !== "object") {
        return undefined;
      }
      cursor = (cursor as Record<string, unknown>)[key];
    }

    return cursor;
  }

  public getConfigPath(): string {
    return this.configPath;
  }
}
