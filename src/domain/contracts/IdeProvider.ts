import { AiTool } from "../enums/AiTool";

export interface IdeProvider {
  /**
   * The tool enum that this provider supports.
   */
  readonly tool: AiTool;

  /**
   * Injects the AI skill logic into the specific architecture of the IDE.
   * @param targetDir The absolute path of the user's workspace
   * @param skillSourceDir The path where the localized vendor skill lives
   */
  injectSkill(targetDir: string, skillSourceDir: string): void;
}
