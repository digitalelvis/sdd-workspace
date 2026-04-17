import { SupportedStack } from "../enums/SupportedStack";

export interface SetupOptions {
  skipLint: boolean;
}

export interface StackProvider {
  /**
   * The framework enum that this provider supports.
   */
  readonly stack: SupportedStack;

  /**
   * Default agent skills assigned for this specific Stack.
   */
  readonly defaultSkills: string[];

  /**
   * The markdown template name that brings baseline rules for this Stack.
   * e.g., 'node-rules.md'
   */
  readonly ruleTemplateFile: string;

  /**
   * Sets up the physical ecosystem for the stack (installing linters, formatters, etc.)
   * @param targetDir The absolute path of the user's workspace
   * @param options Execution configurations
   */
  setupEcosystem(targetDir: string, options: SetupOptions): void;
}
