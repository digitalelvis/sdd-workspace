import fs from "fs";
import path from "path";
import chalk from "chalk";
import { IdeProvider } from "../../../domain/contracts/IdeProvider";
import { IdeEnvironment } from "../../../domain/enums/IdeEnvironment";

export class CursorIdeProvider implements IdeProvider {
  readonly ide = IdeEnvironment.CURSOR;

  setupIdeConfig(targetDir: string, _options?: any): void {
    const configDir = path.join(targetDir, ".cursor");
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    console.log(chalk.green(`✔️  Prepared Cursor local workspace config at .cursor/`));
  }
}
