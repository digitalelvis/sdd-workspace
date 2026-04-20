import fs from "fs";
import path from "path";
import { SkillRegistryCatalog } from "../domain/contracts/SkillRegistry";

/**
 * RegistryLoader — Centralizes access to the registry.json resource.
 */
export class RegistryLoader {
  private static registryPath: string = "";

  private static getPath(): string {
    if (!this.registryPath) {
      // Resolve path for both dev and dist environments
      const basePath = __dirname.includes("dist")
        ? path.join(__dirname, "..", "..", "src", "resources")
        : path.join(__dirname, "..", "resources");
      
      this.registryPath = path.join(basePath, "registry.json");
    }
    return this.registryPath;
  }

  public static load(): SkillRegistryCatalog {
    try {
      const content = fs.readFileSync(this.getPath(), "utf-8");
      return JSON.parse(content) as SkillRegistryCatalog;
    } catch (error) {
      console.error(`❌ Failed to load registry from ${this.registryPath}:`, error);
      return { skills: {}, stacks: {} };
    }
  }
}
