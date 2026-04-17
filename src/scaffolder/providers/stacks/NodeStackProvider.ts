import { BaseStackProvider } from "./BaseStackProvider";
import { SupportedStack } from "../../../domain/enums/SupportedStack";

export class NodeStackProvider extends BaseStackProvider {
  readonly stack = SupportedStack.NODEJS;
  readonly defaultSkills = ["tlc-spec-driven", "nodejs-best-practices", "nodejs-backend-patterns"];
  readonly ruleTemplateFile = "node-rules.md";

  protected getLinterDependencies(): string[] {
    return [
      "eslint@8.56.0",
      "prettier@3.1.0",
      "@typescript-eslint/parser",
      "@typescript-eslint/eslint-plugin",
    ];
  }
}
