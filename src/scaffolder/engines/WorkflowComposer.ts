import fs from "fs";
import path from "path";
import chalk from "chalk";
import { WorkspaceConfig } from "../../config/ConfigSchema";

export class WorkflowComposer {
  /**
   * Composes and saves a tailored GitHub Actions CI/CD workflow.
   */
  public compose(targetDir: string, resolved: WorkspaceConfig): void {
    const cicdDestDir = path.join(targetDir, ".github", "workflows");
    const cicdDestFile = path.join(cicdDestDir, "ci-sdd.yml");

    // Check if the exact target file already exists to prevent overwrite
    if (fs.existsSync(cicdDestFile)) {
      console.log(chalk.yellow(`ℹ️  CI/CD workflow file ci-sdd.yml already exists. Skipping generation.`));
      return;
    }

    // Compose dynamic steps based on resolved configuration
    const hasLint = resolved.lint !== false && resolved.resolvedTools && (
      resolved.resolvedTools["eslint"] || resolved.resolvedTools["prettier"]
    );

    const hasTest = resolved.resolvedTools && (
      resolved.resolvedTools["jest"] || resolved.resolvedTools["vitest"]
    );

    let yaml = `name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
`;

    if (hasLint) {
      yaml += `      - name: Lint\n        run: npm run lint\n`;
    }

    if (hasTest) {
      yaml += `      - name: Test\n        run: npm test\n`;
    }

    yaml += `      - name: Build\n        run: npm run build --if-present\n`;

    // Ensure the directory exists
    if (!fs.existsSync(cicdDestDir)) {
      fs.mkdirSync(cicdDestDir, { recursive: true });
    }

    fs.writeFileSync(cicdDestFile, yaml, "utf-8");
    console.log(chalk.green(`✔️  Generated GitHub Actions CI/CD workflow at .github/workflows/ci-sdd.yml`));
  }
}
