import { Command } from "commander";
import { makeInitCommand } from "./init";
import { makeApplyCommand } from "./apply";

/**
 * Registry to load and initialize all modular commands.
 */
export function registerCommands(program: Command): void {
  makeInitCommand(program);
  makeApplyCommand(program);
}
