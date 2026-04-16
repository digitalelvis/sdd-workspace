import { BaseFrameworkProvider } from "./BaseFrameworkProvider";
import { SupportedFramework } from "../../../domain/enums/SupportedFramework";

export class NextJsProvider extends BaseFrameworkProvider {
  readonly framework = SupportedFramework.NEXTJS;

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
