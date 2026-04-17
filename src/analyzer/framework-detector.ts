import fs from "fs";
import path from "path";
import { SupportedStack } from "../domain/enums/SupportedStack";

export function detectFramework(targetDir: string): SupportedStack[] {
  const pkgPath = path.join(targetDir, "package.json");
  const detectedStacks: SupportedStack[] = [];

  if (!fs.existsSync(pkgPath)) {
    detectedStacks.push(SupportedStack.NODEJS);
    return detectedStacks;
  }

  try {
    const pkgData = fs.readFileSync(pkgPath, "utf-8");
    const pkg = JSON.parse(pkgData);

    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    if (deps["next"]) {
      detectedStacks.push(SupportedStack.NEXTJS);
      detectedStacks.push(SupportedStack.REACT);
    } else if (deps["react"]) {
      detectedStacks.push(SupportedStack.REACT);
    }
    
    // Always attach NodeJS as base if we have package.json for now
    detectedStacks.push(SupportedStack.NODEJS);
  } catch (e) {
    console.warn("⚠️ Could not parse package.json, defaulting to Node.js.");
    detectedStacks.push(SupportedStack.NODEJS);
  }

  // Ensure unique elements in case logic overlaps
  return Array.from(new Set(detectedStacks));
}

