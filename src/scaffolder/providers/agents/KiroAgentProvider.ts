import path from "path";
import fs from "fs";
import chalk from "chalk";
import { AgentProvider } from "../../../domain/contracts/AgentProvider";
import { AiAgent } from "../../../domain/enums/AiAgent";

export class KiroAgentProvider implements AgentProvider {
  readonly agent = AiAgent.KIRO;

  injectRules(
    targetDir: string,
    mainRuleContent: string,
    stackRuleContent: string,
  ): void {
    const rulesPath = path.join(targetDir, ".kirorules");
    const combinedContent = `${mainRuleContent}\n\n${stackRuleContent}`;
    fs.writeFileSync(rulesPath, combinedContent);

    console.log(
      chalk.green(
        `  ↳ Intercepted AI guidelines into ${rulesPath.replace(targetDir, "")}`,
      ),
    );
  }
}
