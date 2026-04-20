import { BaseStackProvider } from "./BaseStackProvider";
import { SupportedStack } from "../../../domain/enums/SupportedStack";

export class NodeStackProvider extends BaseStackProvider {
  readonly stack = SupportedStack.NODEJS;
}
