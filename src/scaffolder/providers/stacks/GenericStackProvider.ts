import { BaseStackProvider } from "./BaseStackProvider";
import { SupportedStack } from "../../../domain/enums/SupportedStack";
import { StackDefinition } from "../../../domain/contracts/SkillRegistry";

export class GenericStackProvider extends BaseStackProvider {
  constructor(
    public readonly stack: SupportedStack,
    private readonly definition: StackDefinition
  ) {
    super();
  }

  // Override or use methods from BaseStackProvider
}
