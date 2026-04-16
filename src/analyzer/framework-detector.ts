import fs from "fs";
import path from "path";
import { SupportedFramework } from "../domain/enums/SupportedFramework";

export function detectFramework(targetDir: string): SupportedFramework {
  const pkgPath = path.join(targetDir, "package.json");
  if (!fs.existsSync(pkgPath)) {
    return SupportedFramework.NODEJS;
  }

  try {
    const pkgData = fs.readFileSync(pkgPath, "utf-8");
    const pkg = JSON.parse(pkgData);

    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    if (deps["next"]) {
      return SupportedFramework.NEXTJS;
    } else if (deps["react"]) {
      return SupportedFramework.REACT;
    }
  } catch (e) {
    console.warn("⚠️ Could not parse package.json, defaulting to Node.js.");
  }

  return SupportedFramework.NODEJS;
}
