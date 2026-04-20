import { BaseStackProvider } from "./BaseStackProvider";
import { SupportedStack } from "../../../domain/enums/SupportedStack";

export class NextJsStackProvider extends BaseStackProvider {
  readonly stack = SupportedStack.NEXTJS;
}
