import fs from "fs";
import path from "path";
import chalk from "chalk";
import { execSync } from "child_process";
import {
  FrameworkProvider,
  SetupOptions,
} from "../../../domain/contracts/FrameworkProvider";
import { SupportedFramework } from "../../../domain/enums/SupportedFramework";

export abstract class BaseFrameworkProvider implements FrameworkProvider {
  abstract readonly framework: SupportedFramework;

  protected abstract getLinterDependencies(): string[];

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
        `\n📥 Configuring ${this.framework.toUpperCase()} Linter and Prettier rules...`,
      ),
    );
    this.injectConfigTemplates(targetDir);
    this.updatePackageJson(targetDir);
    this.installDependencies(targetDir);
  }

  private injectConfigTemplates(targetDir: string): void {
    const basePath = __dirname.includes("dist")
      ? path.join(__dirname, "..", "..", "..", "src", "templates")
      : path.join(__dirname, "..", "..", "templates");

    const lintSourceDir = path.join(basePath, "lint", this.framework);

    if (fs.existsSync(lintSourceDir)) {
      fs.cpSync(lintSourceDir, targetDir, { recursive: true, force: true });
      console.log(
        chalk.green(
          `✔️  Injected strict .eslintrc.json and .prettierrc for ${this.framework}.`,
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
              `✔️  Updated package.json with \"lint\" and \"format\" scripts.`,
            ),
          );
        }
      } catch (e) {
        console.error(chalk.red(`❌ Failed to parse package.json: ${e}`));
      }
    }
  }

  private installDependencies(targetDir: string): void {
    const deps = this.getLinterDependencies();
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
