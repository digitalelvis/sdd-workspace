import fs from "fs";
import path from "path";
import { SupportedDatabase } from "../domain/enums/SupportedDatabase";

export function detectDatabase(targetDir: string): SupportedDatabase[] {
  const pkgPath = path.join(targetDir, "package.json");
  const detected: SupportedDatabase[] = [];

  if (!fs.existsSync(pkgPath)) return detected;

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    // PostgreSQL
    if (deps["pg"] || deps["postgres"] || deps["@prisma/client"]?.includes("postgresql")) {
      detected.push(SupportedDatabase.POSTGRES);
    }

    // MongoDB
    if (deps["mongodb"] || deps["mongoose"]) {
      detected.push(SupportedDatabase.MONGODB);
    }

    // MySQL
    if (deps["mysql"] || deps["mysql2"]) {
      detected.push(SupportedDatabase.MYSQL);
    }

    // SQLite
    if (deps["sqlite3"] || deps["better-sqlite3"]) {
      detected.push(SupportedDatabase.SQLITE);
    }

    // Redis
    if (deps["redis"] || deps["ioredis"]) {
      detected.push(SupportedDatabase.REDIS);
    }

    // Supabase
    if (deps["@supabase/supabase-js"]) {
      detected.push(SupportedDatabase.SUPABASE);
    }

    // Firebase
    if (deps["firebase"] || deps["firebase-admin"]) {
      detected.push(SupportedDatabase.FIREBASE);
    }
  } catch (e) {
    // Silent fail
  }

  return Array.from(new Set(detected));
}
