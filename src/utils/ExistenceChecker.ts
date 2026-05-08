import fs from "fs";
import path from "path";
import { RegistryLoader } from "../resources/RegistryLoader";

export class ExistenceChecker {
  /**
   * Checks if a tool is already installed in the given project directory.
   * It verifies the presence of configuration files or package.json dependencies.
   * 
   * @param toolName The name of the tool (key in tools.json)
   * @param projectDir The root directory of the project
   * @returns boolean indicating if the tool is installed
   */
  public static isAlreadyInstalled(toolName: string, projectDir: string): boolean {
    const registry = RegistryLoader.load();
    const toolDef = registry.tools?.[toolName];
    
    if (!toolDef) {
      return false;
    }

    // 1. Check if any config file exists
    if (toolDef.configFiles && toolDef.configFiles.length > 0) {
      for (const configFile of toolDef.configFiles) {
        const configPath = path.join(projectDir, configFile);
        if (fs.existsSync(configPath)) {
          return true;
        }
      }
    }

    // 2. Check package.json for dependencies
    if (toolDef.dependencies && toolDef.dependencies.length > 0) {
      const packageJsonPath = path.join(projectDir, "package.json");
      if (fs.existsSync(packageJsonPath)) {
        try {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
          const allDeps = {
            ...(packageJson.dependencies || {}),
            ...(packageJson.devDependencies || {})
          };
          
          for (const dep of toolDef.dependencies) {
            if (allDeps[dep]) {
              return true;
            }
          }
        } catch (error) {
          // Silently ignore package.json parsing errors
        }
      }
    }

    return false;
  }
}
