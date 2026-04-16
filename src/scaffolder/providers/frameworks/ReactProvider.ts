import { BaseFrameworkProvider } from "./BaseFrameworkProvider";
import { SupportedFramework } from "../../../domain/enums/SupportedFramework";

export class ReactProvider extends BaseFrameworkProvider {
  readonly framework = SupportedFramework.REACT;

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
