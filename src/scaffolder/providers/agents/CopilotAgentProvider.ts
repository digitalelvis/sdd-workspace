import path from "path";
import fs from "fs";
import chalk from "chalk";
import { AgentProvider } from "../../../domain/contracts/AgentProvider";
import { AiAgent } from "../../../domain/enums/AiAgent";

export class CopilotAgentProvider implements AgentProvider {
  readonly agent = AiAgent.COPILOT;

  injectRules(
    targetDir: string,
    mainRuleContent: string,
    stackRuleContent: string,
  ): void {
    const rulesDir = path.join(targetDir, ".github");
    const rulesPath = path.join(rulesDir, "copilot-instructions.md");
    
    if (!fs.existsSync(rulesDir)) {
      fs.mkdirSync(rulesDir, { recursive: true });
    }

    const combinedContent = `${mainRuleContent}\n\n${stackRuleContent}`;
    fs.writeFileSync(rulesPath, combinedContent);

    console.log(
      chalk.green(
        `  ↳ Intercepted AI guidelines into ${rulesPath.replace(targetDir, "")}`,
      ),
    );
  }
}
