import fs from "fs";
import path from "path";
import chalk from "chalk";
import { execSync } from "child_process";
import {
  StackProvider,
  SetupOptions,
} from "../../../domain/contracts/StackProvider";
import { SupportedStack } from "../../../domain/enums/SupportedStack";
import { ExistenceChecker } from "../../../utils/ExistenceChecker";
import { RegistryLoader } from "../../../resources/RegistryLoader";

export abstract class BaseStackProvider implements StackProvider {
  abstract readonly stack: SupportedStack;

  public setupEcosystem(targetDir: string, options: SetupOptions): void {
    if (options.skipLint) {
      console.log(
        chalk.yellow(
          `⚠️  Skipping strict Linter/Prettier setup due to --no-lint flag.`,
        ),
      );
      return;
    }

    console.log(
      chalk.blue(
        `\n📥 Configuring ${this.stack.toUpperCase()} Linter and Prettier rules...`,
      ),
    );

    const depsToInstall: string[] = [];
    const installedTools = new Set<string>();

    for (const dep of (options.linterDependencies || [])) {
      const toolName = dep.startsWith('@') ? dep.split('@').slice(0, 2).join('@') : dep.split('@')[0];
      if (ExistenceChecker.isAlreadyInstalled(toolName, targetDir)) {
        installedTools.add(toolName);
      } else {
        depsToInstall.push(dep);
      }
    }

    if (installedTools.size > 0) {
      console.log(chalk.yellow(`ℹ️  Skipping installation of already present tools: ${Array.from(installedTools).join(', ')}`));
    }

    this.injectConfigTemplates(targetDir, installedTools);
    this.updatePackageJson(targetDir);
    this.installDependencies(targetDir, depsToInstall);
  }

  private injectConfigTemplates(targetDir: string, installedTools: Set<string>): void {
    const basePath = __dirname.includes("dist")
      ? path.join(__dirname, "..", "..", "..", "src", "resources")
      : path.join(__dirname, "..", "..", "..", "resources");

    const lintSourceDir = path.join(basePath, "lint", this.stack);

    if (fs.existsSync(lintSourceDir)) {
      const registry = RegistryLoader.load();
      const skipFiles = new Set<string>();
      
      for (const tool of installedTools) {
        const def = registry.tools?.[tool];
        if (def && def.configFiles) {
          def.configFiles.forEach(f => skipFiles.add(f));
        }
      }

      fs.cpSync(lintSourceDir, targetDir, { 
        recursive: true, 
        force: false,
        errorOnExist: false,
        filter: (src) => {
          const fileName = path.basename(src);
          if (fs.lstatSync(src).isDirectory()) return true;
          return !skipFiles.has(fileName);
        }
      });
      console.log(
        chalk.green(
          `✔️  Injected strict ecosystem templates for ${this.stack}.`,
        ),
      );
    } else {
      console.warn(
        chalk.yellow(`⚠️ Could not locate lint templates at ${lintSourceDir}`),
      );
    }
  }

  private updatePackageJson(targetDir: string): void {
    const pkgPath = path.join(targetDir, "package.json");
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
        pkg.scripts = pkg.scripts || {};

        let modified = false;
        if (!pkg.scripts["lint"]) {
          pkg.scripts["lint"] = "eslint .";
          modified = true;
        }
        if (!pkg.scripts["format"]) {
          pkg.scripts["format"] = "prettier --write .";
          modified = true;
        }

        if (modified) {
          fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), "utf8");
          console.log(
            chalk.green(
              `✔️  Updated package.json with "lint" and "format" scripts.`,
            ),
          );
        }
      } catch (e) {
        console.error(chalk.red(`❌ Failed to parse package.json: ${e}`));
      }
    }
  }

  private installDependencies(targetDir: string, deps: string[]): void {
    if (deps.length > 0) {
      console.log(
        chalk.cyan(
          `📦 Installing missing dev dependencies: ${deps.join(", ")}...`,
        ),
      );
      try {
        execSync(`npm install --save-dev ${deps.join(" ")}`, {
          stdio: "ignore",
          cwd: targetDir,
        });
        console.log(
          chalk.green(
            `✔️  Successfully installed strict standard dependencies.`,
          ),
        );
      } catch (error) {
        console.warn(
          chalk.yellow(
            `⚠️ Command "npm install" failed. Please run manually: npm install --save-dev ${deps.join(" ")}`,
          ),
        );
      }
    }
  }
}
