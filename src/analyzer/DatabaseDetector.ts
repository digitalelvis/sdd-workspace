import fs from "fs";
import path from "path";
import { SupportedDatabase } from "../domain/enums/SupportedDatabase";
import { DatabaseDefinition } from "../domain/contracts/SkillRegistry";

export function detectDatabase(targetDir: string, databaseRegistry: Record<string, DatabaseDefinition>): SupportedDatabase[] {
  const pkgPath = path.join(targetDir, "package.json");
  const detected: SupportedDatabase[] = [];

  const pkgExists = fs.existsSync(pkgPath);
  let deps: Record<string, string> = {};

  if (pkgExists) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      deps = { ...pkg.dependencies, ...pkg.devDependencies };
    } catch (e) {
      // Ignore parse errors
    }
  }

  for (const [id, def] of Object.entries(databaseRegistry)) {
    // Check by Dependencies
    if (def.detectionDeps && def.detectionDeps.some(dep => deps[dep])) {
      detected.push(id as SupportedDatabase);
      continue;
    }

    // Check by Files
    if (def.detectionFiles && def.detectionFiles.some(file => fs.existsSync(path.join(targetDir, file)))) {
      detected.push(id as SupportedDatabase);
      continue;
    }
  }

  return Array.from(new Set(detected));
}
