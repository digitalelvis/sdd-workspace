import { BaseStackProvider } from "./BaseStackProvider";
import { SupportedStack } from "../../../domain/enums/SupportedStack";

export class NextJsStackProvider extends BaseStackProvider {
  readonly stack = SupportedStack.NEXTJS;
  readonly defaultSkills = ["tlc-spec-driven", "nextjs-best-practices", "nextjs-app-router-patterns", "react-best-practices"];
  readonly ruleTemplateFile = "next-rules.md";

  protected getLinterDependencies(): string[] {
    return [
      "eslint@8.56.0",
      "eslint-config-next",
      "prettier@3.1.0",
      "@typescript-eslint/parser",
      "@typescript-eslint/eslint-plugin",
    ];
  }
}
