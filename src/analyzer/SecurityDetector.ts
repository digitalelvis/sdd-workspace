import fs from "fs";
import path from "path";

export function detectSecurity(targetDir: string): string[] {
  const pkgPath = path.join(targetDir, "package.json");
  const detected: string[] = [];

  if (!fs.existsSync(pkgPath)) return detected;

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    // Common security packages
    if (deps["helmet"]) detected.push("helmet");
    if (deps["cors"]) detected.push("cors");
    if (deps["csurf"]) detected.push("csurf");
    if (deps["bcrypt"] || deps["bcryptjs"]) detected.push("bcrypt");
    if (deps["jsonwebtoken"]) detected.push("jwt");
    if (deps["dotenv"]) detected.push("dotenv");

    // Check for specific security tools
    if (deps["snyk"]) detected.push("snyk");
    if (deps["eslint-plugin-security"]) detected.push("eslint-security");
  } catch (e) {
    // Silent fail
  }

  return Array.from(new Set(detected));
}
