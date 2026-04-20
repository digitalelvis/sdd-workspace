import { Command } from "commander";
import { applyAction } from "./action";
import { LOCAL_CONFIG_FILENAME } from "../../../config/defaults";

/**
 * Factory for the 'apply' command definition.
 */
export function makeApplyCommand(program: Command): void {
  program
    .command("apply")
    .description(`Re-apply the workspace configuration from ${LOCAL_CONFIG_FILENAME}`)
    .action(applyAction);
}
