import fs from "fs";
import path from "path";
import chalk from "chalk";
import { IdeProvider } from "../../../domain/contracts/IdeProvider";
import { IdeEnvironment } from "../../../domain/enums/IdeEnvironment";

export class AntigravityIdeProvider implements IdeProvider {
  readonly ide = IdeEnvironment.ANTIGRAVITY;

  setupIdeConfig(targetDir: string, _options?: any): void {
    const configDir = path.join(targetDir, ".antigravity");
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    console.log(chalk.green(`✔️  Prepared Antigravity local workspace config at .antigravity/`));
  }
}
