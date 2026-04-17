import path from "path";
import fs from "fs";
import chalk from "chalk";
import { AgentProvider } from "../../../domain/contracts/AgentProvider";
import { AiAgent } from "../../../domain/enums/AiAgent";

export class AntigravityAgentProvider implements AgentProvider {
  readonly agent = AiAgent.ANTIGRAVITY;

  injectRules(
    targetDir: string,
    mainRuleContent: string,
    stackRuleContent: string,
  ): void {
    const rulesDir = path.join(targetDir, ".agent", "rules");
    const rulesPath = path.join(rulesDir, "rule.md");
    
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
