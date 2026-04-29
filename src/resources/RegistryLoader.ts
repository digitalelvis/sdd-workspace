import fs from "fs";
import path from "path";
import { SkillRegistryCatalog } from "../domain/contracts/SkillRegistry";
import { ResourcePathUtils } from "../utils/ResourcePathUtils";

/**
 * RegistryLoader — Centralizes access to the registry.json resource.
 */
export class RegistryLoader {
  private static registryPath: string = "";

  public static load(): SkillRegistryCatalog {
    const catalog: SkillRegistryCatalog = {
      skills: {},
      rules: {},
      stacks: {},
      agents: {},
      ides: {},
      databases: {},
      tools: {}
    };

    try {
      const registryDir = path.join(this.getPath(), "registry");
      if (fs.existsSync(registryDir)) {
        const files = fs.readdirSync(registryDir).filter(f => f.endsWith(".json"));
        for (const file of files) {
          const filePath = path.join(registryDir, file);
          const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
          
          // Merge based on filename or just shallow merge if structure matches
          const key = path.basename(file, ".json");
          if (key in catalog) {
             (catalog as any)[key] = { ...(catalog as any)[key], ...content };
          }
        }
      } else {
        // Fallback for when registry directory doesn't exist (legacy support during transition)
        const legacyPath = path.join(this.getPath(), "registry.json");
        if (fs.existsSync(legacyPath)) {
          const legacyContent = JSON.parse(fs.readFileSync(legacyPath, "utf-8"));
          return { ...catalog, ...legacyContent };
        }
      }
      return catalog;
    } catch (error) {
      console.error(`❌ Failed to load registry from ${this.registryPath}:`, error);
      return catalog;
    }
  }

  private static getPath(): string {
    return ResourcePathUtils.getResourcesPath();
  }
}
