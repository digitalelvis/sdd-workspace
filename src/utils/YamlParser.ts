import fs from "fs";
import path from "path";
import yaml from "js-yaml";

/**
 * YamlParser — thin infrastructure wrapper for YAML file I/O.
 * All YAML serialization/deserialization passes through here (SRP).
 */
export class YamlParser {
  /**
   * Reads and parses a YAML file. Returns null if the file does not exist.
   * Throws on malformed YAML.
   */
  public static read<T>(filePath: string): T | null {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    return yaml.load(raw) as T;
  }

  /**
   * Serializes an object to YAML and writes it to disk.
   * Creates intermediate directories if they do not exist.
   */
  public static write(filePath: string, data: unknown): void {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const content = yaml.dump(data, { indent: 2, lineWidth: 120, noRefs: true });
    fs.writeFileSync(filePath, content, "utf-8");
  }
}
