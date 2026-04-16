import path from "path";
import fs from "fs";
import chalk from "chalk";
import { IdeProvider } from "../../../domain/contracts/IdeProvider";
import { AiTool } from "../../../domain/enums/AiTool";

export class VSCodeProvider implements IdeProvider {
  readonly tool = AiTool.VSCODE;

  injectSkill(targetDir: string, skillSourceDir: string): void {
    const destPath = path.join(
      targetDir,
      ".github",
      "copilot-instructions",
      "tlc-spec-driven",
    );
    try {
      fs.cpSync(skillSourceDir, destPath, { recursive: true, force: true });
      console.log(
        chalk.magenta(
          `  ↳ Installed skills for ${chalk.bold(this.tool)} at ${destPath.replace(targetDir, "")}`,
        ),
      );
    } catch (error) {
      console.error(
        chalk.red(`  ↳ Failed to install skills for ${this.tool}`),
        error,
      );
    }
  }
}
