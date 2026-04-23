import { BaseStackProvider } from "./BaseStackProvider";
import { SupportedStack } from "../../../domain/enums/SupportedStack";
import { SetupOptions } from "../../../domain/contracts/StackProvider";
import chalk from "chalk";

export class AIStackProvider extends BaseStackProvider {
  readonly stack = SupportedStack.AI_GENERIC;

  public override setupEcosystem(targetDir: string, options: SetupOptions): void {
    console.log(chalk.blue(`\n📥 Configuring ${this.stack.toUpperCase()} environment...`));
    console.log(chalk.gray(`    Skipping strict tool installation for AI-first project.`));
    // No-op for tool installation
  }
}
