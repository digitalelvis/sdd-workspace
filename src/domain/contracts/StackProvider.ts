import { SupportedStack } from "../enums/SupportedStack";

export interface SetupOptions {
  skipLint: boolean;
  linterDependencies?: string[];
}

export interface StackProvider {
  /**
   * The framework enum that this provider supports.
   */
  readonly stack: SupportedStack;

  /**
   * Sets up the physical ecosystem for the stack (installing linters, formatters, etc.)
   * @param targetDir The absolute path of the user's workspace
   * @param options Execution configurations
   */
  setupEcosystem(targetDir: string, options: SetupOptions): void;
}
