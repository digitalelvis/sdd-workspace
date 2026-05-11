import chalk, { Chalk } from "chalk";
import { isColorDisabled } from "./terminalCapabilities";

/**
 * Centralized terminal color palette.
 */
export class TerminalTheme {
  private readonly c: Chalk;

  constructor() {
    this.c = isColorDisabled() ? new chalk.Instance({ level: 0 }) : chalk;
  }

  primary(text: string): string {
    return this.c.cyan.bold(text);
  }

  accent(text: string): string {
    return this.c.cyan(text);
  }

  success(text: string): string {
    return this.c.green.bold(text);
  }

  successDim(text: string): string {
    return this.c.green(text);
  }

  warning(text: string): string {
    return this.c.yellow(text);
  }

  warningBold(text: string): string {
    return this.c.yellow.bold(text);
  }

  error(text: string): string {
    return this.c.red.bold(text);
  }

  errorDim(text: string): string {
    return this.c.red(text);
  }

  muted(text: string): string {
    return this.c.gray(text);
  }

  plain(text: string): string {
    return this.c.white(text);
  }

  key(text: string): string {
    return this.c.cyan.bold(text);
  }

  keySuccess(text: string): string {
    return this.c.green.bold(text);
  }

  keyWarn(text: string): string {
    return this.c.yellow.bold(text);
  }
}
