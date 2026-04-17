import { IdeEnvironment } from "../enums/IdeEnvironment";

export interface IdeProvider {
  /**
   * The string identifier for the IDE (e.g., 'vscode', 'cursor', 'windsurf')
   */
  readonly ide: IdeEnvironment;

  /**
   * Sets up any local physical configurations for the IDE in the workspace
   * (e.g. creating .vscode/settings.json, recommended extensions)
   * 
   * @param targetDir The root workspace directory
   * @param options General setup options
   */
  setupIdeConfig(targetDir: string, options?: any): void;
}
