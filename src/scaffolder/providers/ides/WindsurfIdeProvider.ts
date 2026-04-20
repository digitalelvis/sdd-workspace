import fs from "fs";
import path from "path";
import chalk from "chalk";
import { IdeProvider } from "../../../domain/contracts/IdeProvider";
import { IdeEnvironment } from "../../../domain/enums/IdeEnvironment";

export class WindsurfIdeProvider implements IdeProvider {
  readonly ide = IdeEnvironment.WINDSURF;

  setupIdeConfig(targetDir: string, _options?: any): void {
    const configDir = path.join(targetDir, ".windsurf");
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    console.log(chalk.green(`✔️  Prepared Windsurf local workspace config at .windsurf/`));
  }
}
