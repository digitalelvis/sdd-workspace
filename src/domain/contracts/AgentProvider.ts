import { AiAgent } from "../enums/AiAgent";

export interface AgentProvider {
  /**
   * The AI agent constraint
   */
  readonly agent: AiAgent;

  /**
   * Injects the global and framework-specific rules to the standard IDE location.
   * @param targetDir The absolute path of the user's workspace
   * @param mainRuleContent The rule content acting as the main orchestrator (e.g., tlc-spec)
   * @param stackRuleContent The framework specific rule content
   */
  injectRules(
    targetDir: string,
    mainRuleContent: string,
    stackRuleContent: string,
  ): void;
}
