import fs from "fs";
import path from "path";
import chalk from "chalk";
import { IdeProvider } from "../../../domain/contracts/IdeProvider";
import { IdeEnvironment } from "../../../domain/enums/IdeEnvironment";

export class VSCodeIdeProvider implements IdeProvider {
  readonly ide = IdeEnvironment.VSCODE;

  setupIdeConfig(targetDir: string, _options?: any): void {
    const configDir = path.join(targetDir, ".vscode");
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    console.log(chalk.green(`✔️  Prepared VSCode local workspace config at .vscode/`));
  }
}
