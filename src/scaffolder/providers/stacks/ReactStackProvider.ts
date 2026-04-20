import { BaseStackProvider } from "./BaseStackProvider";
import { SupportedStack } from "../../../domain/enums/SupportedStack";

export class ReactStackProvider extends BaseStackProvider {
  readonly stack = SupportedStack.REACT;
}
