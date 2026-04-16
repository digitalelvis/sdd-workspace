import { SupportedFramework } from "../enums/SupportedFramework";

export interface SetupOptions {
  skipLint: boolean;
}

export interface FrameworkProvider {
  /**
   * The framework enum that this provider supports.
   */
  readonly framework: SupportedFramework;

  /**
   * Sets up the ecosystem for the framework (installing linters, formatters, etc.)
   * @param targetDir The absolute path of the user's workspace
   * @param options Execution configurations
   */
  setupEcosystem(targetDir: string, options: SetupOptions): void;
}
