import fs from "fs";
import path from "path";
import { SupportedStack } from "../domain/enums/SupportedStack";

export function detectFramework(targetDir: string): SupportedStack[] {
  const pkgPath = path.join(targetDir, "package.json");
  const detectedStacks: SupportedStack[] = [];

  if (fs.existsSync(pkgPath)) {
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
      
      if (deps["vue"]) {
        detectedStacks.push(SupportedStack.VUE);
      }
      
      // Always attach NodeJS as base if we have package.json for now
      detectedStacks.push(SupportedStack.NODEJS);
    } catch (e) {
      console.warn("⚠️ Could not parse package.json, defaulting to Node.js.");
      detectedStacks.push(SupportedStack.NODEJS);
    }
  } else {
    // If no package.json, we still want NODEJS as fallback for now 
    // (or we could change this later to be more strict)
    detectedStacks.push(SupportedStack.NODEJS);
  }


  // 2. Python Detection
  if (fs.existsSync(path.join(targetDir, "requirements.txt")) || 
      fs.existsSync(path.join(targetDir, "pyproject.toml")) ||
      fs.existsSync(path.join(targetDir, "setup.py"))) {
    detectedStacks.push(SupportedStack.PYTHON);
  }

  // 3. PHP & Laravel Detection
  if (fs.existsSync(path.join(targetDir, "composer.json"))) {
    detectedStacks.push(SupportedStack.PHP);
    if (fs.existsSync(path.join(targetDir, "artisan"))) {
      detectedStacks.push(SupportedStack.LARAVEL);
    }
  }

  // Ensure unique elements in case logic overlaps
  return Array.from(new Set(detectedStacks));
}


