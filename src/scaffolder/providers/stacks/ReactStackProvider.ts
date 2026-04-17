import { BaseStackProvider } from "./BaseStackProvider";
import { SupportedStack } from "../../../domain/enums/SupportedStack";

export class ReactStackProvider extends BaseStackProvider {
  readonly stack = SupportedStack.REACT;
  readonly defaultSkills = ["tlc-spec-driven", "react-best-practices", "react-ui-patterns"];
  readonly ruleTemplateFile = "react-rules.md";

  protected getLinterDependencies(): string[] {
    return [
      "eslint@8.56.0",
      "prettier@3.1.0",
      "eslint-plugin-react",
      "eslint-plugin-react-hooks",
      "@typescript-eslint/parser",
      "@typescript-eslint/eslint-plugin",
    ];
  }
}
