import fs from "fs";
import path from "path";
import chalk from "chalk";
import { LOCAL_CONFIG_FILENAME } from "../config/defaults";

/**
 * WorkspaceValidator — Checks if the current workspace is bootstrapped.
 * Verification based on AGENTS.md requirements.
 */
export class WorkspaceValidator {
  /**
   * Validates if the essential SDD directories and files exist.
   * Returns true if bootstrapped, false otherwise.
   */
  public static isBootstrapped(targetDir: string): boolean {
    const required = [
      path.join(targetDir, ".agents", "skills"),
      path.join(targetDir, ".specs"),
      path.join(targetDir, LOCAL_CONFIG_FILENAME),
    ];

    return required.every(p => fs.existsSync(p));
  }

  /**
   * Performs validation and logs a warning if not bootstrapped.
   */
  public static validateOrWarn(targetDir: string): void {
    if (!this.isBootstrapped(targetDir)) {
      console.warn(chalk.yellow("\n⚠️  Environment not fully bootstrapped."));
      console.warn(chalk.gray("   Run 'sdd init' to initialize the AI-friendly workspace.\n"));
    }
  }
}
