import fs from 'fs';
import path from 'path';

export type SupportedFramework = 'nextjs' | 'react' | 'nodejs';

export function detectFramework(targetDir: string): SupportedFramework {
  const packageJsonPath = path.join(targetDir, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    // If there is no package.json in the current dir, default to nodejs
    return 'nodejs';
  }

  try {
    const pkgContent = fs.readFileSync(packageJsonPath, 'utf-8');
    const pkg = JSON.parse(pkgContent);

    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    // Detection priority matters: Next.js implies React, so check Next first.
    if (deps['next']) {
      return 'nextjs';
    }

    // Checking for a pure React/Vite environment
    if (deps['react']) {
      return 'react';
    }

    // Default fallback
    return 'nodejs';
  } catch (error) {
    console.warn('⚠️ Could not parse package.json. Defaulting to general Node.js rules.', error);
    return 'nodejs';
  }
}
