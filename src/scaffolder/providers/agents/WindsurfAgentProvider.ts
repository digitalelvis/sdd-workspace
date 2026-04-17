import path from "path";
import fs from "fs";
import chalk from "chalk";
import { AgentProvider } from "../../../domain/contracts/AgentProvider";
import { AiAgent } from "../../../domain/enums/AiAgent";

export class WindsurfAgentProvider implements AgentProvider {
  readonly agent = AiAgent.WINDSURF;

  injectRules(
    targetDir: string,
    mainRuleContent: string,
    stackRuleContent: string,
  ): void {
    const rulesPath = path.join(targetDir, ".windsurfrules");
    const combinedContent = `${mainRuleContent}\n\n${stackRuleContent}`;
    fs.writeFileSync(rulesPath, combinedContent);

    console.log(
      chalk.green(
        `  ↳ Intercepted AI guidelines into ${rulesPath.replace(targetDir, "")}`,
      ),
    );
  }
}
