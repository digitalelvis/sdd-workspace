import { BaseFrameworkProvider } from "./BaseFrameworkProvider";
import { SupportedFramework } from "../../../domain/enums/SupportedFramework";

export class NodeProvider extends BaseFrameworkProvider {
  readonly framework = SupportedFramework.NODEJS;

  protected getLinterDependencies(): string[] {
    return [
      "eslint@8.56.0",
      "prettier@3.1.0",
      "@typescript-eslint/parser",
      "@typescript-eslint/eslint-plugin",
    ];
  }
}
